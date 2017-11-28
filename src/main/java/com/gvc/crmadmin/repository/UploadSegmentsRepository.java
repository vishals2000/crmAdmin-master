package com.gvc.crmadmin.repository;

import com.gvc.crmadmin.domain.UploadSegments;
import org.springframework.stereotype.Repository;

import org.springframework.data.mongodb.repository.MongoRepository;

/**
 * Spring Data MongoDB repository for the UploadSegments entity.
 */
@SuppressWarnings("unused")
@Repository
public interface UploadSegmentsRepository extends MongoRepository<UploadSegments, String> {

}
