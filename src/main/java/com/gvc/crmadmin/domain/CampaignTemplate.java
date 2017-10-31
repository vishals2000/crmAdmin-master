package com.gvc.crmadmin.domain;

import com.gvc.crmadmin.domain.enumeration.Product;
import com.gvc.crmadmin.domain.enumeration.RecurrenceType;
import com.gvc.crmadmin.service.util.Utils;
import org.apache.commons.lang3.builder.ToStringBuilder;
import org.apache.commons.lang3.builder.ToStringStyle;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;

import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;
import java.io.Serializable;
import java.time.LocalDate;
import java.util.Objects;

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
    @Field("frontEnd")
    private String frontEnd;

    @NotNull
    @Field("product")
    private Product product;

    @NotNull
    @Field("campaignName")
    private String campaignName;

    @Field("campaignDescription")
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

    // jhipster-needle-entity-add-field - Jhipster will add fields here, do not remove
    public String getId() {
        this.initialize();
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
        this.initialize();
        return this;
    }

    public void setCampaignName(String campaignName) {
        this.campaignName = campaignName;
        this.initialize();
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

    private void initialize() {
        StringBuilder sb = new StringBuilder(10);
        sb.append(getFrontEnd()).append(Utils.UNDER_SCORE);
        sb.append(getProduct().name()).append(Utils.UNDER_SCORE);
        sb.append(getCampaignName());
        setId(sb.toString());
    }

    @Override
    public String toString() {
        return ToStringBuilder.reflectionToString(this, ToStringStyle.SHORT_PREFIX_STYLE);
    }
}
