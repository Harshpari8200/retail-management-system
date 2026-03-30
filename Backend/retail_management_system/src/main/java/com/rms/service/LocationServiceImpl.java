package com.rms.service;

import com.rms.dto.AddServiceCityRequest;
import com.rms.dto.ServiceCityDTO;
import com.rms.exception.ResourceNotFoundException;
import com.rms.model.ServiceCity;
import com.rms.model.Wholesaler;
import com.rms.repository.ServiceCityRepository;
import com.rms.repository.WholesalerRepository;
import com.rms.specification.ServiceCitySpecification;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class LocationServiceImpl implements LocationService {

    private final ServiceCityRepository serviceCityRepository;
    private final WholesalerRepository wholesalerRepository;

    @Override
    public List<ServiceCityDTO> getServiceCities(Long wholesalerId) {
        Specification<ServiceCity> spec = ServiceCitySpecification.forWholesaler(wholesalerId);
        List<ServiceCity> serviceCities = serviceCityRepository.findAll(spec);
        return serviceCities.stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public ServiceCityDTO addServiceCity(Long wholesalerId, AddServiceCityRequest request) {
        log.info("Adding service city for wholesaler: {}", wholesalerId);

        Wholesaler wholesaler = wholesalerRepository.findById(wholesalerId)
                .orElseThrow(() -> new ResourceNotFoundException("Wholesaler not found"));

        Specification<ServiceCity> existingSpec = Specification.where(ServiceCitySpecification.byWholesalerId(wholesalerId))
                .and(ServiceCitySpecification.byCityId(request.getCityId()));

        Optional<ServiceCity> existingCity = serviceCityRepository.findOne(existingSpec);

        if (existingCity.isPresent()) {
            ServiceCity serviceCity = existingCity.get();

            if (serviceCity.getIsActive()) {
                throw new RuntimeException("City already exists in service areas");
            } else {
                log.info("Reactivating previously removed city: {}", request.getCityName());
                serviceCity.setIsActive(true);
                serviceCity.setCityName(request.getCityName());
                serviceCity.setStateId(request.getStateId());
                serviceCity.setStateName(request.getStateName());
                serviceCity.setUpdatedAt(LocalDateTime.now());

                ServiceCity saved = serviceCityRepository.save(serviceCity);
                log.info("Reactivated service city: {} for wholesaler: {}", request.getCityName(), wholesaler.getBusinessName());
                return mapToDTO(saved);
            }
        }

        ServiceCity serviceCity = new ServiceCity();
        serviceCity.setWholesaler(wholesaler);
        serviceCity.setCityId(request.getCityId());
        serviceCity.setCityName(request.getCityName());
        serviceCity.setStateId(request.getStateId());
        serviceCity.setStateName(request.getStateName());
        serviceCity.setIsActive(true);

        ServiceCity saved = serviceCityRepository.save(serviceCity);
        log.info("Added new service city: {} for wholesaler: {}", request.getCityName(), wholesaler.getBusinessName());

        return mapToDTO(saved);
    }

    @Override
    @Transactional
    public void removeServiceCity(Long wholesalerId, Long cityId) {
        log.info("Removing service city for wholesaler: {}, cityId: {}", wholesalerId, cityId);

        Specification<ServiceCity> spec = Specification.where(ServiceCitySpecification.byWholesalerId(wholesalerId))
                .and(ServiceCitySpecification.byCityId(cityId))
                .and(ServiceCitySpecification.byActiveOnly());

        ServiceCity serviceCity = serviceCityRepository.findOne(spec)
                .orElseThrow(() -> new ResourceNotFoundException("City not found in service areas"));

        serviceCity.setIsActive(false);
        serviceCityRepository.save(serviceCity);

        log.info("Removed service city: {}", serviceCity.getCityName());
    }

    private ServiceCityDTO mapToDTO(ServiceCity serviceCity) {
        return ServiceCityDTO.builder()
                .id(serviceCity.getId())
                .cityId(serviceCity.getCityId())
                .cityName(serviceCity.getCityName())
                .stateId(serviceCity.getStateId())
                .stateName(serviceCity.getStateName())
                .build();
    }
}