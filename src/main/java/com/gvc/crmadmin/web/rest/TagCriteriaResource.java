package com.gvc.crmadmin.web.rest;

import com.codahale.metrics.annotation.Timed;
import com.gvc.crmadmin.domain.TagCriteria;
import com.gvc.crmadmin.domain.enumeration.Product;
import com.gvc.crmadmin.service.TagCriteriaService;
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
 * REST controller for managing TagCriteria.
 */
@RestController
@RequestMapping("/api")
public class TagCriteriaResource {

    private final Logger log = LoggerFactory.getLogger(TagCriteriaResource.class);

    private static final String ENTITY_NAME = "tagCriteria";

    private final TagCriteriaService tagCriteriaService;

    public TagCriteriaResource(TagCriteriaService tagCriteriaService) {
        this.tagCriteriaService = tagCriteriaService;
    }

    /**
     * POST  /tag-criteria : Create a new tagCriteria.
     *
     * @param tagCriteria the tagCriteria to create
     * @return the ResponseEntity with status 201 (Created) and with body the new tagCriteria, or with status 400 (Bad Request) if the tagCriteria has already an ID
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PostMapping("/tag-criteria")
    @Timed
    public ResponseEntity<TagCriteria> createTagCriteria(@Valid @RequestBody TagCriteria tagCriteria) throws URISyntaxException, UnsupportedEncodingException {
        log.debug("REST request to save TagCriteria : {}", tagCriteria);
        if (tagCriteria.getId() != null) {
            return ResponseEntity.badRequest().headers(HeaderUtil.createFailureAlert(ENTITY_NAME, "idexists", "A new tagCriteria cannot already have an ID")).body(null);
        }
        TagCriteria result = tagCriteriaService.save(tagCriteria);
        return ResponseEntity.created(new URI(URLEncoder.encode("/api/tag-criteria/" + result.getId(), "UTF-8")))
            .headers(HeaderUtil.createEntityCreationAlert(ENTITY_NAME, result.getId()))
            .body(result);
    }

    /**
     * PUT  /tag-criteria : Updates an existing tagCriteria.
     *
     * @param tagCriteria the tagCriteria to update
     * @return the ResponseEntity with status 200 (OK) and with body the updated tagCriteria,
     * or with status 400 (Bad Request) if the tagCriteria is not valid,
     * or with status 500 (Internal Server Error) if the tagCriteria couldn't be updated
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PutMapping("/tag-criteria")
    @Timed
    public ResponseEntity<TagCriteria> updateTagCriteria(@Valid @RequestBody TagCriteria tagCriteria) throws URISyntaxException, UnsupportedEncodingException {
        log.debug("REST request to update TagCriteria : {}", tagCriteria);
        if (tagCriteria.getId() == null) {
            return createTagCriteria(tagCriteria);
        }
        TagCriteria result = tagCriteriaService.save(tagCriteria);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(ENTITY_NAME, tagCriteria.getId().toString()))
            .body(result);
    }

    /**
     * GET  /tag-criteria : get all the tagCriteria.
     *
     * @param pageable the pagination information
     * @return the ResponseEntity with status 200 (OK) and the list of tagCriteria in body
     */
    @GetMapping("/tag-criteria")
    @Timed
    public ResponseEntity<List<TagCriteria>> getAllTagCriteria(@ApiParam Pageable pageable) {
        log.debug("REST request to get a page of TagCriteria");
        Page<TagCriteria> page = tagCriteriaService.findAll(pageable);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(page, "/api/tag-criteria");
        return new ResponseEntity<>(page.getContent(), headers, HttpStatus.OK);
    }

    /**
     * GET  /tag-criteria/:id : get the "id" tagCriteria.
     *
     * @param id the id of the tagCriteria to retrieve
     * @return the ResponseEntity with status 200 (OK) and with body the tagCriteria, or with status 404 (Not Found)
     */
    @GetMapping("/tag-criteria/{id}")
    @Timed
    public ResponseEntity<TagCriteria> getTagCriteria(@PathVariable String id) {
        log.debug("REST request to get TagCriteria : {}", id);
        TagCriteria tagCriteria = tagCriteriaService.findOne(id);
        return ResponseUtil.wrapOrNotFound(Optional.ofNullable(tagCriteria));
    }

    /**
     * DELETE  /tag-criteria/:id : delete the "id" tagCriteria.
     *
     * @param id the id of the tagCriteria to delete
     * @return the ResponseEntity with status 200 (OK)
     */
    @DeleteMapping("/tag-criteria/{id}")
    @Timed
    public ResponseEntity<Void> deleteTagCriteria(@PathVariable String id) {
        log.debug("REST request to delete TagCriteria : {}", id);
        tagCriteriaService.delete(id);
        return ResponseEntity.ok().headers(HeaderUtil.createEntityDeletionAlert(ENTITY_NAME, id)).build();
    }

    @GetMapping("/tag-criteria-distinctTagNames/{frontEnd}/{product}")
    @Timed
    public ResponseEntity<List<String>> getTagCriteriaNamesByFrontEndAndProduct(@PathVariable String frontEnd, @PathVariable Product product) {
        log.debug("REST request to get TagCriteria : {}" + frontEnd + " " + product);
        return ResponseUtil.wrapOrNotFound(Optional.ofNullable(tagCriteriaService.findDistinctByFrontEndAndProduct(frontEnd, product)));
    }
}
