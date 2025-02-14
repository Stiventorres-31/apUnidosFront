import { Component, EventEmitter, Output, ViewChild, ElementRef, Input } from '@angular/core';
import { filter_ngx } from '../../../../core/pipes/filter.pipe';


@Component({
  selector: 'selects-list-materials',
  standalone: true,
  imports: [],
  templateUrl: './selects-custom.component.html',
  styles: ''
})
export class SelectMaterialComponent {

  @Input() data: any[] = [];
  public filtros: any[] = [];
  @ViewChild('inputSelectMaterial') inputSelectMaterial!: ElementRef;
  @Output() newValueSelect = new EventEmitter<string>

  constructor() { }


  ngOnInit(): void {
    this.filtros = this.data;
  }

  ngAfterViewInit(): void {
    this.inputSelectMaterial.nativeElement.focus()
  }

  onSelectChange(val: string): void {
    this.newValueSelect.emit(val)

  }
  filtrar(termino: Event) {
    const key = termino.target as HTMLInputElement;
    const value = key.value;
    if (value == "" || value == null) {
      this.filtros = this.data;
    } else {
      this.filtros = new filter_ngx().transform(this.data, value);
    }

  }



}
