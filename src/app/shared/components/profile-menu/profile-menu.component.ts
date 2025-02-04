import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NgClass } from '@angular/common';
import { ClickOutsideDirective } from '../../directives/click-outside.directive';
import { AngularSvgIconModule } from 'angular-svg-icon';
import { ThemeService } from '../../../core/services/theme.service';
import { trigger, state, style, animate, transition } from '@angular/animations';
import { LoginService } from '../../../auth/services/login.service';

@Component({
  selector: 'app-profile-menu',
  templateUrl: './profile-menu.component.html',
  styleUrls: ['./profile-menu.component.scss'],
  standalone: true,
  imports: [ClickOutsideDirective, NgClass, RouterLink, AngularSvgIconModule],
  animations: [
    trigger('openClose', [
      state(
        'open',
        style({
          opacity: 1,
          transform: 'translateY(0)',
          visibility: 'visible',
        }),
      ),
      state(
        'closed',
        style({
          opacity: 0,
          transform: 'translateY(-20px)',
          visibility: 'hidden',
        }),
      ),
      transition('open => closed', [animate('0.2s')]),
      transition('closed => open', [animate('0.2s')]),
    ]),
  ],
})
export class ProfileMenuComponent implements OnInit {
  public isOpen = false;
  public profileMenu = [
    {
      title: 'Your Profile',
      icon: './assets/img/icons/heroicons/outline/user-circle.svg',
      link: '/profile',
    },
    {
      title: 'Settings',
      icon: './assets/img/icons/heroicons/outline/cog-6-tooth.svg',
      link: '/settings',
    },
  ];

  public themeColors = [
    {
      name: 'base',
      code: '#3c8bf7',
    },
    {
      name: 'yellow',
      code: '#f59e0b',
    },
    {
      name: 'green',
      code: '#22c55e',
    },
    {
      name: 'blue',
      code: '#3b82f6',
    },
    {
      name: 'orange',
      code: '#ea580c',
    },
    {
      name: 'red',
      code: '#cc0022',
    },
    {
      name: 'violet',
      code: '#6d28d9',
    },
  ];

  public themeMode = ['light', 'dark'];

  constructor(private login: LoginService) { }

  ngOnInit(): void { }

  public toggleMenu(): void {
    this.isOpen = !this.isOpen;
  }

  logout() {
    this.login.logout().subscribe(() => { })
  }

  // toggleThemeMode() {
  //   this.themeService.theme.update((theme) => {
  //     //const mode = !this.themeService.isDark ? 'dark' : 'light';
  //     const mode = 'light';
  //     return { ...theme, mode: mode };
  //   });
  // }

  // toggleThemeColor(color: string) {
  //   this.themeService.theme.update((theme) => {
  //     return { ...theme, color: color };
  //   });
  // }
}
