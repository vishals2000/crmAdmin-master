package com.gvc.crmadmin.repository;

import com.gvc.crmadmin.domain.TargetGroupCriteria;
import com.gvc.crmadmin.domain.enumeration.Product;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * Spring Data MongoDB repository for the TargetGroupCriteria entity.
 */
@SuppressWarnings("unused")
@Repository
public interface TargetGroupCriteriaRepository extends MongoRepository<TargetGroupCriteria, String> {

    List<TargetGroupCriteria> findByFrontEndAndProduct(String frontEnd, Product product);

    List<TargetGroupCriteria> findByFrontEndAndProductAndName(String frontEnd, Product product, String name);
}
