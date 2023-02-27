import { Injectable } from "@angular/core";
import { HttpClientModule, HttpResponse, HttpHeaders, HttpClient } from "@angular/common/http";
import { map } from 'rxjs/operators';
import { identity, Observable } from "rxjs";
import { GLOBAL } from "./global";
import { User } from "../models/user";

@Injectable({
    providedIn: 'root'
})
export class UserService {
    public identity: any;
    public token: any;
    public url: string;

    constructor(
        private _http: HttpClient
    ) {
        this.url = GLOBAL.url;
    }

    signup(user_to_login: any, gethash = null): Observable<any> {
        //console.log("Que llega:", user_to_login);
        if (gethash) {
            user_to_login.gethash = gethash;
        }
        let headers = new HttpHeaders().set('Content-Type', 'application/json');

        let json = JSON.stringify(user_to_login);
        //console.log("Que sale? MIlet json:", json);
        let params = json;
        //let headers = new Headers({ 'content-Type': `application/json` });
        let peticion = this._http.post(this.url + 'login', params, { headers: headers });
        // console.log("La peticion resp:", peticion);
        return peticion;
    }

    register(user_to_register: any) {
        let headers = new HttpHeaders().set('Content-Type', 'application/json');
        let json = JSON.stringify(user_to_register);
        let params = json;
        let peticion = this._http.post(this.url + 'register', params, { headers: headers });

        return peticion;
    }

    update(user_to_update: any) {
        let headers = new HttpHeaders({
            'Content-Type': 'application/json',
            'authorization': this.getToken()
        });

        console.log("La cabecera:", headers);
        let json = JSON.stringify(user_to_update);
        let params = json;
        let peticion = this._http.put(this.url + 'update-user/' + user_to_update._id, params, { headers: headers });
        return peticion;
    }

    getIdentity() {
        let algo: any = localStorage.getItem("identity");
        let identity = JSON.parse(algo);

        if (identity != 'undefined') {
            this.identity = identity;
        } else {
            this.identity = null;
        }
        return this.identity;
    }

    getToken() {
        let token = localStorage.getItem("token");
        if (token != 'undefined') {
            this.token = token;
        } else {
            this.token = null;
        }
        return this.token;
    }

}

//Como obtener datos por post con httpCLient?
