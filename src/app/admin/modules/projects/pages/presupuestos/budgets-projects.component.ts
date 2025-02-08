import { Component } from '@angular/core';
import { ProjectService } from '../../../../../shared/services/project/project.service';
import { EncryptionService } from '../../../../../shared/services/encryption/encryption.service';
import { ActivatedRoute, Router } from '@angular/router';
import { BreadCrumbService } from '../../../../../shared/services/breadcrumbs/bread-crumb.service';
import { projects } from '../../../../../shared/models/projects/projects.interface';

@Component({
  selector: 'app-budgets-projects',
  standalone: true,
  imports: [],
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
              { label: 'presupuestos', url: '/admin/projects/budget/' + this.EncryptionService.encrypt(`${rs.codigo_proyecto}`) },
              { label: rs.codigo_proyecto, url: '/admin/projects/budget/' },

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
}
