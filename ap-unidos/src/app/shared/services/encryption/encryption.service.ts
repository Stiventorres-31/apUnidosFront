import { Injectable } from '@angular/core';
import * as CryptoJS from 'crypto-js';

@Injectable({
  providedIn: 'root'
})
export class EncryptionService {

  private secretKey = 'Balambo@2025';

  constructor() { }

  // Generar un hash constante para la clave
  private hashKey(key: string): string {
    return CryptoJS.SHA256(key).toString(CryptoJS.enc.Hex); // Clave en formato hexadecimal
  }

  // Cifrar datos
  encrypt(data: string): string {
    const encrypted = CryptoJS.AES.encrypt(data, this.secretKey).toString();
    const encoded = encrypted
      .replace(/\+/g, '-')  // Reemplazar + por -
      .replace(/\//g, '_')  // Reemplazar / por _
      .replace(/=+$/, '');  // Eliminar los caracteres de relleno =
    return encoded;
  }

  // Descifrar datos
  decrypt(data: string): string {
    const encrypted = data
      .replace(/-/g, '+')  // Revertir - a +
      .replace(/_/g, '/'); // Revertir _ a /
    const bytes = CryptoJS.AES.decrypt(encrypted, this.secretKey);
    return bytes.toString(CryptoJS.enc.Utf8);
  }

  // Guardar datos en localStorage
  saveData(key: string, value: string): void {
    const hashedKey = this.hashKey(key); // Generar hash para la clave
    const encryptedValue = this.encrypt(value); // Encriptar el valor
    localStorage.setItem(hashedKey, encryptedValue); // Guardar en localStorage
  }

  // Cargar datos desde localStorage
  loadData(key: string): string {
    const hashedKey = this.hashKey(key); // Generar hash para la clave
    const encryptedValue = localStorage.getItem(hashedKey);
    if (encryptedValue) {
      return this.decrypt(encryptedValue); // Desencriptar el valor
    }
    return '';
  }

  // Eliminar datos de localStorage
  removeData(keys: string[]): void {
    if (!keys || keys.length === 0) return;

    keys.forEach(key => {
      const hashedKey = this.hashKey(key); // Generar hash para la clave
      localStorage.removeItem(hashedKey); // Eliminar del localStorage
    });
  }
}
