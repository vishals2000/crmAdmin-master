package com.gvc.crmadmin.web.rest;

import com.gvc.crmadmin.CrmAdminApp;

import com.gvc.crmadmin.domain.CampaignGroup;
import com.gvc.crmadmin.repository.CampaignGroupRepository;
import com.gvc.crmadmin.service.CampaignGroupService;
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
 * Test class for the CampaignGroupResource REST controller.
 *
 * @see CampaignGroupResource
 */
@RunWith(SpringRunner.class)
@SpringBootTest(classes = CrmAdminApp.class)
public class CampaignGroupResourceIntTest {

    private static final String DEFAULT_NAME = "AAAAAAAAAA";
    private static final String UPDATED_NAME = "BBBBBBBBBB";

    private static final String DEFAULT_DESCRIPTION = "AAAAAAAAAA";
    private static final String UPDATED_DESCRIPTION = "BBBBBBBBBB";

    private static final String DEFAULT_PROJECT_ID = "AAAAAAAAAA";
    private static final String UPDATED_PROJECT_ID = "BBBBBBBBBB";

    @Autowired
    private CampaignGroupRepository campaignGroupRepository;

    @Autowired
    private CampaignGroupService campaignGroupService;

    @Autowired
    private MappingJackson2HttpMessageConverter jacksonMessageConverter;

    @Autowired
    private PageableHandlerMethodArgumentResolver pageableArgumentResolver;

    @Autowired
    private ExceptionTranslator exceptionTranslator;

    private MockMvc restCampaignGroupMockMvc;

    private CampaignGroup campaignGroup;

    @Before
    public void setup() {
        MockitoAnnotations.initMocks(this);
        final CampaignGroupResource campaignGroupResource = new CampaignGroupResource(campaignGroupService);
        this.restCampaignGroupMockMvc = MockMvcBuilders.standaloneSetup(campaignGroupResource)
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
    public static CampaignGroup createEntity() {
        CampaignGroup campaignGroup = new CampaignGroup()
            .name(DEFAULT_NAME)
            .description(DEFAULT_DESCRIPTION)
            .projectId(DEFAULT_PROJECT_ID);
        return campaignGroup;
    }

    @Before
    public void initTest() {
        campaignGroupRepository.deleteAll();
        campaignGroup = createEntity();
    }

    @Test
    public void createCampaignGroup() throws Exception {
        int databaseSizeBeforeCreate = campaignGroupRepository.findAll().size();

        // Create the CampaignGroup
        restCampaignGroupMockMvc.perform(post("/api/campaign-groups")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(campaignGroup)))
            .andExpect(status().isCreated());

        // Validate the CampaignGroup in the database
        List<CampaignGroup> campaignGroupList = campaignGroupRepository.findAll();
        assertThat(campaignGroupList).hasSize(databaseSizeBeforeCreate + 1);
        CampaignGroup testCampaignGroup = campaignGroupList.get(campaignGroupList.size() - 1);
        assertThat(testCampaignGroup.getName()).isEqualTo(DEFAULT_NAME);
        assertThat(testCampaignGroup.getDescription()).isEqualTo(DEFAULT_DESCRIPTION);
        assertThat(testCampaignGroup.getProjectId()).isEqualTo(DEFAULT_PROJECT_ID);
    }

    @Test
    public void createCampaignGroupWithExistingId() throws Exception {
        int databaseSizeBeforeCreate = campaignGroupRepository.findAll().size();

        // Create the CampaignGroup with an existing ID
        campaignGroup.setId("existing_id");

        // An entity with an existing ID cannot be created, so this API call must fail
        restCampaignGroupMockMvc.perform(post("/api/campaign-groups")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(campaignGroup)))
            .andExpect(status().isBadRequest());

        // Validate the Alice in the database
        List<CampaignGroup> campaignGroupList = campaignGroupRepository.findAll();
        assertThat(campaignGroupList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    public void checkNameIsRequired() throws Exception {
        int databaseSizeBeforeTest = campaignGroupRepository.findAll().size();
        // set the field null
        campaignGroup.setName(null);

        // Create the CampaignGroup, which fails.

        restCampaignGroupMockMvc.perform(post("/api/campaign-groups")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(campaignGroup)))
            .andExpect(status().isBadRequest());

        List<CampaignGroup> campaignGroupList = campaignGroupRepository.findAll();
        assertThat(campaignGroupList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    public void checkDescriptionIsRequired() throws Exception {
        int databaseSizeBeforeTest = campaignGroupRepository.findAll().size();
        // set the field null
        campaignGroup.setDescription(null);

        // Create the CampaignGroup, which fails.

        restCampaignGroupMockMvc.perform(post("/api/campaign-groups")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(campaignGroup)))
            .andExpect(status().isBadRequest());

        List<CampaignGroup> campaignGroupList = campaignGroupRepository.findAll();
        assertThat(campaignGroupList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    public void getAllCampaignGroups() throws Exception {
        // Initialize the database
        campaignGroupRepository.save(campaignGroup);

        // Get all the campaignGroupList
        restCampaignGroupMockMvc.perform(get("/api/campaign-groups?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(campaignGroup.getId())))
            .andExpect(jsonPath("$.[*].name").value(hasItem(DEFAULT_NAME.toString())))
            .andExpect(jsonPath("$.[*].description").value(hasItem(DEFAULT_DESCRIPTION.toString())))
            .andExpect(jsonPath("$.[*].projectId").value(hasItem(DEFAULT_PROJECT_ID.toString())));
    }

    @Test
    public void getCampaignGroup() throws Exception {
        // Initialize the database
        campaignGroupRepository.save(campaignGroup);

        // Get the campaignGroup
        restCampaignGroupMockMvc.perform(get("/api/campaign-groups/{id}", campaignGroup.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.id").value(campaignGroup.getId()))
            .andExpect(jsonPath("$.name").value(DEFAULT_NAME.toString()))
            .andExpect(jsonPath("$.description").value(DEFAULT_DESCRIPTION.toString()))
            .andExpect(jsonPath("$.projectId").value(DEFAULT_PROJECT_ID.toString()));
    }

    @Test
    public void getNonExistingCampaignGroup() throws Exception {
        // Get the campaignGroup
        restCampaignGroupMockMvc.perform(get("/api/campaign-groups/{id}", Long.MAX_VALUE))
            .andExpect(status().isNotFound());
    }

    @Test
    public void updateCampaignGroup() throws Exception {
        // Initialize the database
        campaignGroupService.save(campaignGroup);

        int databaseSizeBeforeUpdate = campaignGroupRepository.findAll().size();

        // Update the campaignGroup
        CampaignGroup updatedCampaignGroup = campaignGroupRepository.findOne(campaignGroup.getId());
        updatedCampaignGroup
            .name(UPDATED_NAME)
            .description(UPDATED_DESCRIPTION)
            .projectId(UPDATED_PROJECT_ID);

        restCampaignGroupMockMvc.perform(put("/api/campaign-groups")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(updatedCampaignGroup)))
            .andExpect(status().isOk());

        // Validate the CampaignGroup in the database
        List<CampaignGroup> campaignGroupList = campaignGroupRepository.findAll();
        assertThat(campaignGroupList).hasSize(databaseSizeBeforeUpdate);
        CampaignGroup testCampaignGroup = campaignGroupList.get(campaignGroupList.size() - 1);
        assertThat(testCampaignGroup.getName()).isEqualTo(UPDATED_NAME);
        assertThat(testCampaignGroup.getDescription()).isEqualTo(UPDATED_DESCRIPTION);
        assertThat(testCampaignGroup.getProjectId()).isEqualTo(UPDATED_PROJECT_ID);
    }

    @Test
    public void updateNonExistingCampaignGroup() throws Exception {
        int databaseSizeBeforeUpdate = campaignGroupRepository.findAll().size();

        // Create the CampaignGroup

        // If the entity doesn't have an ID, it will be created instead of just being updated
        restCampaignGroupMockMvc.perform(put("/api/campaign-groups")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(campaignGroup)))
            .andExpect(status().isCreated());

        // Validate the CampaignGroup in the database
        List<CampaignGroup> campaignGroupList = campaignGroupRepository.findAll();
        assertThat(campaignGroupList).hasSize(databaseSizeBeforeUpdate + 1);
    }

    @Test
    public void deleteCampaignGroup() throws Exception {
        // Initialize the database
        campaignGroupService.save(campaignGroup);

        int databaseSizeBeforeDelete = campaignGroupRepository.findAll().size();

        // Get the campaignGroup
        restCampaignGroupMockMvc.perform(delete("/api/campaign-groups/{id}", campaignGroup.getId())
            .accept(TestUtil.APPLICATION_JSON_UTF8))
            .andExpect(status().isOk());

        // Validate the database is empty
        List<CampaignGroup> campaignGroupList = campaignGroupRepository.findAll();
        assertThat(campaignGroupList).hasSize(databaseSizeBeforeDelete - 1);
    }

    @Test
    public void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(CampaignGroup.class);
        CampaignGroup campaignGroup1 = new CampaignGroup();
        campaignGroup1.setId("id1");
        CampaignGroup campaignGroup2 = new CampaignGroup();
        campaignGroup2.setId(campaignGroup1.getId());
        assertThat(campaignGroup1).isEqualTo(campaignGroup2);
        campaignGroup2.setId("id2");
        assertThat(campaignGroup1).isNotEqualTo(campaignGroup2);
        campaignGroup1.setId(null);
        assertThat(campaignGroup1).isNotEqualTo(campaignGroup2);
    }
}
