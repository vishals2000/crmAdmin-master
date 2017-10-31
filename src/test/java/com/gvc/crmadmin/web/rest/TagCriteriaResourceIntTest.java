package com.gvc.crmadmin.web.rest;

import com.gvc.crmadmin.CrmAdminApp;

import com.gvc.crmadmin.domain.TagCriteria;
import com.gvc.crmadmin.repository.TagCriteriaRepository;
import com.gvc.crmadmin.service.TagCriteriaService;
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
 * Test class for the TagCriteriaResource REST controller.
 *
 * @see TagCriteriaResource
 */
@RunWith(SpringRunner.class)
@SpringBootTest(classes = CrmAdminApp.class)
public class TagCriteriaResourceIntTest {

    private static final String DEFAULT_FRONT_END = "AA";
    private static final String UPDATED_FRONT_END = "BB";

    private static final Product DEFAULT_PRODUCT = Product.CASINO;
    private static final Product UPDATED_PRODUCT = Product.POKER;

    private static final String DEFAULT_TAG_NAME = "AAAAAAAAAA";
    private static final String UPDATED_TAG_NAME = "BBBBBBBBBB";

    private static final String DEFAULT_TAG_COMPARISON = "AAAAAAAAAA";
    private static final String UPDATED_TAG_COMPARISON = "BBBBBBBBBB";

    private static final String DEFAULT_TAG_VALUE = "AAAAAAAAAA";
    private static final String UPDATED_TAG_VALUE = "BBBBBBBBBB";

    @Autowired
    private TagCriteriaRepository tagCriteriaRepository;

    @Autowired
    private TagCriteriaService tagCriteriaService;

    @Autowired
    private MappingJackson2HttpMessageConverter jacksonMessageConverter;

    @Autowired
    private PageableHandlerMethodArgumentResolver pageableArgumentResolver;

    @Autowired
    private ExceptionTranslator exceptionTranslator;

    private MockMvc restTagCriteriaMockMvc;

    private TagCriteria tagCriteria;

    @Before
    public void setup() {
        MockitoAnnotations.initMocks(this);
        final TagCriteriaResource tagCriteriaResource = new TagCriteriaResource(tagCriteriaService);
        this.restTagCriteriaMockMvc = MockMvcBuilders.standaloneSetup(tagCriteriaResource)
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
    public static TagCriteria createEntity() {
        TagCriteria tagCriteria = new TagCriteria()
            .frontEnd(DEFAULT_FRONT_END)
            .product(DEFAULT_PRODUCT)
            .tagName(DEFAULT_TAG_NAME)
            .tagComparison(DEFAULT_TAG_COMPARISON)
            .tagValue(DEFAULT_TAG_VALUE);
        return tagCriteria;
    }

    @Before
    public void initTest() {
        tagCriteriaRepository.deleteAll();
        tagCriteria = createEntity();
    }

    @Test
    public void createTagCriteria() throws Exception {
        int databaseSizeBeforeCreate = tagCriteriaRepository.findAll().size();

        // Create the TagCriteria
        restTagCriteriaMockMvc.perform(post("/api/tag-criteria")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(tagCriteria)))
            .andExpect(status().isCreated());

        // Validate the TagCriteria in the database
        List<TagCriteria> tagCriteriaList = tagCriteriaRepository.findAll();
        assertThat(tagCriteriaList).hasSize(databaseSizeBeforeCreate + 1);
        TagCriteria testTagCriteria = tagCriteriaList.get(tagCriteriaList.size() - 1);
        assertThat(testTagCriteria.getFrontEnd()).isEqualTo(DEFAULT_FRONT_END);
        assertThat(testTagCriteria.getProduct()).isEqualTo(DEFAULT_PRODUCT);
        assertThat(testTagCriteria.getTagName()).isEqualTo(DEFAULT_TAG_NAME);
        assertThat(testTagCriteria.getTagComparison()).isEqualTo(DEFAULT_TAG_COMPARISON);
        assertThat(testTagCriteria.getTagValue()).isEqualTo(DEFAULT_TAG_VALUE);
    }

    @Test
    public void createTagCriteriaWithExistingId() throws Exception {
        int databaseSizeBeforeCreate = tagCriteriaRepository.findAll().size();

        // Create the TagCriteria with an existing ID
        tagCriteria.setId("existing_id");

        // An entity with an existing ID cannot be created, so this API call must fail
        restTagCriteriaMockMvc.perform(post("/api/tag-criteria")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(tagCriteria)))
            .andExpect(status().isBadRequest());

        // Validate the Alice in the database
        List<TagCriteria> tagCriteriaList = tagCriteriaRepository.findAll();
        assertThat(tagCriteriaList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    public void checkFrontEndIsRequired() throws Exception {
        int databaseSizeBeforeTest = tagCriteriaRepository.findAll().size();
        // set the field null
        tagCriteria.setFrontEnd(null);

        // Create the TagCriteria, which fails.

        restTagCriteriaMockMvc.perform(post("/api/tag-criteria")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(tagCriteria)))
            .andExpect(status().isBadRequest());

        List<TagCriteria> tagCriteriaList = tagCriteriaRepository.findAll();
        assertThat(tagCriteriaList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    public void checkProductIsRequired() throws Exception {
        int databaseSizeBeforeTest = tagCriteriaRepository.findAll().size();
        // set the field null
        tagCriteria.setProduct(null);

        // Create the TagCriteria, which fails.

        restTagCriteriaMockMvc.perform(post("/api/tag-criteria")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(tagCriteria)))
            .andExpect(status().isBadRequest());

        List<TagCriteria> tagCriteriaList = tagCriteriaRepository.findAll();
        assertThat(tagCriteriaList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    public void checkTagNameIsRequired() throws Exception {
        int databaseSizeBeforeTest = tagCriteriaRepository.findAll().size();
        // set the field null
        tagCriteria.setTagName(null);

        // Create the TagCriteria, which fails.

        restTagCriteriaMockMvc.perform(post("/api/tag-criteria")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(tagCriteria)))
            .andExpect(status().isBadRequest());

        List<TagCriteria> tagCriteriaList = tagCriteriaRepository.findAll();
        assertThat(tagCriteriaList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    public void checkTagComparisonIsRequired() throws Exception {
        int databaseSizeBeforeTest = tagCriteriaRepository.findAll().size();
        // set the field null
        tagCriteria.setTagComparison(null);

        // Create the TagCriteria, which fails.

        restTagCriteriaMockMvc.perform(post("/api/tag-criteria")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(tagCriteria)))
            .andExpect(status().isBadRequest());

        List<TagCriteria> tagCriteriaList = tagCriteriaRepository.findAll();
        assertThat(tagCriteriaList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    public void checkTagValueIsRequired() throws Exception {
        int databaseSizeBeforeTest = tagCriteriaRepository.findAll().size();
        // set the field null
        tagCriteria.setTagValue(null);

        // Create the TagCriteria, which fails.

        restTagCriteriaMockMvc.perform(post("/api/tag-criteria")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(tagCriteria)))
            .andExpect(status().isBadRequest());

        List<TagCriteria> tagCriteriaList = tagCriteriaRepository.findAll();
        assertThat(tagCriteriaList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    public void getAllTagCriteria() throws Exception {
        // Initialize the database
        tagCriteriaRepository.save(tagCriteria);

        // Get all the tagCriteriaList
        restTagCriteriaMockMvc.perform(get("/api/tag-criteria?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(tagCriteria.getId())))
            .andExpect(jsonPath("$.[*].frontEnd").value(hasItem(DEFAULT_FRONT_END.toString())))
            .andExpect(jsonPath("$.[*].product").value(hasItem(DEFAULT_PRODUCT.toString())))
            .andExpect(jsonPath("$.[*].tagName").value(hasItem(DEFAULT_TAG_NAME.toString())))
            .andExpect(jsonPath("$.[*].tagComparison").value(hasItem(DEFAULT_TAG_COMPARISON.toString())))
            .andExpect(jsonPath("$.[*].tagValue").value(hasItem(DEFAULT_TAG_VALUE.toString())));
    }

    @Test
    public void getTagCriteria() throws Exception {
        // Initialize the database
        tagCriteriaRepository.save(tagCriteria);

        // Get the tagCriteria
        restTagCriteriaMockMvc.perform(get("/api/tag-criteria/{id}", tagCriteria.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.id").value(tagCriteria.getId()))
            .andExpect(jsonPath("$.frontEnd").value(DEFAULT_FRONT_END.toString()))
            .andExpect(jsonPath("$.product").value(DEFAULT_PRODUCT.toString()))
            .andExpect(jsonPath("$.tagName").value(DEFAULT_TAG_NAME.toString()))
            .andExpect(jsonPath("$.tagComparison").value(DEFAULT_TAG_COMPARISON.toString()))
            .andExpect(jsonPath("$.tagValue").value(DEFAULT_TAG_VALUE.toString()));
    }

    @Test
    public void getNonExistingTagCriteria() throws Exception {
        // Get the tagCriteria
        restTagCriteriaMockMvc.perform(get("/api/tag-criteria/{id}", Long.MAX_VALUE))
            .andExpect(status().isNotFound());
    }

    @Test
    public void updateTagCriteria() throws Exception {
        // Initialize the database
        tagCriteriaService.save(tagCriteria);

        int databaseSizeBeforeUpdate = tagCriteriaRepository.findAll().size();

        // Update the tagCriteria
        TagCriteria updatedTagCriteria = tagCriteriaRepository.findOne(tagCriteria.getId());
        updatedTagCriteria
            .frontEnd(UPDATED_FRONT_END)
            .product(UPDATED_PRODUCT)
            .tagName(UPDATED_TAG_NAME)
            .tagComparison(UPDATED_TAG_COMPARISON)
            .tagValue(UPDATED_TAG_VALUE);

        restTagCriteriaMockMvc.perform(put("/api/tag-criteria")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(updatedTagCriteria)))
            .andExpect(status().isOk());

        // Validate the TagCriteria in the database
        List<TagCriteria> tagCriteriaList = tagCriteriaRepository.findAll();
        assertThat(tagCriteriaList).hasSize(databaseSizeBeforeUpdate);
        TagCriteria testTagCriteria = tagCriteriaList.get(tagCriteriaList.size() - 1);
        assertThat(testTagCriteria.getFrontEnd()).isEqualTo(UPDATED_FRONT_END);
        assertThat(testTagCriteria.getProduct()).isEqualTo(UPDATED_PRODUCT);
        assertThat(testTagCriteria.getTagName()).isEqualTo(UPDATED_TAG_NAME);
        assertThat(testTagCriteria.getTagComparison()).isEqualTo(UPDATED_TAG_COMPARISON);
        assertThat(testTagCriteria.getTagValue()).isEqualTo(UPDATED_TAG_VALUE);
    }

    @Test
    public void updateNonExistingTagCriteria() throws Exception {
        int databaseSizeBeforeUpdate = tagCriteriaRepository.findAll().size();

        // Create the TagCriteria

        // If the entity doesn't have an ID, it will be created instead of just being updated
        restTagCriteriaMockMvc.perform(put("/api/tag-criteria")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(tagCriteria)))
            .andExpect(status().isCreated());

        // Validate the TagCriteria in the database
        List<TagCriteria> tagCriteriaList = tagCriteriaRepository.findAll();
        assertThat(tagCriteriaList).hasSize(databaseSizeBeforeUpdate + 1);
    }

    @Test
    public void deleteTagCriteria() throws Exception {
        // Initialize the database
        tagCriteriaService.save(tagCriteria);

        int databaseSizeBeforeDelete = tagCriteriaRepository.findAll().size();

        // Get the tagCriteria
        restTagCriteriaMockMvc.perform(delete("/api/tag-criteria/{id}", tagCriteria.getId())
            .accept(TestUtil.APPLICATION_JSON_UTF8))
            .andExpect(status().isOk());

        // Validate the database is empty
        List<TagCriteria> tagCriteriaList = tagCriteriaRepository.findAll();
        assertThat(tagCriteriaList).hasSize(databaseSizeBeforeDelete - 1);
    }

    @Test
    public void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(TagCriteria.class);
        TagCriteria tagCriteria1 = new TagCriteria();
        tagCriteria1.setId("id1");
        TagCriteria tagCriteria2 = new TagCriteria();
        tagCriteria2.setId(tagCriteria1.getId());
        assertThat(tagCriteria1).isEqualTo(tagCriteria2);
        tagCriteria2.setId("id2");
        assertThat(tagCriteria1).isNotEqualTo(tagCriteria2);
        tagCriteria1.setId(null);
        assertThat(tagCriteria1).isNotEqualTo(tagCriteria2);
    }
}
