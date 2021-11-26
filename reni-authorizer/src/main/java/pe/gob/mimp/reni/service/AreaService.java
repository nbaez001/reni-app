package pe.gob.mimp.reni.service;

import java.util.List;

import pe.gob.mimp.reni.dto.request.AreaBuscarRequest;
import pe.gob.mimp.reni.dto.request.AreaListarRequest;
import pe.gob.mimp.reni.dto.response.AreaBuscarResponse;
import pe.gob.mimp.reni.dto.response.AreaListarResponse;
import pe.gob.mimp.reni.dto.response.OutResponse;

public interface AreaService {

	public OutResponse<List<AreaListarResponse>> listarArea(AreaListarRequest req);
	
	public OutResponse<AreaBuscarResponse> buscarArea(AreaBuscarRequest req);
}
