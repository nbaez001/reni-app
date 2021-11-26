package pe.gob.mimp.reni.dto.response;

import java.io.Serializable;
import java.util.List;

import lombok.Getter;
import lombok.ToString;
import lombok.Setter;

@Getter
@Setter
@ToString
public class EstructuraBuscarResponse implements Serializable {
	private static final long serialVersionUID = 1L;

	private String nombre;
	private String descripcion;
	private String idTipoUsuario;
	private Long idServicio;
	private String nomServicio;
	private Long idEntidad;
	private String nomEntidad;
	private Long idLineaInter;
	private String nomLineaInter;
	private Long idEstructuraRepl;
	private String nomEstructuraRepl;
	private List<EstructuraBuscarParametroResponse> listaParametro;
}
