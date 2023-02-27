import { Component, OnInit } from "@angular/core";
import { UserService } from "../services/user.service";
import { GLOBAL } from "../services/global";
import { ActivatedRoute, Params, Router } from "@angular/router";
import { Album } from "../models/album";
import { AlbumService } from "../services/album.service";
import { Song } from "../models/song"
import { SongService } from "../services/song.service";

@Component({
    selector: 'song-add',
    templateUrl: '../views/song-add.html',
    providers: [UserService, AlbumService, SongService]
})

export class SongAdd implements OnInit {
    public titulo: string;
    public identity: any;
    public token: any;
    public files: Array<File>;
    public url: string;
    public album: any;
    public add: boolean;
    public alertRegister: any;
    public song: Song;
    public id: string;


    constructor(
        private _route: ActivatedRoute,
        private _router: Router,
        private _userService: UserService,
        private _albumService: AlbumService,
        private _songService: SongService
    ) {
        this.titulo = "Añadir Canción";
        this.identity = this._userService.getIdentity();
        this.token = this._userService.getToken();
        this.song = new Song("", 1, "", "", "", "");
        this.url = GLOBAL.url;
        this.add = false;
        this.alertRegister = null;



    }
    ngOnInit(): void {
        console.log("Song-Add.component.ts Cargado");
        this._route.params.forEach((params: Params) => {
            this.id = params['id'];
            this.song.album = this.id;
        });
        //Cargar Info del Album***********************************
        this._albumService.getAlbum(this.token, this.id).subscribe({//*
            next: (res: any) => {
                console.log("obteniendo album", res)
                if (!res.album) {
                    this._router.navigate(['/']);
                } else {
                    this.album = res.album;
                }
            },
            error: (response: any) => {
                console.log(response.error);
                //this.alertUpdate = response.error.message;
            }
        }
        );

        console.log("El Albun en SongADD", this.album);
        //*****************************************************
    }
    onSubmit() {

        // alert("Bacano Boton Guardar Funcionando chulo");
        console.log(this.song);

        this._songService.addSong(this.token, this.song).subscribe({
            next: (res: any) => {
                let song = res.song;
                this.song = song;
                if (!song._id) {
                    this.alertRegister = "Error al registrarse";
                } else {
                    console.log("Cancion Creada Satisfactoriamente");
                    this.alertRegister = "Cancion Creada Satisfactoriamente";
                    this._router.navigate(['/song-edit/' + song._id]);
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