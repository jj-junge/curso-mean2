import { Component, OnInit } from "@angular/core";
import { Router, ActivatedRoute, Params } from "@angular/router";
import { UserService } from "../services/user.service";
import { GLOBAL } from "../services/global";
import { Artist } from "../models/artist";
import { ArtistService } from "../services/artist.service";


@Component({
    selector: 'artist-list',
    templateUrl: '../views/artist-list.html',
    providers: [UserService]
})

export class ArtistListComponent implements OnInit {
    public titulo: string;
    public artists: Artist[];
    public identity: any;
    public token: any;
    public url: string;
    public next_p: any;
    public prev_p: any;
    public confirmado: any;

    constructor(
        private _route: ActivatedRoute,
        private _router: Router,
        private _userService: UserService,
        private _artistService: ArtistService
    ) {

        this.titulo = 'Artistas';
        this.identity = this._userService.getIdentity();
        this.token = this._userService.getToken();
        this.url = GLOBAL.url;
        this.next_p = 1;
        this.prev_p = 1;

    }

    ngOnInit(): void {
        console.log("Artist-list.Component.ts cargado exitosamente");

        //conseguir el listado de artistas
        this.getArtists();

    }
    getArtists() {
        this._route.params.forEach((params: Params) => {
            let page = +params['page'];
            if (!page) {
                page = 1;
            } else {
                this.next_p = page + 1;
                this.prev_p = page - 1;
                if (this.prev_p == 0) this.prev_p = 1;
            }

            this._artistService.getArtists(this.token, page).subscribe({
                next: (res: any) => {
                    if (!res.artists) {
                        this._router.navigate(['/']);
                    } else {
                        this.artists = res.artists;
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
    onCancelArtist() {
        this.confirmado = null;
    }
    onDeleteArtist(id: string) {
        this._artistService.deleteArtist(this.token, id).subscribe({
            next: (res: any) => {
                if (!res.artist) {
                    alert("Error en el servidor");
                } else {
                    this.getArtists();
                }
            },
            error: (response: any) => {
                console.log(response.error);

            }
        }
        );
    }
}