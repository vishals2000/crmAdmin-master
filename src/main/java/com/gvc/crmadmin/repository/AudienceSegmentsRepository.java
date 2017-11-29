package com.gvc.crmadmin.repository;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import com.gvc.crmadmin.domain.AudienceSegments;
import com.gvc.crmadmin.domain.AudienceSegmentsPlayers;

/**
 * Spring Data MongoDB repository for the AudienceSegments entity.
 */
@SuppressWarnings("unused")
@Repository
public interface AudienceSegmentsRepository extends MongoRepository<AudienceSegments, String> {

}
