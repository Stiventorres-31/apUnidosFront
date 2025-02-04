import { Component, OnInit } from '@angular/core';
import { MenuService } from '../../services/services/menu.service';
import { ProfileMenuComponent } from '../profile-menu/profile-menu.component';



@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
  standalone: true,
  imports: [ProfileMenuComponent],
})
export class NavbarComponent implements OnInit {
  constructor(public menuService: MenuService
  ) { }

  ngOnInit(): void { }

  public toggleMobileMenu(): void {
    this.menuService.showMobileMenu = !this.menuService.showMobileMenu;
  }

}
