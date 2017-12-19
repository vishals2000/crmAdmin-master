package com.gvc.crmadmin.web.rest;

import com.codahale.metrics.annotation.Timed;
import com.gvc.crmadmin.config.Constants;
import com.gvc.crmadmin.domain.*;
import com.gvc.crmadmin.domain.campaignMgmtApi.*;
import com.gvc.crmadmin.domain.enumeration.RecurrenceType;
import com.gvc.crmadmin.service.AppsService;
import com.gvc.crmadmin.service.CampaignGroupService;
import com.gvc.crmadmin.service.CampaignTemplateService;
import com.gvc.crmadmin.web.rest.util.HeaderUtil;
import com.gvc.crmadmin.web.rest.util.PaginationUtil;
import io.github.jhipster.web.util.ResponseUtil;
import io.swagger.annotations.ApiParam;
import org.joda.time.DateTime;
import org.joda.time.DateTimeZone;
import org.joda.time.format.DateTimeFormatter;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.data.mongodb.core.query.Update;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;

import javax.validation.Valid;
import java.io.UnsupportedEncodingException;
import java.net.URI;
import java.net.URISyntaxException;
import java.net.URLEncoder;
import java.util.Collections;
import java.util.List;
import java.util.Optional;

import static com.gvc.crmadmin.service.util.Utils.getCurrentDateTimeInUTC;
import static com.gvc.crmadmin.service.util.Utils.getCurrentDateTimeInUTCAsString;

/**
 * REST controller for managing CampaignTemplate.
 */
@RestController
@RequestMapping("/api")
public class CampaignTemplateResource {

    private final Logger log = LoggerFactory.getLogger(CampaignTemplateResource.class);

    private static final String ENTITY_NAME = "campaignTemplate";

    private final CampaignTemplateService campaignTemplateService;

    @Autowired
    private CampaignGroupService campaignGroupService;
    @Autowired
    private AppsService appsService;
    @Autowired
    private MongoTemplate mongoTemplate;

    public CampaignTemplateResource(CampaignTemplateService campaignTemplateService) {
        this.campaignTemplateService = campaignTemplateService;
    }

    /**
     * POST  /campaign-templates : Create a new campaignTemplate.
     *
     * @param campaignTemplate the campaignTemplate to create
     * @return the ResponseEntity with status 201 (Created) and with body the new campaignTemplate, or with status 400 (Bad Request) if the campaignTemplate has already an ID
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PostMapping("/campaign-templates")
    @Timed
    public ResponseEntity<CampaignTemplate> createCampaignTemplate(@Valid @RequestBody CampaignTemplate campaignTemplate) throws URISyntaxException, UnsupportedEncodingException {
        log.debug("REST request to save CampaignTemplate : {}", campaignTemplate);
        /*if (campaignTemplate.getId() != null) {
            return ResponseEntity.badRequest().headers(HeaderUtil.createFailureAlert(ENTITY_NAME, "idexists", "A new campaignTemplate cannot already have an ID")).body(null);
        }*/

        CampaignTemplate result;
        CampaignTemplate campaignTemplateFromDB = campaignTemplateService.findOne(campaignTemplate.getId());
        if(campaignTemplateFromDB == null){
            campaignTemplate.setModifiedAt(getCurrentDateTimeInUTCAsString());
            campaignTemplate.setStatus(Constants.CampaignTemplateStatus.DRAFT.toString());
            result = campaignTemplateService.save(campaignTemplate);
        } else{
            return ResponseEntity.badRequest()
                .headers(HeaderUtil.createFailureAlert(ENTITY_NAME, campaignTemplateFromDB.getId(), "Campaign Template with the given name exists"))
                .body(campaignTemplateFromDB);
        }
        return ResponseEntity.created(new URI(URLEncoder.encode("/api/campaign-templates/group/" + result.getCampaignGroupId(), "UTF-8")))
            .headers(HeaderUtil.createEntityCreationAlert(ENTITY_NAME, result.getId()))
            .body(result);
    }

    /**
     * PUT  /campaign-templates : Updates an existing campaignTemplate.
     *
     * @param campaignTemplate the campaignTemplate to update
     * @return the ResponseEntity with status 200 (OK) and with body the updated campaignTemplate,
     * or with status 400 (Bad Request) if the campaignTemplate is not valid,
     * or with status 500 (Internal Server Error) if the campaignTemplate couldn't be updated
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PutMapping("/campaign-templates")
    @Timed
    public ResponseEntity<CampaignTemplate> updateCampaignTemplate(@Valid @RequestBody CampaignTemplate campaignTemplate) throws URISyntaxException, UnsupportedEncodingException {
        log.debug("REST request to update CampaignTemplate : {}", campaignTemplate);
        CampaignTemplate copyCampaignTemplate = campaignTemplate.copy();

        //If there is no change in the campaign Name, then the campaign id will not change
        if(campaignTemplate.getId().equals(copyCampaignTemplate.getId())) {
            if (campaignTemplate.getId() == null) {
                return createCampaignTemplate(campaignTemplate);
            }
            campaignTemplate.setModifiedAt(getCurrentDateTimeInUTCAsString());
            CampaignTemplate result = campaignTemplateService.save(campaignTemplate);
            return ResponseEntity.ok()
                .headers(HeaderUtil.createEntityUpdateAlert(ENTITY_NAME, campaignTemplate.getId()))
                .body(result);
        } else {
            //There is a change in the campaign name
            //Try creating new campaign template with the new name
            ResponseEntity<CampaignTemplate> campaignCreationResponse = createCampaignTemplate(copyCampaignTemplate);
            if(!campaignCreationResponse.getStatusCode().equals(HttpStatus.BAD_REQUEST)) {
                campaignTemplateService.delete(campaignTemplate.getId());
            }
            return campaignCreationResponse;
        }
    }

    @PostMapping("/campaign-templates/getTargetGroupSize")
    @Timed
    public ResponseEntity<PushNotificationCampaignTargetGroupSizeResponse> getPushNotificationTargetGroupSize(@Valid @RequestBody PushNotificationCampaignTargetGroupSizeRequest pushNotificationCampaignTargetGroupSizeRequest) throws URISyntaxException, UnsupportedEncodingException {
        log.debug("REST request to get getPushNotificationTargetGroupSize", pushNotificationCampaignTargetGroupSizeRequest);

        RestTemplate restTemplate = new RestTemplate();
        PushNotificationCampaignTargetGroupSizeResponse pushNotificationCampaignTargetGroupSizeResponse = restTemplate.postForObject(Constants.REFRESH_URL, pushNotificationCampaignTargetGroupSizeRequest, PushNotificationCampaignTargetGroupSizeResponse.class);

        System.out.println(pushNotificationCampaignTargetGroupSizeResponse);
        return ResponseUtil.wrapOrNotFound(Optional.of(pushNotificationCampaignTargetGroupSizeResponse));
    }
    @PostMapping("campaign-templates/getTargetContentGroupSize")
    @Timed
    public ResponseEntity<PushNotificationCampaignTargetGroupContentSizeResponse> getPushNotificationTargetGroupSizeForLanguage(@Valid @RequestBody PushNotificationCampaignTargetGroupContentSizeRequest pushNotificationCampaignTargetGroupContentSizeRequest) throws URISyntaxException, UnsupportedEncodingException {
        log.debug("REST request to get pushNotificationCampaignTargetGroupContentSizeRequest", pushNotificationCampaignTargetGroupContentSizeRequest);

        /*
        if(!StringUtils.hasText(pushNotificationCampaignTargetGroupContentSizeRequest.getLanguage())){
            log.debug("No language passed in pushNotificationCampaignTargetGroupContentSizeRequest", pushNotificationCampaignTargetGroupContentSizeRequest);
            PushNotificationCampaignTargetGroupContentSizeResponse pushNotificationCampaignTargetGroupSizeResponse = new PushNotificationCampaignTargetGroupContentSizeResponse();
            pushNotificationCampaignTargetGroupSizeResponse.setTargetGroupSize(0L);
            System.out.println(pushNotificationCampaignTargetGroupSizeResponse);
            return ResponseUtil.wrapOrNotFound(Optional.of(pushNotificationCampaignTargetGroupSizeResponse));
        }
        */

        PushNotificationCampaignTargetGroupSizeRequest pushNotificationCampaignTargetGroupSizeRequest = new PushNotificationCampaignTargetGroupSizeRequest();
        pushNotificationCampaignTargetGroupSizeRequest.setFrontEnd(pushNotificationCampaignTargetGroupContentSizeRequest.getFrontEnd());
        pushNotificationCampaignTargetGroupSizeRequest.setProduct(pushNotificationCampaignTargetGroupContentSizeRequest.getProduct());
        pushNotificationCampaignTargetGroupSizeRequest.setTargetGroupFilterCriteria(pushNotificationCampaignTargetGroupContentSizeRequest.getTargetGroupFilterCriteria());
        pushNotificationCampaignTargetGroupSizeRequest.setLanguages(Collections.singletonList(pushNotificationCampaignTargetGroupContentSizeRequest.getLanguage()));

        RestTemplate restTemplate = new RestTemplate();
        PushNotificationCampaignTargetGroupContentSizeResponse pushNotificationCampaignTargetGroupSizeResponse = restTemplate.postForObject(Constants.REFRESH_URL, pushNotificationCampaignTargetGroupSizeRequest, PushNotificationCampaignTargetGroupContentSizeResponse.class);

        System.out.println(pushNotificationCampaignTargetGroupSizeResponse);
        return ResponseUtil.wrapOrNotFound(Optional.of(pushNotificationCampaignTargetGroupSizeResponse));
    }

    @PostMapping("/campaign-templates/sendPushNotificationForScreenName")
    @Timed
    public ResponseEntity<PushNotificationForScreenNameResponse> sendPushNotificationForScreenName(@Valid @RequestBody SendPushNotificationForScreenNameRequest sendPushNotificationForScreenNameRequest) throws URISyntaxException, UnsupportedEncodingException {
        log.debug("REST request to get sendPushNotificationForScreenName", sendPushNotificationForScreenNameRequest);

        RestTemplate restTemplate = new RestTemplate();
        PushNotificationForScreenNameResponse pushNotificationForScreenNameResponse = restTemplate.postForObject(Constants.TEST_URL, sendPushNotificationForScreenNameRequest, PushNotificationForScreenNameResponse.class);

        log.debug("pushNotificationForScreenNameResponse " + pushNotificationForScreenNameResponse + " for " + sendPushNotificationForScreenNameRequest);
        return ResponseUtil.wrapOrNotFound(Optional.of(pushNotificationForScreenNameResponse));
    }

    /** This is used to get all the optimove instances to enable pushing a template to one or more Optimove instances*/
    @GetMapping("/campaign-templates/getOptimoveInstances")
    @Timed
    @SuppressWarnings("unchecked")
    public ResponseEntity<OptimoveInstances> getOptimoveInstances() throws URISyntaxException, UnsupportedEncodingException {
        log.debug("REST request to getOptimoveInstances");

        RestTemplate restTemplate = new RestTemplate();
        List optimoveInstanceNames = restTemplate.getForObject(Constants.OPTIMOVE_INSTANCES_URL, List.class);

        OptimoveInstances optimoveInstances = new OptimoveInstances();
        optimoveInstances.setOptimoveInstanceNames(optimoveInstanceNames);
        log.debug("optimoveInstances " + optimoveInstances);
        return ResponseUtil.wrapOrNotFound(Optional.of(optimoveInstances));
    }


    /**
     * This is used to cancel a push notification campaign
     * @param pushNotificationCampaignTemplate
     * @return
     * @throws URISyntaxException
     * @throws UnsupportedEncodingException
     */
    @PostMapping("/campaign-templates/cancelPushNotificationCampaign")
    @Timed
    public ResponseEntity<PushNotificationCampaignCancellationResponse> cancelPushNotificationCampaign(@Valid @RequestBody PushNotificationCampaignTemplate pushNotificationCampaignTemplate) throws URISyntaxException, UnsupportedEncodingException {
        log.info("REST request to cancel pushNotificationCampaign", pushNotificationCampaignTemplate);
        return cancelPushNotificationCampaignHelper(pushNotificationCampaignTemplate);
    }

    private ResponseEntity<PushNotificationCampaignCancellationResponse> cancelPushNotificationCampaignHelper(PushNotificationCampaignTemplate pushNotificationCampaignTemplate) {
        if(pushNotificationCampaignTemplate!= null && StringUtils.hasText(pushNotificationCampaignTemplate.getCampaignTemplateId())) {
            CampaignTemplate campaignTemplate = campaignTemplateService.findOne(pushNotificationCampaignTemplate.getCampaignTemplateId());
            if(campaignTemplate != null) {
                if(!campaignTemplate.isAlreadyLaunched()) {
                    return ResponseUtil.wrapOrNotFound(Optional.of(new PushNotificationCampaignCancellationResponse("Campaign already cancelled", true)));
                }
                if(!campaignTemplate.isAlreadyCancelled()) {
                        RestTemplate restTemplate = new RestTemplate();
                        PushNotificationCampaignCancellationResponse pushNotificationCampaignCancellationResponse = restTemplate.postForObject(Constants.CANCEL_URL, pushNotificationCampaignTemplate, PushNotificationCampaignCancellationResponse.class);
                        if (pushNotificationCampaignCancellationResponse.isResult()) {
                            updateCampaignCancellationStatus(pushNotificationCampaignTemplate.getCampaignTemplateId(), pushNotificationCampaignCancellationResponse.isResult());
                            campaignTemplate = campaignTemplateService.findOne(pushNotificationCampaignTemplate.getCampaignTemplateId());
                            //If the campaign is a recurring campaign, then cancellation of a LIVE campaign should change the status of the campaign to COMPLETED
                            final DateTime campaignEndTime = getCampaignEndTime(campaignTemplate);

                            final DateTime currentTime = getCurrentDateTimeInUTC();
                            if(!campaignTemplate.getRecurrenceType().equals(RecurrenceType.NONE) && !currentTime.isAfter(campaignEndTime)) {
                                campaignTemplate.setStatus(Constants.CampaignTemplateStatus.COMPLETED.toString());
                                campaignTemplate.setLaunchEnabled(false);
                                campaignTemplate.setEditEnabled(false);
                                campaignTemplate.setCancelEnabled(false);
                                campaignTemplate.setDeleteEnabled(false);
                                campaignTemplateService.save(campaignTemplate);
                            } else if(campaignTemplate.getStatus().equals(Constants.CampaignTemplateStatus.PENDING.toString())) {
                                campaignTemplate.setStatus(Constants.CampaignTemplateStatus.CANCELLED.toString());
                                campaignTemplate.setLaunchEnabled(false);
                                campaignTemplate.setEditEnabled(false);
                                campaignTemplate.setCancelEnabled(false);
                                campaignTemplate.setDeleteEnabled(true);
                                campaignTemplateService.save(campaignTemplate);
                            }
                        }
                        return ResponseUtil.wrapOrNotFound(Optional.of(pushNotificationCampaignCancellationResponse));
                } else {
                    return ResponseUtil.wrapOrNotFound(Optional.of(new PushNotificationCampaignCancellationResponse("Campaign already cancelled", true)));
                }
            } else {
                return ResponseUtil.wrapOrNotFound(Optional.of(new PushNotificationCampaignCancellationResponse("Invalid campaign template Id", false)));
            }
        } else {
            return ResponseUtil.wrapOrNotFound(Optional.of(new PushNotificationCampaignCancellationResponse("Technical error. Cannot cancel the campaign.",false)));
        }
    }

    /**
     * This is used to launch a push notification campaign
     */
    @PostMapping("/campaign-templates/pushNotificationCampaign")
    @Timed
    public ResponseEntity<PushNotificationCampaignProcessingResponse> launchPushNotificationCampaign(@Valid @RequestBody PushNotificationCampaignTemplate pushNotificationCampaignTemplate) throws URISyntaxException, UnsupportedEncodingException {
        log.debug("REST request to launch pushNotificationCampaign", pushNotificationCampaignTemplate);

        if (StringUtils.hasText(pushNotificationCampaignTemplate.getCampaignTemplateId())) {
            CampaignTemplate campaignTemplate = campaignTemplateService.findOne(pushNotificationCampaignTemplate.getCampaignTemplateId());
            if(campaignTemplate != null) {
                if(campaignTemplate.isAlreadyDeleted()) {
                    return ResponseUtil.wrapOrNotFound(Optional.of(new PushNotificationCampaignProcessingResponse("Campaign has been deleted", false)));
                } else if (campaignTemplate.isAlreadyCancelled()) {
                    return ResponseUtil.wrapOrNotFound(Optional.of(new PushNotificationCampaignProcessingResponse("Campaign cancelled", false)));
                } else if (campaignTemplate.isAlreadyLaunched()) {
                    return ResponseUtil.wrapOrNotFound(Optional.of(new PushNotificationCampaignProcessingResponse("Campaign already launched", false)));
                }
            } else {
                return ResponseUtil.wrapOrNotFound(Optional.of(new PushNotificationCampaignProcessingResponse("Invalid campaign to launch", false)));
            }
        }

        /*CampaignTemplate campaignTemplate = campaignTemplateService.findOne(pushNotificationCampaignTemplate.getCampaignTemplateId());
        if(campaignTemplate.isSendImmediately()) {
            Minutes.minutesBetween()
        }*/

        RestTemplate restTemplate = new RestTemplate();
        PushNotificationCampaignProcessingResponse pushNotificationCampaignProcessingResponse = restTemplate.postForObject(Constants.LAUNCH_URL, pushNotificationCampaignTemplate, PushNotificationCampaignProcessingResponse.class);
        if(pushNotificationCampaignProcessingResponse.isResult()) {
            updateCampaignTemplateLaunchSuccessful(pushNotificationCampaignTemplate.getCampaignTemplateId(), pushNotificationCampaignProcessingResponse.isResult());
        }
        log.debug("pushNotificationCampaignProcessingResponse " + pushNotificationCampaignProcessingResponse + " for " + pushNotificationCampaignTemplate);
        return ResponseUtil.wrapOrNotFound(Optional.of(pushNotificationCampaignProcessingResponse));
    }

    /**
     * GET  /campaign-templates : get all the campaignTemplates.
     *
     * @param pageable the pagination information
     * @return the ResponseEntity with status 200 (OK) and the list of campaignTemplates in body
     */
    @GetMapping("/campaign-templates")
    @Timed
    public ResponseEntity<List<CampaignTemplate>> getAllCampaignTemplates(@ApiParam Pageable pageable) {
        log.debug("REST request to get a page of CampaignTemplates");
        Page<CampaignTemplate> page = campaignTemplateService.findAll(pageable);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(page, "/api/campaign-templates");
        return new ResponseEntity<>(page.getContent(), headers, HttpStatus.OK);
    }

    /**
     * GET  /campaign-templates/:id : get the "id" campaignTemplate.
     *
     * @param id the id of the campaignTemplate to retrieve
     * @return the ResponseEntity with status 200 (OK) and with body the campaignTemplate, or with status 404 (Not Found)
     */
    @GetMapping("/campaign-templates/{id}")
    @Timed
    public ResponseEntity<CampaignTemplate> getCampaignTemplate(@PathVariable String id) {
        log.debug("REST request to get CampaignTemplate : {}", id);
        CampaignTemplate campaignTemplate = campaignTemplateService.findOne(id);
        return ResponseUtil.wrapOrNotFound(Optional.ofNullable(campaignTemplate));
    }

    @GetMapping("/campaign-templates/appCampaignGroupInfoWithCampaignTemplateId/{campaignTemplateId}")
    @Timed
    public ResponseEntity<AppCampaignGroupInfo> getAppCampaignGroupInfoWithCampaignTemplateId(@PathVariable String campaignTemplateId) {
        CampaignTemplate campaignTemplate = campaignTemplateService.findOne(campaignTemplateId);
        CampaignGroup campaignGroup = campaignGroupService.findOne(campaignTemplate.getCampaignGroupId());
        Apps app = appsService.findOne(campaignGroup.getProjectId());
        AppCampaignGroupInfo appCampaignGroupInfo = new AppCampaignGroupInfo();
        appCampaignGroupInfo.setAppId(app.getId())
            .setAppName(app.getName())
            .setCampaignGroupId(campaignGroup.getId())
            .setCampaignGroupName(campaignGroup.getName());
        return ResponseUtil.wrapOrNotFound(Optional.of(appCampaignGroupInfo));
    }

    @GetMapping("/campaign-templates/appCampaignGroupInfoWithCampaignGroupId/{campaignGroupId}")
    @Timed
    public ResponseEntity<AppCampaignGroupInfo> getAppCampaignGroupInfoWithCampaignGroupId(@PathVariable String campaignGroupId) {
        CampaignGroup campaignGroup = campaignGroupService.findOne(campaignGroupId);
        Apps app = appsService.findOne(campaignGroup.getProjectId());
        AppCampaignGroupInfo appCampaignGroupInfo = new AppCampaignGroupInfo();
        appCampaignGroupInfo.setAppId(app.getId())
            .setAppName(app.getName())
            .setCampaignGroupId(campaignGroup.getId())
            .setCampaignGroupName(campaignGroup.getName());
        return ResponseUtil.wrapOrNotFound(Optional.of(appCampaignGroupInfo));
    }

    /**
     * This is used to get all campaign templates for a campaign group
     * */
    @GetMapping("/campaign-templates/group/{campaignGroupId}")
    @Timed
    public ResponseEntity<List<CampaignTemplate>> getAllCampaignsForCampaignGroup(@ApiParam Pageable pageable, @PathVariable String campaignGroupId) {
        log.debug("REST request to get a page of CampaignTemplates with campaignGroupId : " + campaignGroupId);
        Page<CampaignTemplate> page = campaignTemplateService.findByCampaignGroupId(pageable, campaignGroupId);

        updateCampaignTemplates(page);

        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(page, "/api/campaign-templates/group/" + campaignGroupId);
        return new ResponseEntity<>(page.getContent(), headers, HttpStatus.OK);
    }

    @GetMapping("/campaign-templates/group/{campaignGroupId}/search/{campaignTemplateName}")
    @Timed
    public ResponseEntity<List<CampaignTemplate>> getAllCampaignsForCampaignGroupByName(@ApiParam Pageable pageable, @PathVariable String campaignGroupId, @PathVariable String campaignTemplateName) {
        log.debug("REST request to get a page of CampaignTemplates with campaignGroupId : " + campaignGroupId + " campaignTemplateName : " + campaignTemplateName);
        Page<CampaignTemplate> page = campaignTemplateService.findByCampaignGroupIdAndName(pageable, campaignGroupId, campaignTemplateName);

        updateCampaignTemplates(page);

        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(page, "/api/campaign-templates/group/" + campaignGroupId + "/search/" + campaignTemplateName);
        return new ResponseEntity<>(page.getContent(), headers, HttpStatus.OK);
    }

    private void updateCampaignTemplates(Page<CampaignTemplate> page) {
        final DateTime currentDateTime = new DateTime(DateTimeZone.UTC).withSecondOfMinute(0).withMillisOfSecond(0);

    	for(final CampaignTemplate campaignTemplate : page.getContent()){

    	    if(Constants.CampaignTemplateStatus.DELETED.getStatus().equals(campaignTemplate.getStatus()) ||
                Constants.CampaignTemplateStatus.COMPLETED.getStatus().equals(campaignTemplate.getStatus()) ||
                Constants.CampaignTemplateStatus.CANCELLED.getStatus().equals(campaignTemplate.getStatus())) {
    	        continue;
            }

            final DateTime startTime = getCampaignStartTime(campaignTemplate);
            final DateTime endTime = getCampaignEndTime(campaignTemplate);


            //Create temp campaign template object to check if it has to be saved later
            final CampaignTemplate tempCampaignTemplate = new CampaignTemplate();
            tempCampaignTemplate.setAlreadyLaunched(campaignTemplate.isAlreadyLaunched());
            tempCampaignTemplate.setStatus(campaignTemplate.getStatus());
            tempCampaignTemplate.setLaunchEnabled(campaignTemplate.isLaunchEnabled());
            tempCampaignTemplate.setEditEnabled(campaignTemplate.isEditEnabled());
            tempCampaignTemplate.setCancelEnabled(campaignTemplate.isCancelEnabled());
            tempCampaignTemplate.setDeleteEnabled(campaignTemplate.isDeleteEnabled());

            /*
            *   Current Time	            alreadyDeleted	        alreadyCancelled	    alreadyLaunched	    STATUS	    launchEnabled	editEnabled	    cancelEnabled	deleteEnabled
            *   ==================================================================================================================================================================================
            *   < StartTime	                    FALSE	                FALSE	            FALSE	            DRAFT	        TRUE	        TRUE	        FALSE	        TRUE
            *   > StartTime and < EndTime	    FALSE	                FALSE	            FALSE	            DRAFT	        FALSE	        TRUE	        FALSE	        TRUE
            *   > EndTime	                    FALSE	                FALSE	            FALSE	            DRAFT	        FALSE	        TRUE	        FALSE	        TRUE
            *
            *   < StartTime	                    FALSE	                FALSE	            TRUE	            PENDING	        FALSE	        FALSE	        TRUE	        TRUE
            *   > StartTime and < EndTime	    FALSE	                FALSE	            TRUE	            LIVE	        FALSE	        FALSE	        TRUE	        TRUE
            *   > EndTime	                    FALSE	                FALSE	            TRUE	            COMPLETED	    FALSE	        FALSE	        FALSE	        FALSE
            *
            *   < StartTime	                    FALSE	                TRUE	            TRUE	            CANCELLED	    FALSE	        FALSE
            *   > StartTime and < EndTime	    FALSE	                TRUE	            TRUE	            CANCELLED	    FALSE	        FALSE
            *   > EndTime	                    FALSE	                TRUE	            TRUE	            CANCELLED	    FALSE	        FALSE	        FALSE	        FALSE
            *
            *   < StartTime	                    TRUE		                                TRUE	            DELETED	        FALSE	        FALSE	        TRUE	        TRUE
            *   > StartTime and < EndTime	    TRUE		                                TRUE	            DELETED	        FALSE	        FALSE	        TRUE	        TRUE
            *   > EndTime	                    TRUE		                                TRUE	            DELETED	        FALSE	        FALSE	        FALSE	        FALSE
            * */

            if(currentDateTime.isBefore(startTime) || currentDateTime.equals(startTime)) {
                // before the startTime of the campaign
                if(campaignTemplate.isAlreadyDeleted()) {
                    campaignTemplate.setStatus(Constants.CampaignTemplateStatus.DELETED.getStatus()); // the campaign was launched and then deleted. If the campaign is not launched, then delete the campaign
                    campaignTemplate.setLaunchEnabled(false);
                    campaignTemplate.setEditEnabled(false);
                    campaignTemplate.setCancelEnabled(false);
                    campaignTemplate.setDeleteEnabled(false);
                } else if (campaignTemplate.isAlreadyCancelled()) {
                    campaignTemplate.setStatus(Constants.CampaignTemplateStatus.CANCELLED.getStatus()); // the campaign was launched and then cancelled.
                    campaignTemplate.setLaunchEnabled(false);
                    campaignTemplate.setEditEnabled(false);
                    campaignTemplate.setCancelEnabled(false);
                    campaignTemplate.setDeleteEnabled(true);
                } else if (campaignTemplate.isAlreadyLaunched()) {
                    if(currentDateTime.equals(startTime)) {
                        if(campaignTemplate.getRecurrenceType().equals(RecurrenceType.NONE)) {
                            campaignTemplate.setStatus(Constants.CampaignTemplateStatus.COMPLETED.getStatus());
                        } else {
                            campaignTemplate.setStatus(Constants.CampaignTemplateStatus.LIVE.getStatus());
                        }
                        campaignTemplate.setLaunchEnabled(false);
                        campaignTemplate.setEditEnabled(false);
                        campaignTemplate.setCancelEnabled(true);
                        campaignTemplate.setDeleteEnabled(true);
                    } else {
                        campaignTemplate.setStatus(Constants.CampaignTemplateStatus.PENDING.getStatus()); // the campaign was launched
                        campaignTemplate.setLaunchEnabled(false);
                        campaignTemplate.setEditEnabled(false);
                        campaignTemplate.setCancelEnabled(true);
                        campaignTemplate.setDeleteEnabled(true);
                    }
                } else {
                    campaignTemplate.setStatus(Constants.CampaignTemplateStatus.DRAFT.getStatus()); // the campaign was not launched
                    campaignTemplate.setLaunchEnabled(true);
                    campaignTemplate.setEditEnabled(true);
                    campaignTemplate.setCancelEnabled(false);
                    campaignTemplate.setDeleteEnabled(true);
                }
            } else if (currentDateTime.isBefore(endTime)) {
                // after the startTime of the campaign and before the endTime of the campaign
                if(campaignTemplate.isAlreadyDeleted()) {
                    campaignTemplate.setStatus(Constants.CampaignTemplateStatus.DELETED.getStatus()); // the campaign was launched and then deleted. IF the campaign is not launched, then delete the campaign
                    campaignTemplate.setLaunchEnabled(false);
                    campaignTemplate.setEditEnabled(false);
                    campaignTemplate.setCancelEnabled(false);
                    campaignTemplate.setDeleteEnabled(false);
                } else if (campaignTemplate.isAlreadyCancelled()) {
                    campaignTemplate.setStatus(Constants.CampaignTemplateStatus.CANCELLED.getStatus()); // the campaign was launched and then cancelled.
                    campaignTemplate.setLaunchEnabled(false);
                    campaignTemplate.setEditEnabled(false);
                    campaignTemplate.setCancelEnabled(false);
                    campaignTemplate.setDeleteEnabled(true);
                } else if (campaignTemplate.isAlreadyLaunched()) {
                    campaignTemplate.setStatus(Constants.CampaignTemplateStatus.LIVE.getStatus()); // the campaign was launched
                    campaignTemplate.setLaunchEnabled(false);
                    campaignTemplate.setEditEnabled(false);
                    campaignTemplate.setCancelEnabled(true);
                    campaignTemplate.setDeleteEnabled(true);
                } else {
                    campaignTemplate.setStatus(Constants.CampaignTemplateStatus.DRAFT.getStatus()); // the campaign was not launched
                    campaignTemplate.setLaunchEnabled(campaignTemplate.isSendImmediately());
                    campaignTemplate.setEditEnabled(true);
                    campaignTemplate.setCancelEnabled(false);
                    campaignTemplate.setDeleteEnabled(true);
                }
            } else {
                // after the endTime of the campaign
                if(campaignTemplate.isAlreadyDeleted()) {
                    campaignTemplate.setStatus(Constants.CampaignTemplateStatus.DELETED.getStatus()); // the campaign was launched and then deleted. IF the campaign is not launched, then delete the campaign
                    campaignTemplate.setLaunchEnabled(false);
                    campaignTemplate.setEditEnabled(false);
                    campaignTemplate.setCancelEnabled(false);
                    campaignTemplate.setDeleteEnabled(false);
                } else if (campaignTemplate.isAlreadyCancelled()) {
                    campaignTemplate.setStatus(Constants.CampaignTemplateStatus.CANCELLED.getStatus()); // the campaign was launched and then cancelled.
                    campaignTemplate.setLaunchEnabled(false);
                    campaignTemplate.setEditEnabled(false);
                    campaignTemplate.setCancelEnabled(false);
                    campaignTemplate.setDeleteEnabled(true);
                } else if (campaignTemplate.isAlreadyLaunched()) {
                    campaignTemplate.setStatus(Constants.CampaignTemplateStatus.COMPLETED.getStatus()); // the campaign was launched and completed successfully.
                    campaignTemplate.setLaunchEnabled(false);
                    campaignTemplate.setEditEnabled(false);
                    campaignTemplate.setCancelEnabled(false);
                    campaignTemplate.setDeleteEnabled(false);
                } else {
                    campaignTemplate.setStatus(Constants.CampaignTemplateStatus.DRAFT.getStatus()); // the campaign was not launched
                    campaignTemplate.setLaunchEnabled(campaignTemplate.isSendImmediately());
                    campaignTemplate.setEditEnabled(true);
                    campaignTemplate.setCancelEnabled(false);
                    campaignTemplate.setDeleteEnabled(true);
                }
            }

            if(saveCampaignTemplate(campaignTemplate, tempCampaignTemplate)) {
                campaignTemplateService.save(campaignTemplate);
            }
        }
    }
    /**
     * Save Campaign Template with the correct statuses to enable the UI to enable/disable the buttons based on the campaign status
     * */
    private static boolean saveCampaignTemplate(CampaignTemplate campaignTemplate, CampaignTemplate tempCampaignTemplate) {
        return !campaignTemplate.getStatus().equals(tempCampaignTemplate.getStatus()) ||
            campaignTemplate.isLaunchEnabled() != tempCampaignTemplate.isLaunchEnabled() ||
            campaignTemplate.isEditEnabled() != tempCampaignTemplate.isEditEnabled() ||
            campaignTemplate.isCancelEnabled() != tempCampaignTemplate.isCancelEnabled() ||
            campaignTemplate.isDeleteEnabled() != tempCampaignTemplate.isDeleteEnabled();
    }

    private DateTime getCampaignStartTime(CampaignTemplate campaignTemplate) {
        return getDateTimeFromString(Constants.CAMPAIGN_SCHEDULE_TIME_FORMAT, campaignTemplate.getStartDate().toString() + " " + campaignTemplate.getScheduledTime());
    }

    private DateTime getCampaignEndTime(CampaignTemplate campaignTemplate) {
        return getDateTimeFromString(Constants.CAMPAIGN_SCHEDULE_TIME_FORMAT, campaignTemplate.getRecurrenceEndDate().toString() + " " + campaignTemplate.getScheduledTime());
    }

    @GetMapping("/campaign-templates/feProduct/{campaignGroupId}")
    @Timed
    public ResponseEntity<FrontendProduct> getFeProduct(@PathVariable String campaignGroupId) {
        log.debug("REST request to get frontEnd and Product for campaign-templates - campaign group " + campaignGroupId);
        CampaignGroup campaignGroup = campaignGroupService.findOne(campaignGroupId);

        FrontendProduct frontendProduct = new FrontendProduct("","");
        if(campaignGroup != null) {
            Apps app = appsService.findOne(campaignGroup.getProjectId());
            if(app != null) {
                frontendProduct = new FrontendProduct(app.getFrontEnd(), app.getProduct().name());
            }
        }
        return ResponseUtil.wrapOrNotFound(Optional.of(frontendProduct));
    }

    /*
    *
    @DeleteMapping("/campaign-templates/{id}")
    @Timed
    public ResponseEntity<Void> deleteCampaignTemplate(@PathVariable String id) {
        log.debug("REST request to delete CampaignTemplate : {}", id);
        campaignTemplateService.delete(id);
        return ResponseEntity.ok().headers(HeaderUtil.createEntityDeletionAlert(ENTITY_NAME, id)).build();
    }
    * */

    /**
     * Deletes a push Notification campaign template
     * @param pushNotificationCampaignTemplate to be deleted
     * @return Void
     */
    @PostMapping("/campaign-templates/deletePushNotificationCampaign")
    @Timed
    public ResponseEntity<Void> deleteCampaignTemplate(@Valid @RequestBody PushNotificationCampaignTemplate pushNotificationCampaignTemplate) {

       /*
            According to discussion with Steve Winter on 28th November, 2017:

            Hi Steve

            Could you please let me know how the campaign deletion workflow should be implemented?
            From the discussions we had earlier, in my view, it should be implemented as below:
            1.	If the campaign is not yet launched, then delete action will delete the campaign right away.
                [This is fine]
            2.	If the campaign is launched
                a.	If the campaign execution is completed, then the delete action should be disabled
                    [This is fine]
                b.	If the campaign status is PENDING/LIVE, then the delete action should first cancel the campaign and then change the status of the campaign to DELETED, but should not actually delete the                                    campaign entirely from the system. Should the deleted campaign with the status as DELETED be shown to everyone or only to the super admin is debatable. I think it should be the same for
                    everyone, irrespective of the user status.

                    Sharath :     [If the campaign is in PENDING state, the campaign should be cancelled and then should be deleted from the system right away as no users are targeted because of the campaign.
                    Steve :       When a pending campaign is cancelled the status should change to cancelled, it should not delete automatically (users may want to copy it). Once cancelled, users may have the option
                                  to delete – if done, this can be deleted permanently (as long as it was never sent to any active devices).
                    [Sharath] [2017-12-08] Why? There is a separate button for cancellation of the campaign. The current question is only about the workflow for deletion of a campaign. If a PENDING campaign is DELETED, then it should be cancelled and then deleted entirely from the system. If the cancel button is clicked, then the campaign is only cancelled, not deleted. The marketer would still have the option to copy the campaign.
                    Sharath:      If the campaign is LIVE, which means that some players are targeted because of the campaign, then the campaign should be cancelled and should not be deleted entirely from the
                                    system but change the status to DELETED. For now, all users will be shown the status as DELETED. Will work on the super admin stuff later.]
                    Steve:        Status can change to complete, no option to delete should be available – message was sent to active devices in previous recurrences.  A campaign only goes from pending to live,
                                  once it has targeted real devices. If these are cancelled before the end recurring date, it should be considered as complete.
                c.	If the campaign is cancelled, then the delete action should be disabled
                    [This is fine]
         */
        log.debug("REST request to delete CampaignTemplate : {}", pushNotificationCampaignTemplate);
        return ResponseEntity.ok().headers(HeaderUtil.createFailureAlert(ENTITY_NAME, null,"Cannot delete a campaign which has targeted players")).build();

/*
        if(pushNotificationCampaignTemplate != null && StringUtils.hasText(pushNotificationCampaignTemplate.getCampaignTemplateId())) {
            CampaignTemplate campaignTemplate = campaignTemplateService.findOne(pushNotificationCampaignTemplate.getCampaignTemplateId());
            if (campaignTemplate == null || campaignTemplate.isAlreadyDeleted()) {
                //cannot delete a campaign, the status of which is DELETED
                return ResponseEntity.ok().headers(HeaderUtil.createFailureAlert(ENTITY_NAME, pushNotificationCampaignTemplate.getCampaignName(),"Campaign already deleted")).build();
            } else if (campaignTemplate.isAlreadyLaunched()) {

                //If the campaign is not already cancelled, then proceed with the cancellation of the campaign
                if(!campaignTemplate.isAlreadyCancelled()) {

                    log.info("Deleting campaign " + pushNotificationCampaignTemplate);
                    PushNotificationCampaignCancellationResponse pushNotificationCampaignCancellationResponse = cancelPushNotificationCampaignHelper(pushNotificationCampaignTemplate).getBody();
                    if(pushNotificationCampaignCancellationResponse.isResult()) {
                        campaignTemplate = campaignTemplateService.findOne(pushNotificationCampaignTemplate.getCampaignTemplateId());

                        final DateTime campaignCancellationTime = Utils.getDateTimeFromString(TIME_STAMP_FORMAT,  campaignTemplate.getCancellationTime());
                        final DateTime campaignStartTime = getCampaignStartTime(campaignTemplate);
                        //After the campaign is successfully cancelled, then, if the status in PENDING, delete the campaign from the system. If the status is LIVE, then change the status to DELETED.
                        if(campaignCancellationTime.isBefore(campaignStartTime)) {
                            campaignTemplateService.delete(campaignTemplate.getId());
                            return ResponseEntity.ok().headers(HeaderUtil.createAlert(campaignTemplate.getCampaignName() +" successfully deleted", campaignTemplate.getId())).build();
                        } else {
                            //If a recurring campaign is cancelled before the recurrence end date, then the status should change to COMPLETE after cancellation of the pending campaigns in the recurrence and should disable the delete button.
                            campaignTemplate.setStatus(Constants.CampaignTemplateStatus.COMPLETED.toString());
                            campaignTemplate.setLaunchEnabled(false);
                            campaignTemplate.setEditEnabled(false);
                            campaignTemplate.setCancelEnabled(false);
                            campaignTemplate.setDeleteEnabled(false);
                            campaignTemplateService.save(campaignTemplate);
                            return ResponseEntity.ok().headers(HeaderUtil.createAlert(campaignTemplate.getCampaignName() + " cancelled", campaignTemplate.getId())).build();
                        }
                    } else {
                        return ResponseEntity.ok().headers(HeaderUtil.createFailureAlert(ENTITY_NAME, campaignTemplate.getId(),campaignTemplate.getCampaignName() +" could not be cancelled. Not deleting the campaign")).build();
                    }
                } else {
                    log.info("Campaign " + pushNotificationCampaignTemplate.getCampaignTemplateId() + " already cancelled. Proceeding with deletion");

                    //If the campaign is already cancelled, then delete the campaign based on start time of the campaign. If the cancellation time is before the start time of the campaign, the delete the campaign from the system. If the cancellation time of the campaign is after the start time of the campaign, then mark the status as DELETED and return.

                    final DateTime campaignCancellationTime = Utils.getDateTimeFromString(TIME_STAMP_FORMAT,  campaignTemplate.getCancellationTime());
                    final DateTime campaignStartTime = getCampaignStartTime(campaignTemplate);

                    if(campaignCancellationTime.isBefore(campaignStartTime)) {
                        campaignTemplateService.delete(campaignTemplate.getId());
                        return ResponseEntity.ok().headers(HeaderUtil.createAlert(campaignTemplate.getCampaignName() +" successfully deleted", campaignTemplate.getId())).build();
                    } else {
                        //If a recurring campaign is cancelled before the recurrence end date, then the status should change to COMPLETE after cancellation of the pending campaigns in the recurrence and should disable the delete button.
                        campaignTemplate.setStatus(Constants.CampaignTemplateStatus.COMPLETED.toString());
                        campaignTemplate.setLaunchEnabled(false);
                        campaignTemplate.setEditEnabled(false);
                        campaignTemplate.setCancelEnabled(false);
                        campaignTemplate.setDeleteEnabled(false);
                        campaignTemplateService.save(campaignTemplate);
                        return ResponseEntity.ok().headers(HeaderUtil.createFailureAlert(ENTITY_NAME, null,"Cannot delete a campaign which has targeted players")).build();
                    }
//                    updateCampaignDeletionStatus(pushNotificationCampaignTemplate.getCampaignTemplateId(), true);
//                    return ResponseEntity.ok().headers(HeaderUtil.createAlert(campaignTemplate.getCampaignName() + " deleted", campaignTemplate.getId())).build();
                }
            } else {
                //Campaign is not launched at all. Can be deleted directly
                campaignTemplateService.delete(campaignTemplate.getId());
                return ResponseEntity.ok().headers(HeaderUtil.createAlert(campaignTemplate.getCampaignName() +" successfully deleted", campaignTemplate.getId())).build();
            }
        } else {
            return ResponseEntity.ok().headers(HeaderUtil.createFailureAlert(ENTITY_NAME, null,"Invalid campaign")).build();
        }
*/
    }

    private static DateTime getDateTimeFromString(DateTimeFormatter dateTimeFormatter, String scheduleTime) {
        return dateTimeFormatter.parseDateTime(scheduleTime);
    }

    private void updateCampaignDeletionStatus(String campaignTemplateId, boolean deleteSuccessful){
        Criteria criteria = Criteria.where("_id").is(campaignTemplateId);
        final Query query = new Query();
        query.addCriteria(criteria);
        final Update update = new Update();
        update.set("alreadyDeleted", deleteSuccessful);

        if(deleteSuccessful) {
            update.set("deletionTime", getCurrentDateTimeInUTCAsString());
        }
        mongoTemplate.upsert(query, update, CampaignTemplate.class);
    }

    private void updateCampaignCancellationStatus(String campaignTemplateId, boolean cancelSuccessful){
        Criteria criteria = Criteria.where("_id").is(campaignTemplateId);
        final Query query = new Query();
        query.addCriteria(criteria);
        final Update update = new Update();
        update.set("alreadyCancelled", cancelSuccessful);

        if(cancelSuccessful) {
            update.set("cancellationTime", getCurrentDateTimeInUTCAsString());
        }
        mongoTemplate.upsert(query, update, CampaignTemplate.class);
    }

    private void updateCampaignTemplateLaunchSuccessful(String campaignTemplateId, boolean launchSuccessful){
        Criteria criteria = Criteria.where("_id").is(campaignTemplateId);
        final Query query = new Query();
        query.addCriteria(criteria);
        final Update update = new Update();
        update.set("alreadyLaunched", launchSuccessful);

        if(launchSuccessful) {
            update.set("launchTime", getCurrentDateTimeInUTCAsString());
        }
        mongoTemplate.upsert(query, update, CampaignTemplate.class);
    }
}
