import { Component, OnInit, EventEmitter, Input } from '@angular/core';

import * as THREE from 'three';
import { OrbitControls } from 'three-orbitcontrols-ts';
import { Observable, Observer, Subject, BehaviorSubject } from 'rxjs';

import { AppComponent } from './app.component';
import { Three3dService } from './three3d.service'
import { HexGrid } from '../lib/hexgrid';

@Component({
  selector: 'three3d',
  templateUrl: './three3d.component.html',
  styleUrls: ['./three3d.component.css'],
  providers: [Three3dService]
})
export class Three3dComponent implements OnInit {
    element: HTMLElement;
    infoBox: HTMLElement;

    focusOut: EventEmitter<any>;
    focusIn: EventEmitter<any>;
    chgValue: EventEmitter<any>;

    sceneSettings: Object | any;
    renderer: THREE.WebGLRenderer;
    scene: THREE.Scene;
    grid: HexGrid;
    screenPosition = new THREE.Vector2(-1,-1);
    width: number;
    height: number;
    top: number;
    camera: THREE.PerspectiveCamera;
    orbit: OrbitControls;

    @Input() appObj: AppComponent;

    constructor(private service3d: Three3dService) {
        this.sceneSettings = {
            alpha: true,
            antialias: true,
            clearColor:  '#eeeeee',
            sortObjects: false,
        }
        //this.component = component;
        try {
            this.renderer = new THREE.WebGLRenderer({
                alpha: this.sceneSettings.alpha,
                antialias: this.sceneSettings.antialias
            });
        } catch(e) {
            console.log("WEBGL ",e)
        }
        this.service3d.render = this.renderer;

        this.renderer.setClearColor(this.sceneSettings.clearColor, 0);
        this.renderer.sortObjects = this.sceneSettings.sortObjects;

        this.scene = new THREE.Scene();
        this.scene.add(new THREE.AmbientLight(0xffffff));
        let light = new THREE.DirectionalLight(0xffffff);
        this.scene.add(light);
        this.service3d.scene = this.scene;

        let mat = new THREE.MeshPhongMaterial({
            color:0x00cc88,
            opacity: 100
        });
        //this.userEvt = new Subject();
        this.screenPosition = new THREE.Vector2(-1,-1);

        this.grid = new HexGrid();

    }

    ngOnInit() {
        this.element = document.getElementById("three3d");
        this.infoBox = document.getElementById("infobox");

    }

    ngAfterViewInit() {
        let ele = document.getElementById("three3d");
        this.element = ele;
        let width = ele.clientWidth;
        let height = ele.clientHeight;

        this.width = ele.clientWidth;
        this.height = ele.clientHeight;
        this.top = ele.offsetTop;

        this.camera = new THREE.PerspectiveCamera( 70, width / height, 1, 3000 );
        this.camera.position.y = -350;
        this.camera.position.z = 350;
        this.service3d.camera = this.camera;

            //this.camera.target.position.y = 150;

        this.renderer.setSize( this.element.clientWidth, this.element.clientHeight );
        this.element.appendChild( this.renderer.domElement );

        this.orbit = new OrbitControls(this.camera, this.renderer.domElement);
        this.service3d.orbit = this.orbit;

        this.grid.build(1)
        this.grid.grid.visible = true;
        this.scene.add(this.grid.grid);

        this.service3d.update();
    }


    buildGrid(conf) {
        this.grid.load(conf)

    }


}
