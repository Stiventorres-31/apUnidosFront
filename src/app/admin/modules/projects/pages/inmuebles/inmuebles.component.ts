import { Component, ViewChild } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { DatatableComponent, NgxDatatableModule } from '@swimlane/ngx-datatable';
import { debounceTime, fromEvent, Subscription } from 'rxjs';
import { InmueblesService } from './services/inmuebles.service';
import { EncryptionService } from '../../../../../shared/services/encryption/encryption.service';
import { BreadCrumbService } from '../../../../../shared/services/breadcrumbs/bread-crumb.service';
import { AppComponent } from '../../../../../app.component';
import { inmueble } from './models/inmuebles.interface';

@Component({
  selector: 'app-inmuebles',
  standalone: true,
  imports: [RouterLink, NgxDatatableModule],
  templateUrl: './inmuebles.component.html',
  styles: ''
})
export class InmueblesComponent {
  resizeSubscription: Subscription | undefined;
  resizeObserver: ResizeObserver | undefined;
  @ViewChild(DatatableComponent) table!: DatatableComponent;
  public isLoading = true;
  public filtros: inmueble[] = [];

  constructor(private InmueblesService: InmueblesService, private EncryptionService: EncryptionService, private Router: Router, private BreadCrumbService: BreadCrumbService, private AppComponent: AppComponent
  ) { }


  ngOnInit() {
    this.index();
    this.resizeSubscription = fromEvent(window, 'resize')
      .pipe(debounceTime(300))
      .subscribe(() => this.recalculateTable());
  }

  index() {
    this.InmueblesService.index().subscribe(
      (rs) => {
        console.log(rs);
        this.filtros = rs;
        const breadcrumbs = [
          { label: 'Dashboard', url: '/admin/dashboard' },
          { label: 'Inmuebles', url: '/admin/property' },
        ];
        this.BreadCrumbService.setBreadcrumbs(breadcrumbs);
        this.isLoading = false;
      })
    this.isLoading = false;
  }

  ngAfterViewInit() {
    const mainContent = document.getElementById('main-content');
    if (mainContent) {
      this.resizeObserver = new ResizeObserver(() => this.recalculateTable());
      this.resizeObserver.observe(mainContent);
    }
  }

  update(type: inmueble) {
    console.log(type);
    this.Router.navigate(["/admin/property/update/", this.EncryptionService.encrypt(`${type.id}`)])
  }

  filter(event: Event) { }


  delete(row: inmueble) {
    this.AppComponent.confirm({
      header: `Confirmar eliminación`,
      message: `¿Estás seguro/a de que deseas eliminar el inmueble ${row.nombre_inmueble} ? `,
      styles: `warn`
    }).then((rs) => {
      if (rs) {
        this.InmueblesService.delete(row.id).subscribe((rx) => {
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
