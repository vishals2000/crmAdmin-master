package com.gvc.crmadmin.repository;

import com.gvc.crmadmin.domain.AudienceSegments;
import org.springframework.stereotype.Repository;

import org.springframework.data.mongodb.repository.MongoRepository;

/**
 * Spring Data MongoDB repository for the AudienceSegments entity.
 */
@SuppressWarnings("unused")
@Repository
public interface AudienceSegmentsRepository extends MongoRepository<AudienceSegments, String> {

}
