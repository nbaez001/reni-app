package pe.gob.mimp.reni.dto.response;

import java.io.Serializable;

import lombok.Getter;
import lombok.ToString;
import lombok.Setter;

@Getter
@Setter
@ToString
public class EdneListarUsuarioXDocumentoResponse implements Serializable {
	private static final long serialVersionUID = 1L;

	private Long idUsuario;
	private String nroDocumento;
	private String tipDocumento;
}
