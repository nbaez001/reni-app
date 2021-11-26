package pe.gob.mimp.reni.dao;

import java.util.List;

import pe.gob.mimp.reni.dto.request.FuncionalidadListarRequest;
import pe.gob.mimp.reni.dto.response.FuncionalidadListarResponse;
import pe.gob.mimp.reni.dto.response.OutResponse;

public interface FuncionalidadDao {

	public OutResponse<List<FuncionalidadListarResponse>> listarFuncionalidad(FuncionalidadListarRequest req);
}
