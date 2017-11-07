package com.gvc.crmadmin.web.rest;

import com.codahale.metrics.annotation.Timed;
import com.gvc.crmadmin.domain.Apps;
import com.gvc.crmadmin.service.AppsService;
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
 * REST controller for managing Apps.
 */
@RestController
@RequestMapping("/api")
public class AppsResource {

    private final Logger log = LoggerFactory.getLogger(AppsResource.class);

    private static final String ENTITY_NAME = "apps";

    private final AppsService appsService;

    public AppsResource(AppsService appsService) {
        this.appsService = appsService;
    }

    /**
     * POST  /apps : Create a new apps.
     *
     * @param apps the apps to create
     * @return the ResponseEntity with status 201 (Created) and with body the new apps, or with status 400 (Bad Request) if the apps has already an ID
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PostMapping("/apps")
    @Timed
    public ResponseEntity<Apps> createApps(@Valid @RequestBody Apps apps) throws URISyntaxException, UnsupportedEncodingException {
        log.debug("REST request to save Apps : {}", apps);
        /*if (apps.getId() != null) {
            return ResponseEntity.badRequest().headers(HeaderUtil.createFailureAlert(ENTITY_NAME, "idexists", "A new apps cannot already have an ID")).body(null);
        }*/

        Apps result;
        Apps appFromDB = appsService.findOne(apps.getId());
        if(appFromDB == null){
            result = appsService.save(apps);
        } else{
            return ResponseEntity.badRequest()
                .headers(HeaderUtil.createFailureAlert(ENTITY_NAME, appFromDB.getId(), "App with the given frontEnd and product exists"))
                .body(appFromDB);
        }
        return ResponseEntity.created(new URI(URLEncoder.encode("/api/apps/" + result.getId(), "UTF-8")))
            .headers(HeaderUtil.createEntityCreationAlert(ENTITY_NAME, result.getId()))
            .body(result);
    }

    /**
     * PUT  /apps : Updates an existing apps.
     *
     * @param apps the apps to update
     * @return the ResponseEntity with status 200 (OK) and with body the updated apps,
     * or with status 400 (Bad Request) if the apps is not valid,
     * or with status 500 (Internal Server Error) if the apps couldn't be updated
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PutMapping("/apps")
    @Timed
    public ResponseEntity<Apps> updateApps(@Valid @RequestBody Apps apps) throws URISyntaxException, UnsupportedEncodingException {
        log.debug("REST request to update Apps : {}", apps);
        if (apps.getId() == null) {
            return createApps(apps);
        }
        Apps result = appsService.save(apps);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(ENTITY_NAME, apps.getId().toString()))
            .body(result);
    }

    /**
     * GET  /apps : get all the apps.
     *
     * @param pageable the pagination information
     * @return the ResponseEntity with status 200 (OK) and the list of apps in body
     */
    @GetMapping("/apps")
    @Timed
    public ResponseEntity<List<Apps>> getAllApps(@ApiParam Pageable pageable) {
        log.debug("REST request to get a page of Apps");
        Page<Apps> page = appsService.findAll(pageable);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(page, "/api/apps");
        return new ResponseEntity<>(page.getContent(), headers, HttpStatus.OK);
    }

    /**
     * GET  /apps/:id : get the "id" apps.
     *
     * @param id the id of the apps to retrieve
     * @return the ResponseEntity with status 200 (OK) and with body the apps, or with status 404 (Not Found)
     */
    @GetMapping("/apps/{id}")
    @Timed
    public ResponseEntity<Apps> getApps(@PathVariable String id) {
        log.debug("REST request to get Apps : {}", id);
        Apps apps = appsService.findOne(id);
        return ResponseUtil.wrapOrNotFound(Optional.ofNullable(apps));
    }

    /**
     * DELETE  /apps/:id : delete the "id" apps.
     *
     * @param id the id of the apps to delete
     * @return the ResponseEntity with status 200 (OK)
     */
    @DeleteMapping("/apps/{id}")
    @Timed
    public ResponseEntity<Void> deleteApps(@PathVariable String id) {
        log.debug("REST request to delete Apps : {}", id);
        appsService.delete(id);
        return ResponseEntity.ok().headers(HeaderUtil.createEntityDeletionAlert(ENTITY_NAME, id)).build();
    }
}
