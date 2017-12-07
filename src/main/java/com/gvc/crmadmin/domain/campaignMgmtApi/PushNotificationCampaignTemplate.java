package com.gvc.crmadmin.domain.campaignMgmtApi;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.gvc.crmadmin.domain.MessageTemplate;
import com.gvc.crmadmin.domain.enumeration.Product;
import com.gvc.crmadmin.domain.fcm.RecurrenceDetail;
import org.apache.commons.lang3.builder.ToStringBuilder;
import org.apache.commons.lang3.builder.ToStringStyle;

import java.io.Serializable;
import java.util.List;

/**
 * This represents the push notification campaign template
 * Created by Sai Sharath Palivela on 11-07-2017.
 */
@JsonIgnoreProperties(ignoreUnknown = true)
public class PushNotificationCampaignTemplate implements Serializable {

    private static final long serialVersionUID = 1872803923783260373L;

    @JsonProperty("product")
    private Product product;

    @JsonProperty("frontEnd")
    private String frontEnd;

    @JsonProperty("campaignName")
    private String campaignName;

    @JsonProperty("targetGroupFilterCriteria")
    private List<TargetGroupFilterCriterion> targetGroupFilterCriterionList;

    @JsonProperty("targetGroupContentCriteria")
    private List<MessageTemplate> targetGroupContentCriteria;

    @JsonProperty("contentName")
    private String contentName;

    @JsonProperty("contentTitle")
    private String contentTitle;

    @JsonProperty("contentBody")
    private String contentBody;

    @JsonProperty("metaData")
    private String metaData;

    @JsonProperty("languageSelected")
    private String language;

    /**
     * In yyyy-MM-dd format
     * */
    @JsonProperty("startDate")
    private String startDate;

    /**
     * In yyyy-MM-dd format
     * */
    @JsonProperty("recurrenceEndDate")
    private String recurrenceEndDate;

    @JsonProperty("recurrenceType")
    private RecurrenceDetail.Type recurrenceType;

    @JsonProperty("inPlayerTimezone")
    private boolean inPlayerTimezone;

    @JsonProperty("scheduledTime")
    private String scheduledTime;

    @JsonProperty("id")
    private String campaignTemplateId;

    public String getFrontEnd() {
        return frontEnd;
    }

    public void setFrontEnd(String frontEnd) {
        this.frontEnd = frontEnd;
    }

    public String getCampaignName() {
        return campaignName;
    }

    public void setCampaignName(String campaignName) {
        this.campaignName = campaignName;
    }

    public Product getProduct() {
        return product;
    }

    public void setProduct(Product product) {
        this.product = product;
    }

    public List<TargetGroupFilterCriterion> getTargetGroupFilterCriterionList() {
        return targetGroupFilterCriterionList;
    }

    public PushNotificationCampaignTemplate setTargetGroupFilterCriterionList(List<TargetGroupFilterCriterion> targetGroupFilterCriterionList) {
        this.targetGroupFilterCriterionList = targetGroupFilterCriterionList;
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

    public String getContentName() {
        return contentName;
    }

    public void setContentName(String contentName) {
        this.contentName = contentName;
    }

    public String getContentTitle() {
        return contentTitle;
    }

    public void setContentTitle(String contentTitle) {
        this.contentTitle = contentTitle;
    }

    public String getContentBody() {
        return contentBody;
    }

    public void setContentBody(String contentBody) {
        this.contentBody = contentBody;
    }

    public String getMetaData() {
        return metaData;
    }

    public void setMetaData(String metaData) {
        this.metaData = metaData;
    }

    public String getLanguage() {
        return language;
    }

    public void setLanguage(String language) {
        this.language = language;
    }

    public String getStartDate() {
        return startDate;
    }

    public void setStartDate(String startDate) {
        this.startDate = startDate;
    }

    public String getRecurrenceEndDate() {
        return recurrenceEndDate;
    }

    public void setRecurrenceEndDate(String recurrenceEndDate) {
        this.recurrenceEndDate = recurrenceEndDate;
    }

    public RecurrenceDetail.Type getRecurrenceType() {
        return recurrenceType;
    }

    public void setRecurrenceType(RecurrenceDetail.Type recurrenceType) {
        this.recurrenceType = recurrenceType;
    }

    @Override
    public String toString() {
        return ToStringBuilder.reflectionToString(this, ToStringStyle.SHORT_PREFIX_STYLE);
    }

    public String getCampaignTemplateId() {
        return campaignTemplateId;
    }

    public void setCampaignTemplateId(String campaignTemplateId) {
        this.campaignTemplateId = campaignTemplateId;
    }

    public List<MessageTemplate> getTargetGroupContentCriteria() {
        return targetGroupContentCriteria;
    }

    public void setTargetGroupContentCriteria(List<MessageTemplate> targetGroupContentCriteria) {
        this.targetGroupContentCriteria = targetGroupContentCriteria;
    }
}
