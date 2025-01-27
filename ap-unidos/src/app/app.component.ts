import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';

import { ToastModule } from 'primeng/toast';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ConfirmDialogModule } from 'primeng/confirmdialog';


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, ToastModule, ConfirmDialogModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = '';

  constructor(private MessageService: MessageService, private confirmationService: ConfirmationService) { }

  alert(event: { severity: "success" | "info" | "warn" | "error" | "contrast" | "secondary", summary: string, detail: string, life?: number }) {
    if (!event.life) {
      delete event.life;
    }
    this.MessageService.add(event)
  }
  clear() {
    this.MessageService.clear();
  }

  confirm(event: { message: string, header: string, styles?: "success" | "danger" | "warn" | "question" }): Promise<boolean> {
    let { message, header, styles } = event;

    let success: string = "focus-visible:shadow-none shadow-none font-medium ";
    let cancel: string = "focus-visible:shadow-none shadow-none font-medium font-medium";
    let pi_icon: string = "";


    if (!styles || styles == "question") {
      success += " bg-blue-500 text-white"
      cancel += " text-blue-600";
      pi_icon = "pi pi-question-circle";
    }

    if (styles == "danger") {
      success += "  bg-red-600 text-white";
      cancel += " text-red-600";
      pi_icon = "pi pi-info-circle";

    }
    if (styles == "success") {
      success += " bg-green-500 text-white";
      cancel += " text-green-600";
      pi_icon = "pi pi-check";

    }

    if (styles == "warn") {
      success += "  bg-yellow-500 text-white";
      cancel += " text-yellow-600";
      pi_icon = "pi pi-exclamation-triangle";

    }

    return new Promise((resolve) => {
      this.confirmationService.confirm({
        message,
        header,
        icon: pi_icon + " " + cancel,
        acceptIcon: "none",
        rejectIcon: "none",
        rejectButtonStyleClass: cancel,
        acceptButtonStyleClass: success,
        acceptLabel: 'Aceptar',
        rejectLabel: 'Cancelar',
        accept: () => {
          resolve(true);  // Si el usuario acepta, resuelve con true
        },
        reject: () => {
          resolve(false); // Si el usuario rechaza, resuelve con false
        }
      });
    });

  }
}
