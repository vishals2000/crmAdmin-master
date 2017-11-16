package com.gvc.crmadmin.domain.campaignMgmtApi;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;
import org.apache.commons.lang3.builder.ToStringBuilder;
import org.apache.commons.lang3.builder.ToStringStyle;

import java.io.Serializable;
import java.util.List;

@JsonIgnoreProperties(ignoreUnknown = true)
public class PushNotificationCampaignTargetGroupSizeRequest implements Serializable {

    private static final long serialVersionUID = 3755581428441279097L;

    @JsonProperty("targetGroupFilterCriteria")
    private List<TargetGroupFilterCriterion> targetGroupFilterCriteria;
    @JsonProperty("product")
    private String product;
    @JsonProperty("frontEnd")
    private String frontEnd;

    public List<TargetGroupFilterCriterion> getTargetGroupFilterCriteria() {
        return targetGroupFilterCriteria;
    }

    public PushNotificationCampaignTargetGroupSizeRequest setTargetGroupFilterCriteria(List<TargetGroupFilterCriterion> targetGroupFilterCriteria) {
        this.targetGroupFilterCriteria = targetGroupFilterCriteria;
        return this;
    }

    public String getProduct() {
        return product;
    }

    public PushNotificationCampaignTargetGroupSizeRequest setProduct(String product) {
        this.product = product;
        return this;
    }

    public String getFrontEnd() {
        return frontEnd;
    }

    public PushNotificationCampaignTargetGroupSizeRequest setFrontEnd(String frontEnd) {
        this.frontEnd = frontEnd;
        return this;
    }

    @Override
    public String toString() {
        return ToStringBuilder.reflectionToString(this, ToStringStyle.SHORT_PREFIX_STYLE);
    }
}
