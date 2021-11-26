package pe.gob.mimp.reni.dto.request;

import java.io.Serializable;
import java.util.List;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@ToString
public class PerfilModificarRequest implements Serializable {
	private static final long serialVersionUID = 1L;

	private Long idPerfil;
	private String nomPerfil;
	private List<Long> listaFuncionalidad;
	private List<Long> listaFuncionalidadMod;
	private Long idUsuarioModif;
}
