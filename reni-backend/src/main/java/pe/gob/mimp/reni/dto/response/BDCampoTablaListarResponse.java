package pe.gob.mimp.reni.dto.response;

import java.io.Serializable;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@ToString
public class BDCampoTablaListarResponse implements Serializable {
	private static final long serialVersionUID = 1L;

	private String nomColumna;
	private String tipoDato;
	private Integer longitudDato;
	private Integer precisionDato;
	private Integer escalaDato;
}
