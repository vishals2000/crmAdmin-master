package com.gvc.crmadmin.domain;

import com.gvc.crmadmin.domain.enumeration.FilterOption;
import com.gvc.crmadmin.domain.enumeration.FilterOptionComparison;
import com.gvc.crmadmin.domain.enumeration.RecurrenceType;
import com.gvc.crmadmin.service.util.Utils;
import org.apache.commons.lang3.builder.ToStringBuilder;
import org.apache.commons.lang3.builder.ToStringStyle;
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

    @Field("start_date")
    private LocalDate startDate;

    @NotNull
    @Field("recurrence_type")
    private RecurrenceType recurrenceType;

    @Field("recurrence_end_date")
    private LocalDate recurrenceEndDate;

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

    @Field("targetGroupContentCriteria")
    private MessageTemplate[] targetGroupContentCriteria;

    @Field("meta_data")
    private String metaData;

    @Field("status")
    private String status;

    @Field("alreadyLaunched")
    private boolean alreadyLaunched;

    @Field("alreadyCancelled")
    private boolean alreadyCancelled;

    @Field("alreadyDeleted")
    private boolean alreadyDeleted;

    @Field("launchEnabled")
    private boolean launchEnabled;

    @Field("editEnabled")
    private boolean editEnabled;

    @Field("cancelEnabled")
    private boolean cancelEnabled;

    @Field("deleteEnabled")
    private boolean deleteEnabled;

    @Field("sendImmediately")
    private boolean sendImmediately;

    @Field("pushToOptimoveInstances")
    private boolean pushToOptimoveInstances;

    @Field("targetGroupFilterCriteria")
    private TargetGroupCriteria.TargetGroupFilterCriterion[] targetGroupFilterCriteria;

    @Field("targetGroupMetaData")
    private LiveOddsMetaData[] targetGroupMetaData;

    @Field("modifiedAt")
    private String modifiedAt;

    @Field("retargetedCampaign")
    private boolean retargetedCampaign;

    @Field("parentCampaignId")
    private String parentCampaignTemplateId;

    @Field("frontEnd")
    private String frontEnd;

    @Field("product")
    private String product;

    private String launchTime;
    private String cancellationTime;
    private String deletionTime;


    // jhipster-needle-entity-add-field - Jhipster will add fields here, do not remove
    public String getId() {
        if(this.id == null) {
            this.initialize();
        }
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

    public Boolean getInPlayerTimezone() {
        return inPlayerTimezone;
    }

    public TargetGroupCriteria.TargetGroupFilterCriterion[] getTargetGroupFilterCriteria() {
        return targetGroupFilterCriteria;
    }

    public void setTargetGroupFilterCriteria(TargetGroupCriteria.TargetGroupFilterCriterion[] targetGroupFilterCriteria) {
        this.targetGroupFilterCriteria = targetGroupFilterCriteria;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public boolean isLaunchEnabled() {
        return launchEnabled;
    }

    public void setLaunchEnabled(boolean launchEnabled) {
        this.launchEnabled = launchEnabled;
    }

    public boolean isAlreadyLaunched() {
        return alreadyLaunched;
    }

    public void setAlreadyLaunched(boolean alreadyLaunched) {
        this.alreadyLaunched = alreadyLaunched;
    }

    public boolean isEditEnabled() {
        return editEnabled;
    }

    public void setEditEnabled(boolean editEnabled) {
        this.editEnabled = editEnabled;
    }

    public boolean isCancelEnabled() {
        return cancelEnabled;
    }

    public void setCancelEnabled(boolean cancelEnabled) {
        this.cancelEnabled = cancelEnabled;
    }

    public boolean isDeleteEnabled() {
        return deleteEnabled;
    }

    public void setDeleteEnabled(boolean deleteEnabled) {
        this.deleteEnabled = deleteEnabled;
    }

    public boolean isAlreadyCancelled() {
        return alreadyCancelled;
    }

    public void setAlreadyCancelled(boolean alreadyCancelled) {
        this.alreadyCancelled = alreadyCancelled;
    }

    public boolean isAlreadyDeleted() {
        return alreadyDeleted;
    }

    public void setAlreadyDeleted(boolean alreadyDeleted) {
        this.alreadyDeleted = alreadyDeleted;
    }

    @Override
    public String toString() {
        return ToStringBuilder.reflectionToString(this, ToStringStyle.SHORT_PREFIX_STYLE);
    }

    public boolean isSendImmediately() {
        return sendImmediately;
    }

    public void setSendImmediately(boolean sendImmediately) {
        this.sendImmediately = sendImmediately;
    }

    public MessageTemplate[] getTargetGroupContentCriteria() {
        return targetGroupContentCriteria;
    }

    public void setTargetGroupContentCriteria(MessageTemplate[] targetGroupContentCriteria) {
        this.targetGroupContentCriteria = targetGroupContentCriteria;
    }

    public boolean isPushToOptimoveInstances() {
        return pushToOptimoveInstances;
    }

    public void setPushToOptimoveInstances(boolean pushToOptimoveInstances) {
        this.pushToOptimoveInstances = pushToOptimoveInstances;
    }

    public LiveOddsMetaData[] getTargetGroupMetaData() {
        return targetGroupMetaData;
    }

    public CampaignTemplate setTargetGroupMetaData(LiveOddsMetaData[] targetGroupMetaData) {
        this.targetGroupMetaData = targetGroupMetaData;
        return this;
    }

    public String getModifiedAt() {
        return modifiedAt;
    }

    public CampaignTemplate setModifiedAt(String modifiedAt) {
        this.modifiedAt = modifiedAt;
        return this;
    }

    public String getLaunchTime() {
        return launchTime;
    }

    public CampaignTemplate setLaunchTime(String launchTime) {
        this.launchTime = launchTime;
        return this;
    }

    public String getCancellationTime() {
        return cancellationTime;
    }

    public CampaignTemplate setCancellationTime(String cancellationTime) {
        this.cancellationTime = cancellationTime;
        return this;
    }

    public String getDeletionTime() {
        return deletionTime;
    }

    public CampaignTemplate setDeletionTime(String deletionTime) {
        this.deletionTime = deletionTime;
        return this;
    }

    public CampaignTemplate copy() {
        CampaignTemplate campaignTemplate = new CampaignTemplate();
        campaignTemplate.setCampaignName(this.getCampaignName());
        campaignTemplate.setStatus(this.getStatus());
        campaignTemplate.setCancelEnabled(this.isCancelEnabled());
        campaignTemplate.setDeleteEnabled(this.isDeleteEnabled());
        campaignTemplate.setEditEnabled(this.isEditEnabled());
        campaignTemplate.setLaunchEnabled(this.isLaunchEnabled());
        campaignTemplate.setModifiedAt(this.getModifiedAt());
        campaignTemplate.setAlreadyLaunched(this.isAlreadyLaunched());
        campaignTemplate.setRecurrenceEndDate(this.getRecurrenceEndDate());
        campaignTemplate.setRecurrenceType(this.getRecurrenceType());
        campaignTemplate.setScheduledTime(this.getScheduledTime());
        campaignTemplate.setStartDate(this.getStartDate());
        campaignTemplate.setAlreadyCancelled(this.isAlreadyCancelled());
        campaignTemplate.setAlreadyDeleted(this.isAlreadyDeleted());
        campaignTemplate.setCampaignGroupId(this.getCampaignGroupId());
        campaignTemplate.setCancellationTime(this.getCancellationTime());
        campaignTemplate.setDeletionTime(this.getDeletionTime());
        campaignTemplate.setFilterOption(this.getFilterOption());
        campaignTemplate.setFilterOptionComparison(this.getFilterOptionComparison());
        campaignTemplate.setFilterOptionValue(this.getFilterOptionValue());
        campaignTemplate.setInPlayerTimezone(this.getInPlayerTimezone());
        campaignTemplate.setLaunchTime(this.getLaunchTime());
        campaignTemplate.setMetaData(this.getMetaData());
        campaignTemplate.setPushToOptimoveInstances(this.isPushToOptimoveInstances());
        campaignTemplate.setSendImmediately(this.isSendImmediately());
        campaignTemplate.setTargetGroupContentCriteria(this.getTargetGroupContentCriteria());
        campaignTemplate.setTargetGroupFilterCriteria(getTargetGroupFilterCriteria());
        campaignTemplate.setTargetGroupMetaData(this.getTargetGroupMetaData());
        return campaignTemplate;
    }

    public CampaignTemplate copyForNewCampaign() {
        CampaignTemplate campaignTemplate = new CampaignTemplate();
        campaignTemplate.setCampaignName(this.getCampaignName());
        campaignTemplate.setStatus(this.getStatus());
        campaignTemplate.setCancelEnabled(this.isCancelEnabled());
        campaignTemplate.setDeleteEnabled(this.isDeleteEnabled());
        campaignTemplate.setEditEnabled(this.isEditEnabled());
        campaignTemplate.setLaunchEnabled(this.isLaunchEnabled());
        campaignTemplate.setModifiedAt(this.getModifiedAt());
        campaignTemplate.setAlreadyLaunched(this.isAlreadyLaunched());
        campaignTemplate.setRecurrenceEndDate(this.getRecurrenceEndDate());
        campaignTemplate.setRecurrenceType(this.getRecurrenceType());
        campaignTemplate.setScheduledTime(this.getScheduledTime());
        campaignTemplate.setStartDate(this.getStartDate());
        campaignTemplate.setAlreadyCancelled(this.isAlreadyCancelled());
        campaignTemplate.setAlreadyDeleted(this.isAlreadyDeleted());
        campaignTemplate.setCampaignGroupId(this.getCampaignGroupId());
        campaignTemplate.setCancellationTime(this.getCancellationTime());
        campaignTemplate.setDeletionTime(this.getDeletionTime());
        campaignTemplate.setFilterOption(this.getFilterOption());
        campaignTemplate.setFilterOptionComparison(this.getFilterOptionComparison());
        campaignTemplate.setFilterOptionValue(this.getFilterOptionValue());
        campaignTemplate.setInPlayerTimezone(this.getInPlayerTimezone());
        campaignTemplate.setLaunchTime(this.getLaunchTime());
        campaignTemplate.setMetaData(this.getMetaData());
        campaignTemplate.setPushToOptimoveInstances(this.isPushToOptimoveInstances());
        campaignTemplate.setSendImmediately(this.isSendImmediately());
        campaignTemplate.setTargetGroupContentCriteria(this.getTargetGroupContentCriteria());
        campaignTemplate.setTargetGroupFilterCriteria(getTargetGroupFilterCriteria());
        campaignTemplate.setTargetGroupMetaData(this.getTargetGroupMetaData());
        return campaignTemplate;
    }

    public boolean isRetargetedCampaign() {
        return retargetedCampaign;
    }

    public CampaignTemplate setRetargetedCampaign(boolean retargetedCampaign) {
        this.retargetedCampaign = retargetedCampaign;
        return this;
    }

    public String getParentCampaignTemplateId() {
        return parentCampaignTemplateId;
    }

    public CampaignTemplate setParentCampaignTemplateId(String parentCampaignTemplateId) {
        this.parentCampaignTemplateId = parentCampaignTemplateId;
        return this;
    }

    public String getFrontEnd() {
        return frontEnd;
    }

    public CampaignTemplate setFrontEnd(String frontEnd) {
        this.frontEnd = frontEnd;
        return this;
    }

    public String getProduct() {
        return product;
    }

    public CampaignTemplate setProduct(String product) {
        this.product = product;
        return this;
    }
}
