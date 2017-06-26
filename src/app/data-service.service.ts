import { Injectable, EventEmitter, Output, Input } from '@angular/core';
import { Http,
    Response,
    Headers,
    RequestOptions,
    RequestMethod,
    QueryEncoder,
    Request } from '@angular/http';

import { Observable, Subject, BehaviorSubject }     from 'rxjs';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

import { environment } from '../environments/environment';

export class ReqOpts {
    //count: boolean = true;
    skip: number = 0;
    limit: number = 0;
    fields: string[] = null;
    sort: string[] = null;
    //extended_json: boolean = false;
    method: RequestMethod | string = RequestMethod.Get;
}

@Injectable()
export class DataService {
    //private rawUrl = `http://10.0.42.81:8181/docs/local/budget/full`;
    //private rawUrl = `http:/mongodb/full`;
    private rawUrl = environment.DBURL;
    private url: string = "";
    reqOpts: ReqOpts = new ReqOpts();
    alias: string;  // alias
    dbs: string[];  // list of databases
    db: string;     // databse in use
    colls: string[];

    hasAlias: BehaviorSubject<any> = new BehaviorSubject(null);
    hasDb: BehaviorSubject<any> = new BehaviorSubject(null);
    hasColl: BehaviorSubject<any> = new BehaviorSubject(null);

    hasData: Subject<any> = new Subject();


    constructor(private http: Http) {
        this.url = this.rawUrl;
        this.request("","",null).subscribe((alias) => {
        this.alias = alias[0];
        this.hasAlias.next(alias[0]);
        this.request("","", null)
            .subscribe(dbs => this.constcb(dbs as Array<string>));
        });
    }

    constcb(dbs: any) {
          this.dbs = dbs as Array<string>;
          this.hasDb.next(this.dbs);
          this.db = "budget";
          this.request("","",null)
              .subscribe(colls => {
                  this.colls = colls as Array<string>;
                  this.hasColl.next([this.db]);
          });
    }

    doQuery(path, qry: string, rqo?: ReqOpts | any): Observable<Object> {
        if (this.url == "") { return;}
        //let sqry = JSON.parse(qry);
        let jqry = JSON.stringify(qry);
        return this.request(path, qry,rqo);
    }


    private addOpts(rqo?: ReqOpts) {
         let opts = "?";
         let req = this.reqOpts;
         if (!rqo) {
             return "";
         }

         if (rqo.limit) {
             req.limit = rqo.limit;
         }
   //      if (rqo.count) {
   //          req.count = rqo.count;
   //      }
         if (rqo.skip) {

         }
         if (rqo.fields) {

         }
         if (rqo.sort) {

         }
   //      if (rqo.extended_json) {
   //
   //      }

         opts += "limit=" + req.limit;
   //      opts += (req.count == true)? "&count="+ req.count: "";
         opts += (req.skip != 0)? "&skip="+ req.skip: "";
         opts += (req.fields)? "&fields=" + req.fields: "";
         opts += (req.sort)? "&sort=" + req.sort: "";
         return opts;
     }

     private request(path: string, qry: string, rqo: ReqOpts): Observable<Object> {
         let url = this.rawUrl + path;
         url += this.addOpts(rqo);
         url += (qry.length > 0 )? "&query=" + qry: "";
         console.log(url);
         return this.http.request(new Request({
             url: url,
             method: RequestMethod.Get,
             //params: params,
             //search: search
         }))
            .map(this.extractData)
            .catch(this.handleError);
    }

    private extractData(res: Response): string[] {
        let rslt = res.json();
        return rslt.data || {};
    }

    private handleError(error: Response | any) {
       // In a real world app, you might use a remote logging infrastructure
       let errMsg: string;
       if (error instanceof Response) {
           const body = error.json() || '';
           const err = body.error || JSON.stringify(body);
           errMsg = `${error.status} - ${error.statusText || ''} ${err}`;
       } else {
           errMsg = error.message ? error.message : error.toString();
       }
       console.error(errMsg);
       //return Observable.throw(errMsg);
       return errMsg;
   }
}
