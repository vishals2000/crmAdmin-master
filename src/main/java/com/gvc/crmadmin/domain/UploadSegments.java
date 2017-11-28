package com.gvc.crmadmin.domain;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;
import javax.validation.constraints.*;
import java.io.Serializable;
import java.util.Objects;

/**
 * A UploadSegments.
 */
@Document(collection = "upload_segments")
public class UploadSegments implements Serializable {

    private static final long serialVersionUID = 1L;
    @Id
    private String id;

    @NotNull
    @Field("front_end")
    private String frontEnd;

    @NotNull
    @Field("product")
    private String product;

    @NotNull
    @Field("name")
    private String name;

    @Field("type")
    private String type;

    @Field("estimate")
    private String estimate;

    @Field("last_estimated_at")
    private String lastEstimatedAt;

    @Field("modified_at")
    private String modifiedAt;

    @Field("created_at")
    private String createdAt;

    // jhipster-needle-entity-add-field - Jhipster will add fields here, do not remove
    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getFrontEnd() {
        return frontEnd;
    }

    public UploadSegments frontEnd(String frontEnd) {
        this.frontEnd = frontEnd;
        return this;
    }

    public void setFrontEnd(String frontEnd) {
        this.frontEnd = frontEnd;
    }

    public String getProduct() {
        return product;
    }

    public UploadSegments product(String product) {
        this.product = product;
        return this;
    }

    public void setProduct(String product) {
        this.product = product;
    }

    public String getName() {
        return name;
    }

    public UploadSegments name(String name) {
        this.name = name;
        return this;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getType() {
        return type;
    }

    public UploadSegments type(String type) {
        this.type = type;
        return this;
    }

    public void setType(String type) {
        this.type = type;
    }

    public String getEstimate() {
        return estimate;
    }

    public UploadSegments estimate(String estimate) {
        this.estimate = estimate;
        return this;
    }

    public void setEstimate(String estimate) {
        this.estimate = estimate;
    }

    public String getLastEstimatedAt() {
        return lastEstimatedAt;
    }

    public UploadSegments lastEstimatedAt(String lastEstimatedAt) {
        this.lastEstimatedAt = lastEstimatedAt;
        return this;
    }

    public void setLastEstimatedAt(String lastEstimatedAt) {
        this.lastEstimatedAt = lastEstimatedAt;
    }

    public String getModifiedAt() {
        return modifiedAt;
    }

    public UploadSegments modifiedAt(String modifiedAt) {
        this.modifiedAt = modifiedAt;
        return this;
    }

    public void setModifiedAt(String modifiedAt) {
        this.modifiedAt = modifiedAt;
    }

    public String getCreatedAt() {
        return createdAt;
    }

    public UploadSegments createdAt(String createdAt) {
        this.createdAt = createdAt;
        return this;
    }

    public void setCreatedAt(String createdAt) {
        this.createdAt = createdAt;
    }
    // jhipster-needle-entity-add-getters-setters - Jhipster will add getters and setters here, do not remove

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (o == null || getClass() != o.getClass()) {
            return false;
        }
        UploadSegments uploadSegments = (UploadSegments) o;
        if (uploadSegments.getId() == null || getId() == null) {
            return false;
        }
        return Objects.equals(getId(), uploadSegments.getId());
    }

    @Override
    public int hashCode() {
        return Objects.hashCode(getId());
    }

    @Override
    public String toString() {
        return "UploadSegments{" +
            "id=" + getId() +
            ", frontEnd='" + getFrontEnd() + "'" +
            ", product='" + getProduct() + "'" +
            ", name='" + getName() + "'" +
            ", type='" + getType() + "'" +
            ", estimate='" + getEstimate() + "'" +
            ", lastEstimatedAt='" + getLastEstimatedAt() + "'" +
            ", modifiedAt='" + getModifiedAt() + "'" +
            ", createdAt='" + getCreatedAt() + "'" +
            "}";
    }
}
