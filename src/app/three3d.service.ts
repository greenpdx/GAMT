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

    @Output() focusOut: EventEmitter<any>;
    @Output() focusIn: EventEmitter<any>;
    @Output() chgValue: EventEmitter<any>;

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

    setupListener() {

    }

    update() {
        this.animate();
    }

    private animate = () => {
        requestAnimationFrame(this.animate);
        this._orbit.update();
//        this.component.userEvents.update(this);
        this._render.render( this._scene, this._camera);
    }
}
