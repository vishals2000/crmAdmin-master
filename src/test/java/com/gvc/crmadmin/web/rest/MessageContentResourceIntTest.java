package com.gvc.crmadmin.web.rest;

import com.gvc.crmadmin.CrmAdminApp;

import com.gvc.crmadmin.domain.MessageContent;
import com.gvc.crmadmin.repository.MessageContentRepository;
import com.gvc.crmadmin.service.MessageContentService;
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
 * Test class for the MessageContentResource REST controller.
 *
 * @see MessageContentResource
 */
@RunWith(SpringRunner.class)
@SpringBootTest(classes = CrmAdminApp.class)
public class MessageContentResourceIntTest {

    private static final String DEFAULT_FRONT_END = "AA";
    private static final String UPDATED_FRONT_END = "BB";

    private static final Product DEFAULT_PRODUCT = Product.CASINO;
    private static final Product UPDATED_PRODUCT = Product.POKER;

    private static final String DEFAULT_CONTENT_NAME = "AAAAAAAAAA";
    private static final String UPDATED_CONTENT_NAME = "BBBBBBBBBB";

    private static final String DEFAULT_CONTENT_TITLE = "AAAAAAAAAA";
    private static final String UPDATED_CONTENT_TITLE = "BBBBBBBBBB";

    private static final String DEFAULT_CONTENT_BODY = "AAAAAAAAAA";
    private static final String UPDATED_CONTENT_BODY = "BBBBBBBBBB";

    private static final String DEFAULT_META_DATA = "AAAAAAAAAA";
    private static final String UPDATED_META_DATA = "BBBBBBBBBB";

    private static final String DEFAULT_LANGUAGE = "AAAAAAAAAA";
    private static final String UPDATED_LANGUAGE = "BBBBBBBBBB";

    @Autowired
    private MessageContentRepository messageContentRepository;

    @Autowired
    private MessageContentService messageContentService;

    @Autowired
    private MappingJackson2HttpMessageConverter jacksonMessageConverter;

    @Autowired
    private PageableHandlerMethodArgumentResolver pageableArgumentResolver;

    @Autowired
    private ExceptionTranslator exceptionTranslator;

    private MockMvc restMessageContentMockMvc;

    private MessageContent messageContent;

    @Before
    public void setup() {
        MockitoAnnotations.initMocks(this);
        final MessageContentResource messageContentResource = new MessageContentResource(messageContentService);
        this.restMessageContentMockMvc = MockMvcBuilders.standaloneSetup(messageContentResource)
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
    public static MessageContent createEntity() {
        MessageContent messageContent = new MessageContent()
            .frontEnd(DEFAULT_FRONT_END)
            .product(DEFAULT_PRODUCT)
            .contentName(DEFAULT_CONTENT_NAME)
            .contentTitle(DEFAULT_CONTENT_TITLE)
            .contentBody(DEFAULT_CONTENT_BODY)
            .metaData(DEFAULT_META_DATA)
            .language(DEFAULT_LANGUAGE);
        return messageContent;
    }

    @Before
    public void initTest() {
        messageContentRepository.deleteAll();
        messageContent = createEntity();
    }

    @Test
    public void createMessageContent() throws Exception {
        int databaseSizeBeforeCreate = messageContentRepository.findAll().size();

        // Create the MessageContent
        restMessageContentMockMvc.perform(post("/api/message-contents")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(messageContent)))
            .andExpect(status().isCreated());

        // Validate the MessageContent in the database
        List<MessageContent> messageContentList = messageContentRepository.findAll();
        assertThat(messageContentList).hasSize(databaseSizeBeforeCreate + 1);
        MessageContent testMessageContent = messageContentList.get(messageContentList.size() - 1);
        assertThat(testMessageContent.getFrontEnd()).isEqualTo(DEFAULT_FRONT_END);
        assertThat(testMessageContent.getProduct()).isEqualTo(DEFAULT_PRODUCT);
        assertThat(testMessageContent.getContentName()).isEqualTo(DEFAULT_CONTENT_NAME);
        assertThat(testMessageContent.getContentTitle()).isEqualTo(DEFAULT_CONTENT_TITLE);
        assertThat(testMessageContent.getContentBody()).isEqualTo(DEFAULT_CONTENT_BODY);
        assertThat(testMessageContent.getMetaData()).isEqualTo(DEFAULT_META_DATA);
        assertThat(testMessageContent.getLanguage()).isEqualTo(DEFAULT_LANGUAGE);
    }

    @Test
    public void createMessageContentWithExistingId() throws Exception {
        int databaseSizeBeforeCreate = messageContentRepository.findAll().size();

        // Create the MessageContent with an existing ID
        messageContent.setId("existing_id");

        // An entity with an existing ID cannot be created, so this API call must fail
        restMessageContentMockMvc.perform(post("/api/message-contents")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(messageContent)))
            .andExpect(status().isBadRequest());

        // Validate the Alice in the database
        List<MessageContent> messageContentList = messageContentRepository.findAll();
        assertThat(messageContentList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    public void checkFrontEndIsRequired() throws Exception {
        int databaseSizeBeforeTest = messageContentRepository.findAll().size();
        // set the field null
        messageContent.setFrontEnd(null);

        // Create the MessageContent, which fails.

        restMessageContentMockMvc.perform(post("/api/message-contents")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(messageContent)))
            .andExpect(status().isBadRequest());

        List<MessageContent> messageContentList = messageContentRepository.findAll();
        assertThat(messageContentList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    public void checkProductIsRequired() throws Exception {
        int databaseSizeBeforeTest = messageContentRepository.findAll().size();
        // set the field null
        messageContent.setProduct(null);

        // Create the MessageContent, which fails.

        restMessageContentMockMvc.perform(post("/api/message-contents")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(messageContent)))
            .andExpect(status().isBadRequest());

        List<MessageContent> messageContentList = messageContentRepository.findAll();
        assertThat(messageContentList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    public void checkContentNameIsRequired() throws Exception {
        int databaseSizeBeforeTest = messageContentRepository.findAll().size();
        // set the field null
        messageContent.setContentName(null);

        // Create the MessageContent, which fails.

        restMessageContentMockMvc.perform(post("/api/message-contents")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(messageContent)))
            .andExpect(status().isBadRequest());

        List<MessageContent> messageContentList = messageContentRepository.findAll();
        assertThat(messageContentList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    public void checkContentTitleIsRequired() throws Exception {
        int databaseSizeBeforeTest = messageContentRepository.findAll().size();
        // set the field null
        messageContent.setContentTitle(null);

        // Create the MessageContent, which fails.

        restMessageContentMockMvc.perform(post("/api/message-contents")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(messageContent)))
            .andExpect(status().isBadRequest());

        List<MessageContent> messageContentList = messageContentRepository.findAll();
        assertThat(messageContentList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    public void checkContentBodyIsRequired() throws Exception {
        int databaseSizeBeforeTest = messageContentRepository.findAll().size();
        // set the field null
        messageContent.setContentBody(null);

        // Create the MessageContent, which fails.

        restMessageContentMockMvc.perform(post("/api/message-contents")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(messageContent)))
            .andExpect(status().isBadRequest());

        List<MessageContent> messageContentList = messageContentRepository.findAll();
        assertThat(messageContentList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    public void checkLanguageIsRequired() throws Exception {
        int databaseSizeBeforeTest = messageContentRepository.findAll().size();
        // set the field null
        messageContent.setLanguage(null);

        // Create the MessageContent, which fails.

        restMessageContentMockMvc.perform(post("/api/message-contents")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(messageContent)))
            .andExpect(status().isBadRequest());

        List<MessageContent> messageContentList = messageContentRepository.findAll();
        assertThat(messageContentList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    public void getAllMessageContents() throws Exception {
        // Initialize the database
        messageContentRepository.save(messageContent);

        // Get all the messageContentList
        restMessageContentMockMvc.perform(get("/api/message-contents?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(messageContent.getId())))
            .andExpect(jsonPath("$.[*].frontEnd").value(hasItem(DEFAULT_FRONT_END.toString())))
            .andExpect(jsonPath("$.[*].product").value(hasItem(DEFAULT_PRODUCT.toString())))
            .andExpect(jsonPath("$.[*].contentName").value(hasItem(DEFAULT_CONTENT_NAME.toString())))
            .andExpect(jsonPath("$.[*].contentTitle").value(hasItem(DEFAULT_CONTENT_TITLE.toString())))
            .andExpect(jsonPath("$.[*].contentBody").value(hasItem(DEFAULT_CONTENT_BODY.toString())))
            .andExpect(jsonPath("$.[*].metaData").value(hasItem(DEFAULT_META_DATA.toString())))
            .andExpect(jsonPath("$.[*].language").value(hasItem(DEFAULT_LANGUAGE.toString())));
    }

    @Test
    public void getMessageContent() throws Exception {
        // Initialize the database
        messageContentRepository.save(messageContent);

        // Get the messageContent
        restMessageContentMockMvc.perform(get("/api/message-contents/{id}", messageContent.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.id").value(messageContent.getId()))
            .andExpect(jsonPath("$.frontEnd").value(DEFAULT_FRONT_END.toString()))
            .andExpect(jsonPath("$.product").value(DEFAULT_PRODUCT.toString()))
            .andExpect(jsonPath("$.contentName").value(DEFAULT_CONTENT_NAME.toString()))
            .andExpect(jsonPath("$.contentTitle").value(DEFAULT_CONTENT_TITLE.toString()))
            .andExpect(jsonPath("$.contentBody").value(DEFAULT_CONTENT_BODY.toString()))
            .andExpect(jsonPath("$.metaData").value(DEFAULT_META_DATA.toString()))
            .andExpect(jsonPath("$.language").value(DEFAULT_LANGUAGE.toString()));
    }

    @Test
    public void getNonExistingMessageContent() throws Exception {
        // Get the messageContent
        restMessageContentMockMvc.perform(get("/api/message-contents/{id}", Long.MAX_VALUE))
            .andExpect(status().isNotFound());
    }

    @Test
    public void updateMessageContent() throws Exception {
        // Initialize the database
        messageContentService.save(messageContent);

        int databaseSizeBeforeUpdate = messageContentRepository.findAll().size();

        // Update the messageContent
        MessageContent updatedMessageContent = messageContentRepository.findOne(messageContent.getId());
        updatedMessageContent
            .frontEnd(UPDATED_FRONT_END)
            .product(UPDATED_PRODUCT)
            .contentName(UPDATED_CONTENT_NAME)
            .contentTitle(UPDATED_CONTENT_TITLE)
            .contentBody(UPDATED_CONTENT_BODY)
            .metaData(UPDATED_META_DATA)
            .language(UPDATED_LANGUAGE);

        restMessageContentMockMvc.perform(put("/api/message-contents")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(updatedMessageContent)))
            .andExpect(status().isOk());

        // Validate the MessageContent in the database
        List<MessageContent> messageContentList = messageContentRepository.findAll();
        assertThat(messageContentList).hasSize(databaseSizeBeforeUpdate);
        MessageContent testMessageContent = messageContentList.get(messageContentList.size() - 1);
        assertThat(testMessageContent.getFrontEnd()).isEqualTo(UPDATED_FRONT_END);
        assertThat(testMessageContent.getProduct()).isEqualTo(UPDATED_PRODUCT);
        assertThat(testMessageContent.getContentName()).isEqualTo(UPDATED_CONTENT_NAME);
        assertThat(testMessageContent.getContentTitle()).isEqualTo(UPDATED_CONTENT_TITLE);
        assertThat(testMessageContent.getContentBody()).isEqualTo(UPDATED_CONTENT_BODY);
        assertThat(testMessageContent.getMetaData()).isEqualTo(UPDATED_META_DATA);
        assertThat(testMessageContent.getLanguage()).isEqualTo(UPDATED_LANGUAGE);
    }

    @Test
    public void updateNonExistingMessageContent() throws Exception {
        int databaseSizeBeforeUpdate = messageContentRepository.findAll().size();

        // Create the MessageContent

        // If the entity doesn't have an ID, it will be created instead of just being updated
        restMessageContentMockMvc.perform(put("/api/message-contents")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(messageContent)))
            .andExpect(status().isCreated());

        // Validate the MessageContent in the database
        List<MessageContent> messageContentList = messageContentRepository.findAll();
        assertThat(messageContentList).hasSize(databaseSizeBeforeUpdate + 1);
    }

    @Test
    public void deleteMessageContent() throws Exception {
        // Initialize the database
        messageContentService.save(messageContent);

        int databaseSizeBeforeDelete = messageContentRepository.findAll().size();

        // Get the messageContent
        restMessageContentMockMvc.perform(delete("/api/message-contents/{id}", messageContent.getId())
            .accept(TestUtil.APPLICATION_JSON_UTF8))
            .andExpect(status().isOk());

        // Validate the database is empty
        List<MessageContent> messageContentList = messageContentRepository.findAll();
        assertThat(messageContentList).hasSize(databaseSizeBeforeDelete - 1);
    }

    @Test
    public void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(MessageContent.class);
        MessageContent messageContent1 = new MessageContent();
        messageContent1.setId("id1");
        MessageContent messageContent2 = new MessageContent();
        messageContent2.setId(messageContent1.getId());
        assertThat(messageContent1).isEqualTo(messageContent2);
        messageContent2.setId("id2");
        assertThat(messageContent1).isNotEqualTo(messageContent2);
        messageContent1.setId(null);
        assertThat(messageContent1).isNotEqualTo(messageContent2);
    }
}
