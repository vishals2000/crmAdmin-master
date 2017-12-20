package com.gvc.crmadmin.repository;

import com.gvc.crmadmin.domain.CampaignGroup;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * Spring Data MongoDB repository for the CampaignGroup entity.
 */
@SuppressWarnings("unused")
@Repository()
public interface CampaignGroupRepository extends MongoRepository<CampaignGroup, String> {

    Page<CampaignGroup> findByProjectId(String projectId, Pageable pageable);
    List<CampaignGroup> findByProjectId(String projectId);

    Page<CampaignGroup> findByProjectIdAndNameLikeIgnoreCase(String projectId, String name, Pageable pageable);
}
