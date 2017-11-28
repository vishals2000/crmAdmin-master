package com.gvc.crmadmin.service;

import com.gvc.crmadmin.domain.AudienceSegments;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

/**
 * Service Interface for managing AudienceSegments.
 */
public interface AudienceSegmentsService {

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
}
