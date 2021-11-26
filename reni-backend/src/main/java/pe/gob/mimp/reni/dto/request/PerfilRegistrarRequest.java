package pe.gob.mimp.reni.dto.request;

import java.io.Serializable;
import java.util.List;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@ToString
public class PerfilRegistrarRequest implements Serializable {
	private static final long serialVersionUID = 1L;

	private String nomPerfil;
	private Long idModulo;
	private List<Long> listaFuncionalidad;
	private Long idUsuarioCrea;
}
