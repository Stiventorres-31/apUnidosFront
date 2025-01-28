import { Component, ViewChild } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { DatatableComponent, NgxDatatableModule } from '@swimlane/ngx-datatable';
import { EncryptionService } from '../../../../../shared/services/encryption/encryption.service';
import { BreadCrumbService } from '../../../../../shared/services/breadcrumbs/bread-crumb.service';
import { debounceTime, fromEvent, Subscription } from 'rxjs';
import { TipoInmueblesService } from '../services/tipo-inmuebles.service';
import { tipo_inmueble } from '../models/inmuebles.interface';

@Component({
  selector: 'app-tipo-inmuebles',
  standalone: true,
  imports: [RouterLink, NgxDatatableModule,],
  templateUrl: './tipo-inmuebles.component.html',
  styles: ''
})
export class TipoInmueblesComponent {
  resizeSubscription: Subscription | undefined;
  resizeObserver: ResizeObserver | undefined;
  @ViewChild(DatatableComponent) table!: DatatableComponent;
  public isLoading = true;
  public filtros: any[] = [];

  constructor(private tipoInmuebleService: TipoInmueblesService, private EncryptionService: EncryptionService, private Router: Router, private BreadCrumbService: BreadCrumbService) { }


  ngOnInit() {
    this.index();
    this.resizeSubscription = fromEvent(window, 'resize')
      .pipe(debounceTime(300))
      .subscribe(() => this.recalculateTable());
  }

  index() {
    this.tipoInmuebleService.index().subscribe(
      (rs) => {
        console.log(rs);
        this.filtros = rs;
        const breadcrumbs = [
          { label: 'Dashboard', url: '/admin/dashboard' },
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
