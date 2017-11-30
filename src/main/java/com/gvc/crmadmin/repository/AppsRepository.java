package com.gvc.crmadmin.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import com.gvc.crmadmin.domain.Apps;

/**
 * Spring Data MongoDB repository for the Apps entity.
 */
@SuppressWarnings("unused")
@Repository
public interface AppsRepository extends MongoRepository<Apps, String> {
	Page<Apps> findByNameLike(String name, Pageable pageable);
}
