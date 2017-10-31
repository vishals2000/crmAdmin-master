package com.gvc.crmadmin.repository;

import com.gvc.crmadmin.domain.EventCriteria;
import org.springframework.stereotype.Repository;

import org.springframework.data.mongodb.repository.MongoRepository;

/**
 * Spring Data MongoDB repository for the EventCriteria entity.
 */
@SuppressWarnings("unused")
@Repository
public interface EventCriteriaRepository extends MongoRepository<EventCriteria, String> {

}
