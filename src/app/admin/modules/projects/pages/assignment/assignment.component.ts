import { Component, ViewChild } from '@angular/core';
import { inmueble } from '../inmuebles/models/inmuebles.interface';
import { debounceTime, fromEvent, Subscription } from 'rxjs';
import { BreadCrumbService } from '../../../../../shared/services/breadcrumbs/bread-crumb.service';
import { ActivatedRoute, Router } from '@angular/router';
import { EncryptionService } from '../../../../../shared/services/encryption/encryption.service';
import { ProjectService } from '../../../../../shared/services/project/project.service';
import { projects } from '../../../../../shared/models/projects/projects.interface';
import { DatatableComponent, NgxDatatableModule } from '@swimlane/ngx-datatable';

@Component({
  selector: 'app-assignment',
  standalone: true,
  imports: [NgxDatatableModule],
  templateUrl: './assignment.component.html',
  styles: ''
})
export class AssignmentComponent {
  resizeSubscription: Subscription | undefined;
  resizeObserver: ResizeObserver | undefined;
  @ViewChild(DatatableComponent) table!: DatatableComponent;
  public isLoading: boolean = true;
  public projects!: projects;
  protected usuarioRol: string = '';
  constructor(
    private ProjectService: ProjectService,
    private EncryptionService: EncryptionService,
    private router: Router,
    private parametros: ActivatedRoute,
    private BreadCrumbService: BreadCrumbService,
  ) {
    this.usuarioRol = this.EncryptionService.loadData('role');
  }



  ngOnInit() {
    this.parametros.params.subscribe((params) => {
      if (params['id']) {
        const id = this.EncryptionService.decrypt(params['id']);
        if (!id) {
          this.router.navigate(['/admin/workshops']);
          return;
        }

        this.ProjectService.assignment(id).subscribe((rs) => {
          if (rs) {

            this.isLoading = false;
            this.projects = rs;

            const breadcrumbs = [
              // { label: 'Dashboard', url: '/admin/dashboard' },
              { label: 'Talleres', url: '/admin/workshops/' },
              { label: 'Vehiculos', url: '/admin/workshops/assignment/' + this.EncryptionService.encrypt(`${rs.codigo_proyecto}`) },
              { label: rs.codigo_proyecto + ' - ' + rs.ciudad_municipio_proyecto + ', ' + rs.departamento_proyecto, url: '/admin/workshops/assignment/' },

            ];

            this.BreadCrumbService.setBreadcrumbs(breadcrumbs);


          } else {
            this.router.navigate(['/admin/workshops']);
            return;
          }

        });
      } else {
        this.router.navigate(['/admin/workshops']);
        return;


      }
    });

    this.resizeSubscription = fromEvent(window, 'resize')
      .pipe(debounceTime(300))
      .subscribe(() => this.recalculateTable());
  }

  ngAfterViewInit() {
    const mainContent = document.getElementById('main-content');
    if (mainContent) {
      this.resizeObserver = new ResizeObserver(() => this.recalculateTable());
      this.resizeObserver.observe(mainContent);
    }
  }

  assignments() {
    this.router.navigate(["/admin/workshops/assignments/", this.EncryptionService.encrypt(`${this.projects.codigo_proyecto}`)])
  }

  view(row: inmueble) {
    this.router.navigate(["/admin/vehicles/view/assignment/", this.EncryptionService.encrypt(`${row.id}`)])

  }

  parseDecimal(value: string | number): number {
    if (typeof value === 'string') {
      value = value.replace(/\./g, '').replace(/,/g, '.');
      return parseFloat(value);
    }
    return value;
  }

  pipeMoney(valor: string | number): string {

    let money: string | number = Math.round(Number(valor)) + "";
    money = money.replace(/[^0-9$.,]+/g, ' ')

    money = this.parseDecimal(money)
    money = money.toLocaleString('de-DE');
    return '$' + money;

  }

  hasRole(...roles: string[]): boolean {
    return roles.includes(this.usuarioRol);
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
