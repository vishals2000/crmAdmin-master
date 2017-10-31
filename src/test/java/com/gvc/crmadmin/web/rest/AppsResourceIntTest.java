package com.gvc.crmadmin.web.rest;

import com.gvc.crmadmin.CrmAdminApp;

import com.gvc.crmadmin.domain.Apps;
import com.gvc.crmadmin.repository.AppsRepository;
import com.gvc.crmadmin.service.AppsService;
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
 * Test class for the AppsResource REST controller.
 *
 * @see AppsResource
 */
@RunWith(SpringRunner.class)
@SpringBootTest(classes = CrmAdminApp.class)
public class AppsResourceIntTest {

    private static final String DEFAULT_FRONT_END = "AA";
    private static final String UPDATED_FRONT_END = "BB";

    private static final Product DEFAULT_PRODUCT = Product.CASINO;
    private static final Product UPDATED_PRODUCT = Product.POKER;

    private static final String DEFAULT_NAME = "AAAAAAAAAA";
    private static final String UPDATED_NAME = "BBBBBBBBBB";

    private static final String DEFAULT_JURISDICTION = "AAAAAAAAAA";
    private static final String UPDATED_JURISDICTION = "BBBBBBBBBB";

    private static final String DEFAULT_DESCRIPTION = "AAAAAAAAAA";
    private static final String UPDATED_DESCRIPTION = "BBBBBBBBBB";

    @Autowired
    private AppsRepository appsRepository;

    @Autowired
    private AppsService appsService;

    @Autowired
    private MappingJackson2HttpMessageConverter jacksonMessageConverter;

    @Autowired
    private PageableHandlerMethodArgumentResolver pageableArgumentResolver;

    @Autowired
    private ExceptionTranslator exceptionTranslator;

    private MockMvc restAppsMockMvc;

    private Apps apps;

    @Before
    public void setup() {
        MockitoAnnotations.initMocks(this);
        final AppsResource appsResource = new AppsResource(appsService);
        this.restAppsMockMvc = MockMvcBuilders.standaloneSetup(appsResource)
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
    public static Apps createEntity() {
        Apps apps = new Apps()
            .frontEnd(DEFAULT_FRONT_END)
            .product(DEFAULT_PRODUCT)
            .name(DEFAULT_NAME)
            .jurisdiction(DEFAULT_JURISDICTION)
            .description(DEFAULT_DESCRIPTION);
        return apps;
    }

    @Before
    public void initTest() {
        appsRepository.deleteAll();
        apps = createEntity();
    }

    @Test
    public void createApps() throws Exception {
        int databaseSizeBeforeCreate = appsRepository.findAll().size();

        // Create the Apps
        restAppsMockMvc.perform(post("/api/apps")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(apps)))
            .andExpect(status().isCreated());

        // Validate the Apps in the database
        List<Apps> appsList = appsRepository.findAll();
        assertThat(appsList).hasSize(databaseSizeBeforeCreate + 1);
        Apps testApps = appsList.get(appsList.size() - 1);
        assertThat(testApps.getFrontEnd()).isEqualTo(DEFAULT_FRONT_END);
        assertThat(testApps.getProduct()).isEqualTo(DEFAULT_PRODUCT);
        assertThat(testApps.getName()).isEqualTo(DEFAULT_NAME);
        assertThat(testApps.getJurisdiction()).isEqualTo(DEFAULT_JURISDICTION);
        assertThat(testApps.getDescription()).isEqualTo(DEFAULT_DESCRIPTION);
    }

    @Test
    public void createAppsWithExistingId() throws Exception {
        int databaseSizeBeforeCreate = appsRepository.findAll().size();

        // Create the Apps with an existing ID
        apps.setId("existing_id");

        // An entity with an existing ID cannot be created, so this API call must fail
        restAppsMockMvc.perform(post("/api/apps")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(apps)))
            .andExpect(status().isBadRequest());

        // Validate the Alice in the database
        List<Apps> appsList = appsRepository.findAll();
        assertThat(appsList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    public void checkFrontEndIsRequired() throws Exception {
        int databaseSizeBeforeTest = appsRepository.findAll().size();
        // set the field null
        apps.setFrontEnd(null);

        // Create the Apps, which fails.

        restAppsMockMvc.perform(post("/api/apps")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(apps)))
            .andExpect(status().isBadRequest());

        List<Apps> appsList = appsRepository.findAll();
        assertThat(appsList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    public void checkProductIsRequired() throws Exception {
        int databaseSizeBeforeTest = appsRepository.findAll().size();
        // set the field null
        apps.setProduct(null);

        // Create the Apps, which fails.

        restAppsMockMvc.perform(post("/api/apps")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(apps)))
            .andExpect(status().isBadRequest());

        List<Apps> appsList = appsRepository.findAll();
        assertThat(appsList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    public void checkNameIsRequired() throws Exception {
        int databaseSizeBeforeTest = appsRepository.findAll().size();
        // set the field null
        apps.setName(null);

        // Create the Apps, which fails.

        restAppsMockMvc.perform(post("/api/apps")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(apps)))
            .andExpect(status().isBadRequest());

        List<Apps> appsList = appsRepository.findAll();
        assertThat(appsList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    public void getAllApps() throws Exception {
        // Initialize the database
        appsRepository.save(apps);

        // Get all the appsList
        restAppsMockMvc.perform(get("/api/apps?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(apps.getId())))
            .andExpect(jsonPath("$.[*].frontEnd").value(hasItem(DEFAULT_FRONT_END.toString())))
            .andExpect(jsonPath("$.[*].product").value(hasItem(DEFAULT_PRODUCT.toString())))
            .andExpect(jsonPath("$.[*].name").value(hasItem(DEFAULT_NAME.toString())))
            .andExpect(jsonPath("$.[*].jurisdiction").value(hasItem(DEFAULT_JURISDICTION.toString())))
            .andExpect(jsonPath("$.[*].description").value(hasItem(DEFAULT_DESCRIPTION.toString())));
    }

    @Test
    public void getApps() throws Exception {
        // Initialize the database
        appsRepository.save(apps);

        // Get the apps
        restAppsMockMvc.perform(get("/api/apps/{id}", apps.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.id").value(apps.getId()))
            .andExpect(jsonPath("$.frontEnd").value(DEFAULT_FRONT_END.toString()))
            .andExpect(jsonPath("$.product").value(DEFAULT_PRODUCT.toString()))
            .andExpect(jsonPath("$.name").value(DEFAULT_NAME.toString()))
            .andExpect(jsonPath("$.jurisdiction").value(DEFAULT_JURISDICTION.toString()))
            .andExpect(jsonPath("$.description").value(DEFAULT_DESCRIPTION.toString()));
    }

    @Test
    public void getNonExistingApps() throws Exception {
        // Get the apps
        restAppsMockMvc.perform(get("/api/apps/{id}", Long.MAX_VALUE))
            .andExpect(status().isNotFound());
    }

    @Test
    public void updateApps() throws Exception {
        // Initialize the database
        appsService.save(apps);

        int databaseSizeBeforeUpdate = appsRepository.findAll().size();

        // Update the apps
        Apps updatedApps = appsRepository.findOne(apps.getId());
        updatedApps
            .frontEnd(UPDATED_FRONT_END)
            .product(UPDATED_PRODUCT)
            .name(UPDATED_NAME)
            .jurisdiction(UPDATED_JURISDICTION)
            .description(UPDATED_DESCRIPTION);

        restAppsMockMvc.perform(put("/api/apps")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(updatedApps)))
            .andExpect(status().isOk());

        // Validate the Apps in the database
        List<Apps> appsList = appsRepository.findAll();
        assertThat(appsList).hasSize(databaseSizeBeforeUpdate);
        Apps testApps = appsList.get(appsList.size() - 1);
        assertThat(testApps.getFrontEnd()).isEqualTo(UPDATED_FRONT_END);
        assertThat(testApps.getProduct()).isEqualTo(UPDATED_PRODUCT);
        assertThat(testApps.getName()).isEqualTo(UPDATED_NAME);
        assertThat(testApps.getJurisdiction()).isEqualTo(UPDATED_JURISDICTION);
        assertThat(testApps.getDescription()).isEqualTo(UPDATED_DESCRIPTION);
    }

    @Test
    public void updateNonExistingApps() throws Exception {
        int databaseSizeBeforeUpdate = appsRepository.findAll().size();

        // Create the Apps

        // If the entity doesn't have an ID, it will be created instead of just being updated
        restAppsMockMvc.perform(put("/api/apps")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(apps)))
            .andExpect(status().isCreated());

        // Validate the Apps in the database
        List<Apps> appsList = appsRepository.findAll();
        assertThat(appsList).hasSize(databaseSizeBeforeUpdate + 1);
    }

    @Test
    public void deleteApps() throws Exception {
        // Initialize the database
        appsService.save(apps);

        int databaseSizeBeforeDelete = appsRepository.findAll().size();

        // Get the apps
        restAppsMockMvc.perform(delete("/api/apps/{id}", apps.getId())
            .accept(TestUtil.APPLICATION_JSON_UTF8))
            .andExpect(status().isOk());

        // Validate the database is empty
        List<Apps> appsList = appsRepository.findAll();
        assertThat(appsList).hasSize(databaseSizeBeforeDelete - 1);
    }

    @Test
    public void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Apps.class);
        Apps apps1 = new Apps();
        apps1.setId("id1");
        Apps apps2 = new Apps();
        apps2.setId(apps1.getId());
        assertThat(apps1).isEqualTo(apps2);
        apps2.setId("id2");
        assertThat(apps1).isNotEqualTo(apps2);
        apps1.setId(null);
        assertThat(apps1).isNotEqualTo(apps2);
    }
}
