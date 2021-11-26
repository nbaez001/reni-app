package pe.gob.mimp.reni.dto.request;

import lombok.Setter;
import lombok.ToString;

import java.io.Serializable;

import lombok.Getter;

@Getter
@Setter
@ToString
public class CentroAtencionServListarXTipCenRequest implements Serializable {
	private static final long serialVersionUID = 1L;

	private String idtTipoCentro;
}
