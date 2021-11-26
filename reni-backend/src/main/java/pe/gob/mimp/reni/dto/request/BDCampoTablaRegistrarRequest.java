package pe.gob.mimp.reni.dto.request;

import java.io.Serializable;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@ToString
public class BDCampoTablaRegistrarRequest implements Serializable {
	private static final long serialVersionUID = 1L;

	private String nomTabla;
	private String nomColumna;
	private String tipoDato;
	private Integer longitud;
	private Integer escala;
}
