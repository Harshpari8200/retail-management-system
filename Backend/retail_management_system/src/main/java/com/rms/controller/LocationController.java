package com.rms.controller;

import com.rms.dto.AddServiceCityRequest;
import com.rms.dto.ServiceCityDTO;
import com.rms.service.LocationService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/location")
@RequiredArgsConstructor
@Slf4j
public class LocationController {

    private final LocationService locationService;

    @GetMapping("/wholesaler/{wholesalerId}/service-cities")
    @PreAuthorize("hasRole('WHOLESALER')")
    public ResponseEntity<List<ServiceCityDTO>> getServiceCities(
            @PathVariable Long wholesalerId) {
        log.info("Fetching service cities for wholesaler: {}", wholesalerId);
        return ResponseEntity.ok(locationService.getServiceCities(wholesalerId));
    }

    @PostMapping("/wholesaler/{wholesalerId}/service-cities")
    @PreAuthorize("hasRole('WHOLESALER')")
    public ResponseEntity<ServiceCityDTO> addServiceCity(
            @PathVariable Long wholesalerId,
            @Valid @RequestBody AddServiceCityRequest request) {
        log.info("Adding service city for wholesaler: {}, city: {}", wholesalerId, request.getCityName());
        return ResponseEntity.ok(locationService.addServiceCity(wholesalerId, request));
    }

    @DeleteMapping("/wholesaler/{wholesalerId}/service-cities/{cityId}")
    @PreAuthorize("hasRole('WHOLESALER')")
    public ResponseEntity<?> removeServiceCity(
            @PathVariable Long wholesalerId,
            @PathVariable Long cityId) {
        log.info("Removing service city for wholesaler: {}, cityId: {}", wholesalerId, cityId);
        locationService.removeServiceCity(wholesalerId, cityId);
        return ResponseEntity.ok(Map.of("message", "City removed from service areas"));
    }
}