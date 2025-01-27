import { Component, ViewChild } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { DatatableComponent, NgxDatatableModule } from '@swimlane/ngx-datatable';
import { UsersService } from '../../../shared/services/users/users.service';
import { debounceTime, fromEvent, Subscription } from 'rxjs';
import { BreadCrumbService } from '../../../shared/services/breadcrumbs/bread-crumb.service';
import { Usuario } from '../../../shared/models/users/users.interface';
import { EncryptionService } from '../../../shared/services/encryption/encryption.service';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [RouterLink, NgxDatatableModule],
  templateUrl: './users.component.html',
  styleUrl: './users.component.scss'
})
export class UsersComponent {
  resizeSubscription: Subscription | undefined;
  resizeObserver: ResizeObserver | undefined;
  @ViewChild(DatatableComponent) table!: DatatableComponent;
  public isLoading = true;
  public filtros: any[] = [];

  constructor(private userService: UsersService, private EncryptionService: EncryptionService, private Router: Router, private BreadCrumbService: BreadCrumbService) { }


  ngOnInit() {
    this.index();
    this.resizeSubscription = fromEvent(window, 'resize')
      .pipe(debounceTime(300))
      .subscribe(() => this.recalculateTable());
  }

  index() {
    this.userService.index().subscribe(
      (rs) => {
        console.log(rs);
        this.filtros = rs;
        const breadcrumbs = [
          { label: 'Dashboard', url: '/admin/dashboard' },
          { label: 'Usuarios', url: '/admin/users' },
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


  filter(event: Event) { }

  update(usuario: Usuario) {
    this.Router.navigate(["/admin/users/update/", this.EncryptionService.encrypt(`${usuario.numero_identificacion}`)])
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
