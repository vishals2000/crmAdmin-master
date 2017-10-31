package com.gvc.crmadmin.service.impl;

import com.gvc.crmadmin.service.CampaignGroupService;
import com.gvc.crmadmin.domain.CampaignGroup;
import com.gvc.crmadmin.repository.CampaignGroupRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;


/**
 * Service Implementation for managing CampaignGroup.
 */
@Service
public class CampaignGroupServiceImpl implements CampaignGroupService{

    private final Logger log = LoggerFactory.getLogger(CampaignGroupServiceImpl.class);

    private final CampaignGroupRepository campaignGroupRepository;
    public CampaignGroupServiceImpl(CampaignGroupRepository campaignGroupRepository) {
        this.campaignGroupRepository = campaignGroupRepository;
    }

    /**
     * Save a campaignGroup.
     *
     * @param campaignGroup the entity to save
     * @return the persisted entity
     */
    @Override
    public CampaignGroup save(CampaignGroup campaignGroup) {
        log.debug("Request to save CampaignGroup : {}", campaignGroup);
        return campaignGroupRepository.save(campaignGroup);
    }

    /**
     *  Get all the campaignGroups.
     *
     *  @param pageable the pagination information
     *  @return the list of entities
     */
    @Override
    public Page<CampaignGroup> findAll(Pageable pageable) {
        log.debug("Request to get all CampaignGroups");
        return campaignGroupRepository.findAll(pageable);
    }

    @Override
    public Page<CampaignGroup> findByProjectId(Pageable pageable, String projectId) {
        log.debug("Request to get all CampaignGroups for projectId");
//        Page<CampaignGroup> result = campaignGroupRepository.findByProjectId(projectId, pageable);
//        System.out.print("Result" + result.toString());
//        return result;
        return campaignGroupRepository.findAll(pageable);
    }

    /**
     *  Get one campaignGroup by id.
     *
     *  @param id the id of the entity
     *  @return the entity
     */
    @Override
    public CampaignGroup findOne(String id) {
        log.debug("Request to get CampaignGroup : {}", id);
        return campaignGroupRepository.findOne(id);
    }

    /**
     *  Delete the  campaignGroup by id.
     *
     *  @param id the id of the entity
     */
    @Override
    public void delete(String id) {
        log.debug("Request to delete CampaignGroup : {}", id);
        campaignGroupRepository.delete(id);
    }
}
