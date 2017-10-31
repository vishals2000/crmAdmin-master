package com.gvc.crmadmin.service;

import com.gvc.crmadmin.domain.EventCriteria;
import com.gvc.crmadmin.domain.enumeration.Product;
import com.gvc.crmadmin.repository.EventCriteriaRepository;
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
 * Service Implementation for managing EventCriteria.
 */
@Service
public class EventCriteriaService {

    private final Logger log = LoggerFactory.getLogger(EventCriteriaService.class);

    private final EventCriteriaRepository eventCriteriaRepository;

    @Autowired
    MongoTemplate mongoTemplate;
    public EventCriteriaService(EventCriteriaRepository eventCriteriaRepository) {
        this.eventCriteriaRepository = eventCriteriaRepository;
    }

    /**
     * Save a eventCriteria.
     *
     * @param eventCriteria the entity to save
     * @return the persisted entity
     */
    public EventCriteria save(EventCriteria eventCriteria) {
        log.debug("Request to save EventCriteria : {}", eventCriteria);
        return eventCriteriaRepository.save(eventCriteria);
    }

    /**
     *  Get all the eventCriteria.
     *
     *  @param pageable the pagination information
     *  @return the list of entities
     */
    public Page<EventCriteria> findAll(Pageable pageable) {
        log.debug("Request to get all EventCriteria");
        return eventCriteriaRepository.findAll(pageable);
    }

    /**
     *  Get one eventCriteria by id.
     *
     *  @param id the id of the entity
     *  @return the entity
     */
    public EventCriteria findOne(String id) {
        log.debug("Request to get EventCriteria : {}", id);
        return eventCriteriaRepository.findOne(id);
    }

    /**
     *  Delete the  eventCriteria by id.
     *
     *  @param id the id of the entity
     */
    public void delete(String id) {
        log.debug("Request to delete EventCriteria : {}", id);
        eventCriteriaRepository.delete(id);
    }

    @SuppressWarnings("unchecked")
    public List<String> findDistinctByFrontEndAndProduct(String frontEnd, Product product) {
        log.debug("Request to get eventCriteria findByFrontEndAndProduct : " + frontEnd + " " + product);
        Criteria frontEndProductCriteria = Criteria.where("front_end").is(frontEnd).and("product").is(product);
        Query findQuery = new Query();
        findQuery.addCriteria(frontEndProductCriteria);
        return mongoTemplate.getCollection(mongoTemplate.getCollectionName(EventCriteria.class)).distinct("event_name");
    }
}
