package com.gvc.crmadmin.domain;

import com.gvc.crmadmin.domain.enumeration.Product;
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
 * A MessageContent.
 */
@Document(collection = "message_content")
public class MessageContent implements Serializable {

    private static final long serialVersionUID = 1L;
    @Id
    private String id;

    @NotNull
    @Size(min = 2, max = 2)
    @Field("frontEnd")
    private String frontEnd;

    @NotNull
    @Field("product")
    private Product product;

    @NotNull
    @Field("contentName")
    private String contentName;

    @NotNull
    @Field("contentTitle")
    private String contentTitle;

    @NotNull
    @Field("contentBody")
    private String contentBody;

    @Field("meta_data")
    private String metaData;

    @NotNull
    @Field("language")
    private String language;

    // jhipster-needle-entity-add-field - Jhipster will add fields here, do not remove
    public String getId() {
        this.initialize();
        return id;
    }

    private void initialize() {
        StringBuilder sb = new StringBuilder(10);
        sb.append(getFrontEnd()).append(Utils.UNDER_SCORE);
        sb.append(getProduct().name()).append(Utils.UNDER_SCORE);
        sb.append(getContentName());
        setId(sb.toString());
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getFrontEnd() {
        return frontEnd;
    }

    public MessageContent frontEnd(String frontEnd) {
        this.frontEnd = frontEnd;
        return this;
    }

    public void setFrontEnd(String frontEnd) {
        this.frontEnd = frontEnd;
    }

    public Product getProduct() {
        return product;
    }

    public MessageContent product(Product product) {
        this.product = product;
        return this;
    }

    public void setProduct(Product product) {
        this.product = product;
    }

    public String getContentName() {
        return contentName;
    }

    public MessageContent contentName(String contentName) {
        this.contentName = contentName;
        this.initialize();
        return this;
    }

    public void setContentName(String contentName) {
        this.contentName = contentName;
        this.initialize();
    }

    public String getContentTitle() {
        return contentTitle;
    }

    public MessageContent contentTitle(String contentTitle) {
        this.contentTitle = contentTitle;
        return this;
    }

    public void setContentTitle(String contentTitle) {
        this.contentTitle = contentTitle;
    }

    public String getContentBody() {
        return contentBody;
    }

    public MessageContent contentBody(String contentBody) {
        this.contentBody = contentBody;
        return this;
    }

    public void setContentBody(String contentBody) {
        this.contentBody = contentBody;
    }

    public String getMetaData() {
        return metaData;
    }

    public MessageContent metaData(String metaData) {
        this.metaData = metaData;
        return this;
    }

    public void setMetaData(String metaData) {
        this.metaData = metaData;
    }

    public String getLanguage() {
        return language;
    }

    public MessageContent language(String language) {
        this.language = language;
        return this;
    }

    public void setLanguage(String language) {
        this.language = language;
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
        MessageContent messageContent = (MessageContent) o;
        if (messageContent.getId() == null || getId() == null) {
            return false;
        }
        return Objects.equals(getId(), messageContent.getId());
    }

    @Override
    public int hashCode() {
        return Objects.hashCode(getId());
    }

    @Override
    public String toString() {
        return ToStringBuilder.reflectionToString(this, ToStringStyle.SHORT_PREFIX_STYLE);
    }
}
