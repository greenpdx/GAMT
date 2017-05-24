import { Input, Output } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export class DataDoc {
    keys: any;
    coll: any;

    constructor() {}

    setData(data) {

    }

    groupData(data) {
        let keys = {};
        let docs = {};

        for (let itm of data) {
            let id = itm._id;
            let agcy = itm.agencycode;
            let buru = itm.bureaucode;
            let acct = itm.acctcode;
            let rec = this.fmtData(itm);
            keys[id] = rec;

            if (agcy == 7) {
                let bob=1;
            }

            if (buru == 10) {
                let bob=1;
            }

            if (docs[itm.agencycode] == undefined) {
                docs[itm.agencycode] = {name: itm.agencyname};
                docs[itm.agencycode][itm.bureaucode] = {name:itm.bureauname};
                docs[itm.agencycode][itm.bureaucode][itm.acctcode] = {name:itm.acctname, ids: [id]};
            } else {
                let l1 = docs[itm.agencycode];
                if (l1[itm.bureaucode] == undefined) {
                    l1[itm.bureaucode] = {name: itm.bureauname}
                    l1[itm.bureaucode][itm.acctcode] =  {name: itm.acctname, ids: [id]};
                } else {
                    let l2 = l1[itm.bureaucode];
                    if (l2[itm.acctcode] == undefined) {
                        l2[itm.acctcode] = {name: itm.acctname, ids: [id]};
                    } else {
                        l2[itm.acctcode].ids.push(id);
                    }
                }
            }
        }
        this.keys = keys;
        this.coll = docs;
        return {keys: keys, docs: docs};
    }

    private fmtData(itm) {
        //itm['chgData'] = new BehaviorSubject({ig:itm._id, evt: "NEW"});
        return itm;
    }

    getRec(id) {
        return this.keys[id];
    }

    getAgency(code, lvl) {
        let tree = [];
        let node = this.coll[code.agencycode];
        for (let i=0;i<lvl;i++) {

        }
    }

    sumTree(node, cb, akey?) {  // object has name and keys, maybe ids
        let me = {name: node.name, sum:0, children:[], "_id": 0};
        let chld = [];
        let id = 0;
        for (let bkey in node) {
            switch(bkey) {
            case 'name':
                break;
            case 'ids':
                for (let k of node.ids) {
                    me.sum += cb(this.keys[k]);
                    id = k;
                }
                break;
            default:
                let rslt = this.sumTree(node[bkey], cb, bkey);
                if (rslt) {
                    me.sum += rslt.sum;
                    id = rslt['_id']+akey;
                    chld.push(rslt);
                }
            }
        }
        if (me.sum == 0) {
            return null;
        }
        me.children = chld.sort((a,b) => {
            return b.sum - a.sum;
        });
        me['_id'] = id;
        me['chg'] = new BehaviorSubject(id);
        me['chg'].subscribe(
            (evt) => {let bob=1;},
            (err) => {console.log(id,err)},
            () => {console.log("DONE ",id)}
        );
        return me;
    }

    bldTree( cb: (node:any) => any) : any {
        let tree = [];
        for (let key in this.coll) {
            let rslt = this.sumTree(this.coll[key],cb,key);
            if (rslt) {
                tree.push(rslt);
            }
        }
        return tree.sort((a,b) => {
            return b.sum - a.sum;
        });
    }
}
