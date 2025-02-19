import { Component, EventEmitter, Input, Output } from '@angular/core';
import { projects } from '../../../../shared/models/projects/projects.interface';
import { Router } from '@angular/router';
import { EncryptionService } from '../../../../shared/services/encryption/encryption.service';
import { ProjectService } from '../../../../shared/services/project/project.service';
import { AppComponent } from '../../../../app.component';
import { inmueble } from '../pages/inmuebles/models/inmuebles.interface';

@Component({
  selector: 'card-projects',
  standalone: true,
  imports: [],
  templateUrl: './card-projects.component.html',
  styles: ''
})
export class CardProjectsComponent {
  @Output() onload = new EventEmitter<boolean>
  @Input() project!: projects;

  constructor(
    private Router: Router,
    private EncryptionService: EncryptionService,
    private ProjectService: ProjectService,
    private AppComponent: AppComponent,


  ) { }

  update() {
    this.Router.navigate(["/admin/projects/update/", this.EncryptionService.encrypt(`${this.project.codigo_proyecto}`)])
  }

  assignment() {
    this.Router.navigate(["/admin/projects/assignment/", this.EncryptionService.encrypt(`${this.project.codigo_proyecto}`)])
  }

  inmuebles() {
    this.Router.navigate(["/admin/projects/budget/", this.EncryptionService.encrypt(`${this.project.codigo_proyecto}`)])
  }


  report() {
    this.ProjectService.report(`${this.project.codigo_proyecto}`).subscribe((rs: Blob) => {
      console.log(rs);
      if (rs.size > 0) {
        const url = window.URL.createObjectURL(rs);
        const a = document.createElement('a');
        a.href = url;
        a.download = `reporte_proyecto_${this.project.id}_${this.project.codigo_proyecto}.csv`;
        a.click();
        window.URL.revokeObjectURL(url);
      } else {
        console.error('Error: El archivo no se generó correctamente.');
      }
    });
  }

  delete() {
    this.AppComponent.confirm({
      header: `Confirmar eliminación`,
      message: `¿Estás seguro/a de que deseas eliminar el proyecto con código ${this.project.codigo_proyecto} ? `,
      styles: `warn`
    }).then((rs) => {
      if (rs) {
        this.ProjectService.delete(this.project.codigo_proyecto).subscribe((rx) => {
          if (rx) {
            if ((rx.isError == true || rx.isError == false)) {
              this.AppComponent.alert({ summary: `Operación ${rx.isError ? 'fallida' : 'exitosa'}`, detail: rx.message, severity: `${rx.isError ? 'error' : 'success'}` });

              if (!rx.isError) this.onload.emit(true);
            } else {
              this.AppComponent.alert({ summary: 'Error al eliminar', detail: 'No se pudo eliminar el proyecto', severity: 'error' });
            }

          }

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


}
