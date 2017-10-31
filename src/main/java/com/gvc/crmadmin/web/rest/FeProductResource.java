package com.gvc.crmadmin.web.rest;

import com.codahale.metrics.annotation.Timed;
import com.gvc.crmadmin.domain.FeProduct;
import com.gvc.crmadmin.service.FeProductService;
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
 * REST controller for managing FeProduct.
 */
@RestController
@RequestMapping("/api")
public class FeProductResource {

    private final Logger log = LoggerFactory.getLogger(FeProductResource.class);

    private static final String ENTITY_NAME = "feProduct";

    private final FeProductService feProductService;

    public FeProductResource(FeProductService feProductService) {
        this.feProductService = feProductService;
    }

    /**
     * POST  /fe-products : Create a new feProduct.
     *
     * @param feProduct the feProduct to create
     * @return the ResponseEntity with status 201 (Created) and with body the new feProduct, or with status 400 (Bad Request) if the feProduct has already an ID
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PostMapping("/fe-products")
    @Timed
    public ResponseEntity<FeProduct> createFeProduct(@Valid @RequestBody FeProduct feProduct) throws URISyntaxException, UnsupportedEncodingException {
        log.debug("REST request to save FeProduct : {}", feProduct);
        /*if (feProduct.getId() != null) {
            return ResponseEntity.badRequest().headers(HeaderUtil.createFailureAlert(ENTITY_NAME, "idexists", "A new feProduct cannot already have an ID")).body(null);
        }*/
        FeProduct result;
        FeProduct feProductFromDB = feProductService.findOne(feProduct.getId());
        if(feProductFromDB == null){
            result = feProductService.save(feProduct);
        } else{
            return ResponseEntity.badRequest()
                .headers(HeaderUtil.createFailureAlert(ENTITY_NAME, feProductFromDB.getId(), "FrontEnd, Product combination already exists"))
                .body(feProductFromDB);
        }
        return ResponseEntity.created(new URI(URLEncoder.encode("/api/fe-products/" + result.getId(), "UTF-8")))
            .headers(HeaderUtil.createEntityCreationAlert(ENTITY_NAME, result.getId()))
            .body(result);
    }

    /**
     * PUT  /fe-products : Updates an existing feProduct.
     *
     * @param feProduct the feProduct to update
     * @return the ResponseEntity with status 200 (OK) and with body the updated feProduct,
     * or with status 400 (Bad Request) if the feProduct is not valid,
     * or with status 500 (Internal Server Error) if the feProduct couldn't be updated
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PutMapping("/fe-products")
    @Timed
    public ResponseEntity<FeProduct> updateFeProduct(@Valid @RequestBody FeProduct feProduct) throws URISyntaxException, UnsupportedEncodingException {
        log.debug("REST request to update FeProduct : {}", feProduct);
        if (feProduct.getId() == null) {
            return createFeProduct(feProduct);
        }
        FeProduct result = feProductService.save(feProduct);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(ENTITY_NAME, feProduct.getId()))
            .body(result);
    }

    /**
     * GET  /fe-products : get all the feProducts.
     *
     * @param pageable the pagination information
     * @return the ResponseEntity with status 200 (OK) and the list of feProducts in body
     */
    @GetMapping("/fe-products")
    @Timed
    public ResponseEntity<List<FeProduct>> getAllFeProducts(@ApiParam Pageable pageable) {
        log.debug("REST request to get a page of FeProducts");
        Page<FeProduct> page = feProductService.findAll(pageable);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(page, "/api/fe-products");
        return new ResponseEntity<>(page.getContent(), headers, HttpStatus.OK);
    }

    @GetMapping("/fe-products-distinctFe")
    @Timed
    public ResponseEntity<List<String>> getDistinctFe() {
        log.debug("REST request to get a list of distinct frontEnds");
        return ResponseUtil.wrapOrNotFound(Optional.ofNullable(feProductService.findDistinctFe()));
    }

    @GetMapping("/productsForFrontEnd/{frontEnd}")
    @Timed
    public ResponseEntity<List<FeProduct>> getProductsForFrontEnd(@PathVariable String frontEnd) {
        log.debug("REST request to get a list of productsForGivenFrontEnd");
        return ResponseUtil.wrapOrNotFound(Optional.ofNullable(feProductService.findProductsForFrontEnd(frontEnd)));
    }

    /**
     * GET  /fe-products/:id : get the "id" feProduct.
     *
     * @param id the id of the feProduct to retrieve
     * @return the ResponseEntity with status 200 (OK) and with body the feProduct, or with status 404 (Not Found)
     */
    @GetMapping("/fe-products/{id}")
    @Timed
    public ResponseEntity<FeProduct> getFeProduct(@PathVariable String id) {
        log.debug("REST request to get FeProduct : {}", id);
        FeProduct feProduct = feProductService.findOne(id);
        return ResponseUtil.wrapOrNotFound(Optional.ofNullable(feProduct));
    }

    /**
     * DELETE  /fe-products/:id : delete the "id" feProduct.
     *
     * @param id the id of the feProduct to delete
     * @return the ResponseEntity with status 200 (OK)
     */
    @DeleteMapping("/fe-products/{id}")
    @Timed
    public ResponseEntity<Void> deleteFeProduct(@PathVariable String id) {
        log.debug("REST request to delete FeProduct : {}", id);
        feProductService.delete(id);
        return ResponseEntity.ok().headers(HeaderUtil.createEntityDeletionAlert(ENTITY_NAME, id)).build();
    }
}
