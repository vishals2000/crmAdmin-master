package com.gvc.crmadmin.web.rest;

import com.gvc.crmadmin.CrmAdminApp;

import com.gvc.crmadmin.domain.UploadSegments;
import com.gvc.crmadmin.repository.UploadSegmentsRepository;
import com.gvc.crmadmin.service.UploadSegmentsService;
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
 * Test class for the UploadSegmentsResource REST controller.
 *
 * @see UploadSegmentsResource
 */
@RunWith(SpringRunner.class)
@SpringBootTest(classes = CrmAdminApp.class)
public class UploadSegmentsResourceIntTest {

    private static final String DEFAULT_FRONT_END = "AAAAAAAAAA";
    private static final String UPDATED_FRONT_END = "BBBBBBBBBB";

    private static final String DEFAULT_PRODUCT = "AAAAAAAAAA";
    private static final String UPDATED_PRODUCT = "BBBBBBBBBB";

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

    @Autowired
    private UploadSegmentsRepository uploadSegmentsRepository;

    @Autowired
    private UploadSegmentsService uploadSegmentsService;

    @Autowired
    private MappingJackson2HttpMessageConverter jacksonMessageConverter;

    @Autowired
    private PageableHandlerMethodArgumentResolver pageableArgumentResolver;

    @Autowired
    private ExceptionTranslator exceptionTranslator;

    private MockMvc restUploadSegmentsMockMvc;

    private UploadSegments uploadSegments;

    @Before
    public void setup() {
        MockitoAnnotations.initMocks(this);
        final UploadSegmentsResource uploadSegmentsResource = new UploadSegmentsResource(uploadSegmentsService);
        this.restUploadSegmentsMockMvc = MockMvcBuilders.standaloneSetup(uploadSegmentsResource)
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
    public static UploadSegments createEntity() {
        UploadSegments uploadSegments = new UploadSegments()
            .frontEnd(DEFAULT_FRONT_END)
            .product(DEFAULT_PRODUCT)
            .name(DEFAULT_NAME)
            .type(DEFAULT_TYPE)
            .estimate(DEFAULT_ESTIMATE)
            .lastEstimatedAt(DEFAULT_LAST_ESTIMATED_AT)
            .modifiedAt(DEFAULT_MODIFIED_AT)
            .createdAt(DEFAULT_CREATED_AT);
        return uploadSegments;
    }

    @Before
    public void initTest() {
        uploadSegmentsRepository.deleteAll();
        uploadSegments = createEntity();
    }

    @Test
    public void createUploadSegments() throws Exception {
        int databaseSizeBeforeCreate = uploadSegmentsRepository.findAll().size();

        // Create the UploadSegments
        restUploadSegmentsMockMvc.perform(post("/api/upload-segments")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(uploadSegments)))
            .andExpect(status().isCreated());

        // Validate the UploadSegments in the database
        List<UploadSegments> uploadSegmentsList = uploadSegmentsRepository.findAll();
        assertThat(uploadSegmentsList).hasSize(databaseSizeBeforeCreate + 1);
        UploadSegments testUploadSegments = uploadSegmentsList.get(uploadSegmentsList.size() - 1);
        assertThat(testUploadSegments.getFrontEnd()).isEqualTo(DEFAULT_FRONT_END);
        assertThat(testUploadSegments.getProduct()).isEqualTo(DEFAULT_PRODUCT);
        assertThat(testUploadSegments.getName()).isEqualTo(DEFAULT_NAME);
        assertThat(testUploadSegments.getType()).isEqualTo(DEFAULT_TYPE);
        assertThat(testUploadSegments.getEstimate()).isEqualTo(DEFAULT_ESTIMATE);
        assertThat(testUploadSegments.getLastEstimatedAt()).isEqualTo(DEFAULT_LAST_ESTIMATED_AT);
        assertThat(testUploadSegments.getModifiedAt()).isEqualTo(DEFAULT_MODIFIED_AT);
        assertThat(testUploadSegments.getCreatedAt()).isEqualTo(DEFAULT_CREATED_AT);
    }

    @Test
    public void createUploadSegmentsWithExistingId() throws Exception {
        int databaseSizeBeforeCreate = uploadSegmentsRepository.findAll().size();

        // Create the UploadSegments with an existing ID
        uploadSegments.setId("existing_id");

        // An entity with an existing ID cannot be created, so this API call must fail
        restUploadSegmentsMockMvc.perform(post("/api/upload-segments")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(uploadSegments)))
            .andExpect(status().isBadRequest());

        // Validate the Alice in the database
        List<UploadSegments> uploadSegmentsList = uploadSegmentsRepository.findAll();
        assertThat(uploadSegmentsList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    public void checkFrontEndIsRequired() throws Exception {
        int databaseSizeBeforeTest = uploadSegmentsRepository.findAll().size();
        // set the field null
        uploadSegments.setFrontEnd(null);

        // Create the UploadSegments, which fails.

        restUploadSegmentsMockMvc.perform(post("/api/upload-segments")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(uploadSegments)))
            .andExpect(status().isBadRequest());

        List<UploadSegments> uploadSegmentsList = uploadSegmentsRepository.findAll();
        assertThat(uploadSegmentsList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    public void checkProductIsRequired() throws Exception {
        int databaseSizeBeforeTest = uploadSegmentsRepository.findAll().size();
        // set the field null
        uploadSegments.setProduct(null);

        // Create the UploadSegments, which fails.

        restUploadSegmentsMockMvc.perform(post("/api/upload-segments")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(uploadSegments)))
            .andExpect(status().isBadRequest());

        List<UploadSegments> uploadSegmentsList = uploadSegmentsRepository.findAll();
        assertThat(uploadSegmentsList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    public void checkNameIsRequired() throws Exception {
        int databaseSizeBeforeTest = uploadSegmentsRepository.findAll().size();
        // set the field null
        uploadSegments.setName(null);

        // Create the UploadSegments, which fails.

        restUploadSegmentsMockMvc.perform(post("/api/upload-segments")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(uploadSegments)))
            .andExpect(status().isBadRequest());

        List<UploadSegments> uploadSegmentsList = uploadSegmentsRepository.findAll();
        assertThat(uploadSegmentsList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    public void getAllUploadSegments() throws Exception {
        // Initialize the database
        uploadSegmentsRepository.save(uploadSegments);

        // Get all the uploadSegmentsList
        restUploadSegmentsMockMvc.perform(get("/api/upload-segments?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(uploadSegments.getId())))
            .andExpect(jsonPath("$.[*].frontEnd").value(hasItem(DEFAULT_FRONT_END.toString())))
            .andExpect(jsonPath("$.[*].product").value(hasItem(DEFAULT_PRODUCT.toString())))
            .andExpect(jsonPath("$.[*].name").value(hasItem(DEFAULT_NAME.toString())))
            .andExpect(jsonPath("$.[*].type").value(hasItem(DEFAULT_TYPE.toString())))
            .andExpect(jsonPath("$.[*].estimate").value(hasItem(DEFAULT_ESTIMATE.toString())))
            .andExpect(jsonPath("$.[*].lastEstimatedAt").value(hasItem(DEFAULT_LAST_ESTIMATED_AT.toString())))
            .andExpect(jsonPath("$.[*].modifiedAt").value(hasItem(DEFAULT_MODIFIED_AT.toString())))
            .andExpect(jsonPath("$.[*].createdAt").value(hasItem(DEFAULT_CREATED_AT.toString())));
    }

    @Test
    public void getUploadSegments() throws Exception {
        // Initialize the database
        uploadSegmentsRepository.save(uploadSegments);

        // Get the uploadSegments
        restUploadSegmentsMockMvc.perform(get("/api/upload-segments/{id}", uploadSegments.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.id").value(uploadSegments.getId()))
            .andExpect(jsonPath("$.frontEnd").value(DEFAULT_FRONT_END.toString()))
            .andExpect(jsonPath("$.product").value(DEFAULT_PRODUCT.toString()))
            .andExpect(jsonPath("$.name").value(DEFAULT_NAME.toString()))
            .andExpect(jsonPath("$.type").value(DEFAULT_TYPE.toString()))
            .andExpect(jsonPath("$.estimate").value(DEFAULT_ESTIMATE.toString()))
            .andExpect(jsonPath("$.lastEstimatedAt").value(DEFAULT_LAST_ESTIMATED_AT.toString()))
            .andExpect(jsonPath("$.modifiedAt").value(DEFAULT_MODIFIED_AT.toString()))
            .andExpect(jsonPath("$.createdAt").value(DEFAULT_CREATED_AT.toString()));
    }

    @Test
    public void getNonExistingUploadSegments() throws Exception {
        // Get the uploadSegments
        restUploadSegmentsMockMvc.perform(get("/api/upload-segments/{id}", Long.MAX_VALUE))
            .andExpect(status().isNotFound());
    }

    @Test
    public void updateUploadSegments() throws Exception {
        // Initialize the database
        uploadSegmentsService.save(uploadSegments);

        int databaseSizeBeforeUpdate = uploadSegmentsRepository.findAll().size();

        // Update the uploadSegments
        UploadSegments updatedUploadSegments = uploadSegmentsRepository.findOne(uploadSegments.getId());
        updatedUploadSegments
            .frontEnd(UPDATED_FRONT_END)
            .product(UPDATED_PRODUCT)
            .name(UPDATED_NAME)
            .type(UPDATED_TYPE)
            .estimate(UPDATED_ESTIMATE)
            .lastEstimatedAt(UPDATED_LAST_ESTIMATED_AT)
            .modifiedAt(UPDATED_MODIFIED_AT)
            .createdAt(UPDATED_CREATED_AT);

        restUploadSegmentsMockMvc.perform(put("/api/upload-segments")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(updatedUploadSegments)))
            .andExpect(status().isOk());

        // Validate the UploadSegments in the database
        List<UploadSegments> uploadSegmentsList = uploadSegmentsRepository.findAll();
        assertThat(uploadSegmentsList).hasSize(databaseSizeBeforeUpdate);
        UploadSegments testUploadSegments = uploadSegmentsList.get(uploadSegmentsList.size() - 1);
        assertThat(testUploadSegments.getFrontEnd()).isEqualTo(UPDATED_FRONT_END);
        assertThat(testUploadSegments.getProduct()).isEqualTo(UPDATED_PRODUCT);
        assertThat(testUploadSegments.getName()).isEqualTo(UPDATED_NAME);
        assertThat(testUploadSegments.getType()).isEqualTo(UPDATED_TYPE);
        assertThat(testUploadSegments.getEstimate()).isEqualTo(UPDATED_ESTIMATE);
        assertThat(testUploadSegments.getLastEstimatedAt()).isEqualTo(UPDATED_LAST_ESTIMATED_AT);
        assertThat(testUploadSegments.getModifiedAt()).isEqualTo(UPDATED_MODIFIED_AT);
        assertThat(testUploadSegments.getCreatedAt()).isEqualTo(UPDATED_CREATED_AT);
    }

    @Test
    public void updateNonExistingUploadSegments() throws Exception {
        int databaseSizeBeforeUpdate = uploadSegmentsRepository.findAll().size();

        // Create the UploadSegments

        // If the entity doesn't have an ID, it will be created instead of just being updated
        restUploadSegmentsMockMvc.perform(put("/api/upload-segments")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(uploadSegments)))
            .andExpect(status().isCreated());

        // Validate the UploadSegments in the database
        List<UploadSegments> uploadSegmentsList = uploadSegmentsRepository.findAll();
        assertThat(uploadSegmentsList).hasSize(databaseSizeBeforeUpdate + 1);
    }

    @Test
    public void deleteUploadSegments() throws Exception {
        // Initialize the database
        uploadSegmentsService.save(uploadSegments);

        int databaseSizeBeforeDelete = uploadSegmentsRepository.findAll().size();

        // Get the uploadSegments
        restUploadSegmentsMockMvc.perform(delete("/api/upload-segments/{id}", uploadSegments.getId())
            .accept(TestUtil.APPLICATION_JSON_UTF8))
            .andExpect(status().isOk());

        // Validate the database is empty
        List<UploadSegments> uploadSegmentsList = uploadSegmentsRepository.findAll();
        assertThat(uploadSegmentsList).hasSize(databaseSizeBeforeDelete - 1);
    }

    @Test
    public void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(UploadSegments.class);
        UploadSegments uploadSegments1 = new UploadSegments();
        uploadSegments1.setId("id1");
        UploadSegments uploadSegments2 = new UploadSegments();
        uploadSegments2.setId(uploadSegments1.getId());
        assertThat(uploadSegments1).isEqualTo(uploadSegments2);
        uploadSegments2.setId("id2");
        assertThat(uploadSegments1).isNotEqualTo(uploadSegments2);
        uploadSegments1.setId(null);
        assertThat(uploadSegments1).isNotEqualTo(uploadSegments2);
    }
}
