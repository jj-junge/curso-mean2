import { Component, OnInit } from "@angular/core";
import { UserService } from "../services/user.service";
import { User } from "../models/user";
import { GLOBAL } from "../services/global";

@Component({
    selector: 'user-edit',
    templateUrl: '../views/user-edit.html',
    providers: [UserService]
})

export class UserEditComponent implements OnInit {
    public title: string;
    public user: User;
    public identity: any;
    public token: any;
    public alertUpdate: any;
    public files: Array<File>;
    public url: string;

    constructor(
        private _userService: UserService
    ) {
        this.title = "Mi perfil";
        this.identity = this._userService.getIdentity();
        this.token = this._userService.getToken();
        this.user = this.identity;
        this.url = GLOBAL.url;
    }
    ngOnInit(): void {
        console.log("User-Edit.component.ts Cargado");

    }

    onSubmit() {
        console.log('Datos New: ', this.user);
        this._userService.update(this.user).subscribe({
            next: (res: any) => {
                let user = res.user;
                //this.user = user;
                //console.log('Datos de res.user: ', this.user);
                if (!user._id) {
                    this.alertUpdate = "Error al registrarse";
                } else {
                    localStorage.setItem('identity', JSON.stringify(this.user));
                    let span: HTMLElement | null = document.getElementById('identity_name');
                    if (span != null) {
                        span.innerHTML = this.user.name;
                    } else {
                        console.log("Item Null");
                    }
                    if (!this.files) {
                        //Redireccion
                    } else {
                        this.makeFileRequest(this.url + "/upload-image-user/" + this.user._id, [], this.files).then(
                            (result: any) => {
                                this.user.image = result.image;
                                localStorage.setItem('identity', JSON.stringify(this.user));

                                let i_path = this.url + 'get-image-user/' + this.user.image;
                                let thumb: HTMLElement | null = document.getElementById('image-logged');
                                if (thumb != null) {
                                    thumb.setAttribute('src', i_path);
                                } else {
                                    console.log("Item Null");
                                }
                            }
                        );
                    }
                    this.alertUpdate = "Usuario Actualizado Exitosamente";

                }
            },
            error: (response: any) => {
                console.log(response.error);
                this.alertUpdate = response.error.message;
            }
        }
        );

    }



    fileChangeEvent(fileInput: any) {
        this.files = <Array<File>>fileInput.target.files;
        //console.log("Imagen Selected: ", this.files);
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