import { Component, OnInit } from "@angular/core";
import { User } from "../models/user";
import { Artist } from "../models/artist";
import { HttpClient } from "@angular/common/http";
import { UserService } from "../services/user.service";
import { ArtistService } from "../services/artist.service";
import { ActivatedRoute, Params, Router } from "@angular/router";
import { GLOBAL } from "../services/global";
import { Album } from "../models/album";
import { AlbumService } from "../services/album.service";


@Component({
    selector: 'artist-detail',
    templateUrl: '../views/artist-detail.html',
    providers: [ArtistService, UserService, AlbumService]
})

export class ArtistDetail implements OnInit {

    public artist: Artist;
    public identity: any;
    public token: any;
    public alertRegister: any;
    public files: Array<File>;
    public url: string;
    public albums: Album[];
    public confirmado: any;

    constructor(
        private _route: ActivatedRoute,
        private _router: Router,
        private _artistService: ArtistService,
        private _userService: UserService,
        private _albumService: AlbumService
    ) {

        this.identity = this._userService.getIdentity();
        this.token = this._userService.getToken();
        this.url = GLOBAL.url;
        this.alertRegister = "";
        this.confirmado = null;
    }
    ngOnInit(): void {
        console.log("Componente de  Detalle del Artista cargado exitosamente");
        this.getArtist();
        //this.getAlbums();
    }
    getArtist() {
        this._route.params.forEach((params: Params) => {
            let id = params['id'];
            this._artistService.getArtist(this.token, id).subscribe({
                next: (res: any) => {
                    if (!res.artist) {
                        this._router.navigate(['/']);
                    } else {
                        this.artist = res.artist;
                        // sacar los albunes del artista
                        this._albumService.getAlbums(this.token, res.artist._id).subscribe({
                            next: (res: any) => {
                                console.log("Respuesta de Albums: ", res);
                                if (!res.albums) {
                                    //this._router.navigate(['/']);
                                    console.log("No hay Albums del artista: ");
                                } else {
                                    console.log("Albums Cargados Bien");
                                    this.albums = res.albums;
                                }
                            },
                            error: (response: any) => {
                                console.log(response.error);
                                //this.alertUpdate = response.error.message;
                            }
                        });
                    }
                },
                error: (response: any) => {
                    console.log(response.error);
                    //this.alertUpdate = response.error.message;
                }
            }
            );
        });
    }

    getAlbums() {
        this._route.params.forEach((params: Params) => {
            let id = params['id'];
            this._albumService.getAlbums(this.token, id).subscribe({
                next: (res: any) => {
                    if (!res.album) {
                        this._router.navigate(['/']);
                    } else {
                        this.albums = res.album;
                    }
                },
                error: (response: any) => {
                    console.log(response.error);
                    //this.alertUpdate = response.error.message;
                }
            }
            );
        });
    }
    onDeleteConfirm(id: string) {
        this.confirmado = id;
        console.log("activando borrar este es el id: ", id);
        return id;
    }
    onCancelAlbum() {
        this.confirmado = null;
    }
    onDeleteAlbum(id: string) {
        this._albumService.deleteAlbum(this.token, id).subscribe({
            next: (res: any) => {
                //console.log("respuesta al borrar", res);
                if (!res.album) {
                    alert("Error en el servidor");
                } else {
                    this.getAlbums();
                }
            },
            error: (response: any) => {
                console.log(response.error);

            }
        }
        );
    }

}