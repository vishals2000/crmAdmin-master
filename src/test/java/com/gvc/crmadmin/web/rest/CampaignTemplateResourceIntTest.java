package com.gvc.crmadmin.web.rest;

import com.gvc.crmadmin.CrmAdminApp;

import com.gvc.crmadmin.domain.CampaignTemplate;
import com.gvc.crmadmin.repository.CampaignTemplateRepository;
import com.gvc.crmadmin.service.CampaignTemplateService;
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

import java.time.LocalDate;
import java.time.ZoneId;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.gvc.crmadmin.domain.enumeration.Product;
import com.gvc.crmadmin.domain.enumeration.RecurrenceType;
/**
 * Test class for the CampaignTemplateResource REST controller.
 *
 * @see CampaignTemplateResource
 */
@RunWith(SpringRunner.class)
@SpringBootTest(classes = CrmAdminApp.class)
public class CampaignTemplateResourceIntTest {

    private static final String DEFAULT_FRONT_END = "AA";
    private static final String UPDATED_FRONT_END = "BB";

    private static final Product DEFAULT_PRODUCT = Product.CASINO;
    private static final Product UPDATED_PRODUCT = Product.POKER;

    private static final String DEFAULT_CAMPAIGN_NAME = "AAAAAAAAAA";
    private static final String UPDATED_CAMPAIGN_NAME = "BBBBBBBBBB";

    private static final String DEFAULT_CAMPAIGN_DESCRIPTION = "AAAAAAAAAA";
    private static final String UPDATED_CAMPAIGN_DESCRIPTION = "BBBBBBBBBB";

    private static final LocalDate DEFAULT_START_DATE = LocalDate.ofEpochDay(0L);
    private static final LocalDate UPDATED_START_DATE = LocalDate.now(ZoneId.systemDefault());

    private static final RecurrenceType DEFAULT_RECURRENCE_TYPE = RecurrenceType.NONE;
    private static final RecurrenceType UPDATED_RECURRENCE_TYPE = RecurrenceType.WEEKLY;

    private static final LocalDate DEFAULT_RECURRENCE_END_DATE = LocalDate.ofEpochDay(0L);
    private static final LocalDate UPDATED_RECURRENCE_END_DATE = LocalDate.now(ZoneId.systemDefault());

    private static final String DEFAULT_MESSAGE_CONTENT_ID = "AAAAAAAAAA";
    private static final String UPDATED_MESSAGE_CONTENT_ID = "BBBBBBBBBB";

    private static final String DEFAULT_TARGET_GROUP_ID = "AAAAAAAAAA";
    private static final String UPDATED_TARGET_GROUP_ID = "BBBBBBBBBB";

    private static final String DEFAULT_SCHEDULED_TIME = "AAAAAAAAAA";
    private static final String UPDATED_SCHEDULED_TIME = "BBBBBBBBBB";

    private static final Boolean DEFAULT_IN_PLAYER_TIMEZONE = false;
    private static final Boolean UPDATED_IN_PLAYER_TIMEZONE = true;

    private static final String DEFAULT_CAMPAIGN_GROUP_ID = "AAAAAAAAAA";
    private static final String UPDATED_CAMPAIGN_GROUP_ID = "BBBBBBBBBB";

    @Autowired
    private CampaignTemplateRepository campaignTemplateRepository;

    @Autowired
    private CampaignTemplateService campaignTemplateService;

    @Autowired
    private MappingJackson2HttpMessageConverter jacksonMessageConverter;

    @Autowired
    private PageableHandlerMethodArgumentResolver pageableArgumentResolver;

    @Autowired
    private ExceptionTranslator exceptionTranslator;

    private MockMvc restCampaignTemplateMockMvc;

    private CampaignTemplate campaignTemplate;

    @Before
    public void setup() {
        MockitoAnnotations.initMocks(this);
        final CampaignTemplateResource campaignTemplateResource = new CampaignTemplateResource(campaignTemplateService);
        this.restCampaignTemplateMockMvc = MockMvcBuilders.standaloneSetup(campaignTemplateResource)
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
    public static CampaignTemplate createEntity() {
        CampaignTemplate campaignTemplate = new CampaignTemplate()
            .frontEnd(DEFAULT_FRONT_END)
            .product(DEFAULT_PRODUCT)
            .campaignName(DEFAULT_CAMPAIGN_NAME)
            .campaignDescription(DEFAULT_CAMPAIGN_DESCRIPTION)
            .startDate(DEFAULT_START_DATE)
            .recurrenceType(DEFAULT_RECURRENCE_TYPE)
            .recurrenceEndDate(DEFAULT_RECURRENCE_END_DATE)
            .messageContentId(DEFAULT_MESSAGE_CONTENT_ID)
            .targetGroupId(DEFAULT_TARGET_GROUP_ID)
            .scheduledTime(DEFAULT_SCHEDULED_TIME)
            .inPlayerTimezone(DEFAULT_IN_PLAYER_TIMEZONE)
            .campaignGroupId(DEFAULT_CAMPAIGN_GROUP_ID);
        return campaignTemplate;
    }

    @Before
    public void initTest() {
        campaignTemplateRepository.deleteAll();
        campaignTemplate = createEntity();
    }

    @Test
    public void createCampaignTemplate() throws Exception {
        int databaseSizeBeforeCreate = campaignTemplateRepository.findAll().size();

        // Create the CampaignTemplate
        restCampaignTemplateMockMvc.perform(post("/api/campaign-templates")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(campaignTemplate)))
            .andExpect(status().isCreated());

        // Validate the CampaignTemplate in the database
        List<CampaignTemplate> campaignTemplateList = campaignTemplateRepository.findAll();
        assertThat(campaignTemplateList).hasSize(databaseSizeBeforeCreate + 1);
        CampaignTemplate testCampaignTemplate = campaignTemplateList.get(campaignTemplateList.size() - 1);
        assertThat(testCampaignTemplate.getFrontEnd()).isEqualTo(DEFAULT_FRONT_END);
        assertThat(testCampaignTemplate.getProduct()).isEqualTo(DEFAULT_PRODUCT);
        assertThat(testCampaignTemplate.getCampaignName()).isEqualTo(DEFAULT_CAMPAIGN_NAME);
        assertThat(testCampaignTemplate.getCampaignDescription()).isEqualTo(DEFAULT_CAMPAIGN_DESCRIPTION);
        assertThat(testCampaignTemplate.getStartDate()).isEqualTo(DEFAULT_START_DATE);
        assertThat(testCampaignTemplate.getRecurrenceType()).isEqualTo(DEFAULT_RECURRENCE_TYPE);
        assertThat(testCampaignTemplate.getRecurrenceEndDate()).isEqualTo(DEFAULT_RECURRENCE_END_DATE);
        assertThat(testCampaignTemplate.getMessageContentId()).isEqualTo(DEFAULT_MESSAGE_CONTENT_ID);
        assertThat(testCampaignTemplate.getTargetGroupId()).isEqualTo(DEFAULT_TARGET_GROUP_ID);
        assertThat(testCampaignTemplate.getScheduledTime()).isEqualTo(DEFAULT_SCHEDULED_TIME);
        assertThat(testCampaignTemplate.isInPlayerTimezone()).isEqualTo(DEFAULT_IN_PLAYER_TIMEZONE);
        assertThat(testCampaignTemplate.getCampaignGroupId()).isEqualTo(DEFAULT_CAMPAIGN_GROUP_ID);
    }

    @Test
    public void createCampaignTemplateWithExistingId() throws Exception {
        int databaseSizeBeforeCreate = campaignTemplateRepository.findAll().size();

        // Create the CampaignTemplate with an existing ID
        campaignTemplate.setId("existing_id");

        // An entity with an existing ID cannot be created, so this API call must fail
        restCampaignTemplateMockMvc.perform(post("/api/campaign-templates")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(campaignTemplate)))
            .andExpect(status().isBadRequest());

        // Validate the Alice in the database
        List<CampaignTemplate> campaignTemplateList = campaignTemplateRepository.findAll();
        assertThat(campaignTemplateList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    public void checkFrontEndIsRequired() throws Exception {
        int databaseSizeBeforeTest = campaignTemplateRepository.findAll().size();
        // set the field null
        campaignTemplate.setFrontEnd(null);

        // Create the CampaignTemplate, which fails.

        restCampaignTemplateMockMvc.perform(post("/api/campaign-templates")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(campaignTemplate)))
            .andExpect(status().isBadRequest());

        List<CampaignTemplate> campaignTemplateList = campaignTemplateRepository.findAll();
        assertThat(campaignTemplateList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    public void checkProductIsRequired() throws Exception {
        int databaseSizeBeforeTest = campaignTemplateRepository.findAll().size();
        // set the field null
        campaignTemplate.setProduct(null);

        // Create the CampaignTemplate, which fails.

        restCampaignTemplateMockMvc.perform(post("/api/campaign-templates")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(campaignTemplate)))
            .andExpect(status().isBadRequest());

        List<CampaignTemplate> campaignTemplateList = campaignTemplateRepository.findAll();
        assertThat(campaignTemplateList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    public void checkCampaignNameIsRequired() throws Exception {
        int databaseSizeBeforeTest = campaignTemplateRepository.findAll().size();
        // set the field null
        campaignTemplate.setCampaignName(null);

        // Create the CampaignTemplate, which fails.

        restCampaignTemplateMockMvc.perform(post("/api/campaign-templates")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(campaignTemplate)))
            .andExpect(status().isBadRequest());

        List<CampaignTemplate> campaignTemplateList = campaignTemplateRepository.findAll();
        assertThat(campaignTemplateList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    public void checkStartDateIsRequired() throws Exception {
        int databaseSizeBeforeTest = campaignTemplateRepository.findAll().size();
        // set the field null
        campaignTemplate.setStartDate(null);

        // Create the CampaignTemplate, which fails.

        restCampaignTemplateMockMvc.perform(post("/api/campaign-templates")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(campaignTemplate)))
            .andExpect(status().isBadRequest());

        List<CampaignTemplate> campaignTemplateList = campaignTemplateRepository.findAll();
        assertThat(campaignTemplateList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    public void checkRecurrenceTypeIsRequired() throws Exception {
        int databaseSizeBeforeTest = campaignTemplateRepository.findAll().size();
        // set the field null
        campaignTemplate.setRecurrenceType(null);

        // Create the CampaignTemplate, which fails.

        restCampaignTemplateMockMvc.perform(post("/api/campaign-templates")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(campaignTemplate)))
            .andExpect(status().isBadRequest());

        List<CampaignTemplate> campaignTemplateList = campaignTemplateRepository.findAll();
        assertThat(campaignTemplateList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    public void checkRecurrenceEndDateIsRequired() throws Exception {
        int databaseSizeBeforeTest = campaignTemplateRepository.findAll().size();
        // set the field null
        campaignTemplate.setRecurrenceEndDate(null);

        // Create the CampaignTemplate, which fails.

        restCampaignTemplateMockMvc.perform(post("/api/campaign-templates")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(campaignTemplate)))
            .andExpect(status().isBadRequest());

        List<CampaignTemplate> campaignTemplateList = campaignTemplateRepository.findAll();
        assertThat(campaignTemplateList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    public void checkMessageContentIdIsRequired() throws Exception {
        int databaseSizeBeforeTest = campaignTemplateRepository.findAll().size();
        // set the field null
        campaignTemplate.setMessageContentId(null);

        // Create the CampaignTemplate, which fails.

        restCampaignTemplateMockMvc.perform(post("/api/campaign-templates")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(campaignTemplate)))
            .andExpect(status().isBadRequest());

        List<CampaignTemplate> campaignTemplateList = campaignTemplateRepository.findAll();
        assertThat(campaignTemplateList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    public void checkTargetGroupIdIsRequired() throws Exception {
        int databaseSizeBeforeTest = campaignTemplateRepository.findAll().size();
        // set the field null
        campaignTemplate.setTargetGroupId(null);

        // Create the CampaignTemplate, which fails.

        restCampaignTemplateMockMvc.perform(post("/api/campaign-templates")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(campaignTemplate)))
            .andExpect(status().isBadRequest());

        List<CampaignTemplate> campaignTemplateList = campaignTemplateRepository.findAll();
        assertThat(campaignTemplateList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    public void checkScheduledTimeIsRequired() throws Exception {
        int databaseSizeBeforeTest = campaignTemplateRepository.findAll().size();
        // set the field null
        campaignTemplate.setScheduledTime(null);

        // Create the CampaignTemplate, which fails.

        restCampaignTemplateMockMvc.perform(post("/api/campaign-templates")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(campaignTemplate)))
            .andExpect(status().isBadRequest());

        List<CampaignTemplate> campaignTemplateList = campaignTemplateRepository.findAll();
        assertThat(campaignTemplateList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    public void getAllCampaignTemplates() throws Exception {
        // Initialize the database
        campaignTemplateRepository.save(campaignTemplate);

        // Get all the campaignTemplateList
        restCampaignTemplateMockMvc.perform(get("/api/campaign-templates?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(campaignTemplate.getId())))
            .andExpect(jsonPath("$.[*].frontEnd").value(hasItem(DEFAULT_FRONT_END.toString())))
            .andExpect(jsonPath("$.[*].product").value(hasItem(DEFAULT_PRODUCT.toString())))
            .andExpect(jsonPath("$.[*].campaignName").value(hasItem(DEFAULT_CAMPAIGN_NAME.toString())))
            .andExpect(jsonPath("$.[*].campaignDescription").value(hasItem(DEFAULT_CAMPAIGN_DESCRIPTION.toString())))
            .andExpect(jsonPath("$.[*].startDate").value(hasItem(DEFAULT_START_DATE.toString())))
            .andExpect(jsonPath("$.[*].recurrenceType").value(hasItem(DEFAULT_RECURRENCE_TYPE.toString())))
            .andExpect(jsonPath("$.[*].recurrenceEndDate").value(hasItem(DEFAULT_RECURRENCE_END_DATE.toString())))
            .andExpect(jsonPath("$.[*].messageContentId").value(hasItem(DEFAULT_MESSAGE_CONTENT_ID.toString())))
            .andExpect(jsonPath("$.[*].targetGroupId").value(hasItem(DEFAULT_TARGET_GROUP_ID.toString())))
            .andExpect(jsonPath("$.[*].scheduledTime").value(hasItem(DEFAULT_SCHEDULED_TIME.toString())))
            .andExpect(jsonPath("$.[*].inPlayerTimezone").value(hasItem(DEFAULT_IN_PLAYER_TIMEZONE.booleanValue())))
            .andExpect(jsonPath("$.[*].campaignGroupId").value(hasItem(DEFAULT_CAMPAIGN_GROUP_ID.toString())));
    }

    @Test
    public void getCampaignTemplate() throws Exception {
        // Initialize the database
        campaignTemplateRepository.save(campaignTemplate);

        // Get the campaignTemplate
        restCampaignTemplateMockMvc.perform(get("/api/campaign-templates/{id}", campaignTemplate.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.id").value(campaignTemplate.getId()))
            .andExpect(jsonPath("$.frontEnd").value(DEFAULT_FRONT_END.toString()))
            .andExpect(jsonPath("$.product").value(DEFAULT_PRODUCT.toString()))
            .andExpect(jsonPath("$.campaignName").value(DEFAULT_CAMPAIGN_NAME.toString()))
            .andExpect(jsonPath("$.campaignDescription").value(DEFAULT_CAMPAIGN_DESCRIPTION.toString()))
            .andExpect(jsonPath("$.startDate").value(DEFAULT_START_DATE.toString()))
            .andExpect(jsonPath("$.recurrenceType").value(DEFAULT_RECURRENCE_TYPE.toString()))
            .andExpect(jsonPath("$.recurrenceEndDate").value(DEFAULT_RECURRENCE_END_DATE.toString()))
            .andExpect(jsonPath("$.messageContentId").value(DEFAULT_MESSAGE_CONTENT_ID.toString()))
            .andExpect(jsonPath("$.targetGroupId").value(DEFAULT_TARGET_GROUP_ID.toString()))
            .andExpect(jsonPath("$.scheduledTime").value(DEFAULT_SCHEDULED_TIME.toString()))
            .andExpect(jsonPath("$.inPlayerTimezone").value(DEFAULT_IN_PLAYER_TIMEZONE.booleanValue()))
            .andExpect(jsonPath("$.campaignGroupId").value(DEFAULT_CAMPAIGN_GROUP_ID.toString()));
    }

    @Test
    public void getNonExistingCampaignTemplate() throws Exception {
        // Get the campaignTemplate
        restCampaignTemplateMockMvc.perform(get("/api/campaign-templates/{id}", Long.MAX_VALUE))
            .andExpect(status().isNotFound());
    }

    @Test
    public void updateCampaignTemplate() throws Exception {
        // Initialize the database
        campaignTemplateService.save(campaignTemplate);

        int databaseSizeBeforeUpdate = campaignTemplateRepository.findAll().size();

        // Update the campaignTemplate
        CampaignTemplate updatedCampaignTemplate = campaignTemplateRepository.findOne(campaignTemplate.getId());
        updatedCampaignTemplate
            .frontEnd(UPDATED_FRONT_END)
            .product(UPDATED_PRODUCT)
            .campaignName(UPDATED_CAMPAIGN_NAME)
            .campaignDescription(UPDATED_CAMPAIGN_DESCRIPTION)
            .startDate(UPDATED_START_DATE)
            .recurrenceType(UPDATED_RECURRENCE_TYPE)
            .recurrenceEndDate(UPDATED_RECURRENCE_END_DATE)
            .messageContentId(UPDATED_MESSAGE_CONTENT_ID)
            .targetGroupId(UPDATED_TARGET_GROUP_ID)
            .scheduledTime(UPDATED_SCHEDULED_TIME)
            .inPlayerTimezone(UPDATED_IN_PLAYER_TIMEZONE)
            .campaignGroupId(UPDATED_CAMPAIGN_GROUP_ID);

        restCampaignTemplateMockMvc.perform(put("/api/campaign-templates")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(updatedCampaignTemplate)))
            .andExpect(status().isOk());

        // Validate the CampaignTemplate in the database
        List<CampaignTemplate> campaignTemplateList = campaignTemplateRepository.findAll();
        assertThat(campaignTemplateList).hasSize(databaseSizeBeforeUpdate);
        CampaignTemplate testCampaignTemplate = campaignTemplateList.get(campaignTemplateList.size() - 1);
        assertThat(testCampaignTemplate.getFrontEnd()).isEqualTo(UPDATED_FRONT_END);
        assertThat(testCampaignTemplate.getProduct()).isEqualTo(UPDATED_PRODUCT);
        assertThat(testCampaignTemplate.getCampaignName()).isEqualTo(UPDATED_CAMPAIGN_NAME);
        assertThat(testCampaignTemplate.getCampaignDescription()).isEqualTo(UPDATED_CAMPAIGN_DESCRIPTION);
        assertThat(testCampaignTemplate.getStartDate()).isEqualTo(UPDATED_START_DATE);
        assertThat(testCampaignTemplate.getRecurrenceType()).isEqualTo(UPDATED_RECURRENCE_TYPE);
        assertThat(testCampaignTemplate.getRecurrenceEndDate()).isEqualTo(UPDATED_RECURRENCE_END_DATE);
        assertThat(testCampaignTemplate.getMessageContentId()).isEqualTo(UPDATED_MESSAGE_CONTENT_ID);
        assertThat(testCampaignTemplate.getTargetGroupId()).isEqualTo(UPDATED_TARGET_GROUP_ID);
        assertThat(testCampaignTemplate.getScheduledTime()).isEqualTo(UPDATED_SCHEDULED_TIME);
        assertThat(testCampaignTemplate.isInPlayerTimezone()).isEqualTo(UPDATED_IN_PLAYER_TIMEZONE);
        assertThat(testCampaignTemplate.getCampaignGroupId()).isEqualTo(UPDATED_CAMPAIGN_GROUP_ID);
    }

    @Test
    public void updateNonExistingCampaignTemplate() throws Exception {
        int databaseSizeBeforeUpdate = campaignTemplateRepository.findAll().size();

        // Create the CampaignTemplate

        // If the entity doesn't have an ID, it will be created instead of just being updated
        restCampaignTemplateMockMvc.perform(put("/api/campaign-templates")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(campaignTemplate)))
            .andExpect(status().isCreated());

        // Validate the CampaignTemplate in the database
        List<CampaignTemplate> campaignTemplateList = campaignTemplateRepository.findAll();
        assertThat(campaignTemplateList).hasSize(databaseSizeBeforeUpdate + 1);
    }

    @Test
    public void deleteCampaignTemplate() throws Exception {
        // Initialize the database
        campaignTemplateService.save(campaignTemplate);

        int databaseSizeBeforeDelete = campaignTemplateRepository.findAll().size();

        // Get the campaignTemplate
        restCampaignTemplateMockMvc.perform(delete("/api/campaign-templates/{id}", campaignTemplate.getId())
            .accept(TestUtil.APPLICATION_JSON_UTF8))
            .andExpect(status().isOk());

        // Validate the database is empty
        List<CampaignTemplate> campaignTemplateList = campaignTemplateRepository.findAll();
        assertThat(campaignTemplateList).hasSize(databaseSizeBeforeDelete - 1);
    }

    @Test
    public void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(CampaignTemplate.class);
        CampaignTemplate campaignTemplate1 = new CampaignTemplate();
        campaignTemplate1.setId("id1");
        CampaignTemplate campaignTemplate2 = new CampaignTemplate();
        campaignTemplate2.setId(campaignTemplate1.getId());
        assertThat(campaignTemplate1).isEqualTo(campaignTemplate2);
        campaignTemplate2.setId("id2");
        assertThat(campaignTemplate1).isNotEqualTo(campaignTemplate2);
        campaignTemplate1.setId(null);
        assertThat(campaignTemplate1).isNotEqualTo(campaignTemplate2);
    }
}
