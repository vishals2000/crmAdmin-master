package com.gvc.crmadmin.web.rest;

import com.codahale.metrics.annotation.Timed;
import com.gvc.crmadmin.config.Constants;
import com.gvc.crmadmin.domain.*;
import com.gvc.crmadmin.domain.campaignMgmtApi.*;
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
import java.util.List;
import java.util.Optional;

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
        if (campaignTemplate.getId() == null) {
            return createCampaignTemplate(campaignTemplate);
        }
        CampaignTemplate result = campaignTemplateService.save(campaignTemplate);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(ENTITY_NAME, campaignTemplate.getId()))
            .body(result);
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

    @PostMapping("/campaign-templates/sendPushNotificationForScreenName")
    @Timed
    public ResponseEntity<PushNotificationForScreenNameResponse> sendPushNotificationForScreenName(@Valid @RequestBody SendPushNotificationForScreenNameRequest sendPushNotificationForScreenNameRequest) throws URISyntaxException, UnsupportedEncodingException {
        log.debug("REST request to get sendPushNotificationForScreenName", sendPushNotificationForScreenNameRequest);

        RestTemplate restTemplate = new RestTemplate();
        PushNotificationForScreenNameResponse pushNotificationForScreenNameResponse = restTemplate.postForObject(Constants.TEST_URL, sendPushNotificationForScreenNameRequest, PushNotificationForScreenNameResponse.class);

        System.out.println(pushNotificationForScreenNameResponse);
        return ResponseUtil.wrapOrNotFound(Optional.of(pushNotificationForScreenNameResponse));
    }

    @GetMapping("/campaign-templates/getOptimoveInstances")
    @Timed
    public ResponseEntity<OptimoveInstances> getOptimoveInstances() throws URISyntaxException, UnsupportedEncodingException {
        log.debug("REST request to getOptimoveInstances");

        RestTemplate restTemplate = new RestTemplate();
        List optimoveInstanceNames = restTemplate.getForObject(Constants.OPTIMOVE_INSTANCES_URL, List.class);

        OptimoveInstances optimoveInstances = new OptimoveInstances();
        optimoveInstances.setOptimoveInstanceNames(optimoveInstanceNames);
        System.out.println(optimoveInstances);
        return ResponseUtil.wrapOrNotFound(Optional.of(optimoveInstances));
    }

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
            }
        }

        RestTemplate restTemplate = new RestTemplate();
        PushNotificationCampaignProcessingResponse pushNotificationCampaignProcessingResponse = restTemplate.postForObject(Constants.LAUNCH_URL, pushNotificationCampaignTemplate, PushNotificationCampaignProcessingResponse.class);

        System.out.println(pushNotificationCampaignProcessingResponse);
        return ResponseUtil.wrapOrNotFound(Optional.of(pushNotificationCampaignProcessingResponse));
    }

    @PutMapping("/campaign-templates/updateLaunchStatus/{campaignTemplateId}/{launchSuccessful}")
    @Timed
    public ResponseEntity<CampaignLaunchUpdateStatus> updateCampaignTemplate(@PathVariable String campaignTemplateId, @PathVariable boolean launchSuccessful) throws URISyntaxException, UnsupportedEncodingException {
        log.debug("REST request to update CampaignTemplate : " + campaignTemplateId + " with status " + launchSuccessful);
        if (campaignTemplateId == null) {
            CampaignLaunchUpdateStatus campaignLaunchUpdateStatus = new CampaignLaunchUpdateStatus(false, "Empty campaign template Id");
            return ResponseUtil.wrapOrNotFound(Optional.of(campaignLaunchUpdateStatus));
        }
        CampaignTemplate campaignTemplate = campaignTemplateService.findOne(campaignTemplateId);
        if(campaignTemplate == null) {
            CampaignLaunchUpdateStatus campaignLaunchUpdateStatus = new CampaignLaunchUpdateStatus(false, "Invalid campaign template Id");
            return ResponseUtil.wrapOrNotFound(Optional.of(campaignLaunchUpdateStatus));
        }
        if(!campaignTemplate.isAlreadyLaunched()) {
            updateCampaignTemplateLaunchSuccessful(campaignTemplateId, launchSuccessful);
        }
        return ResponseUtil.wrapOrNotFound(Optional.of(new CampaignLaunchUpdateStatus(true, "Successfully updated status")));
    }

    private void updateCampaignTemplateLaunchSuccessful(String campaignTemplateId, boolean launchSuccessful){
        Criteria criteria = Criteria.where("_id").is(campaignTemplateId);
        final Query query = new Query();
        query.addCriteria(criteria);
        final Update update = new Update();
        update.set("alreadyLaunched", launchSuccessful);
        mongoTemplate.upsert(query, update, CampaignTemplate.class);
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

    @GetMapping("/campaign-templates/group/{campaignGroupId}")
    @Timed
    public ResponseEntity<List<CampaignTemplate>> getAllCampaignsForCampaignGroup(@ApiParam Pageable pageable, @PathVariable String campaignGroupId) {
        log.debug("REST request to get a page of CampaignGroups with projectId");
        Page<CampaignTemplate> page = campaignTemplateService.findByCampaignGroupId(pageable, campaignGroupId);
        final DateTime currentDateTime = new DateTime(DateTimeZone.UTC);
        for(final CampaignTemplate campaignTemplate : page.getContent()){
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

            if(currentDateTime.isBefore(startTime)) {
                // before the startTime of the campaign
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
                    campaignTemplate.setStatus(Constants.CampaignTemplateStatus.PENDING.getStatus()); // the campaign was launched
                    campaignTemplate.setLaunchEnabled(false);
                    campaignTemplate.setEditEnabled(false);
                    campaignTemplate.setCancelEnabled(true);
                    campaignTemplate.setDeleteEnabled(true);
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
                    campaignTemplate.setLaunchEnabled(false);
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
                    campaignTemplate.setDeleteEnabled(true);
                } else {
                    campaignTemplate.setStatus(Constants.CampaignTemplateStatus.DRAFT.getStatus()); // the campaign was not launched
                    campaignTemplate.setLaunchEnabled(false);
                    campaignTemplate.setEditEnabled(true);
                    campaignTemplate.setCancelEnabled(false);
                    campaignTemplate.setDeleteEnabled(true);
                }
            }

            if(saveCampaignTemplate(campaignTemplate, tempCampaignTemplate)) {
                campaignTemplateService.save(campaignTemplate);
            }
        }
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(page, "/api/campaign-group");
        return new ResponseEntity<>(page.getContent(), headers, HttpStatus.OK);
    }

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

    /**
     * DELETE  /campaign-templates/:id : delete the "id" campaignTemplate.
     *
     * @param id the id of the campaignTemplate to delete
     * @return the ResponseEntity with status 200 (OK)
     */
    @DeleteMapping("/campaign-templates/{id}")
    @Timed
    public ResponseEntity<Void> deleteCampaignTemplate(@PathVariable String id) {
        log.debug("REST request to delete CampaignTemplate : {}", id);
        campaignTemplateService.delete(id);
        return ResponseEntity.ok().headers(HeaderUtil.createEntityDeletionAlert(ENTITY_NAME, id)).build();
    }

    private static DateTime getDateTimeFromString(DateTimeFormatter dateTimeFormatter, String scheduleTime) {
        return dateTimeFormatter.parseDateTime(scheduleTime);
    }
}
