package com.gvc.crmadmin.domain.campaignMgmtApi;

import java.io.Serializable;
import java.util.List;

import org.apache.commons.lang3.builder.ToStringBuilder;
import org.apache.commons.lang3.builder.ToStringStyle;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;

@JsonIgnoreProperties(ignoreUnknown = true)
public class AudienceSegmentsResponse implements Serializable {

    private static final long serialVersionUID = 1L;

    @JsonProperty("segments")
    private List<String> segmentNames;

    public List<String> getSegmentNames() {
		return segmentNames;
	}
    
    public void setSegmentNames(List<String> segmentNames) {
		this.segmentNames = segmentNames;
	}
    
    @Override
    public String toString() {
        return ToStringBuilder.reflectionToString(this, ToStringStyle.SHORT_PREFIX_STYLE);
    }

}
