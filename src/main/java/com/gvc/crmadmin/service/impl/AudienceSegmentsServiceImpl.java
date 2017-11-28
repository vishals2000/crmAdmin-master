package com.gvc.crmadmin.service.impl;

import com.gvc.crmadmin.service.AudienceSegmentsService;
import com.gvc.crmadmin.domain.AudienceSegments;
import com.gvc.crmadmin.repository.AudienceSegmentsRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;


/**
 * Service Implementation for managing AudienceSegments.
 */
@Service
public class AudienceSegmentsServiceImpl implements AudienceSegmentsService{

    private final Logger log = LoggerFactory.getLogger(AudienceSegmentsServiceImpl.class);

    private final AudienceSegmentsRepository audienceSegmentsRepository;
    public AudienceSegmentsServiceImpl(AudienceSegmentsRepository audienceSegmentsRepository) {
        this.audienceSegmentsRepository = audienceSegmentsRepository;
    }

    /**
     * Save a audienceSegments.
     *
     * @param audienceSegments the entity to save
     * @return the persisted entity
     */
    @Override
    public AudienceSegments save(AudienceSegments audienceSegments) {
        log.debug("Request to save AudienceSegments : {}", audienceSegments);
        return audienceSegmentsRepository.save(audienceSegments);
    }

    /**
     *  Get all the audienceSegments.
     *
     *  @param pageable the pagination information
     *  @return the list of entities
     */
    @Override
    public Page<AudienceSegments> findAll(Pageable pageable) {
        log.debug("Request to get all AudienceSegments");
        return audienceSegmentsRepository.findAll(pageable);
    }

    /**
     *  Get one audienceSegments by id.
     *
     *  @param id the id of the entity
     *  @return the entity
     */
    @Override
    public AudienceSegments findOne(String id) {
        log.debug("Request to get AudienceSegments : {}", id);
        return audienceSegmentsRepository.findOne(id);
    }

    /**
     *  Delete the  audienceSegments by id.
     *
     *  @param id the id of the entity
     */
    @Override
    public void delete(String id) {
        log.debug("Request to delete AudienceSegments : {}", id);
        audienceSegmentsRepository.delete(id);
    }
}
