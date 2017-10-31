package com.gvc.crmadmin.web.rest;

import com.codahale.metrics.annotation.Timed;
import com.gvc.crmadmin.domain.TargetGroupCriteria;
import com.gvc.crmadmin.domain.enumeration.Product;
import com.gvc.crmadmin.service.TargetGroupCriteriaService;
import com.gvc.crmadmin.web.rest.util.HeaderUtil;
import com.gvc.crmadmin.web.rest.util.PaginationUtil;
import io.github.jhipster.web.util.ResponseUtil;
import io.swagger.annotations.ApiParam;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
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
 * REST controller for managing TargetGroupCriteria.
 */
@RestController
@RequestMapping("/api")
public class TargetGroupCriteriaResource {

    private final Logger log = LoggerFactory.getLogger(TargetGroupCriteriaResource.class);

    private static final String ENTITY_NAME = "targetGroupCriteria";

    private final TargetGroupCriteriaService targetGroupCriteriaService;

    public TargetGroupCriteriaResource(TargetGroupCriteriaService targetGroupCriteriaService) {
        this.targetGroupCriteriaService = targetGroupCriteriaService;
    }

    /**
     * POST  /target-group-criteria : Create a new targetGroupCriteria.
     *
     * @param targetGroupCriteria the targetGroupCriteria to create
     * @return the ResponseEntity with status 201 (Created) and with body the new targetGroupCriteria, or with status 400 (Bad Request) if the targetGroupCriteria has already an ID
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PostMapping("/target-group-criteria")
    @Timed
    public ResponseEntity<TargetGroupCriteria> createTargetGroupCriteria(@Valid @RequestBody TargetGroupCriteria targetGroupCriteria) throws URISyntaxException, UnsupportedEncodingException {
        log.debug("REST request to save TargetGroupCriteria : {}", targetGroupCriteria);
        /*if (targetGroupCriteria.getId() != null) {
            return ResponseEntity.badRequest().headers(HeaderUtil.createFailureAlert(ENTITY_NAME, "idexists", "A new targetGroupCriteria cannot already have an ID")).body(null);
        }*/
        TargetGroupCriteria result;
        TargetGroupCriteria targetGroupCriteriaFromDB = targetGroupCriteriaService.findOne(targetGroupCriteria.getId());
        if(targetGroupCriteriaFromDB == null){
            result = targetGroupCriteriaService.save(targetGroupCriteria);
        } else{
            return ResponseEntity.badRequest()
                .headers(HeaderUtil.createFailureAlert(ENTITY_NAME, targetGroupCriteriaFromDB.getId(), "TargetGroupCriteria with the given contentName exists"))
                .body(targetGroupCriteriaFromDB);
        }
        return ResponseEntity.created(new URI(URLEncoder.encode("/api/target-group-criteria/" + result.getId(), "UTF-8")))
            .headers(HeaderUtil.createEntityCreationAlert(ENTITY_NAME, result.getId()))
            .body(result);
    }

    /**
     * PUT  /target-group-criteria : Updates an existing targetGroupCriteria.
     *
     * @param targetGroupCriteria the targetGroupCriteria to update
     * @return the ResponseEntity with status 200 (OK) and with body the updated targetGroupCriteria,
     * or with status 400 (Bad Request) if the targetGroupCriteria is not valid,
     * or with status 500 (Internal Server Error) if the targetGroupCriteria couldn't be updated
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PutMapping("/target-group-criteria")
    @Timed
    public ResponseEntity<TargetGroupCriteria> updateTargetGroupCriteria(@Valid @RequestBody TargetGroupCriteria targetGroupCriteria) throws URISyntaxException, UnsupportedEncodingException {
        log.debug("REST request to update TargetGroupCriteria : {}", targetGroupCriteria);
        if (targetGroupCriteria.getId() == null) {
            return createTargetGroupCriteria(targetGroupCriteria);
        }
        TargetGroupCriteria result = targetGroupCriteriaService.save(targetGroupCriteria);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(ENTITY_NAME, targetGroupCriteria.getId().toString()))
            .body(result);
    }

    /**
     * GET  /target-group-criteria : get all the targetGroupCriteria.
     *
     * @param pageable the pagination information
     * @return the ResponseEntity with status 200 (OK) and the list of targetGroupCriteria in body
     */
    @GetMapping("/target-group-criteria")
    @Timed
    public ResponseEntity<List<TargetGroupCriteria>> getAllTargetGroupCriteria(@ApiParam Pageable pageable) {
        log.debug("REST request to get a page of TargetGroupCriteria");
        Page<TargetGroupCriteria> page = targetGroupCriteriaService.findAll(pageable);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(page, "/api/target-group-criteria");
        return new ResponseEntity<>(page.getContent(), headers, HttpStatus.OK);
    }

    /**
     * GET  /target-group-criteria/:id : get the "id" targetGroupCriteria.
     *
     * @param id the id of the targetGroupCriteria to retrieve
     * @return the ResponseEntity with status 200 (OK) and with body the targetGroupCriteria, or with status 404 (Not Found)
     */
    @GetMapping("/target-group-criteria/{id}")
    @Timed
    public ResponseEntity<TargetGroupCriteria> getTargetGroupCriteria(@PathVariable String id) {
        log.debug("REST request to get TargetGroupCriteria : {}", id);
        TargetGroupCriteria targetGroupCriteria = targetGroupCriteriaService.findOne(id);
        return ResponseUtil.wrapOrNotFound(Optional.ofNullable(targetGroupCriteria));
    }

    /**
     * DELETE  /target-group-criteria/:id : delete the "id" targetGroupCriteria.
     *
     * @param id the id of the targetGroupCriteria to delete
     * @return the ResponseEntity with status 200 (OK)
     */
    @DeleteMapping("/target-group-criteria/{id}")
    @Timed
    public ResponseEntity<Void> deleteTargetGroupCriteria(@PathVariable String id) {
        log.debug("REST request to delete TargetGroupCriteria : {}", id);
        targetGroupCriteriaService.delete(id);
        return ResponseEntity.ok().headers(HeaderUtil.createEntityDeletionAlert(ENTITY_NAME, id)).build();
    }

    @GetMapping("/target-group-criteria/{frontEnd}/{product}")
    @Timed
    public ResponseEntity<List<String>> getTargetGroupByFrontEndAndProduct(@PathVariable String frontEnd, @PathVariable Product product) {
        log.debug("REST request to get MessageContent : {}" + frontEnd + " " + product);
        return ResponseUtil.wrapOrNotFound(Optional.ofNullable(targetGroupCriteriaService.findByFrontEndAndProduct(frontEnd, product)));
    }
}
