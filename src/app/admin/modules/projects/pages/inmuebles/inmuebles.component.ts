import { Component, ViewChild } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { DatatableComponent, NgxDatatableModule } from '@swimlane/ngx-datatable';
import { debounceTime, fromEvent, Subscription } from 'rxjs';
import { InmueblesService } from './services/inmuebles.service';
import { EncryptionService } from '../../../../../shared/services/encryption/encryption.service';
import { BreadCrumbService } from '../../../../../shared/services/breadcrumbs/bread-crumb.service';
import { AppComponent } from '../../../../../app.component';
import { inmueble } from './models/inmuebles.interface';
import { filter_ngx } from '../../../../../core/pipes/filter.pipe';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { FilterDateComponent } from '../../../../../shared/components/filter-date/filter-date.component';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-inmuebles',
  standalone: true,
  imports: [ReactiveFormsModule, FilterDateComponent, MatProgressSpinnerModule, RouterLink, NgxDatatableModule],
  templateUrl: './inmuebles.component.html',
  styles: ''
})
export class InmueblesComponent {
  resizeSubscription: Subscription | undefined;
  resizeObserver: ResizeObserver | undefined;
  @ViewChild(DatatableComponent) table!: DatatableComponent;
  public isLoading = true;
  public data: inmueble[] = [];
  public filtros: inmueble[] = [];
  protected usuarioRol: string = '';
  public isSending: boolean = false;
  public showModal: boolean = false;

  public form!: FormGroup;

  constructor(
    private InmueblesService: InmueblesService,
    private EncryptionService: EncryptionService,
    private Router: Router,
    private BreadCrumbService: BreadCrumbService,
    private AppComponent: AppComponent,
    private fb: FormBuilder
  ) {
    this.usuarioRol = this.EncryptionService.loadData('role');
    this.form = this.fb.group({
      id: ['', Validators.required],
      type: ['', Validators.required],
      fecha_desde: [''],
      fecha_hasta: ['']
    })
  }


  ngOnInit() {
    this.index();
    this.resizeSubscription = fromEvent(window, 'resize')
      .pipe(debounceTime(300))
      .subscribe(() => this.recalculateTable());
  }

  index() {
    this.InmueblesService.index().subscribe(
      (rs) => {

        this.data = rs;
        this.filtros = rs;
        const breadcrumbs = [
          // { label: 'Dashboard', url: '/admin/dashboard' },
          { label: 'Vihiculos', url: '/admin/vehicles' },
        ];
        this.BreadCrumbService.setBreadcrumbs(breadcrumbs);
        this.isLoading = false;
      })

  }

  ngAfterViewInit() {
    const mainContent = document.getElementById('main-content');
    if (mainContent) {
      this.resizeObserver = new ResizeObserver(() => this.recalculateTable());
      this.resizeObserver.observe(mainContent);
    }
  }

  update(type: inmueble) {

    this.Router.navigate(["/admin/vehicles/update/", this.EncryptionService.encrypt(`${type.id}`)])
  }


  openModal(cod: string, type: boolean) {
    this.form.patchValue({
      id: cod,
      type: type
    })
    this.showModal = true;

  }

  closeModal() {
    this.showModal = false;
    this.form.reset();
  }

  report() {
    this.isSending = true;
    if (!this.form.valid) {
      this.AppComponent.alert({
        severity: 'error',
        detail: 'Formulario invalido',
        summary: 'Por favor, seleccione un carro'
      })
    }

    const data = this.form.value;
    const name = data.type ? 'presupuesto' : 'asignacion';

    this.InmueblesService.report(data).subscribe((rs: Blob) => {
      this.isSending = false;
      if (rs.size > 0) {
        this.closeModal();
        const url = window.URL.createObjectURL(rs);
        const a = document.createElement('a');
        a.href = url;
        a.download = `reporte_vehiculos_${name}_${data.id}_${data.codigo_proyecto}.csv`;
        a.click();
        window.URL.revokeObjectURL(url);
      }
    });
  }

  // reportB(type: inmueble) {
  //   this.InmueblesService.report(`${type.id}`, true).subscribe((rs: Blob) => {

  //     if (rs.size > 0) {
  //       const url = window.URL.createObjectURL(rs);
  //       const a = document.createElement('a');
  //       a.href = url;
  //       a.download = `reporte_presupuesto_${type.id}_${type.proyecto.codigo_proyecto}.csv`;
  //       a.click();
  //       window.URL.revokeObjectURL(url);
  //     }
  //   });
  // }

  // reportA(type: inmueble) {
  //   this.InmueblesService.report(`${type.id}`, false).subscribe((rs: Blob) => {
  //     if (rs.size > 0) {
  //       const url = window.URL.createObjectURL(rs);
  //       const a = document.createElement('a');
  //       a.href = url;
  //       a.download = `reporte_asignacion_${type.id}_${type.proyecto.codigo_proyecto}.csv`;
  //       a.click();
  //       window.URL.revokeObjectURL(url);
  //     }
  //   });
  // }

  filter(event: Event) {
    const key = event.target as HTMLInputElement;
    const value = key.value;
    if (value.trim() == "" || value == null) {
      this.filtros = this.data;
    } else {
      this.filtros = new filter_ngx().transform(this.data, value);
    }
  }


  delete(row: inmueble) {
    this.AppComponent.confirm({
      header: `Confirmar eliminación`,
      message: `¿Estás seguro/a de que deseas eliminar el vehiculos ${row.tipo_inmueble.nombre_tipo_inmueble + ' ' + row.id} ? `,
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

  hasRole(...roles: string[]): boolean {
    return roles.includes(this.usuarioRol);
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
