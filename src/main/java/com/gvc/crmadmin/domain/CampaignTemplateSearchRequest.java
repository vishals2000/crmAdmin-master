package com.gvc.crmadmin.domain;

import com.fasterxml.jackson.annotation.JsonProperty;
import org.apache.commons.lang3.builder.ToStringBuilder;
import org.apache.commons.lang3.builder.ToStringStyle;

import java.io.Serializable;

public class CampaignTemplateSearchRequest implements Serializable {
    private static final long serialVersionUID = -6394085513036299027L;

    @JsonProperty("campaignGroupId")
    private String campaignGroupId;

    @JsonProperty("searchValue")
    private String searchValue;

    public String getCampaignGroupId() {
        return campaignGroupId;
    }

    public CampaignTemplateSearchRequest setCampaignGroupId(String campaignGroupId) {
        this.campaignGroupId = campaignGroupId;
        return this;
    }

    @Override
    public String toString() {
        return ToStringBuilder.reflectionToString(this, ToStringStyle.SHORT_PREFIX_STYLE);
    }

    public String getSearchValue() {
        return searchValue;
    }

    public CampaignTemplateSearchRequest setSearchValue(String searchValue) {
        this.searchValue = searchValue;
        return this;
    }
}
