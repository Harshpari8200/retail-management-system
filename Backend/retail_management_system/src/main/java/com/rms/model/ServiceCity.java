package com.rms.model;

import jakarta.persistence.*;
import lombok.Data;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "service_cities", uniqueConstraints = {
        @UniqueConstraint(columnNames = {"wholesaler_id", "city_id"})
})
@Data
public class ServiceCity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "wholesaler_id", nullable = false)
    private Wholesaler wholesaler;

    @Column(nullable = false)
    private Long cityId;

    @Column(nullable = false)
    private String cityName;

    private Long stateId;
    private String stateName;

    private Boolean isActive = true;

    @CreationTimestamp
    private LocalDateTime createdAt;

    @UpdateTimestamp
    private LocalDateTime updatedAt;
}