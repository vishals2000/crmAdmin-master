package com.gvc.crmadmin.web.rest;

import com.codahale.metrics.annotation.Timed;
import com.gvc.crmadmin.domain.FilterCriteria;
import com.gvc.crmadmin.domain.enumeration.Product;
import com.gvc.crmadmin.service.FilterCriteriaService;
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
import java.util.Map;
import java.util.Optional;

/**
 * REST controller for managing FilterCriteria.
 */
@RestController
@RequestMapping("/api")
public class FilterCriteriaResource {

    private final Logger log = LoggerFactory.getLogger(FilterCriteriaResource.class);

    private static final String ENTITY_NAME = "filterCriteria";

    private final FilterCriteriaService filterCriteriaService;

    public FilterCriteriaResource(FilterCriteriaService filterCriteriaService) {
        this.filterCriteriaService = filterCriteriaService;
    }

    /**
     * POST  /filter-criteria : Create a new filterCriteria.
     *
     * @param filterCriteria the filterCriteria to create
     * @return the ResponseEntity with status 201 (Created) and with body the new filterCriteria, or with status 400 (Bad Request) if the filterCriteria has already an ID
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PostMapping("/filter-criteria")
    @Timed
    public ResponseEntity<FilterCriteria> createFilterCriteria(@Valid @RequestBody FilterCriteria filterCriteria) throws URISyntaxException, UnsupportedEncodingException {
        log.debug("REST request to save FilterCriteria : {}", filterCriteria);
        if (filterCriteria.getId() != null) {
            return ResponseEntity.badRequest().headers(HeaderUtil.createFailureAlert(ENTITY_NAME, "idexists", "A new filterCriteria cannot already have an ID")).body(null);
        }
        FilterCriteria result = filterCriteriaService.save(filterCriteria);
        return ResponseEntity.created(new URI(URLEncoder.encode("/api/filter-criteria/" + result.getId(), "UTF-8")))
            .headers(HeaderUtil.createEntityCreationAlert(ENTITY_NAME, result.getId()))
            .body(result);
    }

    /**
     * PUT  /filter-criteria : Updates an existing filterCriteria.
     *
     * @param filterCriteria the filterCriteria to update
     * @return the ResponseEntity with status 200 (OK) and with body the updated filterCriteria,
     * or with status 400 (Bad Request) if the filterCriteria is not valid,
     * or with status 500 (Internal Server Error) if the filterCriteria couldn't be updated
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PutMapping("/filter-criteria")
    @Timed
    public ResponseEntity<FilterCriteria> updateFilterCriteria(@Valid @RequestBody FilterCriteria filterCriteria) throws URISyntaxException, UnsupportedEncodingException {
        log.debug("REST request to update FilterCriteria : {}", filterCriteria);
        if (filterCriteria.getId() == null) {
            return createFilterCriteria(filterCriteria);
        }
        FilterCriteria result = filterCriteriaService.save(filterCriteria);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(ENTITY_NAME, filterCriteria.getId().toString()))
            .body(result);
    }

    /**
     * GET  /filter-criteria : get all the filterCriteria.
     *
     * @param pageable the pagination information
     * @return the ResponseEntity with status 200 (OK) and the list of filterCriteria in body
     */
    @GetMapping("/filter-criteria")
    @Timed
    public ResponseEntity<List<FilterCriteria>> getAllFilterCriteria(@ApiParam Pageable pageable) {
        log.debug("REST request to get a page of FilterCriteria");
        Page<FilterCriteria> page = filterCriteriaService.findAll(pageable);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(page, "/api/filter-criteria");
        return new ResponseEntity<>(page.getContent(), headers, HttpStatus.OK);
    }

    /**
     * GET  /filter-criteria/:id : get the "id" filterCriteria.
     *
     * @param id the id of the filterCriteria to retrieve
     * @return the ResponseEntity with status 200 (OK) and with body the filterCriteria, or with status 404 (Not Found)
     */
    @GetMapping("/filter-criteria/{id}")
    @Timed
    public ResponseEntity<FilterCriteria> getFilterCriteria(@PathVariable String id) {
        log.debug("REST request to get FilterCriteria : {}", id);
        FilterCriteria filterCriteria = filterCriteriaService.findOne(id);
        return ResponseUtil.wrapOrNotFound(Optional.ofNullable(filterCriteria));
    }

    /**
     * DELETE  /filter-criteria/:id : delete the "id" filterCriteria.
     *
     * @param id the id of the filterCriteria to delete
     * @return the ResponseEntity with status 200 (OK)
     */
    @DeleteMapping("/filter-criteria/{id}")
    @Timed
    public ResponseEntity<Void> deleteFilterCriteria(@PathVariable String id) {
        log.debug("REST request to delete FilterCriteria : {}", id);
        filterCriteriaService.delete(id);
        return ResponseEntity.ok().headers(HeaderUtil.createEntityDeletionAlert(ENTITY_NAME, id)).build();
    }

    @GetMapping("/filter-criteria-frontend-product/{frontEnd}/{product}")
    @Timed
    public ResponseEntity<Map<String, Map<String, String[]>>> getFilterCriteriaByFrontEndAndProduct(@PathVariable String frontEnd, @PathVariable Product product) {
        log.debug("REST request to get FilterCriteria : {}" + frontEnd + " " + product);
        return ResponseUtil.wrapOrNotFound(Optional.ofNullable(filterCriteriaService.findDistinctByFrontEndAndProduct(frontEnd, product)));
    }
}
