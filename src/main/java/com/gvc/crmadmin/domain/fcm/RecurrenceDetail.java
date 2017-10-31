package com.gvc.crmadmin.domain.fcm;

import org.apache.commons.lang3.builder.ToStringStyle;

import java.io.Serializable;

/** This is used to encapsulate the recurrence details
 * Created by Sai Sharath Palivela on 10-07-2017.
 */
public class RecurrenceDetail implements Serializable{

    private static final long serialVersionUID = 7145836975337373873L;

    public RecurrenceDetail(String startDate, String recurrenceEndDate, String recurrenceType) {
        this.startDate = startDate;
        this.recurrenceEndDate = recurrenceEndDate;
        this.recurrenceType = Type.valueOf(recurrenceType);
    }

    public enum Type {
        NONE,
        WEEKLY,
        DAILY
    }

    /**
     * In yyyy-MM-dd format
     * */
    private String startDate;

    /**
     * In yyyy-MM-dd format
     * */
    private String recurrenceEndDate;

    private Type recurrenceType;

    public String getRecurrenceEndDate() {
        return recurrenceEndDate;
    }

    public void setRecurrenceEndDate(String recurrenceEndDate) {
        this.recurrenceEndDate = recurrenceEndDate;
    }

    public Type getRecurrenceType() {
        return recurrenceType;
    }

    public void setRecurrenceType(Type recurrenceType) {
        this.recurrenceType = recurrenceType;
    }

    public String getStartDate() {
        return startDate;
    }

    public void setStartDate(String startDate) {
        this.startDate = startDate;
    }

    @Override
    public String toString() {
        return org.apache.commons.lang3.builder.ToStringBuilder.reflectionToString(this, ToStringStyle.SHORT_PREFIX_STYLE);
    }
}
