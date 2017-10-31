package com.gvc.crmadmin.service;

import com.gvc.crmadmin.domain.MessageContent;
import com.gvc.crmadmin.domain.enumeration.Product;
import com.gvc.crmadmin.repository.MessageContentRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;


/**
 * Service Implementation for managing MessageContent.
 */
@Service
public class MessageContentService {

    private final Logger log = LoggerFactory.getLogger(MessageContentService.class);

    private final MessageContentRepository messageContentRepository;
    public MessageContentService(MessageContentRepository messageContentRepository) {
        this.messageContentRepository = messageContentRepository;
    }

    /**
     * Save a messageContent.
     *
     * @param messageContent the entity to save
     * @return the persisted entity
     */
    public MessageContent save(MessageContent messageContent) {
        log.debug("Request to save MessageContent : {}", messageContent);
        return messageContentRepository.save(messageContent);
    }

    /**
     *  Get all the messageContents.
     *
     *  @param pageable the pagination information
     *  @return the list of entities
     */
    public Page<MessageContent> findAll(Pageable pageable) {
        log.debug("Request to get all MessageContents");
        return messageContentRepository.findAll(pageable);
    }

    /**
     *  Get one messageContent by id.
     *
     *  @param id the id of the entity
     *  @return the entity
     */
    public MessageContent findOne(String id) {
        log.debug("Request to get MessageContent : {}", id);
        return messageContentRepository.findOne(id);
    }

    /**
     *  Delete the  messageContent by id.
     *
     *  @param id the id of the entity
     */
    public void delete(String id) {
        log.debug("Request to delete MessageContent : {}", id);
        messageContentRepository.delete(id);
    }

    public List<String> findByFrontEndAndProduct(String frontEnd, Product product) {
        log.debug("Request to get findByFrontEndAndProduct : " + frontEnd + " " + product);
        List<MessageContent> messageContents = messageContentRepository.findByFrontEndAndProduct(frontEnd, product);
        List<String> messageContentNames = new ArrayList<>();
        for(MessageContent messageContent : messageContents){
            messageContentNames.add(messageContent.getContentName());
        }
        return messageContentNames;
    }

    public MessageContent findByFrontEndAndProductAndName(String frontEnd, Product product, String name) {
        log.debug("Request to get findByFrontEndAndProduct : " + frontEnd + " " + product + " " + name);
        List<MessageContent> messageContents = messageContentRepository.findByFrontEndAndProductAndContentName(frontEnd, product, name);
        return messageContents.get(0);
    }
}
