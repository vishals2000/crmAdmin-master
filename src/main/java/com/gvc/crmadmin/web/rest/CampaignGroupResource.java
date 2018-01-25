package com.gvc.crmadmin.web.rest;

import com.codahale.metrics.annotation.Timed;
import com.gvc.crmadmin.domain.*;
import com.gvc.crmadmin.service.AppsService;
import com.gvc.crmadmin.service.CampaignGroupService;
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
import java.util.List;
import java.util.Optional;

/**
 * REST controller for managing CampaignGroup.
 */
@RestController
@RequestMapping("/api")
public class CampaignGroupResource {

    private final Logger log = LoggerFactory.getLogger(CampaignGroupResource.class);

    private static final String ENTITY_NAME = "campaignGroup";

    @Autowired
    private AppsService appsService;

    private final CampaignGroupService campaignGroupService;

    public CampaignGroupResource(CampaignGroupService campaignGroupService) {
        this.campaignGroupService = campaignGroupService;
    }

    /**
     * POST  /campaign-groups : Create a new campaignGroup.
     *
     * @param campaignGroup the campaignGroup to create
     * @return the ResponseEntity with status 201 (Created) and with body the new campaignGroup, or with status 400 (Bad Request) if the campaignGroup has already an ID
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PostMapping("/campaign-group")
    @Timed
    public ResponseEntity<CampaignGroup> createCampaignGroup(@Valid @RequestBody CampaignGroup campaignGroup) throws URISyntaxException, UnsupportedEncodingException {
        log.debug("REST request to save CampaignGroup : {}", campaignGroup);
        /*if (campaignGroup.getId() != null) {
            return ResponseEntity.badRequest().headers(HeaderUtil.createFailureAlert(ENTITY_NAME, "idexists", "A new campaignGroup cannot already have an ID")).body(null);
        }*/

        CampaignGroup result;
        CampaignGroup campaignGroupFromDB = campaignGroupService.findOne(campaignGroup.getId());
        if (campaignGroupFromDB == null) {
            result = campaignGroupService.save(campaignGroup);
        } else {
            return ResponseEntity.badRequest()
                .headers(HeaderUtil.createFailureAlert(ENTITY_NAME, campaignGroupFromDB.getId(), "Campaign Group with the given name exists"))
                .body(campaignGroupFromDB);
        }
        return ResponseEntity.created(new URI(URLEncoder.encode("/api/campaign-group/project/" + result.getProjectId(), "UTF-8")))
            .headers(HeaderUtil.createEntityCreationAlert(ENTITY_NAME, result.getId()))
            .body(result);
    }

    /**
     * PUT  /campaign-groups : Updates an existing campaignGroup.
     *
     * @param campaignGroup the campaignGroup to update
     * @return the ResponseEntity with status 200 (OK) and with body the updated campaignGroup,
     * or with status 400 (Bad Request) if the campaignGroup is not valid,
     * or with status 500 (Internal Server Error) if the campaignGroup couldn't be updated
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PutMapping("/campaign-group")
    @Timed
    public ResponseEntity<CampaignGroup> updateCampaignGroup(@Valid @RequestBody CampaignGroup campaignGroup) throws URISyntaxException, UnsupportedEncodingException {
        log.debug("REST request to update CampaignGroup : {}", campaignGroup);
        if (campaignGroup.getId() == null) {
            return createCampaignGroup(campaignGroup);
        }
        CampaignGroup result = campaignGroupService.save(campaignGroup);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(ENTITY_NAME, campaignGroup.getId().toString()))
            .body(result);
    }

    /**
     * GET  /campaign-groups : get all the campaignGroups.
     *
     * @param pageable the pagination information
     * @return the ResponseEntity with status 200 (OK) and the list of campaignGroups in body
     */
    @GetMapping("/campaign-group")
    @Timed
    public ResponseEntity<List<CampaignGroup>> getAllCampaignGroups(@ApiParam Pageable pageable) {
        log.debug("REST request to get a page of CampaignGroups");
        Page<CampaignGroup> page = campaignGroupService.findAll(pageable);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(page, "/api/campaign-group");
        return new ResponseEntity<>(page.getContent(), headers, HttpStatus.OK);
    }

    @PostMapping("/campaign-group/project")
    @Timed
    public ResponseEntity<List<CampaignGroup>> getAllCampaignGroups(@ApiParam Pageable pageable, @Valid @RequestBody CampaignGroupRequest campaignGroupRequest) {
        log.debug("REST request to get a page of CampaignGroups with projectId " + campaignGroupRequest);
        Page<CampaignGroup> page = campaignGroupService.findByProjectId(pageable, campaignGroupRequest.getAppId());
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(page, "/api/campaign-group");
        return new ResponseEntity<>(page.getContent(), headers, HttpStatus.OK);
    }

    /*
    @GetMapping("/campaign-group/project/{projectId}")
    @Timed
    public ResponseEntity<List<CampaignGroup>> getAllCampaignGroups(@ApiParam Pageable pageable, @PathVariable String projectId) {
        log.debug("REST request to get a page of CampaignGroups with projectId");
        Page<CampaignGroup> page = campaignGroupService.findByProjectId(pageable, projectId);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(page, "/api/campaign-group");
        return new ResponseEntity<>(page.getContent(), headers, HttpStatus.OK);
    }
    */

    @PostMapping("/campaign-group/project/allCampaignGroups/")
    @Timed
    public ResponseEntity<List<CampaignGroup>> getAllCampaignGroups(@Valid @RequestBody CampaignGroupRequest campaignGroupRequest) {
        log.debug("REST request to get all CampaignGroups with projectId " + campaignGroupRequest);
        List<CampaignGroup> campaignGroups = campaignGroupService.findByProjectId(campaignGroupRequest.getAppId());
        return new ResponseEntity<>(campaignGroups, HttpStatus.OK);
    }

    /*
    @GetMapping("/campaign-group/project/allCampaignGroups/{projectId}")
    @Timed
    public ResponseEntity<List<CampaignGroup>> getAllCampaignGroups(@PathVariable String projectId) {
        log.debug("REST request to get a page of CampaignGroups with projectId");
        List<CampaignGroup> campaignGroups = campaignGroupService.findByProjectId(projectId);
        return new ResponseEntity<>(campaignGroups, HttpStatus.OK);
    }
    */

    @GetMapping("/campaign-group/project/{projectId}/search/{campaignGroupName}")
    @Timed
    public ResponseEntity<List<CampaignGroup>> getAllCampaignGroupsbyProjectIdAndName(@ApiParam Pageable pageable, @PathVariable String projectId, @PathVariable String campaignGroupName) {
        log.debug("REST request to get a page of CampaignGroups with projectId : " + projectId + " campaignGroupName :  " + campaignGroupName);

        Page<CampaignGroup> page = campaignGroupService.findByProjectIdAndName(pageable, projectId, campaignGroupName);

        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(page, "/api/campaign-group/project/" + projectId + "/search/" + campaignGroupName);
        return new ResponseEntity<>(page.getContent(), headers, HttpStatus.OK);
    }

    @GetMapping("/campaign-group/feProduct/{campaignGroupId}")
    @Timed
    public ResponseEntity<FrontendProduct> getFeProduct(@PathVariable String campaignGroupId) {
        log.debug("REST request to get frontEnd and Product for campaign group " + campaignGroupId);
        CampaignGroup campaignGroup = campaignGroupService.findOne(campaignGroupId);

        FrontendProduct frontendProduct = new FrontendProduct("", "");
        if (campaignGroup != null) {
            Apps app = appsService.findOne(campaignGroup.getProjectId());
            if (app != null) {
                frontendProduct = new FrontendProduct(app.getFrontEnd(), app.getProduct().name());
            }
        }
        return ResponseUtil.wrapOrNotFound(Optional.of(frontendProduct));
    }

    /**
     * GET  /campaign-groups/:id : get the "id" campaignGroup.
     *
     * @param id the id of the campaignGroup to retrieve
     * @return the ResponseEntity with status 200 (OK) and with body the campaignGroup, or with status 404 (Not Found)
     */
    @GetMapping("/campaign-group/{id}")
    @Timed
    public ResponseEntity<CampaignGroup> getCampaignGroup(@PathVariable String id) {
        log.debug("REST request to get CampaignGroup : {}", id);
        CampaignGroup campaignGroup = campaignGroupService.findOne(id);
        return ResponseUtil.wrapOrNotFound(Optional.ofNullable(campaignGroup));
    }

    /**
     * DELETE  /campaign-groups/:id : delete the "id" campaignGroup.
     *
     * @param id the id of the campaignGroup to delete
     * @return the ResponseEntity with status 200 (OK)
     */
    @DeleteMapping("/campaign-group/{id}")
    @Timed
    public ResponseEntity<Void> deleteCampaignGroup(@PathVariable String id) {
        log.debug("REST request to delete CampaignGroup : {}", id);
        campaignGroupService.delete(id);
        return ResponseEntity.ok().headers(HeaderUtil.createEntityDeletionAlert(ENTITY_NAME, id)).build();
    }

    @PostMapping("/campaign-group/delete")
    @Timed
    public ResponseEntity<Void> deleteCampaignGroup(@Valid @RequestBody DeleteCampaignGroup deleteCampaignGroup) {
        log.debug("REST request to delete CampaignGroup : {}", deleteCampaignGroup);
        CampaignGroup campaignGroupFromDB = campaignGroupService.findOne(deleteCampaignGroup.getGroupId());
        if (campaignGroupFromDB == null) {
            return ResponseEntity.ok().headers(HeaderUtil.createEntityDeletionAlert(ENTITY_NAME, deleteCampaignGroup.getGroupId())).build();
        } else {
            campaignGroupService.delete(deleteCampaignGroup.getGroupId());
            return ResponseEntity.ok().headers(HeaderUtil.createEntityDeletionAlert(ENTITY_NAME, deleteCampaignGroup.getGroupId())).build();
        }
    }
}
