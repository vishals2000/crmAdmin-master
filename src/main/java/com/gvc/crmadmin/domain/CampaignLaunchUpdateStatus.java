package com.gvc.crmadmin.domain;

import org.apache.commons.lang3.builder.ToStringBuilder;
import org.apache.commons.lang3.builder.ToStringStyle;

import java.io.Serializable;

public class CampaignLaunchUpdateStatus implements Serializable {

    private static final long serialVersionUID = 8905094387423342718L;

    private final boolean result;
    private final String message;

    public CampaignLaunchUpdateStatus(boolean result, String message) {
        this.result = result;
        this.message = message;
    }

    @Override
    public String toString() {
        return ToStringBuilder.reflectionToString(this, ToStringStyle.SHORT_PREFIX_STYLE);
    }

    public boolean isResult() {
        return result;
    }

    public String getMessage() {
        return message;
    }
}
