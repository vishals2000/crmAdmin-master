package com.gvc.crmadmin.domain;

import java.io.Serializable;
import java.util.Objects;

import javax.validation.constraints.NotNull;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;

/**
 * A AudienceSegments.
 */
@Document(collection = "audience_segments_players")
public class AudienceSegmentsPlayers implements Serializable {

	 private static final long serialVersionUID = 1L;
	    @Id
	    private String id;

	    @NotNull
	    @Field("segment_name")
	    private String segmentName;

	    @Field("accountName")
	    private String accountName;

	    @Field("last_updated")
	    private String lastUpdated;
	    
	    // jhipster-needle-entity-add-field - Jhipster will add fields here, do not remove
	    public String getId() {
	        return id;
	    }

	    public void setId(String id) {
	        this.id = id;
	    }

	    public String getSegmentName() {
	        return segmentName;
	    }

	    public AudienceSegmentsPlayers segmentName(String segmentName) {
	        this.segmentName = segmentName;
	        return this;
	    }

	    public void setSegmentName(String segmentName) {
	        this.segmentName = segmentName;
	    }

	    public String getAccountName() {
			return accountName;
		}
	    
	    public void setAccountName(String accountName) {
			this.accountName = accountName;
		}

	    public String getLastUpdated() {
			return lastUpdated;
		}
	    
	    public void setLastUpdated(String lastUpdated) {
			this.lastUpdated = lastUpdated;
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
	        AudienceSegments audienceSegments = (AudienceSegments) o;
	        if (audienceSegments.getId() == null || getId() == null) {
	            return false;
	        }
	        return Objects.equals(getId(), audienceSegments.getId());
	    }

	    @Override
	    public int hashCode() {
	        return Objects.hashCode(getId());
	    }

		@Override
		public String toString() {
			return "AudienceSegmentsPlayers [id=" + id + ", segmentName=" + segmentName + ", accountName=" + accountName
					+ ", lastUpdated=" + lastUpdated + "]";
		}

}
