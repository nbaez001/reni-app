import { Injectable } from '@angular/core';
import { FuncionalidadUsuarioListarResponse } from '../dto/response/funcionalidad-usuario-listar.response';
import { Oauth2Response } from '../dto/response/oauth2-response';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {
  idUsuario: number;
  idModulo: number;
  idPersona: number;
  idTipDocumento: number;
  nomTipDocumento: string;
  nroDocumento: string;
  apePaterno: string;
  apeMaterno: string;
  nombres: string;
  idCargo: number;
  nomCargo: string;
  idArea: number;
  nomArea: string;
  idPerfil: number;
  nomPerfil: string;

  access_token: string;
  refresh_token: string;
  listaFuncionalidad: FuncionalidadUsuarioListarResponse[];

  constructor() { }

  set setIdUsuario(idUsuario: number) { this.idUsuario = idUsuario; }
  set setIdModulo(idModulo: number) { this.idModulo = idModulo; }
  set setIdPersona(idPersona: number) { this.idPersona = idPersona; }
  set setIdTipDocumento(idTipDocumento: number) { this.idTipDocumento = idTipDocumento; }
  set setNomTipDocumento(nomTipDocumento: string) { this.nomTipDocumento = nomTipDocumento; }
  set setNroDocumento(nroDocumento: string) { this.nroDocumento = nroDocumento; }
  set setApePaterno(apePaterno: string) { this.apePaterno = apePaterno; }
  set setApeMaterno(apeMaterno: string) { this.apeMaterno = apeMaterno; }
  set setNombres(nombres: string) { this.nombres = nombres; }
  set setIdCargo(idCargo: number) { this.idCargo = idCargo; }
  set setNomCargo(nomCargo: string) { this.nomCargo = nomCargo; }
  set setIdArea(idArea: number) { this.idArea = idArea; }
  set setNomArea(nomArea: string) { this.nomArea = nomArea; }
  set setIdPerfil(idPerfil: number) { this.idPerfil = idPerfil; }
  set setNomPerfil(nomPerfil: string) { this.nomPerfil = nomPerfil; }

  set setAccessToken(access_token: string) { this.access_token = access_token; }
  set setRefreshToken(refresh_token: string) { this.refresh_token = refresh_token; }
  set setListaFuncionalidad(listaFuncionalidad: FuncionalidadUsuarioListarResponse[]) { this.listaFuncionalidad = listaFuncionalidad; }

  get getIdUsuario() { return this.idUsuario }
  get getIdModulo() { return this.idModulo }
  get getIdPersona() { return this.idPersona }
  get getIdTipDocumento() { return this.idTipDocumento }
  get getNomTipDocumento() { return this.nomTipDocumento }
  get getNroDocumento() { return this.nroDocumento }
  get getApePaterno() { return this.apePaterno }
  get getApeMaterno() { return this.apeMaterno }
  get getNombres() { return this.nombres }
  get getIdCargo() { return this.idCargo }
  get getNomCargo() { return this.nomCargo }
  get getIdArea() { return this.idArea }
  get getNomArea() { return this.nomArea }
  get getIdPerfil() { return this.idPerfil }
  get getNomPerfil() { return this.nomPerfil }

  get getAccessToken() { return this.access_token }
  get getRefreshToken() { return this.refresh_token }
  get getListaFuncionalidad() { return this.listaFuncionalidad }

  limpiarRegistro(): void {
    this.idUsuario = null;
    this.idModulo = null;
    this.idPersona = null;
    this.idTipDocumento = null;
    this.nomTipDocumento = null;
    this.nroDocumento = null;
    this.apePaterno = null;
    this.apeMaterno = null;
    this.nombres = null;
    this.idCargo = null;
    this.nomCargo = null;
    this.idArea = null;
    this.nomArea = null;
    this.idPerfil = null;
    this.nomPerfil = null;

    this.access_token = null;
    this.refresh_token = null;
    this.listaFuncionalidad = null;
    return null;
  }

  setValues(auth: Oauth2Response, lista: FuncionalidadUsuarioListarResponse[]): void {
    this.idUsuario = auth.idUsuario;
    this.idModulo = auth.idModulo;
    this.idPersona = auth.idPersona;
    this.idTipDocumento = auth.idTipDocumento;
    this.nomTipDocumento = auth.nomTipDocumento;
    this.nroDocumento = auth.nroDocumento;
    this.apePaterno = auth.apePaterno;
    this.apeMaterno = auth.apeMaterno;
    this.nombres = auth.nombres;
    this.idCargo = auth.idCargo;
    this.nomCargo = auth.nomCargo;
    this.idArea = auth.idArea;
    this.nomArea = auth.nomArea;
    this.idPerfil = auth.idPerfil;
    this.nomPerfil = auth.nomPerfil;

    this.access_token = auth.access_token;
    this.refresh_token = auth.refresh_token;
    this.listaFuncionalidad = lista;
  }

  setTokenValues(auth: Oauth2Response): void {
    this.idUsuario = auth.idUsuario;
    this.idModulo = auth.idModulo;
    this.idPersona = auth.idPersona;
    this.idTipDocumento = auth.idTipDocumento;
    this.nomTipDocumento = auth.nomTipDocumento;
    this.nroDocumento = auth.nroDocumento;
    this.apePaterno = auth.apePaterno;
    this.apeMaterno = auth.apeMaterno;
    this.nombres = auth.nombres;
    this.idCargo = auth.idCargo;
    this.nomCargo = auth.nomCargo;
    this.idArea = auth.idArea;
    this.nomArea = auth.nomArea;
    this.idPerfil = auth.idPerfil;
    this.nomPerfil = auth.nomPerfil;

    this.access_token = auth.access_token;
    this.refresh_token = auth.refresh_token;
  }

  setFuncionlidad(lista: FuncionalidadUsuarioListarResponse[]): void {
    this.listaFuncionalidad = lista;
  }
}
