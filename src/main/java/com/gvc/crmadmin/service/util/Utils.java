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
    public static final DateTimeFormatter TIME_STAMP_FORMAT = DateTimeFormat.forPattern("yyyy-MM-dd HH:mm:ss").withZone(UTC);
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

    public static DateTime getCurrentDateTimeInUTC() {
        return new DateTime(DateTimeZone.UTC);
    }

    public static String getCurrentDateTimeInUTCAsString() {
        return TIME_STAMP_FORMAT.print(new DateTime(UTC));
    }

    public static String getCurrentDateInUTCAsString() {
        return DATE_FORMATTER.print(new DateTime(UTC));
    }

    public static DateTime getDateTimeFromString(DateTimeFormatter dateTimeFormatter, String scheduleTime) {
        return dateTimeFormatter.parseDateTime(scheduleTime);
    }
}
