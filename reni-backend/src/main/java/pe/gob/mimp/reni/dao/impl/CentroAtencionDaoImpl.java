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

import pe.gob.mimp.reni.dao.CentroAtencionDao;
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
import pe.gob.mimp.reni.dto.response.mapper.CentroAtencionCargaMasivaCentroListarResponseMapper;
import pe.gob.mimp.reni.dto.response.mapper.CentroAtencionCargaMasivaServListarResponseMapper;
import pe.gob.mimp.reni.dto.response.mapper.CentroAtencionListarResponseMapper;
import pe.gob.mimp.reni.dto.response.mapper.CentroAtencionServListarXCentroResponseMapper;
import pe.gob.mimp.reni.dto.response.mapper.CentroAtencionServListarXTipCenResponseMapper;
import pe.gob.mimp.reni.util.AdressUtil;
import pe.gob.mimp.reni.util.ConstanteUtil;
import pe.gob.mimp.reni.util.DateUtil;
import pe.gob.mimp.reni.util.MapUtil;

@Repository
public class CentroAtencionDaoImpl implements CentroAtencionDao {

	private static final Logger log = LoggerFactory.getLogger(CentroAtencionDaoImpl.class);

	@Autowired
	DataSource dataSource;

	@Autowired
	private HttpServletRequest httpRequest;

	@Override
	public OutResponse<List<CentroAtencionListarResponse>> listarCentroAtencion(CentroAtencionListarRequest req) {
		log.info("[LISTAR CENTRO ATENCION][DAO][INICIO]");
		OutResponse<List<CentroAtencionListarResponse>> outResponse = new OutResponse<>();

		Integer rCodigo = 0;
		String rMensaje = "";
		try {
			SimpleJdbcCall jdbcCall = new SimpleJdbcCall(dataSource).withSchemaName(ConstanteUtil.BD_SCHEMA_RENI)
					.withCatalogName(ConstanteUtil.BD_PKG_RENI_CENTRO_ATENCION)
					.withProcedureName("SP_L_CENTRO_ATENCION")
					.returningResultSet(ConstanteUtil.R_LISTA, new CentroAtencionListarResponseMapper());

			MapSqlParameterSource in = new MapSqlParameterSource();
			in.addValue("P_FLG_ACTIVO", req.getFlgActivo(), Types.NUMERIC);
			in.addValue("P_TXT_NOMBRE", req.getNombre(), Types.VARCHAR);
			in.addValue("P_TXT_SERVICIO", req.getNomServicio(), Types.VARCHAR);
			in.addValue("P_IDT_TIPO_CENTRO", req.getIdtTipoCentro(), Types.VARCHAR);
			log.info("[LISTAR CENTRO ATENCION][DAO][INPUT PROCEDURE][" + in.toString() + "]");

			Map<String, Object> out = jdbcCall.execute(in);
			log.info("[LISTAR CENTRO ATENCION][DAO][OUTPUT PROCEDURE][" + out.toString() + "]");

			rCodigo = MapUtil.getInt(out.get(ConstanteUtil.R_CODIGO));
			rMensaje = MapUtil.getString(out.get(ConstanteUtil.R_MENSAJE));

			if (rCodigo == ConstanteUtil.R_COD_EXITO) {
				log.info("[LISTAR CENTRO ATENCION][DAO][EXITO]");
				List<CentroAtencionListarResponse> res = MapUtil.getType(out.get(ConstanteUtil.R_LISTA));

				outResponse.setRCodigo(rCodigo);
				outResponse.setRMensaje(rMensaje);
				outResponse.setObjeto(res);
			} else {
				log.info("[LISTAR CENTRO ATENCION][DAO][ERROR]");
				outResponse.setRCodigo(rCodigo);
				outResponse.setRMensaje(rMensaje);
			}
		} catch (Exception e) {
			log.info("[LISTAR CENTRO ATENCION][DAO][EXCEPCION][" + e.getMessage() + "]");
			outResponse.setRCodigo(500);
			outResponse.setRMensaje(e.getMessage());
		}
		log.info("[LISTAR CENTRO ATENCION][DAO][FIN]");
		return outResponse;
	}

	@Override
	public OutResponse<CentroAtencionRegistrarResponse> registrarCentroAtencion(CentroAtencionRegistrarRequest req) {
		log.info("[REGISTRAR CENTRO ATENCION][DAO][INICIO]");
		OutResponse<CentroAtencionRegistrarResponse> outResponse = new OutResponse<>();

		Integer rCodigo = 0;
		String rMensaje = "";
		try {
			SimpleJdbcCall jdbcCall = new SimpleJdbcCall(dataSource).withSchemaName(ConstanteUtil.BD_SCHEMA_RENI)
					.withCatalogName(ConstanteUtil.BD_PKG_RENI_CENTRO_ATENCION)
					.withProcedureName("SP_I_CENTRO_ATENCION");

			MapSqlParameterSource in = new MapSqlParameterSource();
			in.addValue("P_TXT_NOMBRE", req.getNombre(), Types.VARCHAR);
			in.addValue("P_TXT_CODIGO", req.getCodigo(), Types.VARCHAR);
			in.addValue("P_FEC_CREACION_CENTRO",DateUtil.formatDateToString(req.getFechaCreacion(), ConstanteUtil.slash_ddMMyyyy), Types.VARCHAR);
			in.addValue("P_TXT_IDT_TIP_CENTRO", req.getIdtTipoCentro(), Types.VARCHAR);
			in.addValue("P_TXT_IDT_SUBTIP_CENTRO", req.getIdtSubtipoCentro(), Types.VARCHAR);
			in.addValue("P_TXT_UBIGEO", req.getUbigeo(), Types.VARCHAR);
			in.addValue("P_TXT_DEPARTAMENTO", req.getDepartamento(), Types.VARCHAR);
			in.addValue("P_TXT_PROVINCIA", req.getProvincia(), Types.VARCHAR);
			in.addValue("P_TXT_DISTRITO", req.getDistrito(), Types.VARCHAR);
			in.addValue("P_TXT_DIRECCION", req.getDireccion(), Types.VARCHAR);
			in.addValue("P_TXT_REFERENCIA_DIR", req.getRefDireccion(), Types.VARCHAR);
			in.addValue("P_TXT_AREA_RESID", req.getAreaResid(), Types.VARCHAR);
			in.addValue("P_FLG_TIENE_TELEF", req.getFlgTieneTelef(), Types.NUMERIC);
			in.addValue("P_FLG_TIENE_LUZ", req.getFlgTieneLuz(), Types.NUMERIC);
			in.addValue("P_FLG_TIENE_AGUA", req.getFlgTieneAgua(), Types.NUMERIC);
			in.addValue("P_FLG_TIENE_DESAGUE", req.getFlgTieneDesague(), Types.NUMERIC);
			in.addValue("P_NUM_CAPACIDAD_MAX", req.getCapacidadMaxima(), Types.NUMERIC);
			in.addValue("P_NUM_ID_TIP_DOC_REPRES", req.getIdTipDocRepres(), Types.NUMERIC);
			in.addValue("P_TXT_NRO_DOC_REPRES", req.getNroDocRepres(), Types.VARCHAR);
			in.addValue("P_TXT_NOMBRE_REPRES", req.getNombreRepres(), Types.VARCHAR);
			in.addValue("P_TXT_APE_PAT_REPRES", req.getApePaternoRepres(), Types.VARCHAR);
			in.addValue("P_TXT_APE_MAT_REPRES", req.getApeMaternoRepres(), Types.VARCHAR);
			in.addValue("P_TXT_NUM_TELEFONO", req.getNroTelefono(), Types.VARCHAR);
			in.addValue("P_TXT_TIPO_COORDENADA", req.getTipoCoordenada(), Types.VARCHAR);
			in.addValue("P_TXT_COORD_X", req.getCoordenadaX(), Types.VARCHAR);
			in.addValue("P_TXT_COORD_Y", req.getCoordenadaY(), Types.VARCHAR);
			in.addValue("P_FLG_ACTIVO", req.getFlgActivo(), Types.NUMERIC);
			in.addValue("P_NID_USUARIO_CREACION", req.getIdUsuarioCrea(), Types.NUMERIC);
			in.addValue("P_TXT_PC_CREACION", AdressUtil.getHostname(httpRequest), Types.VARCHAR);
			in.addValue("P_TXT_IP_CREACION", AdressUtil.getIP(httpRequest), Types.VARCHAR);
			log.info("[REGISTRAR CENTRO ATENCION][DAO][INPUT PROCEDURE][" + in.toString() + "]");

			Map<String, Object> out = jdbcCall.execute(in);
			log.info("[REGISTRAR CENTRO ATENCION][DAO][OUTPUT PROCEDURE][" + out.toString() + "]");

			rCodigo = MapUtil.getInt(out.get(ConstanteUtil.R_CODIGO));
			rMensaje = MapUtil.getString(out.get(ConstanteUtil.R_MENSAJE));

			if (rCodigo == ConstanteUtil.R_COD_EXITO) {
				log.info("[REGISTRAR CENTRO ATENCION][DAO][EXITO]");
				CentroAtencionRegistrarResponse res = new CentroAtencionRegistrarResponse();
				res.setIdCentroAtencion(MapUtil.getLong(out.get("R_ID")));

				outResponse.setRCodigo(rCodigo);
				outResponse.setRMensaje(rMensaje);
				outResponse.setObjeto(res);
			} else {
				log.info("[REGISTRAR CENTRO ATENCION][DAO][ERROR]");
				outResponse.setRCodigo(rCodigo);
				outResponse.setRMensaje(rMensaje);
			}
		} catch (Exception e) {
			log.info("[REGISTRAR CENTRO ATENCION][DAO][EXCEPCION][" + e.getMessage() + "]");
			outResponse.setRCodigo(500);
			outResponse.setRMensaje(e.getMessage());
		}
		log.info("[REGISTRAR CENTRO ATENCION][DAO][FIN]");
		return outResponse;
	}

	@Override
	public OutResponse<?> modificarCentroAtencion(CentroAtencionModificarRequest req) {
		log.info("[MODIFICAR CENTRO ATENCION][DAO][INICIO]");
		OutResponse<?> outResponse = new OutResponse<>();

		Integer rCodigo = 0;
		String rMensaje = "";
		try {
			SimpleJdbcCall jdbcCall = new SimpleJdbcCall(dataSource).withSchemaName(ConstanteUtil.BD_SCHEMA_RENI)
					.withCatalogName(ConstanteUtil.BD_PKG_RENI_CENTRO_ATENCION)
					.withProcedureName("SP_U_CENTRO_ATENCION");

			MapSqlParameterSource in = new MapSqlParameterSource();
			in.addValue("P_NID_CENTRO_ATEN", req.getIdCentroAtencion(), Types.NUMERIC);
			in.addValue("P_TXT_NOMBRE", req.getNombre(), Types.VARCHAR);
			in.addValue("P_TXT_CODIGO", req.getCodigo(), Types.VARCHAR);
			in.addValue("P_FEC_CREACION_CENTRO", DateUtil.formatDateToString(req.getFechaCreacion(), ConstanteUtil.slash_ddMMyyyy), Types.VARCHAR);
			in.addValue("P_TXT_IDT_TIP_CENTRO", req.getIdtTipoCentro(), Types.VARCHAR);
			in.addValue("P_TXT_IDT_SUBTIP_CENTRO", req.getIdtSubtipoCentro(), Types.VARCHAR);
			in.addValue("P_TXT_UBIGEO", req.getUbigeo(), Types.VARCHAR);
			in.addValue("P_TXT_DEPARTAMENTO", req.getDepartamento(), Types.VARCHAR);
			in.addValue("P_TXT_PROVINCIA", req.getProvincia(), Types.VARCHAR);
			in.addValue("P_TXT_DISTRITO", req.getDistrito(), Types.VARCHAR);
			in.addValue("P_TXT_DIRECCION", req.getDireccion(), Types.VARCHAR);
			in.addValue("P_TXT_REFERENCIA_DIR", req.getRefDireccion(), Types.VARCHAR);
			in.addValue("P_TXT_AREA_RESID", req.getAreaResid(), Types.VARCHAR);
			in.addValue("P_FLG_TIENE_TELEF", req.getFlgTieneTelef(), Types.NUMERIC);
			in.addValue("P_FLG_TIENE_LUZ", req.getFlgTieneLuz(), Types.NUMERIC);
			in.addValue("P_FLG_TIENE_AGUA", req.getFlgTieneAgua(), Types.NUMERIC);
			in.addValue("P_FLG_TIENE_DESAGUE", req.getFlgTieneDesague(), Types.NUMERIC);
			in.addValue("P_NUM_CAPACIDAD_MAX", req.getCapacidadMaxima(), Types.NUMERIC);
			in.addValue("P_NUM_ID_TIP_DOC_REPRES", req.getIdTipDocRepres(), Types.NUMERIC);
			in.addValue("P_TXT_NRO_DOC_REPRES", req.getNroDocRepres(), Types.VARCHAR);
			in.addValue("P_TXT_NOMBRE_REPRES", req.getNombreRepres(), Types.VARCHAR);
			in.addValue("P_TXT_APE_PAT_REPRES", req.getApePaternoRepres(), Types.VARCHAR);
			in.addValue("P_TXT_APE_MAT_REPRES", req.getApeMaternoRepres(), Types.VARCHAR);
			in.addValue("P_TXT_NUM_TELEFONO", req.getNroTelefono(), Types.VARCHAR);
			in.addValue("P_TXT_TIPO_COORDENADA", req.getTipoCoordenada(), Types.VARCHAR);
			in.addValue("P_TXT_COORD_X", req.getCoordenadaX(), Types.VARCHAR);
			in.addValue("P_TXT_COORD_Y", req.getCoordenadaY(), Types.VARCHAR);
			in.addValue("P_FLG_ACTIVO", req.getFlgActivo(), Types.NUMERIC);
			in.addValue("P_NID_USUARIO_MODIF", req.getIdUsuarioModif(), Types.NUMERIC);
			in.addValue("P_TXT_PC_MODIF", AdressUtil.getHostname(httpRequest), Types.VARCHAR);
			in.addValue("P_TXT_IP_MODIF", AdressUtil.getIP(httpRequest), Types.VARCHAR);
			log.info("[MODIFICAR CENTRO ATENCION][DAO][INPUT PROCEDURE][" + in.toString() + "]");

			Map<String, Object> out = jdbcCall.execute(in);
			log.info("[MODIFICAR CENTRO ATENCION][DAO][OUTPUT PROCEDURE][" + out.toString() + "]");

			rCodigo = MapUtil.getInt(out.get(ConstanteUtil.R_CODIGO));
			rMensaje = MapUtil.getString(out.get(ConstanteUtil.R_MENSAJE));

			if (rCodigo == ConstanteUtil.R_COD_EXITO) {
				log.info("[MODIFICAR CENTRO ATENCION][DAO][EXITO]");
				outResponse.setRCodigo(rCodigo);
				outResponse.setRMensaje(rMensaje);
			} else {
				log.info("[MODIFICAR CENTRO ATENCION][DAO][ERROR]");
				outResponse.setRCodigo(rCodigo);
				outResponse.setRMensaje(rMensaje);
			}
		} catch (Exception e) {
			log.info("[MODIFICAR CENTRO ATENCION][DAO][EXCEPCION][" + e.getMessage() + "]");
			outResponse.setRCodigo(500);
			outResponse.setRMensaje(e.getMessage());
		}
		log.info("[MODIFICAR CENTRO ATENCION][DAO][FIN]");
		return outResponse;
	}

	@Override
	public OutResponse<?> eliminarCentroAtencion(CentroAtencionEliminarRequest req) {
		log.info("[ELIMINAR CENTRO ATENCION][DAO][INICIO]");
		OutResponse<?> outResponse = new OutResponse<>();

		Integer rCodigo = 0;
		String rMensaje = "";
		try {
			SimpleJdbcCall jdbcCall = new SimpleJdbcCall(dataSource).withSchemaName(ConstanteUtil.BD_SCHEMA_RENI)
					.withCatalogName(ConstanteUtil.BD_PKG_RENI_CENTRO_ATENCION)
					.withProcedureName("SP_D_CENTRO_ATENCION");

			MapSqlParameterSource in = new MapSqlParameterSource();
			in.addValue("P_NID_CENTRO_ATEN", req.getIdCentroAtencion(), Types.NUMERIC);
			in.addValue("P_NID_USUARIO_MODIF", req.getIdUsuarioModif(), Types.NUMERIC);
			in.addValue("P_TXT_PC_MODIF", AdressUtil.getHostname(httpRequest), Types.VARCHAR);
			in.addValue("P_TXT_IP_MODIF", AdressUtil.getIP(httpRequest), Types.VARCHAR);
			log.info("[ELIMINAR CENTRO ATENCION][DAO][INPUT PROCEDURE][" + in.toString() + "]");

			Map<String, Object> out = jdbcCall.execute(in);
			log.info("[ELIMINAR CENTRO ATENCION][DAO][OUTPUT PROCEDURE][" + out.toString() + "]");

			rCodigo = MapUtil.getInt(out.get(ConstanteUtil.R_CODIGO));
			rMensaje = MapUtil.getString(out.get(ConstanteUtil.R_MENSAJE));

			if (rCodigo == ConstanteUtil.R_COD_EXITO) {
				log.info("[ELIMINAR CENTRO ATENCION][DAO][EXITO]");
				outResponse.setRCodigo(rCodigo);
				outResponse.setRMensaje(rMensaje);
			} else {
				log.info("[ELIMINAR CENTRO ATENCION][DAO][ERROR]");
				outResponse.setRCodigo(rCodigo);
				outResponse.setRMensaje(rMensaje);
			}
		} catch (Exception e) {
			log.info("[ELIMINAR CENTRO ATENCION][DAO][EXCEPCION][" + e.getMessage() + "]");
			outResponse.setRCodigo(500);
			outResponse.setRMensaje(e.getMessage());
		}
		log.info("[ELIMINAR CENTRO ATENCION][DAO][FIN]");
		return outResponse;
	}

	@Override
	public OutResponse<List<CentroAtencionServListarXTipCenResponse>> listarServicioXTipoCentro(
			CentroAtencionServListarXTipCenRequest req) {
		log.info("[LISTAR SERVICIO X TIPO CENTRO][DAO][INICIO]");
		OutResponse<List<CentroAtencionServListarXTipCenResponse>> outResponse = new OutResponse<>();

		Integer rCodigo = 0;
		String rMensaje = "";
		try {
			SimpleJdbcCall jdbcCall = new SimpleJdbcCall(dataSource).withSchemaName(ConstanteUtil.BD_SCHEMA_RENI)
					.withCatalogName(ConstanteUtil.BD_PKG_RENI_CENTRO_ATENCION)
					.withProcedureName("SP_L_SERVICIO_X_TIPO_CENTRO")
					.returningResultSet(ConstanteUtil.R_LISTA, new CentroAtencionServListarXTipCenResponseMapper());

			MapSqlParameterSource in = new MapSqlParameterSource();
			in.addValue("P_IDT_TIP_CENTRO", req.getIdtTipoCentro(), Types.VARCHAR);
			log.info("[LISTAR SERVICIO X TIPO CENTRO][DAO][INPUT PROCEDURE][" + in.toString() + "]");

			Map<String, Object> out = jdbcCall.execute(in);
			log.info("[LISTAR SERVICIO X TIPO CENTRO][DAO][OUTPUT PROCEDURE][" + out.toString() + "]");

			rCodigo = MapUtil.getInt(out.get(ConstanteUtil.R_CODIGO));
			rMensaje = MapUtil.getString(out.get(ConstanteUtil.R_MENSAJE));

			if (rCodigo == ConstanteUtil.R_COD_EXITO) {
				log.info("[LISTAR SERVICIO X TIPO CENTRO][DAO][EXITO]");
				List<CentroAtencionServListarXTipCenResponse> res = MapUtil.getType(out.get(ConstanteUtil.R_LISTA));

				outResponse.setRCodigo(rCodigo);
				outResponse.setRMensaje(rMensaje);
				outResponse.setObjeto(res);
			} else {
				log.info("[LISTAR SERVICIO X TIPO CENTRO][DAO][ERROR]");
				outResponse.setRCodigo(rCodigo);
				outResponse.setRMensaje(rMensaje);
			}
		} catch (Exception e) {
			log.info("[LISTAR SERVICIO X TIPO CENTRO][DAO][EXCEPCION][" + e.getMessage() + "]");
			outResponse.setRCodigo(500);
			outResponse.setRMensaje(e.getMessage());
		}
		log.info("[LISTAR SERVICIO X TIPO CENTRO][DAO][FIN]");
		return outResponse;
	}

	@Override
	public OutResponse<List<CentroAtencionServListarXCentroResponse>> listarServicioXCentro(
			CentroAtencionServListarXCentroRequest req) {
		log.info("[LISTAR SERVICIO X CENTRO][DAO][INICIO]");
		OutResponse<List<CentroAtencionServListarXCentroResponse>> outResponse = new OutResponse<>();

		Integer rCodigo = 0;
		String rMensaje = "";
		try {
			SimpleJdbcCall jdbcCall = new SimpleJdbcCall(dataSource).withSchemaName(ConstanteUtil.BD_SCHEMA_RENI)
					.withCatalogName(ConstanteUtil.BD_PKG_RENI_CENTRO_ATENCION)
					.withProcedureName("SP_L_SERVICIO_X_CENTRO_ATEN")
					.returningResultSet(ConstanteUtil.R_LISTA, new CentroAtencionServListarXCentroResponseMapper());

			MapSqlParameterSource in = new MapSqlParameterSource();
			in.addValue("P_NID_CENTRO_ATEN", req.getIdCentroAtencion(), Types.NUMERIC);
			log.info("[LISTAR SERVICIO X CENTRO][DAO][INPUT PROCEDURE][" + in.toString() + "]");

			Map<String, Object> out = jdbcCall.execute(in);
			log.info("[LISTAR SERVICIO X CENTRO][DAO][OUTPUT PROCEDURE][" + out.toString() + "]");

			rCodigo = MapUtil.getInt(out.get(ConstanteUtil.R_CODIGO));
			rMensaje = MapUtil.getString(out.get(ConstanteUtil.R_MENSAJE));

			if (rCodigo == ConstanteUtil.R_COD_EXITO) {
				log.info("[LISTAR SERVICIO X CENTRO][DAO][EXITO]");
				List<CentroAtencionServListarXCentroResponse> res = MapUtil.getType(out.get(ConstanteUtil.R_LISTA));

				outResponse.setRCodigo(rCodigo);
				outResponse.setRMensaje(rMensaje);
				outResponse.setObjeto(res);
			} else {
				log.info("[LISTAR SERVICIO X CENTRO][DAO][ERROR]");
				outResponse.setRCodigo(rCodigo);
				outResponse.setRMensaje(rMensaje);
			}
		} catch (Exception e) {
			log.info("[LISTAR SERVICIO X CENTRO][DAO][EXCEPCION][" + e.getMessage() + "]");
			outResponse.setRCodigo(500);
			outResponse.setRMensaje(e.getMessage());
		}
		log.info("[LISTAR SERVICIO X CENTRO][DAO][FIN]");
		return outResponse;
	}

	@Override
	public OutResponse<CentroAtencionAsociarServicioResponse> registrarServicioCentroAtencion(
			CentroAtencionAsociarServicioRequest req) {
		log.info("[ASOCIAR SERVICIO A CENTRO][DAO][INICIO]");
		OutResponse<CentroAtencionAsociarServicioResponse> outResponse = new OutResponse<>();

		Integer rCodigo = 0;
		String rMensaje = "";
		try {
			SimpleJdbcCall jdbcCall = new SimpleJdbcCall(dataSource).withSchemaName(ConstanteUtil.BD_SCHEMA_RENI)
					.withCatalogName(ConstanteUtil.BD_PKG_RENI_CENTRO_ATENCION)
					.withProcedureName("SP_I_SERVICIO_CENTRO_ATEN");

			MapSqlParameterSource in = new MapSqlParameterSource();
			in.addValue("P_NID_CENTRO_ATEN", req.getIdCentroAtencion(), Types.NUMERIC);
			in.addValue("P_NID_SERVICIO", req.getIdServicio(), Types.NUMERIC);
			in.addValue("P_NID_USUARIO_CREACION", req.getIdUsuarioCrea(), Types.NUMERIC);
			in.addValue("P_TXT_PC_CREACION", AdressUtil.getHostname(httpRequest), Types.VARCHAR);
			in.addValue("P_TXT_IP_CREACION", AdressUtil.getIP(httpRequest), Types.VARCHAR);
			log.info("[ASOCIAR SERVICIO A CENTRO][DAO][INPUT PROCEDURE][" + in.toString() + "]");

			Map<String, Object> out = jdbcCall.execute(in);
			log.info("[ASOCIAR SERVICIO A CENTRO][DAO][OUTPUT PROCEDURE][" + out.toString() + "]");

			rCodigo = MapUtil.getInt(out.get(ConstanteUtil.R_CODIGO));
			rMensaje = MapUtil.getString(out.get(ConstanteUtil.R_MENSAJE));

			if (rCodigo == ConstanteUtil.R_COD_EXITO) {
				log.info("[ASOCIAR SERVICIO A CENTRO][DAO][EXITO]");
				CentroAtencionAsociarServicioResponse res = new CentroAtencionAsociarServicioResponse();
				res.setIdCentroAtenServicio(MapUtil.getLong(out.get("R_ID")));

				outResponse.setRCodigo(rCodigo);
				outResponse.setRMensaje(rMensaje);
				outResponse.setObjeto(res);
			} else {
				log.info("[ASOCIAR SERVICIO A CENTRO][DAO][ERROR]");
				outResponse.setRCodigo(rCodigo);
				outResponse.setRMensaje(rMensaje);
			}
		} catch (Exception e) {
			log.info("[ASOCIAR SERVICIO A CENTRO][DAO][EXCEPCION][" + e.getMessage() + "]");
			outResponse.setRCodigo(500);
			outResponse.setRMensaje(e.getMessage());
		}
		log.info("[ASOCIAR SERVICIO A CENTRO][DAO][FIN]");
		return outResponse;
	}

	@Override
	public OutResponse<?> eliminarServicioCentroAtencion(CentroAtencionEliminarServicioAsocRequest req) {
		log.info("[ELIMINAR SERVICIO DE CENTRO][DAO][INICIO]");
		OutResponse<?> outResponse = new OutResponse<>();

		Integer rCodigo = 0;
		String rMensaje = "";
		try {
			SimpleJdbcCall jdbcCall = new SimpleJdbcCall(dataSource).withSchemaName(ConstanteUtil.BD_SCHEMA_RENI)
					.withCatalogName(ConstanteUtil.BD_PKG_RENI_CENTRO_ATENCION)
					.withProcedureName("SP_D_SERVICIO_CENTRO_ATEN");

			MapSqlParameterSource in = new MapSqlParameterSource();
			in.addValue("P_NID_CENTRO_ATEN_SERVICIO", req.getIdCentroAtenServicio(), Types.NUMERIC);
			in.addValue("P_NID_USUARIO_MODIF", req.getIdUsuarioModif(), Types.NUMERIC);
			in.addValue("P_TXT_PC_MODIF", AdressUtil.getHostname(httpRequest), Types.VARCHAR);
			in.addValue("P_TXT_IP_MODIF", AdressUtil.getIP(httpRequest), Types.VARCHAR);
			log.info("[ELIMINAR SERVICIO DE CENTRO][DAO][INPUT PROCEDURE][" + in.toString() + "]");

			Map<String, Object> out = jdbcCall.execute(in);
			log.info("[ELIMINAR SERVICIO DE CENTRO][DAO][OUTPUT PROCEDURE][" + out.toString() + "]");

			rCodigo = MapUtil.getInt(out.get(ConstanteUtil.R_CODIGO));
			rMensaje = MapUtil.getString(out.get(ConstanteUtil.R_MENSAJE));

			if (rCodigo == ConstanteUtil.R_COD_EXITO) {
				log.info("[ELIMINAR SERVICIO DE CENTRO][DAO][EXITO]");
				outResponse.setRCodigo(rCodigo);
				outResponse.setRMensaje(rMensaje);
			} else {
				log.info("[ELIMINAR SERVICIO DE CENTRO][DAO][ERROR]");
				outResponse.setRCodigo(rCodigo);
				outResponse.setRMensaje(rMensaje);
			}
		} catch (Exception e) {
			log.info("[ELIMINAR SERVICIO DE CENTRO][DAO][EXCEPCION][" + e.getMessage() + "]");
			outResponse.setRCodigo(500);
			outResponse.setRMensaje(e.getMessage());
		}
		log.info("[ELIMINAR SERVICIO DE CENTRO][DAO][FIN]");
		return outResponse;
	}

	@Override
	public OutResponse<List<CentroAtencionCargaMasivaServListarResponse>> listarServicio(String req) {
		log.info("[LISTAR SERVICIO][DAO][INICIO]");
		OutResponse<List<CentroAtencionCargaMasivaServListarResponse>> outResponse = new OutResponse<>();

		Integer rCodigo = 0;
		String rMensaje = "";
		try {
			SimpleJdbcCall jdbcCall = new SimpleJdbcCall(dataSource).withSchemaName(ConstanteUtil.BD_SCHEMA_RENI)
					.withCatalogName(ConstanteUtil.BD_PKG_RENI_CENTRO_ATENCION)
					.withProcedureName("SP_L_SERVICIO_X_CARG_MASIV")
					.returningResultSet(ConstanteUtil.R_LISTA, new CentroAtencionCargaMasivaServListarResponseMapper());

			MapSqlParameterSource in = new MapSqlParameterSource();
			in.addValue("P_L_SERVICIO", req, Types.VARCHAR);
			log.info("[LISTAR SERVICIO][DAO][INPUT PROCEDURE][" + in.toString() + "]");

			Map<String, Object> out = jdbcCall.execute(in);
			log.info("[LISTAR SERVICIO][DAO][OUTPUT PROCEDURE][" + out.toString() + "]");

			rCodigo = MapUtil.getInt(out.get(ConstanteUtil.R_CODIGO));
			rMensaje = MapUtil.getString(out.get(ConstanteUtil.R_MENSAJE));

			if (rCodigo == ConstanteUtil.R_COD_EXITO) {
				log.info("[LISTAR SERVICIO][DAO][EXITO]");
				List<CentroAtencionCargaMasivaServListarResponse> res = MapUtil.getType(out.get(ConstanteUtil.R_LISTA));

				outResponse.setRCodigo(rCodigo);
				outResponse.setRMensaje(rMensaje);
				outResponse.setObjeto(res);
			} else {
				log.info("[LISTAR SERVICIO][DAO][ERROR]");
				outResponse.setRCodigo(rCodigo);
				outResponse.setRMensaje(rMensaje);
			}
		} catch (Exception e) {
			log.info("[LISTAR SERVICIO][DAO][EXCEPCION][" + e.getMessage() + "]");
			outResponse.setRCodigo(500);
			outResponse.setRMensaje(e.getMessage());
		}
		log.info("[LISTAR SERVICIO][DAO][FIN]");
		return outResponse;
	}

	@Override
	public OutResponse<List<CentroAtencionCargaMasivaCentroListarResponse>> listarCentro(String req) {
		log.info("[LISTAR CENTRO ATENCION][DAO][INICIO]");
		OutResponse<List<CentroAtencionCargaMasivaCentroListarResponse>> outResponse = new OutResponse<>();

		Integer rCodigo = 0;
		String rMensaje = "";
		try {
			SimpleJdbcCall jdbcCall = new SimpleJdbcCall(dataSource).withSchemaName(ConstanteUtil.BD_SCHEMA_RENI)
					.withCatalogName(ConstanteUtil.BD_PKG_RENI_CENTRO_ATENCION)
					.withProcedureName("SP_L_CENTRO_X_CARG_MASIV").returningResultSet(ConstanteUtil.R_LISTA,
							new CentroAtencionCargaMasivaCentroListarResponseMapper());

			MapSqlParameterSource in = new MapSqlParameterSource();
			in.addValue("P_L_CENTRO", req, Types.VARCHAR);
			log.info("[LISTAR CENTRO ATENCION][DAO][INPUT PROCEDURE][" + in.toString() + "]");

			Map<String, Object> out = jdbcCall.execute(in);
			log.info("[LISTAR CENTRO ATENCION][DAO][OUTPUT PROCEDURE][" + out.toString() + "]");

			rCodigo = MapUtil.getInt(out.get(ConstanteUtil.R_CODIGO));
			rMensaje = MapUtil.getString(out.get(ConstanteUtil.R_MENSAJE));

			if (rCodigo == ConstanteUtil.R_COD_EXITO) {
				log.info("[LISTAR CENTRO ATENCION][DAO][EXITO]");
				List<CentroAtencionCargaMasivaCentroListarResponse> res = MapUtil
						.getType(out.get(ConstanteUtil.R_LISTA));

				outResponse.setRCodigo(rCodigo);
				outResponse.setRMensaje(rMensaje);
				outResponse.setObjeto(res);
			} else {
				log.info("[LISTAR CENTRO ATENCION][DAO][ERROR]");
				outResponse.setRCodigo(rCodigo);
				outResponse.setRMensaje(rMensaje);
			}
		} catch (Exception e) {
			log.info("[LISTAR CENTRO ATENCION][DAO][EXCEPCION][" + e.getMessage() + "]");
			outResponse.setRCodigo(500);
			outResponse.setRMensaje(e.getMessage());
		}
		log.info("[LISTAR CENTRO ATENCION][DAO][FIN]");
		return outResponse;
	}

	@Override
	public OutResponse<Long> cargaMasivaCentroAtencion(CentroAtencionCargaMasivaDetalleRequest req, Long idUsuario)
			throws Exception {
		log.info("[CARGA MASIVA CENTRO ATENCION][DAO][INICIO]");
		OutResponse<Long> outResponse = new OutResponse<>();

		Integer rCodigo = 0;
		String rMensaje = "";

		SimpleJdbcCall jdbcCall = new SimpleJdbcCall(dataSource).withSchemaName(ConstanteUtil.BD_SCHEMA_RENI)
				.withCatalogName(ConstanteUtil.BD_PKG_RENI_CENTRO_ATENCION)
				.withProcedureName("SP_I_CENTRO_ATEN_CARG_MASIV");

		MapSqlParameterSource in = new MapSqlParameterSource();
		in.addValue("P_TXT_NOMBRE", req.getNombre(), Types.VARCHAR);
		in.addValue("P_TXT_CODIGO", req.getCodigo(), Types.VARCHAR);
		in.addValue("P_FEC_CREACION_CENTRO",
				DateUtil.formatDateToString(req.getFechaCreacion(), ConstanteUtil.slash_ddMMyyyy), Types.VARCHAR);
		in.addValue("P_TXT_IDT_TIP_CENTRO", req.getIdtTipoCentro(), Types.VARCHAR);
		in.addValue("P_TXT_IDT_SUBTIP_CENTRO", req.getIdtSubtipoCentro(), Types.VARCHAR);
		in.addValue("P_TXT_UBIGEO", req.getUbigeo(), Types.VARCHAR);
		in.addValue("P_TXT_DEPARTAMENTO", req.getDepartamento(), Types.VARCHAR);
		in.addValue("P_TXT_PROVINCIA", req.getProvincia(), Types.VARCHAR);
		in.addValue("P_TXT_DISTRITO", req.getDistrito(), Types.VARCHAR);
		in.addValue("P_TXT_DIRECCION", req.getDireccion(), Types.VARCHAR);
		in.addValue("P_TXT_REFERENCIA_DIR", req.getRefDireccion(), Types.VARCHAR);
		in.addValue("P_TXT_AREA_RESID", req.getAreaResid(), Types.VARCHAR);
		in.addValue("P_FLG_TIENE_TELEF", req.getFlgTieneTelef(), Types.NUMERIC);
		in.addValue("P_FLG_TIENE_LUZ", req.getFlgTieneLuz(), Types.NUMERIC);
		in.addValue("P_FLG_TIENE_AGUA", req.getFlgTieneAgua(), Types.NUMERIC);
		in.addValue("P_FLG_TIENE_DESAGUE", req.getFlgTieneDesague(), Types.NUMERIC);
		in.addValue("P_NUM_CAPACIDAD_MAX", req.getCapacidadMaxima(), Types.NUMERIC);
		in.addValue("P_NUM_ID_TIP_DOC_REPRES", req.getIdTipDocRepres(), Types.NUMERIC);
		in.addValue("P_TXT_NRO_DOC_REPRES", req.getNroDocRepres(), Types.VARCHAR);
		in.addValue("P_TXT_NOMBRE_REPRES", req.getNombreRepres(), Types.VARCHAR);
		in.addValue("P_TXT_APE_PAT_REPRES", req.getApePaternoRepres(), Types.VARCHAR);
		in.addValue("P_TXT_APE_MAT_REPRES", req.getApeMaternoRepres(), Types.VARCHAR);
		in.addValue("P_TXT_NUM_TELEFONO", req.getNroTelefono(), Types.VARCHAR);
		in.addValue("P_TXT_TIPO_COORDENADA", req.getTipoCoordenada(), Types.VARCHAR);
		in.addValue("P_TXT_COORD_X", req.getCoordenadaX(), Types.VARCHAR);
		in.addValue("P_TXT_COORD_Y", req.getCoordenadaY(), Types.VARCHAR);
		in.addValue("P_FLG_ACTIVO", req.getFlgActivo(), Types.NUMERIC);
		in.addValue("P_NID_USUARIO_CREACION", idUsuario, Types.NUMERIC);
		in.addValue("P_TXT_PC_CREACION", AdressUtil.getHostname(httpRequest), Types.VARCHAR);
		in.addValue("P_TXT_IP_CREACION", AdressUtil.getIP(httpRequest), Types.VARCHAR);
		log.info("[CARGA MASIVA CENTRO ATENCION][DAO][INPUT PROCEDURE][" + in.toString() + "]");

		Map<String, Object> out = jdbcCall.execute(in);
		log.info("[CARGA MASIVA CENTRO ATENCION][DAO][OUTPUT PROCEDURE][" + out.toString() + "]");

		rCodigo = MapUtil.getInt(out.get(ConstanteUtil.R_CODIGO));
		rMensaje = MapUtil.getString(out.get(ConstanteUtil.R_MENSAJE));

		if (rCodigo == ConstanteUtil.R_COD_EXITO) {
			log.info("[CARGA MASIVA CENTRO ATENCION][DAO][EXITO]");
			Long idCentro = MapUtil.getLong(out.get("R_ID"));

			outResponse.setRCodigo(rCodigo);
			outResponse.setRMensaje(rMensaje);
			outResponse.setObjeto(idCentro);
		} else {
			log.info("[CARGA MASIVA CENTRO ATENCION][DAO][ERROR]");
			outResponse.setRCodigo(rCodigo);
			outResponse.setRMensaje(rMensaje);
			throw new SQLException(rMensaje);
		}

		log.info("[CARGA MASIVA CENTRO ATENCION][DAO][FIN]");
		return outResponse;
	}

	@Override
	public OutResponse<Long> cargaMasivaCentroAtencionAsocServicio(Long idCentroAtencion, Long idServicio,
			Long idUsuario) throws Exception {
		log.info("[CARGA MASIVA CENTRO ATENCION ASOC SERVICIO][DAO][INICIO]");
		OutResponse<Long> outResponse = new OutResponse<>();

		Integer rCodigo = 0;
		String rMensaje = "";

		SimpleJdbcCall jdbcCall = new SimpleJdbcCall(dataSource).withSchemaName(ConstanteUtil.BD_SCHEMA_RENI)
				.withCatalogName(ConstanteUtil.BD_PKG_RENI_CENTRO_ATENCION)
				.withProcedureName("SP_I_SERV_CENT_CARG_MASIV");

		MapSqlParameterSource in = new MapSqlParameterSource();
		in.addValue("P_NID_CENTRO_ATEN", idCentroAtencion, Types.NUMERIC);
		in.addValue("P_NID_SERVICIO", idServicio, Types.NUMERIC);
		in.addValue("P_NID_USUARIO_CREACION", idUsuario, Types.NUMERIC);
		in.addValue("P_TXT_PC_CREACION", AdressUtil.getHostname(httpRequest), Types.VARCHAR);
		in.addValue("P_TXT_IP_CREACION", AdressUtil.getIP(httpRequest), Types.VARCHAR);
		log.info("[CARGA MASIVA CENTRO ATENCION ASOC SERVICIO][DAO][INPUT PROCEDURE][" + in.toString() + "]");

		Map<String, Object> out = jdbcCall.execute(in);
		log.info("[CARGA MASIVA CENTRO ATENCION ASOC SERVICIO][DAO][OUTPUT PROCEDURE][" + out.toString() + "]");

		rCodigo = MapUtil.getInt(out.get(ConstanteUtil.R_CODIGO));
		rMensaje = MapUtil.getString(out.get(ConstanteUtil.R_MENSAJE));

		if (rCodigo == ConstanteUtil.R_COD_EXITO) {
			log.info("[CARGA MASIVA CENTRO ATENCION ASOC SERVICIO][DAO][EXITO]");
			Long res = MapUtil.getLong(out.get("R_ID"));

			outResponse.setRCodigo(rCodigo);
			outResponse.setRMensaje(rMensaje);
			outResponse.setObjeto(res);
		} else {
			log.info("[CARGA MASIVA CENTRO ATENCION ASOC SERVICIO][DAO][ERROR]");
			outResponse.setRCodigo(rCodigo);
			outResponse.setRMensaje(rMensaje);
			throw new SQLException(rMensaje);
		}

		log.info("[CARGA MASIVA CENTRO ATENCION ASOC SERVICIO][DAO][FIN]");
		return outResponse;
	}

	@Override
	public OutResponse<?> actUbigeosCentroAtencion(Long idCentroAtencion, String departamento, String provincia,
			String distrito, Long idUsuario) {
		log.info("[ACTUALIZAR UBIGEO CENTRO ATENCION][DAO][INICIO]");
		OutResponse<?> outResponse = new OutResponse<>();

		Integer rCodigo = 0;
		String rMensaje = "";
		try {
			SimpleJdbcCall jdbcCall = new SimpleJdbcCall(dataSource).withSchemaName(ConstanteUtil.BD_SCHEMA_RENI)
					.withCatalogName(ConstanteUtil.BD_PKG_RENI_CENTRO_ATENCION)
					.withProcedureName("SP_U_UBIG_CENTRO_ATEN");

			MapSqlParameterSource in = new MapSqlParameterSource();
			in.addValue("P_NID_CENTRO_ATEN", idCentroAtencion, Types.NUMERIC);
			in.addValue("P_TXT_DEPARTAMENTO", departamento, Types.VARCHAR);
			in.addValue("P_TXT_PROVINCIA", provincia, Types.VARCHAR);
			in.addValue("P_TXT_DISTRITO", distrito, Types.VARCHAR);
			in.addValue("P_NID_USUARIO_MODIF", idUsuario, Types.NUMERIC);
			in.addValue("P_TXT_PC_MODIF", AdressUtil.getHostname(httpRequest), Types.VARCHAR);
			in.addValue("P_TXT_IP_MODIF", AdressUtil.getIP(httpRequest), Types.VARCHAR);
			log.info("[ACTUALIZAR UBIGEO CENTRO ATENCION][DAO][INPUT PROCEDURE][" + in.toString() + "]");

			Map<String, Object> out = jdbcCall.execute(in);
			log.info("[ACTUALIZAR UBIGEO CENTRO ATENCION][DAO][OUTPUT PROCEDURE][" + out.toString() + "]");

			rCodigo = MapUtil.getInt(out.get(ConstanteUtil.R_CODIGO));
			rMensaje = MapUtil.getString(out.get(ConstanteUtil.R_MENSAJE));

			if (rCodigo == ConstanteUtil.R_COD_EXITO) {
				log.info("[ACTUALIZAR UBIGEO CENTRO ATENCION][DAO][EXITO]");
				outResponse.setRCodigo(rCodigo);
				outResponse.setRMensaje(rMensaje);
			} else {
				log.info("[ACTUALIZAR UBIGEO CENTRO ATENCION][DAO][ERROR]");
				outResponse.setRCodigo(rCodigo);
				outResponse.setRMensaje(rMensaje);
			}
		} catch (Exception e) {
			log.info("[ACTUALIZAR UBIGEO CENTRO ATENCION][DAO][EXCEPCION][" + e.getMessage() + "]");
			outResponse.setRCodigo(500);
			outResponse.setRMensaje(e.getMessage());
		}
		log.info("[ACTUALIZAR UBIGEO CENTRO ATENCION][DAO][FIN]");
		return outResponse;
	}
}
