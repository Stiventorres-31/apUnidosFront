import { Component, ViewChild } from '@angular/core';
import { inmueble } from '../../../inmuebles/models/inmuebles.interface';
import { InmueblesService } from '../../../inmuebles/services/inmuebles.service';
import { EncryptionService } from '../../../../../../../shared/services/encryption/encryption.service';
import { ActivatedRoute, Router } from '@angular/router';
import { BreadCrumbService } from '../../../../../../../shared/services/breadcrumbs/bread-crumb.service';
import { DatatableComponent, NgxDatatableModule } from '@swimlane/ngx-datatable';
import { AppComponent } from '../../../../../../../app.component';
import { BudgetsService } from '../../services/budgets.service';
import { debounceTime, fromEvent, Subscription } from 'rxjs';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { LabelsService } from '../../../../../../../shared/services/labels/labels.service';
import { NgClass } from '@angular/common';
import { ValidationsService } from '../../../../../../../shared/services/validations/validations.service';

@Component({
  selector: 'app-budgets-inmuebles',
  standalone: true,
  imports: [NgxDatatableModule, ReactiveFormsModule, MatProgressSpinnerModule, NgClass],
  templateUrl: './budgets-inmuebles.component.html',
  styles: ''
})
export class BudgetsInmueblesComponent {
  resizeSubscription: Subscription | undefined;
  resizeObserver: ResizeObserver | undefined;
  @ViewChild(DatatableComponent) table!: DatatableComponent;
  public isLoading: boolean = true;
  public showModal: boolean = false;
  public isSending: boolean = false;
  budget!: FormGroup;
  public inmueble!: inmueble;

  public inputs: { [key: string]: boolean } = {};
  protected usuarioRol: string = '';
  constructor(
    private InmueblesService: InmueblesService,
    private BudgetsService: BudgetsService,
    private EncryptionService: EncryptionService,
    private labels: LabelsService, private fb: FormBuilder,
    private ValidationsService: ValidationsService,
    private router: Router,
    private parametros: ActivatedRoute,
    private AppComponent: AppComponent,
    private BreadCrumbService: BreadCrumbService,
  ) {
    this.usuarioRol = this.EncryptionService.loadData('role');
    this.budget = this.fb.group({
      id: '',
      costo_material: ['', Validators.required],
      cantidad_material: [1, Validators.required],
    });
  }



  ngOnInit() {
    this.inputs = this.labels.inputs_data;
    this.parametros.params.subscribe((params) => {
      if (params['id']) {
        const id = this.EncryptionService.decrypt(params['id']);

        if (!id) {
          this.router.navigate(['/admin/workshops']);
          return;
        }
        this.index(id);


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

  index(id: string) {
    this.InmueblesService.search(id).subscribe((rs) => {
      if (rs) {

        this.isLoading = false;
        this.inmueble = rs;

        const breadcrumbs = [
          // { label: 'Dashboard', url: '/admin/dashboard' },
          { label: 'Talleres', url: '/admin/workshops/' },
          { label: 'Vehiculos', url: '/admin/workshops/budget/' + this.EncryptionService.encrypt(`${rs.proyecto.codigo_proyecto}`) },
          { label: 'Presupuestos', url: '/admin/vehicles/view/budget/' + this.EncryptionService.encrypt(`${rs.id}`) },
          { label: rs.proyecto.codigo_proyecto + ' - ' + rs.tipo_inmueble.nombre_tipo_inmueble, url: '/admin/workshops/budget/' },

        ];

        this.BreadCrumbService.setBreadcrumbs(breadcrumbs);


      } else {
        this.router.navigate(['/admin/workshops']);
        return;
      }

    });
  }

  update(row: any) {

    this.budget.patchValue(row);
    let costo = Math.round(Number(row.costo_material));

    this.budget.patchValue({
      costo_material: this.ValidationsService.format_moneda(costo || 0, false)
    }, { emitEvent: true });
    this.resetInputs();
    this.showModal = true;

  }

  /**
   * 
   * Actualizar presupuesto
   */
  store() {
    this.isSending = true;
    if (!this.budget.valid) {
      this.AppComponent.alert({
        summary: "Formulario invalido",
        detail: "Por favor, Asegurese que la información del presupuesto es valida.",
        severity: 'warn'
      })
      this.isSending = false;
      return;
    }
    const body = this.budget.value;
    body.costo_material = this.parseMoneda(body.costo_material);
    body.cantidad_material = Number(body.cantidad_material)


    this.BudgetsService.update(body).subscribe((rs) => {

      if (rs.isError) {
        this.isSending = false;
        this.AppComponent.alert({ summary: "Operación fallida", detail: rs.message, severity: 'error' });
      } else {
        this.index(`${this.inmueble.id}`);
        this.isSending = false;
        this.closeModal();
        this.AppComponent.alert({
          summary: "Operación exitosa",
          detail: rs.message,
          severity: 'success'
        });
      }
    });
  }

  newBudget() {
    const id = this.EncryptionService.encrypt(`${this.inmueble.id}`);
    const cod = this.EncryptionService.encrypt(`${this.inmueble.proyecto.codigo_proyecto}`)
    this.router.navigate(['/admin/workshops/budget/new/', id, cod]);
  }


  delete(row: any) {
    this.AppComponent.confirm({
      header: `Confirmar eliminación`,
      message: `¿Estás seguro/a de que deseas eliminar el presupuesto del material con id ${row.id} ? `,
      styles: `warn`
    }).then((rs) => {
      if (rs) {
        this.BudgetsService.delete(row.id).subscribe((rx) => {
          this.AppComponent.alert({ summary: `Operación ${rx.isError ? 'fallida' : 'exitosa'}`, detail: rx.message, severity: `${rx.isError ? 'error' : 'success'}` });

          if (!rx.isError) this.index(`${this.inmueble.id}`);
        })
      }

    })
  }

  private parseMoneda(value: string | number | null | undefined): number {
    if (value == null) return 0; // Si es null o undefined, devolver 0
    return Number(value.toString().replace(/[^0-9]/g, '') || 0);
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

  ngOnDestroy(): void {
    this.BreadCrumbService.setBreadcrumbs([]);

    if (this.resizeSubscription) {
      this.resizeSubscription.unsubscribe();
    }
    if (this.resizeObserver) {
      this.resizeObserver.disconnect();
    }
  }

  moneda(event: Event): void {
    const input = event.target as HTMLInputElement;
    let value = input.value.replace(/[^0-9]/g, '');
    input.value = this.ValidationsService.format_moneda(value, false);

  }

  numeric(event: Event): void {
    const input = event.target as HTMLInputElement;
    input.value = this.ValidationsService.numeric(input.value);

  }

  closeModal() {
    this.showModal = false;
    this.budget.reset();
    this.resetInputs();
  }

  resetInputs(): void {
    Object.keys(this.budget.controls).forEach(key => {
      this.inputs[key] = !!this.budget.get(key)?.value;
    })
  }

  labelFocus(campo: string) {
    this.labels.labelFloatFocus(campo)
  }

  hasRole(...roles: string[]): boolean {
    return roles.includes(this.usuarioRol);
  }

  labelBlur(campo: string, event: Event) {
    this.labels.labelFloatBlur(campo, event);
  }
}
