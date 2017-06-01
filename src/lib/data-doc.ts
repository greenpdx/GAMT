import { Input, Output } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

const enum DATA_ACTION {
    HOVER,
    UNHOVER,
    SELECT,
    UNSELECT,
    CHGVALUE,
    CONTEXT,
    EXPAND
}

interface IDataAction {
    action: string;
    data: any;
    id: any;
}

export class DataAction implements IDataAction {
    protected _action: string;
    protected _data: any;
    protected _id: any;

    get action(): string {
        return this._action;
    }
    set action(act) {
        this._action = act;
    }
    get data(): any {
        return this._data;
    }
    set data(data) {
        this._data = data;
    }
    get id(): any {
        return this._id;
    }
    set id(id) {
        this._id = id;
    }
}

export class DataNode extends BehaviorSubject<any> {
    name: string;
    sum: number = 0;
    children: DataNode[] = [];
    _id: any;

    constructor(name: string, id: any) {
        super({action:'init',data:id});
        this.name = name;
        this._id = id;
    }
}

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
        let me: DataNode;
        let sum = 0;
        let chld = [];
        let id = 0;
        for (let bkey in node) {
            switch(bkey) {
            case 'name':
                break;
            case 'ids':
                for (let k of node.ids) {
                    sum += cb(this.keys[k]);
                    id = k;
                }
                break;
            default:
                let rslt = this.sumTree(node[bkey], cb, bkey);
                if (rslt) {
                    sum += rslt.sum;
                    id = rslt['_id']+akey;
                    chld.push(rslt);
                }
            }
        }
        if (sum == 0) {
            return null;
        }
        me = new DataNode(node.name, id);
        me.children = chld.sort((a,b) => {
            return b.sum - a.sum;
        });
        me.sum = sum;
        me.subscribe(
            (evt) => {this.debug(evt);},
            (err) => {console.log(id,err)},
            () => {console.log("DONE ",id)}
        );
        return me;
    }

    debug(evt) {
        console.log(evt);
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
