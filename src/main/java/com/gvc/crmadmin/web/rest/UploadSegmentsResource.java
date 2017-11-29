package com.gvc.crmadmin.web.rest;

import com.codahale.metrics.annotation.Timed;
import com.gvc.crmadmin.domain.UploadSegments;
import com.gvc.crmadmin.service.UploadSegmentsService;
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
 * REST controller for managing UploadSegments.
 */
@RestController
@RequestMapping("/api")
public class UploadSegmentsResource {

    private final Logger log = LoggerFactory.getLogger(UploadSegmentsResource.class);

    private static final String ENTITY_NAME = "uploadSegments";

    private final UploadSegmentsService uploadSegmentsService;

    public UploadSegmentsResource(UploadSegmentsService uploadSegmentsService) {
        this.uploadSegmentsService = uploadSegmentsService;
    }

    @PostMapping("/upload-segment")
    public ResponseEntity<UploadSegments> handleFileUpload(@RequestParam("front_end") String frontEnd, @RequestParam("product") String product, 
    		@RequestParam("name") String name, @RequestParam("file") MultipartFile file) {

    	String id = product + "_" + frontEnd + "_" + name;
    	UploadSegments existingSegment = uploadSegmentsService.findOne(id);
    	if(existingSegment != null) {//already existing
    		return ResponseEntity.status(-1)
    				.headers(HeaderUtil.createEntityUpdateAlert(ENTITY_NAME, existingSegment.getId().toString()))
    				.body(existingSegment);
    	}
    	
    	UploadSegments uploadSegments = new UploadSegments();
    	uploadSegments.setId(id);

    	uploadSegments.setProduct(product);
    	uploadSegments.setFrontEnd(frontEnd);
    	uploadSegments.setName(name);
    	uploadSegments.setType("UPLOAD");
    	
        
    	UploadSegments result = uploadSegmentsService.save(uploadSegments);
    	boolean playersUploaded = uploadSegmentsService.store(id, file);

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
     * POST  /upload-segments : Create a new uploadSegments.
     *
     * @param uploadSegments the uploadSegments to create
     * @return the ResponseEntity with status 201 (Created) and with body the new uploadSegments, or with status 400 (Bad Request) if the uploadSegments has already an ID
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PostMapping("/upload-segments")
    @Timed
    public ResponseEntity<UploadSegments> createUploadSegments(@Valid @RequestBody UploadSegments uploadSegments) throws URISyntaxException {
        log.debug("REST request to save UploadSegments : {}", uploadSegments);
        if (uploadSegments.getId() != null) {
            return ResponseEntity.badRequest().headers(HeaderUtil.createFailureAlert(ENTITY_NAME, "idexists", "A new uploadSegments cannot already have an ID")).body(null);
        }
        UploadSegments result = uploadSegmentsService.save(uploadSegments);
        return ResponseEntity.created(new URI("/api/upload-segments/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * PUT  /upload-segments : Updates an existing uploadSegments.
     *
     * @param uploadSegments the uploadSegments to update
     * @return the ResponseEntity with status 200 (OK) and with body the updated uploadSegments,
     * or with status 400 (Bad Request) if the uploadSegments is not valid,
     * or with status 500 (Internal Server Error) if the uploadSegments couldn't be updated
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PutMapping("/upload-segments")
    @Timed
    public ResponseEntity<UploadSegments> updateUploadSegments(@Valid @RequestBody UploadSegments uploadSegments) throws URISyntaxException {
        log.debug("REST request to update UploadSegments : {}", uploadSegments);
        if (uploadSegments.getId() == null) {
            return createUploadSegments(uploadSegments);
        }
        UploadSegments result = uploadSegmentsService.save(uploadSegments);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(ENTITY_NAME, uploadSegments.getId().toString()))
            .body(result);
    }

    /**
     * GET  /upload-segments : get all the uploadSegments.
     *
     * @param pageable the pagination information
     * @return the ResponseEntity with status 200 (OK) and the list of uploadSegments in body
     */
    @GetMapping("/upload-segments")
    @Timed
    public ResponseEntity<List<UploadSegments>> getAllUploadSegments(@ApiParam Pageable pageable) {
        log.debug("REST request to get a page of UploadSegments");
        Page<UploadSegments> page = uploadSegmentsService.findAll(pageable);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(page, "/api/upload-segments");
        return new ResponseEntity<>(page.getContent(), headers, HttpStatus.OK);
    }

    /**
     * GET  /upload-segments/:id : get the "id" uploadSegments.
     *
     * @param id the id of the uploadSegments to retrieve
     * @return the ResponseEntity with status 200 (OK) and with body the uploadSegments, or with status 404 (Not Found)
     */
    @GetMapping("/upload-segments/{id}")
    @Timed
    public ResponseEntity<UploadSegments> getUploadSegments(@PathVariable String id) {
        log.debug("REST request to get UploadSegments : {}", id);
        UploadSegments uploadSegments = uploadSegmentsService.findOne(id);
        return ResponseUtil.wrapOrNotFound(Optional.ofNullable(uploadSegments));
    }

    /**
     * DELETE  /upload-segments/:id : delete the "id" uploadSegments.
     *
     * @param id the id of the uploadSegments to delete
     * @return the ResponseEntity with status 200 (OK)
     */
    @DeleteMapping("/upload-segments/{id}")
    @Timed
    public ResponseEntity<Void> deleteUploadSegments(@PathVariable String id) {
        log.debug("REST request to delete UploadSegments : {}", id);
        uploadSegmentsService.delete(id);
        return ResponseEntity.ok().headers(HeaderUtil.createEntityDeletionAlert(ENTITY_NAME, id)).build();
    }
}
