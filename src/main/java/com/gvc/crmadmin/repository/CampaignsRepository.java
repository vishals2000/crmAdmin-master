package com.gvc.crmadmin.repository;

import com.gvc.crmadmin.domain.Campaigns;
import org.springframework.stereotype.Repository;

import org.springframework.data.mongodb.repository.MongoRepository;

/**
 * Spring Data MongoDB repository for the Campaigns entity.
 */
@SuppressWarnings("unused")
@Repository
public interface CampaignsRepository extends MongoRepository<Campaigns, String> {

}
