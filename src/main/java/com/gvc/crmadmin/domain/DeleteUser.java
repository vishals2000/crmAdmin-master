package com.gvc.crmadmin.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;
import org.apache.commons.lang3.builder.ToStringBuilder;
import org.apache.commons.lang3.builder.ToStringStyle;

/**
 * Created by Sai Sharath Palivela on 08-12-2017.
 */
@JsonIgnoreProperties(ignoreUnknown = true)
public class DeleteUser {
    @JsonProperty("userId")
    private String userId;

    public String getUserId() {
        return userId;
    }

    public DeleteUser setUserId(String userId) {
        this.userId = userId;
        return this;
    }

    @Override
    public String toString() {
        return ToStringBuilder.reflectionToString(this, ToStringStyle.SHORT_PREFIX_STYLE);
    }
}
