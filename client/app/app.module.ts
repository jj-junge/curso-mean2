import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HttpClientModule } from '@angular/common/http';
import { UserEditComponent } from './components/user-edit.component';
import { User } from './models/user';
import { routing, appRoutingProviders } from './app.routing';
import { ArtistListComponent } from './components/artist-list.component';
import { HomeComponent } from './components/home.component';
import { ArtistAddComponent } from './components/artist-add.component';
import { ArtistEditComponent } from './components/artist-edit.component';
import { ArtistDetail } from './components/artist-detail.component';
import { AlbumAdd } from './components/album-add.component';
import { Album } from './models/album';
import { AlbumEdit } from './components/album-edit.component';
import { AlbumDetail } from './components/album-detail.component';
import { SongAdd } from './components/song-add.component';
import { SongEdit } from './components/song-edit.component';



@NgModule({
  declarations: [
    AppComponent,
    UserEditComponent,
    ArtistListComponent,
    HomeComponent,
    ArtistAddComponent,
    ArtistEditComponent,
    ArtistDetail,
    AlbumAdd,
    AlbumEdit,
    AlbumDetail,
    SongAdd,
    SongEdit
  ],
  imports: [
    FormsModule,
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    routing
  ],
  providers: [appRoutingProviders],
  bootstrap: [AppComponent]
})
export class AppModule { }
