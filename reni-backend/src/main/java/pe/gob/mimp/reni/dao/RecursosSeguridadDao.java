package pe.gob.mimp.reni.dao;

import java.util.List;

import pe.gob.mimp.reni.dto.response.OutResponse;
import pe.gob.mimp.reni.dto.response.RecursosSeguridadListarCargoResponse;
import pe.gob.mimp.reni.dto.response.RecursosSeguridadListarTipoDocumResponse;

public interface RecursosSeguridadDao {

	public OutResponse<List<RecursosSeguridadListarTipoDocumResponse>> listarTipoDocumento();

	public OutResponse<List<RecursosSeguridadListarCargoResponse>> listarCargo();
}
