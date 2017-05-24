/*
 *  Cell.ts
 *  The base class for 3D objects
 *  @author Shaun Savage
 *  original author Corey Birnbaum https://github.com/vonWolfehaus/
 */

export class Cell {
    protected q: number;
    protected r: number;
    protected s: number;
    protected h: number;
//    tile: Tile;
    userData: Object;
    walkable: boolean;
    private calcCost: number;
    private priority: number;
    private visited: boolean;
    private parent: any;
    uniqueID: string
    private idx: number;
    private static cnt = 0;
    protected directions: any;
    protected diagonals: any;
    neighbors: any[];
    info: any;

    constructor(q = 0, r = 0, s = 0, id = null) {
        this.q = q; // x grid coordinate (using different letters so that it won't be confused with pixel/world coordinates)
        this.r = r; // y grid coordinate
        this.s = s; // z grid coordinate
        this.uniqueID = id;
        this.h = 10; // 3D height of the cell, used by visual representation and pathfinder, cannot be less than 1
//        this.tile = null; // optional link to the visual representation's class instance
        this.userData = {}; // populate with any extra data needed in your game
        this.walkable = true; // if true, pathfinder will use as a through node
        // rest of these are used by the pathfinder and overwritten at runtime, so don't touch
        this.calcCost = 0;
        this.priority = 0;
        this.visited = false;
        this.parent = null;
        this.idx  = Cell.cnt++;
        //this.uniqueID = LinkedList.generateID();
    }

    set(q, r, s) {
    	this.q = q;
    	this.r = r;
    	this.s = s;
    	return this;
    }

    copy(cell) {
    	this.q = cell.q;
    	this.r = cell.r;
    	this.s = cell.s;
    	this.h = cell.h;
//    	this.tile = cell.tile || null;
    	this.userData = cell.userData || {};
    	this.walkable = cell.walkable;
    	return this;
    }

    add(cell) {
        this.q += cell.q;
    	this.r += cell.r;
    	this.s += cell.s;
    	return this;
    }

    equals(cell) {
    	return this.q === cell.q && this.r === cell.r && this.s === cell.s;
    }

    getData() {
        return {'X':this.q,'Y':this.r,'Z':this.s,'H':this.h,'id':this.idx }
    }

    neighbor(i) {
        return this.directions
    }

    focusin(evt) {

    }

    focusout(evt) {

    }
}
