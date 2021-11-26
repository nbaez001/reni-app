package pe.gob.mimp.reni.service;

import java.util.List;

import pe.gob.mimp.reni.dto.request.ServicioEliminarRequest;
import pe.gob.mimp.reni.dto.request.ServicioListarRequest;
import pe.gob.mimp.reni.dto.request.ServicioModificarRequest;
import pe.gob.mimp.reni.dto.request.ServicioRegistrarRequest;
import pe.gob.mimp.reni.dto.response.ServicioListarResponse;
import pe.gob.mimp.reni.dto.response.ServicioRegistrarResponse;
import pe.gob.mimp.reni.dto.response.FileResponse;
import pe.gob.mimp.reni.dto.response.OutResponse;

public interface ServicioService {

	public OutResponse<List<ServicioListarResponse>> listarServicio(ServicioListarRequest req);

	public OutResponse<ServicioRegistrarResponse> registrarServicio(ServicioRegistrarRequest req);

	public OutResponse<?> modificarServicio(ServicioModificarRequest req);

	public OutResponse<?> eliminarServicio(ServicioEliminarRequest req);
	
	public OutResponse<FileResponse> exportarListaServicioXlsx(ServicioListarRequest c);
}
