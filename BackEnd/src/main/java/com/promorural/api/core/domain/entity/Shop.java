package com.promorural.api.core.domain.entity;

import jakarta.persistence.*;
import java.time.OffsetDateTime;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;
import org.locationtech.jts.geom.Point;

@Entity
@Table(name = "shop")
public class Shop {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @JdbcTypeCode(SqlTypes.JSON)
    @Column(columnDefinition = "jsonb", nullable = false)
    private Map<String, String> name;

    @JdbcTypeCode(SqlTypes.JSON)
    @Column(columnDefinition = "jsonb", nullable = false)
    private Map<String, String> description;

    @Column(length = 255)
    private String address;

    @Column(length = 20)
    private String phoneNumber;

    @Column(length = 500)
    private String headerImageUrl;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ShopStatus status = ShopStatus.PENDING;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "category_id")
    private Category category;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "owner_user_id", unique = true)
    private User owner;

    @Column(columnDefinition = "geometry(Point,4326)")
    private Point location;

    @OneToMany(mappedBy = "shop", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<ProductImage> images;

    @Column(nullable = false)
    private OffsetDateTime createdAt;

    @PrePersist
    void prePersist() {
        if (createdAt == null) {
            createdAt = OffsetDateTime.now();
        }
    }

    public Long getId() {
        return id;
    }

    public Map<String, String> getName() {
        return name;
    }

    public void setName(Map<String, String> name) {
        this.name = name;
    }

    public Map<String, String> getDescription() {
        return description;
    }

    public void setDescription(Map<String, String> description) {
        this.description = description;
    }

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
    }

    public String getPhoneNumber() {
        return phoneNumber;
    }

    public void setPhoneNumber(String phoneNumber) {
        this.phoneNumber = phoneNumber;
    }

    public String getHeaderImageUrl() {
        return headerImageUrl;
    }

    public void setHeaderImageUrl(String headerImageUrl) {
        this.headerImageUrl = headerImageUrl;
    }

    public ShopStatus getStatus() {
        return status;
    }

    public void setStatus(ShopStatus status) {
        this.status = status;
    }

    public Category getCategory() {
        return category;
    }

    public void setCategory(Category category) {
        this.category = category;
    }

    public User getOwner() {
        return owner;
    }

    public void setOwner(User owner) {
        this.owner = owner;
    }

    public Point getLocation() {
        return location;
    }

    public void setLocation(Point location) {
        this.location = location;
    }

    public List<ProductImage> getImages() {
        return images;
    }

    public void setImages(List<ProductImage> images) {
        this.images = images;
    }

    public OffsetDateTime getCreatedAt() {
        return createdAt;
    }

    public void updateProfile(
            Map<String, String> name,
            Map<String, String> description,
            String address,
            String phoneNumber,
            Category category,
            Point location
    ) {
        boolean criticalChange = false;

        if (name != null && !Objects.equals(name, this.name)) {
            this.name = name;
            criticalChange = true;
        }

        if (description != null && !Objects.equals(description, this.description)) {
            this.description = description;
        }

        if (address != null && !Objects.equals(address, this.address)) {
            this.address = address;
        }

        if (phoneNumber != null && !Objects.equals(phoneNumber, this.phoneNumber)) {
            this.phoneNumber = phoneNumber;
        }

        if (category != null && !sameCategory(category)) {
            this.category = category;
            criticalChange = true;
        }

        if (location != null && !sameLocation(location)) {
            this.location = location;
            criticalChange = true;
        }

        if (criticalChange && this.status == ShopStatus.APPROVED) {
            this.status = ShopStatus.PENDING;
        }
    }

    private boolean sameCategory(Category category) {
        if (this.category == null) return false;
        return Objects.equals(this.category.getId(), category.getId());
    }

    private boolean sameLocation(Point location) {
        if (this.location == null) return false;
        return Objects.equals(this.location.getX(), location.getX())
                && Objects.equals(this.location.getY(), location.getY());
    }
}
