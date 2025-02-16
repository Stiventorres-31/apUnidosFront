import { Component, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ValidationsService } from '../../../../../../../shared/services/validations/validations.service';
import { LabelsService } from '../../../../../../../shared/services/labels/labels.service';
import { MaterialsService } from '../../../materiales/services/materials.service';
import { form_budget, form_inventario, materials } from '../../../materiales/models/materials.interface';
import { BreadCrumbService } from '../../../../../../../shared/services/breadcrumbs/bread-crumb.service';
import { ActivatedRoute, Router } from '@angular/router';
import { EncryptionService } from '../../../../../../../shared/services/encryption/encryption.service';
import { invetario } from '../../../../../../../shared/models/inventory/inventory.interface';
import { SelectMaterialComponent } from '../../../../../../../shared/components/selects/materials/selects-custom.component';
import { NgClass } from '@angular/common';
import { DatatableComponent, NgxDatatableModule } from '@swimlane/ngx-datatable';
import { debounceTime, fromEvent, Subscription } from 'rxjs';
import { AppComponent } from '../../../../../../../app.component';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { BudgetsService } from '../../services/budgets.service';

@Component({
  selector: 'app-form-budget',
  standalone: true,
  imports: [ReactiveFormsModule, NgxDatatableModule, MatProgressSpinnerModule, SelectMaterialComponent, NgClass],
  templateUrl: './form-budget.component.html',
  styles: ''
})
export class FormBudgetComponent {
  resizeSubscription: Subscription | undefined;
  resizeObserver: ResizeObserver | undefined;
  @ViewChild(DatatableComponent) table!: DatatableComponent;

  private data: any = {};
  public refMateriales: materials[] = [];
  public lotMateriales: invetario[] = [];
  public lots: form_inventario[] = [];

  public showModal: boolean = false;
  public isLoading: boolean = true;
  public isSearching: boolean = false;
  public isSending: boolean = false;

  budget!: FormGroup;

  constructor(private labels: LabelsService, private fb: FormBuilder, private ValidationsService: ValidationsService, private materialsService: MaterialsService, private BreadCrumbService: BreadCrumbService, private Router: Router, private parametros: ActivatedRoute, private EncryptionService: EncryptionService, private AppComponent: AppComponent, private BudgetsService: BudgetsService) {
    this.budget = this.fb.group({
      referencia_material: ['', Validators.required],
      consecutivo: ['', Validators.required],
      costo_material: ['', Validators.required],
      cantidad_material: [1, Validators.required],
    });
  }

  public inputs: { [key: string]: boolean } = {};


  ngOnInit() {
    this.inputs = this.labels.inputs_data;
    this.parametros.params.subscribe((params) => {
      if (params['id'] && params['cod']) {
        const id = this.EncryptionService.decrypt(params['id']);
        const cod = this.EncryptionService.decrypt(params['cod']);
        console.log(id, cod);
        if (!id || !cod) {
          this.Router.navigate(['/admin/projects']);
          return;
        }
        this.data = {
          inmueble_id: id,
          codigo_proyecto: cod
        }
        this.indexMateriales();
        this.resetInputs();


      } else {
        this.Router.navigate(['/admin/projects']);
        return;
      }
    });

    this.budget.get('referencia_material')?.valueChanges.subscribe(e => {
      this.lotMateriales = [];
      this.budget.get('consecutivo')?.setValue('');
      console.log(e)
      if (e != '' && e) {
        this.materialsService.search(e).subscribe((rs) => {
          console.log(rs)
          if (rs) {
            this.lotMateriales = rs.inventario ?? [];
          }

        });
      }


    });

    this.resizeSubscription = fromEvent(window, 'resize')
      .pipe(debounceTime(300))
      .subscribe(() => this.recalculateTable());

  }

  indexMateriales() {
    this.materialsService.index().subscribe(
      (rs) => {
        console.log(rs);
        this.refMateriales = rs;
        this.isLoading = false;

        const breadcrumbs = [
          { label: 'Dashboard', url: '/admin/dashboard' },
          { label: 'Proyectos', url: '/admin/projects/' },
          { label: 'Presupuestos', url: '/admin/property/view/budget/' + this.EncryptionService.encrypt(this.data.inmueble_id) },
          { label: 'Agregar', url: '/admin/projects/budget/new/' + this.EncryptionService.encrypt(this.data.inmueble_id) + '/' + this.EncryptionService.encrypt(this.data.codigo_proyecto) },
          { label: this.data.codigo_proyecto, url: '/admin/projects/budget/new/' },

        ];

        this.BreadCrumbService.setBreadcrumbs(breadcrumbs);
      }
    )
  }



  removeMaterial(index: number) {
    if (index >= 0 && index < this.lots.length) {
      this.lots = this.lots.filter((_, i) => i !== index);

    }
  }

  store() {
    this.isSending = true;
    if (!this.budget.valid) {
      this.AppComponent.alert({
        summary: "Formulario invalido",
        detail: "Por favor, Asegurese que la información del material es valida.",
        severity: 'warn'
      })
      this.isSending = false;
      return;
    }
    const lot = this.budget.value;
    const ref = this.lots.find((l) => l.referencia_material == lot.referencia_material);

    if (ref) {
      this.AppComponent.alert({
        summary: "Error",
        detail: "Ya haz agregado al presupuesto este material.",
        severity: 'warn'
      })
      this.isSending = false;
      return;
    }

    console.log(lot);

    this.lots = [...this.lots, lot];

    this.isSending = false;
    this.closeModal();


  }

  submit() {
    this.isSending = true;
    if (this.lots.length == 0) {
      this.AppComponent.alert({
        summary: "Formulario invalido",
        detail: "Por favor, Asegurese que el presupuesto tenga al menos un material.",
        severity: 'warn'
      })
      this.isSending = false;
      return;
    }

    this.data.materiales = this.lots.map(l => ({
      ...l,
      costo_material: this.parseMoneda(l.costo_material),
      cantidad_material: Number(l.cantidad_material)
    }));


    this.BudgetsService.store(this.data).subscribe(
      (rs) => {
        console.log(rs);
        if (rs.isError) {
          this.isSending = false;
          this.AppComponent.alert({ summary: "Operación fallida", detail: rs.message, severity: 'error' });
        } else {
          const id = this.EncryptionService.encrypt(`${this.data.inmueble_id}`);
          this.Router.navigate(['/admin/property/view/budget/', id]);

          this.AppComponent.alert({
            summary: "Operación exitosa",
            detail: rs.message,
            severity: 'success'
          });
        }
      });


  }

  numeric(event: Event): void {
    const input = event.target as HTMLInputElement;
    input.value = this.ValidationsService.numeric(input.value);

  }

  moneda(event: Event): void {
    const input = event.target as HTMLInputElement;
    let value = input.value.replace(/[^0-9]/g, '');
    input.value = this.ValidationsService.format_moneda(value, false);

  }

  private parseMoneda(value: string | number | null | undefined): number {
    if (value == null) return 0; // Si es null o undefined, devolver 0
    return Number(value.toString().replace(/[^0-9]/g, '') || 0);
  }


  ngAfterViewInit() {
    const mainContent = document.getElementById('main-content');
    if (mainContent) {
      this.resizeObserver = new ResizeObserver(() => this.recalculateTable());
      this.resizeObserver.observe(mainContent);
    }
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

  labelBlur(campo: string, event: Event) {
    this.labels.labelFloatBlur(campo, event);
  }
}
