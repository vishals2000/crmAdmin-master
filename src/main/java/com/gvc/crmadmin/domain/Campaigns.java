package com.gvc.crmadmin.domain;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;
import java.io.Serializable;
import java.util.Objects;

/**
 * A Campaigns.
 */
@Document(collection = "campaigns")
public class Campaigns implements Serializable {

    private static final long serialVersionUID = 1L;
    @Id
    private String id;

    // jhipster-needle-entity-add-field - Jhipster will add fields here, do not remove
    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
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
        Campaigns campaigns = (Campaigns) o;
        if (campaigns.getId() == null || getId() == null) {
            return false;
        }
        return Objects.equals(getId(), campaigns.getId());
    }

    @Override
    public int hashCode() {
        return Objects.hashCode(getId());
    }

    @Override
    public String toString() {
        return "Campaigns{" +
            "id=" + getId() +
            "}";
    }
}
