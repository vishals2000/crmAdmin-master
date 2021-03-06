package com.gvc.crmadmin.domain;

import com.gvc.crmadmin.domain.enumeration.Product;
import com.gvc.crmadmin.service.util.Utils;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;

import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;
import java.io.Serializable;
import java.util.Objects;

/**
 * A Apps.
 */
@Document(collection = "apps")
public class Apps implements Serializable {

    private static final long serialVersionUID = 1L;
    @Id
    private String id;

    @NotNull
    @Field("front_end")
    private String frontEnd;

    @NotNull
    @Field("product")
    private Product product;

    @NotNull
    @Size(min = 3, max = 50)
    @Field("name")
    private String name;

    @Field("jurisdiction")
    private String jurisdiction;

    @Field("description")
    private String description;

    // jhipster-needle-entity-add-field - Jhipster will add fields here, do not remove
    public String getId() {
        this.initialize();
        return id;
    }

    private void initialize() {
        StringBuilder sb = new StringBuilder(10);
        sb.append(getFrontEnd()).append(Utils.UNDER_SCORE);
        sb.append(getProduct().name());
        setId(sb.toString());
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getFrontEnd() {
        return frontEnd;
    }

    public Apps frontEnd(String frontEnd) {
        this.frontEnd = frontEnd;
        return this;
    }

    public void setFrontEnd(String frontEnd) {
        this.frontEnd = frontEnd;
    }

    public Product getProduct() {
        return product;
    }

    public Apps product(Product product) {
        this.product = product;
        this.initialize();
        return this;
    }

    public void setProduct(Product product) {
        this.product = product;
    }

    public String getName() {
        return name;
    }

    public Apps name(String name) {
        this.name = name;
        return this;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getJurisdiction() {
        return jurisdiction;
    }

    public Apps jurisdiction(String jurisdiction) {
        this.jurisdiction = jurisdiction;
        return this;
    }

    public void setJurisdiction(String jurisdiction) {
        this.jurisdiction = jurisdiction;
    }

    public String getDescription() {
        return description;
    }

    public Apps description(String description) {
        this.description = description;
        return this;
    }

    public void setDescription(String description) {
        this.description = description;
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
        Apps apps = (Apps) o;
        if (apps.getId() == null || getId() == null) {
            return false;
        }
        return Objects.equals(getId(), apps.getId());
    }

    @Override
    public int hashCode() {
        return Objects.hashCode(getId());
    }

    @Override
    public String toString() {
        return "Apps{" +
            "id=" + getId() +
            ", frontEnd='" + getFrontEnd() + "'" +
            ", product='" + getProduct() + "'" +
            ", name='" + getName() + "'" +
            ", jurisdiction='" + getJurisdiction() + "'" +
            ", description='" + getDescription() + "'" +
            "}";
    }
}
