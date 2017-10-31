package com.gvc.crmadmin.domain;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;
import javax.validation.constraints.*;
import java.io.Serializable;
import java.util.Objects;

import com.gvc.crmadmin.domain.enumeration.Product;

/**
 * A EventCriteria.
 */
@Document(collection = "event_criteria")
public class EventCriteria implements Serializable {

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
    @Field("event_name")
    private String eventName;

    @NotNull
    @Field("event_comparison")
    private String eventComparison;

    @NotNull
    @Field("event_value")
    private String eventValue;

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

    public EventCriteria frontEnd(String frontEnd) {
        this.frontEnd = frontEnd;
        return this;
    }

    public void setFrontEnd(String frontEnd) {
        this.frontEnd = frontEnd;
    }

    public Product getProduct() {
        return product;
    }

    public EventCriteria product(Product product) {
        this.product = product;
        return this;
    }

    public void setProduct(Product product) {
        this.product = product;
    }

    public String getEventName() {
        return eventName;
    }

    public EventCriteria eventName(String eventName) {
        this.eventName = eventName;
        return this;
    }

    public void setEventName(String eventName) {
        this.eventName = eventName;
    }

    public String getEventComparison() {
        return eventComparison;
    }

    public EventCriteria eventComparison(String eventComparison) {
        this.eventComparison = eventComparison;
        return this;
    }

    public void setEventComparison(String eventComparison) {
        this.eventComparison = eventComparison;
    }

    public String getEventValue() {
        return eventValue;
    }

    public EventCriteria eventValue(String eventValue) {
        this.eventValue = eventValue;
        return this;
    }

    public void setEventValue(String eventValue) {
        this.eventValue = eventValue;
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
        EventCriteria eventCriteria = (EventCriteria) o;
        if (eventCriteria.getId() == null || getId() == null) {
            return false;
        }
        return Objects.equals(getId(), eventCriteria.getId());
    }

    @Override
    public int hashCode() {
        return Objects.hashCode(getId());
    }

    @Override
    public String toString() {
        return "EventCriteria{" +
            "id=" + getId() +
            ", frontEnd='" + getFrontEnd() + "'" +
            ", product='" + getProduct() + "'" +
            ", eventName='" + getEventName() + "'" +
            ", eventComparison='" + getEventComparison() + "'" +
            ", eventValue='" + getEventValue() + "'" +
            "}";
    }
}
