import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { BreadCrumbService, listBreadcrumb } from '../../services/breadcrumbs/bread-crumb.service';
import { AngularSvgIconModule } from 'angular-svg-icon';



@Component({
  selector: 'breadcrumbs',
  standalone: true,
  imports: [RouterLink, AngularSvgIconModule],
  templateUrl: './breadcrumbs.component.html',
  styleUrl: './breadcrumbs.component.scss'
})
export class BreadcrumbsComponent {
  constructor(private breadCumbService: BreadCrumbService) { }
  private timeoutId: any;
  public isOn: boolean = false;
  public event = setTimeout(() => { })

  public Breadcrumbs: listBreadcrumb[] = [];
  ngOnInit(): void {
    this.breadCumbService.breadcrumbs$.subscribe((rs) => {
      // Cancelar el temporizador anterior si existe


      if (this.timeoutId) {
        clearTimeout(this.timeoutId);
      }
      this.isOn = rs.length > 0;
      this.Breadcrumbs = rs;

    });
  }




}
