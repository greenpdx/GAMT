import { Component, ViewChild, OnInit } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { TreeModel, TreeVirtualScroll, TreeNode, IActionMapping, ITreeOptions, KEYS, TREE_ACTIONS } from 'angular2-tree-component';


import { DataService } from './data-service.service';
import { DataDoc } from '../lib/data-doc';
import { BudgetComponent } from './budget/budget.component';

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
            $event.shiftKey
                ? TREE_ACTIONS.TOGGLE_SELECTED_MULTI(tree, node, $event)
                : TREE_ACTIONS.TOGGLE_SELECTED(tree, node, $event);
        }
    },
    keys: {
        [KEYS.ENTER]: (tree, node, $event) => {}
    }
};


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [DataService, TreeModel, TreeVirtualScroll]
})

export class AppComponent implements OnInit {
    savages = "SavageS";
    tnvFull="Tax N Vote";

    //selected: SlideComponent = null;

    constructor() {
    }

    ngOnInit() {
    }

    ngAfterViewInit() {
    }


    onInit(tree) {
        const bob = 1;
//        this.tree = tree;
//        this.trees.push(tree);
    }

}
