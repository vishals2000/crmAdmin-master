package com.gvc.crmadmin.domain.fcm;

import com.gvc.crmadmin.domain.MessageContent;
import com.gvc.crmadmin.domain.TargetGroupCriteria;
import com.gvc.crmadmin.domain.enumeration.Product;
import org.apache.commons.lang3.builder.ToStringBuilder;
import org.apache.commons.lang3.builder.ToStringStyle;

import java.io.Serializable;
import java.util.List;

/**
 * Created by Sai Sharath Palivela on 26-09-2017.
 */
public class PushNotificationCampaignTemplate implements Serializable {

    private static final long serialVersionUID = -3455522384530906380L;

    private Product product;
    private String frontEnd;
    private String campaignName;
    private String campaignDescription;
    private List<MessageContent> messageContentList;
    private List<TargetGroupCriteria.TargetGroupFilterCriterion> targetGroupFilterCriterionList;
    private RecurrenceDetail recurrenceDetail;
    private boolean inPlayerTimezone;
    private String scheduledTime;

    public Product getProduct() {
        return product;
    }

    public PushNotificationCampaignTemplate setProduct(Product product) {
        this.product = product;
        return this;
    }

    public String getFrontEnd() {
        return frontEnd;
    }

    public PushNotificationCampaignTemplate setFrontEnd(String frontEnd) {
        this.frontEnd = frontEnd;
        return this;
    }

    public String getCampaignName() {
        return campaignName;
    }

    public PushNotificationCampaignTemplate setCampaignName(String campaignName) {
        this.campaignName = campaignName;
        return this;
    }

    public String getCampaignDescription() {
        return campaignDescription;
    }

    public PushNotificationCampaignTemplate setCampaignDescription(String campaignDescription) {
        this.campaignDescription = campaignDescription;
        return this;
    }

    public List<MessageContent> getMessageContentList() {
        return messageContentList;
    }

    public PushNotificationCampaignTemplate setMessageContentList(List<MessageContent> messageContentList) {
        this.messageContentList = messageContentList;
        return this;
    }

    public List<TargetGroupCriteria.TargetGroupFilterCriterion> getTargetGroupFilterCriterionList() {
        return targetGroupFilterCriterionList;
    }

    public PushNotificationCampaignTemplate setTargetGroupFilterCriterionList(List<TargetGroupCriteria.TargetGroupFilterCriterion> targetGroupFilterCriterionList) {
        this.targetGroupFilterCriterionList = targetGroupFilterCriterionList;
        return this;
    }

    public RecurrenceDetail getRecurrenceDetail() {
        return recurrenceDetail;
    }

    public PushNotificationCampaignTemplate setRecurrenceDetail(RecurrenceDetail recurrenceDetail) {
        this.recurrenceDetail = recurrenceDetail;
        return this;
    }

    public boolean isInPlayerTimezone() {
        return inPlayerTimezone;
    }

    public PushNotificationCampaignTemplate setInPlayerTimezone(boolean inPlayerTimezone) {
        this.inPlayerTimezone = inPlayerTimezone;
        return this;
    }

    public String getScheduledTime() {
        return scheduledTime;
    }

    public PushNotificationCampaignTemplate setScheduledTime(String scheduledTime) {
        this.scheduledTime = scheduledTime;
        return this;
    }

    @Override
    public String toString() {
        return ToStringBuilder.reflectionToString(this, ToStringStyle.SHORT_PREFIX_STYLE);
    }
}
