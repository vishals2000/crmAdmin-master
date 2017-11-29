package com.gvc.crmadmin.domain.campaignMgmtApi;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;
import org.apache.commons.lang3.builder.ToStringBuilder;
import org.apache.commons.lang3.builder.ToStringStyle;

import java.io.Serializable;

@JsonIgnoreProperties(ignoreUnknown = true)
public class AudienceSegmentUploadResponse implements Serializable {

    private static final long serialVersionUID = 1L;

    @JsonProperty("result")
    private boolean result;
    
    @JsonProperty("code")
    private int code;

    @JsonProperty("message")
    private String message;

    public boolean isResult() {
		return result;
	}
    
    public void setResult(boolean result) {
		this.result = result;
	}
    
    public int getCode() {
		return code;
	}
    
    public void setCode(int code) {
		this.code = code;
	}
    
    public String getMessage() {
		return message;
	}
    
    public void setMessage(String message) {
		this.message = message;
	}
    
    @Override
    public String toString() {
        return ToStringBuilder.reflectionToString(this, ToStringStyle.SHORT_PREFIX_STYLE);
    }

}
