package pe.gob.mimp.reni.dto.response;

import java.io.Serializable;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@ToString
public class ReporteIntervencionListarMaestraResponse implements Serializable {
	private static final long serialVersionUID = 1L;

	private String idTabla;
	private String codigo;
	private String nombre;
	private String descripcion;
}
