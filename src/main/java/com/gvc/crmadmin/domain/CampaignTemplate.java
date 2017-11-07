package com.gvc.crmadmin.domain;

import com.gvc.crmadmin.domain.enumeration.FilterOption;
import com.gvc.crmadmin.domain.enumeration.FilterOptionComparison;
import com.gvc.crmadmin.domain.enumeration.LanguageComparision;
import com.gvc.crmadmin.domain.enumeration.RecurrenceType;
import com.gvc.crmadmin.service.util.Utils;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;

import javax.validation.constraints.NotNull;
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
    @Field("scheduled_time")
    private String scheduledTime;

    @Field("in_player_timezone")
    private Boolean inPlayerTimezone;

    @Field("campaign_group_id")
    private String campaignGroupId;

    @Field("filter_option")
    private FilterOption filterOption;

    @Field("filter_option_comparison")
    private FilterOptionComparison filterOptionComparison;

    @Field("filter_option_value")
    private String filterOptionValue;

    @Field("content_name")
    private String contentName;

    @Field("content_title")
    private String contentTitle;

    @Field("content_body")
    private String contentBody;

    @Field("meta_data")
    private String metaData;

    @Field("language_comparision")
    private LanguageComparision languageComparision;

    // jhipster-needle-entity-add-field - Jhipster will add fields here, do not remove
    public String getId() {
        this.initialize();
        return id;
    }

    private void initialize() {
        StringBuilder sb = new StringBuilder(10);
        sb.append(getCampaignGroupId()).append(Utils.UNDER_SCORE);
        sb.append(getCampaignName());
        setId(sb.toString());
    }

    public void setId(String id) {
        this.id = id;
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

    public FilterOption getFilterOption() {
        return filterOption;
    }

    public CampaignTemplate filterOption(FilterOption filterOption) {
        this.filterOption = filterOption;
        return this;
    }

    public void setFilterOption(FilterOption filterOption) {
        this.filterOption = filterOption;
    }

    public FilterOptionComparison getFilterOptionComparison() {
        return filterOptionComparison;
    }

    public CampaignTemplate filterOptionComparison(FilterOptionComparison filterOptionComparison) {
        this.filterOptionComparison = filterOptionComparison;
        return this;
    }

    public void setFilterOptionComparison(FilterOptionComparison filterOptionComparison) {
        this.filterOptionComparison = filterOptionComparison;
    }

    public String getFilterOptionValue() {
        return filterOptionValue;
    }

    public CampaignTemplate filterOptionValue(String filterOptionValue) {
        this.filterOptionValue = filterOptionValue;
        return this;
    }

    public void setFilterOptionValue(String filterOptionValue) {
        this.filterOptionValue = filterOptionValue;
    }

    public String getContentName() {
        return contentName;
    }

    public CampaignTemplate contentName(String contentName) {
        this.contentName = contentName;
        return this;
    }

    public void setContentName(String contentName) {
        this.contentName = contentName;
    }

    public String getContentTitle() {
        return contentTitle;
    }

    public CampaignTemplate contentTitle(String contentTitle) {
        this.contentTitle = contentTitle;
        return this;
    }

    public void setContentTitle(String contentTitle) {
        this.contentTitle = contentTitle;
    }

    public String getContentBody() {
        return contentBody;
    }

    public CampaignTemplate contentBody(String contentBody) {
        this.contentBody = contentBody;
        return this;
    }

    public void setContentBody(String contentBody) {
        this.contentBody = contentBody;
    }

    public String getMetaData() {
        return metaData;
    }

    public CampaignTemplate metaData(String metaData) {
        this.metaData = metaData;
        return this;
    }

    public void setMetaData(String metaData) {
        this.metaData = metaData;
    }

    public LanguageComparision getLanguageComparision() {
        return languageComparision;
    }

    public CampaignTemplate languageComparision(LanguageComparision languageComparision) {
        this.languageComparision = languageComparision;
        return this;
    }

    public void setLanguageComparision(LanguageComparision languageComparision) {
        this.languageComparision = languageComparision;
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
            ", campaignName='" + getCampaignName() + "'" +
            ", campaignDescription='" + getCampaignDescription() + "'" +
            ", startDate='" + getStartDate() + "'" +
            ", recurrenceType='" + getRecurrenceType() + "'" +
            ", recurrenceEndDate='" + getRecurrenceEndDate() + "'" +
            ", scheduledTime='" + getScheduledTime() + "'" +
            ", inPlayerTimezone='" + isInPlayerTimezone() + "'" +
            ", campaignGroupId='" + getCampaignGroupId() + "'" +
            ", filterOption='" + getFilterOption() + "'" +
            ", filterOptionComparison='" + getFilterOptionComparison() + "'" +
            ", filterOptionValue='" + getFilterOptionValue() + "'" +
            ", contentName='" + getContentName() + "'" +
            ", contentTitle='" + getContentTitle() + "'" +
            ", contentBody='" + getContentBody() + "'" +
            ", metaData='" + getMetaData() + "'" +
            ", languageComparision='" + getLanguageComparision() + "'" +
            "}";
    }
}
