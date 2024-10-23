import { Component, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AbstractControlOptions, ValidationErrors, FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { MiscService } from 'src/app/service/misc.service';
import { UserService } from 'src/app/service/user.service'; 
import { FileService } from 'src/app/service/file.service';
import { MessageService  } from 'primeng/api';
import { FileUpload } from 'primeng/fileupload';
import { SessionService } from 'src/app/service/session.service';

@Component({
    templateUrl: './edit.users.component.html',
	styleUrls: ['./edit.users.component.scss'],
})

export class EditUsersComponent 
{
	@ViewChild('fileUpload') fileUpload: FileUpload;
	branchList: any[]; // = ['..','..'];
	roleList: any[];
	id:number; 	
    submitted: boolean = false;
    form: FormGroup | any;
	formPass: FormGroup | any;
    uploadedFiles: any[] = []; //lista de archivos por cargar
	image: any; //imagen que se muestra en el control
    objectURL: string = '';  //url de la imagen a cargar
	deletedBranches = [];
	myProperty: string;
	originalEmail:string;
	
	constructor(    
        private formBuilder: FormBuilder,
        private userService: UserService,
        private sessionService:SessionService,
        private messageService: MessageService,
        private router: Router,		
		private miscService:MiscService,
		private fileService:FileService,
		private route: ActivatedRoute,
		) 
    {}

    ngOnInit(): void 
	{		 
		this.id = parseInt(this.route.snapshot.params['id']);
		
		const formOptions: AbstractControlOptions = { validators: Validators.nullValidator } ;
       
		this.form = this.formBuilder.group
		({
            id:[this.id, Validators.required],
			userFullName: [null,[Validators.required,Validators.maxLength(255)]],
            userEmail: [null, [Validators.required, Validators.maxLength(255), Validators.email]],
			userEmailStatus: ['unconfirmed',[Validators.required]],
			useriSAdmin: [false,[Validators.required]],
        }, formOptions);
		
		this.myProperty = this.sessionService.getUseriSAdmin();
		
		this.formPass = this.formBuilder.group
		({
			userPassword: [null,[Validators.maxLength(255), Validators.minLength(6)]],
		}, formOptions);
		 
		this.loadData();
	}
	
	loadData()
	{				
		this.miscService.startRequest();
			this.userService.getById(this.id).subscribe(res => 
			{				
				this.objectURL= this.fileService.downloadServer(res.data.userImage);
				this.image = new File([""], '');
				this.image.objectURL = this.objectURL;
				this.originalEmail = res.data.userEmail;
				
				this.form.patchValue(res.data);
				this.miscService.endRquest();				
			},
			err=>
			{
				this.messageService.add({ life:5000, key: 'msg', severity: 'error', summary: "Error al recuperar datos del usuario", detail:err.message });
				this.miscService.endRquest();
			});			
			 
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
			if(data.data && this.originalEmail!=data.data.userEmail ) //el email ya existe y es diferente al original
			{
				console.log("el emial ya existe y no es el original, no pasa");
				
				this.miscService.endRquest(); //fin de intento por correo duplicado
				this.messageService.add({ life:5000, key: 'msg', severity: 'warn', summary: "Correo no disponible", detail:"El correo seleccionado ya ha sido usado" });
			}
			else
			{
				console.log("el email no existe o es el que ya tenia, si pasa");
				
				this.saveImage(); //el usuario es valido, se inicia el guardado
				this.miscService.endRquest();
				this.router.navigate(['/users']);
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
		 
		if(this.image && this.image.name != '')// si existe una imagen y no es la imagen original
		{	
			//TODO deberia eliminar el archivo y cargar el nuevo		
			this.fileService.upload(this.image, 'user_img').subscribe(
			(data:any)=>{
				
				this.updateForm(data.files[0].fd);
			},
			(error:any)=>{
				
				this.miscService.endRquest(); //fin del proceso error de imagen
				this.messageService.add({ life:5000, key: 'msg', severity: 'error', summary: "Error al guardar archivo", detail:error.message });
			});
		}
		else
		{
			this.updateForm();
		}

    }
		
	updateForm(img?:string)
	{
		let userProperties = {};
        
        Object.keys(this.form.value).forEach(element => 
		{
			userProperties[element] = this.form.value[element]; //copia las propiedades del objeto principal
                 
        });
		
		if(img)
			userProperties['userImage'] = img;
		
		if(this.formPass.valid && this.formPass.value.userPassword) //es valido y contiene algo, lo actualizo
		{	
			userProperties['userPassword'] = this.formPass.value.userPassword;
		}
		
		this.userService.update(userProperties).subscribe(
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
