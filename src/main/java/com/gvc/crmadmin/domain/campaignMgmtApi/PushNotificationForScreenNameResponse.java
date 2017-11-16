package com.gvc.crmadmin.domain.campaignMgmtApi;

import org.apache.commons.lang3.builder.ToStringBuilder;
import org.apache.commons.lang3.builder.ToStringStyle;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;
import java.io.Serializable;

@JsonIgnoreProperties(ignoreUnknown = true)
public class PushNotificationForScreenNameResponse implements Serializable {

    private static final long serialVersionUID = 5489901265826176515L;

    @JsonProperty("message")
    private String message;

    @JsonProperty("result")
    private boolean result;

    public PushNotificationForScreenNameResponse() {
    }

    public PushNotificationForScreenNameResponse(String message, boolean result) {
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

    public void setMessage(String message) {
        this.message = message;
    }

    public boolean isResult() {
        return result;
    }

    public void setResult(boolean result) {
        this.result = result;
    }
}
