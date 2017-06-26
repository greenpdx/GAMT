import { Component, OnInit, ViewChild } from '@angular/core';

import { DataService } from '../data-service.service';
import { DataDoc } from '../../lib/data-doc';
import { Three3dComponent } from './three3d.component';

@Component({
  selector: 'budget',
  templateUrl: './budget.component.html',
  styles: []
})
export class BudgetComponent implements OnInit {
    @ViewChild('three3d') three3d: Three3dComponent;

    tree: any;
    trees: any;
    nodes = [];
    keys: any[];


    event: any;
    initalizied: any;
    //    options: any = { nodeClass: (node:TreeNode) => this.nodeClass(node), idField: '_id'};
    options: any = { idField: '_id'};

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

    ngOnInit() {
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
        let dd = new DataDoc(this.three3d);
        //data = data.slice(0,1);

        let tdoc = dd.groupData(data);
        let tree = dd.bldTree(this.tst);

        this.buildGrid(tree);
    }

    buildGrid(doc) {
        let conf = {'cells':doc };
        this.nodes = doc;
        this.three3d.buildGrid(conf);
//        this.treeNodes = alph;
//        this.tree.treeModel.update();
    }




}
