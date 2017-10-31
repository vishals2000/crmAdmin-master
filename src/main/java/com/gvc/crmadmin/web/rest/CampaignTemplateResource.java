package com.gvc.crmadmin.web.rest;

import com.codahale.metrics.annotation.Timed;
import com.gvc.crmadmin.domain.CampaignTemplate;
import com.gvc.crmadmin.domain.MessageContent;
import com.gvc.crmadmin.domain.TargetGroupCriteria;
import com.gvc.crmadmin.domain.fcm.PushNotificationCampaignTemplate;
import com.gvc.crmadmin.domain.fcm.RecurrenceDetail;
import com.gvc.crmadmin.service.CampaignTemplateService;
import com.gvc.crmadmin.service.MessageContentService;
import com.gvc.crmadmin.service.TargetGroupCriteriaService;
import com.gvc.crmadmin.web.rest.util.HeaderUtil;
import com.gvc.crmadmin.web.rest.util.PaginationUtil;
import io.github.jhipster.web.util.ResponseUtil;
import io.swagger.annotations.ApiParam;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.io.UnsupportedEncodingException;
import java.net.URI;
import java.net.URISyntaxException;
import java.net.URLEncoder;
import java.util.ArrayList;
import java.util.Arrays;
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
    private TargetGroupCriteriaService targetGroupCriteriaService;

    @Autowired
    private MessageContentService messageContentService;

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
    public ResponseEntity<CampaignTemplate> createCampaignTemplate(@Valid @RequestBody CampaignTemplate campaignTemplate) throws URISyntaxException {
        log.debug("REST request to save CampaignTemplate : {}", campaignTemplate);
        /*if (campaignTemplate.getId() != null) {
            return ResponseEntity.badRequest().headers(HeaderUtil.createFailureAlert(ENTITY_NAME, "idexists", "A new campaignTemplate cannot already have an ID")).body(null);
        }*/
        CampaignTemplate result;
        CampaignTemplate campaignTemplateFromDB = campaignTemplateService.findOne(campaignTemplate.getId());
        if (campaignTemplateFromDB == null) {
            result = campaignTemplateService.save(campaignTemplate);
        } else{
            return ResponseEntity.badRequest()
                .headers(HeaderUtil.createFailureAlert(ENTITY_NAME, campaignTemplateFromDB.getId(), "Campaign Template with the given campaignName exists"))
                .body(campaignTemplateFromDB);
        }
        try {
            return ResponseEntity.created(new URI(URLEncoder.encode("/api/campaign-templates/" + result.getId(), "UTF-8")))
                .headers(HeaderUtil.createEntityCreationAlert(ENTITY_NAME, result.getId()))
                .body(result);
        } catch (UnsupportedEncodingException e) {
            e.printStackTrace();
            return null;
        }
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
    public ResponseEntity<CampaignTemplate> updateCampaignTemplate(@Valid @RequestBody CampaignTemplate campaignTemplate) throws URISyntaxException {
        log.debug("REST request to update CampaignTemplate : {}", campaignTemplate);
        if (campaignTemplate.getId() == null) {
            return createCampaignTemplate(campaignTemplate);
        }
        CampaignTemplate result = campaignTemplateService.save(campaignTemplate);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(ENTITY_NAME, campaignTemplate.getId().toString()))
            .body(result);
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

    @GetMapping("/campaign-templates-push-notification/{id}")
    @Timed
    public ResponseEntity<PushNotificationCampaignTemplate> getPushNotificationCampaign(@PathVariable String id) {
        log.debug("REST request to get CampaignTemplate : {}", id);
        CampaignTemplate campaignTemplate = campaignTemplateService.findOne(id);
        log.info(campaignTemplate.toString());
        TargetGroupCriteria targetGroupCriteria = targetGroupCriteriaService.findByFrontEndAndProductAndName(campaignTemplate.getFrontEnd(), campaignTemplate.getProduct(), campaignTemplate.getTargetGroupId());
        log.info(targetGroupCriteria.toString());
        List<String> campaignMessageContentIds = new ArrayList<>();
        campaignMessageContentIds.add(campaignTemplate.getMessageContentId());
        List<MessageContent> messageContentList = new ArrayList<>();
        //TODO: Change to list of IDs
        for(String messageContentId: campaignMessageContentIds){
            MessageContent messageContent = messageContentService.findByFrontEndAndProductAndName(campaignTemplate.getFrontEnd(), campaignTemplate.getProduct(), messageContentId);
            log.info(messageContent.toString());
            messageContentList.add(messageContent);
        }

        PushNotificationCampaignTemplate pushNotificationCampaignTemplate = new PushNotificationCampaignTemplate();
        pushNotificationCampaignTemplate
            .setFrontEnd(campaignTemplate.getFrontEnd())
            .setProduct(campaignTemplate.getProduct())
            .setCampaignName(campaignTemplate.getCampaignName())
            .setCampaignDescription(campaignTemplate.getCampaignDescription())
            .setTargetGroupFilterCriterionList(Arrays.asList(targetGroupCriteria.getTargetGroupFilterCriteria()))
            .setMessageContentList(messageContentList)
            .setRecurrenceDetail(new RecurrenceDetail(campaignTemplate.getStartDate().toString(), campaignTemplate.getRecurrenceEndDate().toString(), campaignTemplate.getRecurrenceType().name()))
            .setInPlayerTimezone(campaignTemplate.isInPlayerTimezone())
            .setScheduledTime(campaignTemplate.getScheduledTime() + ":00");

        return ResponseUtil.wrapOrNotFound(Optional.ofNullable(pushNotificationCampaignTemplate));
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
