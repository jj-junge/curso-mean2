import { Component, OnInit } from "@angular/core";
import { UserService } from "../services/user.service";
import { User } from "../models/user";
import { GLOBAL } from "../services/global";
import { ActivatedRoute, Params, Router } from "@angular/router";
import { Album } from "../models/album";
import { AlbumService } from "../services/album.service";
import { UploadService } from "../services/upload.service";


@Component({
    selector: 'album-edit',
    templateUrl: '../views/album-edit.html',
    providers: [UserService, AlbumService, UploadService]
})

export class AlbumEdit implements OnInit {
    public titulo: string;
    public identity: any;
    public token: any;
    public files: Array<File>;
    public url: string;
    public album: Album;
    public add: boolean;
    public alertRegister: any;
    public isEdit: boolean;


    constructor(
        private _route: ActivatedRoute,
        private _router: Router,
        private _userService: UserService,
        private _albumService: AlbumService,
        private _uploadService: UploadService
    ) {
        this.titulo = "Editar Album";
        this.identity = this._userService.getIdentity();
        this.token = this._userService.getToken();
        this.album = new Album("", "", "", 2023, "", "");
        this.url = GLOBAL.url;
        this.add = false;
        this.alertRegister = null;
        this.isEdit = true;

    }
    ngOnInit(): void {
        console.log("Album-Edit.component.ts Cargado");
        //Conseguir el Album
        this.getAlbum();


    }
    onSubmit() {
        console.log("Método onSubmit() lanzado correctamente");
        //console.log("Lo datos", this.album);
        this._route.params.forEach((params: Params) => {
            let id: string = params['id'];
            this._albumService.editAlbum(this.token, id, this.album).subscribe({
                next: (res: any) => {
                    if (!res.albumUpdated) {
                        console.log(res);
                        this.alertRegister = "No se pudo guardar los cambios";
                    } else {
                        this.alertRegister = "Album Actualizado";
                        if (!this.files) {
                            //redirigir al artistas
                            console.log(res.albumUpdated.artist._id);
                            //this._router.navigate(['/artists/', 1]);
                        } else {
                            //subir imagen
                            this._uploadService.makeFileRequest(this.url + 'upload-image-album/' + id, [], this.files, this.token, 'image')
                                .then(
                                    (result) => {
                                        this._router.navigate(['/artist-detail/', res.albumUpdated.artist]);

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

    getAlbum() {
        this._route.params.forEach((params: Params) => {
            let id = params['id'];
            this._albumService.getAlbum(this.token, id).subscribe({
                next: (res: any) => {
                    console.log("Respuesta que llega:", res);
                    if (!res.album) {
                        // this._router.navigate(['/']);
                    } else {
                        this.album = res.album;
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