package com.gvc.crmadmin.service;

import com.gvc.crmadmin.domain.TagCriteria;
import com.gvc.crmadmin.domain.enumeration.Product;
import com.gvc.crmadmin.repository.TagCriteriaRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.stereotype.Service;

import java.util.List;


/**
 * Service Implementation for managing TagCriteria.
 */
@Service
public class TagCriteriaService {

    private final Logger log = LoggerFactory.getLogger(TagCriteriaService.class);

    private final TagCriteriaRepository tagCriteriaRepository;

    @Autowired
    MongoTemplate mongoTemplate;

    public TagCriteriaService(TagCriteriaRepository tagCriteriaRepository) {
        this.tagCriteriaRepository = tagCriteriaRepository;
    }

    /**
     * Save a tagCriteria.
     *
     * @param tagCriteria the entity to save
     * @return the persisted entity
     */
    public TagCriteria save(TagCriteria tagCriteria) {
        log.debug("Request to save TagCriteria : {}", tagCriteria);
        return tagCriteriaRepository.save(tagCriteria);
    }

    /**
     *  Get all the tagCriteria.
     *
     *  @param pageable the pagination information
     *  @return the list of entities
     */
    public Page<TagCriteria> findAll(Pageable pageable) {
        log.debug("Request to get all TagCriteria");
        return tagCriteriaRepository.findAll(pageable);
    }

    /**
     *  Get one tagCriteria by id.
     *
     *  @param id the id of the entity
     *  @return the entity
     */
    public TagCriteria findOne(String id) {
        log.debug("Request to get TagCriteria : {}", id);
        return tagCriteriaRepository.findOne(id);
    }

    /**
     *  Delete the  tagCriteria by id.
     *
     *  @param id the id of the entity
     */
    public void delete(String id) {
        log.debug("Request to delete TagCriteria : {}", id);
        tagCriteriaRepository.delete(id);
    }

    @SuppressWarnings("unchecked")
    public List<String> findDistinctByFrontEndAndProduct(String frontEnd, Product product) {
        log.debug("Request to get tagCriteria findByFrontEndAndProduct : " + frontEnd + " " + product);
        Criteria frontEndProductCriteria = Criteria.where("front_end").is(frontEnd).and("product").is(product);
        Query findQuery = new Query();
        findQuery.addCriteria(frontEndProductCriteria);
        return mongoTemplate.getCollection(mongoTemplate.getCollectionName(TagCriteria.class)).distinct("tag_name");
    }
}
