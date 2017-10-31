package com.gvc.crmadmin.service.dto;


import java.io.Serializable;
import java.util.Objects;

/**
 * A DTO for the Campaigns entity.
 */
public class CampaignsDTO implements Serializable {

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

        CampaignsDTO campaignsDTO = (CampaignsDTO) o;
        if(campaignsDTO.getId() == null || getId() == null) {
            return false;
        }
        return Objects.equals(getId(), campaignsDTO.getId());
    }

    @Override
    public int hashCode() {
        return Objects.hashCode(getId());
    }

    @Override
    public String toString() {
        return "CampaignsDTO{" +
            "id=" + getId() +
            "}";
    }
}
