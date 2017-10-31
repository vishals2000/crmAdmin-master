package com.gvc.crmadmin.repository;

import com.gvc.crmadmin.domain.Apps;
import org.springframework.stereotype.Repository;

import org.springframework.data.mongodb.repository.MongoRepository;

/**
 * Spring Data MongoDB repository for the Apps entity.
 */
@SuppressWarnings("unused")
@Repository
public interface AppsRepository extends MongoRepository<Apps, String> {

}
