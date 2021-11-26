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
import pe.gob.mimp.reni.dto.response.OutResponse;
import pe.gob.mimp.reni.dto.response.mapper.CuentaSistemaListarResponseMapper;
import pe.gob.mimp.reni.dto.response.mapper.CuentaSistemaUsuarioSeguridadBuscarServiciosResponseMapper;
import pe.gob.mimp.reni.util.AdressUtil;
import pe.gob.mimp.reni.util.ConstanteUtil;
import pe.gob.mimp.reni.util.DateUtil;
import pe.gob.mimp.reni.util.MapUtil;

@Repository
public class CuentaSistemaDaoImpl implements CuentaSistemaDao {

	private static final Logger log = LoggerFactory.getLogger(CuentaSistemaDaoImpl.class);

	@Autowired
	DataSource dataSource;

	@Autowired
	@Qualifier("dataSourceSeguridad")
	DataSource dataSourceSeguridad;

	@Autowired
	private HttpServletRequest httpRequest;

	@Override
	public OutResponse<List<CuentaSistemaListarResponse>> listarCuentaSistema(CuentaSistemaListarRequest req) {
		log.info("[LISTAR CUENTA SISTEMA][DAO][INICIO]");
		OutResponse<List<CuentaSistemaListarResponse>> outResponse = new OutResponse<>();

		Integer rCodigo = 0;
		String rMensaje = "";
		try {
			SimpleJdbcCall jdbcCall = new SimpleJdbcCall(dataSourceSeguridad)
					.withSchemaName(ConstanteUtil.BD_SCHEMA_SEGURIDAD)
					.withCatalogName(ConstanteUtil.BD_PKG_RENI_AUTENTICACION).withProcedureName("SP_L_CUENTA_SISTEMA")
					.returningResultSet(ConstanteUtil.R_LISTA, new CuentaSistemaListarResponseMapper());

			MapSqlParameterSource in = new MapSqlParameterSource();
			in.addValue("P_FLG_ACTIVO", req.getFlgActivo(), Types.NUMERIC);
			in.addValue("P_NOMBRE", req.getNombre(), Types.VARCHAR);
			in.addValue("P_NRO_DOCUMENTO", req.getNroDocumento(), Types.VARCHAR);
			in.addValue("P_ID_MODULO", req.getIdModulo(), Types.NUMERIC);
			log.info("[LISTAR CUENTA SISTEMA][DAO][INPUT PROCEDURE][" + in.toString() + "]");

			Map<String, Object> out = jdbcCall.execute(in);
			log.info("[LISTAR CUENTA SISTEMA][DAO][OUTPUT PROCEDURE][" + out.toString() + "]");

			rCodigo = MapUtil.getInt(out.get(ConstanteUtil.R_CODIGO));
			rMensaje = MapUtil.getString(out.get(ConstanteUtil.R_MENSAJE));

			if (rCodigo == ConstanteUtil.R_COD_EXITO) {
				log.info("[LISTAR CUENTA SISTEMA][DAO][EXITO]");
				List<CuentaSistemaListarResponse> res = MapUtil.getType(out.get(ConstanteUtil.R_LISTA));

				outResponse.setRCodigo(rCodigo);
				outResponse.setRMensaje(rMensaje);
				outResponse.setObjeto(res);
			} else {
				log.info("[LISTAR CUENTA SISTEMA][DAO][ERROR]");
				outResponse.setRCodigo(rCodigo);
				outResponse.setRMensaje(rMensaje);
			}
		} catch (Exception e) {
			log.info("[LISTAR CUENTA SISTEMA][DAO][EXCEPCION][" + e.getMessage() + "]");
			outResponse.setRCodigo(500);
			outResponse.setRMensaje(e.getMessage());
		}
		log.info("[LISTAR CUENTA SISTEMA][DAO][FIN]");
		return outResponse;
	}

	@Override
	public OutResponse<CuentaSistemaRegistrarResponse> registrarCuentaSistema(CuentaSistemaRegistrarRequest req,
			String listaServicio) {
		log.info("[REGISTRAR CUENTA SISTEMA][DAO][INICIO]");
		OutResponse<CuentaSistemaRegistrarResponse> outResponse = new OutResponse<>();

		Integer rCodigo = 0;
		String rMensaje = "";
		try {
			SimpleJdbcCall jdbcCall = new SimpleJdbcCall(dataSourceSeguridad)
					.withSchemaName(ConstanteUtil.BD_SCHEMA_SEGURIDAD)
					.withCatalogName(ConstanteUtil.BD_PKG_RENI_AUTENTICACION).withProcedureName("SP_I_CUENTA_SISTEMA");

			MapSqlParameterSource in = new MapSqlParameterSource();
			in.addValue("P_NID_PERSONA", req.getIdPersona(), Types.NUMERIC);
			in.addValue("P_TIPO_DOCUMENTO", req.getTipoDocumento(), Types.NUMERIC);
			in.addValue("P_NRO_DOCUMENTO", req.getNroDocumento(), Types.VARCHAR);
			in.addValue("P_NOMBRES", req.getNombres(), Types.VARCHAR);
			in.addValue("P_APE_PATERNO", req.getApePaterno(), Types.VARCHAR);
			in.addValue("P_APE_MATERNO", req.getApeMaterno(), Types.VARCHAR);
			in.addValue("P_FEC_NACIMIENTO",
					DateUtil.formatDateToString(req.getFecNacimiento(), ConstanteUtil.slash_ddMMyyyy), Types.VARCHAR);
			in.addValue("P_SEXO", req.getSexo(), Types.VARCHAR);
			in.addValue("P_NID_AREA", req.getIdArea(), Types.NUMERIC);
			in.addValue("P_NID_CARGO", req.getIdCargo(), Types.NUMERIC);
			in.addValue("P_USUARIO", req.getUsuario(), Types.VARCHAR);
			in.addValue("P_CONTRASENIA", req.getContrasenia(), Types.VARCHAR);
			in.addValue("P_NID_PERFIL", req.getIdPerfil(), Types.NUMERIC);
			in.addValue("P_NID_USUARIO_CREACION", req.getIdUsuarioCrea(), Types.NUMERIC);
			in.addValue("P_TXT_PC_CREACION", AdressUtil.getHostname(httpRequest), Types.VARCHAR);
			in.addValue("P_TXT_IP_CREACION", AdressUtil.getIP(httpRequest), Types.VARCHAR);
			log.info("[REGISTRAR CUENTA SISTEMA][DAO][INPUT PROCEDURE][" + in.toString() + "]");

			Map<String, Object> out = jdbcCall.execute(in);
			log.info("[REGISTRAR CUENTA SISTEMA][DAO][OUTPUT PROCEDURE][" + out.toString() + "]");

			rCodigo = MapUtil.getInt(out.get(ConstanteUtil.R_CODIGO));
			rMensaje = MapUtil.getString(out.get(ConstanteUtil.R_MENSAJE));

			if (rCodigo == ConstanteUtil.R_COD_EXITO) {
				log.info("[REGISTRAR CUENTA SISTEMA][DAO][EXITO]");
				CuentaSistemaRegistrarResponse res = new CuentaSistemaRegistrarResponse();
				res.setIdUsuario(MapUtil.getLong(out.get("R_ID")));
				res.setIdPersona(MapUtil.getLong(out.get("R_ID_PERSONA")));

				rCodigo = registrarCuentaSistemaServicios(res.getIdUsuario(), req.getFlgReporteDisociado(),
						listaServicio, req.getIdUsuarioCrea());
				if (rCodigo != ConstanteUtil.R_COD_EXITO) {
					rCodigo = -100;
					rMensaje = "Ocurrio un error al asociar los servicios a los que tiene acceso el Usuario";
				}

				outResponse.setRCodigo(rCodigo);
				outResponse.setRMensaje(rMensaje);
				outResponse.setObjeto(res);
			} else {
				log.info("[REGISTRAR CUENTA SISTEMA][DAO][ERROR]");
				outResponse.setRCodigo(rCodigo);
				outResponse.setRMensaje(rMensaje);
			}
		} catch (Exception e) {
			log.info("[REGISTRAR CUENTA SISTEMA][DAO][EXCEPCION][" + e.getMessage() + "]");
			outResponse.setRCodigo(500);
			outResponse.setRMensaje(e.getMessage());
		}
		log.info("[REGISTRAR CUENTA SISTEMA][DAO][FIN]");
		return outResponse;
	}

	public Integer registrarCuentaSistemaServicios(Long idUsuario, Integer flgReporteDisociado, String listaServicio,
			Long idUsuarioCrea) {
		log.info("[REGISTRAR CUENTA SISTEMA SERVICIO][DAO][INICIO]");

		Integer rCodigo = 0;
		try {
			SimpleJdbcCall jdbcCall = new SimpleJdbcCall(dataSource).withSchemaName(ConstanteUtil.BD_SCHEMA_RENI)
					.withCatalogName(ConstanteUtil.BD_PKG_RENI_CUENTA_SISTEMA)
					.withProcedureName("SP_I_CUENTA_SISTEMA_SERV");

			MapSqlParameterSource in = new MapSqlParameterSource();
			in.addValue("P_ID_USUARIO", idUsuario, Types.NUMERIC);
			in.addValue("P_FLG_REPORTE_DISOC", flgReporteDisociado, Types.NUMERIC);
			in.addValue("P_L_SERVICIO", listaServicio, Types.VARCHAR);
			in.addValue("P_NID_USUARIO_CREACION", idUsuarioCrea, Types.NUMERIC);
			in.addValue("P_TXT_PC_CREACION", AdressUtil.getHostname(httpRequest), Types.VARCHAR);
			in.addValue("P_TXT_IP_CREACION", AdressUtil.getIP(httpRequest), Types.VARCHAR);
			log.info("[REGISTRAR CUENTA SISTEMA][DAO][INPUT PROCEDURE][" + in.toString() + "]");

			Map<String, Object> out = jdbcCall.execute(in);
			log.info("[REGISTRAR CUENTA SISTEMA][DAO][OUTPUT PROCEDURE][" + out.toString() + "]");

			rCodigo = MapUtil.getInt(out.get(ConstanteUtil.R_CODIGO));

			if (rCodigo == ConstanteUtil.R_COD_EXITO) {
				log.info("[REGISTRAR CUENTA SISTEMA][DAO][EXITO]");
			} else {
				log.info("[REGISTRAR CUENTA SISTEMA][DAO][ERROR]");
			}
		} catch (Exception e) {
			log.info("[REGISTRAR CUENTA SISTEMA][DAO][EXCEPCION][" + e.getMessage() + "]");
			rCodigo = -1;
		}
		log.info("[REGISTRAR CUENTA SISTEMA][DAO][FIN]");
		return rCodigo;
	}

	@Override
	public OutResponse<?> modificarCuentaSistema(CuentaSistemaModificarRequest req, String listaServicio) {
		log.info("[MODIFICAR CUENTA SISTEMA][DAO][INICIO]");
		OutResponse<?> outResponse = new OutResponse<>();

		Integer rCodigo = 0;
		String rMensaje = "";
		try {
			SimpleJdbcCall jdbcCall = new SimpleJdbcCall(dataSourceSeguridad)
					.withSchemaName(ConstanteUtil.BD_SCHEMA_SEGURIDAD)
					.withCatalogName(ConstanteUtil.BD_PKG_RENI_AUTENTICACION).withProcedureName("SP_U_CUENTA_SISTEMA");

			MapSqlParameterSource in = new MapSqlParameterSource();
			in.addValue("P_NID_USUARIO", req.getIdUsuario(), Types.NUMERIC);
			in.addValue("P_NOMBRES", req.getNombres(), Types.VARCHAR);
			in.addValue("P_APE_PATERNO", req.getApePaterno(), Types.VARCHAR);
			in.addValue("P_APE_MATERNO", req.getApeMaterno(), Types.VARCHAR);
			in.addValue("P_FEC_NACIMIENTO",
					DateUtil.formatDateToString(req.getFecNacimiento(), ConstanteUtil.slash_ddMMyyyy), Types.VARCHAR);
			in.addValue("P_SEXO", req.getSexo(), Types.VARCHAR);
			in.addValue("P_NID_AREA", req.getIdArea(), Types.NUMERIC);
			in.addValue("P_NID_CARGO", req.getIdCargo(), Types.NUMERIC);
			in.addValue("P_USUARIO", req.getUsuario(), Types.VARCHAR);
			in.addValue("P_CONTRASENIA", req.getContrasenia(), Types.VARCHAR);
			in.addValue("P_NID_PERFIL", req.getIdPerfil(), Types.NUMERIC);
			in.addValue("P_NID_USUARIO_MODIF", req.getIdUsuarioModif(), Types.NUMERIC);
			in.addValue("P_TXT_PC_MODIF", AdressUtil.getHostname(httpRequest), Types.VARCHAR);
			in.addValue("P_TXT_IP_MODIF", AdressUtil.getIP(httpRequest), Types.VARCHAR);
			log.info("[MODIFICAR CUENTA SISTEMA][DAO][INPUT PROCEDURE][" + in.toString() + "]");

			Map<String, Object> out = jdbcCall.execute(in);
			log.info("[MODIFICAR CUENTA SISTEMA][DAO][OUTPUT PROCEDURE][" + out.toString() + "]");

			rCodigo = MapUtil.getInt(out.get(ConstanteUtil.R_CODIGO));
			rMensaje = MapUtil.getString(out.get(ConstanteUtil.R_MENSAJE));

			if (rCodigo == ConstanteUtil.R_COD_EXITO) {
				log.info("[MODIFICAR CUENTA SISTEMA][DAO][EXITO]");

				rCodigo = modificarCuentaSistemaServicios(req.getIdUsuario(), req.getFlgReporteDisociado(),
						listaServicio, req.getIdUsuarioModif());
				if (rCodigo != ConstanteUtil.R_COD_EXITO) {
					rCodigo = -100;
					rMensaje = "Ocurrio un error al asociar los servicios a los que tiene acceso el Usuario, por favor intentelo mas tarde";
				}

				outResponse.setRCodigo(rCodigo);
				outResponse.setRMensaje(rMensaje);
			} else {
				log.info("[MODIFICAR CUENTA SISTEMA][DAO][ERROR]");
				outResponse.setRCodigo(rCodigo);
				outResponse.setRMensaje(rMensaje);
			}
		} catch (Exception e) {
			log.info("[MODIFICAR CUENTA SISTEMA][DAO][EXCEPCION][" + e.getMessage() + "]");
			outResponse.setRCodigo(500);
			outResponse.setRMensaje(e.getMessage());
		}
		log.info("[MODIFICAR CUENTA SISTEMA][DAO][FIN]");
		return outResponse;
	}

	public Integer modificarCuentaSistemaServicios(Long idUsuario, Integer flgReporteDisoc, String listaServicio,
			Long idUsuarioModif) {
		log.info("[MODIFICAR CUENTA SISTEMA][DAO][INICIO]");

		Integer rCodigo = 0;
		try {
			SimpleJdbcCall jdbcCall = new SimpleJdbcCall(dataSource).withSchemaName(ConstanteUtil.BD_SCHEMA_RENI)
					.withCatalogName(ConstanteUtil.BD_PKG_RENI_CUENTA_SISTEMA)
					.withProcedureName("SP_U_CUENTA_SISTEMA_SERV");

			MapSqlParameterSource in = new MapSqlParameterSource();
			in.addValue("P_ID_USUARIO", idUsuario, Types.NUMERIC);
			in.addValue("P_FLG_REPORTE_DISOC", flgReporteDisoc, Types.NUMERIC);
			in.addValue("P_L_SERVICIO", listaServicio, Types.VARCHAR);
			in.addValue("P_NID_USUARIO_MODIF", idUsuarioModif, Types.NUMERIC);
			in.addValue("P_TXT_PC_MODIF", AdressUtil.getHostname(httpRequest), Types.VARCHAR);
			in.addValue("P_TXT_IP_MODIF", AdressUtil.getIP(httpRequest), Types.VARCHAR);
			log.info("[MODIFICAR CUENTA SISTEMA][DAO][INPUT PROCEDURE][" + in.toString() + "]");

			Map<String, Object> out = jdbcCall.execute(in);
			log.info("[MODIFICAR CUENTA SISTEMA][DAO][OUTPUT PROCEDURE][" + out.toString() + "]");

			rCodigo = MapUtil.getInt(out.get(ConstanteUtil.R_CODIGO));

			if (rCodigo == ConstanteUtil.R_COD_EXITO) {
				log.info("[MODIFICAR CUENTA SISTEMA][DAO][EXITO]");
			} else {
				log.info("[MODIFICAR CUENTA SISTEMA][DAO][ERROR]");
			}
		} catch (Exception e) {
			log.info("[MODIFICAR CUENTA SISTEMA][DAO][EXCEPCION][" + e.getMessage() + "]");
			rCodigo = -1;
		}
		log.info("[MODIFICAR CUENTA SISTEMA][DAO][FIN]");
		return rCodigo;
	}

	@Override
	public OutResponse<?> eliminarCuentaSistema(CuentaSistemaEliminarRequest req) {
		log.info("[ELIMINAR CUENTA SISTEMA][DAO][INICIO]");
		OutResponse<?> outResponse = new OutResponse<>();

		Integer rCodigo = 0;
		String rMensaje = "";
		try {
			SimpleJdbcCall jdbcCall = new SimpleJdbcCall(dataSourceSeguridad)
					.withSchemaName(ConstanteUtil.BD_SCHEMA_SEGURIDAD)
					.withCatalogName(ConstanteUtil.BD_PKG_RENI_AUTENTICACION).withProcedureName("SP_D_CUENTA_SISTEMA");

			MapSqlParameterSource in = new MapSqlParameterSource();
			in.addValue("P_NID_USUARIO", req.getIdUsuario(), Types.NUMERIC);
			in.addValue("P_NID_USUARIO_MODIF", req.getIdUsuarioModif(), Types.NUMERIC);
			in.addValue("P_TXT_PC_MODIF", AdressUtil.getHostname(httpRequest), Types.VARCHAR);
			in.addValue("P_TXT_IP_MODIF", AdressUtil.getIP(httpRequest), Types.VARCHAR);
			log.info("[ELIMINAR CUENTA SISTEMA][DAO][INPUT PROCEDURE][" + in.toString() + "]");

			Map<String, Object> out = jdbcCall.execute(in);
			log.info("[ELIMINAR CUENTA SISTEMA][DAO][OUTPUT PROCEDURE][" + out.toString() + "]");

			rCodigo = MapUtil.getInt(out.get(ConstanteUtil.R_CODIGO));
			rMensaje = MapUtil.getString(out.get(ConstanteUtil.R_MENSAJE));

			if (rCodigo == ConstanteUtil.R_COD_EXITO) {
				log.info("[ELIMINAR CUENTA SISTEMA][DAO][EXITO]");
				outResponse.setRCodigo(rCodigo);
				outResponse.setRMensaje(rMensaje);
			} else {
				log.info("[ELIMINAR CUENTA SISTEMA][DAO][ERROR]");
				outResponse.setRCodigo(rCodigo);
				outResponse.setRMensaje(rMensaje);
			}
		} catch (Exception e) {
			log.info("[ELIMINAR CUENTA SISTEMA][DAO][EXCEPCION][" + e.getMessage() + "]");
			outResponse.setRCodigo(500);
			outResponse.setRMensaje(e.getMessage());
		}
		log.info("[ELIMINAR CUENTA SISTEMA][DAO][FIN]");
		return outResponse;
	}

	@Override
	public OutResponse<CuentaSistemaBuscarPersonaResponse> buscarPersona(CuentaSistemaBuscarPersonaRequest req) {
		log.info("[BUSCAR CUENTA PERSONA][DAO][INICIO]");
		OutResponse<CuentaSistemaBuscarPersonaResponse> outResponse = new OutResponse<>();

		Integer rCodigo = 0;
		String rMensaje = "";
		try {
			SimpleJdbcCall jdbcCall = new SimpleJdbcCall(dataSourceSeguridad)
					.withSchemaName(ConstanteUtil.BD_SCHEMA_SEGURIDAD)
					.withCatalogName(ConstanteUtil.BD_PKG_RENI_AUTENTICACION).withProcedureName("SP_S_PERSONA");

			MapSqlParameterSource in = new MapSqlParameterSource();
			in.addValue("P_TIPO_DOCUMENTO", req.getTipoDocumento(), Types.NUMERIC);
			in.addValue("P_NRO_DOCUMENTO", req.getNroDocumento(), Types.VARCHAR);
			log.info("[BUSCAR CUENTA PERSONA][DAO][INPUT PROCEDURE][" + in.toString() + "]");

			Map<String, Object> out = jdbcCall.execute(in);
			log.info("[BUSCAR CUENTA PERSONA][DAO][OUTPUT PROCEDURE][" + out.toString() + "]");

			rCodigo = MapUtil.getInt(out.get(ConstanteUtil.R_CODIGO));
			rMensaje = MapUtil.getString(out.get(ConstanteUtil.R_MENSAJE));

			if (rCodigo == ConstanteUtil.R_COD_EXITO) {
				log.info("[BUSCAR CUENTA PERSONA][DAO][EXITO]");
				CuentaSistemaBuscarPersonaResponse res = new CuentaSistemaBuscarPersonaResponse();
				res.setIdPersona(MapUtil.getLong(out.get("R_ID_PERSONA")));
				res.setNombres(MapUtil.getString(out.get("R_NOMBRES")));
				res.setApePaterno(MapUtil.getString(out.get("R_APE_PATERNO")));
				res.setApeMaterno(MapUtil.getString(out.get("R_APE_MATERNO")));
				res.setFecNacimiento(MapUtil.getDate(out.get("R_FEC_NACIMIENTO"), ConstanteUtil.guion_yyyyMMdd));
				res.setSexo(MapUtil.getString(out.get("R_SEXO")));
				res.setIdArea(MapUtil.getLong(out.get("R_NID_AREA")));
				res.setNomArea(MapUtil.getString(out.get("R_NOM_AREA")));
				res.setIdCargo(MapUtil.getLong(out.get("R_NID_CARGO")));
				res.setIdUsuario(MapUtil.getLong(out.get("R_NID_USUARIO")));
				res.setUsuario(MapUtil.getString(out.get("R_USUARIO")));
				res.setIdPerfil(MapUtil.getLong(out.get("R_NID_PERFIL")));

				outResponse.setRCodigo(rCodigo);
				outResponse.setRMensaje(rMensaje);
				outResponse.setObjeto(res);
			} else {
				log.info("[BUSCAR CUENTA PERSONA][DAO][ERROR]");
				outResponse.setRCodigo(rCodigo);
				outResponse.setRMensaje(rMensaje);
			}
		} catch (Exception e) {
			log.info("[BUSCAR CUENTA PERSONA][DAO][EXCEPCION][" + e.getMessage() + "]");
			outResponse.setRCodigo(500);
			outResponse.setRMensaje(e.getMessage());
		}
		log.info("[BUSCAR CUENTA PERSONA][DAO][FIN]");
		return outResponse;
	}

	@Override
	public OutResponse<Integer> validarExisteUsuario(CuentaSistemaValidarUsuarioRequest req) {
		log.info("[VALIDAR EXISTE USUARIO][DAO][INICIO]");
		OutResponse<Integer> outResponse = new OutResponse<>();

		Integer rCodigo = 0;
		String rMensaje = "";
		try {
			SimpleJdbcCall jdbcCall = new SimpleJdbcCall(dataSourceSeguridad)
					.withSchemaName(ConstanteUtil.BD_SCHEMA_SEGURIDAD)
					.withCatalogName(ConstanteUtil.BD_PKG_RENI_AUTENTICACION).withProcedureName("SP_S_CONT_USUARIO");

			MapSqlParameterSource in = new MapSqlParameterSource();
			in.addValue("P_USERNAME", req.getUsername(), Types.VARCHAR);
			log.info("[VALIDAR EXISTE USUARIO][DAO][INPUT PROCEDURE][" + in.toString() + "]");

			Map<String, Object> out = jdbcCall.execute(in);
			log.info("[VALIDAR EXISTE USUARIO][DAO][OUTPUT PROCEDURE][" + out.toString() + "]");

			rCodigo = MapUtil.getInt(out.get(ConstanteUtil.R_CODIGO));
			rMensaje = MapUtil.getString(out.get(ConstanteUtil.R_MENSAJE));

			if (rCodigo == ConstanteUtil.R_COD_EXITO) {
				log.info("[VALIDAR EXISTE USUARIO][DAO][EXITO]");
				Integer res = MapUtil.getInt(out.get("R_COUNT"));

				outResponse.setRCodigo(rCodigo);
				outResponse.setRMensaje(rMensaje);
				outResponse.setObjeto(res);
			} else {
				log.info("[VALIDAR EXISTE USUARIO][DAO][ERROR]");
				outResponse.setRCodigo(rCodigo);
				outResponse.setRMensaje(rMensaje);
			}
		} catch (Exception e) {
			log.info("[VALIDAR EXISTE USUARIO][DAO][EXCEPCION][" + e.getMessage() + "]");
			outResponse.setRCodigo(500);
			outResponse.setRMensaje(e.getMessage());
		}
		log.info("[VALIDAR EXISTE USUARIO][DAO][FIN]");
		return outResponse;
	}

	@Override
	public OutResponse<CuentaSistemaUsuarioSeguridadBuscarResponse> buscarUsuarioSeguridad(
			CuentaSistemaUsuarioSeguridadBuscarRequest req) {
		log.info("[LISTAR SERVICIOS USUARIOS][DAO][INICIO]");
		OutResponse<CuentaSistemaUsuarioSeguridadBuscarResponse> outResponse = new OutResponse<>();

		Integer rCodigo = 0;
		String rMensaje = "";
		try {
			SimpleJdbcCall jdbcCall = new SimpleJdbcCall(dataSource).withSchemaName(ConstanteUtil.BD_SCHEMA_RENI)
					.withCatalogName(ConstanteUtil.BD_PKG_RENI_CUENTA_SISTEMA)
					.withProcedureName("SP_S_USUARIO_SEGURIDAD").returningResultSet(ConstanteUtil.R_LISTA,
							new CuentaSistemaUsuarioSeguridadBuscarServiciosResponseMapper());

			MapSqlParameterSource in = new MapSqlParameterSource();
			in.addValue("P_ID_USUARIO", req.getIdUsuario(), Types.NUMERIC);
			log.info("[LISTAR SERVICIOS USUARIOS][DAO][INPUT PROCEDURE][" + in.toString() + "]");

			Map<String, Object> out = jdbcCall.execute(in);
			log.info("[LISTAR SERVICIOS USUARIOS][DAO][OUTPUT PROCEDURE][" + out.toString() + "]");

			rCodigo = MapUtil.getInt(out.get(ConstanteUtil.R_CODIGO));
			rMensaje = MapUtil.getString(out.get(ConstanteUtil.R_MENSAJE));

			if (rCodigo == ConstanteUtil.R_COD_EXITO) {
				log.info("[LISTAR SERVICIOS USUARIOS][DAO][EXITO]");
				CuentaSistemaUsuarioSeguridadBuscarResponse res = new CuentaSistemaUsuarioSeguridadBuscarResponse();
				res.setListaServicios(MapUtil.getType(out.get(ConstanteUtil.R_LISTA)));
				res.setFlgReporteDisociado(MapUtil.getInt(out.get("R_FLG_REPORTE_DISOC")));

				outResponse.setRCodigo(rCodigo);
				outResponse.setRMensaje(rMensaje);
				outResponse.setObjeto(res);
			} else {
				log.info("[LISTAR SERVICIOS USUARIOS][DAO][ERROR]");
				outResponse.setRCodigo(rCodigo);
				outResponse.setRMensaje(rMensaje);
			}
		} catch (Exception e) {
			log.info("[LISTAR SERVICIOS USUARIOS][DAO][EXCEPCION][" + e.getMessage() + "]");
			outResponse.setRCodigo(500);
			outResponse.setRMensaje(e.getMessage());
		}
		log.info("[LISTAR SERVICIOS USUARIOS][DAO][FIN]");
		return outResponse;
	}
}
