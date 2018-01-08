package com.gvc.crmadmin.domain.campaignMgmtApi;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;
import org.apache.commons.lang3.builder.ToStringBuilder;
import org.apache.commons.lang3.builder.ToStringStyle;

import java.io.Serializable;
import java.util.List;

@JsonIgnoreProperties(ignoreUnknown = true)
public class PushNotificationCampaignTargetGroupContentSizeRequest implements Serializable {
    private static final long serialVersionUID = -1943118134535161334L;

    @JsonProperty("targetGroupFilterCriteria")
    private List<TargetGroupFilterCriterion> targetGroupFilterCriteria;

    @JsonProperty("product")
    private String product;

    @JsonProperty("frontEnd")
    private String frontEnd;

    @JsonProperty("language")
    private String language;

    @JsonProperty("retargetedCampaign")
    private boolean retargetedCampaign;

    @JsonProperty("parentCampaignTemplateId")
    private String parentCampaignTemplateId;

    public List<TargetGroupFilterCriterion> getTargetGroupFilterCriteria() {
        return targetGroupFilterCriteria;
    }

    public PushNotificationCampaignTargetGroupContentSizeRequest setTargetGroupFilterCriteria(List<TargetGroupFilterCriterion> targetGroupFilterCriteria) {
        this.targetGroupFilterCriteria = targetGroupFilterCriteria;
        return this;
    }

    public String getProduct() {
        return product;
    }

    public PushNotificationCampaignTargetGroupContentSizeRequest setProduct(String product) {
        this.product = product;
        return this;
    }

    public String getFrontEnd() {
        return frontEnd;
    }

    public PushNotificationCampaignTargetGroupContentSizeRequest setFrontEnd(String frontEnd) {
        this.frontEnd = frontEnd;
        return this;
    }

    @Override
    public String toString() {
        return ToStringBuilder.reflectionToString(this, ToStringStyle.SHORT_PREFIX_STYLE);
    }

    public String getLanguage() {
        return language;
    }

    public void setLanguage(String language) {
        this.language = language;
    }

    public boolean isRetargetedCampaign() {
        return retargetedCampaign;
    }

    public PushNotificationCampaignTargetGroupContentSizeRequest setRetargetedCampaign(boolean retargetedCampaign) {
        this.retargetedCampaign = retargetedCampaign;
        return this;
    }

    public String getParentCampaignTemplateId() {
        return parentCampaignTemplateId;
    }

    public PushNotificationCampaignTargetGroupContentSizeRequest setParentCampaignTemplateId(String parentCampaignTemplateId) {
        this.parentCampaignTemplateId = parentCampaignTemplateId;
        return this;
    }
}
