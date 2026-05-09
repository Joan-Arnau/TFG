# PromoRural - Backend API

Spring Boot 3 (Java 21) backend providing a robust API for rural municipality digitalization.

## Key Features

- **White Label Architecture:** Configurable branding and settings per municipality.
- **Advanced i18n:** JSONB-based multi-language support (Catalan, Spanish, English).
- **Spatial Data:** PostGIS and JTS integration for real GPS coordinates mapping.
- **Centralized Categories:** Unified classification system for all resources.
- **Security:** JWT-based authentication with Admin and Merchant roles.
- **Database Migrations:** Automated schema management with Flyway.

## Main Components

- **Shops & Promotions:** Local business directory with temporary offers.
- **Municipal Announcements:** Official communications with urgency support.
- **Agenda & Events:** Cultural and festival planning.
- **POIs:** Touristic points of interest with geolocation.
- **Contact Directory:** Essential municipal phone numbers and services.

## Getting Started

### Prerequisites

- Java 21
- Docker & Docker Compose
- Maven

### Installation

1. Clone the repository.
2. Copy the environment template:
   ```bash
   cp .env.example .env
   ```
3. Start the infrastructure (Database):
   ```bash
   docker compose up -d
   ```
4. Run the application:
   ```bash
   mvn spring-boot:run
   ```

## Public API Endpoints

- `GET /api/public/config`: Municipality settings and branding.
- `GET /api/public/categories?type={TYPE}`: List categories for a specific type.
- `GET /api/public/shops`: List approved local shops.
- `GET /api/public/promotions?shopId={ID}`: List shop offers.
- `GET /api/public/announcements`: List municipal announcements.
- `GET /api/public/events`: List agenda and festivals.
- `GET /api/public/points-of-interest`: List touristic sites.
- `GET /api/public/contacts`: Municipal directory.

## Localization

The API returns full translation maps (JSONB) for names, titles, and descriptions. The client application (UI) is responsible for selecting the appropriate language for display based on user preferences.
