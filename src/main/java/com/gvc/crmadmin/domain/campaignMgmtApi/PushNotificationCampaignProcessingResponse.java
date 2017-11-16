package com.gvc.crmadmin.domain.campaignMgmtApi;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;
import org.apache.commons.lang3.builder.ToStringBuilder;
import org.apache.commons.lang3.builder.ToStringStyle;

import java.io.Serializable;

/**
 * This represents the push notification campaign template
 * Created by Sai Sharath Palivela on 11-07-2017.
 */
@JsonIgnoreProperties(ignoreUnknown = true)
public class PushNotificationCampaignProcessingResponse implements Serializable {

    private static final long serialVersionUID = -1755642292870779713L;

    @JsonProperty("message")
    private String message;

    @JsonProperty("result")
    private boolean result;

    public PushNotificationCampaignProcessingResponse() {
    }

    public PushNotificationCampaignProcessingResponse(String message, boolean result) {
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

    public PushNotificationCampaignProcessingResponse setMessage(String message) {
        this.message = message;
        return this;
    }

    public boolean isResult() {
        return result;
    }

    public PushNotificationCampaignProcessingResponse setResult(boolean result) {
        this.result = result;
        return this;
    }
}
