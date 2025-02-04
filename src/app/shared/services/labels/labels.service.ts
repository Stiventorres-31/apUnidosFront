import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LabelsService {
  public inputs: { [key: string]: boolean } = {};

  constructor() { }
  get inputs_data(){
   return this.inputs;
  }

  labelFloatFocus(campo: string) {
    this.inputs[campo] = true;

  }
  labelFloatBlur(campo: string, event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.value != "") {
      this.inputs[campo] = true;
    } else {
      this.inputs[campo] = false;

    }
  }
}
