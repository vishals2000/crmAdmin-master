package com.gvc.crmadmin.service;

import com.gvc.crmadmin.domain.FeProduct;
import com.gvc.crmadmin.repository.FeProductRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.stereotype.Service;

import java.util.List;


/**
 * Service Implementation for managing FeProduct.
 */
@Service
public class FeProductService {

    private final Logger log = LoggerFactory.getLogger(FeProductService.class);

    private final FeProductRepository feProductRepository;

    @Autowired
    MongoTemplate mongoTemplate;

    public FeProductService(FeProductRepository feProductRepository) {
        this.feProductRepository = feProductRepository;
    }

    /**
     * Save a feProduct.
     *
     * @param feProduct the entity to save
     * @return the persisted entity
     */
    public FeProduct save(FeProduct feProduct) {
        log.debug("Request to save FeProduct : {}", feProduct);
        return feProductRepository.save(feProduct);
    }

    /**
     *  Get all the feProducts.
     *
     *  @param pageable the pagination information
     *  @return the list of entities
     */
    public Page<FeProduct> findAll(Pageable pageable) {
        log.debug("Request to get all FeProducts");
        return feProductRepository.findAll(pageable);
    }

    /**
     *  Get one feProduct by id.
     *
     *  @param id the id of the entity
     *  @return the entity
     */
    public FeProduct findOne(String id) {
        log.debug("Request to get FeProduct : {}", id);
        return feProductRepository.findOne(id);
    }

    /**
     *  Delete the  feProduct by id.
     *
     *  @param id the id of the entity
     */
    public void delete(String id) {
        log.debug("Request to delete FeProduct : {}", id);
        feProductRepository.delete(id);
    }

    @SuppressWarnings("unchecked")
    public List<String> findDistinctFe() {
        log.debug("Request to get all findDistinctFe ");
        return mongoTemplate.getCollection(mongoTemplate.getCollectionName(FeProduct.class)).distinct("front_end");
    }

    @SuppressWarnings("unchecked")
    public List<FeProduct> findProductsForFrontEnd(String frontEnd) {
        log.debug("Request to get all findProductsForFrontEnd " + frontEnd);
        return feProductRepository.findByFrontEnd(frontEnd);
    }
}
