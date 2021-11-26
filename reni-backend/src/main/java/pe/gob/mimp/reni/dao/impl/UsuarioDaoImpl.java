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

import pe.gob.mimp.reni.dao.UsuarioDao;
import pe.gob.mimp.reni.dto.request.UsuarioAsociarRequest;
import pe.gob.mimp.reni.dto.request.UsuarioBuscarRequest;
import pe.gob.mimp.reni.dto.request.UsuarioEliminarRequest;
import pe.gob.mimp.reni.dto.request.UsuarioListarRequest;
import pe.gob.mimp.reni.dto.request.UsuarioModificarRequest;
import pe.gob.mimp.reni.dto.response.UsuarioListarResponse;
import pe.gob.mimp.reni.dto.response.OutResponse;
import pe.gob.mimp.reni.dto.response.UsuarioBuscarResponse;
import pe.gob.mimp.reni.dto.response.mapper.UsuarioListarResponseMapper;
import pe.gob.mimp.reni.util.AdressUtil;
import pe.gob.mimp.reni.util.ConstanteUtil;
import pe.gob.mimp.reni.util.DateUtil;
import pe.gob.mimp.reni.util.MapUtil;

@Repository
public class UsuarioDaoImpl implements UsuarioDao {

	private static final Logger log = LoggerFactory.getLogger(UsuarioDaoImpl.class);

	@Autowired
	DataSource dataSource;

	@Autowired
	private HttpServletRequest httpRequest;

	@Override
	public OutResponse<List<UsuarioListarResponse>> listarUsuario(UsuarioListarRequest req) {
		log.info("[LISTAR USUARIO][DAO][INICIO]");
		OutResponse<List<UsuarioListarResponse>> outResponse = new OutResponse<>();

		Integer rCodigo = 0;
		String rMensaje = "";
		try {
			SimpleJdbcCall jdbcCall = new SimpleJdbcCall(dataSource).withSchemaName(ConstanteUtil.BD_SCHEMA_RENI)
					.withCatalogName(ConstanteUtil.BD_PKG_RENI_USUARIO).withProcedureName("SP_L_USUARIO")
					.returningResultSet(ConstanteUtil.R_LISTA, new UsuarioListarResponseMapper());

			MapSqlParameterSource in = new MapSqlParameterSource();
			in.addValue("P_FLG_ACTIVO", req.getFlgActivo(), Types.NUMERIC);
			in.addValue("P_IDT_TIENE_DOC", req.getIdtTieneDoc(), Types.VARCHAR);
			in.addValue("P_FEC_INICIO", DateUtil.formatDateToString(req.getFecInicio(), ConstanteUtil.slash_ddMMyyyy),
					Types.VARCHAR);
			in.addValue("P_FEC_FIN", DateUtil.formatDateToString(req.getFecFin(), ConstanteUtil.slash_ddMMyyyy),
					Types.VARCHAR);
			log.info("[LISTAR USUARIO][DAO][INPUT PROCEDURE][" + in.toString() + "]");

			Map<String, Object> out = jdbcCall.execute(in);
			log.info("[LISTAR USUARIO][DAO][OUTPUT PROCEDURE][" + out.toString() + "]");

			rCodigo = MapUtil.getInt(out.get(ConstanteUtil.R_CODIGO));
			rMensaje = MapUtil.getString(out.get(ConstanteUtil.R_MENSAJE));

			if (rCodigo == ConstanteUtil.R_COD_EXITO) {
				log.info("[LISTAR USUARIO][DAO][EXITO]");
				List<UsuarioListarResponse> res = MapUtil.getType(out.get(ConstanteUtil.R_LISTA));

				outResponse.setRCodigo(rCodigo);
				outResponse.setRMensaje(rMensaje);
				outResponse.setObjeto(res);
			} else {
				log.info("[LISTAR USUARIO][DAO][ERROR]");
				outResponse.setRCodigo(rCodigo);
				outResponse.setRMensaje(rMensaje);
			}
		} catch (Exception e) {
			log.info("[LISTAR USUARIO][DAO][EXCEPCION][" + e.getMessage() + "]");
			outResponse.setRCodigo(500);
			outResponse.setRMensaje(e.getMessage());
		}
		log.info("[LISTAR USUARIO][DAO][FIN]");
		return outResponse;
	}

	@Override
	public OutResponse<?> modificarUsuario(UsuarioModificarRequest req) {
		log.info("[MODIFICAR USUARIO][DAO][INICIO]");
		OutResponse<?> outResponse = new OutResponse<>();

		Integer rCodigo = 0;
		String rMensaje = "";
		try {
			SimpleJdbcCall jdbcCall = new SimpleJdbcCall(dataSource).withSchemaName(ConstanteUtil.BD_SCHEMA_RENI)
					.withCatalogName(ConstanteUtil.BD_PKG_RENI_USUARIO).withProcedureName("SP_U_USUARIO");

			MapSqlParameterSource in = new MapSqlParameterSource();
			in.addValue("P_NID_USUARIO", req.getIdUsuario(), Types.NUMERIC);
			in.addValue("P_IDT_TIE_DOC_IDENT", req.getIdtTieneDocIdent(), Types.VARCHAR);
			in.addValue("P_IDT_TIPO_DOCUMENTO", req.getIdtTipoDocumento(), Types.VARCHAR);
			in.addValue("P_NRO_DOCUMENTO", req.getNroDocumento(), Types.VARCHAR);
			in.addValue("P_NOMBRE", req.getNombre(), Types.VARCHAR);
			in.addValue("P_APE_PATERNO", req.getApePaterno(), Types.VARCHAR);
			in.addValue("P_APE_MATERNO", req.getApeMaterno(), Types.VARCHAR);
			in.addValue("P_SEXO", req.getSexo(), Types.VARCHAR);
			in.addValue("P_FEC_NACIMIENO",
					DateUtil.formatDateToString(req.getFecNacimiento(), ConstanteUtil.slash_ddMMyyyy), Types.VARCHAR);
			in.addValue("P_NID_USUARIO_MODIF", req.getIdUsuarioModif(), Types.NUMERIC);
			in.addValue("P_TXT_PC_MODIF", AdressUtil.getHostname(httpRequest), Types.VARCHAR);
			in.addValue("P_TXT_IP_MODIF", AdressUtil.getIP(httpRequest), Types.VARCHAR);
			log.info("[MODIFICAR USUARIO][DAO][INPUT PROCEDURE][" + in.toString() + "]");

			Map<String, Object> out = jdbcCall.execute(in);
			log.info("[MODIFICAR USUARIO][DAO][OUTPUT PROCEDURE][" + out.toString() + "]");

			rCodigo = MapUtil.getInt(out.get(ConstanteUtil.R_CODIGO));
			rMensaje = MapUtil.getString(out.get(ConstanteUtil.R_MENSAJE));

			if (rCodigo == ConstanteUtil.R_COD_EXITO) {
				log.info("[MODIFICAR USUARIO][DAO][EXITO]");
				outResponse.setRCodigo(rCodigo);
				outResponse.setRMensaje(rMensaje);
			} else {
				log.info("[MODIFICAR USUARIO][DAO][ERROR]");
				outResponse.setRCodigo(rCodigo);
				outResponse.setRMensaje(rMensaje);
			}
		} catch (Exception e) {
			log.info("[MODIFICAR USUARIO][DAO][EXCEPCION][" + e.getMessage() + "]");
			outResponse.setRCodigo(500);
			outResponse.setRMensaje(e.getMessage());
		}
		log.info("[MODIFICAR USUARIO][DAO][FIN]");
		return outResponse;
	}

	@Override
	public OutResponse<?> eliminarUsuario(UsuarioEliminarRequest req) {
		log.info("[ELIMINAR USUARIO][DAO][INICIO]");
		OutResponse<?> outResponse = new OutResponse<>();

		Integer rCodigo = 0;
		String rMensaje = "";
		try {
			SimpleJdbcCall jdbcCall = new SimpleJdbcCall(dataSource).withSchemaName(ConstanteUtil.BD_SCHEMA_RENI)
					.withCatalogName(ConstanteUtil.BD_PKG_RENI_USUARIO).withProcedureName("SP_D_USUARIO");

			MapSqlParameterSource in = new MapSqlParameterSource();
			in.addValue("P_NID_USUARIO", req.getIdUsuario(), Types.NUMERIC);
			in.addValue("P_NID_USUARIO_MODIF", req.getIdUsuarioModif(), Types.NUMERIC);
			in.addValue("P_TXT_PC_MODIF", AdressUtil.getHostname(httpRequest), Types.VARCHAR);
			in.addValue("P_TXT_IP_MODIF", AdressUtil.getIP(httpRequest), Types.VARCHAR);
			log.info("[ELIMINAR USUARIO][DAO][INPUT PROCEDURE][" + in.toString() + "]");

			Map<String, Object> out = jdbcCall.execute(in);
			log.info("[ELIMINAR USUARIO][DAO][OUTPUT PROCEDURE][" + out.toString() + "]");

			rCodigo = MapUtil.getInt(out.get(ConstanteUtil.R_CODIGO));
			rMensaje = MapUtil.getString(out.get(ConstanteUtil.R_MENSAJE));

			if (rCodigo == ConstanteUtil.R_COD_EXITO) {
				log.info("[ELIMINAR USUARIO][DAO][EXITO]");
				outResponse.setRCodigo(rCodigo);
				outResponse.setRMensaje(rMensaje);
			} else {
				log.info("[ELIMINAR USUARIO][DAO][ERROR]");
				outResponse.setRCodigo(rCodigo);
				outResponse.setRMensaje(rMensaje);
			}
		} catch (Exception e) {
			log.info("[ELIMINAR USUARIO][DAO][EXCEPCION][" + e.getMessage() + "]");
			outResponse.setRCodigo(500);
			outResponse.setRMensaje(e.getMessage());
		}
		log.info("[ELIMINAR USUARIO][DAO][FIN]");
		return outResponse;
	}

	@Override
	public OutResponse<UsuarioBuscarResponse> buscarUsuario(UsuarioBuscarRequest req) {
		log.info("[BUSCAR USUARIO][DAO][INICIO]");
		OutResponse<UsuarioBuscarResponse> outResponse = new OutResponse<>();

		Integer rCodigo = 0;
		String rMensaje = "";
		try {
			SimpleJdbcCall jdbcCall = new SimpleJdbcCall(dataSource).withSchemaName(ConstanteUtil.BD_SCHEMA_RENI)
					.withCatalogName(ConstanteUtil.BD_PKG_RENI_USUARIO).withProcedureName("SP_S_USUARIO");

			MapSqlParameterSource in = new MapSqlParameterSource();
			in.addValue("P_IDT_TIPO_DOCUMENTO", req.getIdtTipoDocumento(), Types.VARCHAR);
			in.addValue("P_NRO_DOCUMENTO", req.getNroDocumento(), Types.VARCHAR);
			log.info("[BUSCAR USUARIO][DAO][INPUT PROCEDURE][" + in.toString() + "]");

			Map<String, Object> out = jdbcCall.execute(in);
			log.info("[BUSCAR USUARIO][DAO][OUTPUT PROCEDURE][" + out.toString() + "]");

			rCodigo = MapUtil.getInt(out.get(ConstanteUtil.R_CODIGO));
			rMensaje = MapUtil.getString(out.get(ConstanteUtil.R_MENSAJE));

			if (rCodigo == ConstanteUtil.R_COD_EXITO) {
				log.info("[BUSCAR USUARIO][DAO][EXITO]");
				UsuarioBuscarResponse res = new UsuarioBuscarResponse();
				res.setIdUsuario(MapUtil.getLong(out.get("R_NID_USUARIO")));
				res.setNombre(MapUtil.getString(out.get("R_NOMBRE")));
				res.setApePaterno(MapUtil.getString(out.get("R_APE_PATERNO")));
				res.setApeMaterno(MapUtil.getString(out.get("R_APE_MATERNO")));
				res.setSexo(MapUtil.getString(out.get("R_SEXO")));

				outResponse.setRCodigo(rCodigo);
				outResponse.setRMensaje(rMensaje);
				outResponse.setObjeto(res);
			} else {
				log.info("[BUSCAR USUARIO][DAO][ERROR]");
				outResponse.setRCodigo(rCodigo);
				outResponse.setRMensaje(rMensaje);
			}
		} catch (Exception e) {
			log.info("[BUSCAR USUARIO][DAO][EXCEPCION][" + e.getMessage() + "]");
			outResponse.setRCodigo(500);
			outResponse.setRMensaje(e.getMessage());
		}
		log.info("[BUSCAR USUARIO][DAO][FIN]");
		return outResponse;
	}

	@Override
	public OutResponse<?> asociarUsuario(UsuarioAsociarRequest req) {
		log.info("[ASOCIAR USUARIO][DAO][INICIO]");
		OutResponse<?> outResponse = new OutResponse<>();

		Integer rCodigo = 0;
		String rMensaje = "";
		try {
			SimpleJdbcCall jdbcCall = new SimpleJdbcCall(dataSource).withSchemaName(ConstanteUtil.BD_SCHEMA_RENI)
					.withCatalogName(ConstanteUtil.BD_PKG_RENI_USUARIO).withProcedureName("SP_I_ASOCIAR_USUARIO");

			MapSqlParameterSource in = new MapSqlParameterSource();
			in.addValue("P_NID_USUARIO_HIST", req.getIdUsuarioHist(), Types.NUMERIC);
			in.addValue("P_NID_USUARIO", req.getIdUsuario(), Types.NUMERIC);
			in.addValue("P_NID_USUARIO_CREACION", req.getIdUsuarioCrea(), Types.NUMERIC);
			in.addValue("P_TXT_PC_CREACION", AdressUtil.getHostname(httpRequest), Types.VARCHAR);
			in.addValue("P_TXT_IP_CREACION", AdressUtil.getIP(httpRequest), Types.VARCHAR);
			log.info("[ASOCIAR USUARIO][DAO][INPUT PROCEDURE][" + in.toString() + "]");

			Map<String, Object> out = jdbcCall.execute(in);
			log.info("[ASOCIAR USUARIO][DAO][OUTPUT PROCEDURE][" + out.toString() + "]");

			rCodigo = MapUtil.getInt(out.get(ConstanteUtil.R_CODIGO));
			rMensaje = MapUtil.getString(out.get(ConstanteUtil.R_MENSAJE));

			if (rCodigo == ConstanteUtil.R_COD_EXITO) {
				log.info("[ASOCIAR USUARIO][DAO][EXITO]");
				outResponse.setRCodigo(rCodigo);
				outResponse.setRMensaje(rMensaje);
			} else {
				log.info("[ASOCIAR USUARIO][DAO][ERROR]");
				outResponse.setRCodigo(rCodigo);
				outResponse.setRMensaje(rMensaje);
			}
		} catch (Exception e) {
			log.info("[ASOCIAR USUARIO][DAO][EXCEPCION][" + e.getMessage() + "]");
			outResponse.setRCodigo(500);
			outResponse.setRMensaje(e.getMessage());
		}
		log.info("[ASOCIAR USUARIO][DAO][FIN]");
		return outResponse;
	}
}
