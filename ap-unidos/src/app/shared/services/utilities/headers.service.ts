import { Injectable } from '@angular/core';
import { HttpHeaders } from '@angular/common/http';
import { EncryptionService } from '../encryption/encryption.service';


@Injectable({
    providedIn: 'root'
})
export class HeadersService {

    constructor(private encryptionService: EncryptionService) { }

    getJsonHeaders(): HttpHeaders {
        return new HttpHeaders({
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Authorization': `Bearer ${this.encryptionService.loadData("token")}`
        });
    }

    getFileHeaders(): HttpHeaders {
        return new HttpHeaders({
            'Accept': 'application/json',
            'Authorization': `Bearer ${this.encryptionService.loadData("token")}`
        });
    }
}
