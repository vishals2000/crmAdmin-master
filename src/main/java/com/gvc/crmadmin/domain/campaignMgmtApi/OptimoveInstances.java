package com.gvc.crmadmin.domain.campaignMgmtApi;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;
import org.apache.commons.lang3.builder.ToStringBuilder;
import org.apache.commons.lang3.builder.ToStringStyle;

import java.io.Serializable;
import java.util.List;

@JsonIgnoreProperties(ignoreUnknown = true)
public class OptimoveInstances implements Serializable {

    private static final long serialVersionUID = 5489901265826176515L;

    @JsonProperty("message")
    private List<String> optimoveInstanceNames;

    public OptimoveInstances() {
    }

    public OptimoveInstances(List<String> optimoveInstanceNames) {
        this.optimoveInstanceNames = optimoveInstanceNames;
    }

    public List<String> getOptimoveInstanceNames() {
        return optimoveInstanceNames;
    }

    public void setOptimoveInstanceNames(List<String> optimoveInstanceNames) {
        this.optimoveInstanceNames = optimoveInstanceNames;
    }

    @Override
    public String toString() {
        return ToStringBuilder.reflectionToString(this, ToStringStyle.SHORT_PREFIX_STYLE);
    }

}
