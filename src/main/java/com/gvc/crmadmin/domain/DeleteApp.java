package com.gvc.crmadmin.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;
import org.apache.commons.lang3.builder.ToStringBuilder;
import org.apache.commons.lang3.builder.ToStringStyle;

/**
 * Created by Sai Sharath Palivela on 08-12-2017.
 */
@JsonIgnoreProperties(ignoreUnknown = true)
public class DeleteApp {
    @JsonProperty("appId")
    private String appId;

    public String getAppId() {
        return appId;
    }

    public DeleteApp setAppId(String appId) {
        this.appId = appId;
        return this;
    }

    @Override
    public String toString() {
        return ToStringBuilder.reflectionToString(this, ToStringStyle.SHORT_PREFIX_STYLE);
    }
}
