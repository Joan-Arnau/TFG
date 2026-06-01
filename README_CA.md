# PromoRural: Digitalització i Dinamització Rural Multilingüe

PromoRural és un projecte de Final de Grau (TFG) integral dissenyat per dinamitzar l'economia rural i promoure la comunitat de municipis rurals de manera personalitzada i multilingüe.

El sistema ofereix una arquitectura robusta i modular de marca blanca que permet a qualsevol municipi rural desplegar de forma simple la seva pròpia identitat visual, el seu mapa cartogràfic, la seva agenda d'actes rurals, butlletins oficials urgents, directori de serveis de salut/seguretat, cercador de comerços de proximitat i aparador digital de promocions locals.

---

## Arquitectura i Mòduls del Projecte

La solució s'estructura en tres grans plataformes perfectament integrades:

### 1. `BackEnd` (Spring Boot 3 + Java 21)

Backend dissenyat sota els patrons de la Clean Architecture (Arquitectura Neta) assegurant la injecció de dependències a través d'UseCases i controladors desacoblats:

* **Persistència**: PostgreSQL 16 + PostGIS per a geolocalització espacial.
* **Seguretat**: Spring Security + Stateful JWT (JSON Web Tokens) amb rols RBAC.
* **Esquema de Dades**: Segregació física de credencials i tokens a l'esquema de dades independent auth.
* **Migrations**: Control de versions de base de dades automatitzat amb Flyway.

### 2. `BackOffice` (React 19 + Vite)

Panell web reactiu destinat a dos tipus d'usuaris:

* **Administrador Municipal**: Gestió completa de marca blanca (colors corporatius, escut, GPS de referència), moderació de sol·licituds comercials, justificació obligatòria de penalitzacions, publicació de bandos i agenda, i mètriques en temps real.
* **Comerciant Local**: Fitxa de negoci, mapa de geolocalització assistit per fer clic, galeria de catàleg de productes i banners, i creació de promocions vigents.

### 3. `MobileApp` (React Native + Expo)

Aplicació mòbil multiplataforma per als ciutadans i turistes del municipi:

* **Sincronització de Marca**: Pre-càrrega dinàmica d'estils que hereta els colors i logotips de la instància de l'ajuntament.
* **Serveis**: Cercador de comerços amb càlcul de distàncies GPS, agenda/programa de festes vigents (RN-09), mapes interactius de POIs, llista de bandos urgents destacats i directori de telèfons essencials en 3 idiomes.

---

## Tutorial de Desplegament (Deployment Guide)

### Requisits Previs

* **Docker** i **Docker Compose** instal·lats.
* **Node.js** (versió 18 o superior) i **npm** en cas d'execució en desenvolupament local.
* **Git** instal·lat per al control de codi.

---

### Pas 1: Configuració de l'Entorn (.env)

Abans d'aixecar qualsevol component, s'ha de configurar el fitxer de variables d'entorn al directori del backend.

1. Navega al directori del backend:

   ```bash
   cd BackEnd
   ```

2. Copia el fitxer d'exemple:

   ```bash
   
   cp .env.example .env
   ```

3. Obre el fitxer `.env` i configura els paràmetres com el títol, els idiomes per defecte del municipi, els credencials de la base de dades i la clau de seguretat JWT.

---

### Pas 2: Desplegament de l'Entorn de Producció (Recomanat)

Per desplegar toda la plataforma completa (Base de dades, Servidor API, Servidor de Correu de Prova i Servidor Proxy de Nginx enllaçats en xarxa de Docker) sota format de contenidors d'alta disponibilitat:

1. Assegura't de trobar-te a la carpeta `BackEnd/` que conté el fitxer de producció de Docker.
2. Executa la construcció i arrencada en segon pla:

   ```bash
   docker compose -f docker-compose.prod.yml up --build -d
   ```

3. **Validació d'Arrencada**:
   * L'API de Spring Boot s'executarà a `http://localhost:8080` (inclou Swagger integrat a `http://localhost:8080/swagger-ui.html`).
   * El proxy invers de Nginx enrutarà el trànsit a través del port estàndard `http://localhost` (enrutant `/api/*` cap al backend de Spring Boot i exposant les carpetes de càrregues de fitxers).
   * La bústia de correu Mailpit per veure els emails de benvinguda i notificacions dels comerciants s'exposarà a `http://localhost:8025`.

---

### Pas 3: Execució de l'Entorn de Desenvolupament Local

Si vols aixecar els serveis de forma local per codificar o fer proves, tens dues opcions:

#### Opció A: Execució de tot el Backend en Docker (Recomanat)

Aquesta és l'opció més ràpida. Només has d'executar el següent des de la carpeta `BackEnd/`:

```bash
docker compose up -d
```

*Això aixecarà automàticament la base de dades (PostGIS), el proxy Nginx, el servidor de correu Mailpit i també el contenidor de l'API (`api-server` o `promo-rural-api`). No necessites fer res més per disposar de tot el backend llest.*

#### Opció B: Execució nativa de l'API (Només per a desenvolupament actiu del codi Java)

Si estàs modificant activament el codi font Java del backend i desitges que es recompili de forma nativa a la teva màquina:

1. Atura el contenidor de l'API per alliberar el port:

   ```bash
   docker stop promo-rural-api
   ```

2. Executa l'aplicació nativament des de la teva consola a `BackEnd/`:

   ```bash
   mvn spring-boot:run
   ```

*La base de dades s'auto-inicialitzarà i aplicarà les 11 migracions de Flyway, incloent la creació automàtica del perfil d'administrador (admin/admin1234) i l'estructura de marca blanca i categories per defecte.*

#### 3. Aplicació Web (BackOffice)

1. Navega al directori web:

   ```bash
   cd ../BackOffice
   ```

2. Instal·la les dependències i arrenca el servidor de Vite:

   ```bash
   npm install
   npm run dev
   ```

3. Accedeix a l'aplicació web a `http://localhost:5173`. Pots iniciar sessió com a administrador amb `admin` / `admin1234`.

#### 4. Aplicació Mòbil (MobileApp)

1. Navega al directori mòbil:

   ```bash
   cd ../MobileApp
   ```

2. Instal·la les dependències i inicia l'entorn Expo:

   ```bash
   npm install
   npx expo start
   ```

3. Llegeix el codi QR amb l'aplicació mòbil Expo Go (disponible a Google Play Store o App Store) o prem `a` per a l'emulador d'Android o `i` per a iOS per provar la interfície del ciutadà.

---

## Seguretat i Base de dades

### Esquemes de Base de Dades i Segregació

Les migracions automàtiques de Flyway estructuren la base de dades en dos esquemes:

1. **`public`**: Guarda la informació rellevant per a ciutadans i comerços (Categories, Botigues, Esdeveniments, POIs, Comunicats i Directori).
2. **`auth`**: Mòdul blindat de seguretat en un esquema separat per a les credencials (`auth.web_user`) i els tokens de seguretat actius de contrasenyes (`auth.password_reset_token`).

### Credencials de Prova (Seeding Actiu)

Per defecte, l'entorn s'aixeca amb dades inicials de prova per facilitar l'avaluació del programari:

* **Administrador**:
  * **Usuari**: `admin`
  * **Contrasenya**: `admin1234`
* **Comerciant de Prova**:
  * **Usuari**: `merchant`
  * **Contrasenya**: `merchant1234`
