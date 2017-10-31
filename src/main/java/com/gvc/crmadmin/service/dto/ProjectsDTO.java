package com.gvc.crmadmin.service.dto;


import java.io.Serializable;
import java.util.Objects;

/**
 * A DTO for the Projects entity.
 */
public class ProjectsDTO implements Serializable {

    private String id;

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (o == null || getClass() != o.getClass()) {
            return false;
        }

        ProjectsDTO projectsDTO = (ProjectsDTO) o;
        if(projectsDTO.getId() == null || getId() == null) {
            return false;
        }
        return Objects.equals(getId(), projectsDTO.getId());
    }

    @Override
    public int hashCode() {
        return Objects.hashCode(getId());
    }

    @Override
    public String toString() {
        return "ProjectsDTO{" +
            "id=" + getId() +
            "}";
    }
}
