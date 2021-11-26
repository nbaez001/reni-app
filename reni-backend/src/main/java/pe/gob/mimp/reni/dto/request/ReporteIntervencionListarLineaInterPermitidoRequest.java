package pe.gob.mimp.reni.dto.request;

import java.io.Serializable;
import java.util.List;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@ToString
public class ReporteIntervencionListarLineaInterPermitidoRequest implements Serializable {
	private static final long serialVersionUID = 1L;

	private List<Long> listaServicioPermitido;
}
