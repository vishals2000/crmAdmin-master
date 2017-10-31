package com.gvc.crmadmin.service.mapper;

import com.gvc.crmadmin.domain.*;
import com.gvc.crmadmin.service.dto.ProjectsDTO;

import org.mapstruct.*;

/**
 * Mapper for the entity Projects and its DTO ProjectsDTO.
 */
@Mapper(componentModel = "spring", uses = {})
public interface ProjectsMapper extends EntityMapper <ProjectsDTO, Projects> {
    
    

}
