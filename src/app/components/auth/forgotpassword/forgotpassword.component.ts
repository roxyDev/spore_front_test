import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Message, MessageService } from 'primeng/api';
import { SessionService } from 'src/app/service/session.service'
import { MiscService } from 'src/app/service/misc.service'
@Component({
    templateUrl: './forgotpassword.component.html'
})
export class ForgotPasswordComponent
{
    email!: string;
    constructor(private messageService: MessageService, private sessionService:SessionService, private miscService:MiscService, public router: Router)
    {
    }
    send()
    {
        console.log(this.email);
        /*const user = {email: this.email};
        this.sessionService.forgotPassword(user).subscribe
        (
            (data:any) =>
            {
                //console.log(data);
                this.miscService.endRquest();
                this.router.navigate(['/']);

            },
            (error:any) =>
            {
                console.log(error);
                //deshabilito el codigo de detencion
                this.miscService.endRquest();

                if(error.status == 400) //error de peticion
                {
                    if(error.error && error.error.problems) //error general de sails
                    {
                        //concatena los errores del cuerpo del mensaje
                        this.messageService.add({ life:5000, key: 'msg', severity: 'error', summary: error.error.code, detail: error.error.problems.join('\n') });
                    }
                }
                else if(error.status == 401)
                {
                    this.messageService.add({ life:5000, key: 'msg', severity: 'error', summary: 'Error', detail: 'Usuario y/o contraseña incorrecta.' });
                }
                else if(error.status == 403)
                {
                    this.messageService.add({ life:5000, key: 'msg', severity: 'error', summary: 'Error', detail: 'Usuario deshabilitado.' });
                }
                else if(error.status == 404)
                {
                    this.messageService.add({ life:5000, key: 'msg', severity: 'error', summary: 'Error', detail: 'Usuario no registrado.' });
                }
                else if(error.status == 406)
                {
                    this.messageService.add({ life:5000, key: 'msg', severity: 'error', summary: 'Error', detail: 'Cuenta no confirmada.' });
                }
                else // error general
                {
                    this.messageService.add({ life:5000, key: 'msg', severity: 'error', summary: error.name, detail:error.message });
                }
            }
        );*/
    }
}
