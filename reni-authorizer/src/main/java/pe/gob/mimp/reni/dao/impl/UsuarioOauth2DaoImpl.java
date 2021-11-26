package pe.gob.mimp.reni.dao.impl;

import java.sql.Types;
import java.util.ArrayList;
import java.util.Collection;
import java.util.Map;

import javax.sql.DataSource;

import org.apache.commons.lang3.exception.ExceptionUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.jdbc.core.namedparam.MapSqlParameterSource;
import org.springframework.jdbc.core.simple.SimpleJdbcCall;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.stereotype.Repository;

import pe.gob.mimp.reni.dao.UsuarioOauth2Dao;
import pe.gob.mimp.reni.dto.response.OutResponse;
import pe.gob.mimp.reni.dto.response.UsuarioResponse;
import pe.gob.mimp.reni.util.ConstanteUtil;
import pe.gob.mimp.reni.util.MapUtil;

@Repository
public class UsuarioOauth2DaoImpl implements UsuarioOauth2Dao {

	Logger log = LoggerFactory.getLogger(UsuarioOauth2DaoImpl.class);

	@Autowired
	DataSource dataSource;

	@Value("${constantes.id-modulo-reni}")
	private Integer idModuloReni;
	
	@Override
	public OutResponse<UsuarioResponse> buscarUsuario(String username) {
		log.info("[BUSCAR USUARIO][DAO][INICIO]");
		OutResponse<UsuarioResponse> outResponse = new OutResponse<>();

		Integer rCodigo = -1;
		String rMensaje = "";
		try {
			SimpleJdbcCall jdbcCall = new SimpleJdbcCall(dataSource).withSchemaName(ConstanteUtil.BD_SCHEMA_SEGURIDAD)
					.withCatalogName(ConstanteUtil.BD_PCK_RENI_AUTENTICACION).withProcedureName("SP_AUTENTICAR");
//					.returningResultSet(ConstanteUtil.R_RESULT_DET, new RolResponseMapper());

			MapSqlParameterSource in = new MapSqlParameterSource();
			in.addValue("P_USERNAME", username, Types.VARCHAR);
			in.addValue("P_ID_MODULO", idModuloReni, Types.NUMERIC);
			log.info("[BUSCAR USUARIO][DAO][INPUT][" + in.toString() + "]");

			Map<String, Object> out = jdbcCall.execute(in);
			log.info("[BUSCAR USUARIO][DAO][OUTPUT][" + out.toString() + "]");

			rCodigo = Integer.parseInt(out.get(ConstanteUtil.R_CODIGO).toString());
			rMensaje = out.get(ConstanteUtil.R_MENSAJE).toString();

			if (rCodigo == ConstanteUtil.R_COD_EXITO) {
				log.info("[BUSCAR USUARIO][DAO][EXITO]");
				UsuarioResponse o = new UsuarioResponse();
				o.setIdUsuario(MapUtil.getLong(out.get("R_ID_USUARIO")));
				o.setIdModulo(idModuloReni.longValue());
				o.setUsername(MapUtil.getString(out.get("R_USUARIO")));
				o.setPassword(MapUtil.getString(out.get("R_PASSWORD")));
				o.setIdPersona(MapUtil.getLong(out.get("R_ID_PERSONA")));
				o.setIdTipDocumento(MapUtil.getLong(out.get("R_ID_TIP_DOCUMENTO")));
				o.setNomTipDocumento(MapUtil.getString(out.get("R_NOM_TIP_DOCUMENTO")));
				o.setNroDocumento(MapUtil.getString(out.get("R_NRO_DOCUMENTO")));
				o.setApePaterno(MapUtil.getString(out.get("R_APE_PATERNO")));
				o.setApeMaterno(MapUtil.getString(out.get("R_APE_MATERNO")));
				o.setNombres(MapUtil.getString(out.get("R_NOMBRES")));
				o.setIdCargo(MapUtil.getLong(out.get("R_ID_CARGO")));
				o.setNomCargo(MapUtil.getString(out.get("R_NOM_CARGO")));
				o.setIdArea(MapUtil.getLong(out.get("R_ID_AREA")));
				o.setNomArea(MapUtil.getString(out.get("R_NOM_AREA")));
				o.setIdPerfil(MapUtil.getLong(out.get("R_ID_PERFIL")));
				o.setNomPerfil(MapUtil.getString(out.get("R_NOM_PERFIL")));
				
				Collection<GrantedAuthority> list = new ArrayList<>();
				GrantedAuthority grantedAuthority = new SimpleGrantedAuthority(MapUtil.getString(out.get("R_NOM_PERFIL")));
				list.add(grantedAuthority);
				o.setGrantedAuthoritiesList(list);

				outResponse.setRCodigo(rCodigo);
				outResponse.setRMensaje(rMensaje);
				outResponse.setObjeto(o);
			} else {
				log.info("[BUSCAR USUARIO][DAO][ERROR]");
				outResponse.setRCodigo(rCodigo);
				outResponse.setRMensaje(rMensaje);
			}
		} catch (Exception e) {
			outResponse.setRCodigo(500);
			outResponse.setRMensaje(e.getMessage());
			log.info("[BUSCAR USUARIO][DAO][EXCEPCION][" + ExceptionUtils.getStackTrace(e) + "]");
		}
		log.info("[BUSCAR USUARIO][DAO][FIN]");
		return outResponse;
	}

}
