import { Component, ViewChild } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { TreeModel, TreeVirtualScroll, TreeNode, IActionMapping, ITreeOptions, KEYS, TREE_ACTIONS } from 'angular2-tree-component';


import { DataService } from './data-service.service';
import { SlideComponent } from './slide.component';
import { DataDoc } from '../lib/data-doc';

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
export class AppComponent {
    otitle = 'U.S. Budget 2016, Discretionary';
    code = "github.com/greenpdx/GAMT";
    savages = "SavageS";
    tnvFull="Tax N Vote";

    @ViewChild('three3d') three3d: any;
    tree: any;
    trees: any;
    nodes = [];
    keys: any[];

    event: any;
    initalizied: any;
    //    options: any = { nodeClass: (node:TreeNode) => this.nodeClass(node), idField: '_id'};
    options: any = { idField: '_id'};

    selected: SlideComponent = null;



    constructor(private serviceData: DataService) {
        serviceData.hasAlias.subscribe(alias => {   // just testing
            console.log('Has Alias ', alias);
        });
        serviceData.hasDb.subscribe(dbs => {        // just testing
            console.log('Has DBs ', dbs);
        });
        serviceData.hasColl.subscribe(colls => {    // just testing
            console.log('Has Colls ', colls);
        });

        let qry = "{ \"2016\": {\"$ne\": 0} }";
        let prj = "";
        let requrl = "";
        serviceData.doQuery(requrl, qry,{"limit":0})
            .subscribe(data => this.init(data));

        let nedbOpts = {inMemoryOnly: true};

    }

    tst(node: any): any {
        let bob=1;
        if (node.beacat != "Discretionary") {
            return 0;
        }
        if (node.onoffbudget != "On-budget") {
            return 0;
        }
        return node['2016'];
    }

    init(data) {
        let dd = new DataDoc();
        //data = data.slice(0,1);

        let tdoc = dd.groupData(data);
        let tree = dd.bldTree(this.tst);

        this.buildGrid(tree);
    }

    ngAfterViewInit() {
        this.three3d.focusIn.subscribe(
            cell => this.focusIn(cell),
            err => this.errFunc(err, "I"),
            () => this.done("I"));
        this.three3d.focusOut.subscribe(
            cell => this.focusOut(cell),
            err => this.errFunc(err,"O"),
            () => this.done("O"));
        this.three3d.chgValue.subscribe(
            cell => this.chgValue(cell),
            err => this.errFunc(err,"C"),
            () => this.done("C"));
    }

    getRec(id) {
/*        this.dataDB.find({_id:id}).exec(
            function(err,doc) {
                if(err) {console.log("getRec",err)}
                let bob=1;
            });*/

    }


    buildGrid(doc) {
        let conf = {'cells':doc };
        this.nodes = doc;
        this.three3d.buildGrid(conf);
//        this.treeNodes = alph;
//        this.tree.treeModel.update();
    }

    onEvent(evt: any) {
        let bob=1;
        let slider: SlideComponent;
        switch(evt.eventName) {
        case 'onActivate':
            if (this.selected) {
                this.selected.selected = false;
            }
            slider = evt.node.comp;
            this.selected = slider;
            slider.selected = true;
            break;
        case 'onDeactivate':
            slider = evt.node.comp;
            slider.selected = false;
            break;
        case 'onBlur':
            bob=4;
        case 'onUpdateData':
            bob=2;
        case 'onInitialized':
            bob=3;
            let obj = evt.treeModel;
        default:
            console.log(evt.eventName);
        }
    }

    nodeClass(node:TreeNode) {
        let mynode:any = node;
        return mynode.comp;
    }

    onInit(tree) {
        const bob = 1;
        this.tree = tree;
        this.trees.push(tree);
    }


    focusIn(cell) {
        let bob = cell;
        console.log("IN ",cell.uniqueID);
    }

    focusOut(cell) {
        let bob = cell;
        console.log("OUT ",cell.uniqueID);
    }

    chgValue(cell) {
        let bob = cell;
    }

    errFunc(err, from) {
        console.log(from,err);
    }

    done(from) {
        console.log(from);
    }

}
