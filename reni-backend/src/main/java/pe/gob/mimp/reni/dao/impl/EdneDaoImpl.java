package pe.gob.mimp.reni.dao.impl;

import java.sql.SQLException;
import java.sql.Types;
import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;
import javax.sql.DataSource;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.namedparam.MapSqlParameterSource;
import org.springframework.jdbc.core.simple.SimpleJdbcCall;
import org.springframework.stereotype.Repository;

import pe.gob.mimp.reni.dao.EdneDao;
import pe.gob.mimp.reni.dto.request.EdneEliminarRequest;
import pe.gob.mimp.reni.dto.request.EdneListarParamEstructuraRequest;
import pe.gob.mimp.reni.dto.request.EdneListarRequest;
import pe.gob.mimp.reni.dto.request.EdneListarUsuarioXCodigoRequest;
import pe.gob.mimp.reni.dto.request.EdneListarUsuarioXDocumentoRequest;
import pe.gob.mimp.reni.dto.request.EdneModificarListarUsuarioRequest;
import pe.gob.mimp.reni.dto.request.EdneModificarRequest;
import pe.gob.mimp.reni.dto.request.EdneRegistrarRequest;
import pe.gob.mimp.reni.dto.response.EdneListarParamEstructuraResponse;
import pe.gob.mimp.reni.dto.response.EdneListarResponse;
import pe.gob.mimp.reni.dto.response.EdneListarUsuarioXCodigoResponse;
import pe.gob.mimp.reni.dto.response.EdneListarUsuarioXDocumentoResponse;
import pe.gob.mimp.reni.dto.response.EdneModificarListarUsuarioResponseMapper;
import pe.gob.mimp.reni.dto.response.EdneRegistrarResponse;
import pe.gob.mimp.reni.dto.response.OutResponse;
import pe.gob.mimp.reni.dto.response.mapper.EdneListarParamEstructuraResponseMapper;
import pe.gob.mimp.reni.dto.response.mapper.EdneListarResponseMapper;
import pe.gob.mimp.reni.dto.response.mapper.EdneListarUsuarioXCodigoResponseMapper;
import pe.gob.mimp.reni.dto.response.mapper.EdneListarUsuarioXDocumentoResponseMapper;
import pe.gob.mimp.reni.util.AdressUtil;
import pe.gob.mimp.reni.util.ConstanteUtil;
import pe.gob.mimp.reni.util.DateUtil;
import pe.gob.mimp.reni.util.MapUtil;

@Repository
public class EdneDaoImpl implements EdneDao {

	private static final Logger log = LoggerFactory.getLogger(EdneDaoImpl.class);

	@Autowired
	DataSource dataSource;

	@Autowired
	private HttpServletRequest httpRequest;

	@Override
	public OutResponse<List<EdneListarResponse>> listarEdne(EdneListarRequest req) {
		log.info("[LISTAR EDNE][DAO][INICIO]");
		OutResponse<List<EdneListarResponse>> outResponse = new OutResponse<>();

		Integer rCodigo = 0;
		String rMensaje = "";
		try {
			SimpleJdbcCall jdbcCall = new SimpleJdbcCall(dataSource).withSchemaName(ConstanteUtil.BD_SCHEMA_RENI)
					.withCatalogName(ConstanteUtil.BD_PKG_RENI_EDNE).withProcedureName("SP_L_EDNE")
					.returningResultSet(ConstanteUtil.R_LISTA, new EdneListarResponseMapper());

			MapSqlParameterSource in = new MapSqlParameterSource();
			in.addValue("P_NOM_ESTRUCTURA", req.getNomEstructura(), Types.VARCHAR);
			in.addValue("P_NOM_ENTIDAD", req.getNomEntidad(), Types.VARCHAR);
			in.addValue("P_ID_LINEA_INTER", req.getIdLineaInter(), Types.NUMERIC);
			in.addValue("P_NOM_SERVICIO", req.getNomServicio(), Types.VARCHAR);
			in.addValue("P_FLG_ACTIVO", req.getFlgActivo(), Types.NUMERIC);
			in.addValue("P_FEC_INICIO", DateUtil.formatDateToString(req.getFecInicio(), ConstanteUtil.slash_ddMMyyyy),
					Types.VARCHAR);
			in.addValue("P_FEC_FIN", DateUtil.formatDateToString(req.getFecFin(), ConstanteUtil.slash_ddMMyyyy),
					Types.VARCHAR);

			log.info("[LISTAR EDNE][DAO][INPUT PROCEDURE][" + in.toString() + "]");

			Map<String, Object> out = jdbcCall.execute(in);
			log.info("[LISTAR EDNE][DAO][OUTPUT PROCEDURE][" + out.toString() + "]");

			rCodigo = MapUtil.getInt(out.get(ConstanteUtil.R_CODIGO));
			rMensaje = MapUtil.getString(out.get(ConstanteUtil.R_MENSAJE));

			if (rCodigo == ConstanteUtil.R_COD_EXITO) {
				log.info("[LISTAR EDNE][DAO][EXITO]");
				List<EdneListarResponse> res = MapUtil.getType(out.get(ConstanteUtil.R_LISTA));

				outResponse.setRCodigo(rCodigo);
				outResponse.setRMensaje(rMensaje);
				outResponse.setObjeto(res);
			} else {
				log.info("[LISTAR EDNE][DAO][ERROR]");
				outResponse.setRCodigo(rCodigo);
				outResponse.setRMensaje(rMensaje);
			}
		} catch (Exception e) {
			log.info("[LISTAR EDNE][DAO][EXCEPCION][" + e.getMessage() + "]");
			outResponse.setRCodigo(500);
			outResponse.setRMensaje(e.getMessage());
		}
		log.info("[LISTAR EDNE][DAO][FIN]");
		return outResponse;
	}

//	@Override
//	public OutResponse<EdneRegistrarResponse> registrarEdne(EdneRegistrarRequest req, String lIdentificado,
//			Integer tIdentificado, String lNoIdentificado, Integer tNoIdentificado) {
//		log.info("[REGISTRAR EDNE][DAO][INICIO]");
//		OutResponse<EdneRegistrarResponse> outResponse = new OutResponse<>();
//
//		Integer rCodigo = 0;
//		String rMensaje = "";
//		try {
//			SimpleJdbcCall jdbcCall = new SimpleJdbcCall(dataSource).withSchemaName(ConstanteUtil.BD_SCHEMA_RENI)
//					.withCatalogName(ConstanteUtil.BD_PKG_RENI_EDNE).withProcedureName("SP_I_EDNE");
//
//			MapSqlParameterSource in = new MapSqlParameterSource();
//			in.addValue("P_ID_ESTRUCTURA", req.getIdEstructura(), Types.VARCHAR);
//			in.addValue("P_TXT_NOMBRE_ARCHIVO", req.getNomArchivo(), Types.VARCHAR);
//			in.addValue("P_FEC_IMPORTACION",
//					DateUtil.formatDateToString(req.getFecImportacion(), ConstanteUtil.slash_ddMMyyyy), Types.VARCHAR);
//			in.addValue("P_FEC_PERIODO", DateUtil.formatDateToString(req.getFecPeriodo(), ConstanteUtil.slash_ddMMyyyy),
//					Types.VARCHAR);
//			in.addValue("P_IDT_ESTADO", req.getIdtEstado(), Types.VARCHAR);
//			in.addValue("P_L_LISTA_IDENTIFICADO", lIdentificado, Types.CLOB);
//			in.addValue("P_T_LISTA_IDENTIFICADO", tIdentificado, Types.NUMERIC);
//			in.addValue("P_L_LISTA_NO_IDENTIFICADO", lNoIdentificado, Types.CLOB);
//			in.addValue("P_T_LISTA_NO_IDENTIFICADO", tNoIdentificado, Types.NUMERIC);
//			in.addValue("P_QUERY_USUARIO", req.getQueryUsuario(), Types.CLOB);
//			in.addValue("P_QUERY_USUARIO_DETALLE", req.getQueryUsuarioDetalle(), Types.CLOB);
//			in.addValue("P_QUERY_USUARIO_INGRESO", req.getQueryUsuarioIngreso(), Types.CLOB);
//			in.addValue("P_QUERY_AGENTE_EXTERNO", req.getQueryAgenteExterno(), Types.CLOB);
//			in.addValue("P_QUERY_USUARIO_ACTIVIDAD", req.getQueryUsuarioActividad(), Types.CLOB);
//			in.addValue("P_QUERY_USUARIO_SITUACION", req.getQueryUsuarioSituacion(), Types.CLOB);
//			in.addValue("P_NID_USUARIO_CREACION", req.getIdUsuarioCrea(), Types.NUMERIC);
//			in.addValue("P_TXT_PC_CREACION", AdressUtil.getHostname(httpRequest), Types.VARCHAR);
//			in.addValue("P_TXT_IP_CREACION", AdressUtil.getIP(httpRequest), Types.VARCHAR);
//			log.info("[REGISTRAR EDNE][DAO][INPUT PROCEDURE][" + in.toString() + "]");
//
//			Map<String, Object> out = jdbcCall.execute(in);
//			log.info("[REGISTRAR EDNE][DAO][OUTPUT PROCEDURE][" + out.toString() + "]");
//
//			rCodigo = MapUtil.getInt(out.get(ConstanteUtil.R_CODIGO));
//			rMensaje = MapUtil.getString(out.get(ConstanteUtil.R_MENSAJE));
//
//			if (rCodigo == ConstanteUtil.R_COD_EXITO) {
//				log.info("[REGISTRAR EDNE][DAO][EXITO]");
//				EdneRegistrarResponse res = new EdneRegistrarResponse();
//				res.setIdEdne(MapUtil.getLong(out.get("R_ID")));
//
//				outResponse.setRCodigo(rCodigo);
//				outResponse.setRMensaje(rMensaje);
//				outResponse.setObjeto(res);
//			} else {
//				log.info("[REGISTRAR EDNE][DAO][ERROR]");
//				outResponse.setRCodigo(rCodigo);
//				outResponse.setRMensaje(rMensaje);
//			}
//		} catch (Exception e) {
//			log.info("[REGISTRAR EDNE][DAO][EXCEPCION][" + e.getMessage() + "]");
//			outResponse.setRCodigo(500);
//			outResponse.setRMensaje(e.getMessage());
//		}
//		log.info("[REGISTRAR EDNE][DAO][FIN]");
//		return outResponse;
//	}

	@Override
	public OutResponse<?> modificarEdne(EdneModificarRequest req) {
		log.info("[MODIFICAR EDNE][DAO][INICIO]");
		OutResponse<?> outResponse = new OutResponse<>();

		Integer rCodigo = 0;
		String rMensaje = "";
		try {
			SimpleJdbcCall jdbcCall = new SimpleJdbcCall(dataSource).withSchemaName(ConstanteUtil.BD_SCHEMA_RENI)
					.withCatalogName(ConstanteUtil.BD_PKG_RENI_EDNE).withProcedureName("SP_U_EDNE");

			MapSqlParameterSource in = new MapSqlParameterSource();
			in.addValue("P_ID_EDNE", req.getIdEdne(), Types.NUMERIC);
			in.addValue("P_FEC_IMPORTACION",
					DateUtil.formatDateToString(req.getFecImportacion(), ConstanteUtil.slash_ddMMyyyy), Types.VARCHAR);
			in.addValue("P_FEC_PERIODO", DateUtil.formatDateToString(req.getFecPeriodo(), ConstanteUtil.slash_ddMMyyyy),
					Types.VARCHAR);
			in.addValue("P_IDT_ESTADO", req.getIdtEstado(), Types.VARCHAR);
			in.addValue("P_NID_USUARIO_MODIF", req.getIdUsuarioModif(), Types.NUMERIC);
			in.addValue("P_TXT_PC_MODIF", AdressUtil.getHostname(httpRequest), Types.VARCHAR);
			in.addValue("P_TXT_IP_MODIF", AdressUtil.getIP(httpRequest), Types.VARCHAR);
			log.info("[MODIFICAR EDNE][DAO][INPUT PROCEDURE][" + in.toString() + "]");

			Map<String, Object> out = jdbcCall.execute(in);
			log.info("[MODIFICAR EDNE][DAO][OUTPUT PROCEDURE][" + out.toString() + "]");

			rCodigo = MapUtil.getInt(out.get(ConstanteUtil.R_CODIGO));
			rMensaje = MapUtil.getString(out.get(ConstanteUtil.R_MENSAJE));

			if (rCodigo == ConstanteUtil.R_COD_EXITO) {
				log.info("[MODIFICAR EDNE][DAO][EXITO]");
				outResponse.setRCodigo(rCodigo);
				outResponse.setRMensaje(rMensaje);
			} else {
				log.info("[MODIFICAR EDNE][DAO][ERROR]");
				outResponse.setRCodigo(rCodigo);
				outResponse.setRMensaje(rMensaje);
			}
		} catch (Exception e) {
			log.info("[MODIFICAR EDNE][DAO][EXCEPCION][" + e.getMessage() + "]");
			outResponse.setRCodigo(500);
			outResponse.setRMensaje(e.getMessage());
		}
		log.info("[MODIFICAR EDNE][DAO][FIN]");
		return outResponse;
	}

	@Override
	public OutResponse<?> eliminarEdne(EdneEliminarRequest req) {
		log.info("[ELIMINAR EDNE][DAO][INICIO]");
		OutResponse<?> outResponse = new OutResponse<>();

		Integer rCodigo = 0;
		String rMensaje = "";
		try {
			SimpleJdbcCall jdbcCall = new SimpleJdbcCall(dataSource).withSchemaName(ConstanteUtil.BD_SCHEMA_RENI)
					.withCatalogName(ConstanteUtil.BD_PKG_RENI_EDNE).withProcedureName("SP_D_EDNE");

			MapSqlParameterSource in = new MapSqlParameterSource();
			in.addValue("P_NID_EDNE", req.getIdEdne(), Types.NUMERIC);
			in.addValue("P_NID_USUARIO_MODIF", req.getIdUsuarioModif(), Types.NUMERIC);
			in.addValue("P_TXT_PC_MODIF", AdressUtil.getHostname(httpRequest), Types.VARCHAR);
			in.addValue("P_TXT_IP_MODIF", AdressUtil.getIP(httpRequest), Types.VARCHAR);
			log.info("[ELIMINAR EDNE][DAO][INPUT PROCEDURE][" + in.toString() + "]");

			Map<String, Object> out = jdbcCall.execute(in);
			log.info("[ELIMINAR EDNE][DAO][OUTPUT PROCEDURE][" + out.toString() + "]");

			rCodigo = MapUtil.getInt(out.get(ConstanteUtil.R_CODIGO));
			rMensaje = MapUtil.getString(out.get(ConstanteUtil.R_MENSAJE));

			if (rCodigo == ConstanteUtil.R_COD_EXITO) {
				log.info("[ELIMINAR EDNE][DAO][EXITO]");
				outResponse.setRCodigo(rCodigo);
				outResponse.setRMensaje(rMensaje);
			} else {
				log.info("[ELIMINAR EDNE][DAO][ERROR]");
				outResponse.setRCodigo(rCodigo);
				outResponse.setRMensaje(rMensaje);
			}
		} catch (Exception e) {
			log.info("[ELIMINAR EDNE][DAO][EXCEPCION][" + e.getMessage() + "]");
			outResponse.setRCodigo(500);
			outResponse.setRMensaje(e.getMessage());
		}
		log.info("[ELIMINAR EDNE][DAO][FIN]");
		return outResponse;
	}

	@Override
	public OutResponse<List<EdneListarParamEstructuraResponse>> listarParamEstructura(
			EdneListarParamEstructuraRequest req) {
		log.info("[LISTAR PARAMETRO ESTRUCTURA][DAO][INICIO]");
		OutResponse<List<EdneListarParamEstructuraResponse>> outResponse = new OutResponse<>();

		Integer rCodigo = 0;
		String rMensaje = "";
		try {
			SimpleJdbcCall jdbcCall = new SimpleJdbcCall(dataSource).withSchemaName(ConstanteUtil.BD_SCHEMA_RENI)
					.withCatalogName(ConstanteUtil.BD_PKG_RENI_EDNE).withProcedureName("SP_L_PARAM_ESTRUCTURA")
					.returningResultSet(ConstanteUtil.R_LISTA, new EdneListarParamEstructuraResponseMapper());

			MapSqlParameterSource in = new MapSqlParameterSource();
			in.addValue("P_NID_ESTRUCTURA", req.getIdEstructura(), Types.NUMERIC);
			log.info("[LISTAR PARAMETRO ESTRUCTURA][DAO][INPUT PROCEDURE][" + in.toString() + "]");

			Map<String, Object> out = jdbcCall.execute(in);
			log.info("[LISTAR PARAMETRO ESTRUCTURA][DAO][OUTPUT PROCEDURE][" + out.toString() + "]");

			rCodigo = MapUtil.getInt(out.get(ConstanteUtil.R_CODIGO));
			rMensaje = MapUtil.getString(out.get(ConstanteUtil.R_MENSAJE));

			if (rCodigo == ConstanteUtil.R_COD_EXITO) {
				log.info("[LISTAR PARAMETRO ESTRUCTURA][DAO][EXITO]");
				List<EdneListarParamEstructuraResponse> res = MapUtil.getType(out.get(ConstanteUtil.R_LISTA));

				outResponse.setRCodigo(rCodigo);
				outResponse.setRMensaje(rMensaje);
				outResponse.setObjeto(res);
			} else {
				log.info("[LISTAR PARAMETRO ESTRUCTURA][DAO][ERROR]");
				outResponse.setRCodigo(rCodigo);
				outResponse.setRMensaje(rMensaje);
			}
		} catch (Exception e) {
			log.info("[LISTAR PARAMETRO ESTRUCTURA][DAO][EXCEPCION][" + e.getMessage() + "]");
			outResponse.setRCodigo(500);
			outResponse.setRMensaje(e.getMessage());
		}
		log.info("[LISTAR PARAMETRO ESTRUCTURA][DAO][FIN]");
		return outResponse;
	}

	@Override
	public OutResponse<List<EdneListarUsuarioXCodigoResponse>> listarUsuarioXCodigo(EdneListarUsuarioXCodigoRequest req,
			String lCodigos, Integer tCodigos) {
		log.info("[LISTAR USUARIO X CODIGO][DAO][INICIO]");
		OutResponse<List<EdneListarUsuarioXCodigoResponse>> outResponse = new OutResponse<>();

		Integer rCodigo = 0;
		String rMensaje = "";
		try {
			SimpleJdbcCall jdbcCall = new SimpleJdbcCall(dataSource).withSchemaName(ConstanteUtil.BD_SCHEMA_RENI)
					.withCatalogName(ConstanteUtil.BD_PKG_RENI_EDNE).withProcedureName("SP_L_USUARIO_X_CODIGO")
					.returningResultSet(ConstanteUtil.R_LISTA, new EdneListarUsuarioXCodigoResponseMapper());

			MapSqlParameterSource in = new MapSqlParameterSource();
			in.addValue("P_L_CODIGOS", lCodigos, Types.CLOB);
			in.addValue("P_T_CODIGOS", tCodigos, Types.NUMERIC);
			in.addValue("P_NOM_CAMPO", req.getNomCampo(), Types.VARCHAR);
			log.info("[LISTAR USUARIO X CODIGO][DAO][INPUT PROCEDURE][" + in.toString() + "]");

			Map<String, Object> out = jdbcCall.execute(in);
			log.info("[LISTAR USUARIO X CODIGO][DAO][OUTPUT PROCEDURE][" + out.toString() + "]");

			rCodigo = MapUtil.getInt(out.get(ConstanteUtil.R_CODIGO));
			rMensaje = MapUtil.getString(out.get(ConstanteUtil.R_MENSAJE));

			if (rCodigo == ConstanteUtil.R_COD_EXITO) {
				log.info("[LISTAR USUARIO X CODIGO][DAO][EXITO]");
				List<EdneListarUsuarioXCodigoResponse> res = MapUtil.getType(out.get(ConstanteUtil.R_LISTA));

				outResponse.setRCodigo(rCodigo);
				outResponse.setRMensaje(rMensaje);
				outResponse.setObjeto(res);
			} else {
				log.info("[LISTAR USUARIO X CODIGO][DAO][ERROR]");
				outResponse.setRCodigo(rCodigo);
				outResponse.setRMensaje(rMensaje);
			}
		} catch (Exception e) {
			log.info("[LISTAR USUARIO X CODIGO][DAO][EXCEPCION][" + e.getMessage() + "]");
			outResponse.setRCodigo(500);
			outResponse.setRMensaje(e.getMessage());
		}
		log.info("[LISTAR USUARIO X CODIGO][DAO][FIN]");
		return outResponse;
	}

	@Override
	public OutResponse<List<EdneListarUsuarioXDocumentoResponse>> listarUsuarioXDocumento(
			EdneListarUsuarioXDocumentoRequest req, String lDocumentos, Integer tDocumentos) {
		log.info("[LISTAR USUARIO X DOCUMENTO][DAO][INICIO]");
		OutResponse<List<EdneListarUsuarioXDocumentoResponse>> outResponse = new OutResponse<>();

		Integer rCodigo = 0;
		String rMensaje = "";
		try {
			SimpleJdbcCall jdbcCall = new SimpleJdbcCall(dataSource).withSchemaName(ConstanteUtil.BD_SCHEMA_RENI)
					.withCatalogName(ConstanteUtil.BD_PKG_RENI_EDNE).withProcedureName("SP_L_USUARIO_X_DOCUMENTO")
					.returningResultSet(ConstanteUtil.R_LISTA, new EdneListarUsuarioXDocumentoResponseMapper());

			MapSqlParameterSource in = new MapSqlParameterSource();
			in.addValue("P_L_DOCUMENTOS", lDocumentos, Types.CLOB);
			in.addValue("P_T_DOCUMENTOS", tDocumentos, Types.NUMERIC);
			in.addValue("P_CAMP_NRO_DOC", req.getCampNroDoc(), Types.VARCHAR);
			in.addValue("P_CAMP_TIP_DOC", req.getCampTipDoc(), Types.VARCHAR);

			log.info("[LISTAR USUARIO X DOCUMENTO][DAO][INPUT PROCEDURE][" + in.toString() + "]");

			Map<String, Object> out = jdbcCall.execute(in);
			log.info("[LISTAR USUARIO X DOCUMENTO][DAO][OUTPUT PROCEDURE][" + out.toString() + "]");

			rCodigo = MapUtil.getInt(out.get(ConstanteUtil.R_CODIGO));
			rMensaje = MapUtil.getString(out.get(ConstanteUtil.R_MENSAJE));

			if (rCodigo == ConstanteUtil.R_COD_EXITO) {
				log.info("[LISTAR USUARIO X DOCUMENTO][DAO][EXITO]");
				List<EdneListarUsuarioXDocumentoResponse> res = MapUtil.getType(out.get(ConstanteUtil.R_LISTA));

				outResponse.setRCodigo(rCodigo);
				outResponse.setRMensaje(rMensaje);
				outResponse.setObjeto(res);
			} else {
				log.info("[LISTAR USUARIO X DOCUMENTO][DAO][ERROR]");
				outResponse.setRCodigo(rCodigo);
				outResponse.setRMensaje(rMensaje);
			}
		} catch (Exception e) {
			log.info("[LISTAR USUARIO X DOCUMENTO][DAO][EXCEPCION][" + e.getMessage() + "]");
			outResponse.setRCodigo(500);
			outResponse.setRMensaje(e.getMessage());
		}
		log.info("[LISTAR USUARIO X DOCUMENTO][DAO][FIN]");
		return outResponse;
	}

	@Override
	public OutResponse<List<Map<String, Object>>> listarUsuariosEdne(EdneModificarListarUsuarioRequest req) {
		log.info("[LISTAR USUARIOS EDNE][DAO][INICIO]");
		OutResponse<List<Map<String, Object>>> outResponse = new OutResponse<>();

		Integer rCodigo = 0;
		String rMensaje = "";
		try {
			SimpleJdbcCall jdbcCall = new SimpleJdbcCall(dataSource).withSchemaName(ConstanteUtil.BD_SCHEMA_RENI)
					.withCatalogName(ConstanteUtil.BD_PKG_RENI_EDNE).withProcedureName("SP_L_USUARIOS_EDNE")
					.returningResultSet(ConstanteUtil.R_LISTA,
							new EdneModificarListarUsuarioResponseMapper(req.getListaMapeo()));

			MapSqlParameterSource in = new MapSqlParameterSource();
			in.addValue("P_ID_EDNE", req.getIdEdne(), Types.NUMERIC);
			in.addValue("P_SQL", req.getQuery(), Types.VARCHAR);
			log.info("[LISTAR USUARIOS EDNE][DAO][INPUT PROCEDURE][" + in.toString() + "]");

			Map<String, Object> out = jdbcCall.execute(in);
			log.info("[LISTAR USUARIOS EDNE][DAO][OUTPUT PROCEDURE][" + out.toString() + "]");

			rCodigo = MapUtil.getInt(out.get(ConstanteUtil.R_CODIGO));
			rMensaje = MapUtil.getString(out.get(ConstanteUtil.R_MENSAJE));

			if (rCodigo == ConstanteUtil.R_COD_EXITO) {
				log.info("[LISTAR USUARIOS EDNE][DAO][EXITO]");
				List<Map<String, Object>> res = MapUtil.getType(out.get(ConstanteUtil.R_LISTA));

				outResponse.setRCodigo(rCodigo);
				outResponse.setRMensaje(rMensaje);
				outResponse.setObjeto(res);
			} else {
				log.info("[LISTAR USUARIOS EDNE][DAO][ERROR]");
				outResponse.setRCodigo(rCodigo);
				outResponse.setRMensaje(rMensaje);
			}
		} catch (Exception e) {
			log.info("[LISTAR USUARIOS EDNE][DAO][EXCEPCION][" + e.getMessage() + "]");
			outResponse.setRCodigo(500);
			outResponse.setRMensaje(e.getMessage());
		}
		log.info("[LISTAR USUARIOS EDNE][DAO][FIN]");
		return outResponse;
	}

	@Override
	public OutResponse<EdneRegistrarResponse> registrarEdne(EdneRegistrarRequest req) throws Exception {
		log.info("[REGISTRAR EDNE][DAO][INICIO]");
		OutResponse<EdneRegistrarResponse> outResponse = new OutResponse<>();

		Integer rCodigo = 0;
		String rMensaje = "";
		SimpleJdbcCall jdbcCall = new SimpleJdbcCall(dataSource).withSchemaName(ConstanteUtil.BD_SCHEMA_RENI)
				.withCatalogName(ConstanteUtil.BD_PKG_RENI_EDNE).withProcedureName("SP_I_EDNE");

		MapSqlParameterSource in = new MapSqlParameterSource();
		in.addValue("P_ID_ESTRUCTURA", req.getIdEstructura(), Types.NUMERIC);
		in.addValue("P_TXT_NOMBRE_ARCHIVO", req.getNomArchivo(), Types.VARCHAR);
		in.addValue("P_CANT_REGISTROS", req.getListaUsuario().size(), Types.NUMERIC);
		in.addValue("P_FEC_IMPORTACION", DateUtil.formatDateToString(req.getFecImportacion(), ConstanteUtil.slash_ddMMyyyy), Types.VARCHAR);
		in.addValue("P_FEC_PERIODO", DateUtil.formatDateToString(req.getFecPeriodo(), ConstanteUtil.slash_ddMMyyyy), Types.VARCHAR);
		in.addValue("P_IDT_ESTADO", req.getIdtEstado(), Types.VARCHAR);
		in.addValue("P_NID_USUARIO_CREACION", req.getIdUsuarioCrea(), Types.NUMERIC);
		in.addValue("P_TXT_PC_CREACION", AdressUtil.getHostname(httpRequest), Types.VARCHAR);
		in.addValue("P_TXT_IP_CREACION", AdressUtil.getIP(httpRequest), Types.VARCHAR);
		log.info("[REGISTRAR EDNE][DAO][INPUT PROCEDURE][" + in.toString() + "]");

		Map<String, Object> out = jdbcCall.execute(in);
		log.info("[REGISTRAR EDNE][DAO][OUTPUT PROCEDURE][" + out.toString() + "]");

		rCodigo = MapUtil.getInt(out.get(ConstanteUtil.R_CODIGO));
		rMensaje = MapUtil.getString(out.get(ConstanteUtil.R_MENSAJE));

		if (rCodigo == ConstanteUtil.R_COD_EXITO) {
			log.info("[REGISTRAR EDNE][DAO][EXITO]");
			EdneRegistrarResponse res = new EdneRegistrarResponse();
			res.setIdEdne(MapUtil.getLong(out.get("R_ID")));

			outResponse.setRCodigo(rCodigo);
			outResponse.setRMensaje(rMensaje);
			outResponse.setObjeto(res);
		} else {
			log.info("[REGISTRAR EDNE][DAO][ERROR]");
			outResponse.setRCodigo(rCodigo);
			outResponse.setRMensaje(rMensaje);
			throw new SQLException(rMensaje);
		}
		log.info("[REGISTRAR EDNE][DAO][FIN]");
		return outResponse;
	}

	@Override
	public OutResponse<?> registrarEdneUsuarioNN(Long idEdne, String dataUsu, String dataUsuDetalle,
			String dataUsuIngreso, String dataUsuAgent, String dataUsuActividad, String dataUsuSituacion,
			String queryUsu, String queryUsuDetalle, String queryUsuIngreso, String queryUsuAgent,
			String queryUsuActividad, String queryUsuSituacion) throws Exception {
		log.info("[REGISTRAR USUARIO NN][DAO][INICIO]");
		OutResponse<?> outResponse = new OutResponse<>();

		Integer rCodigo = 0;
		String rMensaje = "";

		SimpleJdbcCall jdbcCall = new SimpleJdbcCall(dataSource).withSchemaName(ConstanteUtil.BD_SCHEMA_RENI)
				.withCatalogName(ConstanteUtil.BD_PKG_RENI_EDNE).withProcedureName("SP_I_EDNE_USUARIO_NN");

		MapSqlParameterSource in = new MapSqlParameterSource();
		in.addValue("P_ID_EDNE", idEdne, Types.NUMERIC);
		in.addValue("P_DATA_USUARIO", dataUsu, Types.VARCHAR);
		in.addValue("P_DATA_USUARIO_DETALLE", dataUsuDetalle, Types.VARCHAR);
		in.addValue("P_DATA_USUARIO_INGRESO", dataUsuIngreso, Types.VARCHAR);
		in.addValue("P_DATA_AGENTE_EXTERNO", dataUsuAgent, Types.VARCHAR);
		in.addValue("P_DATA_USUARIO_ACTIVIDAD", dataUsuActividad, Types.VARCHAR);
		in.addValue("P_DATA_USUARIO_SITUACION", dataUsuSituacion, Types.VARCHAR);
		in.addValue("P_QUERY_USUARIO", queryUsu, Types.VARCHAR);
		in.addValue("P_QUERY_USUARIO_DETALLE", queryUsuDetalle, Types.VARCHAR);
		in.addValue("P_QUERY_USUARIO_INGRESO", queryUsuIngreso, Types.VARCHAR);
		in.addValue("P_QUERY_AGENTE_EXTERNO", queryUsuAgent, Types.VARCHAR);
		in.addValue("P_QUERY_USUARIO_ACTIVIDAD", queryUsuActividad, Types.VARCHAR);
		in.addValue("P_QUERY_USUARIO_SITUACION", queryUsuSituacion, Types.VARCHAR);
		in.addValue("P_TXT_PC_CREACION", AdressUtil.getHostname(httpRequest), Types.VARCHAR);
		in.addValue("P_TXT_IP_CREACION", AdressUtil.getIP(httpRequest), Types.VARCHAR);
		log.info("[REGISTRAR USUARIO NN][DAO][INPUT PROCEDURE][" + in.toString() + "]");

		Map<String, Object> out = jdbcCall.execute(in);
		log.info("[REGISTRAR USUARIO NN][DAO][OUTPUT PROCEDURE][" + out.toString() + "]");

		rCodigo = MapUtil.getInt(out.get(ConstanteUtil.R_CODIGO));
		rMensaje = MapUtil.getString(out.get(ConstanteUtil.R_MENSAJE));

		if (rCodigo == ConstanteUtil.R_COD_EXITO) {
			log.info("[REGISTRAR USUARIO NN][DAO][EXITO]");

			outResponse.setRCodigo(rCodigo);
			outResponse.setRMensaje(rMensaje);
		} else {
			log.info("[REGISTRAR USUARIO NN][DAO][ERROR]");
			outResponse.setRCodigo(rCodigo);
			outResponse.setRMensaje(rMensaje);
			throw new SQLException(rMensaje);
		}
		log.info("[REGISTRAR USUARIO NN][DAO][FIN]");
		return outResponse;
	}

	@Override
	public OutResponse<?> registrarEdneUsuarioID(Long idEdne, String dataUsuDetalle, String dataUsuIngreso,
			String dataUsuAgent, String dataUsuActividad, String dataUsuSituacion, String queryUsuDetalle,
			String queryUsuIngreso, String queryUsuAgent, String queryUsuActividad, String queryUsuSituacion)
			throws Exception {
		log.info("[REGISTRAR USUARIO ID][DAO][INICIO]");
		OutResponse<?> outResponse = new OutResponse<>();

		Integer rCodigo = 0;
		String rMensaje = "";

		SimpleJdbcCall jdbcCall = new SimpleJdbcCall(dataSource).withSchemaName(ConstanteUtil.BD_SCHEMA_RENI)
				.withCatalogName(ConstanteUtil.BD_PKG_RENI_EDNE).withProcedureName("SP_I_EDNE_USUARIO_ID");

		MapSqlParameterSource in = new MapSqlParameterSource();
		in.addValue("P_ID_EDNE", idEdne, Types.NUMERIC);
		in.addValue("P_DATA_USUARIO_DETALLE", dataUsuDetalle, Types.VARCHAR);
		in.addValue("P_DATA_USUARIO_INGRESO", dataUsuIngreso, Types.VARCHAR);
		in.addValue("P_DATA_AGENTE_EXTERNO", dataUsuAgent, Types.VARCHAR);
		in.addValue("P_DATA_USUARIO_ACTIVIDAD", dataUsuActividad, Types.VARCHAR);
		in.addValue("P_DATA_USUARIO_SITUACION", dataUsuSituacion, Types.VARCHAR);
		in.addValue("P_QUERY_USUARIO_DETALLE", queryUsuDetalle, Types.VARCHAR);
		in.addValue("P_QUERY_USUARIO_INGRESO", queryUsuIngreso, Types.VARCHAR);
		in.addValue("P_QUERY_AGENTE_EXTERNO", queryUsuAgent, Types.VARCHAR);
		in.addValue("P_QUERY_USUARIO_ACTIVIDAD", queryUsuActividad, Types.VARCHAR);
		in.addValue("P_QUERY_USUARIO_SITUACION", queryUsuSituacion, Types.VARCHAR);
		in.addValue("P_TXT_PC_CREACION", AdressUtil.getHostname(httpRequest), Types.VARCHAR);
		in.addValue("P_TXT_IP_CREACION", AdressUtil.getIP(httpRequest), Types.VARCHAR);
		log.info("[REGISTRAR USUARIO ID][DAO][INPUT PROCEDURE][" + in.toString() + "]");

		Map<String, Object> out = jdbcCall.execute(in);
		log.info("[REGISTRAR USUARIO ID][DAO][OUTPUT PROCEDURE][" + out.toString() + "]");

		rCodigo = MapUtil.getInt(out.get(ConstanteUtil.R_CODIGO));
		rMensaje = MapUtil.getString(out.get(ConstanteUtil.R_MENSAJE));

		if (rCodigo == ConstanteUtil.R_COD_EXITO) {
			log.info("[REGISTRAR USUARIO ID][DAO][EXITO]");

			outResponse.setRCodigo(rCodigo);
			outResponse.setRMensaje(rMensaje);
		} else {
			log.info("[REGISTRAR USUARIO ID][DAO][ERROR]");
			outResponse.setRCodigo(rCodigo);
			outResponse.setRMensaje(rMensaje);
			throw new SQLException(rMensaje);
		}
		log.info("[REGISTRAR USUARIO ID][DAO][FIN]");
		return outResponse;
	}
}
