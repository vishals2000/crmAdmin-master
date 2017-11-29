package com.gvc.crmadmin.repository;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import com.gvc.crmadmin.domain.AudienceSegments;
import com.gvc.crmadmin.domain.AudienceSegmentsPlayers;
import com.gvc.crmadmin.domain.CampaignTemplate;

/**
 * Spring Data MongoDB repository for the AudienceSegments entity.
 */
@SuppressWarnings("unused")
@Repository
public interface AudienceSegmentsRepository extends MongoRepository<AudienceSegments, String> {
	
	Page<AudienceSegments> findByFrontEndAndProduct(String frontEnd, String product, Pageable pageable);
	
	List<AudienceSegments> findByFrontEndAndProduct(String frontEnd, String product);
	
}
