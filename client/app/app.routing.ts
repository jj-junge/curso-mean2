import { ModuleWithProviders } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { HomeComponent } from "./components/home.component";
//Import Users
import { UserEditComponent } from "./components/user-edit.component";
//Import Artist
import { ArtistAddComponent } from "./components/artist-add.component";
import { ArtistEditComponent } from "./components/artist-edit.component";
import { ArtistListComponent } from "./components/artist-list.component";
import { ArtistDetail } from "./components/artist-detail.component";
//Import Albums
import { AlbumAdd } from "./components/album-add.component";
import { AlbumEdit } from "./components/album-edit.component";
import { AlbumDetail } from "./components/album-detail.component";
//Import Songs
import { SongAdd } from "./components/song-add.component";
import { SongEdit } from "./components/song-edit.component";

const appRoutes: Routes = [
    { path: '', component: HomeComponent },
    { path: 'mis-datos', component: UserEditComponent },
    { path: 'artist-add', component: ArtistAddComponent },
    { path: 'artists/:page', component: ArtistListComponent },
    { path: 'artist-edit/:id', component: ArtistEditComponent },
    { path: 'artist-detail/:id', component: ArtistDetail },
    { path: 'album-add/:artist', component: AlbumAdd },
    { path: 'album-edit/:id', component: AlbumEdit },
    { path: 'album-detail/:id', component: AlbumDetail },
    { path: 'song-add/:id', component: SongAdd },
    { path: 'song-edit/:id', component: SongEdit }
    //{ path: '**', component: HomeComponent }
];

export const appRoutingProviders: any[] = [];
export const routing: ModuleWithProviders<any> = RouterModule.forRoot(appRoutes)