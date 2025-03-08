import { Component, ViewChild } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { DatatableComponent, NgxDatatableModule } from '@swimlane/ngx-datatable';
import { EncryptionService } from '../../../../../../../shared/services/encryption/encryption.service';
import { BreadCrumbService } from '../../../../../../../shared/services/breadcrumbs/bread-crumb.service';
import { debounceTime, fromEvent, Subscription } from 'rxjs';
import { TipoInmueblesService } from '../../services/tipo-inmuebles.service';
import { tipo_inmueble } from '../../models/inmuebles.interface';
import { AppComponent } from '../../../../../../../app.component';
import { filter_ngx } from '../../../../../../../core/pipes/filter.pipe';

@Component({
  selector: 'app-tipo-inmuebles',
  standalone: true,
  imports: [RouterLink, NgxDatatableModule],
  templateUrl: './tipo-inmuebles.component.html',
  styles: ''
})
export class TipoInmueblesComponent {
  resizeSubscription: Subscription | undefined;
  resizeObserver: ResizeObserver | undefined;
  @ViewChild(DatatableComponent) table!: DatatableComponent;
  public isLoading = true;
  public data: tipo_inmueble[] = [];
  public filtros: tipo_inmueble[] = [];

  constructor(private tipoInmuebleService: TipoInmueblesService, private EncryptionService: EncryptionService, private Router: Router, private BreadCrumbService: BreadCrumbService, private AppComponent: AppComponent) { }


  ngOnInit() {
    this.index();
    this.resizeSubscription = fromEvent(window, 'resize')
      .pipe(debounceTime(300))
      .subscribe(() => this.recalculateTable());
  }

  index() {
    this.tipoInmuebleService.index().subscribe(
      (rs) => {

        this.data = rs;
        this.filtros = rs;
        const breadcrumbs = [
          // { label: 'Dashboard', url: '/admin/dashboard' },
          { label: 'Tipo inmuebles', url: '/admin/type-property' },
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

  update(type: tipo_inmueble) {
    this.Router.navigate(["/admin/type-property/update/", this.EncryptionService.encrypt(`${type.id}`)])
  }

  filter(event: Event) {
    const key = event.target as HTMLInputElement;
    const value = key.value;
    if (value.trim() == "" || value == null) {
      this.filtros = this.data;
    } else {
      this.filtros = new filter_ngx().transform(this.data, value);
    }
  }


  delete(row: tipo_inmueble) {
    this.AppComponent.confirm({
      header: `Confirmar eliminación`,
      message: `¿Estás seguro/a de que deseas eliminar el tipo de inmueble ${row.nombre_tipo_inmueble} ? `,
      styles: `warn`
    }).then((rs) => {
      if (rs) {
        this.tipoInmuebleService.delete(row.id).subscribe((rx) => {
          this.AppComponent.alert({ summary: `Operación ${rx.isError ? 'fallida' : 'exitosa'}`, detail: rx.message, severity: `${rx.isError ? 'error' : 'success'}` });

          if (!rx.isError) this.index();
        })
      }

    })
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
