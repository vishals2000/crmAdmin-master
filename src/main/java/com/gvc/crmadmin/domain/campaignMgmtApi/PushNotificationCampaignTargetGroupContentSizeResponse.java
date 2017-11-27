package com.gvc.crmadmin.domain.campaignMgmtApi;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;
import org.apache.commons.lang3.builder.ToStringBuilder;
import org.apache.commons.lang3.builder.ToStringStyle;

import java.io.Serializable;

@JsonIgnoreProperties(ignoreUnknown = true)
public class PushNotificationCampaignTargetGroupContentSizeResponse implements Serializable {

    private static final long serialVersionUID = 8982180979912433673L;

    @JsonProperty("targetGroupSize")
    private long targetGroupSize;

    @Override
    public String toString() {
        return ToStringBuilder.reflectionToString(this, ToStringStyle.SHORT_PREFIX_STYLE);
    }

    public long getTargetGroupSize() {
        return targetGroupSize;
    }

    public void setTargetGroupSize(long targetGroupSize) {
        this.targetGroupSize = targetGroupSize;
    }
}
