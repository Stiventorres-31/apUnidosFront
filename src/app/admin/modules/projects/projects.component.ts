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

@Component({
  selector: 'app-projects',
  standalone: true,
  imports: [NgxDatatableModule, RouterLink, CardProjectsComponent, PaginationTableComponent],
  templateUrl: './projects.component.html',
  styleUrl: './projects.component.scss'
})
export class ProjectsComponent {
  resizeSubscription: Subscription | undefined;
  resizeObserver: ResizeObserver | undefined;
  @ViewChild(DatatableComponent) table!: DatatableComponent;
  public isLoading = true;
  public isSearching = false;
  public filtros!: pagination_interface;
  public projects_data: projects[] = [];

  public typeOrigin: number = 0; //0  = index, 1 = input busqueda

  constructor(private ProjectService: ProjectService, private EncryptionService: EncryptionService, private Router: Router, private BreadCrumbService: BreadCrumbService, private AppComponent: AppComponent
  ) { }


  ngOnInit() {
    this.index();
    this.resizeSubscription = fromEvent(window, 'resize')
      .pipe(debounceTime(300))
      .subscribe(() => this.recalculateTable());
  }

  index(endpoint: string = `${environment.backend}api/proyecto?page=1`) {
    this.isSearching = true;
    if (environment.production) {
      const url = new URL(endpoint);
      if (url.protocol === 'http:') {
        endpoint = endpoint.replace('http:', 'https:');
      }
    }

    this.ProjectService.index(endpoint).subscribe(
      (rs) => {
        this.projects_data = rs.result.proyectos.data ?? [];
        this.filtros = rs.result.proyectos;
        const breadcrumbs = [
          { label: 'Dashboard', url: '/admin/dashboard' },
          { label: 'Proyectos', url: '/admin/projects' },
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



  filter(event: Event) { }




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
