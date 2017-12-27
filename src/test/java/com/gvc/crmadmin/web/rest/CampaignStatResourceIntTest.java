package com.gvc.crmadmin.web.rest;

import com.gvc.crmadmin.CrmAdminApp;

import com.gvc.crmadmin.domain.CampaignStat;
import com.gvc.crmadmin.repository.CampaignStatRepository;
import com.gvc.crmadmin.service.CampaignStatService;
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
 * Test class for the CampaignStatResource REST controller.
 *
 * @see CampaignStatResource
 */
@RunWith(SpringRunner.class)
@SpringBootTest(classes = CrmAdminApp.class)
public class CampaignStatResourceIntTest {

    private static final String DEFAULT_NAME = "AAAAAAAAAA";
    private static final String UPDATED_NAME = "BBBBBBBBBB";

    private static final String DEFAULT_SCHEDULED_TIME = "AAAAAAAAAA";
    private static final String UPDATED_SCHEDULED_TIME = "BBBBBBBBBB";

    private static final String DEFAULT_STATUS = "AAAAAAAAAA";
    private static final String UPDATED_STATUS = "BBBBBBBBBB";

    private static final Integer DEFAULT_SEGMENT_SIZE = 1;
    private static final Integer UPDATED_SEGMENT_SIZE = 2;

    private static final Integer DEFAULT_SEGMENT_SIZE_AFTER_COMMON_SCRUBBING = 1;
    private static final Integer UPDATED_SEGMENT_SIZE_AFTER_COMMON_SCRUBBING = 2;

    private static final Integer DEFAULT_SEGMENT_SIZE_AFTER_COMMUNICATION_SCRUBBING = 1;
    private static final Integer UPDATED_SEGMENT_SIZE_AFTER_COMMUNICATION_SCRUBBING = 2;

    private static final String DEFAULT_CAMPAIGN_ID = "AAAAAAAAAA";
    private static final String UPDATED_CAMPAIGN_ID = "BBBBBBBBBB";

    @Autowired
    private CampaignStatRepository campaignStatRepository;

    @Autowired
    private CampaignStatService campaignStatService;

    @Autowired
    private MappingJackson2HttpMessageConverter jacksonMessageConverter;

    @Autowired
    private PageableHandlerMethodArgumentResolver pageableArgumentResolver;

    @Autowired
    private ExceptionTranslator exceptionTranslator;

    private MockMvc restCampaignStatMockMvc;

    private CampaignStat campaignStat;

    @Before
    public void setup() {
        MockitoAnnotations.initMocks(this);
        final CampaignStatResource campaignStatResource = new CampaignStatResource(campaignStatService);
        this.restCampaignStatMockMvc = MockMvcBuilders.standaloneSetup(campaignStatResource)
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
    public static CampaignStat createEntity() {
        CampaignStat campaignStat = new CampaignStat()
            .name(DEFAULT_NAME)
            .scheduledTime(DEFAULT_SCHEDULED_TIME)
            .status(DEFAULT_STATUS)
            .segmentSize(DEFAULT_SEGMENT_SIZE)
            .segmentSizeAfterCommonScrubbing(DEFAULT_SEGMENT_SIZE_AFTER_COMMON_SCRUBBING)
            .segmentSizeAfterCommunicationScrubbing(DEFAULT_SEGMENT_SIZE_AFTER_COMMUNICATION_SCRUBBING)
            .campaignId(DEFAULT_CAMPAIGN_ID);
        return campaignStat;
    }

    @Before
    public void initTest() {
        campaignStatRepository.deleteAll();
        campaignStat = createEntity();
    }

    @Test
    public void createCampaignStat() throws Exception {
        int databaseSizeBeforeCreate = campaignStatRepository.findAll().size();

        // Create the CampaignStat
        restCampaignStatMockMvc.perform(post("/api/campaign-stats")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(campaignStat)))
            .andExpect(status().isCreated());

        // Validate the CampaignStat in the database
        List<CampaignStat> campaignStatList = campaignStatRepository.findAll();
        assertThat(campaignStatList).hasSize(databaseSizeBeforeCreate + 1);
        CampaignStat testCampaignStat = campaignStatList.get(campaignStatList.size() - 1);
        assertThat(testCampaignStat.getName()).isEqualTo(DEFAULT_NAME);
        assertThat(testCampaignStat.getScheduledTime()).isEqualTo(DEFAULT_SCHEDULED_TIME);
        assertThat(testCampaignStat.getStatus()).isEqualTo(DEFAULT_STATUS);
        assertThat(testCampaignStat.getSegmentSize()).isEqualTo(DEFAULT_SEGMENT_SIZE);
        assertThat(testCampaignStat.getSegmentSizeAfterCommonScrubbing()).isEqualTo(DEFAULT_SEGMENT_SIZE_AFTER_COMMON_SCRUBBING);
        assertThat(testCampaignStat.getSegmentSizeAfterCommunicationScrubbing()).isEqualTo(DEFAULT_SEGMENT_SIZE_AFTER_COMMUNICATION_SCRUBBING);
        assertThat(testCampaignStat.getCampaignId()).isEqualTo(DEFAULT_CAMPAIGN_ID);
    }

    @Test
    public void createCampaignStatWithExistingId() throws Exception {
        int databaseSizeBeforeCreate = campaignStatRepository.findAll().size();

        // Create the CampaignStat with an existing ID
        campaignStat.setId("existing_id");

        // An entity with an existing ID cannot be created, so this API call must fail
        restCampaignStatMockMvc.perform(post("/api/campaign-stats")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(campaignStat)))
            .andExpect(status().isBadRequest());

        // Validate the Alice in the database
        List<CampaignStat> campaignStatList = campaignStatRepository.findAll();
        assertThat(campaignStatList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    public void getAllCampaignStats() throws Exception {
        // Initialize the database
        campaignStatRepository.save(campaignStat);

        // Get all the campaignStatList
        restCampaignStatMockMvc.perform(get("/api/campaign-stats?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(campaignStat.getId())))
            .andExpect(jsonPath("$.[*].name").value(hasItem(DEFAULT_NAME.toString())))
            .andExpect(jsonPath("$.[*].scheduledTime").value(hasItem(DEFAULT_SCHEDULED_TIME.toString())))
            .andExpect(jsonPath("$.[*].status").value(hasItem(DEFAULT_STATUS.toString())))
            .andExpect(jsonPath("$.[*].segmentSize").value(hasItem(DEFAULT_SEGMENT_SIZE)))
            .andExpect(jsonPath("$.[*].segmentSizeAfterCommonScrubbing").value(hasItem(DEFAULT_SEGMENT_SIZE_AFTER_COMMON_SCRUBBING)))
            .andExpect(jsonPath("$.[*].segmentSizeAfterCommunicationScrubbing").value(hasItem(DEFAULT_SEGMENT_SIZE_AFTER_COMMUNICATION_SCRUBBING)))
            .andExpect(jsonPath("$.[*].campaignId").value(hasItem(DEFAULT_CAMPAIGN_ID.toString())));
    }

    @Test
    public void getCampaignStat() throws Exception {
        // Initialize the database
        campaignStatRepository.save(campaignStat);

        // Get the campaignStat
        restCampaignStatMockMvc.perform(get("/api/campaign-stats/{id}", campaignStat.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.id").value(campaignStat.getId()))
            .andExpect(jsonPath("$.name").value(DEFAULT_NAME.toString()))
            .andExpect(jsonPath("$.scheduledTime").value(DEFAULT_SCHEDULED_TIME.toString()))
            .andExpect(jsonPath("$.status").value(DEFAULT_STATUS.toString()))
            .andExpect(jsonPath("$.segmentSize").value(DEFAULT_SEGMENT_SIZE))
            .andExpect(jsonPath("$.segmentSizeAfterCommonScrubbing").value(DEFAULT_SEGMENT_SIZE_AFTER_COMMON_SCRUBBING))
            .andExpect(jsonPath("$.segmentSizeAfterCommunicationScrubbing").value(DEFAULT_SEGMENT_SIZE_AFTER_COMMUNICATION_SCRUBBING))
            .andExpect(jsonPath("$.campaignId").value(DEFAULT_CAMPAIGN_ID.toString()));
    }

    @Test
    public void getNonExistingCampaignStat() throws Exception {
        // Get the campaignStat
        restCampaignStatMockMvc.perform(get("/api/campaign-stats/{id}", Long.MAX_VALUE))
            .andExpect(status().isNotFound());
    }

    @Test
    public void updateCampaignStat() throws Exception {
        // Initialize the database
        campaignStatService.save(campaignStat);

        int databaseSizeBeforeUpdate = campaignStatRepository.findAll().size();

        // Update the campaignStat
        CampaignStat updatedCampaignStat = campaignStatRepository.findOne(campaignStat.getId());
        updatedCampaignStat
            .name(UPDATED_NAME)
            .scheduledTime(UPDATED_SCHEDULED_TIME)
            .status(UPDATED_STATUS)
            .segmentSize(UPDATED_SEGMENT_SIZE)
            .segmentSizeAfterCommonScrubbing(UPDATED_SEGMENT_SIZE_AFTER_COMMON_SCRUBBING)
            .segmentSizeAfterCommunicationScrubbing(UPDATED_SEGMENT_SIZE_AFTER_COMMUNICATION_SCRUBBING)
            .campaignId(UPDATED_CAMPAIGN_ID);

        restCampaignStatMockMvc.perform(put("/api/campaign-stats")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(updatedCampaignStat)))
            .andExpect(status().isOk());

        // Validate the CampaignStat in the database
        List<CampaignStat> campaignStatList = campaignStatRepository.findAll();
        assertThat(campaignStatList).hasSize(databaseSizeBeforeUpdate);
        CampaignStat testCampaignStat = campaignStatList.get(campaignStatList.size() - 1);
        assertThat(testCampaignStat.getName()).isEqualTo(UPDATED_NAME);
        assertThat(testCampaignStat.getScheduledTime()).isEqualTo(UPDATED_SCHEDULED_TIME);
        assertThat(testCampaignStat.getStatus()).isEqualTo(UPDATED_STATUS);
        assertThat(testCampaignStat.getSegmentSize()).isEqualTo(UPDATED_SEGMENT_SIZE);
        assertThat(testCampaignStat.getSegmentSizeAfterCommonScrubbing()).isEqualTo(UPDATED_SEGMENT_SIZE_AFTER_COMMON_SCRUBBING);
        assertThat(testCampaignStat.getSegmentSizeAfterCommunicationScrubbing()).isEqualTo(UPDATED_SEGMENT_SIZE_AFTER_COMMUNICATION_SCRUBBING);
        assertThat(testCampaignStat.getCampaignId()).isEqualTo(UPDATED_CAMPAIGN_ID);
    }

    @Test
    public void updateNonExistingCampaignStat() throws Exception {
        int databaseSizeBeforeUpdate = campaignStatRepository.findAll().size();

        // Create the CampaignStat

        // If the entity doesn't have an ID, it will be created instead of just being updated
        restCampaignStatMockMvc.perform(put("/api/campaign-stats")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(campaignStat)))
            .andExpect(status().isCreated());

        // Validate the CampaignStat in the database
        List<CampaignStat> campaignStatList = campaignStatRepository.findAll();
        assertThat(campaignStatList).hasSize(databaseSizeBeforeUpdate + 1);
    }

    @Test
    public void deleteCampaignStat() throws Exception {
        // Initialize the database
        campaignStatService.save(campaignStat);

        int databaseSizeBeforeDelete = campaignStatRepository.findAll().size();

        // Get the campaignStat
        restCampaignStatMockMvc.perform(delete("/api/campaign-stats/{id}", campaignStat.getId())
            .accept(TestUtil.APPLICATION_JSON_UTF8))
            .andExpect(status().isOk());

        // Validate the database is empty
        List<CampaignStat> campaignStatList = campaignStatRepository.findAll();
        assertThat(campaignStatList).hasSize(databaseSizeBeforeDelete - 1);
    }

    @Test
    public void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(CampaignStat.class);
        CampaignStat campaignStat1 = new CampaignStat();
        campaignStat1.setId("id1");
        CampaignStat campaignStat2 = new CampaignStat();
        campaignStat2.setId(campaignStat1.getId());
        assertThat(campaignStat1).isEqualTo(campaignStat2);
        campaignStat2.setId("id2");
        assertThat(campaignStat1).isNotEqualTo(campaignStat2);
        campaignStat1.setId(null);
        assertThat(campaignStat1).isNotEqualTo(campaignStat2);
    }
}
