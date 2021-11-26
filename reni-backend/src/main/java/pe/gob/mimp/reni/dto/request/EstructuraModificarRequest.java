package pe.gob.mimp.reni.dto.request;

import java.io.Serializable;
import java.util.List;

import lombok.Getter;
import lombok.ToString;
import lombok.Setter;

@Getter
@Setter
@ToString
public class EstructuraModificarRequest implements Serializable {
	private static final long serialVersionUID = 1L;

	private Long idEstructura;
	private String nombre;
	private String descripcion;
	private String idtTipoUsuario;
	private Long idServicio;
	private Long idEstructuraRepl;
	private List<EstructuraRegistrarParametroRequest> listaParametro;
	private List<EstructuraModificarParametroRequest> listaParametroMod;
	private List<Long> listaParametroElim;
	private Long idUsuarioModif;
}
