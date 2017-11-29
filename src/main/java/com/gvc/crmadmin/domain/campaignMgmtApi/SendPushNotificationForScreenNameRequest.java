package com.gvc.crmadmin.domain.campaignMgmtApi;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.gvc.crmadmin.domain.MessageTemplate;
import com.gvc.crmadmin.domain.enumeration.Product;
import org.apache.commons.lang3.builder.ToStringBuilder;
import org.apache.commons.lang3.builder.ToStringStyle;

import java.io.Serializable;
import java.util.List;

/**
 * Request for sending push notification
 * Created by Sai Sharath Palivela on 10-10-2017.
 */
@JsonIgnoreProperties(ignoreUnknown = true)
public class SendPushNotificationForScreenNameRequest implements Serializable {

    private static final long serialVersionUID = -7373027847888697579L;

    @JsonProperty("frontEnd")
    private String frontEnd;

    @JsonProperty("product")
    private Product product;

    @JsonProperty("sendToAllDevices")
    private boolean sendToAllDevices;

    @JsonProperty("screenName")
    private String screenName;

    @JsonProperty("targetGroupContentCriteria")
    private List<MessageTemplate> messageContents;

    @JsonProperty("metaData")
    private String metaData;

    @JsonProperty("processCommonScrub")
    private boolean processCommonScrub;

    @JsonProperty("campaignId")
    private String campaignId;

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

    public String getCampaignId() {
        return campaignId;
    }

    public void setCampaignId(String campaignId) {
        this.campaignId = campaignId;
    }

    public List<MessageTemplate> getMessageContents() {
        return messageContents;
    }

    public SendPushNotificationForScreenNameRequest setMessageContents(List<MessageTemplate> messageContents) {
        this.messageContents = messageContents;
        return this;
    }
}
