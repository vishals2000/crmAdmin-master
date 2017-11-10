package com.gvc.crmadmin.domain;

import org.apache.commons.lang3.builder.ToStringBuilder;
import org.apache.commons.lang3.builder.ToStringStyle;

import java.io.Serializable;

public class FrontendProduct implements Serializable {

    private final String fe;
    private final String product;

    public String getFe() {
        return fe;
    }

    public String getProduct() {
        return product;
    }

    public FrontendProduct(String fe, String product) {
        this.fe = fe;
        this.product = product;
    }

    @Override
    public String toString() {
        return ToStringBuilder.reflectionToString(this, ToStringStyle.SHORT_PREFIX_STYLE);
    }
}
