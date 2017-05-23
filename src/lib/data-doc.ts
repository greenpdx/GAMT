import { Input, Output } from '@angular/core';

export class DataDoc {
    keys: any[];
    coll: any[];

    constructor() {}

    setData(data) {

    }

    init() {
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
            }
        );
    }
}
