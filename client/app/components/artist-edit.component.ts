import { Component, OnInit } from "@angular/core";
import { ArtistService } from "../services/artist.service";
import { UserService } from "../services/user.service";
import { User } from "../models/user";
import { Artist } from "../models/artist";
import { GLOBAL } from "../services/global";
import { ActivatedRoute, Params, Router } from "@angular/router";
import { UploadService } from "../services/upload.service";

@Component({
    selector: 'artist-edit',
    templateUrl: '../views/artist-edit.html',
    providers: [UserService, ArtistService]
})

export class ArtistEditComponent implements OnInit {
    public titulo: string;
    public artist: Artist;
    public identity: any;
    public token: any;
    public alertRegister: any;
    public files: Array<File>;
    public url: string;
    public isEdit: boolean;

    constructor(
        private _route: ActivatedRoute,
        private _router: Router,
        private _artistService: ArtistService,
        private _userService: UserService,
        private _uploadService: UploadService
    ) {
        this.titulo = "Actualiza Artista";
        this.identity = this._userService.getIdentity();
        this.token = this._userService.getToken();
        this.artist = new Artist("", "", "", "");
        this.url = GLOBAL.url;
        this.isEdit = true;
        this.alertRegister = "";
    }
    ngOnInit(): void {
        console.log("User-Edit.component.ts Cargado");
        //llamar al método del Api para sacar un artista enbase a su Id getArtist
        this.getArtist();

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

    onSubmit() {
        console.log("Método onSubmit() lanzado correctamente");
        console.log("Lo datos", this.artist);
        this._route.params.forEach((params: Params) => {
            let id = params['id'];
            this._artistService.editArtist(this.token, id, this.artist).subscribe({
                next: (res: any) => {
                    if (!res.artist) {
                        this.alertRegister = "No se pudo guardar los cambios";
                    } else {
                        this.alertRegister = "Artista Actualizado";
                        //subir imagen
                        if (!this.files) {
                            this._router.navigate(['/artist-detail/', id]);
                        } else {
                            this._uploadService.makeFileRequest(this.url + 'upload-image-artist/' + id, [], this.files, this.token, 'image')
                                .then(
                                    (result) => {
                                        this._router.navigate(['/artists', 1]);
                                    },
                                    (error) => {
                                        console.log(error);
                                    }
                                );
                        }

                    }
                },
                error: (response: any) => {
                    console.log(response.error);
                    this.alertRegister = response.error.message;
                }
            }
            );
        });
    }



    fileChangeEvent(fileInput: any) {
        this.files = <Array<File>>fileInput.target.files;
        console.log("Imagen Selected: ", this.files);
    }

    makeFileRequest(url: string, params: Array<string>, files: Array<File>) {
        let token = this.token;

        return new Promise(function (resolve, reject) {
            let formData: any = new FormData();
            let xhr = new XMLHttpRequest();

            for (let i = 0; i < files.length; i++) {
                formData.append('image', files[i], files[i].name);
            }
            xhr.onreadystatechange = function () {
                if (xhr.readyState == 4) {
                    if (xhr.status == 200) {
                        resolve(JSON.parse(xhr.response));
                    } else {
                        reject(xhr.response);
                    }

                }
            }
            xhr.open('POST', url, true);
            xhr.setRequestHeader('authorization', token);
            xhr.send(formData);

        });
    }
}