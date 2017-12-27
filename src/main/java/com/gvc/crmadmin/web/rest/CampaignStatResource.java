package com.gvc.crmadmin.web.rest;

import com.codahale.metrics.annotation.Timed;
import com.gvc.crmadmin.domain.CampaignStat;
import com.gvc.crmadmin.service.CampaignStatService;
import com.gvc.crmadmin.web.rest.util.HeaderUtil;
import com.gvc.crmadmin.web.rest.util.PaginationUtil;
import io.swagger.annotations.ApiParam;
import io.github.jhipster.web.util.ResponseUtil;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.net.URISyntaxException;

import java.util.List;
import java.util.Optional;

/**
 * REST controller for managing CampaignStat.
 */
@RestController
@RequestMapping("/api")
public class CampaignStatResource {

    private final Logger log = LoggerFactory.getLogger(CampaignStatResource.class);

    private static final String ENTITY_NAME = "campaignStat";

    private final CampaignStatService campaignStatService;

    public CampaignStatResource(CampaignStatService campaignStatService) {
        this.campaignStatService = campaignStatService;
    }

    /**
     * POST  /campaign-stats : Create a new campaignStat.
     *
     * @param campaignStat the campaignStat to create
     * @return the ResponseEntity with status 201 (Created) and with body the new campaignStat, or with status 400 (Bad Request) if the campaignStat has already an ID
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PostMapping("/campaign-stats")
    @Timed
    public ResponseEntity<CampaignStat> createCampaignStat(@RequestBody CampaignStat campaignStat) throws URISyntaxException {
        log.debug("REST request to save CampaignStat : {}", campaignStat);
        if (campaignStat.getId() != null) {
            return ResponseEntity.badRequest().headers(HeaderUtil.createFailureAlert(ENTITY_NAME, "idexists", "A new campaignStat cannot already have an ID")).body(null);
        }
        CampaignStat result = campaignStatService.save(campaignStat);
        return ResponseEntity.created(new URI("/api/campaign-stats/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * PUT  /campaign-stats : Updates an existing campaignStat.
     *
     * @param campaignStat the campaignStat to update
     * @return the ResponseEntity with status 200 (OK) and with body the updated campaignStat,
     * or with status 400 (Bad Request) if the campaignStat is not valid,
     * or with status 500 (Internal Server Error) if the campaignStat couldn't be updated
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PutMapping("/campaign-stats")
    @Timed
    public ResponseEntity<CampaignStat> updateCampaignStat(@RequestBody CampaignStat campaignStat) throws URISyntaxException {
        log.debug("REST request to update CampaignStat : {}", campaignStat);
        if (campaignStat.getId() == null) {
            return createCampaignStat(campaignStat);
        }
        CampaignStat result = campaignStatService.save(campaignStat);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(ENTITY_NAME, campaignStat.getId().toString()))
            .body(result);
    }

    /**
     * GET  /campaign-stats : get all the campaignStats.
     *
     * @param pageable the pagination information
     * @return the ResponseEntity with status 200 (OK) and the list of campaignStats in body
     */
    @GetMapping("/campaign-stats")
    @Timed
    public ResponseEntity<List<CampaignStat>> getAllCampaignStats(@ApiParam Pageable pageable) {
        log.debug("REST request to get a page of CampaignStats");
        Page<CampaignStat> page = campaignStatService.findAll(pageable);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(page, "/api/campaign-stats");
        return new ResponseEntity<>(page.getContent(), headers, HttpStatus.OK);
    }

    /**
     * GET  /campaign-stats/:id : get the "id" campaignStat.
     *
     * @param id the id of the campaignStat to retrieve
     * @return the ResponseEntity with status 200 (OK) and with body the campaignStat, or with status 404 (Not Found)
     */
    @GetMapping("/campaign-stats/{id}")
    @Timed
    public ResponseEntity<CampaignStat> getCampaignStat(@PathVariable String id) {
        log.debug("REST request to get CampaignStat : {}", id);
        CampaignStat campaignStat = campaignStatService.findOne(id);
        return ResponseUtil.wrapOrNotFound(Optional.ofNullable(campaignStat));
    }

    /**
     * DELETE  /campaign-stats/:id : delete the "id" campaignStat.
     *
     * @param id the id of the campaignStat to delete
     * @return the ResponseEntity with status 200 (OK)
     */
    @DeleteMapping("/campaign-stats/{id}")
    @Timed
    public ResponseEntity<Void> deleteCampaignStat(@PathVariable String id) {
        log.debug("REST request to delete CampaignStat : {}", id);
        campaignStatService.delete(id);
        return ResponseEntity.ok().headers(HeaderUtil.createEntityDeletionAlert(ENTITY_NAME, id)).build();
    }
}
