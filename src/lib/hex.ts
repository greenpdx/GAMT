/*
 * Hex.ts
 * The 3D hexagon code
 *  @author Shaun Savage
 */
import * as THREE from 'three';

import { Cell } from '../lib/cell';

export class Hex extends Cell {
    position: any;
    height: number;
    cylGeo: any;
    cell: any;
    size: number;
    lines: any;
    group: THREE.Group;
    topGeo: any;
    top: any;
    points: any;
    cyl: any;
    edgeMat: any;
    selected: boolean = false;
    hovered: boolean = false;
    mats: any;

    static readonly TAU = Math.PI * 2;
    static readonly SQRT3 = Math.sqrt(3);

    constructor(conf: any, data?: any, pos?: any) {
        super(data, pos.q, pos.r, pos.s);
        let n = Hex.findNeighbors({x:pos.q,y:pos.r,z:pos.s});
        this.neighbors = n;
        let h = 5;
        this.height = h;
        this.size = 25;
        this.mats = conf.mats;

        this.group = new THREE.Group();
        this.group.name = '';
        /* Make hex*/
        this.cylGeo = new THREE.CylinderGeometry(25,25,1,6,1,true);
        this.cyl = new THREE.Mesh(this.cylGeo, null);
        this.cyl.material = conf.mats;
        this.cyl.add(this.drawEdges(this.cylGeo));
        this.cyl['group'] = this.group;
        this.cyl.position.y = 0;
        this.cyl.name = 'cyl';
        //make top
        this.topGeo = new THREE.CylinderGeometry(25,0.01,10,6,1,true);
        this.top = new THREE.Mesh(this.topGeo, conf.mats[4]);
        this.top['group'] = this.group;
        this.top.position.y = h;
        this.top.name="top";

        this.group.add(this.cyl);
        this.group.add(this.top);
        this.group['cell'] = this;
        this.cell = this.group;

        if (pos.q != 0 || pos.r != 0 || pos.s != 0) {
            this.positionHex(pos.q, pos.s, pos.r );
        } else {
            this.grow(30);
        }
        data.subscribe(
            (evt) => { this.chgEvt(evt)},
            (err) => { console.log(err)},
            () => { console.log("DONE")}
        )

    }

    drawEdges(obj) {
        let edges = new THREE.EdgesGeometry(obj,1);
        let line = new THREE.LineSegments(edges, this.edgeMat);
        return line;
    }

    setHeight(h: number) {
        this.height = h;
        this.grow(h);
    }

    chgTop(color) {
        this.top.material = this.mats[color];
        this.top.material.needsUpdate = true;
    }

    chgEvt(evt) {
        let bob=1;
        switch(evt.action) {
        case 'select':
            this.selected = true;
            this.chgTop(3);
            break;
        case 'unselect':
            this.selected = false;
            this.chgTop(4);
            break;
        case 'hover':
            if (this.selected) {
                break;
            }
            this.hovered = true;
            this.chgTop(5);
            break;
        case 'unhover':
            if (this.selected) {
                break;
            }
            this.hovered = false;
            this.chgTop(4);
            break;
        case 'value':
        case 'wheel':
        default:
            //console.log(evt);
        }
    }

    static neighbor(loc,dir) {
        let n = {x:loc.x + Hex.directions[dir].x,
            y:loc.y + Hex.directions[dir].y,
            z:loc.z + Hex.directions[dir].z};
        return n;
    }

    static findNeighbors(loc) {
        let n = [];
        for (let i=0; i < Hex.directions.length; i++) {
            let d = Hex.neighbor(loc,i);
            n.push(d);
        }
        return n;
    }

    positionHex(q = 0, r = 0, s = 0) {
        this.cell.position.z = (q) * this.size * Hex.SQRT3 * (Hex.SQRT3 / 2);
        this.cell.position.x = (s - r) * this.size * (Hex.SQRT3 / 2);
    }

    // pre-computed permutations
    static directions = [{x:+1, y:-1, z:0}, {x:+1, y:0, z:-1}, {x:0, y:+1, z:-1},
                    {x:-1, y:+1, z:0}, {x:-1, y:0, z:+1}, {x:0, y:-1, z:+1}];

    //[new Cell(+1, -1, 0), new Cell(+1, 0, -1), new Cell(0, +1, -1),
    //                    new Cell(-1, +1, 0), new Cell(-1, 0, +1), new Cell(0, -1, +1)];
    static diagonals = [{x:+2, y:-1, z:-1}, {x:+1, y:+1, z:-2}, {x:-1, y:+2, z:-1},
                       {x:-2, y:+1, z:+1}, {x:-1, y:-1, z:+2}, {x:+1, y:-2, z:+1}];

    grow(h: number) {
        if (this.height + h < 1 ) {
            return this.height;
        }
        if (1==1) {
            //return;
        }
        let geo = this.top;
        geo.position.y = h - 5;

        let mesh = this.cyl;
        geo = mesh.geometry;
        geo.verticesNeedUpdate = true;
        let cverts = geo.vertices.slice(6, 12);

        this.height = h + this.height;
        for (let i = 0; i < 6; i++) {
            cverts[i].y = h + cverts[i].y;
        }
        // update edges
        mesh.remove(mesh.children[0]);
        mesh.add(this.drawEdges(mesh.geometry));

        return this.height;
    }
}
