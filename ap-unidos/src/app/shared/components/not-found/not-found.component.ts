import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'item-not-found',
  standalone: true,
  templateUrl: './not-found.component.html',
  styleUrls: [],
})
export class NotFoundComponent implements OnInit {
  @Input() title: string = 'Not Found';
  @Input() descripcion: string = 'Por favor, intenta nuevamente si el error persiste comunica al administrador.';
  @Input() link_text: string = 'Redireccionar a';
  @Input() link_url: string = '/';



  ngOnInit() {
    const loadingCodeElement = document.getElementById('loading-code');

    const typeWriter = (element: HTMLElement, text: string, index: number, interval: number) => {
      if (index < text.length) {
        element.innerHTML += text.charAt(index);
        index++;
        setTimeout(() => typeWriter(element, text, index, interval), interval);
      }
    };

    const generateRandomCode = (length: number) => {
      const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
      let code = '';
      for (let i = 0; i < length; i++) {
        code += characters.charAt(Math.floor(Math.random() * characters.length));
      }
      return code;
    };

    if (loadingCodeElement) {
      setTimeout(() => {
        loadingCodeElement.style.opacity = '1';
        typeWriter(loadingCodeElement, 'Verifying access...\n', 0, 50);
        setTimeout(() => {
          typeWriter(loadingCodeElement, generateRandomCode(50) + '\n', 0, 50);
          setInterval(() => {
            const randomCode = generateRandomCode(50) + '\n';
            loadingCodeElement.innerHTML += randomCode;
            loadingCodeElement.scrollTop = loadingCodeElement.scrollHeight;
          }, 100);
        }, 2000);
      }, 2000);
    }
  }
}
