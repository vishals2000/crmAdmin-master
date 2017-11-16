package com.gvc.crmadmin.web.rest;

import com.codahale.metrics.annotation.Timed;
import com.gvc.crmadmin.config.Constants;
import com.gvc.crmadmin.domain.*;
import com.gvc.crmadmin.domain.campaignMgmtApi.PushNotificationCampaignTargetGroupSizeRequest;
import com.gvc.crmadmin.domain.campaignMgmtApi.PushNotificationCampaignTargetGroupSizeResponse;
import com.gvc.crmadmin.service.AppsService;
import com.gvc.crmadmin.service.CampaignGroupService;
import com.gvc.crmadmin.service.CampaignTemplateService;
import com.gvc.crmadmin.web.rest.util.HeaderUtil;
import com.gvc.crmadmin.web.rest.util.PaginationUtil;
import io.github.jhipster.web.util.ResponseUtil;
import io.swagger.annotations.ApiParam;
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
        for(CampaignTemplate campaignTemplate : page.getContent()){
            if(campaignTemplate.isLaunchEnabled()) {

            }
        }
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(page, "/api/campaign-group");
        return new ResponseEntity<>(page.getContent(), headers, HttpStatus.OK);
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
}
