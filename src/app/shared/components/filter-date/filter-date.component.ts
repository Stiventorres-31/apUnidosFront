import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormatDateService } from '../../services/format-date/format-date.service';

@Component({
  selector: 'filter-date',
  standalone: true,
  imports: [ReactiveFormsModule, MatDatepickerModule, MatNativeDateModule, MatFormFieldModule, MatInputModule,],
  templateUrl: './filter-date.component.html',
  styles: ''
})
export class FilterDateComponent {
  @Input() filtros!: FormGroup;
  public fecha_inicio: string = "";
  public fecha_fin: string = "";
  @Output() newFilterDate = new EventEmitter<boolean>;

  constructor(private FormatDateService: FormatDateService) { }

  index() {
    this.fecha_inicio = '';
    this.fecha_fin = '';
    const e = this.filtros.value;


    this.fecha_inicio = !(e.fecha_desde instanceof Date) || isNaN(e.fecha_desde.getTime()) ? e.fecha_desde : this.FormatDateService.formatearFechaMes(e.fecha_desde);
    this.fecha_fin = !(e.fecha_hasta instanceof Date) || isNaN(e.fecha_hasta.getTime()) ? e.fecha_hasta : this.FormatDateService.formatearFechaMes(e.fecha_hasta);



    // Emitir solo si ambas fechas son válidas y fecha_inicio <= fecha_fin
    if (this.fecha_inicio && this.fecha_fin && e.fecha_desde <= e.fecha_hasta) {
      this.newFilterDate.emit(true);
    }

  }

  reset(event: Event) {


    this.fecha_inicio = '';
    this.fecha_fin = '';
    this.filtros.patchValue({
      fecha_desde: '',
      fecha_hasta: '',
    })
    this.newFilterDate.emit(true);
    event.preventDefault();

  }

}
