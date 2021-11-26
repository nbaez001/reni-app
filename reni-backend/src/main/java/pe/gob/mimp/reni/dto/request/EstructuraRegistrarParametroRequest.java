package pe.gob.mimp.reni.dto.request;

import java.io.Serializable;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@ToString
public class EstructuraRegistrarParametroRequest implements Serializable {
	private static final long serialVersionUID = 1L;

	private String nomCampoExcel;
	private Integer ordenCampoExcel;
	private String nomTablaBd;
	private String nomCampoBd;
	private Integer campoEsFk;
	private String campoIdmaestra;
	private String descripcion;
}
