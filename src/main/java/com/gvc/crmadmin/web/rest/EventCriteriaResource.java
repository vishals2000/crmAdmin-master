package com.gvc.crmadmin.web.rest;

import com.codahale.metrics.annotation.Timed;
import com.gvc.crmadmin.domain.EventCriteria;
import com.gvc.crmadmin.domain.enumeration.Product;
import com.gvc.crmadmin.service.EventCriteriaService;
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
 * REST controller for managing EventCriteria.
 */
@RestController
@RequestMapping("/api")
public class EventCriteriaResource {

    private final Logger log = LoggerFactory.getLogger(EventCriteriaResource.class);

    private static final String ENTITY_NAME = "eventCriteria";

    private final EventCriteriaService eventCriteriaService;

    public EventCriteriaResource(EventCriteriaService eventCriteriaService) {
        this.eventCriteriaService = eventCriteriaService;
    }

    /**
     * POST  /event-criteria : Create a new eventCriteria.
     *
     * @param eventCriteria the eventCriteria to create
     * @return the ResponseEntity with status 201 (Created) and with body the new eventCriteria, or with status 400 (Bad Request) if the eventCriteria has already an ID
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PostMapping("/event-criteria")
    @Timed
    public ResponseEntity<EventCriteria> createEventCriteria(@Valid @RequestBody EventCriteria eventCriteria) throws URISyntaxException, UnsupportedEncodingException {
        log.debug("REST request to save EventCriteria : {}", eventCriteria);
        if (eventCriteria.getId() != null) {
            return ResponseEntity.badRequest().headers(HeaderUtil.createFailureAlert(ENTITY_NAME, "idexists", "A new eventCriteria cannot already have an ID")).body(null);
        }
        EventCriteria result = eventCriteriaService.save(eventCriteria);
        return ResponseEntity.created(new URI(URLEncoder.encode("/api/event-criteria/" + result.getId(), "UTF-8")))
            .headers(HeaderUtil.createEntityCreationAlert(ENTITY_NAME, result.getId()))
            .body(result);
    }

    /**
     * PUT  /event-criteria : Updates an existing eventCriteria.
     *
     * @param eventCriteria the eventCriteria to update
     * @return the ResponseEntity with status 200 (OK) and with body the updated eventCriteria,
     * or with status 400 (Bad Request) if the eventCriteria is not valid,
     * or with status 500 (Internal Server Error) if the eventCriteria couldn't be updated
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PutMapping("/event-criteria")
    @Timed
    public ResponseEntity<EventCriteria> updateEventCriteria(@Valid @RequestBody EventCriteria eventCriteria) throws URISyntaxException, UnsupportedEncodingException {
        log.debug("REST request to update EventCriteria : {}", eventCriteria);
        if (eventCriteria.getId() == null) {
            return createEventCriteria(eventCriteria);
        }
        EventCriteria result = eventCriteriaService.save(eventCriteria);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(ENTITY_NAME, eventCriteria.getId().toString()))
            .body(result);
    }

    /**
     * GET  /event-criteria : get all the eventCriteria.
     *
     * @param pageable the pagination information
     * @return the ResponseEntity with status 200 (OK) and the list of eventCriteria in body
     */
    @GetMapping("/event-criteria")
    @Timed
    public ResponseEntity<List<EventCriteria>> getAllEventCriteria(@ApiParam Pageable pageable) {
        log.debug("REST request to get a page of EventCriteria");
        Page<EventCriteria> page = eventCriteriaService.findAll(pageable);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(page, "/api/event-criteria");
        return new ResponseEntity<>(page.getContent(), headers, HttpStatus.OK);
    }

    /**
     * GET  /event-criteria/:id : get the "id" eventCriteria.
     *
     * @param id the id of the eventCriteria to retrieve
     * @return the ResponseEntity with status 200 (OK) and with body the eventCriteria, or with status 404 (Not Found)
     */
    @GetMapping("/event-criteria/{id}")
    @Timed
    public ResponseEntity<EventCriteria> getEventCriteria(@PathVariable String id) {
        log.debug("REST request to get EventCriteria : {}", id);
        EventCriteria eventCriteria = eventCriteriaService.findOne(id);
        return ResponseUtil.wrapOrNotFound(Optional.ofNullable(eventCriteria));
    }

    /**
     * DELETE  /event-criteria/:id : delete the "id" eventCriteria.
     *
     * @param id the id of the eventCriteria to delete
     * @return the ResponseEntity with status 200 (OK)
     */
    @DeleteMapping("/event-criteria/{id}")
    @Timed
    public ResponseEntity<Void> deleteEventCriteria(@PathVariable String id) {
        log.debug("REST request to delete EventCriteria : {}", id);
        eventCriteriaService.delete(id);
        return ResponseEntity.ok().headers(HeaderUtil.createEntityDeletionAlert(ENTITY_NAME, id)).build();
    }

    @GetMapping("/event-criteria-distinctEventNames/{frontEnd}/{product}")
    @Timed
    public ResponseEntity<List<String>> getEventCriteriaNamesByFrontEndAndProduct(@PathVariable String frontEnd, @PathVariable Product product) {
        log.debug("REST request to get EventCriteria : {}" + frontEnd + " " + product);
        return ResponseUtil.wrapOrNotFound(Optional.ofNullable(eventCriteriaService.findDistinctByFrontEndAndProduct(frontEnd, product)));
    }
}
