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
 * A FeProduct.
 */
@Document(collection = "fe_product")
public class FeProduct implements Serializable {

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

    public FeProduct frontEnd(String frontEnd) {
        this.frontEnd = frontEnd;
        return this;
    }

    public void setFrontEnd(String frontEnd) {
        this.frontEnd = frontEnd;
    }

    public Product getProduct() {
        return product;
    }

    public FeProduct product(Product product) {
        this.product = product;
        this.initialize();
        return this;
    }

    public void setProduct(Product product) {
        this.product = product;
        this.initialize();
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
        FeProduct feProduct = (FeProduct) o;
        if (feProduct.getId() == null || getId() == null) {
            return false;
        }
        return Objects.equals(getId(), feProduct.getId());
    }

    @Override
    public int hashCode() {
        return Objects.hashCode(getId());
    }

    @Override
    public String toString() {
        return "FeProduct{" +
            "id=" + getId() +
            ", frontEnd='" + getFrontEnd() + "'" +
            ", product='" + getProduct() + "'" +
            "}";
    }
}
