package pe.gob.mimp.reni.dto.response;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.jdbc.core.RowMapper;

import pe.gob.mimp.reni.dto.request.EdneModificarListarUsuarioDetRequest;
import pe.gob.mimp.reni.util.ConstanteUtil;

public class EdneModificarListarUsuarioResponseMapper implements RowMapper<Map<String, Object>> {

	List<EdneModificarListarUsuarioDetRequest> listaMapeo;

	public EdneModificarListarUsuarioResponseMapper(List<EdneModificarListarUsuarioDetRequest> listaMapeo) {
		this.listaMapeo = listaMapeo;
	}

	public Map<String, Object> mapRow(ResultSet rs, int rowNum) throws SQLException {
		Map<String, Object> o = new HashMap<>();

		for (EdneModificarListarUsuarioDetRequest ob : listaMapeo) {
			if (ob.getTipoDato().equals(ConstanteUtil.T_VARCHAR2)) {
				o.put(ob.getNomCampoExcel(), rs.getString(ob.getNomCampoExcel()));
			}
			if (ob.getTipoDato().equals(ConstanteUtil.T_NUMBER)) {
				if (ob.getPrecisionDato() > 0) {
					o.put(ob.getNomCampoExcel(), rs.getDouble(ob.getNomCampoExcel()));
				} else {
					o.put(ob.getNomCampoExcel(), rs.getInt(ob.getNomCampoExcel()));
				}
			}
			if (ob.getTipoDato().equals(ConstanteUtil.T_DATE)) {
				o.put(ob.getNomCampoExcel(), rs.getDate(ob.getNomCampoExcel()));
			}
		}
		return o;
	}

}
