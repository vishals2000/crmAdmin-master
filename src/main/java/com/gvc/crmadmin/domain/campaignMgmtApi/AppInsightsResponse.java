package com.gvc.crmadmin.domain.campaignMgmtApi;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.sun.nio.sctp.MessageInfo;
import org.apache.commons.lang3.builder.ToStringBuilder;
import org.apache.commons.lang3.builder.ToStringStyle;

import java.io.Serializable;
import java.util.Map;
import java.util.TreeMap;

@JsonIgnoreProperties(ignoreUnknown = true)
public class AppInsightsResponse implements Serializable {

    private static final long serialVersionUID = -3469576649158863869L;

    @JsonProperty("messages")
    private long messages;

    @JsonProperty("totalUsers")
    private long totalUsers;

    @JsonProperty("dailyUniqueUsers")
    private long dailyUniqueUsers;

    @JsonProperty("sessions")
    private long sessions;

    @JsonProperty("dateVsMessageInfo")
    private Map<String, MessageInfo> dateVsMessageInfo = new TreeMap<>();

    @JsonProperty("dateVsUniqueUsers")
    private Map<String, Long> dateVsUniqueUsers = new TreeMap<>();

    @JsonProperty("dateVsSessions")
    private Map<String, Long> dateVsSessions = new TreeMap<>();

    public long getMessages() {
        return messages;
    }

    public void setMessages(long messages) {
        this.messages = messages;
    }

    public long getTotalUsers() {
        return totalUsers;
    }

    public void setTotalUsers(long totalUsers) {
        this.totalUsers = totalUsers;
    }

    public long getDailyUniqueUsers() {
        return dailyUniqueUsers;
    }

    public void setDailyUniqueUsers(long dailyUniqueUsers) {
        this.dailyUniqueUsers = dailyUniqueUsers;
    }

    public long getSessions() {
        return sessions;
    }

    public void setSessions(long sessions) {
        this.sessions = sessions;
    }

    public Map<String, Long> getDateVsUniqueUsers() {
        return dateVsUniqueUsers;
    }

    public void setDateVsUniqueUsers(Map<String, Long> dateVsUniqueUsers) {
        this.dateVsUniqueUsers = dateVsUniqueUsers;
    }

    public Map<String, Long> getDateVsSessions() {
        return dateVsSessions;
    }

    public void setDateVsSessions(Map<String, Long> dateVsSessions) {
        this.dateVsSessions = dateVsSessions;
    }

    @Override
    public String toString() {
        return ToStringBuilder.reflectionToString(this, ToStringStyle.SHORT_PREFIX_STYLE);
    }

    public Map<String, MessageInfo> getDateVsMessageInfo() {
        return dateVsMessageInfo;
    }

    public void setDateVsMessageInfo(Map<String, MessageInfo> dateVsMessageInfo) {
        this.dateVsMessageInfo = dateVsMessageInfo;
    }
}
