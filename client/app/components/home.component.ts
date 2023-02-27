import { Component, OnInit } from "@angular/core";
import { Router, ActivatedRoute, Params } from "@angular/router";



@Component({
    selector: 'home',
    templateUrl: '../views/home.html',
    providers: []
})

export class HomeComponent implements OnInit {
    public titulo: string;


    constructor(
        private _route: ActivatedRoute,
        private _router: Router,

    ) {

        this.titulo = 'Bienvenido a MUSIFY';


    }

    ngOnInit(): void {
        console.log("Home.Component.ts cargado exitosamente");

        //conseguir el listado de artistas
    }
}