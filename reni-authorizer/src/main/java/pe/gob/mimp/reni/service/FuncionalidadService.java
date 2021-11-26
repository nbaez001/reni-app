package pe.gob.mimp.reni.service;

import java.util.List;

import pe.gob.mimp.reni.dto.request.FuncionalidadListarRequest;
import pe.gob.mimp.reni.dto.response.FuncionalidadListarResponse;
import pe.gob.mimp.reni.dto.response.OutResponse;

public interface FuncionalidadService {

	public OutResponse<List<FuncionalidadListarResponse>> listarFuncionalidad(FuncionalidadListarRequest req);
}
