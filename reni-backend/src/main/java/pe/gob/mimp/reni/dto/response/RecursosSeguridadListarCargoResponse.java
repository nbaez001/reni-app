package pe.gob.mimp.reni.dto.response;

import java.io.Serializable;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@ToString
public class RecursosSeguridadListarCargoResponse implements Serializable {
	private static final long serialVersionUID = 1L;

	private Long idCargo;
	private String descripcion;
	private Integer flgActivo;
}
