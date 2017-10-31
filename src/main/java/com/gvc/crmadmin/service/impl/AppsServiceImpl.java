package com.gvc.crmadmin.service.impl;

import com.gvc.crmadmin.service.AppsService;
import com.gvc.crmadmin.domain.Apps;
import com.gvc.crmadmin.repository.AppsRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;


/**
 * Service Implementation for managing Apps.
 */
@Service
public class AppsServiceImpl implements AppsService{

    private final Logger log = LoggerFactory.getLogger(AppsServiceImpl.class);

    private final AppsRepository appsRepository;
    public AppsServiceImpl(AppsRepository appsRepository) {
        this.appsRepository = appsRepository;
    }

    /**
     * Save a apps.
     *
     * @param apps the entity to save
     * @return the persisted entity
     */
    @Override
    public Apps save(Apps apps) {
        log.debug("Request to save Apps : {}", apps);
        return appsRepository.save(apps);
    }

    /**
     *  Get all the apps.
     *
     *  @param pageable the pagination information
     *  @return the list of entities
     */
    @Override
    public Page<Apps> findAll(Pageable pageable) {
        log.debug("Request to get all Apps");
        return appsRepository.findAll(pageable);
    }

    /**
     *  Get one apps by id.
     *
     *  @param id the id of the entity
     *  @return the entity
     */
    @Override
    public Apps findOne(String id) {
        log.debug("Request to get Apps : {}", id);
        return appsRepository.findOne(id);
    }

    /**
     *  Delete the  apps by id.
     *
     *  @param id the id of the entity
     */
    @Override
    public void delete(String id) {
        log.debug("Request to delete Apps : {}", id);
        appsRepository.delete(id);
    }
}
