package com.gvc.crmadmin.service;

import com.gvc.crmadmin.domain.AudienceSegments;
import com.gvc.crmadmin.domain.campaignMgmtApi.StoreFileResponse;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.web.multipart.MultipartFile;

/**
 * Service Interface for managing AudienceSegments.
 */
public interface AudienceSegmentsService {

	StoreFileResponse store(String id, MultipartFile file);
	
    /**
     * Save a audienceSegments.
     *
     * @param audienceSegments the entity to save
     * @return the persisted entity
     */
    AudienceSegments save(AudienceSegments audienceSegments);

    /**
     *  Get all the audienceSegments.
     *
     *  @param pageable the pagination information
     *  @return the list of entities
     */
    Page<AudienceSegments> findAll(Pageable pageable);
    
    Page<AudienceSegments> findByFrontEndAndProduct(String frontEnd, String product, Pageable pageable);
    
    List<AudienceSegments> findByFrontEndAndProduct(String frontEnd, String product);

    /**
     *  Get the "id" audienceSegments.
     *
     *  @param id the id of the entity
     *  @return the entity
     */
    AudienceSegments findOne(String id);

    /**
     *  Delete the "id" audienceSegments.
     *
     *  @param id the id of the entity
     */
    void delete(String id);
    
    void deletePlayersBySegmentName(String segmentName);
    
    long getSegmentSize(String segmentName);
}
