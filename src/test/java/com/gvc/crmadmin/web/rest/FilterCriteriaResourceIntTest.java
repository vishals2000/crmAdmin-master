package com.gvc.crmadmin.web.rest;

import com.gvc.crmadmin.CrmAdminApp;

import com.gvc.crmadmin.domain.FilterCriteria;
import com.gvc.crmadmin.repository.FilterCriteriaRepository;
import com.gvc.crmadmin.service.FilterCriteriaService;
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
 * Test class for the FilterCriteriaResource REST controller.
 *
 * @see FilterCriteriaResource
 */
@RunWith(SpringRunner.class)
@SpringBootTest(classes = CrmAdminApp.class)
public class FilterCriteriaResourceIntTest {

    private static final String DEFAULT_FRONT_END = "AA";
    private static final String UPDATED_FRONT_END = "BB";

    private static final Product DEFAULT_PRODUCT = Product.CASINO;
    private static final Product UPDATED_PRODUCT = Product.POKER;

    private static final String DEFAULT_FILTER_ITEM = "AAAAAAAAAA";
    private static final String UPDATED_FILTER_ITEM = "BBBBBBBBBB";

    private static final String DEFAULT_FILTER_QUERY = "AAAAAAAAAA";
    private static final String UPDATED_FILTER_QUERY = "BBBBBBBBBB";

    private static final String DEFAULT_FILTER_VALUE = "AAAAAAAAAA";
    private static final String UPDATED_FILTER_VALUE = "BBBBBBBBBB";

    @Autowired
    private FilterCriteriaRepository filterCriteriaRepository;

    @Autowired
    private FilterCriteriaService filterCriteriaService;

    @Autowired
    private MappingJackson2HttpMessageConverter jacksonMessageConverter;

    @Autowired
    private PageableHandlerMethodArgumentResolver pageableArgumentResolver;

    @Autowired
    private ExceptionTranslator exceptionTranslator;

    private MockMvc restFilterCriteriaMockMvc;

    private FilterCriteria filterCriteria;

    @Before
    public void setup() {
        MockitoAnnotations.initMocks(this);
        final FilterCriteriaResource filterCriteriaResource = new FilterCriteriaResource(filterCriteriaService);
        this.restFilterCriteriaMockMvc = MockMvcBuilders.standaloneSetup(filterCriteriaResource)
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
    public static FilterCriteria createEntity() {
        FilterCriteria filterCriteria = new FilterCriteria()
            .frontEnd(DEFAULT_FRONT_END)
            .product(DEFAULT_PRODUCT)
            .filterItem(DEFAULT_FILTER_ITEM)
            .filterQuery(DEFAULT_FILTER_QUERY)
            .filterValue(DEFAULT_FILTER_VALUE);
        return filterCriteria;
    }

    @Before
    public void initTest() {
        filterCriteriaRepository.deleteAll();
        filterCriteria = createEntity();
    }

    @Test
    public void createFilterCriteria() throws Exception {
        int databaseSizeBeforeCreate = filterCriteriaRepository.findAll().size();

        // Create the FilterCriteria
        restFilterCriteriaMockMvc.perform(post("/api/filter-criteria")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(filterCriteria)))
            .andExpect(status().isCreated());

        // Validate the FilterCriteria in the database
        List<FilterCriteria> filterCriteriaList = filterCriteriaRepository.findAll();
        assertThat(filterCriteriaList).hasSize(databaseSizeBeforeCreate + 1);
        FilterCriteria testFilterCriteria = filterCriteriaList.get(filterCriteriaList.size() - 1);
        assertThat(testFilterCriteria.getFrontEnd()).isEqualTo(DEFAULT_FRONT_END);
        assertThat(testFilterCriteria.getProduct()).isEqualTo(DEFAULT_PRODUCT);
        assertThat(testFilterCriteria.getFilterItem()).isEqualTo(DEFAULT_FILTER_ITEM);
        assertThat(testFilterCriteria.getFilterQuery()).isEqualTo(DEFAULT_FILTER_QUERY);
        assertThat(testFilterCriteria.getFilterValue()).isEqualTo(DEFAULT_FILTER_VALUE);
    }

    @Test
    public void createFilterCriteriaWithExistingId() throws Exception {
        int databaseSizeBeforeCreate = filterCriteriaRepository.findAll().size();

        // Create the FilterCriteria with an existing ID
        filterCriteria.setId("existing_id");

        // An entity with an existing ID cannot be created, so this API call must fail
        restFilterCriteriaMockMvc.perform(post("/api/filter-criteria")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(filterCriteria)))
            .andExpect(status().isBadRequest());

        // Validate the Alice in the database
        List<FilterCriteria> filterCriteriaList = filterCriteriaRepository.findAll();
        assertThat(filterCriteriaList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    public void checkFrontEndIsRequired() throws Exception {
        int databaseSizeBeforeTest = filterCriteriaRepository.findAll().size();
        // set the field null
        filterCriteria.setFrontEnd(null);

        // Create the FilterCriteria, which fails.

        restFilterCriteriaMockMvc.perform(post("/api/filter-criteria")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(filterCriteria)))
            .andExpect(status().isBadRequest());

        List<FilterCriteria> filterCriteriaList = filterCriteriaRepository.findAll();
        assertThat(filterCriteriaList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    public void checkProductIsRequired() throws Exception {
        int databaseSizeBeforeTest = filterCriteriaRepository.findAll().size();
        // set the field null
        filterCriteria.setProduct(null);

        // Create the FilterCriteria, which fails.

        restFilterCriteriaMockMvc.perform(post("/api/filter-criteria")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(filterCriteria)))
            .andExpect(status().isBadRequest());

        List<FilterCriteria> filterCriteriaList = filterCriteriaRepository.findAll();
        assertThat(filterCriteriaList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    public void checkFilterItemIsRequired() throws Exception {
        int databaseSizeBeforeTest = filterCriteriaRepository.findAll().size();
        // set the field null
        filterCriteria.setFilterItem(null);

        // Create the FilterCriteria, which fails.

        restFilterCriteriaMockMvc.perform(post("/api/filter-criteria")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(filterCriteria)))
            .andExpect(status().isBadRequest());

        List<FilterCriteria> filterCriteriaList = filterCriteriaRepository.findAll();
        assertThat(filterCriteriaList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    public void checkFilterQueryIsRequired() throws Exception {
        int databaseSizeBeforeTest = filterCriteriaRepository.findAll().size();
        // set the field null
        filterCriteria.setFilterQuery(null);

        // Create the FilterCriteria, which fails.

        restFilterCriteriaMockMvc.perform(post("/api/filter-criteria")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(filterCriteria)))
            .andExpect(status().isBadRequest());

        List<FilterCriteria> filterCriteriaList = filterCriteriaRepository.findAll();
        assertThat(filterCriteriaList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    public void checkFilterValueIsRequired() throws Exception {
        int databaseSizeBeforeTest = filterCriteriaRepository.findAll().size();
        // set the field null
        filterCriteria.setFilterValue(null);

        // Create the FilterCriteria, which fails.

        restFilterCriteriaMockMvc.perform(post("/api/filter-criteria")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(filterCriteria)))
            .andExpect(status().isBadRequest());

        List<FilterCriteria> filterCriteriaList = filterCriteriaRepository.findAll();
        assertThat(filterCriteriaList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    public void getAllFilterCriteria() throws Exception {
        // Initialize the database
        filterCriteriaRepository.save(filterCriteria);

        // Get all the filterCriteriaList
        restFilterCriteriaMockMvc.perform(get("/api/filter-criteria?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(filterCriteria.getId())))
            .andExpect(jsonPath("$.[*].frontEnd").value(hasItem(DEFAULT_FRONT_END.toString())))
            .andExpect(jsonPath("$.[*].product").value(hasItem(DEFAULT_PRODUCT.toString())))
            .andExpect(jsonPath("$.[*].filterItem").value(hasItem(DEFAULT_FILTER_ITEM.toString())))
            .andExpect(jsonPath("$.[*].filterQuery").value(hasItem(DEFAULT_FILTER_QUERY.toString())))
            .andExpect(jsonPath("$.[*].filterValue").value(hasItem(DEFAULT_FILTER_VALUE.toString())));
    }

    @Test
    public void getFilterCriteria() throws Exception {
        // Initialize the database
        filterCriteriaRepository.save(filterCriteria);

        // Get the filterCriteria
        restFilterCriteriaMockMvc.perform(get("/api/filter-criteria/{id}", filterCriteria.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.id").value(filterCriteria.getId()))
            .andExpect(jsonPath("$.frontEnd").value(DEFAULT_FRONT_END.toString()))
            .andExpect(jsonPath("$.product").value(DEFAULT_PRODUCT.toString()))
            .andExpect(jsonPath("$.filterItem").value(DEFAULT_FILTER_ITEM.toString()))
            .andExpect(jsonPath("$.filterQuery").value(DEFAULT_FILTER_QUERY.toString()))
            .andExpect(jsonPath("$.filterValue").value(DEFAULT_FILTER_VALUE.toString()));
    }

    @Test
    public void getNonExistingFilterCriteria() throws Exception {
        // Get the filterCriteria
        restFilterCriteriaMockMvc.perform(get("/api/filter-criteria/{id}", Long.MAX_VALUE))
            .andExpect(status().isNotFound());
    }

    @Test
    public void updateFilterCriteria() throws Exception {
        // Initialize the database
        filterCriteriaService.save(filterCriteria);

        int databaseSizeBeforeUpdate = filterCriteriaRepository.findAll().size();

        // Update the filterCriteria
        FilterCriteria updatedFilterCriteria = filterCriteriaRepository.findOne(filterCriteria.getId());
        updatedFilterCriteria
            .frontEnd(UPDATED_FRONT_END)
            .product(UPDATED_PRODUCT)
            .filterItem(UPDATED_FILTER_ITEM)
            .filterQuery(UPDATED_FILTER_QUERY)
            .filterValue(UPDATED_FILTER_VALUE);

        restFilterCriteriaMockMvc.perform(put("/api/filter-criteria")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(updatedFilterCriteria)))
            .andExpect(status().isOk());

        // Validate the FilterCriteria in the database
        List<FilterCriteria> filterCriteriaList = filterCriteriaRepository.findAll();
        assertThat(filterCriteriaList).hasSize(databaseSizeBeforeUpdate);
        FilterCriteria testFilterCriteria = filterCriteriaList.get(filterCriteriaList.size() - 1);
        assertThat(testFilterCriteria.getFrontEnd()).isEqualTo(UPDATED_FRONT_END);
        assertThat(testFilterCriteria.getProduct()).isEqualTo(UPDATED_PRODUCT);
        assertThat(testFilterCriteria.getFilterItem()).isEqualTo(UPDATED_FILTER_ITEM);
        assertThat(testFilterCriteria.getFilterQuery()).isEqualTo(UPDATED_FILTER_QUERY);
        assertThat(testFilterCriteria.getFilterValue()).isEqualTo(UPDATED_FILTER_VALUE);
    }

    @Test
    public void updateNonExistingFilterCriteria() throws Exception {
        int databaseSizeBeforeUpdate = filterCriteriaRepository.findAll().size();

        // Create the FilterCriteria

        // If the entity doesn't have an ID, it will be created instead of just being updated
        restFilterCriteriaMockMvc.perform(put("/api/filter-criteria")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(filterCriteria)))
            .andExpect(status().isCreated());

        // Validate the FilterCriteria in the database
        List<FilterCriteria> filterCriteriaList = filterCriteriaRepository.findAll();
        assertThat(filterCriteriaList).hasSize(databaseSizeBeforeUpdate + 1);
    }

    @Test
    public void deleteFilterCriteria() throws Exception {
        // Initialize the database
        filterCriteriaService.save(filterCriteria);

        int databaseSizeBeforeDelete = filterCriteriaRepository.findAll().size();

        // Get the filterCriteria
        restFilterCriteriaMockMvc.perform(delete("/api/filter-criteria/{id}", filterCriteria.getId())
            .accept(TestUtil.APPLICATION_JSON_UTF8))
            .andExpect(status().isOk());

        // Validate the database is empty
        List<FilterCriteria> filterCriteriaList = filterCriteriaRepository.findAll();
        assertThat(filterCriteriaList).hasSize(databaseSizeBeforeDelete - 1);
    }

    @Test
    public void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(FilterCriteria.class);
        FilterCriteria filterCriteria1 = new FilterCriteria();
        filterCriteria1.setId("id1");
        FilterCriteria filterCriteria2 = new FilterCriteria();
        filterCriteria2.setId(filterCriteria1.getId());
        assertThat(filterCriteria1).isEqualTo(filterCriteria2);
        filterCriteria2.setId("id2");
        assertThat(filterCriteria1).isNotEqualTo(filterCriteria2);
        filterCriteria1.setId(null);
        assertThat(filterCriteria1).isNotEqualTo(filterCriteria2);
    }
}
