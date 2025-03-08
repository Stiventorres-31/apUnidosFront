import { Component, ViewChild } from '@angular/core';
import { DatatableComponent, NgxDatatableModule } from '@swimlane/ngx-datatable';
import { MaterialsService } from '../../services/materials.service';
import { invetario } from '../../../../../../../shared/models/inventory/inventory.interface';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { AppComponent } from '../../../../../../../app.component';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { BreadCrumbService } from '../../../../../../../shared/services/breadcrumbs/bread-crumb.service';
import { EncryptionService } from '../../../../../../../shared/services/encryption/encryption.service';
import { materials } from '../../models/materials.interface';
import { debounceTime, fromEvent, Subscription } from 'rxjs';
import { filter_ngx } from '../../../../../../../core/pipes/filter.pipe';
import { ValidationsService } from '../../../../../../../shared/services/validations/validations.service';

@Component({
  selector: 'app-lots',
  standalone: true,
  imports: [NgxDatatableModule, RouterLink, MatProgressSpinnerModule],
  templateUrl: './lots.component.html',
  styles: ''
})
export class LotsComponent {

  constructor(private MaterialsService: MaterialsService,
    private AppComponent: AppComponent,
    private BreadCrumbService: BreadCrumbService,
    private EncryptionService: EncryptionService,
    private router: Router,
    private parametros: ActivatedRoute,
    private ValidationsService: ValidationsService
  ) { }

  resizeSubscription: Subscription | undefined;
  resizeObserver: ResizeObserver | undefined;
  @ViewChild(DatatableComponent) table!: DatatableComponent;
  public isLoading: boolean = true;
  public id: string = '';
  public material!: materials;
  public lots: invetario[] = [];
  public filtros: invetario[] = [];


  ngOnInit(): void {
    this.parametros.params.subscribe((params) => {
      if (params['id']) {
        const id = this.EncryptionService.decrypt(params['id']);

        if (!id) {
          this.router.navigate(['/admin/materials']);
          return;
        }

        this.id = id;
        this.index(this.id);


      } else {
        this.router.navigate(['/admin/materials']);
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

  index(id: string): void {
    this.MaterialsService.search(id).subscribe((rs) => {

      if (rs) {
        this.isLoading = false;
        this.material = rs;
        this.lots = rs.inventarios ?? [];
        this.filtros = this.lots;

        const breadcrumbs = [
          // { label: 'Dashboard', url: '/admin/dashboard' },
          { label: 'Materiales', url: '/admin/materials/' },
          { label: 'Lotes', url: '/admin/materials/lots/' + this.EncryptionService.encrypt(`${rs.referencia_material}`) },
          { label: rs.nombre_material, url: '/admin/materials/lots/' },

        ];

        this.BreadCrumbService.setBreadcrumbs(breadcrumbs);

      } else {
        this.router.navigate(['/admin/materials']);
        return;
      }

    });
  }

  filter(event: Event): void {
    const key = event.target as HTMLInputElement;
    const value = key.value;
    if (value.trim() == "" || value == null) {
      this.filtros = this.lots;
    } else {
      this.filtros = new filter_ngx().transform(this.lots, value);
    }
  }

  update(lot: invetario): void {
    const id = this.EncryptionService.encrypt(`${lot.id}`);
    const ref = this.EncryptionService.encrypt(`${this.material.referencia_material}`);
    this.router.navigate(["/admin/materials/lots/update", id, ref]);
  }

  new(): void {
    const referencia = this.EncryptionService.encrypt(`${this.material.referencia_material}`);
    const id = this.EncryptionService.encrypt(`${this.material.id}`);
    this.router.navigate(["/admin/materials/lots/new", id, referencia]);
  }


  delete(row: invetario) {
    this.AppComponent.confirm({
      header: `Confirmar eliminación`,
      message: `¿Estás seguro/a de que deseas eliminar el lote ${row.consecutivo} ? `,
      styles: `warn`
    }).then((rs) => {
      if (rs) {
        this.MaterialsService.deleteLot(row.id).subscribe((rx) => {
          this.AppComponent.alert({ summary: `Operación ${rx.isError ? 'fallida' : 'exitosa'}`, detail: rx.message, severity: `${rx.isError ? 'error' : 'success'}` });

          if (!rx.isError) this.index(this.id);
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

  recalculateTable(): void {
    if (this.table) {
      this.table.recalculate();
    }
  }

  formatDate(date: string): string {
    if (date == '') return '';
    return this.ValidationsService.formatDate(date);
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
