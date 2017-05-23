import { Component, ViewChild } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { TreeModel, TreeVirtualScroll, TreeNode, IActionMapping, ITreeOptions, KEYS, TREE_ACTIONS } from 'angular2-tree-component';
import * as Nedb from 'nedb';

import { DataService } from './data-service.service';
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
    title = 'U.S. Budget 2016, Discretionary';
    code = "github.com/greenpdx/GAMT";
    @ViewChild('three3d') three3d: any;
    dataDB: Nedb;
    docs: Nedb;
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

        this.dataDB = new Nedb(nedbOpts);
        this.docs = new Nedb(nedbOpts);
    }

    init(data) {
        let self = this;
        this.dataDB.insert(data, function(err, data) {
        if (err) {
            console.log("Data Load Error ",err);
            return;
        }
        self.dataDB.ensureIndex({fieldName: 'agencycode'}, function(err){})
        self.dataDB.ensureIndex({fieldName: 'bureaucode'}, function(err){})
        self.dataDB.ensureIndex({fieldName: 'acctcode', sparse: true}, function(err){})
        self.dataDB.ensureIndex({fieldName: 'beacat'}, function(err){})
        self.dataDB.find({'beacat':'Discretionary'})
            .sort({'agencyname': 1, 'bureauname': 1, 'acctname': 1}).exec(
                function(err,doc) {
                    let rslt = self.parseData(self,doc);
                    self.keys = rslt.keys;
                    self.docs.insert(rslt.doc, function(err, data) {
                        if (err) {
                            console.log('docs insert ',err)
                        }
                    });
                    let grid = rslt.doc.sort((x,y) => {
                        return y.sum - x.sum;
                    });



                    self.buildGrid(grid);
            });
        });
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

    parseData(self, data) {
        let doc = [];
        let key = [];
        let agcy: any = {'code':-1};
        let buru: any = {'code':-1};
        let acct: any = {'code':-1};
        let sub: any = {'code':-1};

        for (let itm of data) {
            let val = itm['2016'];
            sub = { 'code': itm.subfunccode,
                'name': itm.subfunctitle,
                'sum': val,
                '_id': itm._id,
                'tcode': itm.treasurycode,
                'nf': itm.onoffbudget,
                'bea': itm.beacat,
                'selIn': new BehaviorSubject(null),
                'selOut': new BehaviorSubject(null),
                'chgVal': new BehaviorSubject(null)};

            key[itm._id] = sub;
            if (itm.onoffbudget != 'On-budget') {
                let bob=1;
                continue;
            }

            let tagcy = { 'code': itm.agencycode, 'name': itm.agencyname, 'sum': val,
                children: [], 'sub': sub, '_id': "A"+itm._id, ttop:null };
            let tacct = { 'code': itm.acctcode, 'name': itm.acctname, 'sum': val,
                children: [], 'sub': sub, '_id': "C"+itm._id, ttop: agcy};
            let tburu = { 'code': itm.bureaucode, 'name': itm.bureauname, 'sum': val,
                children: [], 'sub': sub, '_id': "B"+itm._id, ttop: agcy};

            if (agcy.code != itm.agencycode) {
                agcy = tagcy;
                buru = tburu;
                acct = tacct;
                doc.push(agcy);
            } else if (buru.code != itm.bureaucode) {
                agcy.children.push(buru);
                acct = tacct;
                buru = tburu;
                agcy.sum += val;
            } else if (acct.code != itm.acctcode) {
                buru.children.push(acct);
                acct = tacct;
                buru.sum += val;
                agcy.sum += val;
            } else {
                acct.sub = sub;
                acct.sum += val;
                buru.sum += val;
                agcy.sum += val;
            }
        }
        return { keys: key, doc: doc};
    }

    getRec(id) {
        this.dataDB.find({_id:id}).exec(
            function(err,doc) {
                if(err) {console.log("getRec",err)}
                let bob=1;
            });

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
