import { Component, ViewChild } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { DatatableComponent, NgxDatatableModule } from '@swimlane/ngx-datatable';
import { debounceTime, fromEvent, Subscription } from 'rxjs';
import { AppComponent } from '../../../../app.component';
import { EncryptionService } from '../../../../shared/services/encryption/encryption.service';
import { BreadCrumbService } from '../../../../shared/services/breadcrumbs/bread-crumb.service';
import { MaterialsService } from './services/materials.service';
import { materials } from './models/materials.interface';
import { ValidationsService } from '../../../../shared/services/validations/validations.service';


@Component({
  selector: 'app-materials',
  standalone: true,
  imports: [RouterLink, NgxDatatableModule],
  templateUrl: './materials.component.html',
  styles: ''
})
export class MaterialsComponent {
  resizeSubscription: Subscription | undefined;
  resizeObserver: ResizeObserver | undefined;
  @ViewChild(DatatableComponent) table!: DatatableComponent;
  public isLoading = true;
  public filtros: materials[] = [];

  constructor(private materialsService: MaterialsService, private EncryptionService: EncryptionService, private Router: Router, private BreadCrumbService: BreadCrumbService, private AppComponent: AppComponent, private ValidationsService: ValidationsService) { }


  ngOnInit() {
    this.index();
    this.resizeSubscription = fromEvent(window, 'resize')
      .pipe(debounceTime(300))
      .subscribe(() => this.recalculateTable());
  }

  index() {
    this.materialsService.index().subscribe(
      (rs) => {
        console.log(rs);
        this.filtros = rs;
        const breadcrumbs = [
          { label: 'Dashboard', url: '/admin/dashboard' },
          { label: 'Materiales', url: '/admin/materials' },
        ];
        this.BreadCrumbService.setBreadcrumbs(breadcrumbs);
        this.isLoading = false;
      }
    )
  }

  ngAfterViewInit() {
    const mainContent = document.getElementById('main-content');
    if (mainContent) {
      this.resizeObserver = new ResizeObserver(() => this.recalculateTable());
      this.resizeObserver.observe(mainContent);
    }
  }

  update(type: materials) {
    this.Router.navigate(["/admin/materials/update/", this.EncryptionService.encrypt(`${type.referencia_material}`)])
  }

  filter(event: Event) { }


  delete(row: materials) {
    this.AppComponent.confirm({
      header: `Confirmar eliminación`,
      message: `¿Estás seguro/a de que deseas eliminar el material ${row.nombre_material} ? `,
      styles: `warn`
    }).then((rs) => {
      if (rs) {
        this.materialsService.delete(row.referencia_material).subscribe((rx) => {
          this.AppComponent.alert({ summary: `Operación ${rx.isError ? 'fallida' : 'exitosa'}`, detail: rx.message, severity: `${rx.isError ? 'error' : 'success'}` });

          if (!rx.isError) this.index();
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

  pipeMoney(valor: string): string {

    let money: string | number = Math.round(Number(valor)) + "";
    money = money.replace(/[^0-9$.,]+/g, ' ')

    money = this.parseDecimal(money)
    money = money.toLocaleString('de-DE');
    return '$' + money;

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
