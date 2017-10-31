package com.gvc.crmadmin.service;

import com.gvc.crmadmin.domain.CampaignTemplate;
import com.gvc.crmadmin.repository.CampaignTemplateRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;


/**
 * Service Implementation for managing CampaignTemplate.
 */
@Service
public class CampaignTemplateService {

    private final Logger log = LoggerFactory.getLogger(CampaignTemplateService.class);

    private final CampaignTemplateRepository campaignTemplateRepository;
    public CampaignTemplateService(CampaignTemplateRepository campaignTemplateRepository) {
        this.campaignTemplateRepository = campaignTemplateRepository;
    }

    /**
     * Save a campaignTemplate.
     *
     * @param campaignTemplate the entity to save
     * @return the persisted entity
     */
    public CampaignTemplate save(CampaignTemplate campaignTemplate) {
        log.debug("Request to save CampaignTemplate : {}", campaignTemplate);
        return campaignTemplateRepository.save(campaignTemplate);
    }

    /**
     *  Get all the campaignTemplates.
     *
     *  @param pageable the pagination information
     *  @return the list of entities
     */
    public Page<CampaignTemplate> findAll(Pageable pageable) {
        log.debug("Request to get all CampaignTemplates");
        return campaignTemplateRepository.findAll(pageable);
    }

    /**
     *  Get one campaignTemplate by id.
     *
     *  @param id the id of the entity
     *  @return the entity
     */
    public CampaignTemplate findOne(String id) {
        log.debug("Request to get CampaignTemplate : {}", id);
        return campaignTemplateRepository.findOne(id);
    }

    /**
     *  Delete the  campaignTemplate by id.
     *
     *  @param id the id of the entity
     */
    public void delete(String id) {
        log.debug("Request to delete CampaignTemplate : {}", id);
        campaignTemplateRepository.delete(id);
    }
}
