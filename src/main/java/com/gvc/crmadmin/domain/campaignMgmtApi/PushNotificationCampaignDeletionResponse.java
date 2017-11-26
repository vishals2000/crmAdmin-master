package com.gvc.crmadmin.domain.campaignMgmtApi;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;
import org.apache.commons.lang3.builder.ToStringBuilder;
import org.apache.commons.lang3.builder.ToStringStyle;

import java.io.Serializable;

@JsonIgnoreProperties(ignoreUnknown = true)
public class PushNotificationCampaignDeletionResponse implements Serializable {

    private static final long serialVersionUID = -3645987362294445892L;

    @JsonProperty("message")
    private String message;

    @JsonProperty("result")
    private boolean result;

    public PushNotificationCampaignDeletionResponse() {
    }

    public PushNotificationCampaignDeletionResponse(String message, boolean result) {
        this.message = message;
        this.result = result;
    }

    @Override
    public String toString() {
        return ToStringBuilder.reflectionToString(this, ToStringStyle.SHORT_PREFIX_STYLE);
    }

    public String getMessage() {
        return message;
    }

    public PushNotificationCampaignDeletionResponse setMessage(String message) {
        this.message = message;
        return this;
    }

    public boolean isResult() {
        return result;
    }

    public PushNotificationCampaignDeletionResponse setResult(boolean result) {
        this.result = result;
        return this;
    }
}
