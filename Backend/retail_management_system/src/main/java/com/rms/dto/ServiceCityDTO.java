package com.rms.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class ServiceCityDTO {
    private Long id;
    private Long cityId;
    private String cityName;
    private Long stateId;
    private String stateName;
}