package pe.gob.mimp.reni.service.impl;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.util.List;

import org.apache.commons.lang3.exception.ExceptionUtils;
import org.apache.poi.hssf.usermodel.HSSFWorkbook;
import org.apache.poi.ss.usermodel.Cell;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.ss.usermodel.Workbook;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.factory.PasswordEncoderFactories;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import pe.gob.mimp.reni.dao.CuentaSistemaDao;
import pe.gob.mimp.reni.dto.request.CuentaSistemaBuscarPersonaRequest;
import pe.gob.mimp.reni.dto.request.CuentaSistemaEliminarRequest;
import pe.gob.mimp.reni.dto.request.CuentaSistemaListarRequest;
import pe.gob.mimp.reni.dto.request.CuentaSistemaModificarRequest;
import pe.gob.mimp.reni.dto.request.CuentaSistemaRegistrarRequest;
import pe.gob.mimp.reni.dto.request.CuentaSistemaUsuarioSeguridadBuscarRequest;
import pe.gob.mimp.reni.dto.request.CuentaSistemaValidarUsuarioRequest;
import pe.gob.mimp.reni.dto.response.CuentaSistemaBuscarPersonaResponse;
import pe.gob.mimp.reni.dto.response.CuentaSistemaListarResponse;
import pe.gob.mimp.reni.dto.response.CuentaSistemaRegistrarResponse;
import pe.gob.mimp.reni.dto.response.CuentaSistemaUsuarioSeguridadBuscarResponse;
import pe.gob.mimp.reni.dto.response.FileResponse;
import pe.gob.mimp.reni.dto.response.OutResponse;
import pe.gob.mimp.reni.service.CuentaSistemaService;
import pe.gob.mimp.reni.util.ConstanteUtil;

@Service
public class CuentaSistemaServiceImpl implements CuentaSistemaService {

	private static final Logger log = LoggerFactory.getLogger(CuentaSistemaServiceImpl.class);

	@Autowired
	CuentaSistemaDao cuentaSistemaDao;

	@Override
	public OutResponse<List<CuentaSistemaListarResponse>> listarCuentaSistema(CuentaSistemaListarRequest req) {
		log.info("[LISTAR CUENTA SISTEMA][SERVICE][INICIO]");
		OutResponse<List<CuentaSistemaListarResponse>> out = cuentaSistemaDao.listarCuentaSistema(req);
		log.info("[LISTAR CUENTA SISTEMA][SERVICE][FIN]");
		return out;
	}

	@Override
	public OutResponse<CuentaSistemaRegistrarResponse> registrarCuentaSistema(CuentaSistemaRegistrarRequest req) {
		log.info("[REGISTRAR CUENTA SISTEMA][SERVICE][INICIO]");
		PasswordEncoder encoder = PasswordEncoderFactories.createDelegatingPasswordEncoder();
		req.setContrasenia(encoder.encode(req.getContrasenia()).replace("{bcrypt}", ""));
		OutResponse<CuentaSistemaRegistrarResponse> out = cuentaSistemaDao.registrarCuentaSistema(req,
				listaServiciosToString(req.getListaServicios()));
		log.info("[REGISTRAR CUENTA SISTEMA][SERVICE][FIN]");
		return out;
	}

	@Override
	public OutResponse<?> modificarCuentaSistema(CuentaSistemaModificarRequest req) {
		log.info("[MODIFICAR CUENTA SISTEMA][SERVICE][INICIO]");
		PasswordEncoder encoder = PasswordEncoderFactories.createDelegatingPasswordEncoder();
		req.setContrasenia(encoder.encode(req.getContrasenia()).replace("{bcrypt}", ""));
		OutResponse<?> out = cuentaSistemaDao.modificarCuentaSistema(req,
				listaServiciosToString(req.getListaServicios()));
		log.info("[MODIFICAR CUENTA SISTEMA][SERVICE][FIN]");
		return out;
	}

	@Override
	public OutResponse<?> eliminarCuentaSistema(CuentaSistemaEliminarRequest req) {
		log.info("[ELIMINAR CUENTA SISTEMA][SERVICE][INICIO]");
		OutResponse<?> out = cuentaSistemaDao.eliminarCuentaSistema(req);
		log.info("[ELIMINAR CUENTA SISTEMA][SERVICE][FIN]");
		return out;
	}

	@Override
	public OutResponse<CuentaSistemaBuscarPersonaResponse> buscarPersona(CuentaSistemaBuscarPersonaRequest req) {
		log.info("[BUSCAR CUENTA PERSONA][SERVICE][INICIO]");
		OutResponse<CuentaSistemaBuscarPersonaResponse> out = cuentaSistemaDao.buscarPersona(req);
		log.info("[BUSCAR CUENTA PERSONA][SERVICE][FIN]");
		return out;
	}

	public String listaServiciosToString(List<Long> req) {
		log.info("[REGISTRAR/MODIFICAR CUENTA SISTEMA][SERVICE][CONVERSION DETALLE][INICIO]");
		String listaServicio = "";
		if (req.size() > 0) {
			log.info("[REGISTRAR/MODIFICAR CUENTA SISTEMA][SERVICE][CONVERSION DETALLE][CANT:" + req.size() + "]");
			for (Long rc : req) {
				listaServicio = listaServicio + ((rc != null) ? rc : "0") + "|";
			}
			listaServicio = listaServicio.substring(0, listaServicio.length() - 1);
			log.info("[REGISTRAR/MODIFICAR CUENTA SISTEMA][SERVICE][CONVERSION DETALLE][" + listaServicio + "]");
		} else {
			log.info("[REGISTRAR/MODIFICAR CUENTA SISTEMA][SERVICE][CONVERSION DETALLE][CANT:" + req.size() + "]");
		}
		return listaServicio;
	}

	@Override
	public OutResponse<Integer> validarExisteUsuario(CuentaSistemaValidarUsuarioRequest req) {
		log.info("[VALIDAR EXISTE USUARIO][SERVICE][INICIO]");
		OutResponse<Integer> out = cuentaSistemaDao.validarExisteUsuario(req);
		log.info("[VALIDAR EXISTE USUARIO][SERVICE][FIN]");
		return out;
	}

	@Override
	public OutResponse<CuentaSistemaUsuarioSeguridadBuscarResponse> buscarUsuarioSeguridad(
			CuentaSistemaUsuarioSeguridadBuscarRequest req) {
		log.info("[LISTAR SERVICIOS USUARIOS][SERVICE][INICIO]");
		OutResponse<CuentaSistemaUsuarioSeguridadBuscarResponse> out = cuentaSistemaDao
				.buscarUsuarioSeguridad(req);
		log.info("[LISTAR SERVICIOS USUARIOS][SERVICE][FIN]");
		return out;
	}

	@Override
	public OutResponse<FileResponse> exportarListaCuentaSistemaXlsx(CuentaSistemaListarRequest c) {
		log.info("[EXPORTAR LISTA CUENTA SISTEMA][SERVICE][INICIO]");
		OutResponse<List<CuentaSistemaListarResponse>> out = cuentaSistemaDao.listarCuentaSistema(c);

		OutResponse<FileResponse> outF = new OutResponse<>();
		if (out.getRCodigo() == ConstanteUtil.R_COD_EXITO) {
			try {
				String[] columns = { "Nro", "Usuario", "Perfil", "Nombre y apellidos", "Nro documento", "Area", "Cargo",
						"Estado" };
				int[] anchoColumns = { 1500, 8000, 8000, 18000, 7000, 10000, 9000, 4000 };

				Workbook workbook = new HSSFWorkbook();
				ByteArrayOutputStream stream = new ByteArrayOutputStream();

				Sheet sheet = workbook.createSheet("Cuentas sistema");
				Row row = sheet.createRow(0);

				for (int i = 0; i < columns.length; i++) {
					Cell cell = row.createCell(i);
					cell.setCellValue(columns[i]);
					sheet.setColumnWidth(i, anchoColumns[i]);
				}

				int cont = 1;
				for (CuentaSistemaListarResponse obj : out.getObjeto()) {
					row = sheet.createRow(cont);
					row.createCell(0).setCellValue(cont);
					row.createCell(1).setCellValue(obj.getUsuario());
					row.createCell(2).setCellValue(obj.getNomPerfil());
					row.createCell(3)
							.setCellValue((obj.getNombre() != null ? obj.getNombre() : "") + " "
									+ (obj.getApePaterno() != null ? obj.getApePaterno() : "") + " "
									+ (obj.getApeMaterno() != null ? obj.getApeMaterno() : ""));
					row.createCell(4).setCellValue(obj.getNroDocumento());
					row.createCell(5).setCellValue(obj.getNomArea());
					row.createCell(6).setCellValue(obj.getNomCargo());
					row.createCell(7)
							.setCellValue(obj.getFlgActivo() == ConstanteUtil.FLG_ACTVO ? ConstanteUtil.DESC_ACTIVO
									: ConstanteUtil.DESC_INACTIVO);
					cont++;
				}
				workbook.write(stream);
				workbook.close();

				FileResponse resp = new FileResponse();
				resp.setNombre("Lista Cuentas sistema.xls");
				resp.setType("application/vnd.ms-excel");
				resp.setData(stream.toByteArray());

				outF.setRCodigo(0);
				outF.setRMensaje("EXITO");
				outF.setObjeto(resp);
			} catch (IOException e) {
				log.info(ExceptionUtils.getStackTrace(e));
				outF.setRCodigo(500);
				outF.setRMensaje(e.getMessage());
			}
		} else {
			outF.setRCodigo(out.getRCodigo());
			outF.setRMensaje(out.getRMensaje());
		}
		log.info("[EXPORTAR LISTA CUENTA SISTEMA][SERVICE][FIN]");
		return outF;
	}
}
