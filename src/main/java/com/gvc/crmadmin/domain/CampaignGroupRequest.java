package com.gvc.crmadmin.domain;

import com.fasterxml.jackson.annotation.JsonProperty;
import org.apache.commons.lang3.builder.ToStringBuilder;
import org.apache.commons.lang3.builder.ToStringStyle;

import java.io.Serializable;

public class CampaignGroupRequest implements Serializable {
    private static final long serialVersionUID = 6705019051186151703L;

    @JsonProperty("appId")
    private String appId;

    public String getAppId() {
        return appId;
    }

    public CampaignGroupRequest setAppId(String appId) {
        this.appId = appId;
        return this;
    }

    @Override
    public String toString() {
        return ToStringBuilder.reflectionToString(this, ToStringStyle.SHORT_PREFIX_STYLE);
    }
}
