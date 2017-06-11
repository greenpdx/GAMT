import { Component, OnInit, EventEmitter, Input, Output } from '@angular/core';

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

    @Output() focusOut: EventEmitter<any>;
    focusIn: EventEmitter<any>;
    chgValue: EventEmitter<any>;
    select: EventEmitter<any>;
    unselect: EventEmitter<any>;

    sceneSettings: Object | any;
    renderer: THREE.WebGLRenderer;
    scene: THREE.Scene;
    grid: HexGrid;
    screenPosition = this.service3d.screenPosition;
    width: number;
    height: number;
    top: number;
    camera: THREE.PerspectiveCamera;
    orbit: OrbitControls;
    center3d: any;
    totalScale: number = 1;
    @Input() appObj: AppComponent;

    //infoBox stuff
    ib_id: number;
    ib_r: number;
    ib_q: number;
    ib_s: number;
    ib_x: number;
    ib_y: number;
    ib_zoom: string;
    ib_name: string;
    ib_sum: number;
    ib_subs: number;

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
//        this.hovLight = new THREE.PointLight(0xffaaaa,1,30,2);
//        this.selLight = new THREE.PointLight(0x8888ff,1,30,2);

//        this.scene.add(this.hovLight);
//        this.scene.add(this.selLight);
        this.service3d.scene = this.scene;

        let mat0 = new THREE.MeshPhongMaterial({
            color:0x00cc88,
            opacity: 100
        });

        let mat1 = new THREE.MeshPhongMaterial({
            color: 0xcc8800,
            wireframe: false,
            vertexColors: 0x000000,
            side: THREE.DoubleSide
        });

        let mats = [
            mat1,
            mat1,
            new THREE.MeshBasicMaterial({ color: 0xaaaaaa }),
            new THREE.MeshBasicMaterial({ color: 0x444444, side: THREE.DoubleSide }),
            new THREE.MeshNormalMaterial({ side: THREE.DoubleSide }),
            new THREE.MeshBasicMaterial({ color: 0xffff00, side: THREE.BackSide }),
            new THREE.MeshPhongMaterial({ color: 0xffffff }),
            new THREE.MeshBasicMaterial({transparent:true, opacity: 0.0}),
            new THREE.LineBasicMaterial({color:0x000000, linewidth:2})
        ];

        this.grid = new HexGrid(this, {mats:mats});
    }

    ngOnInit() {
        this.element = document.getElementById("three3d");
        this.infoBox = document.getElementById("infobox");

    }

    ngAfterViewInit() {
        let ele = document.getElementById("three3d");
        this.element = ele;
        this.service3d.element = ele;
        let width = ele.clientWidth;
        let height = ele.clientHeight;

        this.width = ele.clientWidth;
        this.height = ele.clientHeight;
        this.top = ele.offsetTop;
        this.center3d = {'x':width/2, 'y':height/2+this.top};

        this.focusOut = this.service3d.focusOut;
        this.focusIn = this.service3d.focusIn;
        this.chgValue = this.service3d.chgValue;

        this.focusIn.subscribe(hov => this.inCell(hov));
        this.focusOut.subscribe(hov => this.outCell(hov));
        this.chgValue.subscribe(hov => this.chgCell(hov));

        this.camera = new THREE.PerspectiveCamera( 70, width / height, 1, 3000 );
        this.camera.position.x = 0;
        this.camera.position.y = 350;
        this.camera.position.z = 500;
        this.service3d.camera = this.camera;

            //this.camera.target.position.y = 150;

        this.renderer.setSize( this.element.clientWidth, this.element.clientHeight );
        this.element.appendChild( this.renderer.domElement );

        this.orbit = new OrbitControls(this.camera, this.renderer.domElement);
        this.service3d.orbit = this.orbit;

        this.grid.build(0);
        this.grid.grid.visible = true;
        this.scene.add(this.grid.grid);

        let axis = new THREE.AxisHelper(200);
        axis['group'] = null;
        this.scene.add(axis);


        this.service3d.update();
    }

    inCell(hov) {
        let xy = this.grid.cell2Screen(hov);
        let scale = 1; // 1/this.orbit.totalScale;
        xy = {'x': xy.x*scale + this.center3d.x, 'y': xy.y*scale + this.center3d.y};
        console.log("IN ",hov.uniqueID, xy, this.totalScale, this.service3d.mouseLoc);
        this.infoBox.style.top = xy.y.toString()+"px";
        this.infoBox.style.left = xy.x.toString()+"px";
        this.ib_id = hov.uniqueID;
        this.ib_name = hov.info.name;
        this.ib_sum = hov.info.sum/1000;
        this.ib_subs = (hov.info.buru)? hov.info.buru.length: 0;
        this.ib_x = xy.x;
        this.ib_y = xy.y;
        this.ib_zoom = scale.toFixed(4);
        this.infoBox.style.visibility = "visible";
        this.totalScale = this.totalScale * 1.05;
    }

    outCell(hov) {
        this.infoBox.style.visibility = "hidden";
        this.totalScale = this.totalScale * 0.95;

        console.log("OUT ",hov.uniqueID);

    }

    chgCell(hov) {
        console.log("CHG ",hov.uniqueID);
    }

    buildGrid(conf) {
        this.grid.load(conf)

    }


}
