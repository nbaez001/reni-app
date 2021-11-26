package pe.gob.mimp.reni.dao.impl;

import java.sql.Types;
import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;
import javax.sql.DataSource;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.jdbc.core.namedparam.MapSqlParameterSource;
import org.springframework.jdbc.core.simple.SimpleJdbcCall;
import org.springframework.stereotype.Repository;

import pe.gob.mimp.reni.dao.PerfilDao;
import pe.gob.mimp.reni.dto.request.PerfilEliminarRequest;
import pe.gob.mimp.reni.dto.request.PerfilFuncionalidadListarRequest;
import pe.gob.mimp.reni.dto.request.PerfilFuncionalidadPerfListarRequest;
import pe.gob.mimp.reni.dto.request.PerfilListarRequest;
import pe.gob.mimp.reni.dto.request.PerfilModificarRequest;
import pe.gob.mimp.reni.dto.request.PerfilRegistrarRequest;
import pe.gob.mimp.reni.dto.response.OutResponse;
import pe.gob.mimp.reni.dto.response.PerfilFuncionalidadListarResponse;
import pe.gob.mimp.reni.dto.response.PerfilFuncionalidadPerfListarResponse;
import pe.gob.mimp.reni.dto.response.PerfilListarResponse;
import pe.gob.mimp.reni.dto.response.PerfilRegistrarResponse;
import pe.gob.mimp.reni.dto.response.mapper.PerfilFuncionalidadListarResponseMapper;
import pe.gob.mimp.reni.dto.response.mapper.PerfilFuncionalidadPerfListarResponseMapper;
import pe.gob.mimp.reni.dto.response.mapper.PerfilListarResponseMapper;
import pe.gob.mimp.reni.util.AdressUtil;
import pe.gob.mimp.reni.util.ConstanteUtil;
import pe.gob.mimp.reni.util.MapUtil;

@Repository
public class PerfilDaoImpl implements PerfilDao {

	private static final Logger log = LoggerFactory.getLogger(PerfilDaoImpl.class);

	@Autowired
	@Qualifier("dataSourceSeguridad")
	DataSource dataSource;

	@Autowired
	private HttpServletRequest httpRequest;

	@Override
	public OutResponse<List<PerfilListarResponse>> listarPerfil(PerfilListarRequest req) {
		log.info("[LISTAR PERFIL][DAO][INICIO]");
		OutResponse<List<PerfilListarResponse>> outResponse = new OutResponse<>();

		Integer rCodigo = 0;
		String rMensaje = "";
		try {
			SimpleJdbcCall jdbcCall = new SimpleJdbcCall(dataSource).withSchemaName(ConstanteUtil.BD_SCHEMA_SEGURIDAD)
					.withCatalogName(ConstanteUtil.BD_PKG_RENI_AUTENTICACION).withProcedureName("SP_L_PERFIL")
					.returningResultSet(ConstanteUtil.R_LISTA, new PerfilListarResponseMapper());

			MapSqlParameterSource in = new MapSqlParameterSource();
			in.addValue("P_NOM_PERFIL", req.getNomPerfil(), Types.VARCHAR);
			in.addValue("P_ID_MODULO", req.getIdModulo(), Types.NUMERIC);
			in.addValue("P_FLG_ACTIVO", req.getFlgActivo(), Types.NUMERIC);
			log.info("[LISTAR PERFIL][DAO][INPUT PROCEDURE][" + in.toString() + "]");

			Map<String, Object> out = jdbcCall.execute(in);
			log.info("[LISTAR PERFIL][DAO][OUTPUT PROCEDURE][" + out.toString() + "]");

			rCodigo = MapUtil.getInt(out.get(ConstanteUtil.R_CODIGO));
			rMensaje = MapUtil.getString(out.get(ConstanteUtil.R_MENSAJE));

			if (rCodigo == ConstanteUtil.R_COD_EXITO) {
				log.info("[LISTAR PERFIL][DAO][EXITO]");
				List<PerfilListarResponse> res = MapUtil.getType(out.get(ConstanteUtil.R_LISTA));

				outResponse.setRCodigo(rCodigo);
				outResponse.setRMensaje(rMensaje);
				outResponse.setObjeto(res);
			} else {
				log.info("[LISTAR PERFIL][DAO][ERROR]");
				outResponse.setRCodigo(rCodigo);
				outResponse.setRMensaje(rMensaje);
			}
		} catch (Exception e) {
			log.info("[LISTAR PERFIL][DAO][EXCEPCION][" + e.getMessage() + "]");
			outResponse.setRCodigo(500);
			outResponse.setRMensaje(e.getMessage());
		}
		log.info("[LISTAR PERFIL][DAO][FIN]");
		return outResponse;
	}

	@Override
	public OutResponse<PerfilRegistrarResponse> registrarPerfil(PerfilRegistrarRequest req, String lfuncionalidad) {
		log.info("[REGISTRAR PERFIL][DAO][INICIO]");
		OutResponse<PerfilRegistrarResponse> outResponse = new OutResponse<>();

		Integer rCodigo = 0;
		String rMensaje = "";
		try {
			SimpleJdbcCall jdbcCall = new SimpleJdbcCall(dataSource).withSchemaName(ConstanteUtil.BD_SCHEMA_SEGURIDAD)
					.withCatalogName(ConstanteUtil.BD_PKG_RENI_AUTENTICACION).withProcedureName("SP_I_PERFIL");

			MapSqlParameterSource in = new MapSqlParameterSource();
			in.addValue("P_NOM_PERFIL", req.getNomPerfil(), Types.VARCHAR);
			in.addValue("P_ID_MODULO", req.getIdModulo(), Types.NUMERIC);
			in.addValue("P_L_FUNCIONALIDAD", lfuncionalidad, Types.VARCHAR);
			in.addValue("P_NID_USUARIO_CREACION", req.getIdUsuarioCrea(), Types.NUMERIC);
			in.addValue("P_TXT_PC_CREACION", AdressUtil.getHostname(httpRequest), Types.VARCHAR);
			in.addValue("P_TXT_IP_CREACION", AdressUtil.getIP(httpRequest), Types.VARCHAR);
			log.info("[REGISTRAR PERFIL][DAO][INPUT PROCEDURE][" + in.toString() + "]");

			Map<String, Object> out = jdbcCall.execute(in);
			log.info("[REGISTRAR PERFIL][DAO][OUTPUT PROCEDURE][" + out.toString() + "]");

			rCodigo = MapUtil.getInt(out.get(ConstanteUtil.R_CODIGO));
			rMensaje = MapUtil.getString(out.get(ConstanteUtil.R_MENSAJE));

			if (rCodigo == ConstanteUtil.R_COD_EXITO) {
				log.info("[REGISTRAR PERFIL][DAO][EXITO]");
				PerfilRegistrarResponse res = new PerfilRegistrarResponse();
				res.setIdPerfil(MapUtil.getLong(out.get("R_ID")));

				outResponse.setRCodigo(rCodigo);
				outResponse.setRMensaje(rMensaje);
				outResponse.setObjeto(res);
			} else {
				log.info("[REGISTRAR PERFIL][DAO][ERROR]");
				outResponse.setRCodigo(rCodigo);
				outResponse.setRMensaje(rMensaje);
			}
		} catch (Exception e) {
			log.info("[REGISTRAR PERFIL][DAO][EXCEPCION][" + e.getMessage() + "]");
			outResponse.setRCodigo(500);
			outResponse.setRMensaje(e.getMessage());
		}
		log.info("[REGISTRAR PERFIL][DAO][FIN]");
		return outResponse;
	}

	@Override
	public OutResponse<?> modificarPerfil(PerfilModificarRequest req, String lfuncionalidad, String lfuncionalidadMod) {
		log.info("[MODIFICAR PERFIL][DAO][INICIO]");
		OutResponse<?> outResponse = new OutResponse<>();

		Integer rCodigo = 0;
		String rMensaje = "";
		try {
			SimpleJdbcCall jdbcCall = new SimpleJdbcCall(dataSource).withSchemaName(ConstanteUtil.BD_SCHEMA_SEGURIDAD)
					.withCatalogName(ConstanteUtil.BD_PKG_RENI_AUTENTICACION).withProcedureName("SP_U_PERFIL");

			MapSqlParameterSource in = new MapSqlParameterSource();
			in.addValue("P_ID_PERFIL", req.getIdPerfil(), Types.NUMERIC);
			in.addValue("P_NOM_PERFIL", req.getNomPerfil(), Types.VARCHAR);
			in.addValue("P_L_FUNCIONALIDAD", lfuncionalidad, Types.VARCHAR);
			in.addValue("P_L_FUNCIONALIDAD_MOD", lfuncionalidadMod, Types.VARCHAR);
			in.addValue("P_NID_USUARIO_MODIF", req.getIdUsuarioModif(), Types.NUMERIC);
			in.addValue("P_TXT_PC_MODIF", AdressUtil.getHostname(httpRequest), Types.VARCHAR);
			in.addValue("P_TXT_IP_MODIF", AdressUtil.getIP(httpRequest), Types.VARCHAR);
			log.info("[MODIFICAR PERFIL][DAO][INPUT PROCEDURE][" + in.toString() + "]");

			Map<String, Object> out = jdbcCall.execute(in);
			log.info("[MODIFICAR PERFIL][DAO][OUTPUT PROCEDURE][" + out.toString() + "]");

			rCodigo = MapUtil.getInt(out.get(ConstanteUtil.R_CODIGO));
			rMensaje = MapUtil.getString(out.get(ConstanteUtil.R_MENSAJE));

			if (rCodigo == ConstanteUtil.R_COD_EXITO) {
				log.info("[MODIFICAR PERFIL][DAO][EXITO]");
				outResponse.setRCodigo(rCodigo);
				outResponse.setRMensaje(rMensaje);
			} else {
				log.info("[MODIFICAR PERFIL][DAO][ERROR]");
				outResponse.setRCodigo(rCodigo);
				outResponse.setRMensaje(rMensaje);
			}
		} catch (Exception e) {
			log.info("[MODIFICAR PERFIL][DAO][EXCEPCION][" + e.getMessage() + "]");
			outResponse.setRCodigo(500);
			outResponse.setRMensaje(e.getMessage());
		}
		log.info("[MODIFICAR PERFIL][DAO][FIN]");
		return outResponse;
	}

	@Override
	public OutResponse<?> eliminarPerfil(PerfilEliminarRequest req) {
		log.info("[ELIMINAR PERFIL][DAO][INICIO]");
		OutResponse<?> outResponse = new OutResponse<>();

		Integer rCodigo = 0;
		String rMensaje = "";
		try {
			SimpleJdbcCall jdbcCall = new SimpleJdbcCall(dataSource).withSchemaName(ConstanteUtil.BD_SCHEMA_SEGURIDAD)
					.withCatalogName(ConstanteUtil.BD_PKG_RENI_AUTENTICACION).withProcedureName("SP_D_PERFIL");

			MapSqlParameterSource in = new MapSqlParameterSource();
			in.addValue("P_NID_PERFIL", req.getIdPerfil(), Types.NUMERIC);
			in.addValue("P_NID_USUARIO_MODIF", req.getIdUsuarioModif(), Types.NUMERIC);
			in.addValue("P_TXT_PC_MODIF", AdressUtil.getHostname(httpRequest), Types.VARCHAR);
			in.addValue("P_TXT_IP_MODIF", AdressUtil.getIP(httpRequest), Types.VARCHAR);
			log.info("[ELIMINAR PERFIL][DAO][INPUT PROCEDURE][" + in.toString() + "]");

			Map<String, Object> out = jdbcCall.execute(in);
			log.info("[ELIMINAR PERFIL][DAO][OUTPUT PROCEDURE][" + out.toString() + "]");

			rCodigo = MapUtil.getInt(out.get(ConstanteUtil.R_CODIGO));
			rMensaje = MapUtil.getString(out.get(ConstanteUtil.R_MENSAJE));

			if (rCodigo == ConstanteUtil.R_COD_EXITO) {
				log.info("[ELIMINAR PERFIL][DAO][EXITO]");
				outResponse.setRCodigo(rCodigo);
				outResponse.setRMensaje(rMensaje);
			} else {
				log.info("[ELIMINAR PERFIL][DAO][ERROR]");
				outResponse.setRCodigo(rCodigo);
				outResponse.setRMensaje(rMensaje);
			}
		} catch (Exception e) {
			log.info("[ELIMINAR PERFIL][DAO][EXCEPCION][" + e.getMessage() + "]");
			outResponse.setRCodigo(500);
			outResponse.setRMensaje(e.getMessage());
		}
		log.info("[ELIMINAR PERFIL][DAO][FIN]");
		return outResponse;
	}

	@Override
	public OutResponse<List<PerfilFuncionalidadListarResponse>> listarFuncionalidad(
			PerfilFuncionalidadListarRequest req) {
		log.info("[LISTAR FUNCIONALIDAD][DAO][INICIO]");
		OutResponse<List<PerfilFuncionalidadListarResponse>> outResponse = new OutResponse<>();

		Integer rCodigo = 0;
		String rMensaje = "";
		try {
			SimpleJdbcCall jdbcCall = new SimpleJdbcCall(dataSource).withSchemaName(ConstanteUtil.BD_SCHEMA_SEGURIDAD)
					.withCatalogName(ConstanteUtil.BD_PKG_RENI_AUTENTICACION).withProcedureName("SP_L_FUNCIONALIDAD")
					.returningResultSet(ConstanteUtil.R_LISTA, new PerfilFuncionalidadListarResponseMapper());

			MapSqlParameterSource in = new MapSqlParameterSource();
			in.addValue("P_ID_MODULO", req.getIdModulo(), Types.NUMERIC);
			log.info("[LISTAR FUNCIONALIDAD][DAO][INPUT PROCEDURE][" + in.toString() + "]");

			Map<String, Object> out = jdbcCall.execute(in);
			log.info("[LISTAR FUNCIONALIDAD][DAO][OUTPUT PROCEDURE][" + out.toString() + "]");

			rCodigo = MapUtil.getInt(out.get(ConstanteUtil.R_CODIGO));
			rMensaje = MapUtil.getString(out.get(ConstanteUtil.R_MENSAJE));

			if (rCodigo == ConstanteUtil.R_COD_EXITO) {
				log.info("[LISTAR FUNCIONALIDAD][DAO][EXITO]");
				List<PerfilFuncionalidadListarResponse> res = MapUtil.getType(out.get(ConstanteUtil.R_LISTA));

				outResponse.setRCodigo(rCodigo);
				outResponse.setRMensaje(rMensaje);
				outResponse.setObjeto(res);
			} else {
				log.info("[LISTAR FUNCIONALIDAD][DAO][ERROR]");
				outResponse.setRCodigo(rCodigo);
				outResponse.setRMensaje(rMensaje);
			}
		} catch (Exception e) {
			log.info("[LISTAR FUNCIONALIDAD][DAO][EXCEPCION][" + e.getMessage() + "]");
			outResponse.setRCodigo(500);
			outResponse.setRMensaje(e.getMessage());
		}
		log.info("[LISTAR FUNCIONALIDAD][DAO][FIN]");
		return outResponse;
	}

	@Override
	public OutResponse<List<PerfilFuncionalidadPerfListarResponse>> listarFuncionalidadPerfil(
			PerfilFuncionalidadPerfListarRequest req) {
		log.info("[LISTAR FUNCIONALIDAD PERFIL][DAO][INICIO]");
		OutResponse<List<PerfilFuncionalidadPerfListarResponse>> outResponse = new OutResponse<>();

		Integer rCodigo = 0;
		String rMensaje = "";
		try {
			SimpleJdbcCall jdbcCall = new SimpleJdbcCall(dataSource).withSchemaName(ConstanteUtil.BD_SCHEMA_SEGURIDAD)
					.withCatalogName(ConstanteUtil.BD_PKG_RENI_AUTENTICACION)
					.withProcedureName("SP_L_FUNCIONALIDAD_PERFIL")
					.returningResultSet(ConstanteUtil.R_LISTA, new PerfilFuncionalidadPerfListarResponseMapper());

			MapSqlParameterSource in = new MapSqlParameterSource();
			in.addValue("P_ID_PERFIL", req.getIdPerfil(), Types.NUMERIC);
			in.addValue("P_ID_MODULO", req.getIdModulo(), Types.NUMERIC);
			log.info("[LISTAR FUNCIONALIDAD PERFIL][DAO][INPUT PROCEDURE][" + in.toString() + "]");

			Map<String, Object> out = jdbcCall.execute(in);
			log.info("[LISTAR FUNCIONALIDAD PERFIL][DAO][OUTPUT PROCEDURE][" + out.toString() + "]");

			rCodigo = MapUtil.getInt(out.get(ConstanteUtil.R_CODIGO));
			rMensaje = MapUtil.getString(out.get(ConstanteUtil.R_MENSAJE));

			if (rCodigo == ConstanteUtil.R_COD_EXITO) {
				log.info("[LISTAR FUNCIONALIDAD PERFIL][DAO][EXITO]");
				List<PerfilFuncionalidadPerfListarResponse> res = MapUtil.getType(out.get(ConstanteUtil.R_LISTA));

				outResponse.setRCodigo(rCodigo);
				outResponse.setRMensaje(rMensaje);
				outResponse.setObjeto(res);
			} else {
				log.info("[LISTAR FUNCIONALIDAD PERFIL][DAO][ERROR]");
				outResponse.setRCodigo(rCodigo);
				outResponse.setRMensaje(rMensaje);
			}
		} catch (Exception e) {
			log.info("[LISTAR FUNCIONALIDAD PERFIL][DAO][EXCEPCION][" + e.getMessage() + "]");
			outResponse.setRCodigo(500);
			outResponse.setRMensaje(e.getMessage());
		}
		log.info("[LISTAR FUNCIONALIDAD PERFIL][DAO][FIN]");
		return outResponse;
	}
}
