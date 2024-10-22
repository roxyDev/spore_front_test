import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { User } from 'src/app/api/user';
import { UserService } from 'src/app/service/user.service'
import { MiscService } from 'src/app/service/misc.service';
import { ConfirmationService, MessageService, LazyLoadEvent, SelectItem, FilterMatchMode  } from 'primeng/api';
import { environment } from '../../../../environments/environment';
import { forkJoin, of } from 'rxjs';
import { catchError  } from 'rxjs/operators';

@Component({
    templateUrl: './list.users.component.html'
})

export class ListUsersComponent implements OnInit, OnDestroy
{
    fileURL:string = `${environment.apiUrl}/file/download?id=`;

	selectedElements: User[] = [];
    confirmDisplaySelected: boolean = false;
    confirmDisplay: boolean = false;
	content:string;

	totalRows: number = 0;
    limit:number = 10 ;
    page:number  ;
    sort:string = '';
    search:string = '';

	matchModeOptionsText: SelectItem[];
    matchModeOptionsNumber: SelectItem[];
    matchModeOptionsDate: SelectItem[];

	users: User[];
    user: User;

    constructor(private userService: UserService,
		private messageService: MessageService,
		private confirmationService: ConfirmationService,
		private cdref: ChangeDetectorRef, private miscService:MiscService )
	{
    }


    ngOnInit(): void
	{
		//TODO refactorizar este codigo
        this.matchModeOptionsText =
		[

            { label: 'Contiene', value: FilterMatchMode.CONTAINS },
            { label: 'Comienza con', value: FilterMatchMode.STARTS_WITH  },
            { label: 'Termina con', value: FilterMatchMode.ENDS_WITH},
            { label: 'Es igual', value: FilterMatchMode.EQUALS },
        ];
        this.matchModeOptionsNumber =
		[
            { label: 'Contiene', value: FilterMatchMode.CONTAINS },
            { label: 'Es igual', value: FilterMatchMode.EQUALS },
        ];
        this.matchModeOptionsDate =
		[
            { label: 'Contiene', value:  FilterMatchMode.DATE_IS  },
            { label: 'No contiene', value: FilterMatchMode.DATE_IS_NOT },
            { label: 'Antes', value: FilterMatchMode.DATE_BEFORE },
            { label: 'Después', value: FilterMatchMode.DATE_AFTER },
        ];
    }


    ngOnDestroy()
	{
    }

	imageErr()
	{
    }

    load(event: LazyLoadEvent)
	{


        this.page =  (event.first / event.rows) + 1;
        this.limit = event.rows;
        let order: {}[] = [];
        let filter = [];

		event.multiSortMeta.forEach(function (obj)
		{
            let h = {};
            h[obj['field']] = (( obj['order'] == 1) ? "asc": "desc");
            order.push(h);
        });

        this.sort = JSON.stringify(order);

        for(let i in event.filters)
		{

            let obj= event.filters[i];

            if(typeof event.filters[i].value === 'boolean')
			{
                if(event.filters[i].value != null)
				{
                    obj['field'] = i;
                    filter.push(obj);
                }
            }
			else
			{
                if(event.filters[i].value)
				{
                    obj['field'] = i;
                    filter.push(obj);
                }
            }
        }

        this.search =JSON.stringify(filter);
        if(filter.length > 0)
		{
            this.filter(this.search);
        }else
		{
            this.list();
        }


		this.cdref.detectChanges();
    }

    list()
	{

		this.miscService.startRequest();
		this.userService.getAll(this.limit,this.page,this.sort).subscribe((data: any)=>
		{

			if(data != null)
            {

                this.users = data['object']['records'];
                this.totalRows = data['object']['totalRecords'];
				this.miscService.endRquest();
            }
			else
			{
				this.users = null;
				this.totalRows = 0;
				this.miscService.endRquest();
                this.messageService.add({severity:'warn', key: 'msg',summary:'Sin registros',life: 3000});
            }
        },
		err =>
		{
            this.miscService.endRquest();
			this.messageService.add({severity:'error', key: 'msg', summary: "Error al cargar el catalogo", detail:err.message, life: 3000});
        });

    }

    filter(texto: any)
	{
        this.miscService.startRequest();
		this.userService.getFilter(texto,this.limit, this.page,this.sort).subscribe((data: any)=>
		{
			if(data != null)
			{
				this.users = data['object']['records'];
				this.totalRows = data['object']['totalRecords'];
				this.miscService.endRquest();
			}
			else
			{
				this.users = null;
				this.totalRows = 0;
				this.miscService.endRquest();
				this.messageService.add({severity:'warn', key: 'msg',summary:'Sin registros',life: 3000});
			}

		},
		err =>
		{
			this.miscService.endRquest();
			this.messageService.add({severity:'error', key: 'msg', summary: "Error al cargar el catalogo", detail:err.message, life: 3000});
		});
    }

    delete(deleteType:number, object : User) {

        this.confirmationService.confirm({
            message: (deleteType == 1 ? '¿Confirma eliminar los registros seleccionados?' :'¿Confirma eliminar el registro?'),
            header :'Confirmar' ,
            icon: 'pi pi-info-circle',
            acceptLabel: 'Aceptar',
            rejectLabel:'Cancelar',
            accept: () => {
                switch (deleteType) {
                    case 1:
                        this.confirmDeleteSelected();
                        break;
                    case 2 :
                        this.confirmDelete(object.id);
                        break;

                }
            }
        });

    }

    confirmDelete(id:number) {
        this.userService.disable(id).subscribe((data: any)=>{
            this.list();
            this.confirmDisplay = false;
            this.messageService.add({ severity: 'success',key: 'msg', summary: 'Operación exitosa', life: 3000 });

        }, err =>
        {
            this.messageService.add({ severity: 'error',key: 'msg', summary: 'Error al eliminar registro', detail: err.message, life: 3000 });
        });
    }

	confirmDeleteSelected()
	{
        this.confirmDisplaySelected = false;
        var peticiones: any[] = [];


		for(let i = 0 ; i < this.selectedElements.length; i++)
		{
            const ptt = this.userService.disable(this.selectedElements[i].id).pipe
			(
				catchError((error) =>
				{
					this.messageService.add({ life:5000, key: 'msg', severity: 'error', summary: "Error al eliminar el registro", detail:error.message });
					return of(null);
				})
			);
			peticiones.push(ptt);
        }

		forkJoin(peticiones).subscribe((respuestas: any[]) =>
		{
			this.messageService.add({ severity: 'success', key: 'msg',summary: 'Operación exitosa', detail: 'Registro eliminados exitosamente', life: 3000 });
            this.selectedElements = [];
            this.list();
		},
		err =>
		{
			this.messageService.add({ severity: 'error', key: 'msg', summary: 'Error al eliminar registros', detail: err.message, life: 3000 });
		});

    }

	getPageRange(page: number, limit: number, totalRows: number)
    {
        var startIndex = 0;
		var endIndex = 0;

		if (!Number.isInteger(page) || page < 1) {
            page = 1;
        }
        if (!Number.isInteger(limit) || limit < 1) {
            limit = 10;
        }
        if (!Number.isInteger(totalRows) || totalRows < 0) {
            totalRows = 0;
        }

		if(totalRows>0)
		{
			startIndex = (page - 1) * limit + 1;
			endIndex = Math.min(startIndex + limit - 1, totalRows);
		}

		return `Mostrando del ${startIndex} al ${endIndex} de ${totalRows}`;
    }
}
