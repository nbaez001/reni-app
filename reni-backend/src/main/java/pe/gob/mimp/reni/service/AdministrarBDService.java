package pe.gob.mimp.reni.service;

import java.util.List;

import pe.gob.mimp.reni.dto.request.BDCampoTablaListarRequest;
import pe.gob.mimp.reni.dto.request.BDCampoTablaRegistrarRequest;
import pe.gob.mimp.reni.dto.response.BDCampoTablaListarResponse;
import pe.gob.mimp.reni.dto.response.BDTablaListarResponse;
import pe.gob.mimp.reni.dto.response.OutResponse;

public interface AdministrarBDService {

	public OutResponse<List<BDTablaListarResponse>> listarTablasBD();

	public OutResponse<List<BDCampoTablaListarResponse>> listarCamposBD(BDCampoTablaListarRequest req);

	public OutResponse<?> registrarCamposBD(BDCampoTablaRegistrarRequest req);
}
