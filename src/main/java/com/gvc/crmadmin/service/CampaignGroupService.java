package com.gvc.crmadmin.service;

import com.gvc.crmadmin.domain.CampaignGroup;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

/**
 * Service Interface for managing CampaignGroup.
 */
public interface CampaignGroupService {

    /**
     * Save a campaignGroup.
     *
     * @param campaignGroup the entity to save
     * @return the persisted entity
     */
    CampaignGroup save(CampaignGroup campaignGroup);

    /**
     *  Get all the campaignGroups.
     *
     *  @param pageable the pagination information
     *  @return the list of entities
     */
    Page<CampaignGroup> findAll(Pageable pageable);

    /**
     *  Get the "id" campaignGroup.
     *
     *  @param id the id of the entity
     *  @return the entity
     */
    CampaignGroup findOne(String id);

    /**
     *  Delete the "id" campaignGroup.
     *
     *  @param id the id of the entity
     */
    void delete(String id);

    Page<CampaignGroup> findByProjectId(Pageable pageable, String projectId);
}
