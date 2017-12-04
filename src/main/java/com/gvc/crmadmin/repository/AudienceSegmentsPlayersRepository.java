package com.gvc.crmadmin.repository;

import com.gvc.crmadmin.domain.AudienceSegments;
import com.gvc.crmadmin.domain.AudienceSegmentsPlayers;

import org.springframework.stereotype.Repository;

import org.springframework.data.mongodb.repository.MongoRepository;

/**
 * Spring Data MongoDB repository for the AudienceSegments entity.
 */
@SuppressWarnings("unused")
@Repository
public interface AudienceSegmentsPlayersRepository extends MongoRepository<AudienceSegmentsPlayers, String> {
	
	Long deleteBySegmentName(String segmentName);
	
	Long countBySegmentName(String segmentName);
	
}
