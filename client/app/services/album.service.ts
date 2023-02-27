import { Injectable } from "@angular/core";
import { HttpClientModule, HttpRequest, HttpHeaders, HttpClient } from "@angular/common/http";
import { map } from 'rxjs/operators';
import { identity, Observable } from "rxjs";
import { GLOBAL } from "./global";
import { Album } from "../models/album";
import { User } from "../models/user";

@Injectable({
    providedIn: 'root'
})
export class AlbumService {
    public url: string;

    constructor(
        private _http: HttpClient
    ) {
        this.url = GLOBAL.url;
    }

    addAlbum(token: string, album: Album) {
        let params = JSON.stringify(album);
        let headers = new HttpHeaders({
            'Content-Type': 'application/json',
            'authorization': token
        });
        let peticion = this._http.post(this.url + 'album', params, { headers: headers });
        return peticion;
    }
    getAlbum(token: string, id: string) {
        let peticion;
        let headers = new HttpHeaders({
            'Content-Type': 'application/json',
            'authorization': token
        });

        peticion = this._http.get<any>(this.url + 'album/' + id, { headers: headers });


        return peticion;
    }

    getAlbums(token: string, id: any = null) {
        let peticion;
        let headers = new HttpHeaders({
            'Content-Type': 'application/json',
            'authorization': token
        });
        if (id == null) {
            peticion = this._http.get<any>(this.url + 'albums/', { headers: headers });
        } else {
            peticion = this._http.get<any>(this.url + 'albums/' + id, { headers: headers });
        }

        return peticion;
    }

    editAlbum(token: string, id: string, album: Album) {
        let params = JSON.stringify(album);
        let headers = new HttpHeaders({
            'Content-Type': 'application/json',
            'authorization': token
        });
        let peticion = this._http.put(this.url + 'album/' + id, params, { headers: headers });
        return peticion;
    }

    deleteAlbum(token: string, id: string) {
        let headers = new HttpHeaders({
            'Content-Type': 'application/json',
            'authorization': token
        });
        let peticion = this._http.delete(this.url + 'album/' + id, { headers: headers });
        return peticion;
    }
}