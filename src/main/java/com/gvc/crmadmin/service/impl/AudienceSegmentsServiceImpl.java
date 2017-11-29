package com.gvc.crmadmin.service.impl;

import com.gvc.crmadmin.service.AudienceSegmentsService;
import com.gvc.crmadmin.domain.AudienceSegments;
import com.gvc.crmadmin.domain.AudienceSegmentsPlayers;
import com.gvc.crmadmin.domain.campaignMgmtApi.StoreFileResponse;
import com.gvc.crmadmin.repository.AudienceSegmentsPlayersRepository;
import com.gvc.crmadmin.repository.AudienceSegmentsRepository;

import static com.gvc.crmadmin.config.Constants.CAMPAIGN_SCHEDULE_TIME_FORMAT;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.ArrayList;
import java.util.List;

import org.joda.time.DateTime;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;


/**
 * Service Implementation for managing AudienceSegments.
 */
@Service
public class AudienceSegmentsServiceImpl implements AudienceSegmentsService{

    private final Logger log = LoggerFactory.getLogger(AudienceSegmentsServiceImpl.class);

    private final Path rootLocation = Paths.get("D:\\");
    
    private final AudienceSegmentsRepository audienceSegmentsRepository;
    
    @Autowired
    AudienceSegmentsPlayersRepository audienceSegmentsPlayersRepository;
    
    public AudienceSegmentsServiceImpl(AudienceSegmentsRepository audienceSegmentsRepository) {
        this.audienceSegmentsRepository = audienceSegmentsRepository;
    }

    @Override
    public StoreFileResponse store(String id, MultipartFile file) {
    	StoreFileResponse response = new StoreFileResponse();
    	response.setResult(false);
    	
    	log.info("In store");
        String filename = StringUtils.cleanPath(file.getOriginalFilename());
        BufferedReader reader = null;
        try {
            if (file.isEmpty()) {
                log.error("Failed to store empty file " + filename);
                response.setMessage("Empty file uploaded");
                return response;
            }
            if (filename.contains("..")) {
                // This is a security check
            	log.error("Cannot store file with relative path outside current directory " + filename);
            	response.setMessage("Cannot store file with relative path outside current directory");
                return response;
            }
            if (!filename.endsWith(".csv")) {
            	log.error("Only csv file is supported" + filename);
            	response.setMessage("Only csv file is supported");
                return response;
            }
            filename = id + "_" + filename;
            Files.copy(file.getInputStream(), this.rootLocation.resolve(filename),
                    StandardCopyOption.REPLACE_EXISTING);
            
            reader = new BufferedReader(new InputStreamReader(file.getInputStream()));

            String accountName;
            List<AudienceSegmentsPlayers> players = new ArrayList<>();
            while ((accountName = reader.readLine()) != null) {
            	if(StringUtils.hasText(accountName)) {
            		AudienceSegmentsPlayers audienceSegmentsPlayers = new AudienceSegmentsPlayers();
            		audienceSegmentsPlayers.setSegmentName(id);
            		audienceSegmentsPlayers.setId(id + "_" + accountName);
            		audienceSegmentsPlayers.setAccountName(accountName);
            		
            		players.add(audienceSegmentsPlayers);
            	}
            }
            
            audienceSegmentsPlayersRepository.save(players);
            
            AudienceSegments segment = audienceSegmentsRepository.findOne(id);
            segment.setEstimate(players.size()+"");
            segment.setLastEstimatedAt(CAMPAIGN_SCHEDULE_TIME_FORMAT.print(new DateTime()));
            
            audienceSegmentsRepository.save(segment);
            
            response.setResult(true);
            
            return response;
        }
        catch (Exception e) {
        	log.error("Failed to store file " + filename, e);
        	response.setMessage("Error while storing file");
            return response;
        }
    }

    /**
     * Save a audienceSegments.
     *
     * @param audienceSegments the entity to save
     * @return the persisted entity
     */
    @Override
    public AudienceSegments save(AudienceSegments audienceSegments) {
        log.debug("Request to save AudienceSegments : {}", audienceSegments);
        return audienceSegmentsRepository.save(audienceSegments);
    }

    /**
     *  Get all the audienceSegments.
     *
     *  @param pageable the pagination information
     *  @return the list of entities
     */
    @Override
    public Page<AudienceSegments> findAll(Pageable pageable) {
        log.debug("Request to get all AudienceSegments");
        return audienceSegmentsRepository.findAll(pageable);
    }

    @Override
    public Page<AudienceSegments> findByFrontEndAndProduct(String frontEnd, String product, Pageable pageable) {
    	log.debug("Request to get page AudienceSegments for frontEnd = " + frontEnd + " product = " + product );
    	return audienceSegmentsRepository.findByFrontEndAndProduct(frontEnd, product, pageable);
    }

    @Override
    public List<AudienceSegments> findByFrontEndAndProduct(String frontEnd, String product) {
    	log.debug("Request to get all AudienceSegments for frontEnd = " + frontEnd + " product = " + product );
    	return audienceSegmentsRepository.findByFrontEndAndProduct(frontEnd, product);
    }
    
    /**
     *  Get one audienceSegments by id.
     *
     *  @param id the id of the entity
     *  @return the entity
     */
    @Override
    public AudienceSegments findOne(String id) {
        log.debug("Request to get AudienceSegments : {}", id);
        return audienceSegmentsRepository.findOne(id);
    }

    /**
     *  Delete the  audienceSegments by id.
     *
     *  @param id the id of the entity
     */
    @Override
    public void delete(String id) {
        log.debug("Request to delete AudienceSegments : {}", id);
        audienceSegmentsRepository.delete(id);
    }
}
