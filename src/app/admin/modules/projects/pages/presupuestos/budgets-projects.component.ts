import { Component, ViewChild } from '@angular/core';
import { ProjectService } from '../../../../../shared/services/project/project.service';
import { EncryptionService } from '../../../../../shared/services/encryption/encryption.service';
import { ActivatedRoute, Router } from '@angular/router';
import { BreadCrumbService } from '../../../../../shared/services/breadcrumbs/bread-crumb.service';
import { projects } from '../../../../../shared/models/projects/projects.interface';
import { DatatableComponent, NgxDatatableModule } from '@swimlane/ngx-datatable';
import { inmueble } from '../inmuebles/models/inmuebles.interface';
import { debounceTime, fromEvent, Subscription } from 'rxjs';

@Component({
  selector: 'app-budgets-projects',
  standalone: true,
  imports: [NgxDatatableModule],
  templateUrl: './budgets-projects.component.html',
  styles: ''
})
export class BudgetsProjectsComponent {
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

        this.ProjectService.budget(id).subscribe((rs) => {
          if (rs) {

            this.isLoading = false;
            this.projects = rs;

            const breadcrumbs = [
              // { label: 'Dashboard', url: '/admin/dashboard' },
              { label: 'Talleres', url: '/admin/workshops/' },
              { label: 'Vehiculos', url: '/admin/workshops/budget/' + this.EncryptionService.encrypt(`${rs.codigo_proyecto}`) },
              { label: rs.codigo_proyecto + ' - ' + rs.ciudad_municipio_proyecto + ', ' + rs.departamento_proyecto, url: '/admin/workshops/budget/' },

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

  budgets() {
    this.router.navigate(["/admin/workshops/budgets/", this.EncryptionService.encrypt(`${this.projects.codigo_proyecto}`)])
  }

  view(row: inmueble) {
    this.router.navigate(["/admin/vehicles/view/budget/", this.EncryptionService.encrypt(`${row.id}`)])

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
