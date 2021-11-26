package pe.gob.mimp.reni.util;

import java.text.SimpleDateFormat;
import java.util.Date;

public class DateUtil {

	public static String formatDateToString(Date date, String format) {
		SimpleDateFormat sdf = new SimpleDateFormat(format);
		if (date != null) {
			return sdf.format(date);
		} else {
			return null;
		}
	}
}
