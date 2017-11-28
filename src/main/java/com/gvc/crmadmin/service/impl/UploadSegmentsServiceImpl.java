package com.gvc.crmadmin.service.impl;

import com.gvc.crmadmin.service.UploadSegmentsService;
import com.gvc.crmadmin.domain.UploadSegments;
import com.gvc.crmadmin.repository.UploadSegmentsRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;


/**
 * Service Implementation for managing UploadSegments.
 */
@Service
public class UploadSegmentsServiceImpl implements UploadSegmentsService{

    private final Logger log = LoggerFactory.getLogger(UploadSegmentsServiceImpl.class);

    private final UploadSegmentsRepository uploadSegmentsRepository;
    public UploadSegmentsServiceImpl(UploadSegmentsRepository uploadSegmentsRepository) {
        this.uploadSegmentsRepository = uploadSegmentsRepository;
    }

    /**
     * Save a uploadSegments.
     *
     * @param uploadSegments the entity to save
     * @return the persisted entity
     */
    @Override
    public UploadSegments save(UploadSegments uploadSegments) {
        log.debug("Request to save UploadSegments : {}", uploadSegments);
        return uploadSegmentsRepository.save(uploadSegments);
    }

    /**
     *  Get all the uploadSegments.
     *
     *  @param pageable the pagination information
     *  @return the list of entities
     */
    @Override
    public Page<UploadSegments> findAll(Pageable pageable) {
        log.debug("Request to get all UploadSegments");
        return uploadSegmentsRepository.findAll(pageable);
    }

    /**
     *  Get one uploadSegments by id.
     *
     *  @param id the id of the entity
     *  @return the entity
     */
    @Override
    public UploadSegments findOne(String id) {
        log.debug("Request to get UploadSegments : {}", id);
        return uploadSegmentsRepository.findOne(id);
    }

    /**
     *  Delete the  uploadSegments by id.
     *
     *  @param id the id of the entity
     */
    @Override
    public void delete(String id) {
        log.debug("Request to delete UploadSegments : {}", id);
        uploadSegmentsRepository.delete(id);
    }
}
