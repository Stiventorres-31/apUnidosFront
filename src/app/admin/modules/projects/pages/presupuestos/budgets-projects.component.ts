import { Component } from '@angular/core';
import { ProjectService } from '../../../../../shared/services/project/project.service';
import { EncryptionService } from '../../../../../shared/services/encryption/encryption.service';
import { ActivatedRoute, Router } from '@angular/router';
import { BreadCrumbService } from '../../../../../shared/services/breadcrumbs/bread-crumb.service';
import { projects } from '../../../../../shared/models/projects/projects.interface';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { inmueble } from '../inmuebles/models/inmuebles.interface';

@Component({
  selector: 'app-budgets-projects',
  standalone: true,
  imports: [NgxDatatableModule],
  templateUrl: './budgets-projects.component.html',
  styles: ''
})
export class BudgetsProjectsComponent {
  public isLoading: boolean = true;
  public projects!: projects;
  constructor(
    private ProjectService: ProjectService,
    private EncryptionService: EncryptionService,
    private router: Router,
    private parametros: ActivatedRoute,
    private BreadCrumbService: BreadCrumbService,
  ) { }



  ngOnInit() {
    this.parametros.params.subscribe((params) => {
      if (params['id']) {
        const id = this.EncryptionService.decrypt(params['id']);
        console.log(id);
        if (!id) {
          this.router.navigate(['/admin/projects']);
          return;
        }

        this.ProjectService.budget(id).subscribe((rs) => {
          if (rs) {

            this.isLoading = false;
            this.projects = rs;

            const breadcrumbs = [
              { label: 'Dashboard', url: '/admin/dashboard' },
              { label: 'Proyectos', url: '/admin/projects/' },
              { label: 'Inmuebles', url: '/admin/projects/budget/' + this.EncryptionService.encrypt(`${rs.codigo_proyecto}`) },
              { label: rs.codigo_proyecto + ' - ' + rs.ciudad_municipio_proyecto + ', ' + rs.departamento_proyecto, url: '/admin/projects/budget/' },

            ];

            this.BreadCrumbService.setBreadcrumbs(breadcrumbs);


          } else {
            this.router.navigate(['/admin/projects']);
            return;
          }

        });
      } else {
        this.router.navigate(['/admin/projects']);
        return;


      }
    });
  }


  view(row: inmueble) {
    this.router.navigate(["/admin/property/view", this.EncryptionService.encrypt(`${row.id}`)])

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
}
