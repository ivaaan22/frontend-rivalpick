# Memòria del Projecte — RivalPick

---

## 1. Títol del projecte

**RivalPick** — Plataforma de prediccions de futbol entre amics

---

## 2. Proposta: explicació, objectius i justificació

### Explicació

RivalPick és una aplicació web SaaS que permet a grups d'amics competir fent prediccions de partits de futbol. Els usuaris creen o s'uneixen a grups, trien una competició (LaLiga, Premier League, Bundesliga, Serie A, Ligue 1, Champions League o Mundial 2026) i prediuen els resultats de cada jornada, ja sigui en format clàssic (1X2) o marcador exacte. El sistema resol automàticament les prediccions quan els partits acaben i actualitza el rànquing del grup.

### Objectius

- Oferir una experiència de competició social al voltant del futbol, sense apostes de diners.
- Permetre crear grups privats o públics amb codi d'invitació.
- Gestionar partits de 7 competicions (2.014 partits a la base de dades).
- Implementar dos modes de joc: clàssic (1X2, 3 punts) i marcador exacte (5 punts).
- Desplegar l'aplicació en producció accessible des de qualsevol dispositiu.

### Justificació

Les aplicacions de porres entre amics existents (com Comunio o La Quiniela) solen estar lligades a plataformes oficials o impliquen diners. RivalPick cobreix la necessitat d'una eina lliure, personalitzable i centrada en la diversió entre grups tancats d'amics. A més, el projecte serveix per demostrar competències en desenvolupament full-stack modern (Next.js + Node.js + MongoDB).

---

## 3. Stack tecnològic i justificació

### Frontend

| Tecnologia | Versió | Justificació |
|---|---|---|
| Next.js | 16.2 | Framework React amb App Router, SSR i desplegament fàcil a Vercel |
| React | 19 | Biblioteca de components declaratius |
| Tailwind CSS | 4 | Utilitats CSS per a disseny ràpid i consistent |

### Backend

| Tecnologia | Versió | Justificació |
|---|---|---|
| Node.js | 18+ | Entorn JavaScript al servidor, ecosistema ampli |
| Express | 5 | Framework minimalista per a API REST |
| MongoDB Atlas | Cloud | Base de dades NoSQL flexible per a dades de partits i usuaris |
| Mongoose | 8 | ODM per a MongoDB amb esquemes i validació |
| JWT | — | Autenticació sense sessió, compatible amb SPA |
| bcryptjs | — | Encriptació de contrasenyes |
| Multer / Base64 | — | Gestió de fotos de perfil (guardat a MongoDB com a Base64) |

### Desplegament

| Servei | Ús |
|---|---|
| Vercel | Desplegament del frontend (Next.js) |
| Render | Desplegament del backend (Node.js) |
| MongoDB Atlas | Base de dades al núvol |
| GitHub | Control de versions i CI/CD |

### Justificació del stack

S'ha triat un stack JavaScript pur (JS al frontend i al backend) per maximitzar la reutilització de codi i reduir la corba d'aprenentatge. MongoDB és idoni per a dades de partits amb estructura variable (fases, grups, jornades). Next.js amb App Router permet pàgines client-side sense sacrificar SEO. El desplegament a Vercel + Render és gratuït per a projectes escolars i ofereix CI/CD automàtic des de GitHub.

---

## 4. Eines de desenvolupament i CI/CD, incloent ús d'IA i metodologia de treball

### Eines de desenvolupament

- **Visual Studio Code** — Editor principal amb extensions ESLint, Prettier i GitLens.
- **Git + GitHub** — Control de versions amb branques per funcionalitat (`feature/...`) i fusió a `main`.
- **Postman** — Proves manuals dels endpoints de l'API REST durant el desenvolupament.
- **MongoDB Compass** — Explorador visual de la base de dades per verificar dades seed.
- **Node.js scripts** — Scripts de seed (`seedPartidos.js`, `seedMundial.js`) per poblar la base de dades.

### CI/CD

- **Vercel** despliega automàticament el frontend cada vegada que es fa push a la branca `main` del repositori `ivaaan22/frontend-rivalpick`.
- **Render** despliega automàticament el backend cada vegada que es fa push a la branca `main` del repositori `ivaaan22/Backend-Rivalpick`.
- No s'han configurat tests automatitzats en el pipeline de CI, però es fan proves manuals de cada funcionalitat abans de cada commit.

### Ús d'IA

S'ha utilitzat **Claude (Anthropic)** com a assistent de desenvolupament al llarg de tot el projecte. L'IA ha ajudat en:

- Generació de codi de components React i controladors Express.
- Debugging d'errors (500, CORS, Mongoose validation errors).
- Disseny de l'arquitectura de la base de dades.
- Creació dels scripts de seed amb 2.014 partits reals.
- Proves d'usuari automatitzades mitjançant la integració de Claude amb el navegador.
- Redacció de documentació (README, memòria).

L'IA s'ha fet servir com a copilot, revisant sempre el codi generat i adaptant-lo a les necessitats específiques del projecte.

### Metodologia de treball

S'ha seguit una metodologia **àgil simplificada** amb sprints setmanals:

- Reunions breus al principi de cada sprint per definir les tasques.
- Ús de branques Git per a cada funcionalitat.
- Proves manuals abans de cada merge a `main`.
- Desplegament continu a producció (Vercel + Render) per validar en entorn real.

---

## 5. Planificació

### Històries d'usuari principals

| ID | Com a... | Vull... | Per tal de... |
|---|---|---|---|
| HU-01 | Usuari | Registrar-me i iniciar sessió | Accedir a la plataforma de forma segura |
| HU-02 | Usuari | Crear un grup i convidar amics | Competir amb el meu cercle |
| HU-03 | Usuari | Unir-me a un grup amb codi | Participar en una porra existent |
| HU-04 | Usuari | Veure els partits de la meva lliga | Saber quins partits he de predir |
| HU-05 | Usuari | Fer les meves prediccions (1X2 o exacte) | Competir i acumular punts |
| HU-06 | Usuari | Veure els resultats i el rànquing | Saber com estic al grup |
| HU-07 | Usuari | Veure el meu historial i estadístiques | Analitzar el meu rendiment |
| HU-08 | Usuari | Pujar una foto de perfil | Personalitzar el meu compte |
| HU-09 | Admin grup | Resolver una jornada | Actualitzar els punts automàticament |
| HU-10 | Superadmin | Gestionar usuaris i grups | Administrar la plataforma |

### Sprints

| Sprint | Durada | Funcionalitats |
|---|---|---|
| Sprint 1 | Setmana 1 | Auth (registre, login, JWT), model d'usuari |
| Sprint 2 | Setmana 2 | Grups (crear, unir-se, editar, expulsar), membresies |
| Sprint 3 | Setmana 3 | API de partits pròpia (MongoDB), seed de 1.941 partits |
| Sprint 4 | Setmana 4 | Prediccions (1X2), resolució de jornades, rànquings |
| Sprint 5 | Setmana 5 | Mundial 2026 (73 partits), Champions per fases, mode exacte |
| Sprint 6 | Setmana 6 | Foto de perfil (Base64), Avatar reutilitzable, dashboard |
| Sprint 7 | Setmana 7 | Desplegament (Vercel + Render), correccions de bugs, memòria |

### Diagrama de Gantt (simplificat)

```
Setmana:    1    2    3    4    5    6    7
Auth        ████
Grups            ████
Partidos              ████
Prediccions                ████
Mundial/Exacte                  ████
Foto/Avatar                          ████
Deploy/Docs                               ████
```

---

## 6. Casos d'ús i diagrama de casos d'ús

### Actors

- **Usuari no autenticat** — Pot registrar-se, iniciar sessió i recuperar la contrasenya.
- **Usuari autenticat** — Pot fer prediccions, veure resultats, gestionar el seu perfil.
- **Admin de grup** — Pot editar el grup, expulsar membres i resolver jornades.
- **Superadmin** — Accés al panell d'administració global.

### Casos d'ús principals

| Cas d'ús | Actor | Descripció |
|---|---|---|
| CU-01 Registre | Usuari no autenticat | L'usuari crea un compte amb nom, email, username i contrasenya |
| CU-02 Login | Usuari no autenticat | L'usuari inicia sessió i rep un token JWT |
| CU-03 Recuperar contrasenya | Usuari no autenticat | L'usuari canvia la contrasenya verificant email i contrasenya actual |
| CU-04 Crear grup | Usuari autenticat | Crea un grup triant lliga, mode i visibilitat |
| CU-05 Unir-se a grup | Usuari autenticat | S'uneix amb un codi de 6 caràcters |
| CU-06 Fer prediccions | Usuari autenticat | Tria 1/X/2 o introdueix marcador exacte per a cada partit |
| CU-07 Veure resultats | Usuari autenticat | Consulta resultats i rànquing d'una jornada |
| CU-08 Gestionar perfil | Usuari autenticat | Edita dades i puja foto de perfil |
| CU-09 Resolver jornada | Admin de grup | Resol les prediccions i actualitza punts |
| CU-10 Panell admin | Superadmin | Veu estadístiques globals i gestiona usuaris/grups |

### Diagrama de casos d'ús (text)

```
┌─────────────────────────────────────────────┐
│                  RivalPick                  │
│                                             │
│  [Usuari no autenticat]                     │
│    ├── CU-01 Registre                       │
│    ├── CU-02 Login                          │
│    └── CU-03 Recuperar contrasenya          │
│                                             │
│  [Usuari autenticat]                        │
│    ├── CU-04 Crear grup                     │
│    ├── CU-05 Unir-se a grup                 │
│    ├── CU-06 Fer prediccions                │
│    ├── CU-07 Veure resultats                │
│    └── CU-08 Gestionar perfil              │
│                                             │
│  [Admin de grup] (hereta Usuari autenticat) │
│    └── CU-09 Resolver jornada               │
│                                             │
│  [Superadmin] (hereta Admin de grup)        │
│    └── CU-10 Panell d'administració         │
└─────────────────────────────────────────────┘
```

---

## 7. Explicació del codi per blocs

### 7.1 Backend — Estructura general

El backend segueix el patró **MVC** (Model-View-Controller) adaptat a una API REST:

```
src/
├── index.js              # Punt d'entrada: Express, middleware, rutes
├── models/               # Esquemes Mongoose (MongoDB)
├── controllers/          # Lògica de negoci de cada recurs
├── routes/               # Definició d'endpoints i middleware
└── middleware/           # Auth (JWT), upload (Base64)
```

#### index.js — Configuració d'Express

```javascript
app.use(cors())
app.use(express.json({ limit: '10mb' }))  // Accepta imatges Base64
app.use('/uploads', express.static(...))   // Serveix fitxers estàtics
```

S'han registrat 8 grups de rutes: auth, users, grupos, partidos, predicciones, resolución, dashboard i admin.

### 7.2 Models de dades

#### Model Usuari
Camps principals: `nombre`, `email`, `password` (bcrypt), `username`, `equipoFavorito`, `fotoPerfil` (Base64), `rol` (usuari/superadmin).

#### Model Grup
Camps: `nombre`, `liga` (enum de 7 competicions), `modo` (1X2 o exacte), `visibilitat`, `codigoInvitacion` (6 caràcters aleatoris), `creadoPor`.

#### Model Partit
Camps: `partidoId` (clau única com `WC2026-A1`), `liga`, `jornada`, `fase`, `grupo`, `fecha`, `estado`, `equipoLocal/Visitante`, `escudoLocal/Visitante`, `golesLocal/Visitante`.

#### Model Predicció
Camps: `userId`, `grupoId`, `partidoId`, `jornada`, `liga`, `prediccion` (string: `'1'`, `'X'`, `'2'` o `'2-1'`), `resuelta`.

#### Model Puntuació
Camps: `userId`, `grupoId`, `prediccionId`, `jornada`, `puntos` (3 per 1X2, 5 per exacte), `acerto`.

### 7.3 Autenticació (JWT)

El flux d'autenticació és el següent:

1. L'usuari envia email i contrasenya a `POST /api/auth/login`.
2. El servidor verifica la contrasenya amb `bcrypt.compare`.
3. Si és correcta, genera un token JWT amb `jwt.sign({ id, rol }, JWT_SECRET, { expiresIn: '7d' })`.
4. El client guarda el token al `localStorage` i l'envia en cada petició com a `Authorization: Bearer <token>`.
5. El middleware `verificarToken` valida el token i afegeix l'usuari a `req.usuario`.

### 7.4 API de partits pròpia

En lloc d'usar una API externa en temps real, els partits es guarden a MongoDB. Això garanteix:
- Disponibilitat sense dependre de tercers.
- Control total sobre les dades (fases, grups del Mundial, escudos).
- Possibilitat d'actualitzar resultats manualment amb `updatePartido.js`.

El seed inicial usa l'API de `football-data.org` per descarregar 1.941 partits de les 5 lligues i la Champions. Els 73 partits del Mundial 2026 s'han introduït manualment.

### 7.5 Sistema de prediccions

**Mode 1X2:**
```javascript
// L'usuari clica un botó (1, X o 2) → es guarda a MongoDB
POST /api/predicciones { grupoId, partidoId, jornada, liga, prediccion: '1' }
```

**Mode marcador exacte:**
```javascript
// L'usuari introdueix gols locals i visitants → es guarda com a "2-1"
POST /api/predicciones { grupoId, partidoId, jornada, liga, prediccion: '2-1' }
```

**Resolució de jornada:**
```javascript
// Mode 1X2: 3 punts si encerta el guanyador/empat
// Mode exacte: 5 punts si encerta el marcador exacte
if (grupo.modo === 'exacto') {
  const marcadorReal = `${partido.golesLocal}-${partido.golesVisitante}`
  acerto = prediccion.prediccion === marcadorReal
  puntos = acerto ? 5 : 0
}
```

### 7.6 Frontend — Estructura de pàgines

El frontend usa el **App Router** de Next.js amb components client (`'use client'`):

```
src/app/
├── page.js              # Dashboard amb alertes de jornada
├── login/               # Autenticació
├── registro/            # Registre de nou usuari
├── recuperar-password/  # Canvi de contrasenya sense sessió
├── grupos/              # Llistat, crear, unir-se, detall
├── partidos/            # Vista de partits per lliga i jornada
├── predicciones/        # Fer prediccions (1X2 o exacte)
├── resultados/          # Resultats i rànquings per jornada
├── historial/           # Estadístiques i gràfica de punts
├── perfil/              # Editar dades, foto, contrasenya
└── admin/               # Panell superadmin
```

### 7.7 Component Avatar

Component reutilitzable que mostra la foto de perfil (Base64) o les inicials si no n'hi ha:

```jsx
<Avatar usuario={usuario} size="md" />
// Mides: xs, sm, md, lg, xl
```

S'usa a: Navbar, detall de grup (membres), resultats (rànquings), panell admin.

### 7.8 Foto de perfil — Base64 a MongoDB

En lloc de Cloudinary o Multer amb sistema de fitxers (efímer a Render), la foto es converteix a Base64 al navegador i es guarda directament a MongoDB:

```javascript
// Frontend: comprimeix a 800px i qualitat 0.8 abans d'enviar
const base64 = await comprimirImagen(file, 800, 0.8)
await apiRequest('/users/me/foto', { method: 'POST', body: JSON.stringify({ foto: base64 }) })

// Backend: guarda el string Base64 al document de l'usuari
usuario.fotoPerfil = foto
await usuario.save()
```

Avantatge: la foto persisteix per sempre a MongoDB Atlas, independent del servidor.

---

## 8. Proves: testing, usabilitat i verificació d'accessibilitat nivell A

### 8.1 Testing manual de funcionalitats

S'han fet proves manuals de totes les funcionalitats principals:

| Funcionalitat | Resultat |
|---|---|
| Registre d'usuari | ✅ Correcte |
| Login i logout | ✅ Correcte |
| Recuperar contrasenya | ✅ Correcte |
| Crear grup (totes les lligues) | ✅ Correcte |
| Unir-se a grup amb codi | ✅ Correcte |
| Fer prediccions 1X2 | ✅ Correcte |
| Fer prediccions marcador exacte | ✅ Correcte |
| Veure partits (7 competicions) | ✅ Correcte |
| Resolver jornada | ✅ Correcte |
| Veure resultats i rànquing | ✅ Correcte |
| Historial per grup | ✅ Correcte |
| Pujar foto de perfil | ✅ Persistent a MongoDB |
| Avatar a tota l'app | ✅ Correcte |
| Panell admin | ✅ Correcte |
| Desplegament Vercel + Render | ✅ Operatiu |

### 8.2 Proves de usabilitat

Les proves d'usabilitat s'han fet amb usuaris reals (companys de classe) que han avaluat:

- **Flux de registre i primer accés:** Els usuaris han pogut registrar-se i unir-se a un grup en menys de 2 minuts sense instruccions.
- **Fer prediccions:** La interfície de botons 1/X/2 i els camps numèrics per al mode exacte es consideren intuïtius.
- **Feedback visual:** Els botons es marquen en verd quan es guarda la predicció i les targes mostren borde verd quan estan completes.
- **Navegació:** La Navbar amb accés directe a totes les seccions es valora positivament.

**Millores implementades arran de les proves:**
- Afegit missatge "✓ Predicció guardada automàticament" per confirmar el guardament.
- Afegit resum de X/Y partits predits al final de la llista.
- Selector de grup a Historial per filtrar per competició.
- Selector de jornades adaptat a cada lliga (38 LaLiga, 3 Mundial, etc.).

### 8.3 Verificació d'accessibilitat nivell A (WCAG 2.1)

S'han verificat els criteris d'accessibilitat de nivell A més rellevants:

| Criteri WCAG 2.1 | Nivell | Estat |
|---|---|---|
| 1.1.1 Contingut no textual (alt en imatges) | A | ✅ Totes les imatges (escuts, banderes) tenen atribut `alt` |
| 1.3.1 Informació i relacions (etiquetes de formulari) | A | ✅ Inputs amb `label` associat |
| 1.4.3 Contrast (text sobre fons) | AA | ✅ Zinc-950 + blanc/emerald ofereix contrast >4.5:1 |
| 2.1.1 Teclat (navegació sense ratolí) | A | ✅ Tots els botons i inputs accessibles per teclat |
| 2.4.1 Ometre blocs (skip link) | A | ⚠️ No implementat (millora futura) |
| 3.1.1 Idioma de la pàgina | A | ✅ `lang="es"` al tag `<html>` |
| 3.3.1 Identificació d'errors | A | ✅ Missatges d'error textuals als formularis |
| 4.1.1 Anàlisi (HTML vàlid) | A | ✅ Next.js genera HTML semàntic correcte |
| 4.1.2 Nom, rol, valor | A | ✅ Botons amb text descriptiu, inputs amb `type` correcte |

**Eines usades per verificar l'accessibilitat:**
- Lighthouse (Chrome DevTools) — Puntuació d'accessibilitat: **89/100**.
- Contrast checker manual per als colors principals del disseny.

### 8.4 Verificació de desplegament

| Entorn | URL | Estat |
|---|---|---|
| Frontend (Vercel) | https://frontend-rivalpick.vercel.app | ✅ Operatiu |
| Backend (Render) | https://backend-rivalpick.onrender.com | ✅ Operatiu |
| Base de dades (MongoDB Atlas) | Cluster0 | ✅ Operatiu |

---

## Annexos

### Usuaris de prova

| Email | Contrasenya | Rol |
|---|---|---|
| ivangarciac10@gmail.com | Ivancete@1803 | superadmin |
| joel@gmail.com | Joel123 | usuari |
| oscar@gmail.com | oscar123 | usuari |

### Grups de prova

| Nom | Lliga | Mode | Codi |
|---|---|---|---|
| Peña Barcelonista | LaLiga | Clàssic | RHZPEJ |
| El mundialito de los jugones | Mundial | Clàssic | PNQTUW |
| Porra Mundial Exacto | Mundial | Exacte | J7R8TM |

### Repositoris

- **Frontend:** https://github.com/ivaaan22/frontend-rivalpick
- **Backend:** https://github.com/ivaaan22/Backend-Rivalpick