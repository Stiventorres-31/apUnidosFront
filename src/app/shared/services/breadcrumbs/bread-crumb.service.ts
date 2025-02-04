import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BreadCrumbService {

  private breadcrumbs = new BehaviorSubject<listBreadcrumb[]>([]);
  breadcrumbs$ = this.breadcrumbs.asObservable();

  setBreadcrumbs(breadcrumbs: listBreadcrumb[]) {
    this.breadcrumbs.next(breadcrumbs); 
  }
}
export interface listBreadcrumb {
  label: string;
  url: string;
}