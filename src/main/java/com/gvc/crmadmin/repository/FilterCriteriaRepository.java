package com.gvc.crmadmin.repository;

import com.gvc.crmadmin.domain.FilterCriteria;
import com.gvc.crmadmin.domain.enumeration.Product;
import org.springframework.stereotype.Repository;

import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

/**
 * Spring Data MongoDB repository for the FilterCriteria entity.
 */
@SuppressWarnings("unused")
@Repository
public interface FilterCriteriaRepository extends MongoRepository<FilterCriteria, String> {

    List<FilterCriteria> findDistinctByFrontEndAndProduct(String frontEnd, Product product);

    List<FilterCriteria> findByFrontEndAndProduct(String frontEnd, Product product);
}
