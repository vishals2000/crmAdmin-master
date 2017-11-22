package com.gvc.crmadmin.config;

/**
 * Application constants.
 */
public final class Constants {

    //Regex for acceptable logins
    public static final String LOGIN_REGEX = "^[_'.@A-Za-z0-9-]*$";

    public static final String SYSTEM_ACCOUNT = "system";
    public static final String ANONYMOUS_USER = "anonymoususer";


    //Production
//    public static final String REFRESH_URL = "http://10.166.144.114:8080/api/rest/cmsgateway/v1/getTargetGroupSize";
//    public static final String LAUNCH_URL = "http://10.166.144.114:8080/api/rest/cmsgateway/v1/pushNotificationCampaign";
//    public static final String TEST_URL = "http://10.166.144.114:8080/api/rest/cmsgateway/v1/sendPushNotificationForScreenName";
//    public static final String INSIGHTS_URL = "http://10.166.144.114:8080/api/rest/cmsgateway/v1/getAppInsights";
//    public static final String CANCEL_URL = "http://10.166.144.114:8080/api/rest/cmsgateway/v1/cancelPushNotificationCampaign";

    public static final String REFRESH_URL = "http://trdev-campaign-api-container.ivycomptech.co.in/api/rest/cmsgateway/v1/getTargetGroupSize";
    public static final String LAUNCH_URL = "http://trdev-campaign-api-container.ivycomptech.co.in/api/rest/cmsgateway/v1/pushNotificationCampaign";
    public static final String TEST_URL = "http://trdev-campaign-api-container.ivycomptech.co.in/api/rest/cmsgateway/v1/sendPushNotificationForScreenName";
    public static final String INSIGHTS_URL = "http://trdev-campaign-api-container.ivycomptech.co.in/api/rest/cmsgateway/v1/getAppInsights";
    public static final String CANCEL_URL = "http://trdev-campaign-api-container.ivycomptech.co.in/api/rest/cmsgateway/v1/cancelPushNotificationCampaign";

    private Constants() {
    }
}
