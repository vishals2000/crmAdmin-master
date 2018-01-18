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

    public static final String TR_DEV = "http://trdev-campaign-api-container.ivycomptech.co.in/";
    public static final String TR_DEV_DATA = "/home/ppoker/data/";

    public static final String GIB_PROD = "http://10.166.144.114:8080/";
    public static final String GIB_PROD_DATA = "/home/pg/data/";

    public static final String US_NJ_AT_REG1 = "http://10.1.107.151:8080/";
    public static final String US_NJ_AT_REG1_DATA = "/home/qauser/data";

    public static final String US_NJ_PROD = "http://10.63.76.135:8080/";
    public static final String US_NJ_PROD_DATA = "/home/pg/data/";

    public static final String ENVIRONMENT = TR_DEV;
    public static final String ENVIRONMENT_DATA = TR_DEV_DATA;

    public static final DateTimeFormatter CAMPAIGN_SCHEDULE_TIME_FORMAT = DateTimeFormat.forPattern("yyyy-MM-dd HH:mm:ss").withZone(UTC);

    public static final String REFRESH_URL = ENVIRONMENT + "api/rest/cmsgateway/v1/getTargetGroupSize";
    public static final String LAUNCH_URL = ENVIRONMENT + "api/rest/cmsgateway/v1/pushNotificationCampaign";
    public static final String TEST_URL = ENVIRONMENT + "api/rest/cmsgateway/v1/sendPushNotificationForScreenName";
    public static final String OPTIMOVE_INSTANCES_URL = ENVIRONMENT + "api/rest/cmsgateway/v1/getOptimoveInstances";
    public static final String ADD_OPTIMOVE_CHANNEL_TEMPLATE_URL = ENVIRONMENT + "api/rest/cmsgateway/v1/addChannelTemplate";
    public static final String INSIGHTS_URL = ENVIRONMENT + "api/rest/cmsgateway/v1/getAppInsights";
    public static final String CANCEL_URL = ENVIRONMENT + "api/rest/cmsgateway/v1/cancelPushNotificationCampaign";
    public static final String DATA_DIR = ENVIRONMENT_DATA;
    public static final int BULK_SAVE_BATCH_SIZE = 10000;

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
