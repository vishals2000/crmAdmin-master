package com.gvc.crmadmin.web.rest;

import com.codahale.metrics.annotation.Timed;
import com.gvc.crmadmin.domain.AudienceSegmentUploadRequest;
import com.gvc.crmadmin.domain.AudienceSegments;
import com.gvc.crmadmin.domain.CampaignTemplatesRequest;
import com.gvc.crmadmin.domain.DeleteSegment;
import com.gvc.crmadmin.domain.campaignMgmtApi.*;
import com.gvc.crmadmin.service.AudienceSegmentsService;
import com.gvc.crmadmin.web.rest.util.HeaderUtil;
import com.gvc.crmadmin.web.rest.util.PaginationUtil;
import io.github.jhipster.web.util.ResponseUtil;
import io.swagger.annotations.ApiParam;
import org.joda.time.DateTime;
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
import java.io.IOException;
import java.io.UnsupportedEncodingException;
import java.net.URI;
import java.net.URISyntaxException;
import java.net.URLEncoder;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import static com.gvc.crmadmin.config.Constants.CAMPAIGN_SCHEDULE_TIME_FORMAT;
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

    @PostMapping("/audience-segments/upload-segment")
    public ResponseEntity<AudienceSegmentUploadResponse> handleFileUpload(@Valid @RequestBody AudienceSegmentUploadRequest audienceSegmentUploadRequest) throws URISyntaxException, UnsupportedEncodingException {

    	System.out.println("" + audienceSegmentUploadRequest);

    	AudienceSegmentUploadResponse response = new AudienceSegmentUploadResponse();

    	String id = getSegmentId(audienceSegmentUploadRequest.getProduct(), audienceSegmentUploadRequest.getFrontEnd(), audienceSegmentUploadRequest.getName());
    	AudienceSegments existingSegment = audienceSegmentsService.findOne(id);

    	if(existingSegment != null) {//already existing
    		return ResponseEntity.badRequest()
                    .headers(HeaderUtil.createFailureAlert(ENTITY_NAME, existingSegment.getId(), "Segment with the given name exists"))
                    .body(response);

    		/*response.setCode(-1);
    		response.setMessage("Name already existing for product and fe combination");
    		return ResponseUtil.wrapOrNotFound(Optional.of(response));*/
    	}

    	AudienceSegments segments = new AudienceSegments();
    	segments.setId(id);

    	segments.setProduct(audienceSegmentUploadRequest.getProduct());
    	segments.setFrontEnd(audienceSegmentUploadRequest.getFrontEnd());
    	segments.setName(audienceSegmentUploadRequest.getName());
    	segments.setType("MANUAL_UPLOAD");
    	segments.setCreatedAt(CAMPAIGN_SCHEDULE_TIME_FORMAT.print(new DateTime()));

    	AudienceSegments result = audienceSegmentsService.save(segments);

    	StoreFileResponse storeFileResponse = audienceSegmentsService.store(id, audienceSegmentUploadRequest.getFile());

    	if(storeFileResponse.isResult()) {
    		return ResponseEntity.created(new URI(URLEncoder.encode("/api/audience-segments/upload-segment/" + id, "UTF-8")))
    	            .headers(HeaderUtil.createEntityCreationAlert(ENTITY_NAME, id))
    	            .body(response);
//    		return ResponseEntity.ok().headers(HeaderUtil.createEntityDeletionAlert(ENTITY_NAME, id)).build();
    	}else {
    		audienceSegmentsService.delete(id);

    		response.setCode(-2);
    		response.setMessage(storeFileResponse.getMessage());
    		return ResponseEntity.badRequest()
                    .headers(HeaderUtil.createFailureAlert(ENTITY_NAME, audienceSegmentUploadRequest.getName(), storeFileResponse.getMessage()))
                    .body(response);
    	}
    }

    private String getSegmentId(String product, String frontEnd, String name) {
    	return product + "_" + frontEnd + "_" + name.trim().toLowerCase();
    }

    @PostMapping("/audience-segments/edit-segment")
    public ResponseEntity<AudienceSegmentUploadResponse> editFileUpload(@RequestParam("id") String id, @RequestParam("file") MultipartFile file, @RequestParam("editType") String editType) throws URISyntaxException, UnsupportedEncodingException, IOException {

    	System.out.println("id = " + id + " editType = " + editType);

    	AudienceSegmentUploadResponse response = new AudienceSegmentUploadResponse();

    	AudienceSegments existingSegment = audienceSegmentsService.findOne(id);

    	if(existingSegment == null) {//doesn't exist
    		return ResponseEntity.badRequest()
                    .headers(HeaderUtil.createFailureAlert(ENTITY_NAME, id, "Segment with the given name does not exists"))
                    .body(response);
    	}

    	existingSegment.setModifiedAt(CAMPAIGN_SCHEDULE_TIME_FORMAT.print(new DateTime()));

    	AudienceSegments result = audienceSegmentsService.save(existingSegment);

    	int existingEstimate = existingSegment.getEstimate() != null ? Integer.parseInt(existingSegment.getEstimate()) : 0;

    	StoreFileResponse storeFileResponse = null;
    	if("APPEND".equalsIgnoreCase(editType)) {
    		storeFileResponse = audienceSegmentsService.store(id, file);
    	}else if("OVERWRITE".equalsIgnoreCase(editType)) {
    		audienceSegmentsService.deletePlayersBySegmentName(id);
    		storeFileResponse = audienceSegmentsService.store(id, file);

    	}

    	if(storeFileResponse != null && storeFileResponse.isResult()) {
    		return ResponseEntity.created(new URI(URLEncoder.encode("/api/audience-segments/edit-segment/" + id, "UTF-8")))
    	            .headers(HeaderUtil.createEntityCreationAlert(ENTITY_NAME, id))
    	            .body(response);
//    		return ResponseEntity.ok().headers(HeaderUtil.createEntityDeletionAlert(ENTITY_NAME, id)).build();
    	}else {
    		audienceSegmentsService.delete(id);

    		response.setCode(-2);
    		response.setMessage(storeFileResponse.getMessage());
    		return ResponseEntity.badRequest()
                    .headers(HeaderUtil.createFailureAlert(ENTITY_NAME, id, storeFileResponse.getMessage()))
                    .body(response);
    	}
    }

    @PostMapping("/audience-segments/getSegmentSize")
    @Timed
    public ResponseEntity<AudienceSegmentSizeResponse> getSegmentSize(@Valid @RequestBody AudienceSegmentSizeRequest segmentSizeRequest) throws URISyntaxException, UnsupportedEncodingException {
        log.debug("REST request to get getSegmentSize", segmentSizeRequest);

        AudienceSegmentSizeResponse response = new AudienceSegmentSizeResponse();
        response.setSegmentSize(audienceSegmentsService.getEstimate(segmentSizeRequest.getId()));

        System.out.println(response);
        return ResponseUtil.wrapOrNotFound(Optional.of(response));
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
     * GET  /audience-segments : get audienceSegments.
     *
     * @param pageable the pagination information
     * @return the ResponseEntity with status 200 (OK) and the list of audienceSegments in body
     */
    @PostMapping("/audience-segments/loadbyFeProduct")
    @Timed
    public ResponseEntity<List<AudienceSegments>> getAudienceSegments(@ApiParam Pageable pageable, @Valid @RequestBody AudienceSegmentsRequest request) {
        log.debug("REST request to get a page of AudienceSegments for frontEnd = " + request.getFrontEnd() + " and product = " + request.getProduct());
        Page<AudienceSegments> page = audienceSegmentsService.findByFrontEndAndProduct(request.getFrontEnd(), request.getProduct(), pageable);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(page, "/api/audience-segments/loadbyFeProduct");
        return new ResponseEntity<>(page.getContent(), headers, HttpStatus.OK);
    }

    /**
     * GET  /audience-segments : get audienceSegments.
     *
     * @param pageable the pagination information
     * @return the ResponseEntity with status 200 (OK) and the list of audienceSegments in body
     */

    @PostMapping("/audience-segments/loadbyFeProductForSegmentation")
    @Timed
    public ResponseEntity<AudienceSegmentsResponse> getAudienceSegmentsForSegmentation(@Valid @RequestBody AudienceSegmentsRequest request) {
        log.debug("REST request to get complete list of AudienceSegments for frontEnd = " + request.getFrontEnd() + " and product = " + request.getProduct());
        List<AudienceSegments> segments = audienceSegmentsService.findByFrontEndAndProduct(request.getFrontEnd(), request.getProduct());

        List<NameIdPair> nameIdPairs = new ArrayList<>();
        if(segments != null) {
        	for (AudienceSegments segment : segments) {
        		NameIdPair nameIdPair = new NameIdPair();
        		nameIdPair.setId(segment.getId());
        		nameIdPair.setName(segment.getName());

        		nameIdPairs.add(nameIdPair);
			}
        }
        AudienceSegmentsResponse response = new AudienceSegmentsResponse();
        response.setNameIdPairs(nameIdPairs);

        return ResponseUtil.wrapOrNotFound(Optional.of(response));
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
        audienceSegmentsService.deletePlayersBySegmentName(id);

        return ResponseEntity.ok().headers(HeaderUtil.createEntityDeletionAlert(ENTITY_NAME, id)).build();
    }

    @PostMapping("/audience-segments/delete")
    @Timed
    public ResponseEntity<Void> deleteAudienceSegments(@Valid @RequestBody DeleteSegment deleteSegment) {
        log.debug("REST request to delete CampaignGroup : {}", deleteSegment);
        AudienceSegments campaignGroupFromDB = audienceSegmentsService.findOne(deleteSegment.getSegId());
        if(campaignGroupFromDB == null){
            return ResponseEntity.ok().headers(HeaderUtil.createEntityDeletionAlert(ENTITY_NAME, deleteSegment.getSegId())).build();
        } else{
            audienceSegmentsService.delete(deleteSegment.getSegId());
            audienceSegmentsService.deletePlayersBySegmentName(deleteSegment.getSegId());
            return ResponseEntity.ok().headers(HeaderUtil.createEntityDeletionAlert(ENTITY_NAME, deleteSegment.getSegId())).build();
        }
    }
}
