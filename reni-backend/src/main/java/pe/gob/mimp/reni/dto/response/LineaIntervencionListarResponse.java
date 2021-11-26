package pe.gob.mimp.reni.dto.response;

import lombok.Setter;
import lombok.ToString;

import java.io.Serializable;

import lombok.Getter;

@Getter
@Setter
@ToString
public class LineaIntervencionListarResponse implements Serializable {
	private static final long serialVersionUID = 1L;

	private Long idLineaInter;
	private String codigo;
	private String nombre;
	private Integer orden;
	private Integer flgActivo;
}
