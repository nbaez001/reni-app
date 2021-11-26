package pe.gob.mimp.reni.dao;

import java.util.List;

import pe.gob.mimp.reni.dto.request.LineaIntervencionEliminarRequest;
import pe.gob.mimp.reni.dto.request.LineaIntervencionListarRequest;
import pe.gob.mimp.reni.dto.request.LineaIntervencionModificarRequest;
import pe.gob.mimp.reni.dto.request.LineaIntervencionRegistrarRequest;
import pe.gob.mimp.reni.dto.response.LineaIntervencionListarResponse;
import pe.gob.mimp.reni.dto.response.LineaIntervencionRegistrarResponse;
import pe.gob.mimp.reni.dto.response.OutResponse;

public interface LineaIntervencionDao {

	public OutResponse<List<LineaIntervencionListarResponse>> listarLineaIntervencion(
			LineaIntervencionListarRequest req);

	public OutResponse<LineaIntervencionRegistrarResponse> registrarLineaIntervencion(
			LineaIntervencionRegistrarRequest req);

	public OutResponse<?> modificarLineaIntervencion(LineaIntervencionModificarRequest req);

	public OutResponse<?> eliminarLineaIntervencion(LineaIntervencionEliminarRequest req);
}
