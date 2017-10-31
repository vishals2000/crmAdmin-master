package com.gvc.crmadmin.repository;

import com.gvc.crmadmin.domain.MessageContent;
import com.gvc.crmadmin.domain.enumeration.Product;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * Spring Data MongoDB repository for the MessageContent entity.
 */
@SuppressWarnings("unused")
@Repository
public interface MessageContentRepository extends MongoRepository<MessageContent, String> {
    List<MessageContent> findByFrontEndAndProduct(String frontEnd, Product product);

    List<MessageContent> findByFrontEndAndProductAndContentName(String frontEnd, Product product, String contentName);
}
