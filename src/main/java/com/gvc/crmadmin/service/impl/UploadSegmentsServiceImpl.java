package com.gvc.crmadmin.service.impl;

import com.gvc.crmadmin.service.UploadSegmentsService;

import com.gvc.crmadmin.domain.UploadSegments;
import com.gvc.crmadmin.repository.UploadSegmentsRepository;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;


/**
 * Service Implementation for managing UploadSegments.
 */
@Service
public class UploadSegmentsServiceImpl implements UploadSegmentsService{

    private final Logger log = LoggerFactory.getLogger(UploadSegmentsServiceImpl.class);

    private final UploadSegmentsRepository uploadSegmentsRepository;
    private final Path rootLocation = Paths.get("/home/ppoker/");
    
    public UploadSegmentsServiceImpl(UploadSegmentsRepository uploadSegmentsRepository) {
        this.uploadSegmentsRepository = uploadSegmentsRepository;
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

            String inputStr;
            while ((inputStr = reader.readLine()) != null) {
            	
            }

            return true;
        }
        catch (Exception e) {
        	log.error("Failed to store file " + filename, e);
        	return false;
        }
    }

    /**
     * Save a uploadSegments.
     *
     * @param uploadSegments the entity to save
     * @return the persisted entity
     */
    @Override
    public UploadSegments save(UploadSegments uploadSegments) {
        log.debug("Request to save UploadSegments : {}", uploadSegments);
        return uploadSegmentsRepository.save(uploadSegments);
    }

    /**
     *  Get all the uploadSegments.
     *
     *  @param pageable the pagination information
     *  @return the list of entities
     */
    @Override
    public Page<UploadSegments> findAll(Pageable pageable) {
        log.debug("Request to get all UploadSegments");
        return uploadSegmentsRepository.findAll(pageable);
    }

    /**
     *  Get one uploadSegments by id.
     *
     *  @param id the id of the entity
     *  @return the entity
     */
    @Override
    public UploadSegments findOne(String id) {
        log.debug("Request to get UploadSegments : {}", id);
        return uploadSegmentsRepository.findOne(id);
    }

    /**
     *  Delete the  uploadSegments by id.
     *
     *  @param id the id of the entity
     */
    @Override
    public void delete(String id) {
        log.debug("Request to delete UploadSegments : {}", id);
        uploadSegmentsRepository.delete(id);
    }
}
