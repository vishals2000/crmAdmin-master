package com.gvc.crmadmin.service;

import com.gvc.crmadmin.domain.TargetGroupCriteria;
import com.gvc.crmadmin.domain.enumeration.Product;
import com.gvc.crmadmin.repository.TargetGroupCriteriaRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;


/**
 * Service Implementation for managing TargetGroupCriteria.
 */
@Service
public class TargetGroupCriteriaService {

    private final Logger log = LoggerFactory.getLogger(TargetGroupCriteriaService.class);

    private final TargetGroupCriteriaRepository targetGroupCriteriaRepository;
    public TargetGroupCriteriaService(TargetGroupCriteriaRepository targetGroupCriteriaRepository) {
        this.targetGroupCriteriaRepository = targetGroupCriteriaRepository;
    }

    /**
     * Save a targetGroupCriteria.
     *
     * @param targetGroupCriteria the entity to save
     * @return the persisted entity
     */
    public TargetGroupCriteria save(TargetGroupCriteria targetGroupCriteria) {
        log.debug("Request to save TargetGroupCriteria : {}", targetGroupCriteria);
        return targetGroupCriteriaRepository.save(targetGroupCriteria);
    }

    /**
     *  Get all the targetGroupCriteria.
     *
     *  @param pageable the pagination information
     *  @return the list of entities
     */
    public Page<TargetGroupCriteria> findAll(Pageable pageable) {
        log.debug("Request to get all TargetGroupCriteria");
        return targetGroupCriteriaRepository.findAll(pageable);
    }

    /**
     *  Get one targetGroupCriteria by id.
     *
     *  @param id the id of the entity
     *  @return the entity
     */
    public TargetGroupCriteria findOne(String id) {
        log.debug("Request to get TargetGroupCriteria : {}", id);
        return targetGroupCriteriaRepository.findOne(id);
    }

    /**
     *  Delete the  targetGroupCriteria by id.
     *
     *  @param id the id of the entity
     */
    public void delete(String id) {
        log.debug("Request to delete TargetGroupCriteria : {}", id);
        targetGroupCriteriaRepository.delete(id);
    }

    public List<String> findByFrontEndAndProduct(String frontEnd, Product product) {
        log.debug("Request to get findByFrontEndAndProduct : " + frontEnd + " " + product);
        List<TargetGroupCriteria> targetGroupCriteriaList = targetGroupCriteriaRepository.findByFrontEndAndProduct(frontEnd, product);
        List<String> targetGroupNames = new ArrayList<>();
        for(TargetGroupCriteria targetGroupCriteria : targetGroupCriteriaList){
            targetGroupNames.add(targetGroupCriteria.getName());
        }
        return targetGroupNames;
    }

    public TargetGroupCriteria findByFrontEndAndProductAndName(String frontEnd, Product product, String name) {
        log.debug("Request to get findByFrontEndAndProductAndName : " + frontEnd + " " + product + " " + name);
        List<TargetGroupCriteria> targetGroupCriteriaList = targetGroupCriteriaRepository.findByFrontEndAndProductAndName(frontEnd, product, name);
        return targetGroupCriteriaList.get(0);
    }
}
