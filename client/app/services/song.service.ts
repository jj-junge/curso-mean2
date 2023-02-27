import { Injectable } from "@angular/core";
import { HttpClientModule, HttpRequest, HttpHeaders, HttpClient } from "@angular/common/http";
import { map } from 'rxjs/operators';
import { identity, Observable } from "rxjs";
import { GLOBAL } from "./global";
import { Album } from "../models/album";
import { Song } from "../models/song";

@Injectable({
    providedIn: 'root'
})
export class SongService {
    public url: string;

    constructor(
        private _http: HttpClient
    ) {
        this.url = GLOBAL.url;
    }

    addSong(token: string, song: Song) {
        let params = JSON.stringify(song);
        let headers = new HttpHeaders({
            'Content-Type': 'application/json',
            'authorization': token
        });
        let peticion = this._http.post(this.url + 'song', params, { headers: headers });
        return peticion;
    }
    getSong(token: string, id: string) {
        let peticion;
        let headers = new HttpHeaders({
            'Content-Type': 'application/json',
            'authorization': token
        });

        peticion = this._http.get<any>(this.url + 'song/' + id, { headers: headers });


        return peticion;
    }

    getSongs(token: string, id: any = null) {
        let peticion;
        let headers = new HttpHeaders({
            'Content-Type': 'application/json',
            'authorization': token
        });
        if (id == null) {
            peticion = this._http.get<any>(this.url + 'songs/', { headers: headers });
        } else {
            peticion = this._http.get<any>(this.url + 'songs/' + id, { headers: headers });
        }

        return peticion;
    }

    editSong(token: string, id: string, song: Song) {
        let params = JSON.stringify(song);
        let headers = new HttpHeaders({
            'Content-Type': 'application/json',
            'authorization': token
        });
        let peticion = this._http.put(this.url + 'update-song/' + id, params, { headers: headers });
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