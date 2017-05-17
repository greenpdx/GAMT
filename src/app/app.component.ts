import { Component, ViewChild } from '@angular/core';

import * as Nedb from 'nedb';

import { DataService } from './data-service.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [DataService]
})
export class AppComponent {
    title = 'U.S. Budget 2016, Discretionary';
    code = "github.com/greenpdx/GAMT";
    @ViewChild('three3d') three3d: any;
    dataDB: Nedb;
    docs: Nedb;

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
                    rslt = rslt.sort((x,y) => {
                        return y.sum - x.sum;
                    });

                    self.buildGrid(rslt);
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
        let agcy: any = {'code':-1};
        let buru: any = {'code':-1};
        let acct: any = {'code':-1};
        let subs: any = {'code':-1};

        for (let itm of data) {
            let val = itm['2016'];
            subs = { 'code': itm.subfunccode,
                'name': itm.subfunctitle,
                'sum': val,
                '_id': itm._id,
                'tcode': itm.treasurycode,
                'nf': itm.onoffbudget,
                'bea': itm.beacat};
            //if (itm.subfunccode != subs.code) {
            //} else {
            //    console.log('MORE subs');
            //}
            //  use loop with idxs
            if (itm.acctcode != acct.code) {
                acct = { 'code': itm.acctcode, 'name': itm.acctname, 'sum': val, 'subs': [ subs ], '_id':itm._id};
            } else {
                acct.subs.push(subs);
                acct.sum += val;
            }
            if (itm.bureaucode != buru.code) {
                buru = { 'code': itm.bureaucode, 'name': itm.bureauname, 'sum': val, 'acct': [ acct ], '_id': itm._id };
            } else {
                buru.acct.push(acct);
                buru.sum += val;
            }
            if (agcy.code != itm.agencycode) {
                agcy = { 'code': itm.agencycode, 'name': itm.agencyname, 'sum': val, 'buru': [ buru ], '_id': itm._id };
                doc.push(agcy);
            } else {
                agcy.buru.push(buru);
                agcy.sum += val;
            }
        }
        this.docs.insert(doc, function(err,doc) {
            if (err) {
                console.log("ins ",err);
                return;
            }
        });
        return doc;
    }

    buildGrid(doc) {
        let conf = {'cells':doc };
        this.three3d.buildGrid(conf);
//        this.treeNodes = alph;
//        this.tree.treeModel.update();
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
