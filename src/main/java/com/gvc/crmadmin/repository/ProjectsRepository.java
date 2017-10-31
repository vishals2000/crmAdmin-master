package com.gvc.crmadmin.repository;

import com.gvc.crmadmin.domain.Projects;
import org.springframework.stereotype.Repository;

import org.springframework.data.mongodb.repository.MongoRepository;

/**
 * Spring Data MongoDB repository for the Projects entity.
 */
@SuppressWarnings("unused")
@Repository
public interface ProjectsRepository extends MongoRepository<Projects, String> {

}
