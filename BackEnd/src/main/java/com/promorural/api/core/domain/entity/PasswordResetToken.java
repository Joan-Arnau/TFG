package com.promorural.api.core.domain.entity;

import jakarta.persistence.*;
import java.time.ZonedDateTime;

@Entity
@Table(schema = "auth", name = "password_reset_token")
public class PasswordResetToken {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(name = "token_hash", nullable = false, unique = true)
    private String tokenHash;

    @Column(name = "expires_at", nullable = false)
    private ZonedDateTime expiresAt;

    @Column(name = "used_at")
    private ZonedDateTime usedAt;

    @Column(name = "created_at", nullable = false, updatable = false)
    private ZonedDateTime createdAt = ZonedDateTime.now();

    public PasswordResetToken() {}

    public PasswordResetToken(User user, String tokenHash, ZonedDateTime expiresAt) {
        this.user = user;
        this.tokenHash = tokenHash;
        this.expiresAt = expiresAt;
    }

    public Long getId() { return id; }
    public User getUser() { return user; }
    public String getTokenHash() { return tokenHash; }
    public ZonedDateTime getExpiresAt() { return expiresAt; }
    public ZonedDateTime getUsedAt() { return usedAt; }
    public void setUsedAt(ZonedDateTime usedAt) { this.usedAt = usedAt; }
    public boolean isExpired() { return ZonedDateTime.now().isAfter(expiresAt); }
    public boolean isUsed() { return usedAt != null; }
}
