package com.gvc.crmadmin.domain;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;
import javax.validation.constraints.*;
import java.io.Serializable;
import java.time.LocalDate;
import java.util.Objects;

import com.gvc.crmadmin.domain.enumeration.Product;

import com.gvc.crmadmin.domain.enumeration.RecurrenceType;

/**
 * A CampaignTemplate.
 */
@Document(collection = "campaign_template")
public class CampaignTemplate implements Serializable {

    private static final long serialVersionUID = 1L;
    @Id
    private String id;

    @NotNull
    @Size(min = 2, max = 2)
    @Field("front_end")
    private String frontEnd;

    @NotNull
    @Field("product")
    private Product product;

    @NotNull
    @Field("campaign_name")
    private String campaignName;

    @Field("campaign_description")
    private String campaignDescription;

    @NotNull
    @Field("start_date")
    private LocalDate startDate;

    @NotNull
    @Field("recurrence_type")
    private RecurrenceType recurrenceType;

    @NotNull
    @Field("recurrence_end_date")
    private LocalDate recurrenceEndDate;

    @NotNull
    @Field("message_content_id")
    private String messageContentId;

    @NotNull
    @Field("target_group_id")
    private String targetGroupId;

    @NotNull
    @Field("scheduled_time")
    private String scheduledTime;

    @Field("in_player_timezone")
    private Boolean inPlayerTimezone;

    @Field("campaign_group_id")
    private String campaignGroupId;

    // jhipster-needle-entity-add-field - Jhipster will add fields here, do not remove
    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getFrontEnd() {
        return frontEnd;
    }

    public CampaignTemplate frontEnd(String frontEnd) {
        this.frontEnd = frontEnd;
        return this;
    }

    public void setFrontEnd(String frontEnd) {
        this.frontEnd = frontEnd;
    }

    public Product getProduct() {
        return product;
    }

    public CampaignTemplate product(Product product) {
        this.product = product;
        return this;
    }

    public void setProduct(Product product) {
        this.product = product;
    }

    public String getCampaignName() {
        return campaignName;
    }

    public CampaignTemplate campaignName(String campaignName) {
        this.campaignName = campaignName;
        return this;
    }

    public void setCampaignName(String campaignName) {
        this.campaignName = campaignName;
    }

    public String getCampaignDescription() {
        return campaignDescription;
    }

    public CampaignTemplate campaignDescription(String campaignDescription) {
        this.campaignDescription = campaignDescription;
        return this;
    }

    public void setCampaignDescription(String campaignDescription) {
        this.campaignDescription = campaignDescription;
    }

    public LocalDate getStartDate() {
        return startDate;
    }

    public CampaignTemplate startDate(LocalDate startDate) {
        this.startDate = startDate;
        return this;
    }

    public void setStartDate(LocalDate startDate) {
        this.startDate = startDate;
    }

    public RecurrenceType getRecurrenceType() {
        return recurrenceType;
    }

    public CampaignTemplate recurrenceType(RecurrenceType recurrenceType) {
        this.recurrenceType = recurrenceType;
        return this;
    }

    public void setRecurrenceType(RecurrenceType recurrenceType) {
        this.recurrenceType = recurrenceType;
    }

    public LocalDate getRecurrenceEndDate() {
        return recurrenceEndDate;
    }

    public CampaignTemplate recurrenceEndDate(LocalDate recurrenceEndDate) {
        this.recurrenceEndDate = recurrenceEndDate;
        return this;
    }

    public void setRecurrenceEndDate(LocalDate recurrenceEndDate) {
        this.recurrenceEndDate = recurrenceEndDate;
    }

    public String getMessageContentId() {
        return messageContentId;
    }

    public CampaignTemplate messageContentId(String messageContentId) {
        this.messageContentId = messageContentId;
        return this;
    }

    public void setMessageContentId(String messageContentId) {
        this.messageContentId = messageContentId;
    }

    public String getTargetGroupId() {
        return targetGroupId;
    }

    public CampaignTemplate targetGroupId(String targetGroupId) {
        this.targetGroupId = targetGroupId;
        return this;
    }

    public void setTargetGroupId(String targetGroupId) {
        this.targetGroupId = targetGroupId;
    }

    public String getScheduledTime() {
        return scheduledTime;
    }

    public CampaignTemplate scheduledTime(String scheduledTime) {
        this.scheduledTime = scheduledTime;
        return this;
    }

    public void setScheduledTime(String scheduledTime) {
        this.scheduledTime = scheduledTime;
    }

    public Boolean isInPlayerTimezone() {
        return inPlayerTimezone;
    }

    public CampaignTemplate inPlayerTimezone(Boolean inPlayerTimezone) {
        this.inPlayerTimezone = inPlayerTimezone;
        return this;
    }

    public void setInPlayerTimezone(Boolean inPlayerTimezone) {
        this.inPlayerTimezone = inPlayerTimezone;
    }

    public String getCampaignGroupId() {
        return campaignGroupId;
    }

    public CampaignTemplate campaignGroupId(String campaignGroupId) {
        this.campaignGroupId = campaignGroupId;
        return this;
    }

    public void setCampaignGroupId(String campaignGroupId) {
        this.campaignGroupId = campaignGroupId;
    }
    // jhipster-needle-entity-add-getters-setters - Jhipster will add getters and setters here, do not remove

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (o == null || getClass() != o.getClass()) {
            return false;
        }
        CampaignTemplate campaignTemplate = (CampaignTemplate) o;
        if (campaignTemplate.getId() == null || getId() == null) {
            return false;
        }
        return Objects.equals(getId(), campaignTemplate.getId());
    }

    @Override
    public int hashCode() {
        return Objects.hashCode(getId());
    }

    @Override
    public String toString() {
        return "CampaignTemplate{" +
            "id=" + getId() +
            ", frontEnd='" + getFrontEnd() + "'" +
            ", product='" + getProduct() + "'" +
            ", campaignName='" + getCampaignName() + "'" +
            ", campaignDescription='" + getCampaignDescription() + "'" +
            ", startDate='" + getStartDate() + "'" +
            ", recurrenceType='" + getRecurrenceType() + "'" +
            ", recurrenceEndDate='" + getRecurrenceEndDate() + "'" +
            ", messageContentId='" + getMessageContentId() + "'" +
            ", targetGroupId='" + getTargetGroupId() + "'" +
            ", scheduledTime='" + getScheduledTime() + "'" +
            ", inPlayerTimezone='" + isInPlayerTimezone() + "'" +
            ", campaignGroupId='" + getCampaignGroupId() + "'" +
            "}";
    }
}
