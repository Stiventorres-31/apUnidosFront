import { MenuItem } from '../models/menu.model';

export class Menu {
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
    //         // { label: 'Podcast', route: '/dashboard/podcast' },
    //       ],
    //     },

    //     // {
    //     //   icon: 'assets/img/icons/heroicons/outline/cube.svg',
    //     //   label: 'Components',
    //     //   route: '/components',
    //     //   children: [{ label: 'Table', route: '/components/table' }],
    //     // },
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
          icon: 'assets/img/icons/heroicons/outline/tipo_inmueble.svg',
          label: 'Tipo de Vehiculo',
          route: '/admin/type-vehicles',
        },
        {
          icon: 'assets/img/icons/heroicons/outline/inmuebles.svg',
          label: 'Vehiculos',
          route: '/admin/vehicles',
        },
        {
          icon: 'assets/img/icons/heroicons/outline/cube.svg',
          label: 'Materiales',
          route: '/admin/materials',
        }
        // {
        //   icon: 'assets/img/icons/heroicons/outline/gift.svg',
        //   label: 'Gift Card',
        //   route: '/gift',
        // },
      ],
    },
    {
      group: 'Config CRM',
      separator: false,
      items: [

        // {
        //   icon: 'assets/img/icons/heroicons/outline/bell.svg',
        //   label: 'Notifications',
        //   route: '/gift',
        // },
        {
          icon: 'assets/img/icons/heroicons/outline/users.svg',
          label: 'Usuarios',
          route: '/admin/users',
        },
        // {
        //   icon: 'assets/img/icons/heroicons/outline/cog.svg',
        //   label: 'Settings',
        //   route: '/settings',
        // },
        // {
        //   icon: 'assets/img/icons/heroicons/outline/download.svg',
        //   label: 'Folders',
        //   route: '/folders',
        //   children: [
        //     { label: 'Current Files', route: '/folders/current-files' },
        //     { label: 'Downloads', route: '/folders/download' },
        //     { label: 'Trash', route: '/folders/trash' },
        //   ],
        // },
      ],
    },
  ];
}
