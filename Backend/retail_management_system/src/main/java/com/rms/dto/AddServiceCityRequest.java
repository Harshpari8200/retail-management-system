package com.rms.dto;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class AddServiceCityRequest {

    @NotNull(message = "City ID is required")
    private Long cityId;

    @NotNull(message = "City name is required")
    private String cityName;

    private Long stateId;
    private String stateName;
}