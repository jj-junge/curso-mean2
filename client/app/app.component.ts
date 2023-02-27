import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from "@angular/router";
import { User } from './models/user';
import { UserService } from './services/user.service';
import { HttpClientModule } from '@angular/common/http';
import { FormControl, FormGroup, FormsModule } from '@angular/forms';
import { GLOBAL } from './services/global';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  providers: [UserService]
})
export class AppComponent implements OnInit {
  public title = 'MUSIFY';
  public user: User;
  public user_register: User;
  public identity: any;
  public token: any;
  public errorMessage: any;
  public gethash: any;
  public alertRegister: any;
  public url: string;

  constructor(
    private _userService: UserService,
    private _route: ActivatedRoute,
    private _router: Router,
  ) {
    this.user = new User('', '', '', '', '', 'ROLE_USER', '');
    this.user_register = new User('', '', '', '', '', 'ROLE_USER', '');
    this.url = GLOBAL.url;
  }
  ngOnInit(): void {
    this.identity = this._userService.getIdentity();
    this.token = this._userService.getToken();
    console.log(this.identity);
    console.log(this.token);

  }

  public onSubmit() {
    //const usuario = { email: this.email, password: this.password };
    //console.log("toy submitiando bien");

    let subs = this._userService.signup(this.user).subscribe({
      next: (res: any) => {
        let identity = res.user;
        this.identity = identity;
        if (!this.identity._id) {
          alert("Usuario No Identificado");
        }
        else {
          //Crear elemento en el localStorage para tener al usuario en sesión
          localStorage.setItem('identity', JSON.stringify(identity));

          //Conseguir el Token para enviarlo a cada peticion Http
          console.log("Usuario: Si");
          this.gethash = true;
          this._userService.signup(this.user, this.gethash).subscribe({
            next: (res: any) => {
              let token = res.token;
              this.token = token;
              if (this.token.length <= 0) {
                alert("El token no se ha generado correctamente");

              }
              else {
                //Crear elemento en el localStorage para tener token disponible
                localStorage.setItem('token', token);
                console.log("Token Devuelto: ", token);
                console.log("Identidad: ", identity);
                this.errorMessage = false;
                this.user = new User('', '', '', '', '', 'ROLE_USER', '');
              }

            },
            error: (response: any) => {
              console.log(response.error);
              this.errorMessage = response.error.message;
            }
          }
          );
        }
        console.log("Respuesta: ", res);
        this.errorMessage = false;
      },
      error: (response: any) => {
        console.log(response.error);
        this.errorMessage = response.error.message;
      }
    }
    );
  }


  onSubmitRegister() {
    console.log(this.user_register);
    this._userService.register(this.user_register).subscribe({
      next: (res: any) => {
        let user = res.user;
        this.user_register = user;
        if (!user._id) {
          this.alertRegister = "Error al registrarse";
        } else {
          this.alertRegister = "Usuario Registrado Correctamente, identificate con: " + this.user_register.email;
          this.user_register = new User('', '', '', '', '', 'ROLE_USER', '');
        }
      },
      error: (response: any) => {
        console.log(response.error);
        this.alertRegister = response.error.message;
      }
    }
    );
  }

  logOut() {
    localStorage.clear();
    this.identity = null;
    this.token = null;
    this._router.navigate(['/']);

  }
}