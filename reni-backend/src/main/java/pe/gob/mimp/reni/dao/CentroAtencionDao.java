package pe.gob.mimp.reni.dao;

import java.util.List;

import pe.gob.mimp.reni.dto.request.CentroAtencionAsociarServicioRequest;
import pe.gob.mimp.reni.dto.request.CentroAtencionCargaMasivaDetalleRequest;
import pe.gob.mimp.reni.dto.request.CentroAtencionEliminarRequest;
import pe.gob.mimp.reni.dto.request.CentroAtencionEliminarServicioAsocRequest;
import pe.gob.mimp.reni.dto.request.CentroAtencionListarRequest;
import pe.gob.mimp.reni.dto.request.CentroAtencionModificarRequest;
import pe.gob.mimp.reni.dto.request.CentroAtencionRegistrarRequest;
import pe.gob.mimp.reni.dto.request.CentroAtencionServListarXCentroRequest;
import pe.gob.mimp.reni.dto.request.CentroAtencionServListarXTipCenRequest;
import pe.gob.mimp.reni.dto.response.CentroAtencionAsociarServicioResponse;
import pe.gob.mimp.reni.dto.response.CentroAtencionCargaMasivaCentroListarResponse;
import pe.gob.mimp.reni.dto.response.CentroAtencionCargaMasivaServListarResponse;
import pe.gob.mimp.reni.dto.response.CentroAtencionListarResponse;
import pe.gob.mimp.reni.dto.response.CentroAtencionRegistrarResponse;
import pe.gob.mimp.reni.dto.response.CentroAtencionServListarXCentroResponse;
import pe.gob.mimp.reni.dto.response.CentroAtencionServListarXTipCenResponse;
import pe.gob.mimp.reni.dto.response.OutResponse;

public interface CentroAtencionDao {

	public OutResponse<List<CentroAtencionListarResponse>> listarCentroAtencion(CentroAtencionListarRequest req);

	public OutResponse<CentroAtencionRegistrarResponse> registrarCentroAtencion(CentroAtencionRegistrarRequest req);

	public OutResponse<?> modificarCentroAtencion(CentroAtencionModificarRequest req);

	public OutResponse<?> eliminarCentroAtencion(CentroAtencionEliminarRequest req);

	public OutResponse<List<CentroAtencionServListarXTipCenResponse>> listarServicioXTipoCentro(
			CentroAtencionServListarXTipCenRequest req);

	public OutResponse<List<CentroAtencionServListarXCentroResponse>> listarServicioXCentro(
			CentroAtencionServListarXCentroRequest req);

	public OutResponse<CentroAtencionAsociarServicioResponse> registrarServicioCentroAtencion(
			CentroAtencionAsociarServicioRequest req);

	public OutResponse<?> eliminarServicioCentroAtencion(CentroAtencionEliminarServicioAsocRequest req);

	public OutResponse<List<CentroAtencionCargaMasivaServListarResponse>> listarServicio(String req);

	public OutResponse<List<CentroAtencionCargaMasivaCentroListarResponse>> listarCentro(String req);

	public OutResponse<Long> cargaMasivaCentroAtencion(CentroAtencionCargaMasivaDetalleRequest req, Long idUsuario)
			throws Exception;

	public OutResponse<Long> cargaMasivaCentroAtencionAsocServicio(Long idCentroAtencion, Long idServicio,
			Long idUsuario) throws Exception;

	public OutResponse<?> actUbigeosCentroAtencion(Long idCentroAtencion, String departamento, String provincia,
			String distrito, Long idUsuario);
}
