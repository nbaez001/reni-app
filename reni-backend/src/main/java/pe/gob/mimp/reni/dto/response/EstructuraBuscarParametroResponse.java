package pe.gob.mimp.reni.dto.response;

import java.io.Serializable;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@ToString
public class EstructuraBuscarParametroResponse implements Serializable {
	private static final long serialVersionUID = 1L;

	private Long idParametro;
	private String nomCampoExcel;
	private Integer ordenCampoExcel;
	private String nomTablaBd;
	private String nomCampoBd;
	private Integer campoEsFk;
	private String campoIdMaestra;
	private String descripcion;
}
