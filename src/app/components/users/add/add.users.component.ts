import { Component, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { AbstractControlOptions, ValidationErrors, FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { UserService } from 'src/app/service/user.service'; 
import { MiscService } from 'src/app/service/misc.service';
import { FileService } from 'src/app/service/file.service';
import { MessageService  } from 'primeng/api';
import { FileUpload } from 'primeng/fileupload';
import { catchError  } from 'rxjs/operators';
import { forkJoin, of } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
    templateUrl: './add.users.component.html',
	styleUrls: ['./add.users.component.scss'],
})

export class AddUsersComponent 
{
	@ViewChild('fileUpload') fileUpload: FileUpload;
    submitted: boolean = false;
    form: FormGroup | any;
    uploadedFiles: any[] = []; //lista de archivos por cargar
	image: any; //imagen que se muestra en el control
    objectURL: string = '';  //url de la imagen a cargar
	
	constructor(    
        private formBuilder: FormBuilder,
        private userService: UserService,
        private messageService: MessageService,
        private router: Router,		
		private miscService:MiscService,
		private fileService:FileService
		) 
    {}

    ngOnInit(): void 
	{		 
		const formOptions: AbstractControlOptions = { validators: Validators.nullValidator } ;
       
		this.form = this.formBuilder.group
		({
            userFullName: [null,[Validators.required,Validators.maxLength(255)]],
            userEmail: [null, [Validators.required, Validators.maxLength(255), Validators.email]], 
            userPassword: [null,[Validators.required, Validators.maxLength(255), Validators.minLength(6)]],
			userEmailStatus: ['unconfirmed',[Validators.required]],
			useriSAdmin: [false,[Validators.required]],
         }, formOptions);
	}

    ngOnDestroy() 
	{       
    }
	
	//carga el elemento al preview cuando se selecciona una foto
	onUpload(event: any) 
	{
        let file = event.files[0];
        file.objectURL = file.objectURL ? file.objectURL : this.objectURL;

        if (!file.objectURL) 
		{
            return;
        }
        else 
		{
            this.image = file;
            this.objectURL = file.objectURL;
        }
    }

	//se limpia la imagen
    removeImage() 
	{
        this.image = null;
    }
    
    
    
	   
    
	
    
    
	//se intenta guardar la informacion
    onSubmit() 
	{		

		console.log(this.form);

		//this.submitted = true;
        
		if (this.form.invalid )
		{
			return;
        }

		this.miscService.startRequest();
		this.checkEmail();		
    }
	cancel(event) {
		event.preventDefault(); 
		this.router.navigate(['/users']);
	}
	
	checkEmail()
	{
		this.userService.getByEmail(this.form.controls.userEmail.value).subscribe(
		(data:any)=>
		{			
			if(data.data)
			{
				this.miscService.endRquest(); //fin de intento por correo duplicado
				this.messageService.add({ life:5000, key: 'msg', severity: 'warn', summary: "Correo no disponible", detail:"El correo seleccionado ya ha sido usado" });
			}
			else
			{
				this.saveImage(); //el usuario es valido, se inicia el guardado
			}
							
		},
		(error:any)=>
		{			
			this.miscService.endRquest(); 
			this.messageService.add({ life:5000, key: 'msg', severity: 'error', summary: "Error al consultar la disponibilidad del correo", detail:error.message });
		});
	}
	
    //guarda el archivo de imagen al servidor
	saveImage()
	{        
		if(this.image)
		{			
			this.fileService.upload(this.image, 'user_img').subscribe(
			(data:any)=>{
				
				this.saveForm(data.files[0].fd);
			},
			(error:any)=>{
				
				this.miscService.endRquest(); //fin del proceso error de imagen
				this.messageService.add({ life:5000, key: 'msg', severity: 'error', summary: "Error al guardar archivo", detail:error.message });
			});
		}
		else
		{
			this.saveForm();
		}

    }
		
	saveForm(img?:string)
	{
		let userProperties = {};
        
        Object.keys(this.form.value).forEach(element => 
		{
			userProperties[element] = this.form.value[element]; //copia las propiedades del objeto principal
        });
		
		if(img)
			userProperties['userImage'] = img;
		
		console.log(userProperties)
		this.userService.create(userProperties).subscribe(
		(data:any)=>{
			this.miscService.endRquest();
			this.messageService.add({ severity: 'success', key: 'msg', summary: 'Operación exitosa', life: 3000 });
			this.router.navigate(['/users']);
		},
		(error:any)=>{
			
			this.miscService.endRquest(); //fin del proceso por error
			this.messageService.add({ life:5000, key: 'msg', severity: 'error', summary: "Error al guardar registro de usuario", detail:error.message });
		});		
	}


}
