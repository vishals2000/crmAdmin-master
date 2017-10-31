package com.gvc.crmadmin.repository;

import com.gvc.crmadmin.domain.TagCriteria;
import org.springframework.stereotype.Repository;

import org.springframework.data.mongodb.repository.MongoRepository;

/**
 * Spring Data MongoDB repository for the TagCriteria entity.
 */
@SuppressWarnings("unused")
@Repository
public interface TagCriteriaRepository extends MongoRepository<TagCriteria, String> {

}
