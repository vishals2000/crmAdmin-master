package com.gvc.crmadmin.service;

import com.gvc.crmadmin.domain.CampaignStat;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

/**
 * Service Interface for managing CampaignStat.
 */
public interface CampaignStatService {

    /**
     * Save a campaignStat.
     *
     * @param campaignStat the entity to save
     * @return the persisted entity
     */
    CampaignStat save(CampaignStat campaignStat);

    /**
     *  Get all the campaignStats.
     *
     *  @param pageable the pagination information
     *  @return the list of entities
     */
    Page<CampaignStat> findAll(Pageable pageable);

    /**
     *  Get the "id" campaignStat.
     *
     *  @param id the id of the entity
     *  @return the entity
     */
    CampaignStat findOne(String id);

    /**
     *  Delete the "id" campaignStat.
     *
     *  @param id the id of the entity
     */
    void delete(String id);
}
