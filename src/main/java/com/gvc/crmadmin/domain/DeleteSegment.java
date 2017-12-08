package com.gvc.crmadmin.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;
import org.apache.commons.lang3.builder.ToStringBuilder;
import org.apache.commons.lang3.builder.ToStringStyle;

/**
 * Created by Sai Sharath Palivela on 08-12-2017.
 */
@JsonIgnoreProperties(ignoreUnknown = true)
public class DeleteSegment {
    @JsonProperty("segId")
    private String segId;

    public String getSegId() {
        return segId;
    }

    public DeleteSegment setSegId(String segId) {
        this.segId = segId;
        return this;
    }

    @Override
    public String toString() {
        return ToStringBuilder.reflectionToString(this, ToStringStyle.SHORT_PREFIX_STYLE);
    }
}
