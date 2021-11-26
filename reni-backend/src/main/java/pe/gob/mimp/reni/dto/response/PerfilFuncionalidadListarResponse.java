package pe.gob.mimp.reni.dto.response;

import java.io.Serializable;
import java.util.List;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@ToString
public class PerfilFuncionalidadListarResponse implements Serializable {
	private static final long serialVersionUID = 1L;

	private Long idFuncionalidad;
	private Long idFuncionalidadPadre;
	private String titulo;
	private String referencia;
	private List<PerfilFuncionalidadListarResponse> listaFuncionalidad;
}
