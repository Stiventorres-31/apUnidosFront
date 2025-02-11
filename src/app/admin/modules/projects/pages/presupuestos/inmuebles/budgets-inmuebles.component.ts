import { Component } from '@angular/core';
import { inmueble } from '../../inmuebles/models/inmuebles.interface';
import { InmueblesService } from '../../inmuebles/services/inmuebles.service';
import { EncryptionService } from '../../../../../../shared/services/encryption/encryption.service';
import { ActivatedRoute, Router } from '@angular/router';
import { BreadCrumbService } from '../../../../../../shared/services/breadcrumbs/bread-crumb.service';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { AppComponent } from '../../../../../../app.component';
import { BudgetsService } from '../services/budgets.service';

@Component({
  selector: 'app-budgets-inmuebles',
  standalone: true,
  imports: [NgxDatatableModule],
  templateUrl: './budgets-inmuebles.component.html',
  styles: ''
})
export class BudgetsInmueblesComponent {
  public isLoading: boolean = true;
  public inmueble!: inmueble;
  constructor(
    private InmueblesService: InmueblesService,
    private BudgetsService: BudgetsService,
    private EncryptionService: EncryptionService,
    private router: Router,
    private parametros: ActivatedRoute,
    private AppComponent: AppComponent,
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
        this.index(id);


      } else {
        this.router.navigate(['/admin/projects']);
        return;


      }
    });
  }

  index(id: string) {
    this.InmueblesService.search(id).subscribe((rs) => {
      if (rs) {

        this.isLoading = false;
        this.inmueble = rs;

        const breadcrumbs = [
          { label: 'Dashboard', url: '/admin/dashboard' },
          { label: 'Proyectos', url: '/admin/projects/' },
          { label: 'Presupuestos', url: '/admin/property/view/' + this.EncryptionService.encrypt(`${rs.id}`) },
          { label: rs.codigo_proyecto + ' - ' + rs.tipo_inmueble.nombre_tipo_inmueble, url: '/admin/projects/budget/' },

        ];

        this.BreadCrumbService.setBreadcrumbs(breadcrumbs);


      } else {
        this.router.navigate(['/admin/projects']);
        return;
      }

    });
  }

  update(row: any) {

  }

  delete(row: any) {
    this.AppComponent.confirm({
      header: `Confirmar eliminación`,
      message: `¿Estás seguro/a de que deseas eliminar el presupuesto del material ${row.referencia_material} ? `,
      styles: `warn`
    }).then((rs) => {
      if (rs) {
        this.BudgetsService.delete(`${this.inmueble.id}`, row.referencia_material, this.inmueble.codigo_proyecto).subscribe((rx) => {
          this.AppComponent.alert({ summary: `Operación ${rx.isError ? 'fallida' : 'exitosa'}`, detail: rx.message, severity: `${rx.isError ? 'error' : 'success'}` });

          if (!rx.isError) this.index(`${this.inmueble.id}`);
        })
      }

    })
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
