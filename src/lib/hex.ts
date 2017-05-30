/*
 * Hex.ts
 * The 3D hexagon code
 *  @author Shaun Savage
 */
import * as THREE from 'three';

import { Cell } from '../lib/cell';

export class Hex extends Cell {
    geometry: THREE.Geometry;
    material: THREE.MeshLambertMaterial;
    position: any;
    height: number;
    shape: any;
    extdGeo: any;
    cell: any;
    size: number;
    geo: any;
    lines: any;
    group: THREE.Group;
    topGeo: any;
    top: any;
    points: any;
    extdMesh: any;
    edgeMat: any;

    static readonly TAU = Math.PI * 2;
    static readonly SQRT3 = Math.sqrt(3);

    constructor(id = null, q = 0, r = 0, s = 0) {
        super(q, r, s, id);
        let n = Hex.findNeighbors({x:q,y:r,z:s});
        this.neighbors = n;
        let h = 5;
        this.height = h;
        this.size = 25;

        let verts = [];

        // create the skeleton of the hex
        for (let i = 0; i < 6; i++) {
            verts.push(this._createVertex(i));
        }
        // copy the verts into a shape for the geometry to use
        this.shape = new THREE.Shape();
        this.shape.moveTo(verts[0].x, verts[0].y);
        for (let i = 1; i < 6; i++) {
            this.shape.lineTo(verts[i].x, verts[i].y);
        }
        this.shape.lineTo(verts[0].x, verts[0].y);
        this.shape.autoClose = true;

        if (!this.material) {
            this.material = new THREE.MeshLambertMaterial({
                color: 0x00ff00,
                wireframe: false,
                vertexColors: 0x000000,
                side: THREE.DoubleSide
            });
        }

        let mats = [
            this.material,
            this.material,
            new THREE.MeshBasicMaterial({ color: 0xaaaaaa }),
            new THREE.MeshBasicMaterial({ color: 0x444444 }),
            new THREE.MeshNormalMaterial({ side: THREE.DoubleSide }),
            new THREE.MeshBasicMaterial({ color: 0xffff00 }),
            new THREE.MeshPhongMaterial({ color: 0xffffff }),
            new THREE.MeshBasicMaterial({transparent:true, opacity: 0.0})
        ];

        this.edgeMat = new THREE.LineBasicMaterial({color:0x000000, linewidth:2});;

        let colors = [
            0x000000,
            0x444444,
            0xcccccc,
            0xffff00,
            0xff00ff,
            0x00ffff,
            0xffffff
        ]

        let extset = {
            steps: 1,
            amount: this.height,
            bevelEnabled: false,
            bevelSize: 0.5,
            bevelSegments: 1,
            bevelThickness: .5,
            extrudeMaterial: 1,
            material: 7
        };

        this.group = new THREE.Group();
        this.group.name = '';
        /* Make hex*/
        this.extdGeo = new THREE.CylinderGeometry(25,25,1,6,1,true);
        this.extdMesh = new THREE.Mesh(this.extdGeo, null);
        this.extdMesh.material = mats;
        this.extdMesh.add(this.drawEdges(this.extdGeo));
        this.extdMesh['group'] = this.group;
        this.extdMesh.position.y = 0;
        this.extdMesh.name = 'cyl';
        //make top
        this.topGeo = new THREE.CylinderGeometry(25,0,10,6,1,true);
        this.top = new THREE.Mesh(this.topGeo, mats[4]);
        this.top['group'] = this.group;
        this.top.position.y = h;
        this.top.name="top";

        this.group.add(this.extdMesh);
        this.group.add(this.top);
        this.group['cell'] = this;
        this.cell = this.group;

        if (q != 0 || r != 0 || s != 0) {
            this.positionHex(q, s, r, );
        } else {
            this.grow(30);
        }
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
//        this.top.material.color.setHex(color);
        this.top.material.needsUpdate = true;
    }

    setInfo(info) {
        this.info = info;
        info.chg.subscribe(
            (evt) => { this.chgEvt(evt)},
            (err) => { console.log(err)},
            () => { console.log("DONE")}
        )
    }

    chgEvt(evt) {
        let bob=1;
        switch(evt) {
        case 'select':
            this.chgTop(0x0000ff);
            break;
        case 'unselect':
            this.chgTop(0xaaaaaa);
            break;
        case 'hover':
            this.chgTop(0xff0000);
            break;
        case 'unhover':
            this.chgTop(0xaaaaaa);
            break;
        case 'value':
        case 'wheel':
        default:
            //console.log(evt);
        }
    }

    focusin(evt) {
        this.top.material.color.setHex(0xcc0000);
        this.top.material.needsUpdate = true;
    }

    focusout(evt) {
        this.top.material.color.setHex(0xaaaaaa);
        this.top.material.needsUpdate = true;
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

    private _createVertex(i: number) {
        var angle = (Hex.TAU / 6) * i;
        return new THREE.Vector2((this.size * Math.cos(angle)), (this.size * Math.sin(angle)));
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

        let mesh = this.extdMesh;
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
    //set position(x,y,z) {

    //}
}
