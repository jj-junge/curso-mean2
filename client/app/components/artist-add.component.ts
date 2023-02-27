import { Component, OnInit } from "@angular/core";
import { Artist } from "../models/artist";
import { UserService } from "../services/user.service";
import { ArtistService } from "../services/artist.service";
import { GLOBAL } from "../services/global";
import { Router, ActivatedRoute } from "@angular/router";


@Component({
    selector: 'artist-add',
    templateUrl: '../views/artist-add.html',
    providers: [UserService, ArtistService]
})

export class ArtistAddComponent implements OnInit {
    public titulo: string;
    public url: string;
    public identity: any;
    public token: any;
    public artist: Artist;
    public alertRegister: any;
    public isEdit: boolean;

    constructor(
        private _userService: UserService,
        private _router: Router,
        private _route: ActivatedRoute,
        private _artistService: ArtistService
    ) {
        this.titulo = "Crear Nuevo artista";
        this.url = GLOBAL.url;
        this.identity = _userService.getIdentity();
        this.token = _userService.getToken();
        this.artist = new Artist("", "", "", "");
        this.isEdit = false;

    }

    ngOnInit(): void {
        console.log("artist-add.component.ts cargado exitosamente");
    }

    onSubmit() {
        console.log("Método onSubmit() lanzado correctamente");
        console.log("Lo datos", this.artist);
        this._artistService.addArtist(this.token, this.artist).subscribe({
            next: (res: any) => {
                let artist = res.artist;
                this.artist = artist;
                if (!artist._id) {
                    this.alertRegister = "Error al registrarse";
                } else {
                    this.alertRegister = "Artista Creado Satisfactoriamente";
                    this.artist = new Artist("", "", "", "");
                    this._router.navigate(['/artist-edit/', artist._id]);
                }
            },
            error: (response: any) => {
                console.log(response.error);
                this.alertRegister = response.error.message;
            }
        });

    }
}