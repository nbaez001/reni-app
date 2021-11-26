package pe.gob.mimp.reni.dto.response;

import java.io.Serializable;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@ToString
public class RecursosSeguridadListarTipoDocumResponse implements Serializable {
	private static final long serialVersionUID = 1L;

	private Long idTipoDocumento;
	private String descripcion;
	private Integer flgActivo;
}
