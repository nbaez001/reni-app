package pe.gob.mimp.reni.util;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Date;

import org.apache.poi.hssf.usermodel.HSSFCell;

public class ExcelUtil {
	public static Integer getInt(HSSFCell o) {
		String val = o.getStringCellValue();
		if (val != null) {
			return Integer.parseInt(val);
		} else {
			return null;
		}
	}

	public static Long getLong(HSSFCell o) {
		String val = o.getStringCellValue();
		return Long.parseLong(val);
	}

	public static Double getDouble(HSSFCell o) {
		if (o != null) {
			return o.getNumericCellValue();
		} else {
			return null;
		}
	}

	public static String getString(HSSFCell o) {
		return o.getStringCellValue();
	}

	public static Date getDate(HSSFCell o, String patter) {
		try {
			SimpleDateFormat sdf = new SimpleDateFormat(patter);
			return sdf.parse(o.toString());
		} catch (ParseException e) {
			e.printStackTrace();
			return null;
		}
	}
}
