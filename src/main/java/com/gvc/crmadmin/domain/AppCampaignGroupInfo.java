package com.gvc.crmadmin.domain;

import org.apache.commons.lang3.builder.ToStringBuilder;
import org.apache.commons.lang3.builder.ToStringStyle;

import java.io.Serializable;

public class AppCampaignGroupInfo implements Serializable {

    private static final long serialVersionUID = 7512417937769716851L;

    private String appId;
    private String appName;
    private String campaignGroupId;
    private String campaignGroupName;

    public String getAppId() {
        return appId;
    }

    public AppCampaignGroupInfo setAppId(String appId) {
        this.appId = appId;
        return this;
    }

    public String getAppName() {
        return appName;
    }

    public AppCampaignGroupInfo setAppName(String appName) {
        this.appName = appName;
        return this;
    }

    public String getCampaignGroupId() {
        return campaignGroupId;
    }

    public AppCampaignGroupInfo setCampaignGroupId(String campaignGroupId) {
        this.campaignGroupId = campaignGroupId;
        return this;
    }

    public String getCampaignGroupName() {
        return campaignGroupName;
    }

    public AppCampaignGroupInfo setCampaignGroupName(String campaignGroupName) {
        this.campaignGroupName = campaignGroupName;
        return this;
    }

    @Override
    public String toString() {
        return ToStringBuilder.reflectionToString(this, ToStringStyle.SHORT_PREFIX_STYLE);
    }
}
