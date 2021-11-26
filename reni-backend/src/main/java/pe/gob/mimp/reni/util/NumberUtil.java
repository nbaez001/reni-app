package pe.gob.mimp.reni.util;

import java.text.DecimalFormat;
import java.text.DecimalFormatSymbols;

public class NumberUtil {

	public static String doubleToString(Double numero, char tipoSeparador, String formato) {
		DecimalFormatSymbols simbolo = new DecimalFormatSymbols();
		simbolo.setDecimalSeparator(tipoSeparador);
		DecimalFormat formater = new DecimalFormat(formato, simbolo);

		if (numero != null) {
			return formater.format(numero);
		} else {
			return "";
		}
	}
}
