package com.gvc.crmadmin.service.impl;

import com.gvc.crmadmin.service.AudienceSegmentsService;
import com.gvc.crmadmin.domain.AudienceSegments;
import com.gvc.crmadmin.domain.AudienceSegmentsPlayers;
import com.gvc.crmadmin.repository.AudienceSegmentsPlayersRepository;
import com.gvc.crmadmin.repository.AudienceSegmentsRepository;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.ArrayList;
import java.util.List;

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

    private final Path rootLocation = Paths.get("/d/");
    
    private final AudienceSegmentsRepository audienceSegmentsRepository;
    
    @Autowired
    AudienceSegmentsPlayersRepository audienceSegmentsPlayersRepository;
    
    public AudienceSegmentsServiceImpl(AudienceSegmentsRepository audienceSegmentsRepository) {
        this.audienceSegmentsRepository = audienceSegmentsRepository;
    }

    @Override
    public boolean store(String id, MultipartFile file) {
        String filename = StringUtils.cleanPath(file.getOriginalFilename());
        BufferedReader reader = null;
        try {
            if (file.isEmpty()) {
                log.error("Failed to store empty file " + filename);
            }
            if (filename.contains("..")) {
                // This is a security check
            	log.error("Cannot store file with relative path outside current directory " + filename);
            }
            filename = id + "_" + filename;
            Files.copy(file.getInputStream(), this.rootLocation.resolve(filename),
                    StandardCopyOption.REPLACE_EXISTING);
            
            reader = new BufferedReader(new InputStreamReader(file.getInputStream()));
            StringBuilder responseStrBuilder = new StringBuilder();

            String accountName;
            List<AudienceSegmentsPlayers> players = new ArrayList<>();
            while ((accountName = reader.readLine()) != null) {
            	if(StringUtils.hasText(accountName)) {
            		AudienceSegmentsPlayers audienceSegmentsPlayers = new AudienceSegmentsPlayers();
            		audienceSegmentsPlayers.setSegmentName(id);
            		audienceSegmentsPlayers.setId(id + "_" + accountName);
            		audienceSegmentsPlayers.setAccountName(accountName);
            	}
            }
            
            audienceSegmentsPlayersRepository.save(players);

            return true;
        }
        catch (Exception e) {
        	log.error("Failed to store file " + filename, e);
        	return false;
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
