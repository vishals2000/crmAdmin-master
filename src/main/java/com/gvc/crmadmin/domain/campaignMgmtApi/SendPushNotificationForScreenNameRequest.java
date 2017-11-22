package com.gvc.crmadmin.domain.campaignMgmtApi;

import com.gvc.crmadmin.domain.enumeration.Product;
import org.apache.commons.lang3.builder.ToStringBuilder;
import org.apache.commons.lang3.builder.ToStringStyle;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;

import java.io.Serializable;
import java.util.List;

/**
 * Request for sending push notification
 * Created by Sai Sharath Palivela on 10-10-2017.
 */
@JsonIgnoreProperties(ignoreUnknown = true)
public class SendPushNotificationForScreenNameRequest implements Serializable {

    private static final long serialVersionUID = 8950802590570138471L;

    @JsonProperty("frontEnd")
    private String frontEnd;

    @JsonProperty("product")
    private Product product;

    @JsonProperty("sendToAllDevices")
    private boolean sendToAllDevices;

    @JsonProperty("screenName")
    private String screenName;

    @JsonProperty("contentTitle")
    private String contentTitle;

    @JsonProperty("contentBody")
    private String contentBody;

    @JsonProperty("metaData")
    private String metaData;

    @JsonProperty("processCommonScrub")
    private boolean processCommonScrub;

    @JsonProperty("fcmIds")
    private List<String> fcmIds;

    @JsonProperty("id")
    private String campaignId;

    public String getContentTitle() {
        return contentTitle;
    }

    public SendPushNotificationForScreenNameRequest setContentTitle(String contentTitle) {
        this.contentTitle = contentTitle;
        return this;
    }

    public String getContentBody() {
        return contentBody;
    }

    public SendPushNotificationForScreenNameRequest setContentBody(String contentBody) {
        this.contentBody = contentBody;
        return this;
    }

    public String getMetaData() {
        return metaData;
    }

    public SendPushNotificationForScreenNameRequest setMetaData(String metaData) {
        this.metaData = metaData;
        return this;
    }

    public String getFrontEnd() {
        return frontEnd;
    }

    public SendPushNotificationForScreenNameRequest setFrontEnd(String frontEnd) {
        this.frontEnd = frontEnd;
        return this;
    }

    public Product getProduct() {
        return product;
    }

    public SendPushNotificationForScreenNameRequest setProduct(Product product) {
        this.product = product;
        return this;
    }

    public boolean isSendToAllDevices() {
        return sendToAllDevices;
    }

    public SendPushNotificationForScreenNameRequest setSendToAllDevices(boolean sendToAllDevices) {
        this.sendToAllDevices = sendToAllDevices;
        return this;
    }

    public String getScreenName() {
        return screenName;
    }

    public SendPushNotificationForScreenNameRequest setScreenName(String screenName) {
        this.screenName = screenName;
        return this;
    }

    public boolean isProcessCommonScrub() {
        return processCommonScrub;
    }

    public SendPushNotificationForScreenNameRequest setProcessCommonScrub(boolean processCommonScrub) {
        this.processCommonScrub = processCommonScrub;
        return this;
    }

    @Override
    public String toString() {
        return ToStringBuilder.reflectionToString(this, ToStringStyle.SHORT_PREFIX_STYLE);
    }

    public List<String> getFcmIds() {
        return fcmIds;
    }

    public SendPushNotificationForScreenNameRequest setFcmIds(List<String> fcmIds) {
        this.fcmIds = fcmIds;
        return this;
    }

    public String getCampaignId() {
        return campaignId;
    }

    public void setCampaignId(String campaignId) {
        this.campaignId = campaignId;
    }
}
