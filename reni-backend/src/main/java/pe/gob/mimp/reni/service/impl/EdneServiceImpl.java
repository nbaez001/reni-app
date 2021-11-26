package pe.gob.mimp.reni.service.impl;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.text.SimpleDateFormat;
import java.util.Collections;
import java.util.Comparator;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.apache.commons.lang3.exception.ExceptionUtils;
import org.apache.poi.hssf.usermodel.HSSFWorkbook;
import org.apache.poi.ss.usermodel.Cell;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.ss.usermodel.Workbook;
import org.apache.poi.ss.util.CellRangeAddress;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import pe.gob.mimp.reni.dao.EdneDao;
import pe.gob.mimp.reni.dto.request.EdneDescargarPlantillaRequest;
import pe.gob.mimp.reni.dto.request.EdneEliminarRequest;
import pe.gob.mimp.reni.dto.request.EdneListarParamEstructuraRequest;
import pe.gob.mimp.reni.dto.request.EdneListarRequest;
import pe.gob.mimp.reni.dto.request.EdneListarUsuarioXCodigoRequest;
import pe.gob.mimp.reni.dto.request.EdneListarUsuarioXDocumentoDetRequest;
import pe.gob.mimp.reni.dto.request.EdneListarUsuarioXDocumentoRequest;
import pe.gob.mimp.reni.dto.request.EdneModificarListarUsuarioRequest;
import pe.gob.mimp.reni.dto.request.EdneModificarRequest;
import pe.gob.mimp.reni.dto.request.EdneRegistrarDetUsuarioRequest;
import pe.gob.mimp.reni.dto.request.EdneRegistrarRequest;
import pe.gob.mimp.reni.dto.response.EdneListarParamEstructuraResponse;
import pe.gob.mimp.reni.dto.response.EdneListarResponse;
import pe.gob.mimp.reni.dto.response.EdneListarUsuarioXCodigoResponse;
import pe.gob.mimp.reni.dto.response.EdneListarUsuarioXDocumentoResponse;
import pe.gob.mimp.reni.dto.response.EdneRegistrarResponse;
import pe.gob.mimp.reni.dto.response.FileResponse;
import pe.gob.mimp.reni.dto.response.OutResponse;
import pe.gob.mimp.reni.service.EdneService;
import pe.gob.mimp.reni.util.ConstanteUtil;
import pe.gob.mimp.reni.util.StringUtil;

@Service
public class EdneServiceImpl implements EdneService {

	private static final Logger log = LoggerFactory.getLogger(EdneServiceImpl.class);

	@Autowired
	EdneDao edneDao;

	@Override
	public OutResponse<List<EdneListarResponse>> listarEdne(EdneListarRequest req) {
		log.info("[LISTAR EDNE][SERVICE][INICIO]");
		OutResponse<List<EdneListarResponse>> out = edneDao.listarEdne(req);
		log.info("[LISTAR EDNE][SERVICE][FIN]");
		return out;
	}

//	@Override
//	public OutResponse<EdneRegistrarResponse> registrarEdne(EdneRegistrarRequest req) {
//		log.info("[REGISTRAR EDNE][SERVICE][INICIO]");
//		OutResponse<EdneRegistrarResponse> out = edneDao.registrarEdne(req,
//				listaDetUsuarioIdentificadoToString(req.getListaUsuarioIdentificado()),
//				(req.getListaUsuarioIdentificado() != null) ? req.getListaUsuarioIdentificado().size() : 0,
//				listaDetUsuarioNoIdentificadoToString(req.getListaUsuarioNoIdentificado()),
//				(req.getListaUsuarioNoIdentificado() != null) ? req.getListaUsuarioNoIdentificado().size() : 0);
//		log.info("[REGISTRAR EDNE][SERVICE][FIN]");
//		return out;
//	}

	@Override
	public OutResponse<?> modificarEdne(EdneModificarRequest req) {
		log.info("[MODIFICAR EDNE][SERVICE][INICIO]");
		OutResponse<?> out = edneDao.modificarEdne(req);
		log.info("[MODIFICAR EDNE][SERVICE][FIN]");
		return out;
	}

	@Override
	public OutResponse<?> eliminarEdne(EdneEliminarRequest req) {
		log.info("[ELIMINAR EDNE][SERVICE][INICIO]");
		OutResponse<?> out = edneDao.eliminarEdne(req);
		log.info("[ELIMINAR EDNE][SERVICE][FIN]");
		return out;
	}

	public String listaDetUsuarioNoIdentificadoToString(List<EdneRegistrarDetUsuarioRequest> req) {
		log.info("[REGISTRAR EDNE][SERVICE][CONVERSION DETALLE NO IDENT][INICIO]");
		String listaDetalle = "";
		if (req != null && req.size() > 0) {
			log.info("[REGISTRAR EDNE][SERVICE][CONVERSION DETALLE NO IDENT][CANT:" + req.size() + "]");
			for (EdneRegistrarDetUsuarioRequest rc : req) {
				listaDetalle = listaDetalle
						+ ((!StringUtil.isNullOrBlank(rc.getDatUsuario()))
								? StringUtil.repComillaToAmpersand(rc.getDatUsuario())
								: "(NULL)")
						+ "#"
						+ ((!StringUtil.isNullOrBlank(rc.getDatUsuarioDetalle()))
								? StringUtil.repComillaToAmpersand(rc.getDatUsuarioDetalle())
								: "(NULL)")
						+ "#"
						+ ((!StringUtil.isNullOrBlank(rc.getDatUsuarioIngreso()))
								? StringUtil.repComillaToAmpersand(rc.getDatUsuarioIngreso())
								: "(NULL)")
						+ "#"
						+ ((!StringUtil.isNullOrBlank(rc.getDatUsuarioAgenteExter()))
								? StringUtil.repComillaToAmpersand(rc.getDatUsuarioAgenteExter())
								: "(NULL)")
						+ "#"
						+ ((!StringUtil.isNullOrBlank(rc.getDatUsuarioActividad()))
								? StringUtil.repComillaToAmpersand(rc.getDatUsuarioActividad())
								: "(NULL)")
						+ "#"
						+ ((!StringUtil.isNullOrBlank(rc.getDatUsuarioSituacion()))
								? StringUtil.repComillaToAmpersand(rc.getDatUsuarioSituacion())
								: "(NULL)")
						+ "|";
			}
			listaDetalle = listaDetalle.substring(0, listaDetalle.length() - 1);
			log.info("[REGISTRAR EDNE][SERVICE][CONVERSION DETALLE NO IDENT][" + listaDetalle + "]");
		} else {
			log.info("[REGISTRAR EDNE][SERVICE][CONVERSION DETALLE NO IDENT][CANT:"
					+ ((req != null) ? req.size() : "NULL") + "]");
		}
		return listaDetalle;
	}

	public String listaDetUsuarioIdentificadoToString(List<EdneRegistrarDetUsuarioRequest> req) {
		log.info("[REGISTRAR EDNE][SERVICE][CONVERSION DETALLE][INICIO]");
		String listaDetalle = "";
		if (req != null && req.size() > 0) {
			log.info("[REGISTRAR EDNE][SERVICE][CONVERSION DETALLE][CANT:" + req.size() + "]");
			for (EdneRegistrarDetUsuarioRequest rc : req) {
				listaDetalle = listaDetalle
						+ ((!StringUtil.isNullOrBlank(rc.getDatUsuarioDetalle()))
								? StringUtil.repComillaToAmpersand(rc.getDatUsuarioDetalle())
								: "(NULL)")
						+ "#"
						+ ((!StringUtil.isNullOrBlank(rc.getDatUsuarioIngreso()))
								? StringUtil.repComillaToAmpersand(rc.getDatUsuarioIngreso())
								: "(NULL)")
						+ "#"
						+ ((!StringUtil.isNullOrBlank(rc.getDatUsuarioAgenteExter()))
								? StringUtil.repComillaToAmpersand(rc.getDatUsuarioAgenteExter())
								: "(NULL)")
						+ "#"
						+ ((!StringUtil.isNullOrBlank(rc.getDatUsuarioActividad()))
								? StringUtil.repComillaToAmpersand(rc.getDatUsuarioActividad())
								: "(NULL)")
						+ "#"
						+ ((!StringUtil.isNullOrBlank(rc.getDatUsuarioSituacion()))
								? StringUtil.repComillaToAmpersand(rc.getDatUsuarioSituacion())
								: "(NULL)")
						+ "|";
			}
			listaDetalle = listaDetalle.substring(0, listaDetalle.length() - 1);
			log.info("[REGISTRAR EDNE][SERVICE][CONVERSION DETALLE][" + listaDetalle + "]");
		} else {
			log.info("[REGISTRAR EDNE][SERVICE][CONVERSION DETALLE][CANT:" + ((req != null) ? req.size() : "NULL")
					+ "]");
		}
		return listaDetalle;
	}

	@Override
	public OutResponse<List<EdneListarParamEstructuraResponse>> listarParamEstructura(
			EdneListarParamEstructuraRequest req) {
		log.info("[LISTAR PARAMETRO ESTRUCTURA][SERVICE][INICIO]");
		OutResponse<List<EdneListarParamEstructuraResponse>> out = edneDao.listarParamEstructura(req);
		log.info("[LISTAR PARAMETRO ESTRUCTURA][SERVICE][FIN]");
		return out;
	}

	@Override
	public OutResponse<List<EdneListarUsuarioXCodigoResponse>> listarUsuarioXCodigo(
			EdneListarUsuarioXCodigoRequest req) {
		log.info("[LISTAR USUARIO X CODIGO][SERVICE][INICIO]");
		OutResponse<List<EdneListarUsuarioXCodigoResponse>> out = edneDao.listarUsuarioXCodigo(req,
				listaCodigoUsuarioToString(req.getListaCodigos()),
				(req.getListaCodigos() != null) ? req.getListaCodigos().size() : 0);
		log.info("[LISTAR USUARIO X CODIGO][SERVICE][FIN]");
		return out;
	}

	@Override
	public OutResponse<List<EdneListarUsuarioXDocumentoResponse>> listarUsuarioXDocumento(
			EdneListarUsuarioXDocumentoRequest req) {
		log.info("[LISTAR USUARIO X DOCUMENTO][SERVICE][INICIO]");
		OutResponse<List<EdneListarUsuarioXDocumentoResponse>> out = edneDao.listarUsuarioXDocumento(req,
				listaDocumentoUsuarioToString(req.getListaUsuarioDocumento()),
				(req.getListaUsuarioDocumento() != null) ? req.getListaUsuarioDocumento().size() : 0);
		log.info("[LISTAR USUARIO X DOCUMENTO][SERVICE][FIN]");
		return out;
	}

	public String listaCodigoUsuarioToString(List<String> req) {
		log.info("[LISTAR USUARIO X CODIGO][SERVICE][CONVERSION DETALLE][INICIO]");
		String listaDetalle = "";
		if (req != null && req.size() > 0) {
			log.info("[LISTAR USUARIO X CODIGO][SERVICE][CONVERSION DETALLE][CANT:" + req.size() + "]");
			for (String rc : req) {
				listaDetalle = listaDetalle + ((!StringUtil.isNullOrBlank(rc)) ? rc : "(NULL)") + "|";
			}
			listaDetalle = listaDetalle.substring(0, listaDetalle.length() - 1);
			log.info("[LISTAR USUARIO X CODIGO][SERVICE][CONVERSION DETALLE][" + listaDetalle + "]");
		} else {
			log.info("[LISTAR USUARIO X CODIGO][SERVICE][CONVERSION DETALLE][CANT:"
					+ ((req != null) ? req.size() : "NULL") + "]");
		}
		return listaDetalle;
	}

	public String listaDocumentoUsuarioToString(List<EdneListarUsuarioXDocumentoDetRequest> req) {
		log.info("[LISTAR USUARIO X DOCUMENTO][SERVICE][CONVERSION DETALLE][INICIO]");
		String listaDetalle = "";
		if (req != null && req.size() > 0) {
			log.info("[LISTAR USUARIO X DOCUMENTO][SERVICE][CONVERSION DETALLE][CANT:" + req.size() + "]");
			for (EdneListarUsuarioXDocumentoDetRequest rc : req) {
				listaDetalle = listaDetalle
						+ ((!StringUtil.isNullOrBlank(rc.getNroDocumento())) ? rc.getNroDocumento() : "(NULL)") + "#"
						+ ((!StringUtil.isNullOrBlank(rc.getTipDocumento())) ? rc.getTipDocumento() : "(NULL)") + "|";
			}
			listaDetalle = listaDetalle.substring(0, listaDetalle.length() - 1);
			log.info("[LISTAR USUARIO X DOCUMENTO][SERVICE][CONVERSION DETALLE][" + listaDetalle + "]");
		} else {
			log.info("[LISTAR USUARIO X DOCUMENTO][SERVICE][CONVERSION DETALLE][CANT:"
					+ ((req != null) ? req.size() : "NULL") + "]");
		}
		return listaDetalle;
	}

	@Override
	public OutResponse<List<Map<String, Object>>> listarUsuariosEdne(EdneModificarListarUsuarioRequest req) {
		log.info("[LISTAR USUARIOS EDNE][SERVICE][INICIO]");
		OutResponse<List<Map<String, Object>>> out = edneDao.listarUsuariosEdne(req);
		log.info("[LISTAR USUARIOS EDNE][SERVICE][FIN]");
		return out;
	}

	@Override
	@Transactional(rollbackFor = { Exception.class })
	public OutResponse<EdneRegistrarResponse> registrarEdne(EdneRegistrarRequest req) throws Exception {
		log.info("[REGISTRAR EDNE PRUEBA][SERVICE][INICIO]");
		log.info("[REGISTRAR EDNE PRUEBA][SERVICE][CANT. USUARIOS][" + req.getListaUsuario().size() + "]");
		log.info("[REGISTRAR EDNE PRUEBA][SERVICE][CANT. PARAMETROS][" + req.getListaParametro().size() + "]");
		String valueUsu = "";
		String valueUsuDetalle = "";
		String valueUsuIngreso = "";
		String valueUsuAgent = "";
		String valueUsuActividad = "";
		String valueUsuSituacion = "";
		String queryUsu = null;
		String queryUsuDetalle = null;
		String queryUsuIngreso = null;
		String queryUsuAgent = null;
		String queryUsuActividad = null;
		String queryUsuSituacion = null;

		// USUARIO
		List<EdneListarParamEstructuraResponse> listaFiltUsu = req.getListaParametro().stream().filter(u -> {
			return u.getNomTablaBd().equals(ConstanteUtil.TB_USUARIO);
		}).collect(Collectors.toList());
		Collections.sort(listaFiltUsu, new Comparator<EdneListarParamEstructuraResponse>() {
			public int compare(EdneListarParamEstructuraResponse o1, EdneListarParamEstructuraResponse o2) {
				return o1.getOrdenCampoExcel().compareTo(o2.getOrdenCampoExcel());
			}
		});
		if (listaFiltUsu.size() > 0) {
			queryUsu = "INSERT INTO " + ConstanteUtil.TB_USUARIO + "(" + ConstanteUtil.TB_USUARIO_CAMPO_NID_USUARIO
					+ buildQuery(listaFiltUsu) + ConstanteUtil.SQL_AUDITORIA_QUERY;
			valueUsu = "VALUES({" + ConstanteUtil.TB_USUARIO_CAMPO_NID_USUARIO + "}" + buildValue(listaFiltUsu)
					+ ConstanteUtil.SQL_AUDITORIA_DATA;
		}
		// FIN USUARIO

		// USUARIO_DETALLE
		List<EdneListarParamEstructuraResponse> listaFiltUsuDetalle = req.getListaParametro().stream().filter(u -> {
			return u.getNomTablaBd().equals(ConstanteUtil.TB_USUARIO_DETALLE);
		}).collect(Collectors.toList());
		Collections.sort(listaFiltUsuDetalle, new Comparator<EdneListarParamEstructuraResponse>() {
			public int compare(EdneListarParamEstructuraResponse o1, EdneListarParamEstructuraResponse o2) {
				return o1.getOrdenCampoExcel().compareTo(o2.getOrdenCampoExcel());
			}
		});
		if (listaFiltUsuDetalle.size() > 0) {
			queryUsuDetalle = "INSERT INTO " + ConstanteUtil.TB_USUARIO_DETALLE + "("
					+ ConstanteUtil.TB_USUARIO_DETALLE_CAMPO_NID_USUARIO_DETALLE + ","
					+ ConstanteUtil.TB_USUARIO_DETALLE_CAMPO_NID_USUARIO + ","
					+ ConstanteUtil.TB_USUARIO_DETALLE_CAMPO_NID_EDNE + ","
					+ ConstanteUtil.TB_USUARIO_DETALLE_CAMPO_NID_CENTRO_ATEN + buildQuery(listaFiltUsuDetalle)
					+ ConstanteUtil.SQL_AUDITORIA_QUERY;
			valueUsuDetalle = "VALUES({" + ConstanteUtil.TB_USUARIO_DETALLE_CAMPO_NID_USUARIO_DETALLE + "},{"
					+ ConstanteUtil.TB_USUARIO_DETALLE_CAMPO_NID_USUARIO + "},{"
					+ ConstanteUtil.TB_USUARIO_DETALLE_CAMPO_NID_EDNE + "},{"
					+ ConstanteUtil.TB_USUARIO_DETALLE_CAMPO_NID_CENTRO_ATEN + "}" + buildValue(listaFiltUsuDetalle)
					+ ConstanteUtil.SQL_AUDITORIA_DATA;
		}
		// FIN USUARIO_DETALLE

		// USUARIO_INGRESO
		List<EdneListarParamEstructuraResponse> listaFiltUsuIngreso = req.getListaParametro().stream().filter(u -> {
			return u.getNomTablaBd().equals(ConstanteUtil.TB_USUARIO_INGRESO);
		}).collect(Collectors.toList());
		Collections.sort(listaFiltUsuIngreso, new Comparator<EdneListarParamEstructuraResponse>() {
			public int compare(EdneListarParamEstructuraResponse o1, EdneListarParamEstructuraResponse o2) {
				return o1.getOrdenCampoExcel().compareTo(o2.getOrdenCampoExcel());
			}
		});
		if (listaFiltUsuIngreso.size() > 0) {
			queryUsuIngreso = "INSERT INTO " + ConstanteUtil.TB_USUARIO_INGRESO + "("
					+ ConstanteUtil.TB_USUARIO_INGRESO_CAMPO_NID_USUARIO_INGRESO + ","
					+ ConstanteUtil.TB_USUARIO_INGRESO_CAMPO_NID_USUARIO_DETALLE + buildQuery(listaFiltUsuIngreso)
					+ ConstanteUtil.SQL_AUDITORIA_QUERY;
			valueUsuIngreso = "VALUES({" + ConstanteUtil.TB_USUARIO_INGRESO_CAMPO_NID_USUARIO_INGRESO + "},{"
					+ ConstanteUtil.TB_USUARIO_INGRESO_CAMPO_NID_USUARIO_DETALLE + "}" + buildValue(listaFiltUsuIngreso)
					+ ConstanteUtil.SQL_AUDITORIA_DATA;
		}
		// FIN USUARIO_INGRESO

		// USUARIO_AGENTE_EXTERNO
		List<EdneListarParamEstructuraResponse> listaFiltUsuAgent = req.getListaParametro().stream().filter(u -> {
			return u.getNomTablaBd().equals(ConstanteUtil.TB_AGENTE_EXTERNO);
		}).collect(Collectors.toList());
		Collections.sort(listaFiltUsuAgent, new Comparator<EdneListarParamEstructuraResponse>() {
			public int compare(EdneListarParamEstructuraResponse o1, EdneListarParamEstructuraResponse o2) {
				return o1.getOrdenCampoExcel().compareTo(o2.getOrdenCampoExcel());
			}
		});
		if (listaFiltUsuAgent.size() > 0) {
			queryUsuAgent = "INSERT INTO " + ConstanteUtil.TB_AGENTE_EXTERNO + "("
					+ ConstanteUtil.TB_AGENTE_EXTERNO_CAMPO_NID_AGENTE_EXTERNO + ","
					+ ConstanteUtil.TB_AGENTE_EXTERNO_CAMPO_NID_USUARIO_INGRESO + buildQuery(listaFiltUsuAgent)
					+ ConstanteUtil.SQL_AUDITORIA_QUERY;
			valueUsuAgent = "VALUES({" + ConstanteUtil.TB_AGENTE_EXTERNO_CAMPO_NID_AGENTE_EXTERNO + "},{"
					+ ConstanteUtil.TB_AGENTE_EXTERNO_CAMPO_NID_USUARIO_INGRESO + "}" + buildValue(listaFiltUsuAgent)
					+ ConstanteUtil.SQL_AUDITORIA_DATA;
		}
		// FIN USUARIO_AGENTE_EXTERNO

		// USUARIO_ACTIVIDAD
		List<EdneListarParamEstructuraResponse> listaFiltUsuActividad = req.getListaParametro().stream().filter(u -> {
			return u.getNomTablaBd().equals(ConstanteUtil.TB_USUARIO_ACTIVIDAD);
		}).collect(Collectors.toList());
		Collections.sort(listaFiltUsuActividad, new Comparator<EdneListarParamEstructuraResponse>() {
			public int compare(EdneListarParamEstructuraResponse o1, EdneListarParamEstructuraResponse o2) {
				return o1.getOrdenCampoExcel().compareTo(o2.getOrdenCampoExcel());
			}
		});
		if (listaFiltUsuActividad.size() > 0) {
			queryUsuActividad = "INSERT INTO " + ConstanteUtil.TB_USUARIO_ACTIVIDAD + "("
					+ ConstanteUtil.TB_USUARIO_ACTIVIDAD_CAMPO_NID_USUARIO_ACTIVIDAD + ","
					+ ConstanteUtil.TB_USUARIO_ACTIVIDAD_CAMPO_NID_USUARIO_DETALLE + buildQuery(listaFiltUsuActividad)
					+ ConstanteUtil.SQL_AUDITORIA_QUERY;
			valueUsuActividad = "VALUES({" + ConstanteUtil.TB_USUARIO_ACTIVIDAD_CAMPO_NID_USUARIO_ACTIVIDAD + "},{"
					+ ConstanteUtil.TB_USUARIO_ACTIVIDAD_CAMPO_NID_USUARIO_DETALLE + "}"
					+ buildValue(listaFiltUsuActividad) + ConstanteUtil.SQL_AUDITORIA_DATA;
		}
		// FIN USUARIO_ACTIVIDAD

		// USUARIO_SITUACION
		List<EdneListarParamEstructuraResponse> listaFiltUsuSituacion = req.getListaParametro().stream().filter(u -> {
			return u.getNomTablaBd().equals(ConstanteUtil.TB_USUARIO_SITUACION);
		}).collect(Collectors.toList());
		Collections.sort(listaFiltUsuSituacion, new Comparator<EdneListarParamEstructuraResponse>() {
			public int compare(EdneListarParamEstructuraResponse o1, EdneListarParamEstructuraResponse o2) {
				return o1.getOrdenCampoExcel().compareTo(o2.getOrdenCampoExcel());
			}
		});
		if (listaFiltUsuSituacion.size() > 0) {
			queryUsuSituacion = "INSERT INTO " + ConstanteUtil.TB_USUARIO_SITUACION + "("
					+ ConstanteUtil.TB_USUARIO_SITUACION_CAMPO_NID_USUARIO_SITUACION + ","
					+ ConstanteUtil.TB_USUARIO_SITUACION_CAMPO_NID_USUARIO_DETALLE + buildQuery(listaFiltUsuSituacion)
					+ ConstanteUtil.SQL_AUDITORIA_QUERY;
			valueUsuSituacion = "VALUES({" + ConstanteUtil.TB_USUARIO_SITUACION_CAMPO_NID_USUARIO_SITUACION + "},{"
					+ ConstanteUtil.TB_USUARIO_SITUACION_CAMPO_NID_USUARIO_DETALLE + "}"
					+ buildValue(listaFiltUsuSituacion) + ConstanteUtil.SQL_AUDITORIA_DATA;
		}
		// FIN USUARIO_SITUACION
		log.info(valueUsu);
		log.info(valueUsuDetalle);
		log.info(valueUsuIngreso);
		log.info(valueUsuAgent);
		log.info(valueUsuActividad);
		log.info(valueUsuSituacion);
		log.info(queryUsu);
		log.info(queryUsuDetalle);
		log.info(queryUsuIngreso);
		log.info(queryUsuAgent);
		log.info(queryUsuActividad);
		log.info(queryUsuSituacion);

		OutResponse<EdneRegistrarResponse> out = edneDao.registrarEdne(req);

		for (Map<String, Object> map : req.getListaUsuario()) {
			String dataUsu = "";
			String dataUsuDetalle = "";
			String dataUsuIngreso = "";
			String dataUsuAgent = "";
			String dataUsuActividad = "";
			String dataUsuSituacion = "";

			// SETEO DE NID_CENTRO_ATENCION
			dataUsuDetalle = valueUsuDetalle.replace("{NID_CENTRO_ATEN}",
					map.get(ConstanteUtil.TB_CENTRO_ATENCION_CAMPO_NID_CENTRO_ATEN).toString());
			if (map.get(ConstanteUtil.TB_USUARIO_CAMPO_NID_USUARIO) == null) {
				log.info("USUARIO NN");
				dataUsu = replaceAuditoria(buildData(listaFiltUsu, valueUsu, map), req.getIdUsuarioCrea());
				dataUsuDetalle = replaceAuditoria(buildData(listaFiltUsuDetalle, dataUsuDetalle, map),
						req.getIdUsuarioCrea());
				dataUsuIngreso = replaceAuditoria(buildData(listaFiltUsuIngreso, valueUsuIngreso, map),
						req.getIdUsuarioCrea());
				dataUsuAgent = replaceAuditoria(buildData(listaFiltUsuAgent, valueUsuAgent, map),
						req.getIdUsuarioCrea());
				dataUsuActividad = replaceAuditoria(buildData(listaFiltUsuActividad, valueUsuActividad, map),
						req.getIdUsuarioCrea());
				dataUsuSituacion = replaceAuditoria(buildData(listaFiltUsuSituacion, valueUsuSituacion, map),
						req.getIdUsuarioCrea());

				log.info(dataUsu);
				log.info(dataUsuDetalle);
				log.info(dataUsuIngreso);
				log.info(dataUsuAgent);
				log.info(dataUsuActividad);
				log.info(dataUsuSituacion);

				edneDao.registrarEdneUsuarioNN(out.getObjeto().getIdEdne(), dataUsu, dataUsuDetalle, dataUsuIngreso,
						dataUsuAgent, dataUsuActividad, dataUsuSituacion, queryUsu, queryUsuDetalle, queryUsuIngreso,
						queryUsuAgent, queryUsuActividad, queryUsuSituacion);
			} else {
				log.info("USUARIO ID");
				// SETEO DE NID_USUARIO -> SOLO PARA IDENTIFICADOS
				dataUsuDetalle = dataUsuDetalle.replace("{NID_USUARIO}",
						map.get(ConstanteUtil.TB_USUARIO_CAMPO_NID_USUARIO).toString());

				dataUsuDetalle = replaceAuditoria(buildData(listaFiltUsuDetalle, dataUsuDetalle, map),
						req.getIdUsuarioCrea());
				dataUsuIngreso = replaceAuditoria(buildData(listaFiltUsuIngreso, valueUsuIngreso, map),
						req.getIdUsuarioCrea());
				dataUsuAgent = replaceAuditoria(buildData(listaFiltUsuAgent, valueUsuAgent, map),
						req.getIdUsuarioCrea());
				dataUsuActividad = replaceAuditoria(buildData(listaFiltUsuActividad, valueUsuActividad, map),
						req.getIdUsuarioCrea());
				dataUsuSituacion = replaceAuditoria(buildData(listaFiltUsuSituacion, valueUsuSituacion, map),
						req.getIdUsuarioCrea());

				log.info(dataUsu);
				log.info(dataUsuDetalle);
				log.info(dataUsuIngreso);
				log.info(dataUsuAgent);
				log.info(dataUsuActividad);
				log.info(dataUsuSituacion);

				edneDao.registrarEdneUsuarioID(out.getObjeto().getIdEdne(), dataUsuDetalle, dataUsuIngreso,
						dataUsuAgent, dataUsuActividad, dataUsuSituacion, queryUsuDetalle, queryUsuIngreso,
						queryUsuAgent, queryUsuActividad, queryUsuSituacion);
			}
		}
		log.info("[REGISTRAR EDNE PRUEBA][SERVICE][FIN]");
		return out;
	}

	public String buildQuery(List<EdneListarParamEstructuraResponse> listaParametro) {
		String query = "";
		for (EdneListarParamEstructuraResponse par : listaParametro) {
			query += "," + par.getNomCampoBd();
		}
		return query;
	}

	public String buildValue(List<EdneListarParamEstructuraResponse> listaParametro) {
		String data = "";
		for (EdneListarParamEstructuraResponse par : listaParametro) {
			data += ",{" + par.getNomCampoBd() + "}";
		}
		return data;
	}

	public String buildData(List<EdneListarParamEstructuraResponse> listaParametro, String value,
			Map<String, Object> usuario) {
		if (listaParametro.size() > 0) {
			for (EdneListarParamEstructuraResponse par : listaParametro) {
				if (usuario.get(par.getNomCampoExcel()) != null) {
					if (par.getTipoDato().equals(ConstanteUtil.TIPO_NUMBER)) {
						value = value.replace("{" + par.getNomCampoBd() + "}",
								"TO_NUMBER(" + usuario.get(par.getNomCampoExcel()).toString() + ",'"
										+ repetirString("9", par.getPrecisionDato())
										+ (par.getEscalaDato() != 0 ? "." : "")
										+ repetirString("9", par.getEscalaDato()) + "')");
					} else {
						if (par.getTipoDato().equals(ConstanteUtil.TIPO_DATE)) {
							value = value.replace("{" + par.getNomCampoBd() + "}",
									"TO_DATE('" + usuario.get(par.getNomCampoExcel()).toString() + "','DD/MM/YYYY')");
						} else {
							value = value.replace("{" + par.getNomCampoBd() + "}",
									"'" + usuario.get(par.getNomCampoExcel()).toString() + "'");
						}
					}
				} else {
					value = value.replace("{" + par.getNomCampoBd() + "}", "NULL");
				}
			}
			return value;
		} else {
			return value;
		}
	}

	public String replaceAuditoria(String value, Long idUsuario) {
		value = value.replace("{FLG_ACTIVO}", ConstanteUtil.FLG_ACTVO.toString());
		value = value.replace("{NID_USUARIO_CREACION}", idUsuario.toString());
		value = value.replace("{FEC_CREACION}", "SYSTIMESTAMP");
		return value;
	}

	public String repetirString(String texto, Integer cant) {
		return new String(new char[cant]).replace("\0", texto);
	}

	@Override
	public OutResponse<FileResponse> exportarListaEdneXlsx(EdneListarRequest c) {
		log.info("[EXPORTAR LISTA EDNE][SERVICE][INICIO]");
		OutResponse<List<EdneListarResponse>> out = edneDao.listarEdne(c);

		OutResponse<FileResponse> outF = new OutResponse<>();
		if (out.getRCodigo() == ConstanteUtil.R_COD_EXITO) {
			try {
				String[] columns = { "Nro", "Nombre archivo", "Estructura", "Fecha corte informacion reportada",
						"Fecha periodo", "Servicio", "Entidad", "Linea intervencion", "Estado" };
				int[] anchoColumns = { 1500, 10000, 10000, 7000, 7000, 13000, 13000, 8000, 4000 };

				Workbook workbook = new HSSFWorkbook();
				ByteArrayOutputStream stream = new ByteArrayOutputStream();

				Sheet sheet = workbook.createSheet("Ednes");
				Row row = sheet.createRow(0);

				for (int i = 0; i < columns.length; i++) {
					Cell cell = row.createCell(i);
					cell.setCellValue(columns[i]);
					sheet.setColumnWidth(i, anchoColumns[i]);
				}

				SimpleDateFormat sdf = new SimpleDateFormat(ConstanteUtil.slash_ddMMyyyy);
				SimpleDateFormat sdf2 = new SimpleDateFormat(ConstanteUtil.date_espacio_MMMyyyy);
				int cont = 1;
				for (EdneListarResponse obj : out.getObjeto()) {
					row = sheet.createRow(cont);
					row.createCell(0).setCellValue(cont);
					row.createCell(1).setCellValue(obj.getNomArchivo());
					row.createCell(2).setCellValue(obj.getNomEstructura());
					row.createCell(3)
							.setCellValue(obj.getFecImportacion() != null ? sdf.format(obj.getFecImportacion()) : "");
					row.createCell(4).setCellValue(obj.getFecPeriodo() != null ? sdf2.format(obj.getFecPeriodo()) : "");
					row.createCell(5).setCellValue(obj.getNomServicio());
					row.createCell(6).setCellValue(obj.getNomEntidad());
					row.createCell(7).setCellValue(obj.getNomLineaInter());
					row.createCell(8)
							.setCellValue(obj.getFlgActivo() == ConstanteUtil.FLG_ACTVO ? ConstanteUtil.DESC_ACTIVO
									: ConstanteUtil.DESC_INACTIVO);
					cont++;
				}
				workbook.write(stream);
				workbook.close();

				FileResponse resp = new FileResponse();
				resp.setNombre("Lista EDNE.xls");
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
		log.info("[EXPORTAR LISTA EDNE][SERVICE][FIN]");
		return outF;
	}

	@Override
	public OutResponse<FileResponse> descargarPlantillaRENEXlsx(EdneDescargarPlantillaRequest c) {
		log.info("[DESCARGAR PLANTILLA RENE][SERVICE][INICIO]");
		EdneListarParamEstructuraRequest req = new EdneListarParamEstructuraRequest();
		req.setIdEstructura(c.getIdEstructura());

		OutResponse<List<EdneListarParamEstructuraResponse>> out = edneDao.listarParamEstructura(req);

		OutResponse<FileResponse> outF = new OutResponse<>();
		if (out.getRCodigo() == ConstanteUtil.R_COD_EXITO) {
			try {
				Workbook workbook = new HSSFWorkbook();
				ByteArrayOutputStream stream = new ByteArrayOutputStream();

				Sheet sheet = workbook.createSheet("PLANTILLA " + c.getNomEstructura());
				Row row = sheet.createRow(0);
				row.createCell(0).setCellValue("LISTA INTERVENCIONES");

				List<EdneListarParamEstructuraResponse> lParametro = out.getObjeto();
				EdneListarParamEstructuraResponse maxParametro = lParametro.stream()
						.max(Comparator.comparing(EdneListarParamEstructuraResponse::getOrdenCampoExcel)).get();

				for (int i = 1; i <= maxParametro.getOrdenCampoExcel(); i++) {
					int cont = 0;
					for (EdneListarParamEstructuraResponse obj : lParametro) {
						if (obj.getOrdenCampoExcel() == i) {
							cont++;
						}
					}
					if (cont == 0) {
						EdneListarParamEstructuraResponse param = new EdneListarParamEstructuraResponse();
						param.setOrdenCampoExcel(i);
						param.setDescripcion("-");
						param.setNomCampoExcel("-");
						lParametro.add(param);
					}

				}

				Collections.sort(lParametro, new Comparator<EdneListarParamEstructuraResponse>() {
					public int compare(EdneListarParamEstructuraResponse o1, EdneListarParamEstructuraResponse o2) {
						return o1.getOrdenCampoExcel().compareTo(o2.getOrdenCampoExcel());
					}
				});

				sheet.addMergedRegion(new CellRangeAddress(0, 0, 0, lParametro.size() - 1));// MESCLA CELDAS

				// FILA POSICIONES
				row = sheet.createRow(1);
				for (EdneListarParamEstructuraResponse obj : lParametro) {
					row.createCell(obj.getOrdenCampoExcel() - 1).setCellValue(obj.getOrdenCampoExcel().toString());
					sheet.setColumnWidth(obj.getOrdenCampoExcel() - 1, 6000);
				}

				// FILA DESCRIPCIOM
				row = sheet.createRow(2);
				for (EdneListarParamEstructuraResponse obj : lParametro) {
					row.createCell(obj.getOrdenCampoExcel() - 1).setCellValue(obj.getDescripcion());
				}

				// FILA NOMBRE CAMPO EXCEL
				row = sheet.createRow(3);
				for (EdneListarParamEstructuraResponse obj : lParametro) {
					row.createCell(obj.getOrdenCampoExcel() - 1).setCellValue(obj.getNomCampoExcel());
				}

				// FILA DATOS
				row = sheet.createRow(4);
				Row rowA = sheet.createRow(5);
				for (EdneListarParamEstructuraResponse obj : lParametro) {
					row.createCell(obj.getOrdenCampoExcel() - 1).setCellValue("...");
					rowA.createCell(obj.getOrdenCampoExcel() - 1).setCellValue("...");
				}

				workbook.write(stream);
				workbook.close();

				FileResponse resp = new FileResponse();
				resp.setNombre("PLANTILLA " + c.getNomEstructura() + ".xls");
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
		log.info("[DESCARGAR PLANTILLA RENE][SERVICE][FIN]");
		return outF;
	}
}
