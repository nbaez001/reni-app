package pe.gob.mimp.reni.dto.request;

import lombok.Setter;
import lombok.ToString;

import java.io.Serializable;
import java.util.List;

import lombok.Getter;

@Getter
@Setter
@ToString
public class ReporteIntervencionListarServicioPermitidoRequest implements Serializable {
	private static final long serialVersionUID = 1L;

	private Long idEntidad;
	private Long idLineaIntervencion;
	private String nomServicio;
	private List<Long> listaServicioPermitido;
}
