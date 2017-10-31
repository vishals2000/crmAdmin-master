package com.gvc.crmadmin.service.util;

import org.joda.time.DateTime;
import org.joda.time.DateTimeZone;
import org.joda.time.format.DateTimeFormat;
import org.joda.time.format.DateTimeFormatter;

import java.time.LocalDate;

import static org.joda.time.DateTimeZone.UTC;

/**
 * Created by Sai Sharath Palivela on 11-09-2017.
 */
public class Utils {

    public static final DateTimeFormatter DATE_FORMATTER = DateTimeFormat.forPattern("yyyy-MM-dd").withZone(UTC);
    public static final String SPACE = " ";
    public static final String UNDER_SCORE = "_";

    public static String getStringFromDateTime(DateTimeFormatter dateTimeFormatter, DateTime dateTime) {
        return dateTimeFormatter.print(dateTime);
    }

    public static DateTime getDateTime(LocalDate scheduledDate) {
        return new DateTime(DateTimeZone.UTC).withDate(
            scheduledDate.getYear(), scheduledDate.getMonthValue(), scheduledDate.getDayOfMonth()
        ).withTime(0, 0, 0, 0);
    }
}
