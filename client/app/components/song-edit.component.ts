import { Component, OnInit } from "@angular/core";
import { UserService } from "../services/user.service";
import { User } from "../models/user";
import { GLOBAL } from "../services/global";
import { ActivatedRoute, Params, Router } from "@angular/router";
import { Album } from "../models/album";
import { AlbumService } from "../services/album.service";
import { UploadService } from "../services/upload.service";
import { Song } from "../models/song";
import { SongService } from "../services/song.service";


@Component({
    selector: 'song-edit',
    templateUrl: '../views/song-edit.html',
    providers: [UserService, AlbumService, UploadService, SongService]
})

export class SongEdit implements OnInit {
    public titulo: string;
    public identity: any;
    public token: any;
    public files: Array<File>;
    public url: string;
    public song: Song;
    public add: boolean;
    public alertRegister: any;
    public isEdit: boolean;


    constructor(
        private _route: ActivatedRoute,
        private _router: Router,
        private _userService: UserService,
        private _albumService: AlbumService,
        private _uploadService: UploadService,
        private _songService: SongService
    ) {
        this.titulo = "Editar Cancion";
        this.identity = this._userService.getIdentity();
        this.token = this._userService.getToken();
        this.song = new Song("", 1, "", "", "", "");
        this.url = GLOBAL.url;
        this.add = false;
        this.alertRegister = null;
        this.isEdit = true;

    }
    ngOnInit(): void {
        console.log("Song-Edit.component.ts Cargado");
        //Conseguir el Album
        this.getSong();


    }
    onSubmit() {
        console.log("Método onSubmit() lanzado correctamente");
        //console.log("Lo datos", this.album);
        this._route.params.forEach((params: Params) => {
            let id: string = params['id'];
            this._songService.editSong(this.token, id, this.song).subscribe({
                next: (res: any) => {
                    if (!res.songUpdated) {
                        console.log(res);
                        this.alertRegister = "No se pudo guardar los cambios";
                    } else {
                        this.alertRegister = "Album Actualizado";
                        if (!this.files) {
                            //redirigir al artistas
                            console.log(res.songUpdated);
                            //this._router.navigate(['/artists/', 1]);
                        } else {
                            //subir imagen
                            this._uploadService.makeFileRequest(this.url + '/upload-file-song/' + id, [], this.files, this.token, 'file')
                                .then(
                                    (result) => {
                                        console.log("Response", res);
                                        this._router.navigate(['/album-detail/' + res.songUpdated.album]);

                                    },
                                    (error) => {
                                        console.log(error);
                                    });

                        }
                    }
                },
                error: (response: any) => {
                    console.log(response.error);
                    this.alertRegister = response.error.message;
                }
            });
        });
    }

    getSong() {
        this._route.params.forEach((params: Params) => {
            let id = params['id'];
            console.log("Params", params);
            this._songService.getSong(this.token, id).subscribe({
                next: (res: any) => {
                    console.log("Respuesta que llega:", res);
                    if (!res.song) {
                        // this._router.navigate(['/']);
                    } else {
                        console.log("Cancion: ", res.song);
                        this.song = res.song;
                    }
                },
                error: (res: any) => {
                    console.log(console.error);
                }
            });
        });
    }

    fileChangeEvent(file: any) {
        this.files = <Array<File>>file.target.files;
    }


}