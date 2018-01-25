package com.gvc.crmadmin.domain;

import com.fasterxml.jackson.annotation.JsonProperty;
import org.apache.commons.lang3.builder.ToStringBuilder;
import org.apache.commons.lang3.builder.ToStringStyle;

import java.io.Serializable;

public class FrontendProductRequest implements Serializable {
    private static final long serialVersionUID = -8736621585713672212L;

    @JsonProperty("campaignGroupId")
    private String campaignGroupId;

    @Override
    public String toString() {
        return ToStringBuilder.reflectionToString(this, ToStringStyle.SHORT_PREFIX_STYLE);
    }

    public String getCampaignGroupId() {
        return campaignGroupId;
    }

    public FrontendProductRequest setCampaignGroupId(String campaignGroupId) {
        this.campaignGroupId = campaignGroupId;
        return this;
    }
}
