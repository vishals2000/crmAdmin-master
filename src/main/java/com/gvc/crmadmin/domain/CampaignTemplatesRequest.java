package com.gvc.crmadmin.domain;

import com.fasterxml.jackson.annotation.JsonProperty;
import org.apache.commons.lang3.builder.ToStringBuilder;
import org.apache.commons.lang3.builder.ToStringStyle;

import java.io.Serializable;

public class CampaignTemplatesRequest implements Serializable {
    private static final long serialVersionUID = -6394085513036299027L;

    @JsonProperty("campaignGroupId")
    private String campaignGroupId;

    @JsonProperty("campaignTemplateId")
    private String campaignTemplateId;

    public String getCampaignGroupId() {
        return campaignGroupId;
    }

    public CampaignTemplatesRequest setCampaignGroupId(String campaignGroupId) {
        this.campaignGroupId = campaignGroupId;
        return this;
    }

    @Override
    public String toString() {
        return ToStringBuilder.reflectionToString(this, ToStringStyle.SHORT_PREFIX_STYLE);
    }

    public String getCampaignTemplateId() {
        return campaignTemplateId;
    }

    public CampaignTemplatesRequest setCampaignTemplateId(String campaignTemplateId) {
        this.campaignTemplateId = campaignTemplateId;
        return this;
    }
}
