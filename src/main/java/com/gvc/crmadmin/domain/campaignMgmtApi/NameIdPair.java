package com.gvc.crmadmin.domain.campaignMgmtApi;

import java.io.Serializable;

import org.apache.commons.lang3.builder.ToStringBuilder;
import org.apache.commons.lang3.builder.ToStringStyle;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;

@JsonIgnoreProperties(ignoreUnknown = true)
public class NameIdPair implements Serializable {

    private static final long serialVersionUID = 1L;

    @JsonProperty("name")
    private String name;

    @JsonProperty("id")
    private String id;
    
    public String getId() {
		return id;
	}
    
    public void setId(String id) {
		this.id = id;
	}
    
    public String getName() {
		return name;
	}
    
    public void setName(String name) {
		this.name = name;
	}
    
    @Override
    public String toString() {
        return ToStringBuilder.reflectionToString(this, ToStringStyle.SHORT_PREFIX_STYLE);
    }

}
