package com.gvc.crmadmin.web.rest;

import com.codahale.metrics.annotation.Timed;
import com.gvc.crmadmin.domain.AudienceSegments;
import com.gvc.crmadmin.domain.UploadSegments;
import com.gvc.crmadmin.service.AudienceSegmentsService;
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
import org.springframework.web.multipart.MultipartFile;

import javax.validation.Valid;
import java.net.URI;
import java.net.URISyntaxException;

import java.util.List;
import java.util.Optional;

/**
 * REST controller for managing AudienceSegments.
 */
@RestController
@RequestMapping("/api")
public class AudienceSegmentsResource {

    private final Logger log = LoggerFactory.getLogger(AudienceSegmentsResource.class);

    private static final String ENTITY_NAME = "audienceSegments";

    private final AudienceSegmentsService audienceSegmentsService;

    public AudienceSegmentsResource(AudienceSegmentsService audienceSegmentsService) {
        this.audienceSegmentsService = audienceSegmentsService;
    }

    @PostMapping("/upload-segment")
    public ResponseEntity<AudienceSegments> handleFileUpload(@RequestParam("front_end") String frontEnd, @RequestParam("product") String product, 
    		@RequestParam("name") String name, @RequestParam("file") MultipartFile file) {

    	String id = product + "_" + frontEnd + "_" + name;
    	AudienceSegments existingSegment = audienceSegmentsService.findOne(id);
    	if(existingSegment != null) {//already existing
    		return ResponseEntity.status(-1)
    				.headers(HeaderUtil.createEntityUpdateAlert(ENTITY_NAME, existingSegment.getId().toString()))
    				.body(existingSegment);
    	}
    	
    	AudienceSegments segments = new AudienceSegments();
    	segments.setId(id);

    	segments.setProduct(product);
    	segments.setFrontEnd(frontEnd);
    	segments.setName(name);
    	segments.setType("MANUAL_UPLOAD");
    	
        
    	AudienceSegments result = audienceSegmentsService.save(segments);
    	boolean playersUploaded = audienceSegmentsService.store(id, file);

    	if(playersUploaded) {
    		return ResponseEntity.ok()
    				.headers(HeaderUtil.createEntityUpdateAlert(ENTITY_NAME, result.getId().toString()))
    				.body(result);
    	}else {
    		return ResponseEntity.status(-2)
    				.headers(HeaderUtil.createEntityUpdateAlert(ENTITY_NAME, result.getId().toString()))
    				.body(result);
    	}
/*    	return ResponseEntity.ok()
				.headers(HeaderUtil.createEntityUpdateAlert(ENTITY_NAME, result.getId().toString()))
				.body(result);*/
    }
    
    /**
     * POST  /audience-segments : Create a new audienceSegments.
     *
     * @param audienceSegments the audienceSegments to create
     * @return the ResponseEntity with status 201 (Created) and with body the new audienceSegments, or with status 400 (Bad Request) if the audienceSegments has already an ID
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PostMapping("/audience-segments")
    @Timed
    public ResponseEntity<AudienceSegments> createAudienceSegments(@Valid @RequestBody AudienceSegments audienceSegments) throws URISyntaxException {
        log.debug("REST request to save AudienceSegments : {}", audienceSegments);
        if (audienceSegments.getId() != null) {
            return ResponseEntity.badRequest().headers(HeaderUtil.createFailureAlert(ENTITY_NAME, "idexists", "A new audienceSegments cannot already have an ID")).body(null);
        }
        AudienceSegments result = audienceSegmentsService.save(audienceSegments);
        return ResponseEntity.created(new URI("/api/audience-segments/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * PUT  /audience-segments : Updates an existing audienceSegments.
     *
     * @param audienceSegments the audienceSegments to update
     * @return the ResponseEntity with status 200 (OK) and with body the updated audienceSegments,
     * or with status 400 (Bad Request) if the audienceSegments is not valid,
     * or with status 500 (Internal Server Error) if the audienceSegments couldn't be updated
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PutMapping("/audience-segments")
    @Timed
    public ResponseEntity<AudienceSegments> updateAudienceSegments(@Valid @RequestBody AudienceSegments audienceSegments) throws URISyntaxException {
        log.debug("REST request to update AudienceSegments : {}", audienceSegments);
        if (audienceSegments.getId() == null) {
            return createAudienceSegments(audienceSegments);
        }
        AudienceSegments result = audienceSegmentsService.save(audienceSegments);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(ENTITY_NAME, audienceSegments.getId().toString()))
            .body(result);
    }

    /**
     * GET  /audience-segments : get all the audienceSegments.
     *
     * @param pageable the pagination information
     * @return the ResponseEntity with status 200 (OK) and the list of audienceSegments in body
     */
    @GetMapping("/audience-segments")
    @Timed
    public ResponseEntity<List<AudienceSegments>> getAllAudienceSegments(@ApiParam Pageable pageable) {
        log.debug("REST request to get a page of AudienceSegments");
        Page<AudienceSegments> page = audienceSegmentsService.findAll(pageable);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(page, "/api/audience-segments");
        return new ResponseEntity<>(page.getContent(), headers, HttpStatus.OK);
    }

    /**
     * GET  /audience-segments/:id : get the "id" audienceSegments.
     *
     * @param id the id of the audienceSegments to retrieve
     * @return the ResponseEntity with status 200 (OK) and with body the audienceSegments, or with status 404 (Not Found)
     */
    @GetMapping("/audience-segments/{id}")
    @Timed
    public ResponseEntity<AudienceSegments> getAudienceSegments(@PathVariable String id) {
        log.debug("REST request to get AudienceSegments : {}", id);
        AudienceSegments audienceSegments = audienceSegmentsService.findOne(id);
        return ResponseUtil.wrapOrNotFound(Optional.ofNullable(audienceSegments));
    }

    /**
     * DELETE  /audience-segments/:id : delete the "id" audienceSegments.
     *
     * @param id the id of the audienceSegments to delete
     * @return the ResponseEntity with status 200 (OK)
     */
    @DeleteMapping("/audience-segments/{id}")
    @Timed
    public ResponseEntity<Void> deleteAudienceSegments(@PathVariable String id) {
        log.debug("REST request to delete AudienceSegments : {}", id);
        audienceSegmentsService.delete(id);
        return ResponseEntity.ok().headers(HeaderUtil.createEntityDeletionAlert(ENTITY_NAME, id)).build();
    }
}
