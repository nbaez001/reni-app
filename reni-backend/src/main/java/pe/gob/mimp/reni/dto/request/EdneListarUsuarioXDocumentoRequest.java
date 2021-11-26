package pe.gob.mimp.reni.dto.request;

import java.io.Serializable;
import java.util.List;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@ToString
public class EdneListarUsuarioXDocumentoRequest implements Serializable {
	private static final long serialVersionUID = 1L;

	private List<EdneListarUsuarioXDocumentoDetRequest> listaUsuarioDocumento;
	private String campNroDoc;
	private String campTipDoc;
}
