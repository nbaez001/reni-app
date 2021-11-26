package pe.gob.mimp.reni.service;

import java.util.List;

import pe.gob.mimp.reni.dto.request.UbigeoDistritoListarRequest;
import pe.gob.mimp.reni.dto.request.UbigeoDistritoListarXUbigeoRequest;
import pe.gob.mimp.reni.dto.request.UbigeoProvinciaListarRequest;
import pe.gob.mimp.reni.dto.request.UbigeoProvinciaListarXUbigeoRequest;
import pe.gob.mimp.reni.dto.response.OutResponse;
import pe.gob.mimp.reni.dto.response.UbigeoDepartamentoListarResponse;
import pe.gob.mimp.reni.dto.response.UbigeoDistritoListarResponse;
import pe.gob.mimp.reni.dto.response.UbigeoObtenerDescUbigeoResponse;
import pe.gob.mimp.reni.dto.response.UbigeoProvinciaListarResponse;

public interface UbigeoService {

	public OutResponse<List<UbigeoDepartamentoListarResponse>> listarDepartamento();

	public OutResponse<List<UbigeoProvinciaListarResponse>> listarProvincia(UbigeoProvinciaListarRequest req);

	public OutResponse<List<UbigeoDistritoListarResponse>> listarDistrito(UbigeoDistritoListarRequest req);

	public OutResponse<List<UbigeoProvinciaListarResponse>> listarProvinciaXUbigeo(
			UbigeoProvinciaListarXUbigeoRequest req);

	public OutResponse<List<UbigeoDistritoListarResponse>> listarDistritoXUbigeo(
			UbigeoDistritoListarXUbigeoRequest req);

	public OutResponse<UbigeoObtenerDescUbigeoResponse> obtenerDescripcionUbigeo(String req);
}
