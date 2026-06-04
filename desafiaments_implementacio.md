# 8. Desafiaments de la Implementació

Aquest capítol recull els desafiaments tècnics més significatius que s'han hagut de resoldre durant el procés de construcció i desplegament de la plataforma **PromoRural**. Cadascun d'aquests punts descriu la naturalesa de la dificultat identificada i la solució de disseny de programari aplicada per superar-la.

---

## 8.1. Consistència Transaccional en Esborrat en Cascada i Neteja de Disc Físic

### El Repte
El cas d'ús de baixa voluntària de comerciant (**CU-09**) exigeix un protocol altament destructiu: eliminar els registres de la botiga, imatges i promocions de la base de dades, esborrar el compte de l'usuari de l'esquema d'accés de seguretat, i eliminar físicament els fitxers de fotos del directori d'emmagatzematge del servidor per no exhaurir l'espai de disc del municipi. El repte principal consistia a garantir l'atomicitat de tota l'operació; si l'esborrat de base de dades es realitzava però fallava la purga de disc (o viceversa), o si ocorria un error inesperat en l'enviament de la notificació de correu, el sistema quedava en un estat inconsistent amb fitxers orfes o credencials inactives.

### La Solució
S'ha dissenyat un flux transaccional rigorós al servidor recolzat per l'anotació `@Transactional` a la capa del cas d'ús. L'esborrat de base de dades s'executa en primer lloc sota la mateixa transacció, la qual cosa permet un desfet (*rollback*) automàtic dels registres si es detecta qualsevol excepció intermèdia (incloent-hi errors de l'enviament de l'email de comiat). L'esborrat físic dels fitxers del directori del disc de servidors es postposa de manera segura fins que es valida que l'escriptura relacional a base de dades s'ha completat de forma totalment satisfactòria.

---

## 8.2. Mapeig i Suport de Dades Multilingües Dinàmiques (`JSONB`)

### El Repte
Per donar suport a la internacionalització en temps real (català, castellà i anglès) de la informació introduïda pels comerciants (com el nom de la botiga, la descripció o els títols dels cupons), es va triar el format `JSONB` de PostgreSQL. La dificultat residia en com mapejar estructures dinàmiques de tipus mapa de Java (`Map<String, String>`) a columnes de dades d'aquest format mitjançant l'ORM d'Hibernate i JPA. Hibernate no disposa de control natiu automatitzat per a `JSONB` en les seves versions estàndard de persistència, fet que provocava errors d'incompatibilitat de tipus en desar dades.

### La Solució
S'han definit convertidors d'atributs JPA customitzats (*AttributeConverters*) i declaracions de columna de definició de taula explícites mitjançant l'esquema de Flyway. Aquesta configuració s'encarrega de serialitzar l'objecte de mapa de Java a una cadena JSON abans d'enviar la sentència a la base de dades, i de deserialitzar-lo de tornada a un mapa estructurat en recuperar les dades. A la capa d'entrada de l'API (DTO), s'utilitzen validacions de tipus per assegurar que el JSON d'entrada conté com a mínim les claus de traducció obligatòries per a les llengües de suport configurades pel municipi.

---

## 8.3. Marca Blanca Reactiva i Pre-càrrega Visual de Branding

### El Repte
PromoRural es concep com una aplicació mòbil i d'escriptori dinàmica de marca blanca (el servidor subministra el logotip del municipi amfitrió, el nom de l'ajuntament i la paleta de colors primari/secundari). Inicialment, els clients (mòbil i BackOffice) experimentaven un parpelleig visual molest (*flickering*) en iniciar-se: en obrir l'aplicació, l'usuari veia els estils per defecte del codi (per exemple, colors blaus genèrics) durant mig segon abans que es completés la crida asíncrona de configuració HTTP i el disseny es commutés sobtadament als colors corporatius de l'ajuntament.

### La Solució
S'ha dissenyat un proveïdor d'estat global reactiu (`ThemeProvider`). Tant a la interfície web com a l'aplicació mòbil, la pantalla de pre-càrrega o transició visual (*Splash Screen*) es manté en primer pla de manera obligatòria bloquejant la navegació fins que s'ha resolt completament la descàrrega de la configuració de marca blanca del municipi (`GET /api/public/config`). Un cop obtinguts el logotip i la paleta cromàtica, es resol la promesa i s'injecten les variables CSS i estils al context actiu, renderitzant directament l'aplicació mòbil amb la identitat corporativa de l'ajuntament de forma neta i transparent per a l'usuari final.

---

## 8.4. Preservació de Variables Dinàmiques en Modals amb Canvis Linguístics Actius

### El Repte
El disseny de la interfície de gestió web utilitza diàlegs modals per confirmar accions crítiques. Aquests modals interpolen cadenes de text dinàmiques obtingudes del servidor (per exemple, el diàleg de confirmació de baixa que presenta el literal d'avís de destrucció de dades indicant el nom de la botiga). Si l'usuari canviava de llengua des de la capçalera amb el modal obert, el component re-avaluava el hook de traduccions, però perdia les referències dinàmiques en memòria del nom del comerç, deixant el literal de confirmació buit o incomplet.

### La Solució
S'ha reestructurat el proveïdor de diàlegs de confirmació (`ConfirmProvider.jsx`). En lloc d'emmagatzemar a l'estat local de la modal una cadena de text estàtica ja resolta, s'ha separat la lògica de presentació del text de manera que s'emmagatzema la clau d'i18n i l'objecte amb els paràmetres dinàmics per separat. D'aquesta manera, quan l'usuari commuta l'idioma al BackOffice, la llibreria de traduccions torna a interpolar correctament els valors en la modal amb el nou idioma de forma reactiva sense perdre el nom del negoci o dades associades.

---

## 8.5. Limitacions de Base de Dades en Memòria (H2) en Tests de Geolocalització

### El Repte
Les proves d'integració de components contra una base de dades en memòria tradicional (H2) són molt demanades pel fet que són ràpides de llançar. Tanmateix, PromoRural es basa en operacions de coordenades GPS, consultes de proximitat espacial i operadors geomètrics complexos recolzats per PostGIS i PostgreSQL. H2, fins i tot en el seu mode de compatibilitat, és totalment incapaç de resoldre operacions de georeferenciació PostGIS reals, el que provocava errors d'incompatibilitat en llançar els tests de controladors o repositoris relacionats amb comerços o mapes d'actes turístics.

### La Solució
S'ha justificat en l'estratègia de proves la migració de la suite de testatge d'integració del BackEnd cap a l'ús de **Testcontainers**. Aquesta eina d'enginyeria automatitza la creació de contenidors Docker efímers carregant la mateixa imatge real de PostgreSQL/PostGIS que s'utilitzarà en els entorns reals de producció. D'aquesta manera, els tests d'integració avaluen les consultes espacials reals i operadors JSONB sense forçar falsificacions (*mocking*) excessives en els tests de dades del servidor.
