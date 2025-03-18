import { NgClass } from '@angular/common';
import { Component, ViewChild } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { DatatableComponent, NgxDatatableModule } from '@swimlane/ngx-datatable';
import { debounceTime, fromEvent, Subscription } from 'rxjs';
import { EncryptionService } from '../../../shared/services/encryption/encryption.service';
import { BreadCrumbService } from '../../../shared/services/breadcrumbs/bread-crumb.service';
import { AppComponent } from '../../../app.component';
import { projects } from '../../../shared/models/projects/projects.interface';
import { ProjectService } from '../../../shared/services/project/project.service';
import { CardProjectsComponent } from './card/card-projects.component';
import { environment } from '../../../../environments/environment';
import { pagination_interface } from '../../../shared/models/pagination/pagination.interface';
import { PaginationTableComponent } from '../../../shared/components/pagination/pagination-table.component';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-projects',
  standalone: true,
  imports: [NgxDatatableModule, ReactiveFormsModule, RouterLink, CardProjectsComponent, PaginationTableComponent],
  templateUrl: './projects.component.html',
  styleUrl: './projects.component.scss'
})
export class ProjectsComponent {
  resizeSubscription: Subscription | undefined;
  resizeObserver: ResizeObserver | undefined;
  @ViewChild(DatatableComponent) table!: DatatableComponent;
  public form!: FormGroup;
  public isLoading = true;
  public isSearching = false;
  public filtros!: pagination_interface;
  public projects_data: projects[] = [];
  private searchTimeout: any;
  public typeOrigin: number = 0; //0  = index, 1 = input busqueda
  protected usuarioRol: string = '';

  constructor(private ProjectService: ProjectService,
    private EncryptionService: EncryptionService,
    private Router: Router,
    private BreadCrumbService: BreadCrumbService,
    private AppComponent: AppComponent,
    private fb: FormBuilder
  ) {
    this.usuarioRol = this.EncryptionService.loadData('role');
    this.form = this.fb.group({
      codigo_proyecto: ['', Validators.required
      ],
    })
  }


  ngOnInit() {
    this.index();
    this.resizeSubscription = fromEvent(window, 'resize')
      .pipe(debounceTime(300))
      .subscribe(() => this.recalculateTable());
  }

  index(endpoint: string = `${environment.backend}api/proyecto?page=1`) {
    this.typeOrigin = 0;
    this.isSearching = true;
    if (environment.production) {
      const url = new URL(endpoint);
      if (url.protocol === 'http:') {
        endpoint = endpoint.replace('http:', 'https:');
      }
    }

    this.ProjectService.index(endpoint).subscribe(
      (rs) => {
        this.projects_data = rs.result?.proyectos.data ?? [];
        this.filtros = rs.result?.proyectos;
        const breadcrumbs = [
          // { label: 'Dashboard', url: '/admin/dashboard' },
          { label: 'Talleres', url: '/admin/workshops' },
        ];
        this.BreadCrumbService.setBreadcrumbs(breadcrumbs);
        this.isLoading = false;
        this.isSearching = false;
      })

  }



  ngAfterViewInit() {
    const mainContent = document.getElementById('main-content');
    if (mainContent) {
      this.resizeObserver = new ResizeObserver(() => this.recalculateTable());
      this.resizeObserver.observe(mainContent);
    }
  }



  search() {
    this.isSearching = true;
    const filtros = this.form.value;
    this.typeOrigin = 1;
    this.projects_data = [];

    this.ProjectService.searchCode(filtros.codigo_proyecto).subscribe((rs) => {
      this.isSearching = false;
      if (rs) {
        this.projects_data = rs.result?.proyectos.data ?? [];
        this.filtros = rs.result?.proyectos;

      }

    })

  }

  reset() {
    this.isSearching = false;
    if (this.searchTimeout) {
      clearTimeout(this.searchTimeout);
    }
    const filtros = this.form.value;
    if (filtros.codigo_proyecto.trim() !== '') {
      this.searchTimeout = setTimeout(() => {
        this.search()
      }, 1000)
    } else {
      this.index()
    }
  }



  showDetails(row: any) {
    const fila = this.table._internalRows.find(u => u.id == row.id);
    if (!fila) return;
    this.table.rowDetail.toggleExpandRow(fila);
  }

  recalculateTable(): void {
    if (this.table) {
      this.table.recalculate();
    }
  }


  hasRole(...roles: string[]): boolean {
    return roles.includes(this.usuarioRol);
  }


  ngOnDestroy(): void {
    this.BreadCrumbService.setBreadcrumbs([]);

    if (this.resizeSubscription) {
      this.resizeSubscription.unsubscribe();
    }
    if (this.resizeObserver) {
      this.resizeObserver.disconnect();
    }
  }
}
