package pe.gob.mimp.reni.dto.response;

import java.io.Serializable;
import java.util.List;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@ToString
public class PerfilFuncionalidadPerfListarResponse implements Serializable {
	private static final long serialVersionUID = 1L;

	private Long idFuncionalidad;
	private Long idFuncionalidadPadre;
	private String titulo;
	private String referencia;
	private String imagen;
	private Integer orden;
	private Integer flgActivo;
	private List<PerfilFuncionalidadPerfListarResponse> listaFuncionalidad;
}
