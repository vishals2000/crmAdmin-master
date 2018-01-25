package com.gvc.crmadmin.domain;

import com.fasterxml.jackson.annotation.JsonProperty;
import org.apache.commons.lang3.builder.ToStringBuilder;
import org.apache.commons.lang3.builder.ToStringStyle;
import org.springframework.web.multipart.MultipartFile;

import java.io.Serializable;

public class AudienceSegmentUploadRequest implements Serializable {
    private static final long serialVersionUID = -8736621585713672212L;

    @JsonProperty("file")
    private MultipartFile file;
    @JsonProperty("frontEnd")
    private String frontEnd;
    @JsonProperty("product")
    private String product;
    @JsonProperty("name")
    private String name;

    public MultipartFile getFile() {
        return file;
    }

    public AudienceSegmentUploadRequest setFile(MultipartFile file) {
        this.file = file;
        return this;
    }

    public String getFrontEnd() {
        return frontEnd;
    }

    public AudienceSegmentUploadRequest setFrontEnd(String frontEnd) {
        this.frontEnd = frontEnd;
        return this;
    }

    public String getProduct() {
        return product;
    }

    public AudienceSegmentUploadRequest setProduct(String product) {
        this.product = product;
        return this;
    }

    public String getName() {
        return name;
    }

    public AudienceSegmentUploadRequest setName(String name) {
        this.name = name;
        return this;
    }

    @Override
    public String toString() {
        return ToStringBuilder.reflectionToString(this, ToStringStyle.SHORT_PREFIX_STYLE);
    }
}
