package com.gvc.crmadmin.web.rest;

import com.gvc.crmadmin.CrmAdminApp;

import com.gvc.crmadmin.domain.FeProduct;
import com.gvc.crmadmin.repository.FeProductRepository;
import com.gvc.crmadmin.service.FeProductService;
import com.gvc.crmadmin.web.rest.errors.ExceptionTranslator;

import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.MockitoAnnotations;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.data.web.PageableHandlerMethodArgumentResolver;
import org.springframework.http.MediaType;
import org.springframework.http.converter.json.MappingJackson2HttpMessageConverter;
import org.springframework.test.context.junit4.SpringRunner;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.gvc.crmadmin.domain.enumeration.Product;
/**
 * Test class for the FeProductResource REST controller.
 *
 * @see FeProductResource
 */
@RunWith(SpringRunner.class)
@SpringBootTest(classes = CrmAdminApp.class)
public class FeProductResourceIntTest {

    private static final String DEFAULT_FRONT_END = "AA";
    private static final String UPDATED_FRONT_END = "BB";

    private static final Product DEFAULT_PRODUCT = Product.CASINO;
    private static final Product UPDATED_PRODUCT = Product.POKER;

    @Autowired
    private FeProductRepository feProductRepository;

    @Autowired
    private FeProductService feProductService;

    @Autowired
    private MappingJackson2HttpMessageConverter jacksonMessageConverter;

    @Autowired
    private PageableHandlerMethodArgumentResolver pageableArgumentResolver;

    @Autowired
    private ExceptionTranslator exceptionTranslator;

    private MockMvc restFeProductMockMvc;

    private FeProduct feProduct;

    @Before
    public void setup() {
        MockitoAnnotations.initMocks(this);
        final FeProductResource feProductResource = new FeProductResource(feProductService);
        this.restFeProductMockMvc = MockMvcBuilders.standaloneSetup(feProductResource)
            .setCustomArgumentResolvers(pageableArgumentResolver)
            .setControllerAdvice(exceptionTranslator)
            .setMessageConverters(jacksonMessageConverter).build();
    }

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static FeProduct createEntity() {
        FeProduct feProduct = new FeProduct()
            .frontEnd(DEFAULT_FRONT_END)
            .product(DEFAULT_PRODUCT);
        return feProduct;
    }

    @Before
    public void initTest() {
        feProductRepository.deleteAll();
        feProduct = createEntity();
    }

    @Test
    public void createFeProduct() throws Exception {
        int databaseSizeBeforeCreate = feProductRepository.findAll().size();

        // Create the FeProduct
        restFeProductMockMvc.perform(post("/api/fe-products")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(feProduct)))
            .andExpect(status().isCreated());

        // Validate the FeProduct in the database
        List<FeProduct> feProductList = feProductRepository.findAll();
        assertThat(feProductList).hasSize(databaseSizeBeforeCreate + 1);
        FeProduct testFeProduct = feProductList.get(feProductList.size() - 1);
        assertThat(testFeProduct.getFrontEnd()).isEqualTo(DEFAULT_FRONT_END);
        assertThat(testFeProduct.getProduct()).isEqualTo(DEFAULT_PRODUCT);
    }

    @Test
    public void createFeProductWithExistingId() throws Exception {
        int databaseSizeBeforeCreate = feProductRepository.findAll().size();

        // Create the FeProduct with an existing ID
        feProduct.setId("existing_id");

        // An entity with an existing ID cannot be created, so this API call must fail
        restFeProductMockMvc.perform(post("/api/fe-products")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(feProduct)))
            .andExpect(status().isBadRequest());

        // Validate the Alice in the database
        List<FeProduct> feProductList = feProductRepository.findAll();
        assertThat(feProductList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    public void checkFrontEndIsRequired() throws Exception {
        int databaseSizeBeforeTest = feProductRepository.findAll().size();
        // set the field null
        feProduct.setFrontEnd(null);

        // Create the FeProduct, which fails.

        restFeProductMockMvc.perform(post("/api/fe-products")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(feProduct)))
            .andExpect(status().isBadRequest());

        List<FeProduct> feProductList = feProductRepository.findAll();
        assertThat(feProductList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    public void checkProductIsRequired() throws Exception {
        int databaseSizeBeforeTest = feProductRepository.findAll().size();
        // set the field null
        feProduct.setProduct(null);

        // Create the FeProduct, which fails.

        restFeProductMockMvc.perform(post("/api/fe-products")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(feProduct)))
            .andExpect(status().isBadRequest());

        List<FeProduct> feProductList = feProductRepository.findAll();
        assertThat(feProductList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    public void getAllFeProducts() throws Exception {
        // Initialize the database
        feProductRepository.save(feProduct);

        // Get all the feProductList
        restFeProductMockMvc.perform(get("/api/fe-products?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(feProduct.getId())))
            .andExpect(jsonPath("$.[*].frontEnd").value(hasItem(DEFAULT_FRONT_END.toString())))
            .andExpect(jsonPath("$.[*].product").value(hasItem(DEFAULT_PRODUCT.toString())));
    }

    @Test
    public void getFeProduct() throws Exception {
        // Initialize the database
        feProductRepository.save(feProduct);

        // Get the feProduct
        restFeProductMockMvc.perform(get("/api/fe-products/{id}", feProduct.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.id").value(feProduct.getId()))
            .andExpect(jsonPath("$.frontEnd").value(DEFAULT_FRONT_END.toString()))
            .andExpect(jsonPath("$.product").value(DEFAULT_PRODUCT.toString()));
    }

    @Test
    public void getNonExistingFeProduct() throws Exception {
        // Get the feProduct
        restFeProductMockMvc.perform(get("/api/fe-products/{id}", Long.MAX_VALUE))
            .andExpect(status().isNotFound());
    }

    @Test
    public void updateFeProduct() throws Exception {
        // Initialize the database
        feProductService.save(feProduct);

        int databaseSizeBeforeUpdate = feProductRepository.findAll().size();

        // Update the feProduct
        FeProduct updatedFeProduct = feProductRepository.findOne(feProduct.getId());
        updatedFeProduct
            .frontEnd(UPDATED_FRONT_END)
            .product(UPDATED_PRODUCT);

        restFeProductMockMvc.perform(put("/api/fe-products")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(updatedFeProduct)))
            .andExpect(status().isOk());

        // Validate the FeProduct in the database
        List<FeProduct> feProductList = feProductRepository.findAll();
        assertThat(feProductList).hasSize(databaseSizeBeforeUpdate);
        FeProduct testFeProduct = feProductList.get(feProductList.size() - 1);
        assertThat(testFeProduct.getFrontEnd()).isEqualTo(UPDATED_FRONT_END);
        assertThat(testFeProduct.getProduct()).isEqualTo(UPDATED_PRODUCT);
    }

    @Test
    public void updateNonExistingFeProduct() throws Exception {
        int databaseSizeBeforeUpdate = feProductRepository.findAll().size();

        // Create the FeProduct

        // If the entity doesn't have an ID, it will be created instead of just being updated
        restFeProductMockMvc.perform(put("/api/fe-products")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(feProduct)))
            .andExpect(status().isCreated());

        // Validate the FeProduct in the database
        List<FeProduct> feProductList = feProductRepository.findAll();
        assertThat(feProductList).hasSize(databaseSizeBeforeUpdate + 1);
    }

    @Test
    public void deleteFeProduct() throws Exception {
        // Initialize the database
        feProductService.save(feProduct);

        int databaseSizeBeforeDelete = feProductRepository.findAll().size();

        // Get the feProduct
        restFeProductMockMvc.perform(delete("/api/fe-products/{id}", feProduct.getId())
            .accept(TestUtil.APPLICATION_JSON_UTF8))
            .andExpect(status().isOk());

        // Validate the database is empty
        List<FeProduct> feProductList = feProductRepository.findAll();
        assertThat(feProductList).hasSize(databaseSizeBeforeDelete - 1);
    }

    @Test
    public void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(FeProduct.class);
        FeProduct feProduct1 = new FeProduct();
        feProduct1.setId("id1");
        FeProduct feProduct2 = new FeProduct();
        feProduct2.setId(feProduct1.getId());
        assertThat(feProduct1).isEqualTo(feProduct2);
        feProduct2.setId("id2");
        assertThat(feProduct1).isNotEqualTo(feProduct2);
        feProduct1.setId(null);
        assertThat(feProduct1).isNotEqualTo(feProduct2);
    }
}
