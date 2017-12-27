package com.gvc.crmadmin.service.impl;

import com.gvc.crmadmin.service.CampaignStatService;
import com.gvc.crmadmin.domain.CampaignStat;
import com.gvc.crmadmin.repository.CampaignStatRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;


/**
 * Service Implementation for managing CampaignStat.
 */
@Service
public class CampaignStatServiceImpl implements CampaignStatService{

    private final Logger log = LoggerFactory.getLogger(CampaignStatServiceImpl.class);

    private final CampaignStatRepository campaignStatRepository;
    public CampaignStatServiceImpl(CampaignStatRepository campaignStatRepository) {
        this.campaignStatRepository = campaignStatRepository;
    }

    /**
     * Save a campaignStat.
     *
     * @param campaignStat the entity to save
     * @return the persisted entity
     */
    @Override
    public CampaignStat save(CampaignStat campaignStat) {
        log.debug("Request to save CampaignStat : {}", campaignStat);
        return campaignStatRepository.save(campaignStat);
    }

    /**
     *  Get all the campaignStats.
     *
     *  @param pageable the pagination information
     *  @return the list of entities
     */
    @Override
    public Page<CampaignStat> findAll(Pageable pageable) {
        log.debug("Request to get all CampaignStats");
        return campaignStatRepository.findAll(pageable);
    }

    /**
     *  Get one campaignStat by id.
     *
     *  @param id the id of the entity
     *  @return the entity
     */
    @Override
    public CampaignStat findOne(String id) {
        log.debug("Request to get CampaignStat : {}", id);
        return campaignStatRepository.findOne(id);
    }

    /**
     *  Delete the  campaignStat by id.
     *
     *  @param id the id of the entity
     */
    @Override
    public void delete(String id) {
        log.debug("Request to delete CampaignStat : {}", id);
        campaignStatRepository.delete(id);
    }
}
