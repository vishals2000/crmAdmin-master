package com.gvc.crmadmin.domain.campaignMgmtApi;

import java.io.Serializable;

import org.apache.commons.lang3.builder.ToStringBuilder;
import org.apache.commons.lang3.builder.ToStringStyle;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;

@JsonIgnoreProperties(ignoreUnknown = true)
public class AudienceSegmentsRequest implements Serializable {

    private static final long serialVersionUID = 1L;

    @JsonProperty("frontEnd")
    private String frontEnd;

    @JsonProperty("product")
    private String product;

    public String getProduct() {
        return product;
    }

    public AudienceSegmentsRequest setProduct(String product) {
        this.product = product;
        return this;
    }

    public String getFrontEnd() {
        return frontEnd;
    }

    public AudienceSegmentsRequest setFrontEnd(String frontEnd) {
        this.frontEnd = frontEnd;
        return this;
    }

    @Override
    public String toString() {
        return ToStringBuilder.reflectionToString(this, ToStringStyle.SHORT_PREFIX_STYLE);
    }

}
