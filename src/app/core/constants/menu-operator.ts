import { MenuItem } from '../models/menu.model';

export class MenuOperator {
  public static pages: MenuItem[] = [
    // {
    //   group: 'Base',
    //   separator: false,
    //   items: [
    //     {
    //       icon: 'assets/img/icons/heroicons/outline/chart-pie.svg',
    //       label: 'Dashboard',
    //       route: '/admin/dashboard',
    //       children: [
    //         { label: 'Inmuebles', route: '/admin/dashboard' },
    //       ],
    //     },
    //   ],
    // },
    {
      group: 'CRM',
      separator: true,
      items: [
        {
          icon: 'assets/img/icons/heroicons/outline/folder.svg',
          label: 'Talleres',
          route: '/admin/workshops',
        },
        {
          icon: 'assets/img/icons/heroicons/outline/inmuebles.svg',
          label: 'Vehiculos',
          route: '/admin/vehicles',
        },

      ],
    },

  ];
}
