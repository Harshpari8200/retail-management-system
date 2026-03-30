package com.rms.repository;

import com.rms.model.ServiceCity;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

@Repository
public interface ServiceCityRepository extends JpaRepository<ServiceCity, Long>, JpaSpecificationExecutor<ServiceCity> {

    boolean exists(Specification<ServiceCity> spec);
}