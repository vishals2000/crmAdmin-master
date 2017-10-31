package com.gvc.crmadmin.web.rest;

import com.gvc.crmadmin.CrmAdminApp;

import com.gvc.crmadmin.domain.EventCriteria;
import com.gvc.crmadmin.repository.EventCriteriaRepository;
import com.gvc.crmadmin.service.EventCriteriaService;
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
 * Test class for the EventCriteriaResource REST controller.
 *
 * @see EventCriteriaResource
 */
@RunWith(SpringRunner.class)
@SpringBootTest(classes = CrmAdminApp.class)
public class EventCriteriaResourceIntTest {

    private static final String DEFAULT_FRONT_END = "AA";
    private static final String UPDATED_FRONT_END = "BB";

    private static final Product DEFAULT_PRODUCT = Product.CASINO;
    private static final Product UPDATED_PRODUCT = Product.POKER;

    private static final String DEFAULT_EVENT_NAME = "AAAAAAAAAA";
    private static final String UPDATED_EVENT_NAME = "BBBBBBBBBB";

    private static final String DEFAULT_EVENT_COMPARISON = "AAAAAAAAAA";
    private static final String UPDATED_EVENT_COMPARISON = "BBBBBBBBBB";

    private static final String DEFAULT_EVENT_VALUE = "AAAAAAAAAA";
    private static final String UPDATED_EVENT_VALUE = "BBBBBBBBBB";

    @Autowired
    private EventCriteriaRepository eventCriteriaRepository;

    @Autowired
    private EventCriteriaService eventCriteriaService;

    @Autowired
    private MappingJackson2HttpMessageConverter jacksonMessageConverter;

    @Autowired
    private PageableHandlerMethodArgumentResolver pageableArgumentResolver;

    @Autowired
    private ExceptionTranslator exceptionTranslator;

    private MockMvc restEventCriteriaMockMvc;

    private EventCriteria eventCriteria;

    @Before
    public void setup() {
        MockitoAnnotations.initMocks(this);
        final EventCriteriaResource eventCriteriaResource = new EventCriteriaResource(eventCriteriaService);
        this.restEventCriteriaMockMvc = MockMvcBuilders.standaloneSetup(eventCriteriaResource)
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
    public static EventCriteria createEntity() {
        EventCriteria eventCriteria = new EventCriteria()
            .frontEnd(DEFAULT_FRONT_END)
            .product(DEFAULT_PRODUCT)
            .eventName(DEFAULT_EVENT_NAME)
            .eventComparison(DEFAULT_EVENT_COMPARISON)
            .eventValue(DEFAULT_EVENT_VALUE);
        return eventCriteria;
    }

    @Before
    public void initTest() {
        eventCriteriaRepository.deleteAll();
        eventCriteria = createEntity();
    }

    @Test
    public void createEventCriteria() throws Exception {
        int databaseSizeBeforeCreate = eventCriteriaRepository.findAll().size();

        // Create the EventCriteria
        restEventCriteriaMockMvc.perform(post("/api/event-criteria")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(eventCriteria)))
            .andExpect(status().isCreated());

        // Validate the EventCriteria in the database
        List<EventCriteria> eventCriteriaList = eventCriteriaRepository.findAll();
        assertThat(eventCriteriaList).hasSize(databaseSizeBeforeCreate + 1);
        EventCriteria testEventCriteria = eventCriteriaList.get(eventCriteriaList.size() - 1);
        assertThat(testEventCriteria.getFrontEnd()).isEqualTo(DEFAULT_FRONT_END);
        assertThat(testEventCriteria.getProduct()).isEqualTo(DEFAULT_PRODUCT);
        assertThat(testEventCriteria.getEventName()).isEqualTo(DEFAULT_EVENT_NAME);
        assertThat(testEventCriteria.getEventComparison()).isEqualTo(DEFAULT_EVENT_COMPARISON);
        assertThat(testEventCriteria.getEventValue()).isEqualTo(DEFAULT_EVENT_VALUE);
    }

    @Test
    public void createEventCriteriaWithExistingId() throws Exception {
        int databaseSizeBeforeCreate = eventCriteriaRepository.findAll().size();

        // Create the EventCriteria with an existing ID
        eventCriteria.setId("existing_id");

        // An entity with an existing ID cannot be created, so this API call must fail
        restEventCriteriaMockMvc.perform(post("/api/event-criteria")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(eventCriteria)))
            .andExpect(status().isBadRequest());

        // Validate the Alice in the database
        List<EventCriteria> eventCriteriaList = eventCriteriaRepository.findAll();
        assertThat(eventCriteriaList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    public void checkFrontEndIsRequired() throws Exception {
        int databaseSizeBeforeTest = eventCriteriaRepository.findAll().size();
        // set the field null
        eventCriteria.setFrontEnd(null);

        // Create the EventCriteria, which fails.

        restEventCriteriaMockMvc.perform(post("/api/event-criteria")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(eventCriteria)))
            .andExpect(status().isBadRequest());

        List<EventCriteria> eventCriteriaList = eventCriteriaRepository.findAll();
        assertThat(eventCriteriaList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    public void checkProductIsRequired() throws Exception {
        int databaseSizeBeforeTest = eventCriteriaRepository.findAll().size();
        // set the field null
        eventCriteria.setProduct(null);

        // Create the EventCriteria, which fails.

        restEventCriteriaMockMvc.perform(post("/api/event-criteria")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(eventCriteria)))
            .andExpect(status().isBadRequest());

        List<EventCriteria> eventCriteriaList = eventCriteriaRepository.findAll();
        assertThat(eventCriteriaList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    public void checkEventNameIsRequired() throws Exception {
        int databaseSizeBeforeTest = eventCriteriaRepository.findAll().size();
        // set the field null
        eventCriteria.setEventName(null);

        // Create the EventCriteria, which fails.

        restEventCriteriaMockMvc.perform(post("/api/event-criteria")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(eventCriteria)))
            .andExpect(status().isBadRequest());

        List<EventCriteria> eventCriteriaList = eventCriteriaRepository.findAll();
        assertThat(eventCriteriaList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    public void checkEventComparisonIsRequired() throws Exception {
        int databaseSizeBeforeTest = eventCriteriaRepository.findAll().size();
        // set the field null
        eventCriteria.setEventComparison(null);

        // Create the EventCriteria, which fails.

        restEventCriteriaMockMvc.perform(post("/api/event-criteria")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(eventCriteria)))
            .andExpect(status().isBadRequest());

        List<EventCriteria> eventCriteriaList = eventCriteriaRepository.findAll();
        assertThat(eventCriteriaList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    public void checkEventValueIsRequired() throws Exception {
        int databaseSizeBeforeTest = eventCriteriaRepository.findAll().size();
        // set the field null
        eventCriteria.setEventValue(null);

        // Create the EventCriteria, which fails.

        restEventCriteriaMockMvc.perform(post("/api/event-criteria")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(eventCriteria)))
            .andExpect(status().isBadRequest());

        List<EventCriteria> eventCriteriaList = eventCriteriaRepository.findAll();
        assertThat(eventCriteriaList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    public void getAllEventCriteria() throws Exception {
        // Initialize the database
        eventCriteriaRepository.save(eventCriteria);

        // Get all the eventCriteriaList
        restEventCriteriaMockMvc.perform(get("/api/event-criteria?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(eventCriteria.getId())))
            .andExpect(jsonPath("$.[*].frontEnd").value(hasItem(DEFAULT_FRONT_END.toString())))
            .andExpect(jsonPath("$.[*].product").value(hasItem(DEFAULT_PRODUCT.toString())))
            .andExpect(jsonPath("$.[*].eventName").value(hasItem(DEFAULT_EVENT_NAME.toString())))
            .andExpect(jsonPath("$.[*].eventComparison").value(hasItem(DEFAULT_EVENT_COMPARISON.toString())))
            .andExpect(jsonPath("$.[*].eventValue").value(hasItem(DEFAULT_EVENT_VALUE.toString())));
    }

    @Test
    public void getEventCriteria() throws Exception {
        // Initialize the database
        eventCriteriaRepository.save(eventCriteria);

        // Get the eventCriteria
        restEventCriteriaMockMvc.perform(get("/api/event-criteria/{id}", eventCriteria.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.id").value(eventCriteria.getId()))
            .andExpect(jsonPath("$.frontEnd").value(DEFAULT_FRONT_END.toString()))
            .andExpect(jsonPath("$.product").value(DEFAULT_PRODUCT.toString()))
            .andExpect(jsonPath("$.eventName").value(DEFAULT_EVENT_NAME.toString()))
            .andExpect(jsonPath("$.eventComparison").value(DEFAULT_EVENT_COMPARISON.toString()))
            .andExpect(jsonPath("$.eventValue").value(DEFAULT_EVENT_VALUE.toString()));
    }

    @Test
    public void getNonExistingEventCriteria() throws Exception {
        // Get the eventCriteria
        restEventCriteriaMockMvc.perform(get("/api/event-criteria/{id}", Long.MAX_VALUE))
            .andExpect(status().isNotFound());
    }

    @Test
    public void updateEventCriteria() throws Exception {
        // Initialize the database
        eventCriteriaService.save(eventCriteria);

        int databaseSizeBeforeUpdate = eventCriteriaRepository.findAll().size();

        // Update the eventCriteria
        EventCriteria updatedEventCriteria = eventCriteriaRepository.findOne(eventCriteria.getId());
        updatedEventCriteria
            .frontEnd(UPDATED_FRONT_END)
            .product(UPDATED_PRODUCT)
            .eventName(UPDATED_EVENT_NAME)
            .eventComparison(UPDATED_EVENT_COMPARISON)
            .eventValue(UPDATED_EVENT_VALUE);

        restEventCriteriaMockMvc.perform(put("/api/event-criteria")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(updatedEventCriteria)))
            .andExpect(status().isOk());

        // Validate the EventCriteria in the database
        List<EventCriteria> eventCriteriaList = eventCriteriaRepository.findAll();
        assertThat(eventCriteriaList).hasSize(databaseSizeBeforeUpdate);
        EventCriteria testEventCriteria = eventCriteriaList.get(eventCriteriaList.size() - 1);
        assertThat(testEventCriteria.getFrontEnd()).isEqualTo(UPDATED_FRONT_END);
        assertThat(testEventCriteria.getProduct()).isEqualTo(UPDATED_PRODUCT);
        assertThat(testEventCriteria.getEventName()).isEqualTo(UPDATED_EVENT_NAME);
        assertThat(testEventCriteria.getEventComparison()).isEqualTo(UPDATED_EVENT_COMPARISON);
        assertThat(testEventCriteria.getEventValue()).isEqualTo(UPDATED_EVENT_VALUE);
    }

    @Test
    public void updateNonExistingEventCriteria() throws Exception {
        int databaseSizeBeforeUpdate = eventCriteriaRepository.findAll().size();

        // Create the EventCriteria

        // If the entity doesn't have an ID, it will be created instead of just being updated
        restEventCriteriaMockMvc.perform(put("/api/event-criteria")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(eventCriteria)))
            .andExpect(status().isCreated());

        // Validate the EventCriteria in the database
        List<EventCriteria> eventCriteriaList = eventCriteriaRepository.findAll();
        assertThat(eventCriteriaList).hasSize(databaseSizeBeforeUpdate + 1);
    }

    @Test
    public void deleteEventCriteria() throws Exception {
        // Initialize the database
        eventCriteriaService.save(eventCriteria);

        int databaseSizeBeforeDelete = eventCriteriaRepository.findAll().size();

        // Get the eventCriteria
        restEventCriteriaMockMvc.perform(delete("/api/event-criteria/{id}", eventCriteria.getId())
            .accept(TestUtil.APPLICATION_JSON_UTF8))
            .andExpect(status().isOk());

        // Validate the database is empty
        List<EventCriteria> eventCriteriaList = eventCriteriaRepository.findAll();
        assertThat(eventCriteriaList).hasSize(databaseSizeBeforeDelete - 1);
    }

    @Test
    public void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(EventCriteria.class);
        EventCriteria eventCriteria1 = new EventCriteria();
        eventCriteria1.setId("id1");
        EventCriteria eventCriteria2 = new EventCriteria();
        eventCriteria2.setId(eventCriteria1.getId());
        assertThat(eventCriteria1).isEqualTo(eventCriteria2);
        eventCriteria2.setId("id2");
        assertThat(eventCriteria1).isNotEqualTo(eventCriteria2);
        eventCriteria1.setId(null);
        assertThat(eventCriteria1).isNotEqualTo(eventCriteria2);
    }
}
