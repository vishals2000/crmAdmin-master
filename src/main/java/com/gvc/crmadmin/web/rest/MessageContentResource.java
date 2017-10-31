package com.gvc.crmadmin.web.rest;

import com.codahale.metrics.annotation.Timed;
import com.gvc.crmadmin.domain.MessageContent;
import com.gvc.crmadmin.domain.enumeration.Product;
import com.gvc.crmadmin.service.MessageContentService;
import com.gvc.crmadmin.web.rest.util.HeaderUtil;
import com.gvc.crmadmin.web.rest.util.PaginationUtil;
import io.github.jhipster.web.util.ResponseUtil;
import io.swagger.annotations.ApiParam;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.io.UnsupportedEncodingException;
import java.net.URI;
import java.net.URISyntaxException;
import java.net.URLEncoder;
import java.util.List;
import java.util.Optional;

/**
 * REST controller for managing MessageContent.
 */
@RestController
@RequestMapping("/api")
public class MessageContentResource {

    private final Logger log = LoggerFactory.getLogger(MessageContentResource.class);

    private static final String ENTITY_NAME = "messageContent";

    private final MessageContentService messageContentService;

    public MessageContentResource(MessageContentService messageContentService) {
        this.messageContentService = messageContentService;
    }

    /**
     * POST  /message-contents : Create a new messageContent.
     *
     * @param messageContent the messageContent to create
     * @return the ResponseEntity with status 201 (Created) and with body the new messageContent, or with status 400 (Bad Request) if the messageContent has already an ID
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PostMapping("/message-contents")
    @Timed
    public ResponseEntity<MessageContent> createMessageContent(@Valid @RequestBody MessageContent messageContent) throws URISyntaxException, UnsupportedEncodingException {
        log.debug("REST request to save MessageContent : {}", messageContent);
        /*if (messageContent.getId() != null) {
            return ResponseEntity.badRequest().headers(HeaderUtil.createFailureAlert(ENTITY_NAME, "idexists", "A new messageContent cannot already have an ID")).body(null);
        }*/
        MessageContent result;
        MessageContent messageContentFromDB = messageContentService.findOne(messageContent.getId());
        if(messageContentFromDB == null){
            result = messageContentService.save(messageContent);
        } else{
            return ResponseEntity.badRequest()
                .headers(HeaderUtil.createFailureAlert(ENTITY_NAME, messageContentFromDB.getId(), "MessageContent with the given contentName exists"))
                .body(messageContentFromDB);
        }
        return ResponseEntity.created(new URI(URLEncoder.encode("/api/message-contents/" + result.getId(), "UTF-8")))
            .headers(HeaderUtil.createEntityCreationAlert(ENTITY_NAME, result.getId()))
            .body(result);
    }

    /**
     * PUT  /message-contents : Updates an existing messageContent.
     *
     * @param messageContent the messageContent to update
     * @return the ResponseEntity with status 200 (OK) and with body the updated messageContent,
     * or with status 400 (Bad Request) if the messageContent is not valid,
     * or with status 500 (Internal Server Error) if the messageContent couldn't be updated
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PutMapping("/message-contents")
    @Timed
    public ResponseEntity<MessageContent> updateMessageContent(@Valid @RequestBody MessageContent messageContent) throws URISyntaxException, UnsupportedEncodingException {
        log.debug("REST request to update MessageContent : {}", messageContent);
        if (messageContent.getId() == null) {
            return createMessageContent(messageContent);
        }
        MessageContent result = messageContentService.save(messageContent);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(ENTITY_NAME, messageContent.getId()))
            .body(result);
    }

    /**
     * GET  /message-contents : get all the messageContents.
     *
     * @param pageable the pagination information
     * @return the ResponseEntity with status 200 (OK) and the list of messageContents in body
     */
    @GetMapping("/message-contents")
    @Timed
    public ResponseEntity<List<MessageContent>> getAllMessageContents(@ApiParam Pageable pageable) {
        log.debug("REST request to get a page of MessageContents");
        Page<MessageContent> page = messageContentService.findAll(pageable);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(page, "/api/message-contents");
        return new ResponseEntity<>(page.getContent(), headers, HttpStatus.OK);
    }

    /**
     * GET  /message-contents/:id : get the "id" messageContent.
     *
     * @param id the id of the messageContent to retrieve
     * @return the ResponseEntity with status 200 (OK) and with body the messageContent, or with status 404 (Not Found)
     */
    @GetMapping("/message-contents/{id}")
    @Timed
    public ResponseEntity<MessageContent> getMessageContent(@PathVariable String id) {
        log.debug("REST request to get MessageContent : {}", id);
        MessageContent messageContent = messageContentService.findOne(id);
        return ResponseUtil.wrapOrNotFound(Optional.ofNullable(messageContent));
    }

    /**
     * DELETE  /message-contents/:id : delete the "id" messageContent.
     *
     * @param id the id of the messageContent to delete
     * @return the ResponseEntity with status 200 (OK)
     */
    @DeleteMapping("/message-contents/{id}")
    @Timed
    public ResponseEntity<Void> deleteMessageContent(@PathVariable String id) {
        log.debug("REST request to delete MessageContent : {}", id);
        messageContentService.delete(id);
        return ResponseEntity.ok().headers(HeaderUtil.createEntityDeletionAlert(ENTITY_NAME, id)).build();
    }

    @GetMapping("/message-contents/{frontEnd}/{product}")
    @Timed
    public ResponseEntity<List<String>> getMessageContentByFrontEndAndProduct(@PathVariable String frontEnd, @PathVariable Product product) {
        log.debug("REST request to get MessageContent : {}" + frontEnd + " " + product);
        return ResponseUtil.wrapOrNotFound(Optional.ofNullable(messageContentService.findByFrontEndAndProduct(frontEnd, product)));
    }
}
