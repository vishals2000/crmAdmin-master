package com.gvc.crmadmin.domain.campaignMgmtApi;

import java.io.Serializable;

import org.apache.commons.lang3.builder.ToStringBuilder;
import org.apache.commons.lang3.builder.ToStringStyle;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;

@JsonIgnoreProperties(ignoreUnknown = true)
public class AudienceSegmentSizeResponse implements Serializable {

    private static final long serialVersionUID = 1L;

    @JsonProperty("segmentSize")
    private long segmentSize;

    @Override
    public String toString() {
        return ToStringBuilder.reflectionToString(this, ToStringStyle.SHORT_PREFIX_STYLE);
    }

    public long getSegmentSize() {
		return segmentSize;
	}
    
    public void setSegmentSize(long segmentSize) {
		this.segmentSize = segmentSize;
	}
}
