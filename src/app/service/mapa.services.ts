import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from "rxjs";
import { AppSettings } from '../common/appsettings';

@Injectable()
export class MapaService {

    public url: String;
    public credentials: any;
    public basic: any;


    constructor(public _http: HttpClient) {
        this.url = AppSettings.URL;
    }

    get(req,token): Observable<any> {
        var reqHeader = new HttpHeaders({
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token
        });
        return this._http.post(this.url + 'mapa/get', req, { headers: reqHeader });
    }

    getDataFormato(req,token): Observable<any> {
        var reqHeader = new HttpHeaders({
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token
        });
        return this._http.post(this.url + 'mapa/getdataformato', req, { headers: reqHeader });
    }
    getDataFormatoReclamo(req,token): Observable<any> {
        var reqHeader = new HttpHeaders({
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token
        });
        return this._http.post(this.url + 'mapa/getdataformatoreclamo', req, { headers: reqHeader });
    }
    getReclamo(req,token): Observable<any> {
        var reqHeader = new HttpHeaders({
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token
        });
        return this._http.post(this.url + 'mapa/getreclamo', req, { headers: reqHeader });
    }

    getRespuesta(req,token): Observable<any> {
        var reqHeader = new HttpHeaders({
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token
        });
        return this._http.post(this.url + 'mapa/getrespuesta', req, { headers: reqHeader });
    }

    getRespuestaAll(req,token): Observable<any> {
        var reqHeader = new HttpHeaders({
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token
        });
        return this._http.post(this.url + 'mapa/getrespuestaall', req, { headers: reqHeader });
    }

    getLamparas(req,token): Observable<any> {
        var reqHeader = new HttpHeaders({
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token
        });
        return this._http.post(this.url + 'mapa/getlamparas', req, { headers: reqHeader });
    }

    getLamparasAll(req,token): Observable<any> {
        var reqHeader = new HttpHeaders({
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token
        });
        return this._http.post(this.url + 'mapa/getlamparasall', req, { headers: reqHeader });
    }

    getEquipos(req,token): Observable<any> {
        var reqHeader = new HttpHeaders({
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token
        });
        return this._http.post(this.url + 'mapa/getequipos', req, { headers: reqHeader });
    }

    getEquiposAll(req,token): Observable<any> {
        var reqHeader = new HttpHeaders({
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token
        });
        return this._http.post(this.url + 'mapa/getequipoall', req, { headers: reqHeader });
    }

    getComponentes(req,token): Observable<any> {
        var reqHeader = new HttpHeaders({
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token
        });
        return this._http.post(this.url + 'mapa/getcomponentes', req, { headers: reqHeader });
    }

    getComponentesAll(req,token): Observable<any> {
        var reqHeader = new HttpHeaders({
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token
        });
        return this._http.post(this.url + 'mapa/getcomponentesall', req, { headers: reqHeader });
    }

    getxls(req,token): Observable<any> {
        var reqHeader = new HttpHeaders({
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token
        });
        return this._http.post(this.url + 'mapa/getxls', req, { headers: reqHeader });
    }

    getDepartamento(token): Observable<any> {
        var reqHeader = new HttpHeaders({
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token
        });
        return this._http.post(this.url + 'mapa/getdepartamento', {}, { headers: reqHeader });
    }

    getProvincia(req,token): Observable<any> {
        var reqHeader = new HttpHeaders({
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token
        });
        return this._http.post(this.url + 'mapa/getprovincia', req, { headers: reqHeader });
    }

    getDistrito(req,token): Observable<any> {
        var reqHeader = new HttpHeaders({
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token
        });
        return this._http.post(this.url + 'mapa/getdistrito', req, { headers: reqHeader });
    }

    getCentroPoblado(req,token): Observable<any> {
        var reqHeader = new HttpHeaders({
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token
        });
        return this._http.post(this.url + 'mapa/getcentropoblado',req, { headers: reqHeader });
    }

    getEntidad(token): Observable<any> {
        var reqHeader = new HttpHeaders({
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token
        });
        return this._http.post(this.url + 'mapa/getentidad', {}, { headers: reqHeader });
    }

    getDetalle(req,token): Observable<any> {
        var reqHeader = new HttpHeaders({
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token
        });
        return this._http.post(this.url + 'mapa/getdetalle', req, { headers: reqHeader });
    }

    getDetalleAll(req,token): Observable<any> {
        var reqHeader = new HttpHeaders({
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token
        });
        return this._http.post(this.url + 'mapa/getdetalleall', req, { headers: reqHeader });
    }
    getCnxCausa(req,token): Observable<any> {
        var reqHeader = new HttpHeaders({
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token
        });
        return this._http.post(this.url + 'mapa/getcnxcausa', req, { headers: reqHeader });
    }
    getDetalleReclamoAll(req,token): Observable<any> {
        var reqHeader = new HttpHeaders({
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token
        });
        return this._http.post(this.url + 'mapa/getdetallereclamoall', req, { headers: reqHeader });
    }
    getdetalleRepartoAll(req,token): Observable<any> {
        var reqHeader = new HttpHeaders({
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token
        });
        return this._http.post(this.url + 'mapa/getdetallerepartoall', req, { headers: reqHeader });
    }
    getReclamosGrilla(req,token): Observable<any> {
        var reqHeader = new HttpHeaders({
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token
        });
        return this._http.post(this.url + 'mapa/getreclamosgrilla', req, { headers: reqHeader });
    }
    getDetalleReclamo(req,token): Observable<any> {
        var reqHeader = new HttpHeaders({
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token
        });
        return this._http.post(this.url + 'mapa/getdetallereclamo', req, { headers: reqHeader });
    }
    getMotivosReclamos(req,token): Observable<any> {
        var reqHeader = new HttpHeaders({
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token
        });
        return this._http.post(this.url + 'mapa/getmotivoreclamo', req, { headers: reqHeader });
    }
    getxlsReparto(req,token): Observable<any> {
        var reqHeader = new HttpHeaders({
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token
        });
        return this._http.post(this.url + 'mapa/getxlsreparto', req, { headers: reqHeader });
    }
    getEquiposRoboSuministro(req,token): Observable<any> {
        var reqHeader = new HttpHeaders({
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token
        });
        return this._http.post(this.url + 'mapa/getequiposrobosuministro', req, { headers: reqHeader });
    }
}