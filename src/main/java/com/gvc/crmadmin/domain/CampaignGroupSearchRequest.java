package com.gvc.crmadmin.domain;

import com.fasterxml.jackson.annotation.JsonProperty;
import org.apache.commons.lang3.builder.ToStringBuilder;
import org.apache.commons.lang3.builder.ToStringStyle;

import java.io.Serializable;

public class CampaignGroupSearchRequest implements Serializable {
    private static final long serialVersionUID = -6394085513036299027L;

    @JsonProperty("appId")
    private String appId;

    @JsonProperty("searchValue")
    private String searchValue;

    @Override
    public String toString() {
        return ToStringBuilder.reflectionToString(this, ToStringStyle.SHORT_PREFIX_STYLE);
    }

    public String getSearchValue() {
        return searchValue;
    }

    public CampaignGroupSearchRequest setSearchValue(String searchValue) {
        this.searchValue = searchValue;
        return this;
    }

    public String getAppId() {
        return appId;
    }

    public CampaignGroupSearchRequest setAppId(String appId) {
        this.appId = appId;
        return this;
    }
}
