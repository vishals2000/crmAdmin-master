package com.gvc.crmadmin.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;
import org.apache.commons.lang3.builder.ToStringBuilder;
import org.apache.commons.lang3.builder.ToStringStyle;

import java.io.Serializable;

/**
 * Created by Sai Sharath Palivela on 06-12-2017.
 */
@JsonIgnoreProperties(ignoreUnknown = true)
public class LiveOddsMetaData implements Serializable {
    private static final long serialVersionUID = 1783745910758034784L;
    @JsonProperty("key")
    private String key;
    @JsonProperty("value")
    private String value;

    public String getKey() {
        return key;
    }

    public LiveOddsMetaData setKey(String key) {
        this.key = key;
        return this;
    }

    public String getValue() {
        return value;
    }

    public LiveOddsMetaData setValue(String value) {
        this.value = value;
        return this;
    }

    @Override
    public String toString() {
        return ToStringBuilder.reflectionToString(this, ToStringStyle.SHORT_PREFIX_STYLE);
    }
}
