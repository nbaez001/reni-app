package pe.gob.mimp.reni.dao;

import java.util.List;

import pe.gob.mimp.reni.dto.request.SubtipoCentroEliminarRequest;
import pe.gob.mimp.reni.dto.request.SubtipoCentroListarRequest;
import pe.gob.mimp.reni.dto.request.SubtipoCentroModificarRequest;
import pe.gob.mimp.reni.dto.request.SubtipoCentroRegistrarRequest;
import pe.gob.mimp.reni.dto.request.TipoCentroEliminarRequest;
import pe.gob.mimp.reni.dto.request.TipoCentroListarRequest;
import pe.gob.mimp.reni.dto.request.TipoCentroModificarRequest;
import pe.gob.mimp.reni.dto.request.TipoCentroRegistrarRequest;
import pe.gob.mimp.reni.dto.response.OutResponse;
import pe.gob.mimp.reni.dto.response.SubtipoCentroListarResponse;
import pe.gob.mimp.reni.dto.response.SubtipoCentroRegistrarResponse;
import pe.gob.mimp.reni.dto.response.TipoCentroListarResponse;
import pe.gob.mimp.reni.dto.response.TipoCentroRegistrarResponse;

public interface TipoCentroAtencionDao {

	public OutResponse<List<TipoCentroListarResponse>> listarTipoCentro(TipoCentroListarRequest req);

	public OutResponse<TipoCentroRegistrarResponse> registrarTipoCentro(TipoCentroRegistrarRequest req);

	public OutResponse<?> modificarTipoCentro(TipoCentroModificarRequest req);

	public OutResponse<?> eliminarTipoCentro(TipoCentroEliminarRequest req);

	public OutResponse<List<SubtipoCentroListarResponse>> listarSubtipoCentro(SubtipoCentroListarRequest req);

	public OutResponse<SubtipoCentroRegistrarResponse> registrarSubtipoCentro(SubtipoCentroRegistrarRequest req);

	public OutResponse<?> modificarSubtipoCentro(SubtipoCentroModificarRequest req);

	public OutResponse<?> eliminarSubtipoCentro(SubtipoCentroEliminarRequest req);
}
