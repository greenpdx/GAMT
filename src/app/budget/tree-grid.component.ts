import { Component, OnInit, Input, ViewChild } from '@angular/core';

import { TreeModel, TreeVirtualScroll, TreeNode, IActionMapping, ITreeOptions, KEYS, TREE_ACTIONS } from 'angular2-tree-component';

import { SlideComponent } from './slide.component';

const actionMapping: IActionMapping = {
    mouse: {
        contextMenu: (tree, node, $event) => {
            console.log(`context menu ${node.data.name}`);
        },
        dblClick: (tree, node, $event) => {
            if (node.hasChildren) {TREE_ACTIONS.TOGGLE_EXPANDED(tree, node, $event); };
        },
        click: (tree, node, $event) => {
            let bob=1;
            let data = node.data;
            //data.dispatch({action});
//            $event.shiftKey
//                ? TREE_ACTIONS.TOGGLE_SELECTED_MULTI(tree, node, $event)
//                : TREE_ACTIONS.TOGGLE_SELECTED(tree, node, $event);
        },
        expanderClick: (tree, node, $event) => {
            let bob=1;
            console.log("EXPAND");
            TREE_ACTIONS.EXPAND(tree, node, $event)
        }
    },
    keys: {
        [KEYS.ENTER]: (tree, node, $event) => {}
    }
};

@Component({
    selector: 'tree-grid',
    template: `
        <div>
            <lib-slider #diff [node]=[extra]></lib-slider>
        </div>
        <div style="display: inline;">
            <tree-root #tree0
                [nodes]="nodes"
                [options]="options"
                (onEvent)="onEvent($event);"
                (onToggleExpanded)="toggleExpand($event)"
                (onSelected)="selectData($event)"
                (onActiveChange)="chgData($event)"
                >
                <ng-template #treeNodeTemplate let-node let-index="index">
                    <lib-slider #nodeSlider [node]="node" [index]="index"></lib-slider>
                </ng-template>
            </tree-root>
        </div>
    `,
  styles: [],
  providers: [TreeModel, TreeVirtualScroll]
})
export class TreeGridComponent implements OnInit {
    @Input() data: any;
    @ViewChild(TreeModel) treemod: any;

    selected: SlideComponent = null;
    @Input() nodes: any = [];
    event: any;
    initalizied: any;
    //    options: any = { nodeClass: (node:TreeNode) => this.nodeClass(node), idField: '_id'};
    options: any = { idField: '_id'};

    obj: any;

    constructor() {
        let bob=1;
    }

    ngOnInit() {
        let bob=1;
    }

    fillTree(data) {
        let bob=1;
        this.nodes = data;
    }

    toggleExpand(evt: any) {
        let bob = 1;
    }
    chgData(evt) {
        let bob=2;
    }
    selectData(evt) {
        let bob=1;
    }

    onEvent(evt: any) {
        let bob=1;
        let slider: SlideComponent;
        if (!evt.node) {
            console.log("NONODE",evt.eventName);
            return;
        }
        let data = evt.node.data;
        switch(evt.eventName) {
        case 'onActiveChange':
            bob=1;
            break;
        case 'onToggleExpanded':
            //data.dispatch({action:'expand', data:data})
            bob=1;
            break;
        case 'onActivate':
            //data.dispatch({action:'select', data: data})
            slider = evt.node.comp;
            this.selected = slider;
            slider.selected = true;
            break;
        case 'onDeactivate':
            //this.selected.selected = false;
            slider = evt.node.comp;
            slider.selected = false;
            break;
        case 'onBlur':
            bob=4;
            break;
        case 'onFocus':
            console.log("Focus");
            break
        case 'onUpdateData':
            let exp = this.treemod.expandedNodeIds;
            let foc = this.treemod.focusedNodeId;
            let act = this.treemod.activeNodeIds;
            bob=2;
            break;
        case 'onInitialized':
            bob=3;
            break;
        default:
            console.log(evt.eventName);
        }
    }

    nodeClass(node:TreeNode) {
        let mynode:any = node;

        return mynode.comp;
    }

}
