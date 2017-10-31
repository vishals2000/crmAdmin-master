package com.gvc.crmadmin.domain;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;
import javax.validation.constraints.*;
import java.io.Serializable;
import java.util.Objects;

import com.gvc.crmadmin.domain.enumeration.Product;

/**
 * A FilterCriteria.
 */
@Document(collection = "filter_criteria")
public class FilterCriteria implements Serializable {

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
    @Field("filter_item")
    private String filterItem;

    @NotNull
    @Field("filter_query")
    private String filterQuery;

    @NotNull
    @Field("filter_value")
    private String filterValue;

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

    public FilterCriteria frontEnd(String frontEnd) {
        this.frontEnd = frontEnd;
        return this;
    }

    public void setFrontEnd(String frontEnd) {
        this.frontEnd = frontEnd;
    }

    public Product getProduct() {
        return product;
    }

    public FilterCriteria product(Product product) {
        this.product = product;
        return this;
    }

    public void setProduct(Product product) {
        this.product = product;
    }

    public String getFilterItem() {
        return filterItem;
    }

    public FilterCriteria filterItem(String filterItem) {
        this.filterItem = filterItem;
        return this;
    }

    public void setFilterItem(String filterItem) {
        this.filterItem = filterItem;
    }

    public String getFilterQuery() {
        return filterQuery;
    }

    public FilterCriteria filterQuery(String filterQuery) {
        this.filterQuery = filterQuery;
        return this;
    }

    public void setFilterQuery(String filterQuery) {
        this.filterQuery = filterQuery;
    }

    public String getFilterValue() {
        return filterValue;
    }

    public FilterCriteria filterValue(String filterValue) {
        this.filterValue = filterValue;
        return this;
    }

    public void setFilterValue(String filterValue) {
        this.filterValue = filterValue;
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
        FilterCriteria filterCriteria = (FilterCriteria) o;
        if (filterCriteria.getId() == null || getId() == null) {
            return false;
        }
        return Objects.equals(getId(), filterCriteria.getId());
    }

    @Override
    public int hashCode() {
        return Objects.hashCode(getId());
    }

    @Override
    public String toString() {
        return "FilterCriteria{" +
            "id=" + getId() +
            ", frontEnd='" + getFrontEnd() + "'" +
            ", product='" + getProduct() + "'" +
            ", filterItem='" + getFilterItem() + "'" +
            ", filterQuery='" + getFilterQuery() + "'" +
            ", filterValue='" + getFilterValue() + "'" +
            "}";
    }
}
