package com.gvc.crmadmin.config;

import org.joda.time.format.DateTimeFormat;
import org.joda.time.format.DateTimeFormatter;

import static org.joda.time.DateTimeZone.UTC;

/**
 * Application constants.
 */
public final class Constants {

    //Regex for acceptable logins
    public static final String LOGIN_REGEX = "^[_'.@A-Za-z0-9-]*$";

    public static final String SYSTEM_ACCOUNT = "system";
    public static final String ANONYMOUS_USER = "anonymoususer";

    public static final DateTimeFormatter CAMPAIGN_SCHEDULE_TIME_FORMAT = DateTimeFormat
        .forPattern("yyyy-MM-dd HH:mm:ss").withZone(UTC);


    //Production
//    public static final String REFRESH_URL = "http://10.166.144.114:8080/api/rest/cmsgateway/v1/getTargetGroupSize";
//    public static final String LAUNCH_URL = "http://10.166.144.114:8080/api/rest/cmsgateway/v1/pushNotificationCampaign";
//    public static final String TEST_URL = "http://10.166.144.114:8080/api/rest/cmsgateway/v1/sendPushNotificationForScreenName";
//    public static final String OPTIMOVE_INSTANCES_URL = "http://10.166.144.114:8080/api/rest/cmsgateway/v1/getOptimoveInstances";
//    public static final String ADD_OPTIMOVE_CHANNEL_TEMPLATE_URL = "http://10.166.144.114:8080/api/rest/cmsgateway/v1/addChannelTemplate";
//    public static final String INSIGHTS_URL = "http://10.166.144.114:8080/api/rest/cmsgateway/v1/getAppInsights";
//    public static final String CANCEL_URL = "http://10.166.144.114:8080/api/rest/cmsgateway/v1/cancelPushNotificationCampaign";

    public static final String REFRESH_URL = "http://trdev-campaign-api-container.ivycomptech.co.in/api/rest/cmsgateway/v1/getTargetGroupSize";
    public static final String LAUNCH_URL = "http://trdev-campaign-api-container.ivycomptech.co.in/api/rest/cmsgateway/v1/pushNotificationCampaign";
    public static final String TEST_URL = "http://trdev-campaign-api-container.ivycomptech.co.in/api/rest/cmsgateway/v1/sendPushNotificationForScreenName";
    public static final String OPTIMOVE_INSTANCES_URL = "http://trdev-campaign-api-container.ivycomptech.co.in/api/rest/cmsgateway/v1/getOptimoveInstances";
    public static final String ADD_OPTIMOVE_CHANNEL_TEMPLATE_URL = "http://trdev-campaign-api-container.ivycomptech.co.in/api/rest/cmsgateway/v1/addChannelTemplate";
    public static final String INSIGHTS_URL = "http://trdev-campaign-api-container.ivycomptech.co.in/api/rest/cmsgateway/v1/getAppInsights";
    public static final String CANCEL_URL = "http://trdev-campaign-api-container.ivycomptech.co.in/api/rest/cmsgateway/v1/cancelPushNotificationCampaign";

    private Constants() {
    }

    public enum CampaignTemplateStatus {
        DRAFT("DRAFT"),
        LIVE("LIVE"),
        PENDING("PENDING"),
        COMPLETED("COMPLETED"),
        CANCELLED("CANCELLED"),
        DELETED("DELETED");

        private final String status;

        CampaignTemplateStatus(String status) {
            this.status = status;
        }

        public String getStatus() {
            return status;
        }
    }
}
