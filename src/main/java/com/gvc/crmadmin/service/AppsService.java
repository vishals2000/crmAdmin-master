package com.gvc.crmadmin.service;

import com.gvc.crmadmin.domain.Apps;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.Collection;
import java.util.List;

/**
 * Service Interface for managing Apps.
 */
public interface AppsService {

    /**
     * Save a apps.
     *
     * @param apps the entity to save
     * @return the persisted entity
     */
    Apps save(Apps apps);

    /**
     *  Get all the apps.
     *
     *  @param pageable the pagination information
     *  @return the list of entities
     */
    Page<Apps> findAll(Pageable pageable);

    List<Apps> findAll();

    List<Apps> findAllWithRestrictions();

    Page<Apps> findByName(Pageable pageable, String appName);

    /**
     *  Get the "id" apps.
     *
     *  @param id the id of the entity
     *  @return the entity
     */
    Apps findOne(String id);

    /**
     *  Delete the "id" apps.
     *
     *  @param id the id of the entity
     */
    void delete(String id);

    Page<Apps> findByIdIn(Collection applications, Pageable pageable);

    List<Apps> findByIdIn(Collection applications);

    Page<Apps> findByIdInAndNameLikeIgnoreCase(Pageable pageable, String appName, Collection objects);
}
