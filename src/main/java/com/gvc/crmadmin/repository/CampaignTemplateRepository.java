package com.gvc.crmadmin.repository;

import com.gvc.crmadmin.domain.CampaignTemplate;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Repository;

import org.springframework.data.mongodb.repository.MongoRepository;

/**
 * Spring Data MongoDB repository for the CampaignTemplate entity.
 */
@SuppressWarnings("unused")
@Repository
public interface CampaignTemplateRepository extends MongoRepository<CampaignTemplate, String> {

    Page<CampaignTemplate> findByCampaignGroupId(String campaignGroupId, Pageable pageable);
}
