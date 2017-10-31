package com.gvc.crmadmin.service.mapper;

import com.gvc.crmadmin.domain.*;
import com.gvc.crmadmin.service.dto.CampaignsDTO;

import org.mapstruct.*;

/**
 * Mapper for the entity Campaigns and its DTO CampaignsDTO.
 */
@Mapper(componentModel = "spring", uses = {})
public interface CampaignsMapper extends EntityMapper <CampaignsDTO, Campaigns> {
    
    

}
