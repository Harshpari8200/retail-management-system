package com.rms.specification;

import com.rms.model.ServiceCity;
import org.springframework.data.jpa.domain.Specification;

public class ServiceCitySpecification {

    public static Specification<ServiceCity> byWholesalerId(Long wholesalerId) {
        return (root, query, cb) -> {
            if (wholesalerId == null) return cb.conjunction();
            return cb.equal(root.get("wholesaler").get("id"), wholesalerId);
        };
    }

    public static Specification<ServiceCity> byCityId(Long cityId) {
        return (root, query, cb) -> {
            if (cityId == null) return cb.conjunction();
            return cb.equal(root.get("cityId"), cityId);
        };
    }

    public static Specification<ServiceCity> byCityName(String cityName) {
        return (root, query, cb) -> {
            if (cityName == null || cityName.isEmpty()) return cb.conjunction();
            return cb.equal(root.get("cityName"), cityName);
        };
    }

    public static Specification<ServiceCity> byActiveOnly() {
        return (root, query, cb) -> cb.isTrue(root.get("isActive"));
    }

    public static Specification<ServiceCity> forWholesaler(Long wholesalerId) {
        return Specification.where(byActiveOnly())
                .and(byWholesalerId(wholesalerId));
    }

    public static Specification<ServiceCity> activeCitiesByName(String cityName) {
        return Specification.where(byActiveOnly())
                .and(byCityName(cityName));
    }
}