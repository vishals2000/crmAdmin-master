package com.gvc.crmadmin.service;

import com.gvc.crmadmin.domain.FilterCriteria;
import com.gvc.crmadmin.domain.enumeration.Product;
import com.gvc.crmadmin.repository.FilterCriteriaRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;


/**
 * Service Implementation for managing FilterCriteria.
 */
@Service
public class FilterCriteriaService {

    private final Logger log = LoggerFactory.getLogger(FilterCriteriaService.class);

    private final FilterCriteriaRepository filterCriteriaRepository;

    @Autowired
    MongoTemplate mongoTemplate;

    public FilterCriteriaService(FilterCriteriaRepository filterCriteriaRepository) {
        this.filterCriteriaRepository = filterCriteriaRepository;
    }

    /**
     * Save a filterCriteria.
     *
     * @param filterCriteria the entity to save
     * @return the persisted entity
     */
    public FilterCriteria save(FilterCriteria filterCriteria) {
        log.debug("Request to save FilterCriteria : {}", filterCriteria);
        return filterCriteriaRepository.save(filterCriteria);
    }

    /**
     *  Get all the filterCriteria.
     *
     *  @param pageable the pagination information
     *  @return the list of entities
     */
    public Page<FilterCriteria> findAll(Pageable pageable) {
        log.debug("Request to get all FilterCriteria");
        return filterCriteriaRepository.findAll(pageable);
    }

    /**
     *  Get one filterCriteria by id.
     *
     *  @param id the id of the entity
     *  @return the entity
     */
    public FilterCriteria findOne(String id) {
        log.debug("Request to get FilterCriteria : {}", id);
        return filterCriteriaRepository.findOne(id);
    }

    /**
     *  Delete the  filterCriteria by id.
     *
     *  @param id the id of the entity
     */
    public void delete(String id) {
        log.debug("Request to delete FilterCriteria : {}", id);
        filterCriteriaRepository.delete(id);
    }

    @SuppressWarnings("unchecked")
    public Map<String, Map<String, String[]>> findDistinctByFrontEndAndProduct(String frontEnd, Product product) {
        log.debug("Request to get filterCriteria findByFrontEndAndProduct : " + frontEnd + " " + product);
        Criteria frontEndProductCriteria = Criteria.where("front_end").is(frontEnd).and("product").is(product);
        Query findQuery = new Query();
        findQuery.addCriteria(frontEndProductCriteria);
        List<FilterCriteria> filterCriteriaList = filterCriteriaRepository.findByFrontEndAndProduct(frontEnd, product);
        Map<String, Map<String, List<String>>> filterNameVsComparisonVsValue = new HashMap<>();
        for(FilterCriteria filterCriteria : filterCriteriaList){
            if(filterNameVsComparisonVsValue.containsKey(filterCriteria.getFilterItem())){
                Map<String, List<String>> filterOptionsMap = filterNameVsComparisonVsValue.get(filterCriteria.getFilterItem());
                if(filterOptionsMap.containsKey(filterCriteria.getFilterQuery())){
                    filterOptionsMap.get(filterCriteria.getFilterQuery()).add(filterCriteria.getFilterValue());
                } else{
                    final List<String> values = new ArrayList<>();
                    values.add(filterCriteria.getFilterValue());
                    filterOptionsMap.put(filterCriteria.getFilterQuery(), values);
                }
            } else{
                final Map<String, List<String>> comparisonVsValue = new HashMap<>();
                final List<String> values = new ArrayList<>();
                values.add(filterCriteria.getFilterValue());
                comparisonVsValue.put(filterCriteria.getFilterQuery(), values);
                filterNameVsComparisonVsValue.put(filterCriteria.getFilterItem(), comparisonVsValue);
            }
        }
        Map<String, Map<String, String[]>> filterNameVsComparisonVsValueArray = new HashMap<>();
        for(Map.Entry<String, Map<String, List<String>>> entry : filterNameVsComparisonVsValue.entrySet()){
            String filterOption = entry.getKey();
            Map<String, List<String>> comparisonVsValueList = entry.getValue();
            Map<String, String[]> comparisonVsValueArray = new HashMap<>();
            for(Map.Entry<String, List<String>> comparisonEntry : comparisonVsValueList.entrySet()){
                String comparisonKey = comparisonEntry.getKey();
                List<String> comparisonValuesList = comparisonEntry.getValue();
                String[] comparisonValuesArray = new String[comparisonValuesList.size()];
                comparisonValuesList.toArray(comparisonValuesArray);
                comparisonVsValueArray.put(comparisonKey, comparisonValuesArray);
            }
            filterNameVsComparisonVsValueArray.put(filterOption, comparisonVsValueArray);
        }
        return filterNameVsComparisonVsValueArray;
    }
}
