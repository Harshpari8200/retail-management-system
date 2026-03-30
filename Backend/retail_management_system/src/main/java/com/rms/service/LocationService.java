package com.rms.service;

import com.rms.dto.AddServiceCityRequest;
import com.rms.dto.ServiceCityDTO;

import java.util.List;

public interface LocationService {

    List<ServiceCityDTO> getServiceCities(Long wholesalerId);

    ServiceCityDTO addServiceCity(Long wholesalerId, AddServiceCityRequest request);

    void removeServiceCity(Long wholesalerId, Long cityId);
}