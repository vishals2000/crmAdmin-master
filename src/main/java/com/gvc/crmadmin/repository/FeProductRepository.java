package com.gvc.crmadmin.repository;

import com.gvc.crmadmin.domain.FeProduct;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * Spring Data MongoDB repository for the FeProduct entity.
 */
@SuppressWarnings("unused")
@Repository
public interface FeProductRepository extends MongoRepository<FeProduct, String> {
    List<FeProduct> findByFrontEnd(String frontEnd);
}
