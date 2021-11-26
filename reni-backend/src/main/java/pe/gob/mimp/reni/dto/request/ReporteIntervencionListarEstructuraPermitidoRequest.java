package pe.gob.mimp.reni.dto.request;

import java.io.Serializable;
import java.util.List;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@ToString
public class ReporteIntervencionListarEstructuraPermitidoRequest implements Serializable {
	private static final long serialVersionUID = 1L;

	private Long idEntidad;
    private Long idLineaIntervencion;
    private Long idServicio;
    private List<Long> listaServicioPermitido;
}
