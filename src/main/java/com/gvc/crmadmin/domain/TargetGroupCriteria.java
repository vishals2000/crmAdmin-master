package com.gvc.crmadmin.domain;

import com.gvc.crmadmin.service.util.Utils;
import org.apache.commons.lang3.builder.ToStringBuilder;
import org.apache.commons.lang3.builder.ToStringStyle;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;

import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;
import java.io.Serializable;
import java.util.Objects;

/**
 * A TargetGroupCriteria.
 */
@Document(collection = "target_group_criteria")
public class TargetGroupCriteria implements Serializable {

    private static final long serialVersionUID = 1L;
    @Id
    private String id;

    @NotNull
    @Size(min = 2, max = 2)
    @Field("frontEnd")
    private String frontEnd;

    @NotNull
    @Field("product")
    private String product;

    @NotNull
    @Size(min = 3)
    @Field("name")
    private String name;

    @Field("targetGroupFilterCriteria")
    private TargetGroupFilterCriterion[] targetGroupFilterCriteria;

    // jhipster-needle-entity-add-field - Jhipster will add fields here, do not remove
    public String getId() {
        this.initialize();
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getFrontEnd() {
        return frontEnd;
    }

    public void setFrontEnd(String frontEnd) {
        this.frontEnd = frontEnd;
    }

    public TargetGroupCriteria frontEnd(String frontEnd) {
        this.frontEnd = frontEnd;
        return this;
    }

    public String getProduct() {
        return product;
    }

    public void setProduct(String product) {
        this.product = product;
    }

    public TargetGroupCriteria product(String product) {
        this.product = product;
        return this;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
        this.initialize();
    }

    public TargetGroupCriteria name(String name) {
        this.name = name;
        this.initialize();
        return this;
    }

    public TargetGroupFilterCriterion[] getTargetGroupFilterCriteria() {
        return targetGroupFilterCriteria;
    }

    public TargetGroupCriteria setTargetGroupFilterCriteria(TargetGroupFilterCriterion[] targetGroupFilterCriteria) {
        this.targetGroupFilterCriteria = targetGroupFilterCriteria;
        return this;
    }

    public TargetGroupCriteria targetGroupFilterCriteria(TargetGroupFilterCriterion[] targetGroupFilterCriteria) {
        this.targetGroupFilterCriteria = targetGroupFilterCriteria;
        return this;
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
        TargetGroupCriteria targetGroupCriteria = (TargetGroupCriteria) o;
        if (targetGroupCriteria.getId() == null || getId() == null) {
            return false;
        }
        return Objects.equals(getId(), targetGroupCriteria.getId());
    }

    @Override
    public int hashCode() {
        return Objects.hashCode(getId());
    }

    private void initialize() {
        StringBuilder sb = new StringBuilder(10);
        sb.append(getFrontEnd()).append(Utils.UNDER_SCORE);
        sb.append(getProduct()).append(Utils.UNDER_SCORE);
        sb.append(getName());
        setId(sb.toString());
    }

    @Override
    public String toString() {
        return ToStringBuilder.reflectionToString(this, ToStringStyle.SHORT_PREFIX_STYLE);
    }

    public static class TargetGroupFilterCriterion implements Serializable {
        @NotNull
        @Field("filter_option")
        private String filterOption;

        @NotNull
        @Field("filter_option_look_up")
        private String filterOptionLookUp;

        @NotNull
        @Field("filter_option_comparison")
        private String filterOptionComparison;

        @NotNull
        @Field("filter_option_value")
        private String[] filterOptionValue;

        public String getFilterOption() {
            return filterOption;
        }

        public void setFilterOption(String filterOption) {
            this.filterOption = filterOption;
        }

        public TargetGroupFilterCriterion filterOption(String filterOption) {
            this.filterOption = filterOption;
            return this;
        }

        public String getFilterOptionLookUp() {
            return filterOptionLookUp;
        }

        public void setFilterOptionLookUp(String filterOptionLookUp) {
            this.filterOptionLookUp = filterOptionLookUp;
        }

        public TargetGroupFilterCriterion filterOptionLookUp(String filterOptionLookUp) {
            this.filterOptionLookUp = filterOptionLookUp;
            return this;
        }

        public String getFilterOptionComparison() {
            return filterOptionComparison;
        }

        public void setFilterOptionComparison(String filterOptionComparison) {
            this.filterOptionComparison = filterOptionComparison;
        }

        public TargetGroupFilterCriterion filterOptionComparison(String filterOptionComparison) {
            this.filterOptionComparison = filterOptionComparison;
            return this;
        }

        public String[] getFilterOptionValue() {
            return filterOptionValue;
        }

        public void setFilterOptionValue(String[] filterOptionValue) {
            this.filterOptionValue = filterOptionValue;
        }

        public TargetGroupFilterCriterion filterOptionValue(String[] filterOptionValue) {
            this.filterOptionValue = filterOptionValue;
            return this;
        }

        @Override
        public String toString() {
            return ToStringBuilder.reflectionToString(this, ToStringStyle.SHORT_PREFIX_STYLE);
        }
    }
}
