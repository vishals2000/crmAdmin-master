package com.gvc.crmadmin.domain;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;
import javax.validation.constraints.*;
import java.io.Serializable;
import java.util.Objects;

import com.gvc.crmadmin.domain.enumeration.Product;

/**
 * A TagCriteria.
 */
@Document(collection = "tag_criteria")
public class TagCriteria implements Serializable {

    private static final long serialVersionUID = 1L;
    @Id
    private String id;

    @NotNull
    @Size(min = 2, max = 2)
    @Field("front_end")
    private String frontEnd;

    @NotNull
    @Field("product")
    private Product product;

    @NotNull
    @Field("tag_name")
    private String tagName;

    @NotNull
    @Field("tag_comparison")
    private String tagComparison;

    @NotNull
    @Field("tag_value")
    private String tagValue;

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

    public TagCriteria frontEnd(String frontEnd) {
        this.frontEnd = frontEnd;
        return this;
    }

    public void setFrontEnd(String frontEnd) {
        this.frontEnd = frontEnd;
    }

    public Product getProduct() {
        return product;
    }

    public TagCriteria product(Product product) {
        this.product = product;
        return this;
    }

    public void setProduct(Product product) {
        this.product = product;
    }

    public String getTagName() {
        return tagName;
    }

    public TagCriteria tagName(String tagName) {
        this.tagName = tagName;
        return this;
    }

    public void setTagName(String tagName) {
        this.tagName = tagName;
    }

    public String getTagComparison() {
        return tagComparison;
    }

    public TagCriteria tagComparison(String tagComparison) {
        this.tagComparison = tagComparison;
        return this;
    }

    public void setTagComparison(String tagComparison) {
        this.tagComparison = tagComparison;
    }

    public String getTagValue() {
        return tagValue;
    }

    public TagCriteria tagValue(String tagValue) {
        this.tagValue = tagValue;
        return this;
    }

    public void setTagValue(String tagValue) {
        this.tagValue = tagValue;
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
        TagCriteria tagCriteria = (TagCriteria) o;
        if (tagCriteria.getId() == null || getId() == null) {
            return false;
        }
        return Objects.equals(getId(), tagCriteria.getId());
    }

    @Override
    public int hashCode() {
        return Objects.hashCode(getId());
    }

    @Override
    public String toString() {
        return "TagCriteria{" +
            "id=" + getId() +
            ", frontEnd='" + getFrontEnd() + "'" +
            ", product='" + getProduct() + "'" +
            ", tagName='" + getTagName() + "'" +
            ", tagComparison='" + getTagComparison() + "'" +
            ", tagValue='" + getTagValue() + "'" +
            "}";
    }
}
