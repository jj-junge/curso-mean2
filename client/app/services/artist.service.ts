import { Injectable } from "@angular/core";
import { HttpClientModule, HttpRequest, HttpHeaders, HttpClient } from "@angular/common/http";
import { map } from 'rxjs/operators';
import { identity, Observable } from "rxjs";
import { GLOBAL } from "./global";
import { Artist } from "../models/artist";
import { User } from "../models/user";

@Injectable({
    providedIn: 'root'
})
export class ArtistService {
    public url: string;

    constructor(
        private _http: HttpClient
    ) {
        this.url = GLOBAL.url;
    }

    addArtist(token: string, artist: Artist) {
        let params = JSON.stringify(artist);
        let headers = new HttpHeaders({
            'Content-Type': 'application/json',
            'authorization': token
        });
        let peticion = this._http.post(this.url + 'artist', params, { headers: headers });
        return peticion;
    }
    getArtists(token: string, page: any) {
        let headers = new HttpHeaders({
            'Content-Type': 'application/json',
            'authorization': token
        });
        let peticion = this._http.get<any>(this.url + 'artists/' + page, { headers: headers });
        return peticion;


    }
    getArtist(token: string, id: string) {
        let headers = new HttpHeaders({
            'Content-Type': 'application/json',
            'authorization': token
        });
        let peticion = this._http.get<any>(this.url + 'artist/' + id, { headers: headers });
        return peticion;


    }
    editArtist(token: string, id: string, artist: Artist) {
        let params = JSON.stringify(artist);
        let headers = new HttpHeaders({
            'Content-Type': 'application/json',
            'authorization': token
        });
        let peticion = this._http.put(this.url + 'artist/' + id, params, { headers: headers });
        return peticion;
    }
    deleteArtist(token: string, id: string) {
        let headers = new HttpHeaders({
            'Content-Type': 'application/json',
            'authorization': token
        });
        let peticion = this._http.delete(this.url + 'artist/' + id, { headers: headers });
        return peticion;


    }
}