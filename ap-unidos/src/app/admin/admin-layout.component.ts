import { Component } from '@angular/core';
import { SidebarComponent } from '../shared/components/sidebar/sidebar.component';
import { NavbarComponent } from '../shared/components/navbar/navbar.component';
import { RouterOutlet } from '@angular/router';
import { NgClass } from '@angular/common';
import { BreadcrumbsComponent } from '../shared/components/breadcrumbs/breadcrumbs.component';

@Component({
  selector: 'app-admin-layout',
  standalone: true,
  imports: [SidebarComponent, NavbarComponent, BreadcrumbsComponent, RouterOutlet],
  templateUrl: './admin-layout.component.html',
  styles: ``
})
export class AdminLayoutComponent {

}
