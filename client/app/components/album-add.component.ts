import { Component, OnInit } from "@angular/core";
import { ArtistService } from "../services/artist.service";
import { UserService } from "../services/user.service";
import { User } from "../models/user";
import { Artist } from "../models/artist";
import { GLOBAL } from "../services/global";
import { ActivatedRoute, Params, Router } from "@angular/router";
import { Album } from "../models/album";
import { AlbumService } from "../services/album.service";


@Component({
    selector: 'album-add',
    templateUrl: '../views/album-add.html',
    providers: [UserService, ArtistService, AlbumService]
})

export class AlbumAdd implements OnInit {
    public titulo: string;
    public artist: Artist;
    public identity: any;
    public token: any;
    public files: Array<File>;
    public url: string;
    public album: Album;
    public add: boolean;
    public alertRegister: any;


    constructor(
        private _route: ActivatedRoute,
        private _router: Router,
        private _artistService: ArtistService,
        private _userService: UserService,
        private _albumService: AlbumService
    ) {
        this.titulo = "Crear Nuevo Album";
        this.identity = this._userService.getIdentity();
        this.token = this._userService.getToken();
        this.album = new Album("", "", "", 2023, "", "");
        this.url = GLOBAL.url;
        this.add = false;
        this.alertRegister = null;

    }
    ngOnInit(): void {
        console.log("Album-Add.component.ts Cargado");


    }
    onSubmit() {
        this._route.params.forEach((params: Params) => {
            let id = params['artist'];
            this.album.artist = id;
        });

        this._albumService.addAlbum(this.token, this.album).subscribe({
            next: (res: any) => {
                let album = res.album;
                this.album = album;
                if (!album._id) {
                    this.alertRegister = "Error al registrarse";
                } else {
                    console.log("Album Creado Satisfactoriamente");
                    this.alertRegister = "Album Creado Satisfactoriamente";
                    this._router.navigate(['/album-edit/' + album._id]);
                }
            },
            error: (response: any) => {
                console.log(response.error);
                this.alertRegister = response.error.message;
            }
        });
        console.log("Submitiado", this.album);

    }
    addNew() {
        this.add = true;

    }
    listo() {
        this.add = false;
    }

}