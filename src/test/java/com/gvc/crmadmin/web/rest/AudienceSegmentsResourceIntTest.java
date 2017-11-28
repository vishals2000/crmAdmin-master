package com.gvc.crmadmin.web.rest;

import com.gvc.crmadmin.CrmAdminApp;

import com.gvc.crmadmin.domain.AudienceSegments;
import com.gvc.crmadmin.repository.AudienceSegmentsRepository;
import com.gvc.crmadmin.service.AudienceSegmentsService;
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
 * Test class for the AudienceSegmentsResource REST controller.
 *
 * @see AudienceSegmentsResource
 */
@RunWith(SpringRunner.class)
@SpringBootTest(classes = CrmAdminApp.class)
public class AudienceSegmentsResourceIntTest {

    private static final String DEFAULT_NAME = "AAAAAAAAAA";
    private static final String UPDATED_NAME = "BBBBBBBBBB";

    private static final String DEFAULT_TYPE = "AAAAAAAAAA";
    private static final String UPDATED_TYPE = "BBBBBBBBBB";

    private static final String DEFAULT_ESTIMATE = "AAAAAAAAAA";
    private static final String UPDATED_ESTIMATE = "BBBBBBBBBB";

    private static final String DEFAULT_LAST_ESTIMATED_AT = "AAAAAAAAAA";
    private static final String UPDATED_LAST_ESTIMATED_AT = "BBBBBBBBBB";

    private static final String DEFAULT_MODIFIED_AT = "AAAAAAAAAA";
    private static final String UPDATED_MODIFIED_AT = "BBBBBBBBBB";

    private static final String DEFAULT_CREATED_AT = "AAAAAAAAAA";
    private static final String UPDATED_CREATED_AT = "BBBBBBBBBB";

    private static final String DEFAULT_FRONT_END = "AAAAAAAAAA";
    private static final String UPDATED_FRONT_END = "BBBBBBBBBB";

    private static final String DEFAULT_PRODUCT = "AAAAAAAAAA";
    private static final String UPDATED_PRODUCT = "BBBBBBBBBB";

    @Autowired
    private AudienceSegmentsRepository audienceSegmentsRepository;

    @Autowired
    private AudienceSegmentsService audienceSegmentsService;

    @Autowired
    private MappingJackson2HttpMessageConverter jacksonMessageConverter;

    @Autowired
    private PageableHandlerMethodArgumentResolver pageableArgumentResolver;

    @Autowired
    private ExceptionTranslator exceptionTranslator;

    private MockMvc restAudienceSegmentsMockMvc;

    private AudienceSegments audienceSegments;

    @Before
    public void setup() {
        MockitoAnnotations.initMocks(this);
        final AudienceSegmentsResource audienceSegmentsResource = new AudienceSegmentsResource(audienceSegmentsService);
        this.restAudienceSegmentsMockMvc = MockMvcBuilders.standaloneSetup(audienceSegmentsResource)
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
    public static AudienceSegments createEntity() {
        AudienceSegments audienceSegments = new AudienceSegments()
            .name(DEFAULT_NAME)
            .type(DEFAULT_TYPE)
            .estimate(DEFAULT_ESTIMATE)
            .lastEstimatedAt(DEFAULT_LAST_ESTIMATED_AT)
            .modifiedAt(DEFAULT_MODIFIED_AT)
            .createdAt(DEFAULT_CREATED_AT)
            .frontEnd(DEFAULT_FRONT_END)
            .product(DEFAULT_PRODUCT);
        return audienceSegments;
    }

    @Before
    public void initTest() {
        audienceSegmentsRepository.deleteAll();
        audienceSegments = createEntity();
    }

    @Test
    public void createAudienceSegments() throws Exception {
        int databaseSizeBeforeCreate = audienceSegmentsRepository.findAll().size();

        // Create the AudienceSegments
        restAudienceSegmentsMockMvc.perform(post("/api/audience-segments")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(audienceSegments)))
            .andExpect(status().isCreated());

        // Validate the AudienceSegments in the database
        List<AudienceSegments> audienceSegmentsList = audienceSegmentsRepository.findAll();
        assertThat(audienceSegmentsList).hasSize(databaseSizeBeforeCreate + 1);
        AudienceSegments testAudienceSegments = audienceSegmentsList.get(audienceSegmentsList.size() - 1);
        assertThat(testAudienceSegments.getName()).isEqualTo(DEFAULT_NAME);
        assertThat(testAudienceSegments.getType()).isEqualTo(DEFAULT_TYPE);
        assertThat(testAudienceSegments.getEstimate()).isEqualTo(DEFAULT_ESTIMATE);
        assertThat(testAudienceSegments.getLastEstimatedAt()).isEqualTo(DEFAULT_LAST_ESTIMATED_AT);
        assertThat(testAudienceSegments.getModifiedAt()).isEqualTo(DEFAULT_MODIFIED_AT);
        assertThat(testAudienceSegments.getCreatedAt()).isEqualTo(DEFAULT_CREATED_AT);
        assertThat(testAudienceSegments.getFrontEnd()).isEqualTo(DEFAULT_FRONT_END);
        assertThat(testAudienceSegments.getProduct()).isEqualTo(DEFAULT_PRODUCT);
    }

    @Test
    public void createAudienceSegmentsWithExistingId() throws Exception {
        int databaseSizeBeforeCreate = audienceSegmentsRepository.findAll().size();

        // Create the AudienceSegments with an existing ID
        audienceSegments.setId("existing_id");

        // An entity with an existing ID cannot be created, so this API call must fail
        restAudienceSegmentsMockMvc.perform(post("/api/audience-segments")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(audienceSegments)))
            .andExpect(status().isBadRequest());

        // Validate the Alice in the database
        List<AudienceSegments> audienceSegmentsList = audienceSegmentsRepository.findAll();
        assertThat(audienceSegmentsList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    public void checkNameIsRequired() throws Exception {
        int databaseSizeBeforeTest = audienceSegmentsRepository.findAll().size();
        // set the field null
        audienceSegments.setName(null);

        // Create the AudienceSegments, which fails.

        restAudienceSegmentsMockMvc.perform(post("/api/audience-segments")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(audienceSegments)))
            .andExpect(status().isBadRequest());

        List<AudienceSegments> audienceSegmentsList = audienceSegmentsRepository.findAll();
        assertThat(audienceSegmentsList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    public void checkFrontEndIsRequired() throws Exception {
        int databaseSizeBeforeTest = audienceSegmentsRepository.findAll().size();
        // set the field null
        audienceSegments.setFrontEnd(null);

        // Create the AudienceSegments, which fails.

        restAudienceSegmentsMockMvc.perform(post("/api/audience-segments")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(audienceSegments)))
            .andExpect(status().isBadRequest());

        List<AudienceSegments> audienceSegmentsList = audienceSegmentsRepository.findAll();
        assertThat(audienceSegmentsList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    public void checkProductIsRequired() throws Exception {
        int databaseSizeBeforeTest = audienceSegmentsRepository.findAll().size();
        // set the field null
        audienceSegments.setProduct(null);

        // Create the AudienceSegments, which fails.

        restAudienceSegmentsMockMvc.perform(post("/api/audience-segments")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(audienceSegments)))
            .andExpect(status().isBadRequest());

        List<AudienceSegments> audienceSegmentsList = audienceSegmentsRepository.findAll();
        assertThat(audienceSegmentsList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    public void getAllAudienceSegments() throws Exception {
        // Initialize the database
        audienceSegmentsRepository.save(audienceSegments);

        // Get all the audienceSegmentsList
        restAudienceSegmentsMockMvc.perform(get("/api/audience-segments?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(audienceSegments.getId())))
            .andExpect(jsonPath("$.[*].name").value(hasItem(DEFAULT_NAME.toString())))
            .andExpect(jsonPath("$.[*].type").value(hasItem(DEFAULT_TYPE.toString())))
            .andExpect(jsonPath("$.[*].estimate").value(hasItem(DEFAULT_ESTIMATE.toString())))
            .andExpect(jsonPath("$.[*].lastEstimatedAt").value(hasItem(DEFAULT_LAST_ESTIMATED_AT.toString())))
            .andExpect(jsonPath("$.[*].modifiedAt").value(hasItem(DEFAULT_MODIFIED_AT.toString())))
            .andExpect(jsonPath("$.[*].createdAt").value(hasItem(DEFAULT_CREATED_AT.toString())))
            .andExpect(jsonPath("$.[*].frontEnd").value(hasItem(DEFAULT_FRONT_END.toString())))
            .andExpect(jsonPath("$.[*].product").value(hasItem(DEFAULT_PRODUCT.toString())));
    }

    @Test
    public void getAudienceSegments() throws Exception {
        // Initialize the database
        audienceSegmentsRepository.save(audienceSegments);

        // Get the audienceSegments
        restAudienceSegmentsMockMvc.perform(get("/api/audience-segments/{id}", audienceSegments.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.id").value(audienceSegments.getId()))
            .andExpect(jsonPath("$.name").value(DEFAULT_NAME.toString()))
            .andExpect(jsonPath("$.type").value(DEFAULT_TYPE.toString()))
            .andExpect(jsonPath("$.estimate").value(DEFAULT_ESTIMATE.toString()))
            .andExpect(jsonPath("$.lastEstimatedAt").value(DEFAULT_LAST_ESTIMATED_AT.toString()))
            .andExpect(jsonPath("$.modifiedAt").value(DEFAULT_MODIFIED_AT.toString()))
            .andExpect(jsonPath("$.createdAt").value(DEFAULT_CREATED_AT.toString()))
            .andExpect(jsonPath("$.frontEnd").value(DEFAULT_FRONT_END.toString()))
            .andExpect(jsonPath("$.product").value(DEFAULT_PRODUCT.toString()));
    }

    @Test
    public void getNonExistingAudienceSegments() throws Exception {
        // Get the audienceSegments
        restAudienceSegmentsMockMvc.perform(get("/api/audience-segments/{id}", Long.MAX_VALUE))
            .andExpect(status().isNotFound());
    }

    @Test
    public void updateAudienceSegments() throws Exception {
        // Initialize the database
        audienceSegmentsService.save(audienceSegments);

        int databaseSizeBeforeUpdate = audienceSegmentsRepository.findAll().size();

        // Update the audienceSegments
        AudienceSegments updatedAudienceSegments = audienceSegmentsRepository.findOne(audienceSegments.getId());
        updatedAudienceSegments
            .name(UPDATED_NAME)
            .type(UPDATED_TYPE)
            .estimate(UPDATED_ESTIMATE)
            .lastEstimatedAt(UPDATED_LAST_ESTIMATED_AT)
            .modifiedAt(UPDATED_MODIFIED_AT)
            .createdAt(UPDATED_CREATED_AT)
            .frontEnd(UPDATED_FRONT_END)
            .product(UPDATED_PRODUCT);

        restAudienceSegmentsMockMvc.perform(put("/api/audience-segments")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(updatedAudienceSegments)))
            .andExpect(status().isOk());

        // Validate the AudienceSegments in the database
        List<AudienceSegments> audienceSegmentsList = audienceSegmentsRepository.findAll();
        assertThat(audienceSegmentsList).hasSize(databaseSizeBeforeUpdate);
        AudienceSegments testAudienceSegments = audienceSegmentsList.get(audienceSegmentsList.size() - 1);
        assertThat(testAudienceSegments.getName()).isEqualTo(UPDATED_NAME);
        assertThat(testAudienceSegments.getType()).isEqualTo(UPDATED_TYPE);
        assertThat(testAudienceSegments.getEstimate()).isEqualTo(UPDATED_ESTIMATE);
        assertThat(testAudienceSegments.getLastEstimatedAt()).isEqualTo(UPDATED_LAST_ESTIMATED_AT);
        assertThat(testAudienceSegments.getModifiedAt()).isEqualTo(UPDATED_MODIFIED_AT);
        assertThat(testAudienceSegments.getCreatedAt()).isEqualTo(UPDATED_CREATED_AT);
        assertThat(testAudienceSegments.getFrontEnd()).isEqualTo(UPDATED_FRONT_END);
        assertThat(testAudienceSegments.getProduct()).isEqualTo(UPDATED_PRODUCT);
    }

    @Test
    public void updateNonExistingAudienceSegments() throws Exception {
        int databaseSizeBeforeUpdate = audienceSegmentsRepository.findAll().size();

        // Create the AudienceSegments

        // If the entity doesn't have an ID, it will be created instead of just being updated
        restAudienceSegmentsMockMvc.perform(put("/api/audience-segments")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(audienceSegments)))
            .andExpect(status().isCreated());

        // Validate the AudienceSegments in the database
        List<AudienceSegments> audienceSegmentsList = audienceSegmentsRepository.findAll();
        assertThat(audienceSegmentsList).hasSize(databaseSizeBeforeUpdate + 1);
    }

    @Test
    public void deleteAudienceSegments() throws Exception {
        // Initialize the database
        audienceSegmentsService.save(audienceSegments);

        int databaseSizeBeforeDelete = audienceSegmentsRepository.findAll().size();

        // Get the audienceSegments
        restAudienceSegmentsMockMvc.perform(delete("/api/audience-segments/{id}", audienceSegments.getId())
            .accept(TestUtil.APPLICATION_JSON_UTF8))
            .andExpect(status().isOk());

        // Validate the database is empty
        List<AudienceSegments> audienceSegmentsList = audienceSegmentsRepository.findAll();
        assertThat(audienceSegmentsList).hasSize(databaseSizeBeforeDelete - 1);
    }

    @Test
    public void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(AudienceSegments.class);
        AudienceSegments audienceSegments1 = new AudienceSegments();
        audienceSegments1.setId("id1");
        AudienceSegments audienceSegments2 = new AudienceSegments();
        audienceSegments2.setId(audienceSegments1.getId());
        assertThat(audienceSegments1).isEqualTo(audienceSegments2);
        audienceSegments2.setId("id2");
        assertThat(audienceSegments1).isNotEqualTo(audienceSegments2);
        audienceSegments1.setId(null);
        assertThat(audienceSegments1).isNotEqualTo(audienceSegments2);
    }
}
