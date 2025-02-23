import { MenuItem } from '../models/menu.model';

export class MenuConsultant {
  public static pages: MenuItem[] = [
    {
      group: 'Base',
      separator: false,
      items: [
        {
          icon: 'assets/img/icons/heroicons/outline/chart-pie.svg',
          label: 'Dashboard',
          route: '/admin/dashboard',
          children: [
            { label: 'Inmuebles', route: '/admin/dashboard' },
          ],
        },
      ],
    },
    {
      group: 'CRM',
      separator: true,
      items: [
        {
          icon: 'assets/img/icons/heroicons/outline/folder.svg',
          label: 'Proyectos',
          route: '/admin/projects',
        },
        {
          icon: 'assets/img/icons/heroicons/outline/inmuebles.svg',
          label: 'Inmuebles',
          route: '/admin/property',
        },
      ],
    },
  ];
}
