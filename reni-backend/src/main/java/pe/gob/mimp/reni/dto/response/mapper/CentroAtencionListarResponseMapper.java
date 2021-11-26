package pe.gob.mimp.reni.dto.response.mapper;

import java.sql.ResultSet;
import java.sql.SQLException;

import org.springframework.jdbc.core.RowMapper;

import pe.gob.mimp.reni.dto.response.CentroAtencionListarResponse;

public class CentroAtencionListarResponseMapper implements RowMapper<CentroAtencionListarResponse> {

	public CentroAtencionListarResponse mapRow(ResultSet rs, int rowNum) throws SQLException {
		CentroAtencionListarResponse o = new CentroAtencionListarResponse();
		o.setIdCentroAtencion(rs.getLong("NID_CENTRO_ATEN"));
		o.setIdtTipoCentro(rs.getString("TXT_IDT_TIP_CENTRO"));
		o.setNomTipoCentro(rs.getString("TXT_NOM_TIP_CENTRO"));
		o.setIdtSubtipoCentro(rs.getString("TXT_IDT_SUBTIP_CENTRO"));
		o.setNomSubtipoCentro(rs.getString("TXT_NOM_SUBTIP_CENTRO"));
		o.setCodigo(rs.getString("TXT_CODIGO"));
		o.setNombre(rs.getString("TXT_NOMBRE"));
		o.setFechaCreacion(rs.getDate("FEC_CREACION_CENTRO"));
		o.setUbigeo(rs.getString("TXT_UBIGEO"));
		o.setNomDepartamento(rs.getString("TXT_DEPARTAMENTO"));
		o.setNomProvincia(rs.getString("TXT_PROVINCIA"));
		o.setNomDistrito(rs.getString("TXT_DISTRITO"));
		o.setDireccion(rs.getString("TXT_DIRECCION"));
		o.setRefDireccion(rs.getString("TXT_REFERENCIA_DIR"));
		o.setAreaResid(rs.getString("TXT_AREA_RESID"));
		o.setFlgTieneTelef(rs.getInt("FLG_TIENE_TELEF"));
		o.setFlgTieneLuz(rs.getInt("FLG_TIENE_LUZ"));
		o.setFlgTieneAgua(rs.getInt("FLG_TIENE_AGUA"));
		o.setFlgTieneDesague(rs.getInt("FLG_TIENE_DESAGUE"));
		o.setCapacidadMaxima(rs.getInt("NUM_CAPACIDAD_MAX"));
		o.setIdTipDocRepres(rs.getLong("NUM_ID_TIP_DOC_REPRES"));
		o.setNomTipDocRepres(rs.getString("TXT_NOM_TIP_DOC_REPRES"));
		o.setNroDocRepres(rs.getString("TXT_NRO_DOC_REPRES"));
		o.setNombreRepres(rs.getString("TXT_NOMBRE_REPRES"));
		o.setApePaternoRepres(rs.getString("TXT_APE_PAT_REPRES"));
		o.setApeMaternoRepres(rs.getString("TXT_APE_MAT_REPRES"));
		o.setNroTelefono(rs.getString("TXT_NUM_TELEFONO"));
		o.setTipoCoordenada(rs.getString("TXT_TIPO_COORDENADA"));
		o.setCoordenadaX(rs.getString("TXT_COORD_X"));
		o.setCoordenadaY(rs.getString("TXT_COORD_Y"));
		o.setFlgActivo(rs.getInt("FLG_ACTIVO"));
		return o;
	}

}
