/*
 *  hexgrid.ts
 *  is the single layer grid of objects
 *  @author Shaun Savage
 *  original author Corey Birnbaum https://github.com/vonWolfehaus/
 */

import * as THREE from 'three';
import { Hex } from '../lib/hex';
//import { Cell } from './cell';

export class HexGrid  {
    //type = Consts.HEX;
    size: number = 5;
    cellSize: number = 25;
    cells = {};
    numCells: number = 0;
    cellShape: THREE.Shape;
    cellGeo: THREE.Geometry;
    cellShapeGeo: THREE.ShapeGeometry;
    static readonly TWO_THIRDS: number = 2 / 3;
    config: any;
    static readonly SQRT3 = Math.sqrt(3);
    static readonly PI = Math.PI;
    static readonly DEG_TO_RAD = 0.0174532925;
	static readonly RAD_TO_DEG = 57.2957795;
    grid: any;
    component: any;

    //private cellWidth: number;
    static readonly TAU = Math.PI * 2;
    constructor(comp, conf?: any) {
        this.component = comp;
        this.config = conf;
        this.grid = new THREE.Group();
        this.mats = conf.mats
    }

    mats: any;

    autogenerated = false;

  	private cellWidth = this.cellSize * 2;
  	private cellLength = (HexGrid.SQRT3 * 0.5) * this.cellWidth;
  	private hashDelimeter = '.';
  	// cached objects
  	private list = [];
  	private vec3 = new THREE.Vector3();
  	private conversionVec = new THREE.Vector3();
  	private geoCache = [];
  	private matCache = [];
    directions = Hex.directions;
    hex: any;

  	/*  ________________________________________________________________________
  		High-level functions that the Board interfaces with (all grids implement)
  	 */

     // grid cell (Hex in cube coordinate space) to position in pixels/world
     	cell2Screen(cell) {
            let x = 150 * cell.q / 2;
            let y = 50 * HexGrid.SQRT3 * (cell.r + cell.q/2 );
            return {'x':x,'y':y};
        }
     	/*	this.vec3.x = cell.q * this.cellWidth * 0.75;
     		this.vec3.z = cell.h;
     		this.vec3.y = -((cell.s - cell.r) * this.cellLength * 0.5);
     		return this.vec3;
     	}*/

/*     	pixelToCell(pos) {
     		// convert a position in world space ("pixels") to cell coordinates
     		var q = pos.x * (HexGrid.TWO_THIRDS / this.cellSize);
     		var r = ((-pos.x / 3) + (HexGrid.SQRT3/3) * pos.z) / this.cellSize;
     		this._cel.set(q, r, -q-r);
     		return this.cubeRound(this._cel);
     	}

     	getCellAt(pos) {
     		// get the Cell (if any) at the passed world position
     		var q = pos.x * (vg.HexGrid.TWO_THIRDS / this.cellSize);
     		var r = ((-pos.x / 3) + (vg.SQRT3/3) * pos.z) / this.cellSize;
     		this._cel.set(q, r, -q-r);
     		this._cubeRound(this._cel);
     		return this.cells[this.cellToHash(this._cel)];
     	}
*/

     build(len, data?: any) {
        let cnt = 0;
        let h = 1
        let n = {x:0,y:0,z:0} //this.directions[0]
        let conf = {mats:this.mats};
        for (let r=1;r<=len;r++) {
            let ln = {x:r,y:-r,z:0};
            for (let s of [2,3,4,5,0,1]) {
                for (let l=0; l< r; l++) {
                    let cell = null;
                    if (data) {
                        cell = data.cells[cnt++];
                        if (cell == undefined) {
                            console.log("why");
                            break;
                        }
                        h = cell.sum / 2000000 + 5;
                        //if (h > 200) h = h *2 /Math.log(h);
                        //info = cell.id;
                        //let sum = info.su;

                    } else {
                        cell = {'_id': Math.floor(Math.random() * 10000000)};
                        h = 2;
                    }
                    let hex = new Hex(conf, cell ,{q:ln.x,r:ln.y,s:ln.z});
                    hex.setHeight(h);
                    this.add(hex);
                    //hex.setInfo(cell);
                    ln = Hex.neighbor(ln,s%6);

                }

            }
        }
     }

  	// create a flat, hexagon-shaped grid
  	generate(config) {
  		config = config || {};
        let h = (config.height != undefined )? config.height: 5;
        let load = null;
        if (config.load != undefined) {
            load = config.load;
        }
        let cnt = 0;
  		this.size = typeof config.size === 'undefined' ? this.size : config.size;
  		var x, y, z, c;
  		for (x = -this.size; x < this.size+1; x++) {
  			for (y = -this.size; y < this.size+1; y++) {
  				z = -x-y;
  				if (Math.abs(x) <= this.size && Math.abs(y) <= this.size && Math.abs(z) <= this.size) {
  					if (load) {
                        h = load.cells[cnt++].h;
                    } else {
                        h = 5 * cnt++;
                    }
                    c = new Hex(h, x, y);
  					this.add(c);
  				}
  			}
  		}
  	}


  	add(cell) {
  		let id = cell.uniqueID;
  		if (this.cells[id]) {
  			console.warn('A cell already exists there');
  			return;
  		}
  		this.cells[id] = cell;
  		this.numCells++;
        this.grid.add(cell.cell);
        cell.component = this.component;
        cell.data.subscribe(
            (evt) => { this.gridEvt(evt);},
            (err) => { console.log(err)},
            () => { console.log("DONE")}
        );
  		return cell;
  	}

    gridEvt(evt) {
        console.log("GRIDEVT ",evt.action, evt.data);
    }

  	remove(cell) {
        let id = cell._id;
  		if (this.cells[id]) {
  			delete this.cells[id];
  			this.numCells--;
  		}
  	}

  	dispose() {
  		this.cells = null;
  		this.numCells = 0;
  		this.cellShape = null;
  		this.cellGeo.dispose();
  		this.cellGeo = null;
  		this.cellShapeGeo.dispose();
  		this.cellShapeGeo = null;
  		this.list = null;
  		this.vec3 = null;
  		this.conversionVec = null;
  		this.geoCache = null;
  		this.matCache = null;
  	}

    load(load) {
        let conf = {};
        conf['load'] = load;
        conf['size'] = 6;
        this.build(6,load);
        return this.grid;
    }

  	private cubeRound(h) {
  		var rx = Math.round(h.q);
  		var ry = Math.round(h.r);
  		var rz = Math.round(h.s);

  		var xDiff = Math.abs(rx - h.q);
  		var yDiff = Math.abs(ry - h.r);
  		var zDiff = Math.abs(rz - h.s);

  		if (xDiff > yDiff && xDiff > zDiff) {
  			rx = -ry-rz;
  		}
  		else if (yDiff > zDiff) {
  			ry = -rx-rz;
  		}
  		else {
  			rz = -rx-ry;
  		}

  		//return this.cel.set(rx, ry, rz);
  	}

}
