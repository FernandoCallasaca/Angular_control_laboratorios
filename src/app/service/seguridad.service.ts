import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from "rxjs";
import { AppSettings } from '../common/appsettings';

@Injectable()
export class SeguridadService {

    public url: String;
    public credentials: any;
    public basic: any;


    constructor(public _http: HttpClient) {
        this.url = AppSettings.URL;
    }

    login(dataLogin): Observable<any> {
        let json = JSON.stringify(dataLogin);
        var reqHeader = new HttpHeaders({
            'Content-Type': 'application/json'
        });
        reqHeader.append('Accept', 'application/json');
        reqHeader.append('Access-Control-Allow-Methods', 'POST, GET, OPTIONS, DELETE, PUT');
        reqHeader.append('Access-Control-Allow-Origin', '*');
        reqHeader.append('Access-Control-Allow-Headers', "X-Requested-With, Content-Type, Origin, Authorization, Accept, Client-Security-Token, Accept-Encoding");
        return this._http.post(this.url + 'seguridad/login', dataLogin, { headers: reqHeader });
    }

    get(request,token): Observable<any> {
        var reqHeader = new HttpHeaders({
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token
        });
        console.log(request)
        return this._http.post(this.url + 'seguridad/get', request, { headers: reqHeader });
    }

    getrole(token): Observable<any> {
        var reqHeader = new HttpHeaders({
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token
        });
        return this._http.post(this.url + 'seguridad/getrole', {}, { headers: reqHeader });
    }

    resetarclave(data, token): Observable<any> {
        console.log("Reseteando")
        console.log(data);
        var reqHeader = new HttpHeaders({
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token
        });
        return this._http.post(this.url + 'seguridad/resetearclave', data, { headers: reqHeader });
    }

    save(data, token): Observable<any> {
        var reqHeader = new HttpHeaders({
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token
        });
        console.log(data)
        return this._http.post(this.url + 'seguridad/save', data, { headers: reqHeader });
    }

}