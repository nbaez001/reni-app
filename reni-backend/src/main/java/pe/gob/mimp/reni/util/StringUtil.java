package pe.gob.mimp.reni.util;

public class StringUtil {

	public static boolean isNullOrBlank(String value) {
		if (value == null || value.equals("")) {
			return true;
		} else {
			return false;
		}
	}

	public static String repComillaToAmpersand(String value) {
		if (value == null || value.equals("")) {
			return null;
		} else {
			return value.replaceAll("'", "&");
		}
	}
}
