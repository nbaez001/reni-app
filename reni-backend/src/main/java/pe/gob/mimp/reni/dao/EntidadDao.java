package pe.gob.mimp.reni.dao;

import java.util.List;

import pe.gob.mimp.reni.dto.request.EntidadEliminarRequest;
import pe.gob.mimp.reni.dto.request.EntidadListarRequest;
import pe.gob.mimp.reni.dto.request.EntidadModificarRequest;
import pe.gob.mimp.reni.dto.request.EntidadRegistrarRequest;
import pe.gob.mimp.reni.dto.response.EntidadListarResponse;
import pe.gob.mimp.reni.dto.response.EntidadRegistrarResponse;
import pe.gob.mimp.reni.dto.response.OutResponse;

public interface EntidadDao {

	public OutResponse<List<EntidadListarResponse>> listarEntidad(EntidadListarRequest req);

	public OutResponse<EntidadRegistrarResponse> registrarEntidad(EntidadRegistrarRequest req);

	public OutResponse<?> modificarEntidad(EntidadModificarRequest req);

	public OutResponse<?> eliminarEntidad(EntidadEliminarRequest req);
	
//	public OutResponse<?> alterTable(String nombre); 
}
