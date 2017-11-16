package com.gvc.crmadmin.domain.campaignMgmtApi;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;
import org.apache.commons.lang3.builder.ToStringBuilder;
import org.apache.commons.lang3.builder.ToStringStyle;

import java.io.Serializable;

/**
 * Created by Sai Sharath Palivela on 26-09-2017.
 */
@JsonIgnoreProperties(ignoreUnknown = true)
public class TargetGroupFilterCriterion implements Serializable {

    private static final long serialVersionUID = -361841820014087864L;

    @JsonProperty("filterOption")
    private String filterOption;

    @JsonProperty("filterOptionLookUp")
    private String filterOptionLookUp;

    @JsonProperty("filterOptionComparison")
    private String filterOptionComparison;

    @JsonProperty("filterOptionValue")
    private String[] filterOptionValue;

    public String getFilterOption() {
        return filterOption;
    }

    public void setFilterOption(String filterOption) {
        this.filterOption = filterOption;
    }

    public TargetGroupFilterCriterion filterOption(String filterOption) {
        this.filterOption = filterOption;
        return this;
    }

    public String getFilterOptionLookUp() {
        return filterOptionLookUp;
    }

    public void setFilterOptionLookUp(String filterOptionLookUp) {
        this.filterOptionLookUp = filterOptionLookUp;
    }

    public TargetGroupFilterCriterion filterOptionLookUp(String filterOptionLookUp) {
        this.filterOptionLookUp = filterOptionLookUp;
        return this;
    }

    public String getFilterOptionComparison() {
        return filterOptionComparison;
    }

    public void setFilterOptionComparison(String filterOptionComparison) {
        this.filterOptionComparison = filterOptionComparison;
    }

    public TargetGroupFilterCriterion filterOptionComparison(String filterOptionComparison) {
        this.filterOptionComparison = filterOptionComparison;
        return this;
    }

    public String[] getFilterOptionValue() {
        return filterOptionValue;
    }

    public void setFilterOptionValue(String[] filterOptionValue) {
        this.filterOptionValue = filterOptionValue;
    }

    public TargetGroupFilterCriterion filterOptionValue(String[] filterOptionValue) {
        this.filterOptionValue = filterOptionValue;
        return this;
    }

    @Override
    public String toString() {
        return ToStringBuilder.reflectionToString(this, ToStringStyle.SHORT_PREFIX_STYLE);
    }
}
