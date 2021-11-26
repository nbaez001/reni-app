package pe.gob.mimp.reni.dao.impl;

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

import pe.gob.mimp.reni.dao.TipoCentroAtencionDao;
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
import pe.gob.mimp.reni.dto.response.mapper.SubtipoCentroListarResponseMapper;
import pe.gob.mimp.reni.dto.response.mapper.TipoCentroListarResponseMapper;
import pe.gob.mimp.reni.util.AdressUtil;
import pe.gob.mimp.reni.util.ConstanteUtil;
import pe.gob.mimp.reni.util.MapUtil;

@Repository
public class TipoCentroAtencionDaoImpl implements TipoCentroAtencionDao {

	private static final Logger log = LoggerFactory.getLogger(TipoCentroAtencionDaoImpl.class);

	@Autowired
	DataSource dataSource;

	@Autowired
	private HttpServletRequest httpRequest;

	@Override
	public OutResponse<List<TipoCentroListarResponse>> listarTipoCentro(TipoCentroListarRequest req) {
		log.info("[LISTAR TIPO CENTRO][DAO][INICIO]");
		OutResponse<List<TipoCentroListarResponse>> outResponse = new OutResponse<>();

		Integer rCodigo = 0;
		String rMensaje = "";
		try {
			SimpleJdbcCall jdbcCall = new SimpleJdbcCall(dataSource).withSchemaName(ConstanteUtil.BD_SCHEMA_RENI)
					.withCatalogName(ConstanteUtil.BD_PKG_RENI_TIPO_CENTRO).withProcedureName("SP_L_TIPO_CENTRO")
					.returningResultSet(ConstanteUtil.R_LISTA, new TipoCentroListarResponseMapper());

			MapSqlParameterSource in = new MapSqlParameterSource();
			in.addValue("P_TXT_NOMBRE", req.getNombre(), Types.VARCHAR);
			in.addValue("P_FLG_ACTIVO", req.getFlgActivo(), Types.NUMERIC);
			log.info("[LISTAR TIPO CENTRO][DAO][INPUT PROCEDURE][" + in.toString() + "]");

			Map<String, Object> out = jdbcCall.execute(in);
			log.info("[LISTAR TIPO CENTRO][DAO][OUTPUT PROCEDURE][" + out.toString() + "]");

			rCodigo = MapUtil.getInt(out.get(ConstanteUtil.R_CODIGO));
			rMensaje = MapUtil.getString(out.get(ConstanteUtil.R_MENSAJE));

			if (rCodigo == ConstanteUtil.R_COD_EXITO) {
				log.info("[LISTAR TIPO CENTRO][DAO][EXITO]");
				List<TipoCentroListarResponse> res = MapUtil.getType(out.get(ConstanteUtil.R_LISTA));

				outResponse.setRCodigo(rCodigo);
				outResponse.setRMensaje(rMensaje);
				outResponse.setObjeto(res);
			} else {
				log.info("[LISTAR TIPO CENTRO][DAO][ERROR]");
				outResponse.setRCodigo(rCodigo);
				outResponse.setRMensaje(rMensaje);
			}
		} catch (Exception e) {
			log.info("[LISTAR TIPO CENTRO][DAO][EXCEPCION][" + e.getMessage() + "]");
			outResponse.setRCodigo(500);
			outResponse.setRMensaje(e.getMessage());
		}
		log.info("[LISTAR TIPO CENTRO][DAO][FIN]");
		return outResponse;
	}

	@Override
	public OutResponse<TipoCentroRegistrarResponse> registrarTipoCentro(TipoCentroRegistrarRequest req) {
		log.info("[REGISTRAR TIPO CENTRO][DAO][INICIO]");
		OutResponse<TipoCentroRegistrarResponse> outResponse = new OutResponse<>();

		Integer rCodigo = 0;
		String rMensaje = "";
		try {
			SimpleJdbcCall jdbcCall = new SimpleJdbcCall(dataSource).withSchemaName(ConstanteUtil.BD_SCHEMA_RENI)
					.withCatalogName(ConstanteUtil.BD_PKG_RENI_TIPO_CENTRO).withProcedureName("SP_I_TIPO_CENTRO");

			MapSqlParameterSource in = new MapSqlParameterSource();
			in.addValue("P_TXT_CODIGO", req.getCodigo(), Types.VARCHAR);
			in.addValue("P_TXT_NOMBRE", req.getNombre(), Types.VARCHAR);
			in.addValue("P_TXT_ABREVIATURA", req.getAbreviatura(), Types.VARCHAR);
			in.addValue("P_TXT_DESCRIPCION", req.getDescripcion(), Types.VARCHAR);
			in.addValue("P_NUM_ORDEN", req.getOrden(), Types.NUMERIC);
			in.addValue("P_NID_USUARIO_CREACION", req.getIdUsuarioCrea(), Types.NUMERIC);
			in.addValue("P_TXT_PC_CREACION", AdressUtil.getHostname(httpRequest), Types.VARCHAR);
			in.addValue("P_TXT_IP_CREACION", AdressUtil.getIP(httpRequest), Types.VARCHAR);
			log.info("[REGISTRAR TIPO CENTRO][DAO][INPUT PROCEDURE][" + in.toString() + "]");

			Map<String, Object> out = jdbcCall.execute(in);
			log.info("[REGISTRAR TIPO CENTRO][DAO][OUTPUT PROCEDURE][" + out.toString() + "]");

			rCodigo = MapUtil.getInt(out.get(ConstanteUtil.R_CODIGO));
			rMensaje = MapUtil.getString(out.get(ConstanteUtil.R_MENSAJE));

			if (rCodigo == ConstanteUtil.R_COD_EXITO) {
				log.info("[REGISTRAR TIPO CENTRO][DAO][EXITO]");
				TipoCentroRegistrarResponse res = new TipoCentroRegistrarResponse();
				res.setIdTipoCentro(MapUtil.getLong(out.get("R_ID")));

				outResponse.setRCodigo(rCodigo);
				outResponse.setRMensaje(rMensaje);
				outResponse.setObjeto(res);
			} else {
				log.info("[REGISTRAR TIPO CENTRO][DAO][ERROR]");
				outResponse.setRCodigo(rCodigo);
				outResponse.setRMensaje(rMensaje);
			}
		} catch (Exception e) {
			log.info("[REGISTRAR TIPO CENTRO][DAO][EXCEPCION][" + e.getMessage() + "]");
			outResponse.setRCodigo(500);
			outResponse.setRMensaje(e.getMessage());
		}
		log.info("[REGISTRAR TIPO CENTRO][DAO][FIN]");
		return outResponse;
	}

	@Override
	public OutResponse<?> modificarTipoCentro(TipoCentroModificarRequest req) {
		log.info("[MODIFICAR TIPO CENTRO][DAO][INICIO]");
		OutResponse<?> outResponse = new OutResponse<>();

		Integer rCodigo = 0;
		String rMensaje = "";
		try {
			SimpleJdbcCall jdbcCall = new SimpleJdbcCall(dataSource).withSchemaName(ConstanteUtil.BD_SCHEMA_RENI)
					.withCatalogName(ConstanteUtil.BD_PKG_RENI_TIPO_CENTRO).withProcedureName("SP_U_TIPO_CENTRO");

			MapSqlParameterSource in = new MapSqlParameterSource();
			in.addValue("P_NID_TIPO_CENTRO", req.getIdTipoCentro(), Types.NUMERIC);
			in.addValue("P_TXT_CODIGO", req.getCodigo(), Types.VARCHAR);
			in.addValue("P_TXT_NOMBRE", req.getNombre(), Types.VARCHAR);
			in.addValue("P_TXT_ABREVIATURA", req.getAbreviatura(), Types.VARCHAR);
			in.addValue("P_TXT_DESCRIPCION", req.getDescripcion(), Types.VARCHAR);
			in.addValue("P_NUM_ORDEN", req.getOrden(), Types.NUMERIC);
			in.addValue("P_NID_USUARIO_MODIF", req.getIdUsuarioModif(), Types.NUMERIC);
			in.addValue("P_TXT_PC_MODIF", AdressUtil.getHostname(httpRequest), Types.VARCHAR);
			in.addValue("P_TXT_IP_MODIF", AdressUtil.getIP(httpRequest), Types.VARCHAR);
			log.info("[MODIFICAR TIPO CENTRO][DAO][INPUT PROCEDURE][" + in.toString() + "]");

			Map<String, Object> out = jdbcCall.execute(in);
			log.info("[MODIFICAR TIPO CENTRO][DAO][OUTPUT PROCEDURE][" + out.toString() + "]");

			rCodigo = MapUtil.getInt(out.get(ConstanteUtil.R_CODIGO));
			rMensaje = MapUtil.getString(out.get(ConstanteUtil.R_MENSAJE));

			if (rCodigo == ConstanteUtil.R_COD_EXITO) {
				log.info("[MODIFICAR TIPO CENTRO][DAO][EXITO]");
				outResponse.setRCodigo(rCodigo);
				outResponse.setRMensaje(rMensaje);
			} else {
				log.info("[MODIFICAR TIPO CENTRO][DAO][ERROR]");
				outResponse.setRCodigo(rCodigo);
				outResponse.setRMensaje(rMensaje);
			}
		} catch (Exception e) {
			log.info("[MODIFICAR TIPO CENTRO][DAO][EXCEPCION][" + e.getMessage() + "]");
			outResponse.setRCodigo(500);
			outResponse.setRMensaje(e.getMessage());
		}
		log.info("[MODIFICAR TIPO CENTRO][DAO][FIN]");
		return outResponse;
	}

	@Override
	public OutResponse<?> eliminarTipoCentro(TipoCentroEliminarRequest req) {
		log.info("[ELIMINAR TIPO CENTRO][DAO][INICIO]");
		OutResponse<?> outResponse = new OutResponse<>();

		Integer rCodigo = 0;
		String rMensaje = "";
		try {
			SimpleJdbcCall jdbcCall = new SimpleJdbcCall(dataSource).withSchemaName(ConstanteUtil.BD_SCHEMA_RENI)
					.withCatalogName(ConstanteUtil.BD_PKG_RENI_TIPO_CENTRO).withProcedureName("SP_D_TIPO_CENTRO");

			MapSqlParameterSource in = new MapSqlParameterSource();
			in.addValue("P_NID_TIPO_CENTRO", req.getIdTipoCentro(), Types.NUMERIC);
			in.addValue("P_NID_USUARIO_MODIF", req.getIdUsuarioModif(), Types.NUMERIC);
			in.addValue("P_TXT_PC_MODIF", AdressUtil.getHostname(httpRequest), Types.VARCHAR);
			in.addValue("P_TXT_IP_MODIF", AdressUtil.getIP(httpRequest), Types.VARCHAR);
			log.info("[ELIMINAR TIPO CENTRO][DAO][INPUT PROCEDURE][" + in.toString() + "]");

			Map<String, Object> out = jdbcCall.execute(in);
			log.info("[ELIMINAR TIPO CENTRO][DAO][OUTPUT PROCEDURE][" + out.toString() + "]");

			rCodigo = MapUtil.getInt(out.get(ConstanteUtil.R_CODIGO));
			rMensaje = MapUtil.getString(out.get(ConstanteUtil.R_MENSAJE));

			if (rCodigo == ConstanteUtil.R_COD_EXITO) {
				log.info("[ELIMINAR TIPO CENTRO][DAO][EXITO]");
				outResponse.setRCodigo(rCodigo);
				outResponse.setRMensaje(rMensaje);
			} else {
				log.info("[ELIMINAR TIPO CENTRO][DAO][ERROR]");
				outResponse.setRCodigo(rCodigo);
				outResponse.setRMensaje(rMensaje);
			}
		} catch (Exception e) {
			log.info("[ELIMINAR TIPO CENTRO][DAO][EXCEPCION][" + e.getMessage() + "]");
			outResponse.setRCodigo(500);
			outResponse.setRMensaje(e.getMessage());
		}
		log.info("[ELIMINAR TIPO CENTRO][DAO][FIN]");
		return outResponse;
	}

	@Override
	public OutResponse<List<SubtipoCentroListarResponse>> listarSubtipoCentro(SubtipoCentroListarRequest req) {
		log.info("[LISTAR SUBTIPO CENTRO][DAO][INICIO]");
		OutResponse<List<SubtipoCentroListarResponse>> outResponse = new OutResponse<>();

		Integer rCodigo = 0;
		String rMensaje = "";
		try {
			SimpleJdbcCall jdbcCall = new SimpleJdbcCall(dataSource).withSchemaName(ConstanteUtil.BD_SCHEMA_RENI)
					.withCatalogName(ConstanteUtil.BD_PKG_RENI_TIPO_CENTRO).withProcedureName("SP_L_SUB_TIPO_CENTRO")
					.returningResultSet(ConstanteUtil.R_LISTA, new SubtipoCentroListarResponseMapper());

			MapSqlParameterSource in = new MapSqlParameterSource();
			in.addValue("P_NID_TIPO_CENTRO_PADRE", req.getIdTipoCentroPadre(), Types.NUMERIC);
			in.addValue("P_FLG_ACTIVO", req.getFlgActivo(), Types.NUMERIC);
			log.info("[LISTAR SUBTIPO CENTRO][DAO][INPUT PROCEDURE][" + in.toString() + "]");

			Map<String, Object> out = jdbcCall.execute(in);
			log.info("[LISTAR SUBTIPO CENTRO][DAO][OUTPUT PROCEDURE][" + out.toString() + "]");

			rCodigo = MapUtil.getInt(out.get(ConstanteUtil.R_CODIGO));
			rMensaje = MapUtil.getString(out.get(ConstanteUtil.R_MENSAJE));

			if (rCodigo == ConstanteUtil.R_COD_EXITO) {
				log.info("[LISTAR SUBTIPO CENTRO][DAO][EXITO]");
				List<SubtipoCentroListarResponse> res = MapUtil.getType(out.get(ConstanteUtil.R_LISTA));

				outResponse.setRCodigo(rCodigo);
				outResponse.setRMensaje(rMensaje);
				outResponse.setObjeto(res);
			} else {
				log.info("[LISTAR SUBTIPO CENTRO][DAO][ERROR]");
				outResponse.setRCodigo(rCodigo);
				outResponse.setRMensaje(rMensaje);
			}
		} catch (Exception e) {
			log.info("[LISTAR SUBTIPO CENTRO][DAO][EXCEPCION][" + e.getMessage() + "]");
			outResponse.setRCodigo(500);
			outResponse.setRMensaje(e.getMessage());
		}
		log.info("[LISTAR SUBTIPO CENTRO][DAO][FIN]");
		return outResponse;
	}

	@Override
	public OutResponse<SubtipoCentroRegistrarResponse> registrarSubtipoCentro(SubtipoCentroRegistrarRequest req) {
		log.info("[REGISTRAR SUBTIPO CENTRO][DAO][INICIO]");
		OutResponse<SubtipoCentroRegistrarResponse> outResponse = new OutResponse<>();

		Integer rCodigo = 0;
		String rMensaje = "";
		try {
			SimpleJdbcCall jdbcCall = new SimpleJdbcCall(dataSource).withSchemaName(ConstanteUtil.BD_SCHEMA_RENI)
					.withCatalogName(ConstanteUtil.BD_PKG_RENI_TIPO_CENTRO).withProcedureName("SP_I_SUB_TIPO_CENTRO");

			MapSqlParameterSource in = new MapSqlParameterSource();
			in.addValue("P_NID_TIPO_CENTRO_PADRE", req.getIdTipoCentroPadre(), Types.NUMERIC);
			in.addValue("P_TXT_CODIGO", req.getCodigo(), Types.VARCHAR);
			in.addValue("P_TXT_NOMBRE", req.getNombre(), Types.VARCHAR);
			in.addValue("P_TXT_ABREVIATURA", req.getAbreviatura(), Types.VARCHAR);
			in.addValue("P_TXT_DESCRIPCION", req.getDescripcion(), Types.VARCHAR);
			in.addValue("P_NUM_ORDEN", req.getOrden(), Types.NUMERIC);
			in.addValue("P_NID_USUARIO_CREACION", req.getIdUsuarioCrea(), Types.NUMERIC);
			in.addValue("P_TXT_PC_CREACION", AdressUtil.getHostname(httpRequest), Types.VARCHAR);
			in.addValue("P_TXT_IP_CREACION", AdressUtil.getIP(httpRequest), Types.VARCHAR);
			log.info("[REGISTRAR SUBTIPO CENTRO][DAO][INPUT PROCEDURE][" + in.toString() + "]");

			Map<String, Object> out = jdbcCall.execute(in);
			log.info("[REGISTRAR SUBTIPO CENTRO][DAO][OUTPUT PROCEDURE][" + out.toString() + "]");

			rCodigo = MapUtil.getInt(out.get(ConstanteUtil.R_CODIGO));
			rMensaje = MapUtil.getString(out.get(ConstanteUtil.R_MENSAJE));

			if (rCodigo == ConstanteUtil.R_COD_EXITO) {
				log.info("[REGISTRAR SUBTIPO CENTRO][DAO][EXITO]");
				SubtipoCentroRegistrarResponse res = new SubtipoCentroRegistrarResponse();
				res.setIdSubtipoCentro(MapUtil.getLong(out.get("R_ID")));

				outResponse.setRCodigo(rCodigo);
				outResponse.setRMensaje(rMensaje);
				outResponse.setObjeto(res);
			} else {
				log.info("[REGISTRAR SUBTIPO CENTRO][DAO][ERROR]");
				outResponse.setRCodigo(rCodigo);
				outResponse.setRMensaje(rMensaje);
			}
		} catch (Exception e) {
			log.info("[REGISTRAR SUBTIPO CENTRO][DAO][EXCEPCION][" + e.getMessage() + "]");
			outResponse.setRCodigo(500);
			outResponse.setRMensaje(e.getMessage());
		}
		log.info("[REGISTRAR SUBTIPO CENTRO][DAO][FIN]");
		return outResponse;
	}

	@Override
	public OutResponse<?> modificarSubtipoCentro(SubtipoCentroModificarRequest req) {
		log.info("[MODIFICAR SUBTIPO CENTRO][DAO][INICIO]");
		OutResponse<?> outResponse = new OutResponse<>();

		Integer rCodigo = 0;
		String rMensaje = "";
		try {
			SimpleJdbcCall jdbcCall = new SimpleJdbcCall(dataSource).withSchemaName(ConstanteUtil.BD_SCHEMA_RENI)
					.withCatalogName(ConstanteUtil.BD_PKG_RENI_TIPO_CENTRO).withProcedureName("SP_U_SUB_TIPO_CENTRO");

			MapSqlParameterSource in = new MapSqlParameterSource();
			in.addValue("P_NID_SUB_TIPO_CENTRO", req.getIdSubtipoCentro(), Types.NUMERIC);
			in.addValue("P_TXT_CODIGO", req.getCodigo(), Types.VARCHAR);
			in.addValue("P_TXT_NOMBRE", req.getNombre(), Types.VARCHAR);
			in.addValue("P_TXT_ABREVIATURA", req.getAbreviatura(), Types.VARCHAR);
			in.addValue("P_TXT_DESCRIPCION", req.getDescripcion(), Types.VARCHAR);
			in.addValue("P_NUM_ORDEN", req.getOrden(), Types.NUMERIC);
			in.addValue("P_NID_USUARIO_MODIF", req.getIdUsuarioModif(), Types.NUMERIC);
			in.addValue("P_TXT_PC_MODIF", AdressUtil.getHostname(httpRequest), Types.VARCHAR);
			in.addValue("P_TXT_IP_MODIF", AdressUtil.getIP(httpRequest), Types.VARCHAR);
			log.info("[MODIFICAR SUBTIPO CENTRO][DAO][INPUT PROCEDURE][" + in.toString() + "]");

			Map<String, Object> out = jdbcCall.execute(in);
			log.info("[MODIFICAR SUBTIPO CENTRO][DAO][OUTPUT PROCEDURE][" + out.toString() + "]");

			rCodigo = MapUtil.getInt(out.get(ConstanteUtil.R_CODIGO));
			rMensaje = MapUtil.getString(out.get(ConstanteUtil.R_MENSAJE));

			if (rCodigo == ConstanteUtil.R_COD_EXITO) {
				log.info("[MODIFICAR SUBTIPO CENTRO][DAO][EXITO]");
				outResponse.setRCodigo(rCodigo);
				outResponse.setRMensaje(rMensaje);
			} else {
				log.info("[MODIFICAR SUBTIPO CENTRO][DAO][ERROR]");
				outResponse.setRCodigo(rCodigo);
				outResponse.setRMensaje(rMensaje);
			}
		} catch (Exception e) {
			log.info("[MODIFICAR SUBTIPO CENTRO][DAO][EXCEPCION][" + e.getMessage() + "]");
			outResponse.setRCodigo(500);
			outResponse.setRMensaje(e.getMessage());
		}
		log.info("[MODIFICAR SUBTIPO CENTRO][DAO][FIN]");
		return outResponse;
	}

	@Override
	public OutResponse<?> eliminarSubtipoCentro(SubtipoCentroEliminarRequest req) {
		log.info("[ELIMINAR SUBTIPO CENTRO][DAO][INICIO]");
		OutResponse<?> outResponse = new OutResponse<>();

		Integer rCodigo = 0;
		String rMensaje = "";
		try {
			SimpleJdbcCall jdbcCall = new SimpleJdbcCall(dataSource).withSchemaName(ConstanteUtil.BD_SCHEMA_RENI)
					.withCatalogName(ConstanteUtil.BD_PKG_RENI_TIPO_CENTRO).withProcedureName("SP_D_SUB_TIPO_CENTRO");

			MapSqlParameterSource in = new MapSqlParameterSource();
			in.addValue("P_NID_SUB_TIPO_CENTRO", req.getIdSubtipoCentro(), Types.NUMERIC);
			in.addValue("P_NID_USUARIO_MODIF", req.getIdUsuarioModif(), Types.NUMERIC);
			in.addValue("P_TXT_PC_MODIF", AdressUtil.getHostname(httpRequest), Types.VARCHAR);
			in.addValue("P_TXT_IP_MODIF", AdressUtil.getIP(httpRequest), Types.VARCHAR);
			log.info("[ELIMINAR SUBTIPO CENTRO][DAO][INPUT PROCEDURE][" + in.toString() + "]");

			Map<String, Object> out = jdbcCall.execute(in);
			log.info("[ELIMINAR SUBTIPO CENTRO][DAO][OUTPUT PROCEDURE][" + out.toString() + "]");

			rCodigo = MapUtil.getInt(out.get(ConstanteUtil.R_CODIGO));
			rMensaje = MapUtil.getString(out.get(ConstanteUtil.R_MENSAJE));

			if (rCodigo == ConstanteUtil.R_COD_EXITO) {
				log.info("[ELIMINAR SUBTIPO CENTRO][DAO][EXITO]");
				outResponse.setRCodigo(rCodigo);
				outResponse.setRMensaje(rMensaje);
			} else {
				log.info("[ELIMINAR SUBTIPO CENTRO][DAO][ERROR]");
				outResponse.setRCodigo(rCodigo);
				outResponse.setRMensaje(rMensaje);
			}
		} catch (Exception e) {
			log.info("[ELIMINAR SUBTIPO CENTRO][DAO][EXCEPCION][" + e.getMessage() + "]");
			outResponse.setRCodigo(500);
			outResponse.setRMensaje(e.getMessage());
		}
		log.info("[ELIMINAR SUBTIPO CENTRO][DAO][FIN]");
		return outResponse;
	}

}
