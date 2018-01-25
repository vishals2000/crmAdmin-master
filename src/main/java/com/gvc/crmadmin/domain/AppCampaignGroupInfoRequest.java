package com.gvc.crmadmin.domain;

import com.fasterxml.jackson.annotation.JsonProperty;
import org.apache.commons.lang3.builder.ToStringBuilder;
import org.apache.commons.lang3.builder.ToStringStyle;

import java.io.Serializable;

public class AppCampaignGroupInfoRequest implements Serializable {
    private static final long serialVersionUID = -8736621585713672212L;

    @JsonProperty("campaignTemplateId")
    private String campaignTemplateId;

    @Override
    public String toString() {
        return ToStringBuilder.reflectionToString(this, ToStringStyle.SHORT_PREFIX_STYLE);
    }

    public String getCampaignTemplateId() {
        return campaignTemplateId;
    }

    public AppCampaignGroupInfoRequest setCampaignTemplateId(String campaignTemplateId) {
        this.campaignTemplateId = campaignTemplateId;
        return this;
    }
}
