package com.gvc.crmadmin.domain;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;
import java.io.Serializable;
import java.util.Objects;

/**
 * A CampaignStat.
 */
@Document(collection = "campaign_stat")
public class CampaignStat implements Serializable {

    private static final long serialVersionUID = 1L;
    @Id
    private String id;

    @Field("name")
    private String name;

    @Field("scheduled_time")
    private String scheduledTime;

    @Field("status")
    private String status;

    @Field("segment_size")
    private Integer segmentSize;

    @Field("segment_size_after_common_scrubbing")
    private Integer segmentSizeAfterCommonScrubbing;

    @Field("segment_size_after_communication_scrubbing")
    private Integer segmentSizeAfterCommunicationScrubbing;

    @Field("campaign_id")
    private String campaignId;

    // jhipster-needle-entity-add-field - Jhipster will add fields here, do not remove
    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public CampaignStat name(String name) {
        this.name = name;
        return this;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getScheduledTime() {
        return scheduledTime;
    }

    public CampaignStat scheduledTime(String scheduledTime) {
        this.scheduledTime = scheduledTime;
        return this;
    }

    public void setScheduledTime(String scheduledTime) {
        this.scheduledTime = scheduledTime;
    }

    public String getStatus() {
        return status;
    }

    public CampaignStat status(String status) {
        this.status = status;
        return this;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public Integer getSegmentSize() {
        return segmentSize;
    }

    public CampaignStat segmentSize(Integer segmentSize) {
        this.segmentSize = segmentSize;
        return this;
    }

    public void setSegmentSize(Integer segmentSize) {
        this.segmentSize = segmentSize;
    }

    public Integer getSegmentSizeAfterCommonScrubbing() {
        return segmentSizeAfterCommonScrubbing;
    }

    public CampaignStat segmentSizeAfterCommonScrubbing(Integer segmentSizeAfterCommonScrubbing) {
        this.segmentSizeAfterCommonScrubbing = segmentSizeAfterCommonScrubbing;
        return this;
    }

    public void setSegmentSizeAfterCommonScrubbing(Integer segmentSizeAfterCommonScrubbing) {
        this.segmentSizeAfterCommonScrubbing = segmentSizeAfterCommonScrubbing;
    }

    public Integer getSegmentSizeAfterCommunicationScrubbing() {
        return segmentSizeAfterCommunicationScrubbing;
    }

    public CampaignStat segmentSizeAfterCommunicationScrubbing(Integer segmentSizeAfterCommunicationScrubbing) {
        this.segmentSizeAfterCommunicationScrubbing = segmentSizeAfterCommunicationScrubbing;
        return this;
    }

    public void setSegmentSizeAfterCommunicationScrubbing(Integer segmentSizeAfterCommunicationScrubbing) {
        this.segmentSizeAfterCommunicationScrubbing = segmentSizeAfterCommunicationScrubbing;
    }

    public String getCampaignId() {
        return campaignId;
    }

    public CampaignStat campaignId(String campaignId) {
        this.campaignId = campaignId;
        return this;
    }

    public void setCampaignId(String campaignId) {
        this.campaignId = campaignId;
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
        CampaignStat campaignStat = (CampaignStat) o;
        if (campaignStat.getId() == null || getId() == null) {
            return false;
        }
        return Objects.equals(getId(), campaignStat.getId());
    }

    @Override
    public int hashCode() {
        return Objects.hashCode(getId());
    }

    @Override
    public String toString() {
        return "CampaignStat{" +
            "id=" + getId() +
            ", name='" + getName() + "'" +
            ", scheduledTime='" + getScheduledTime() + "'" +
            ", status='" + getStatus() + "'" +
            ", segmentSize='" + getSegmentSize() + "'" +
            ", segmentSizeAfterCommonScrubbing='" + getSegmentSizeAfterCommonScrubbing() + "'" +
            ", segmentSizeAfterCommunicationScrubbing='" + getSegmentSizeAfterCommunicationScrubbing() + "'" +
            ", campaignId='" + getCampaignId() + "'" +
            "}";
    }
}
