import { NgClass } from '@angular/common';
import { Component } from '@angular/core';
import { MenuService } from '../../services/services/menu.service';
import { AngularSvgIconModule } from 'angular-svg-icon';
import { SidebarMenuComponent } from './sidebar-menu/sidebar-menu.component';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [NgClass, SidebarMenuComponent, AngularSvgIconModule],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss'
})
export class SidebarComponent {
  constructor(public menuService: MenuService) { }

  ngOnInit(): void { }

  public toggleSidebar() {
    this.menuService.toggleSidebar();
  }
}
