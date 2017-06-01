/*
 * three.service.ts
 * the code the does the 3d
 * author Shaun Savage
 */
import { Injectable, EventEmitter, Output, Input } from '@angular/core';

import * as THREE from 'three';
import { OrbitControls } from 'three-orbitcontrols-ts';
import { Observable, Observer, Subject, BehaviorSubject } from 'rxjs';

import { HexGrid } from '../lib/hexgrid';

@Injectable()
export class Three3dService {
    _orbit: OrbitControls;
    _render: any;
    _scene: THREE.Scene;
    _camera: THREE.PerspectiveCamera;
    _element: HTMLElement;
    raycaster = new THREE.Raycaster();
    @Output() screenPosition = new THREE.Vector3;
    hoverObject: any;
    selectedObject: any;
    width: number;
    height: number;
    top: number;
    mouseLoc: any;  // debug hex 2 screen
    totalScale: number;

    @Output() focusOut: EventEmitter<any>;
    @Output() focusIn: EventEmitter<any>;
    @Output() chgValue: EventEmitter<any>;
    @Output() chgWheel: EventEmitter<any>;

    constructor() {}

    @Input() set orbit(orbit: OrbitControls) {
        this._orbit = orbit;
    }

    @Input() set scene(scene: THREE.Scene) {
        this._scene = scene;
    }

    @Input() set camera(cam: THREE.PerspectiveCamera) {
        this._camera = cam;
    }

    @Input() set render(rend: THREE.WebGLRenderer) {
        this._render = rend;
    }

    @Input() set element(ele: HTMLElement) {
        this._element = ele;
        this.width = ele.clientWidth;
        this.height = ele.clientHeight;
        this.top = ele.offsetTop;

        this.focusIn = new EventEmitter();
        this.focusOut = new EventEmitter();
        this.chgValue = new EventEmitter();
        this.chgWheel = new EventEmitter();

        this._element.addEventListener('keydown', this.userEventHandler.bind(this), true);
        this._element.addEventListener('mousedown', this.userEventHandler.bind(this), true);
        this._element.addEventListener('contextmenu', this.userEventHandler.bind(this), false);
        this._element.addEventListener('wheel', this.userEventHandler.bind(this), true);
        this._element.addEventListener('mouseup', this.userEventHandler.bind(this), true);
        this._element.addEventListener('mousemove', this.userEventHandler.bind(this), true);
        this._element.addEventListener('click', this.userEventHandler.bind(this), true);
        this._element.addEventListener('dblclick', this.userEventHandler.bind(this), true);
        this._element.addEventListener('auxclick', this.userEventHandler.bind(this), true);
    }

    userEventHandler( evt: Event) {
        switch(evt.type) {
        case 'wheel':
            this.wheelHandler(evt);
            break;
        case 'mousemove':
            this.mouseMoveHandler(evt);
            break;
        case 'keydown':
            this.keyDownHandler(evt);
            break;
        case 'mousedown':
            //this.mouseDownHandler(evt);
            //console.log("mousedown");
            break;
        case 'mouseup':
            //console.log('mouseup')
            break;
        case 'contextmenu':
            console.log('contextmenu');
            break;
        case 'click':
            this.clickHandler(evt);
            console.log('click');
            break;
        case 'dblclick':
            this.dblclickHandler(evt);
            console.log('dblClick');
            break;
        case 'auxclick':
            console.log('auxclick');
            break;
        default:
            console.log("default user event");
        }
    }

    keyDownHandler(evt: Event) {
        console.log("keyDown");
        return false;
    }

    mouseMoveHandler(evt: any) {
        this.mouseLoc = {'x':evt.clientX, 'y': evt.clientY};
        this.screenPosition.x = (evt.clientX / this.width) * 2 - 1;
        this.screenPosition.y = -((evt.clientY - this.top) / this.height) * 2 + 1;
    }

    wheelHandler(evt: any) {
        console.log("wheel");
        if ( evt.shiftKey ) {
            //console.log("W");
            let sel = this.selectedObject;
            if (sel) {
                //this.chgWheel.emit(evt);
                //let top = hover.children[1];
                //let cell = hover.children[0];
                //top.material.color.setHex(0x00cc00);
                //hover.cell.grow(-evt.deltaY);
                //this.totalScale = this.totalScale * (evt.deltaY)? 0.95: 1.05;
                //removeTile(this.pickedObject);
                //addTile(cel);
                //this.pickedObject.cell.h += evt.deltaY;
                //this.box.parameters.height += 0.1 * evt.deltaY;

                evt.stopPropagation();
                return true;
            }
        }
        return false;
    }

    clickHandler(evt: any) {
        let hov = this.hoverObject;
        let sel = this.selectedObject;
        if (hov) {
            let mesh = hov.extdMesh;
            if (evt.button === 0) {
                if (sel === hov) {
                    sel.data.next({action:'unselected',data:sel});
                    this.selectedObject = null;
                } else
                if (hov) {
                    hov.data.next({action:"select",data:hov});
                    this.selectedObject = hov;
                }
            }

            if (evt.button === 2 && sel) {
                hov.data.next({action:'context',data:hov});
            }
        }

        this.update();
        return false;
    }

    dblclickHandler(evt: any) {
    }

    ctlupdate() {
        let raycaster = this.raycaster;
        let screenPosition = this.screenPosition;
        if (isNaN(screenPosition.x) || isNaN(screenPosition.y)) {
            return;
        }
        raycaster.setFromCamera(this.screenPosition, this._camera);
        let scene = this._scene;
        let intersects = raycaster.intersectObject(scene, true);
        let hov = this.hoverObject;
        let sel = this.selectedObject;

        if (intersects.length > 0) {
            // change each intersect object
            let object: any = intersects[0].object;
            let group = object.group;
            if (!group) {
                return;
            }
            let cell = group.cell;

            if (hov && hov != cell) {
                // was hover now not
                //focusout event to cell.
                if (cell != sel) {
                    hov.data.next({action:"unhover",data:hov});
                }
                this.hoverObject = cell;
                cell.data.next({action:"hover",data:cell});
            }
            if (!hov) {
                cell.data.next({action:"hover",data:cell});
                this.hoverObject = cell;
            }
            if (hov == cell) {
                return;
            }
        } else if (hov && !sel ) {
            hov.data.next({action:'unhover',data:hov});
            this.hoverObject = null;
        }
    }


    update() {
        this.animate();
    }

    private animate = () => {
        requestAnimationFrame(this.animate);
        this._orbit.update();
        this.ctlupdate();
        this._render.render( this._scene, this._camera);
    }
}
