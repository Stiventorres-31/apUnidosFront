import { Component, EventEmitter, Input, Output } from '@angular/core';

import { MatRippleModule } from '@angular/material/core';
import { Link, pagination_interface } from '../../models/pagination/pagination.interface';

@Component({
  selector: 'pagination-table',
  standalone: true,
  imports: [MatRippleModule],
  templateUrl: './pagination-table.component.html',
  styleUrl: './pagination-table.component.scss'
})
export class PaginationTableComponent {

  @Input()
  public datos!: pagination_interface;

  @Output()
  public newLink = new EventEmitter<string>;

  getFilteredLinks(): Link[] {
    if (!this.datos) return [];
    const visibleLinks = this.datos.meta ? this.datos.meta.links : (this.datos.links as unknown as any[] ?? []) ;


    return visibleLinks.filter((link) => link != undefined);
  }
}
