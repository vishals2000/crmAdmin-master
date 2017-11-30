package com.gvc.crmadmin.domain.campaignMgmtApi;

import java.io.Serializable;
import java.util.List;

import org.apache.commons.lang3.builder.ToStringBuilder;
import org.apache.commons.lang3.builder.ToStringStyle;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;

@JsonIgnoreProperties(ignoreUnknown = true)
public class AudienceSegmentsResponseTest implements Serializable {

    private static final long serialVersionUID = 1L;

    @JsonProperty("segments")
    private List<NameIdPair> nameIdPairs;

    public List<NameIdPair> getNameIdPairs() {
		return nameIdPairs;
	}
    
    public void setNameIdPairs(List<NameIdPair> nameIdPairs) {
		this.nameIdPairs = nameIdPairs;
	}
    
    @Override
    public String toString() {
        return ToStringBuilder.reflectionToString(this, ToStringStyle.SHORT_PREFIX_STYLE);
    }

}
