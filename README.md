# PromoRural: Rural Digitalization and Dynamization

PromoRural is a comprehensive Final Year Project (TFG) designed to boost the rural economy and promote the community of rural municipalities in a personalized and multilingual manner.

The system offers a robust and modular white-label architecture that allows any rural municipality to easily deploy its own visual identity, cartographic map, rural events agenda, urgent official announcements, health/safety services directory, local business finder, and digital showcase of local promotions.

---

## Architecture and Project Modules

The solution is structured into three fully integrated major platforms:

### 1. `BackEnd` (Spring Boot 3 + Java 21)

Backend designed under the patterns of Clean Architecture, ensuring dependency injection through decoupled UseCases and controllers:

* **Persistence**: PostgreSQL 16 + PostGIS for spatial geolocation.
* **Security**: Spring Security + Stateful JWT (JSON Web Tokens) with RBAC roles.
* **Data Schema**: Physical segregation of credentials and tokens in an independent data schema named "auth".
* **Migrations**: Automated database version control using Flyway.

### 2. `BackOffice` (React 19 + Vite)

A reactive web dashboard aimed at two types of users:

* **Municipal Administrator**: Complete white-label management (corporate colors, coat of arms, reference GPS coordinates), moderation of merchant registration requests, mandatory justification for penalties, publication of announcements and agendas, and real-time metrics.
* **Local Merchant**: Business profile setup, map geolocation assisted by click-on-map interaction, catalog gallery for products and banners, and creation of active promotions.

### 3. `MobileApp` (React Native + Expo)

Multiplatform mobile application for citizens and tourists of the municipality:

* **Branding Synchronization**: Dynamic style preloading that inherits colors and logos from the town hall instance.
* **Services**: Business finder with GPS distance calculation, active agendas/festival programs (RN-09), interactive maps of POIs, highlighted urgent announcements list, and a directory of essential telephone numbers in 3 languages.

---

## Deployment Guide

### Prerequisites

* **Docker** and **Docker Compose** installed.
* **Node.js** (version 18 or higher) and **npm** in case of local development execution.
* **Git** installed for version control.

---

### Step 1: Environment Configuration (.env)

Before starting any component, you must configure the environment variables file in the backend directory.

1. Navigate to the backend directory:

   ```bash
   cd BackEnd
   ```

2. Copy the template file:

   ```bash
   cp .env.example .env
   ```

3. Open the `.env` file and configure parameters such as the title, default languages for the municipality, database credentials, and the JWT secret key.

---

### Step 2: Production Environment Deployment (Recommended)

To deploy the entire platform (Database, API Server, Test Email Server, and Nginx Reverse Proxy linked inside a Docker network) under highly available containerized environments:

1. Ensure you are in the `BackEnd/` folder which contains the production Docker file.
2. Run the build and start in the background:

   ```bash
   docker compose -f docker-compose.prod.yml up --build -d
   ```

3. **Startup Validation**:
   * The Spring Boot API will run at `http://localhost:8080` (includes integrated Swagger at `http://localhost:8080/swagger-ui.html`).
   * The Nginx reverse proxy will route traffic through the standard port `http://localhost` (routing `/api/*` to the Spring Boot backend and exposing file upload folders).
   * The Mailpit mail interface to view welcome emails and merchant notifications will be exposed at `http://localhost:8025`.

---

### Step 3: Local Development Environment Execution

If you want to spin up the services locally for coding or testing, you have two options:

#### Option A: Running the entire Backend in Docker (Recommended)

This is the fastest option. You only need to run the following from the `BackEnd/` directory:

```bash
docker compose up -d
```

*This will automatically start the database (PostGIS), Nginx proxy, Mailpit mail server, and also the API container (`api-server` or `promo-rural-api`). You do not need to do anything else to have the entire backend ready.*

#### Option B: Native API Execution (Only for active Java code development)

If you are actively modifying the Java source code of the backend and want it to compile natively on your machine:

1. Stop the API container to free the port:

   ```bash
   docker stop promo-rural-api
   ```

2. Run the application natively from your console in `BackEnd/`:

   ```bash
   mvn spring-boot:run
   ```

*The database will self-initialize and apply the 11 Flyway migrations, including the automatic creation of the administrator profile (admin/admin1234) and the default white-label structure and categories.*

#### 3. Web Application (BackOffice)

1. Navigate to the web directory:

   ```bash
   cd ../BackOffice
   ```

2. Install dependencies and start the Vite dev server:

   ```bash
   npm install
   ```

   ```bash
   npm run dev
   ```

3. Access the web application at `http://localhost:5173`. You can log in as an administrator using `admin` / `admin1234`.

#### 4. Mobile Application (MobileApp)

1. Navigate to the mobile directory:

   ```bash
   cd ../MobileApp
   ```

2. Install dependencies and start the Expo environment:

   ```bash
   npm install
   ```

   ```bash
   npx expo start
   ```

3. Read the QR code with the Expo Go mobile application (available on Google Play Store or App Store) or press `a` for Android emulator or `i` for iOS to test the citizen interface.

---

## Security and Database

### Database Schemas and Segregation

Flyway automatic migrations structure the database into two schemas:

1. **`public`**: Stores information relevant to citizens and businesses (Categories, Shops, Events, POIs, Announcements, and Directory).
2. **`auth`**: Hardened security module in a separate schema for credentials (`auth.web_user`) and active password reset security tokens (`auth.password_reset_token`).

### Test Credentials (Active Seeding)

By default, the environment starts with initial test data to facilitate software evaluation:

* **Administrator**:
  * **Username**: `admin`
  * **Password**: `admin1234`
* **Test Merchant**:
  * **Username**: `merchant`
  * **Password**: `merchant1234`
