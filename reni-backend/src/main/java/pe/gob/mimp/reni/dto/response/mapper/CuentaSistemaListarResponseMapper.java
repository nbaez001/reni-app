package pe.gob.mimp.reni.dto.response.mapper;

import java.sql.ResultSet;
import java.sql.SQLException;

import org.springframework.jdbc.core.RowMapper;

import pe.gob.mimp.reni.dto.response.CuentaSistemaListarResponse;

public class CuentaSistemaListarResponseMapper implements RowMapper<CuentaSistemaListarResponse> {

	public CuentaSistemaListarResponse mapRow(ResultSet rs, int rowNum) throws SQLException {
		CuentaSistemaListarResponse o = new CuentaSistemaListarResponse();
		o.setIdUsuario(rs.getLong("NID_USUARIO"));
		o.setUsuario(rs.getString("TXT_USUARIO"));
		o.setIdPerfil(rs.getLong("NID_PERFIL"));
		o.setNomPerfil(rs.getString("TXT_PERFIL"));
		o.setIdTipoDocumento(rs.getLong("NID_TIPO_DOCUMENTO"));
		o.setNomTipoDocumento(rs.getString("NOM_TIPO_DOCUMENTO"));
		o.setNroDocumento(rs.getString("TXT_DOCUMENTO"));
		o.setApePaterno(rs.getString("TXT_APELLIDO_PATERNO"));
		o.setApeMaterno(rs.getString("TXT_APELLIDO_MATERNO"));
		o.setNombre(rs.getString("TXT_NOMBRES"));
		o.setIdArea(rs.getLong("NID_AREA"));
		o.setNomArea(rs.getString("TXT_AREA"));
		o.setIdCargo(rs.getLong("NID_CARGO"));
		o.setNomCargo(rs.getString("TXT_DESCRIPCION"));
		o.setFecNacimiento(rs.getDate("FEC_NACIMIENTO"));
		o.setSexo(rs.getString("TXT_SEXO"));
		o.setFlgActivo(rs.getInt("FLG_ACTIVO"));
		return o;
	}

}
