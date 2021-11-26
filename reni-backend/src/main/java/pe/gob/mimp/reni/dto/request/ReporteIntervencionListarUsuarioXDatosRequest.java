package pe.gob.mimp.reni.dto.request;

import java.io.Serializable;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@ToString
public class ReporteIntervencionListarUsuarioXDatosRequest implements Serializable {
	private static final long serialVersionUID = 1L;

	private String tipDocumento;
	private String nroDocumento;
	private String nombre;
	private String apePaterno;
	private String apeMaterno;
	private String tipSexo;
}
