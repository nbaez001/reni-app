package pe.gob.mimp.reni.dto.response;

import java.io.Serializable;
import java.util.List;

import lombok.Getter;
import lombok.ToString;
import lombok.Setter;

@Getter
@Setter
@ToString
public class CuentaSistemaUsuarioSeguridadBuscarResponse implements Serializable {
	private static final long serialVersionUID = 1L;

	private Integer flgReporteDisociado;
	private List<CuentaSistemaUsuarioSeguridadBuscarServiciosResponse> listaServicios;
}
