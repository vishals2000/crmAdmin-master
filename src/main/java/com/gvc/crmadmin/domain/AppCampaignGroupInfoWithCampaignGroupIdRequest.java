package com.gvc.crmadmin.domain;

import com.fasterxml.jackson.annotation.JsonProperty;
import org.apache.commons.lang3.builder.ToStringBuilder;
import org.apache.commons.lang3.builder.ToStringStyle;

import java.io.Serializable;

public class AppCampaignGroupInfoWithCampaignGroupIdRequest implements Serializable {
    private static final long serialVersionUID = 7846536041820880506L;

    @JsonProperty("campaignGroupId")
    private String campaignGroupId;

    public String getCampaignGroupId() {
        return campaignGroupId;
    }

    public AppCampaignGroupInfoWithCampaignGroupIdRequest setCampaignGroupId(String campaignGroupId) {
        this.campaignGroupId = campaignGroupId;
        return this;
    }

    @Override
    public String toString() {
        return ToStringBuilder.reflectionToString(this, ToStringStyle.SHORT_PREFIX_STYLE);
    }
}
