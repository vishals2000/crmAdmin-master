package com.gvc.crmadmin.service;

import com.gvc.crmadmin.domain.UploadSegments;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

/**
 * Service Interface for managing UploadSegments.
 */
public interface UploadSegmentsService {

    /**
     * Save a uploadSegments.
     *
     * @param uploadSegments the entity to save
     * @return the persisted entity
     */
    UploadSegments save(UploadSegments uploadSegments);

    /**
     *  Get all the uploadSegments.
     *
     *  @param pageable the pagination information
     *  @return the list of entities
     */
    Page<UploadSegments> findAll(Pageable pageable);

    /**
     *  Get the "id" uploadSegments.
     *
     *  @param id the id of the entity
     *  @return the entity
     */
    UploadSegments findOne(String id);

    /**
     *  Delete the "id" uploadSegments.
     *
     *  @param id the id of the entity
     */
    void delete(String id);
}
