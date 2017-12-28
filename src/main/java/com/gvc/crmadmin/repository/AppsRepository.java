package com.gvc.crmadmin.repository;

import com.gvc.crmadmin.domain.Apps;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.Collection;
import java.util.List;

/**
 * Spring Data MongoDB repository for the Apps entity.
 */
@SuppressWarnings("unused")
@Repository
public interface AppsRepository extends MongoRepository<Apps, String> {
	Page<Apps> findByNameLikeIgnoreCase(String name, Pageable pageable);

    Page<Apps> findByIdIn(Collection applications, Pageable pageable);

    List<Apps> findByIdIn(Collection applications);

    Page<Apps> findByIdInAndNameLikeIgnoreCase(Collection objects, String appName, Pageable pageable);
}
