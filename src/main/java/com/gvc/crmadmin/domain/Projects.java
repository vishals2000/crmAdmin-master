package com.gvc.crmadmin.domain;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;
import javax.validation.constraints.*;
import java.io.Serializable;
import java.util.Objects;

import com.gvc.crmadmin.domain.enumeration.Product;

/**
 * A Projects.
 */
@Document(collection = "projects")
public class Projects implements Serializable {

    private static final long serialVersionUID = 1L;
    @Id
    private String id;

    @NotNull
    @Size(min = 3, max = 50)
    @Field("name")
    private String name;

    @NotNull
    @Size(min = 3)
    @Field("description")
    private String description;

    @Field("jurisdiction")
    private String jurisdiction;

    @NotNull
    @Size(min = 2, max = 2)
    @Field("front_end")
    private String frontEnd;

    @NotNull
    @Field("product")
    private Product product;

    // jhipster-needle-entity-add-field - Jhipster will add fields here, do not remove
    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public Projects name(String name) {
        this.name = name;
        return this;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getDescription() {
        return description;
    }

    public Projects description(String description) {
        this.description = description;
        return this;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getJurisdiction() {
        return jurisdiction;
    }

    public Projects jurisdiction(String jurisdiction) {
        this.jurisdiction = jurisdiction;
        return this;
    }

    public void setJurisdiction(String jurisdiction) {
        this.jurisdiction = jurisdiction;
    }

    public String getFrontEnd() {
        return frontEnd;
    }

    public Projects frontEnd(String frontEnd) {
        this.frontEnd = frontEnd;
        return this;
    }

    public void setFrontEnd(String frontEnd) {
        this.frontEnd = frontEnd;
    }

    public Product getProduct() {
        return product;
    }

    public Projects product(Product product) {
        this.product = product;
        return this;
    }

    public void setProduct(Product product) {
        this.product = product;
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
        Projects projects = (Projects) o;
        if (projects.getId() == null || getId() == null) {
            return false;
        }
        return Objects.equals(getId(), projects.getId());
    }

    @Override
    public int hashCode() {
        return Objects.hashCode(getId());
    }

    @Override
    public String toString() {
        return "Projects{" +
            "id=" + getId() +
            ", name='" + getName() + "'" +
            ", description='" + getDescription() + "'" +
            ", jurisdiction='" + getJurisdiction() + "'" +
            ", frontEnd='" + getFrontEnd() + "'" +
            ", product='" + getProduct() + "'" +
            "}";
    }
}
