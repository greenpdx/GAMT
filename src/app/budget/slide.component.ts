import { Component, OnInit, Input, Output } from '@angular/core';
import { TreeModel, TreeVirtualScroll, TreeNode, IActionMapping, ITreeOptions, KEYS, TREE_ACTIONS } from 'angular2-tree-component';

import { DataNode } from '../../lib/data-doc';

@Component({
    selector: 'lib-slider',
    template: `
    <div style="width: 700px;cursor:default">
        <div>
            <span>
                {{node.data.name}}
            </span>
            <span style="float:right;">{{selValue}} Million</span>
        </div>
        <div *ngIf="selected" style="width:90%;margin-left:20px;display:flex;flex-direction:column;">
            <div style="width:90%;display:flex;">
                <span style="flex-basis:1;flex:1;width: 33%;margin-left:1em">{{minValue}}</span>
                <span style="flex-basis:1;flex:1;width: 33%;text-align:center;">{{defaultValue}}</span>
                <span style="flex-basis:1;flex:1;width: 33%;text-align:right;margin-right:1em">{{maxValue}}</span>
            </div>
            <div>
                <input type='range' (click)="sldclk($event)" style="width:85%"/>
                <!--input type='range' (input)="sldclk($event)" style="width:85%;cursor:pointer;"/-->
            </div>
        </div>
     </div>
     `,
  styleUrls: ['./slide.component.css']
})
export class SlideComponent implements OnInit {
    @Input() node: any;
    @Input() index: any;
    selected: boolean = false;

    defaultValue: number;
    maxValue: number;
    minValue: number;
    selValue: number;
    multy: number;

    @Output() extra: any;

    constructor() {
        this.extra =  {data: {}};

    }

    ngOnChanges() {
        if (!this.node.data) {
            this.node.data = new DataNode("Surplus or Defict", '000000000', null);
            this.selected = true;
        }
        this.node['comp'] = this;
        this.node.data.subscribe(
            (evt) => { this.chgEvt(evt)},
            (err) => { console.log(err)},
            () => {console.log("DONE")}
        );
    }

    chgEvt(evt) {
        let treeMod = this.node.treeModel;
        switch(evt) {
        case 'select':
            treeMod.fireEvent({eventName: 'onActivate', node: this.node});
            //if (!treeMod.isExpanded(this.node)) {
            //    treeMod.fireEvent({eventName: 'toggleExpanded', node: this.node});
            //}
            break;
        case 'unselect':
            treeMod.fireEvent({ eventName: 'onDeactivate', node:this.node});
            //treeMod.fireEvent({eventName: 'toggleExpanded', node: this.node});
            break;
        default:
            console.log(evt);
        }
    }

    ngOnInit() {
        this.defaultValue = this.node.data.sum/1000;
        this.maxValue = this.defaultValue * 1.25;
        this.minValue = 0;
        this.selValue = this.defaultValue;
        this.multy = this.maxValue - this.minValue;
    }

    sldclk(evt: Event) {
        //console.log(this.node.data);
        const ele = <HTMLInputElement>evt.currentTarget;
        let val: any = ele.value;
        let cash = (val - 50) / 100 * this.multy;
        this.selValue = cash + this.defaultValue;
        const chld = this.node.children;
        let mc = chld.length;
        const prnt = this.node.parent;
        console.log(prnt);

    }

    adjustParent() {

    }

    adjustChildren() {

    }
}
