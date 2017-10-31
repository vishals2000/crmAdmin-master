package com.gvc.crmadmin.web.rest;

import com.gvc.crmadmin.CrmAdminApp;
import com.gvc.crmadmin.domain.TargetGroupCriteria;
import com.gvc.crmadmin.domain.enumeration.Product;
import com.gvc.crmadmin.repository.TargetGroupCriteriaRepository;
import com.gvc.crmadmin.service.TargetGroupCriteriaService;
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
/**
 * Test class for the TargetGroupCriteriaResource REST controller.
 *
 * @see TargetGroupCriteriaResource
 */
@RunWith(SpringRunner.class)
@SpringBootTest(classes = CrmAdminApp.class)
public class TargetGroupCriteriaResourceIntTest {

    private static final String DEFAULT_FRONT_END = "AA";
    private static final String UPDATED_FRONT_END = "BB";

    private static final String DEFAULT_PRODUCT = Product.CASINO.name();
    private static final String UPDATED_PRODUCT = Product.POKER.name();

    private static final String DEFAULT_NAME = "AAAAAAAAAA";
    private static final String UPDATED_NAME = "BBBBBBBBBB";

    private static final String DEFAULT_FILTER_OPTION = "AAAAAAAAAA";
    private static final String UPDATED_FILTER_OPTION = "BBBBBBBBBB";

    private static final String DEFAULT_FILTER_OPTION_LOOK_UP = "AAAAAAAAAA";
    private static final String UPDATED_FILTER_OPTION_LOOK_UP = "BBBBBBBBBB";

    private static final String DEFAULT_FILTER_OPTION_COMPARISON = "AAAAAAAAAA";
    private static final String UPDATED_FILTER_OPTION_COMPARISON = "BBBBBBBBBB";

    private static final String DEFAULT_FILTER_OPTION_VALUE = "AAAAAAAAAA";
    private static final String UPDATED_FILTER_OPTION_VALUE = "BBBBBBBBBB";

    @Autowired
    private TargetGroupCriteriaRepository targetGroupCriteriaRepository;

    @Autowired
    private TargetGroupCriteriaService targetGroupCriteriaService;

    @Autowired
    private MappingJackson2HttpMessageConverter jacksonMessageConverter;

    @Autowired
    private PageableHandlerMethodArgumentResolver pageableArgumentResolver;

    @Autowired
    private ExceptionTranslator exceptionTranslator;

    private MockMvc restTargetGroupCriteriaMockMvc;

    private TargetGroupCriteria targetGroupCriteria;

    @Before
    public void setup() {
        MockitoAnnotations.initMocks(this);
        final TargetGroupCriteriaResource targetGroupCriteriaResource = new TargetGroupCriteriaResource(targetGroupCriteriaService);
        this.restTargetGroupCriteriaMockMvc = MockMvcBuilders.standaloneSetup(targetGroupCriteriaResource)
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
    public static TargetGroupCriteria createEntity() {
        TargetGroupCriteria targetGroupCriteria = new TargetGroupCriteria()
            .frontEnd(DEFAULT_FRONT_END)
            .product(DEFAULT_PRODUCT)
            .name(DEFAULT_NAME);
        return targetGroupCriteria;
    }

    @Before
    public void initTest() {
        targetGroupCriteriaRepository.deleteAll();
        targetGroupCriteria = createEntity();
    }

    @Test
    public void createTargetGroupCriteria() throws Exception {
        int databaseSizeBeforeCreate = targetGroupCriteriaRepository.findAll().size();

        // Create the TargetGroupCriteria
        restTargetGroupCriteriaMockMvc.perform(post("/api/target-group-criteria")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(targetGroupCriteria)))
            .andExpect(status().isCreated());

        // Validate the TargetGroupCriteria in the database
        List<TargetGroupCriteria> targetGroupCriteriaList = targetGroupCriteriaRepository.findAll();
        assertThat(targetGroupCriteriaList).hasSize(databaseSizeBeforeCreate + 1);
        TargetGroupCriteria testTargetGroupCriteria = targetGroupCriteriaList.get(targetGroupCriteriaList.size() - 1);
        assertThat(testTargetGroupCriteria.getFrontEnd()).isEqualTo(DEFAULT_FRONT_END);
        assertThat(testTargetGroupCriteria.getProduct()).isEqualTo(DEFAULT_PRODUCT);
        assertThat(testTargetGroupCriteria.getName()).isEqualTo(DEFAULT_NAME);
    }

    @Test
    public void createTargetGroupCriteriaWithExistingId() throws Exception {
        int databaseSizeBeforeCreate = targetGroupCriteriaRepository.findAll().size();

        // Create the TargetGroupCriteria with an existing ID
        targetGroupCriteria.setId("existing_id");

        // An entity with an existing ID cannot be created, so this API call must fail
        restTargetGroupCriteriaMockMvc.perform(post("/api/target-group-criteria")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(targetGroupCriteria)))
            .andExpect(status().isBadRequest());

        // Validate the Alice in the database
        List<TargetGroupCriteria> targetGroupCriteriaList = targetGroupCriteriaRepository.findAll();
        assertThat(targetGroupCriteriaList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    public void checkFrontEndIsRequired() throws Exception {
        int databaseSizeBeforeTest = targetGroupCriteriaRepository.findAll().size();
        // set the field null
        targetGroupCriteria.setFrontEnd(null);

        // Create the TargetGroupCriteria, which fails.

        restTargetGroupCriteriaMockMvc.perform(post("/api/target-group-criteria")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(targetGroupCriteria)))
            .andExpect(status().isBadRequest());

        List<TargetGroupCriteria> targetGroupCriteriaList = targetGroupCriteriaRepository.findAll();
        assertThat(targetGroupCriteriaList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    public void checkProductIsRequired() throws Exception {
        int databaseSizeBeforeTest = targetGroupCriteriaRepository.findAll().size();
        // set the field null
        targetGroupCriteria.setProduct(null);

        // Create the TargetGroupCriteria, which fails.

        restTargetGroupCriteriaMockMvc.perform(post("/api/target-group-criteria")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(targetGroupCriteria)))
            .andExpect(status().isBadRequest());

        List<TargetGroupCriteria> targetGroupCriteriaList = targetGroupCriteriaRepository.findAll();
        assertThat(targetGroupCriteriaList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    public void checkNameIsRequired() throws Exception {
        int databaseSizeBeforeTest = targetGroupCriteriaRepository.findAll().size();
        // set the field null
        targetGroupCriteria.setName(null);

        // Create the TargetGroupCriteria, which fails.

        restTargetGroupCriteriaMockMvc.perform(post("/api/target-group-criteria")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(targetGroupCriteria)))
            .andExpect(status().isBadRequest());

        List<TargetGroupCriteria> targetGroupCriteriaList = targetGroupCriteriaRepository.findAll();
        assertThat(targetGroupCriteriaList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    public void getAllTargetGroupCriteria() throws Exception {
        // Initialize the database
        targetGroupCriteriaRepository.save(targetGroupCriteria);

        // Get all the targetGroupCriteriaList
        restTargetGroupCriteriaMockMvc.perform(get("/api/target-group-criteria?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(targetGroupCriteria.getId())))
            .andExpect(jsonPath("$.[*].frontEnd").value(hasItem(DEFAULT_FRONT_END)))
            .andExpect(jsonPath("$.[*].product").value(hasItem(DEFAULT_PRODUCT)))
            .andExpect(jsonPath("$.[*].name").value(hasItem(DEFAULT_NAME)))
            .andExpect(jsonPath("$.[*].filterOption").value(hasItem(DEFAULT_FILTER_OPTION)))
            .andExpect(jsonPath("$.[*].filterOptionLookUp").value(hasItem(DEFAULT_FILTER_OPTION_LOOK_UP)))
            .andExpect(jsonPath("$.[*].filterOptionComparison").value(hasItem(DEFAULT_FILTER_OPTION_COMPARISON)))
            .andExpect(jsonPath("$.[*].filterOptionValue").value(hasItem(DEFAULT_FILTER_OPTION_VALUE)));
    }

    @Test
    public void getTargetGroupCriteria() throws Exception {
        // Initialize the database
        targetGroupCriteriaRepository.save(targetGroupCriteria);

        // Get the targetGroupCriteria
        restTargetGroupCriteriaMockMvc.perform(get("/api/target-group-criteria/{id}", targetGroupCriteria.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.id").value(targetGroupCriteria.getId()))
            .andExpect(jsonPath("$.frontEnd").value(DEFAULT_FRONT_END.toString()))
            .andExpect(jsonPath("$.product").value(DEFAULT_PRODUCT.toString()))
            .andExpect(jsonPath("$.name").value(DEFAULT_NAME.toString()))
            .andExpect(jsonPath("$.filterOption").value(DEFAULT_FILTER_OPTION.toString()))
            .andExpect(jsonPath("$.filterOptionLookUp").value(DEFAULT_FILTER_OPTION_LOOK_UP.toString()))
            .andExpect(jsonPath("$.filterOptionComparison").value(DEFAULT_FILTER_OPTION_COMPARISON.toString()))
            .andExpect(jsonPath("$.filterOptionValue").value(DEFAULT_FILTER_OPTION_VALUE.toString()));
    }

    @Test
    public void getNonExistingTargetGroupCriteria() throws Exception {
        // Get the targetGroupCriteria
        restTargetGroupCriteriaMockMvc.perform(get("/api/target-group-criteria/{id}", Long.MAX_VALUE))
            .andExpect(status().isNotFound());
    }

    @Test
    public void updateTargetGroupCriteria() throws Exception {
        // Initialize the database
        targetGroupCriteriaService.save(targetGroupCriteria);

        int databaseSizeBeforeUpdate = targetGroupCriteriaRepository.findAll().size();

        // Update the targetGroupCriteria
        TargetGroupCriteria updatedTargetGroupCriteria = targetGroupCriteriaRepository.findOne(targetGroupCriteria.getId());
        updatedTargetGroupCriteria
            .frontEnd(UPDATED_FRONT_END)
            .product(UPDATED_PRODUCT)
            .name(UPDATED_NAME);

        restTargetGroupCriteriaMockMvc.perform(put("/api/target-group-criteria")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(updatedTargetGroupCriteria)))
            .andExpect(status().isOk());

        // Validate the TargetGroupCriteria in the database
        List<TargetGroupCriteria> targetGroupCriteriaList = targetGroupCriteriaRepository.findAll();
        assertThat(targetGroupCriteriaList).hasSize(databaseSizeBeforeUpdate);
        TargetGroupCriteria testTargetGroupCriteria = targetGroupCriteriaList.get(targetGroupCriteriaList.size() - 1);
        assertThat(testTargetGroupCriteria.getFrontEnd()).isEqualTo(UPDATED_FRONT_END);
        assertThat(testTargetGroupCriteria.getProduct()).isEqualTo(UPDATED_PRODUCT);
        assertThat(testTargetGroupCriteria.getName()).isEqualTo(UPDATED_NAME);
    }

    @Test
    public void updateNonExistingTargetGroupCriteria() throws Exception {
        int databaseSizeBeforeUpdate = targetGroupCriteriaRepository.findAll().size();

        // Create the TargetGroupCriteria

        // If the entity doesn't have an ID, it will be created instead of just being updated
        restTargetGroupCriteriaMockMvc.perform(put("/api/target-group-criteria")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(targetGroupCriteria)))
            .andExpect(status().isCreated());

        // Validate the TargetGroupCriteria in the database
        List<TargetGroupCriteria> targetGroupCriteriaList = targetGroupCriteriaRepository.findAll();
        assertThat(targetGroupCriteriaList).hasSize(databaseSizeBeforeUpdate + 1);
    }

    @Test
    public void deleteTargetGroupCriteria() throws Exception {
        // Initialize the database
        targetGroupCriteriaService.save(targetGroupCriteria);

        int databaseSizeBeforeDelete = targetGroupCriteriaRepository.findAll().size();

        // Get the targetGroupCriteria
        restTargetGroupCriteriaMockMvc.perform(delete("/api/target-group-criteria/{id}", targetGroupCriteria.getId())
            .accept(TestUtil.APPLICATION_JSON_UTF8))
            .andExpect(status().isOk());

        // Validate the database is empty
        List<TargetGroupCriteria> targetGroupCriteriaList = targetGroupCriteriaRepository.findAll();
        assertThat(targetGroupCriteriaList).hasSize(databaseSizeBeforeDelete - 1);
    }

    @Test
    public void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(TargetGroupCriteria.class);
        TargetGroupCriteria targetGroupCriteria1 = new TargetGroupCriteria();
        targetGroupCriteria1.setId("id1");
        TargetGroupCriteria targetGroupCriteria2 = new TargetGroupCriteria();
        targetGroupCriteria2.setId(targetGroupCriteria1.getId());
        assertThat(targetGroupCriteria1).isEqualTo(targetGroupCriteria2);
        targetGroupCriteria2.setId("id2");
        assertThat(targetGroupCriteria1).isNotEqualTo(targetGroupCriteria2);
        targetGroupCriteria1.setId(null);
        assertThat(targetGroupCriteria1).isNotEqualTo(targetGroupCriteria2);
    }
}
