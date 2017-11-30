package com.gvc.crmadmin.repository;

import com.gvc.crmadmin.domain.CampaignGroup;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Repository;

import org.springframework.data.mongodb.repository.MongoRepository;

/**
 * Spring Data MongoDB repository for the CampaignGroup entity.
 */
@SuppressWarnings("unused")
@Repository()
public interface CampaignGroupRepository extends MongoRepository<CampaignGroup, String> {

    Page<CampaignGroup> findByProjectId(String projectId, Pageable pageable);
    
    Page<CampaignGroup> findByProjectIdAndNameLike(String projectId, String name, Pageable pageable);
}
