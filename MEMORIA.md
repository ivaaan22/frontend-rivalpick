# Memoria del Proyecto — RivalPick

---

## 1. Título del proyecto

**RivalPick** — Plataforma de predicciones de fútbol entre amigos

---

## 2. Propuesta: explicación, objetivos y justificación

### Explicación

RivalPick es una aplicación web SaaS que permite a grupos de amigos competir haciendo predicciones de partidos de fútbol. Los usuarios crean o se unen a grupos, eligen una competición (LaLiga, Premier League, Bundesliga, Serie A, Ligue 1, Champions League o Mundial 2026) y predicen los resultados de cada jornada, ya sea en formato clásico (1X2) o marcador exacto. El sistema resuelve automáticamente las predicciones cuando los partidos terminan y actualiza el ranking del grupo.

### Objetivos

- Ofrecer una experiencia de competición social alrededor del fútbol, sin apuestas de dinero.
- Permitir crear grupos privados o públicos con código de invitación.
- Gestionar partidos de 7 competiciones (2.014 partidos en la base de datos).
- Implementar dos modos de juego: clásico (1X2, 3 puntos) y marcador exacto (5 puntos).
- Desplegar la aplicación en producción accesible desde cualquier dispositivo.

### Justificación

Las aplicaciones de porras entre amigos existentes (como Comunio o La Quiniela) suelen estar ligadas a plataformas oficiales o implican dinero. RivalPick cubre la necesidad de una herramienta libre, personalizable y centrada en la diversión entre grupos cerrados de amigos. Además, el proyecto sirve para demostrar competencias en desarrollo full-stack moderno (Next.js + Node.js + MongoDB).

---

## 3. Stack tecnológico y justificación

### Frontend

| Tecnología | Versión | Justificación |
|---|---|---|
| Next.js | 16.2 | Framework React con App Router, SSR y despliegue fácil a Vercel |
| React | 19 | Biblioteca de componentes declarativos |
| Tailwind CSS | 4 | Utilidades CSS para diseño rápido y consistente |

### Backend

| Tecnología | Versión | Justificación |
|---|---|---|
| Node.js | 18+ | Entorno JavaScript en el servidor, ecosistema amplio |
| Express | 5 | Framework minimalista para API REST |
| MongoDB Atlas | Cloud | Base de datos NoSQL flexible para datos de partidos y usuarios |
| Mongoose | 8 | ODM para MongoDB con esquemas y validación |
| JWT | — | Autenticación sin sesión, compatible con SPA |
| bcryptjs | — | Encriptación de contraseñas |
| Multer / Base64 | — | Gestión de fotos de perfil (guardado en MongoDB como Base64) |

### Despliegue

| Servicio | Uso |
|---|---|
| Vercel | Despliegue del frontend (Next.js) |
| Render | Despliegue del backend (Node.js) |
| MongoDB Atlas | Base de datos en la nube |
| GitHub | Control de versiones y CI/CD |

### Justificación del stack

Se ha elegido un stack JavaScript puro (JS en el frontend y en el backend) para maximizar la reutilización de código y reducir la curva de aprendizaje. MongoDB es idóneo para datos de partidos con estructura variable (fases, grupos, jornadas). Next.js con App Router permite páginas client-side sin sacrificar SEO. El despliegue a Vercel + Render es gratuito para proyectos escolares y ofrece CI/CD automático desde GitHub.

---

## 4. Herramientas de desarrollo y CI/CD, incluyendo uso de IA y metodología de trabajo

### Herramientas de desarrollo

- **Visual Studio Code** — Editor principal con extensiones ESLint, Prettier y GitLens.
- **Git + GitHub** — Control de versiones con ramas por funcionalidad (`feature/...`) y fusión a `main`.
- **Postman** — Pruebas manuales de los endpoints de la API REST durante el desarrollo.
- **MongoDB Compass** — Explorador visual de la base de datos para verificar datos seed.
- **Node.js scripts** — Scripts de seed (`seedPartidos.js`, `seedMundial.js`) para poblar la base de datos.

### CI/CD

- **Vercel** despliega automáticamente el frontend cada vez que se hace push a la rama `main` del repositorio `ivaaan22/frontend-rivalpick`.
- **Render** despliega automáticamente el backend cada vez que se hace push a la rama `main` del repositorio `ivaaan22/Backend-Rivalpick`.
- No se han configurado tests automatizados en el pipeline de CI, pero se hacen pruebas manuales de cada funcionalidad antes de cada commit.

### Uso de IA

Se ha utilizado **Claude (Anthropic)** como asistente de desarrollo a lo largo de todo el proyecto. La IA ha ayudado en:

- Generación de código de componentes React y controladores Express.
- Debugging de errores (500, CORS, errores de validación de Mongoose).
- Diseño de la arquitectura de la base de datos.
- Creación de los scripts de seed con 2.014 partidos reales.
- Pruebas de usuario automatizadas mediante la integración de Claude con el navegador.
- Redacción de documentación (README, memoria).

La IA se ha usado como copiloto, revisando siempre el código generado y adaptándolo a las necesidades específicas del proyecto.

### Metodología de trabajo

Se ha seguido una metodología **ágil simplificada** con sprints semanales:

- Reuniones breves al principio de cada sprint para definir las tareas.
- Uso de ramas Git para cada funcionalidad.
- Pruebas manuales antes de cada merge a `main`.
- Despliegue continuo a producción (Vercel + Render) para validar en entorno real.

---

## 5. Planificación

### Historias de usuario principales

| ID | Como... | Quiero... | Para poder... |
|---|---|---|---|
| HU-01 | Usuario | Registrar me e iniciar sesión | Acceder a la plataforma de forma segura |
| HU-02 | Usuario | Crear un grupo e invitar amigos | Competir con mi círculo |
| HU-03 | Usuario | Unirme a un grupo con código | Participar en una porra existente |
| HU-04 | Usuario | Ver los partidos de mi liga | Saber qué partidos tengo que predecir |
| HU-05 | Usuario | Hacer mis predicciones (1X2 o exacto) | Competir y acumular puntos |
| HU-06 | Usuario | Ver los resultados y el ranking | Saber cómo estoy en el grupo |
| HU-07 | Usuario | Ver mi historial y estadísticas | Analizar mi rendimiento |
| HU-08 | Usuario | Subir una foto de perfil | Personalizar mi cuenta |
| HU-09 | Admin grupo | Resolver una jornada | Actualizar los puntos automáticamente |
| HU-10 | Superadmin | Gestionar usuarios y grupos | Administrar la plataforma |

### Sprints

| Sprint | Duración | Funcionalidades |
|---|---|---|
| Sprint 1 | Semana 1 | Auth (registro, login, JWT), modelo de usuario |
| Sprint 2 | Semana 2 | Grupos (crear, unirse, editar, expulsar), membresías |
| Sprint 3 | Semana 3 | API de partidos propia (MongoDB), seed de 1.941 partidos |
| Sprint 4 | Semana 4 | Predicciones (1X2), resolución de jornadas, rankings |
| Sprint 5 | Semana 5 | Mundial 2026 (73 partidos), Champions por fases, modo exacto |
| Sprint 6 | Semana 6 | Foto de perfil (Base64), Avatar reutilizable, dashboard |
| Sprint 7 | Semana 7 | Despliegue (Vercel + Render), correcciones de bugs, memoria |

### Diagrama de Gantt (simplificado)

```
Semana:    1    2    3    4    5    6    7
Auth        ████
Grupos            ████
Partidos              ████
Predicciones                ████
Mundial/Exacto                  ████
Foto/Avatar                          ████
Deploy/Docs                               ████
```

---

## 6. Casos de uso y diagrama de casos de uso

### Actores

- **Usuario no autenticado** — Puede registrarse, iniciar sesión y recuperar la contraseña.
- **Usuario autenticado** — Puede hacer predicciones, ver resultados, gestionar su perfil.
- **Admin de grupo** — Puede editar el grupo, expulsar miembros y resolver jornadas.
- **Superadmin** — Acceso al panel de administración global.

### Casos de uso principales

| Caso de uso | Actor | Descripción |
|---|---|---|
| CU-01 Registro | Usuario no autenticado | El usuario crea una cuenta con nombre, email, username y contraseña |
| CU-02 Login | Usuario no autenticado | El usuario inicia sesión y recibe un token JWT |
| CU-03 Recuperar contraseña | Usuario no autenticado | El usuario cambia la contraseña verificando email y contraseña actual |
| CU-04 Crear grupo | Usuario autenticado | Crea un grupo eligiendo liga, modo y visibilidad |
| CU-05 Unirse a grupo | Usuario autenticado | Se une con un código de 6 caracteres |
| CU-06 Hacer predicciones | Usuario autenticado | Elige 1/X/2 o introduce marcador exacto para cada partido |
| CU-07 Ver resultados | Usuario autenticado | Consulta resultados y ranking de una jornada |
| CU-08 Gestionar perfil | Usuario autenticado | Edita datos y sube foto de perfil |
| CU-09 Resolver jornada | Admin de grupo | Resuelve las predicciones y actualiza puntos |
| CU-10 Panel admin | Superadmin | Ve estadísticas globales y gestiona usuarios/grupos |

### Diagrama de casos de uso (texto)

```
┌─────────────────────────────────────────────┐
│                  RivalPick                  │
│                                             │
│  [Usuario no autenticado]                    │
│    ├── CU-01 Registro                        │
│    ├── CU-02 Login                           │
│    └── CU-03 Recuperar contraseña            │
│                                             │
│  [Usuario autenticado]                       │
│    ├── CU-04 Crear grupo                     │
│    ├── CU-05 Unirse a grupo                  │
│    ├── CU-06 Hacer predicciones              │
│    ├── CU-07 Ver resultados                  │
│    └── CU-08 Gestionar perfil                │
│                                             │
│  [Admin de grupo] (hereda Usuario autenticado) │
│    └── CU-09 Resolver jornada                │
│                                             │
│  [Superadmin] (hereda Admin de grupo)        │
│    └── CU-10 Panel de administración         │
└─────────────────────────────────────────────┘
```

---

## 7. Explicación del código por bloques

### 7.1 Backend — Estructura general

El backend sigue el patrón **MVC** (Model-View-Controller) adaptado a una API REST:

```
src/
├── index.js              # Punto de entrada: Express, middleware, rutas
├── models/               # Esquemas Mongoose (MongoDB)
├── controllers/          # Lógica de negocio de cada recurso
├── routes/               # Definición de endpoints y middleware
└── middleware/           # Auth (JWT), upload (Base64)
```

#### index.js — Configuración de Express

```javascript
app.use(cors())
app.use(express.json({ limit: '10mb' }))  // Acepta imágenes Base64
app.use('/uploads', express.static(...))   // Sirve ficheros estáticos
```

Se han registrado 8 grupos de rutas: auth, users, grupos, partidos, predicciones, resolución, dashboard y admin.

### 7.2 Modelos de datos

#### Modelo Usuario
Campos principales: `nombre`, `email`, `password` (bcrypt), `username`, `equipoFavorito`, `fotoPerfil` (Base64), `rol` (usuario/superadmin).

#### Modelo Grupo
Campos: `nombre`, `liga` (enum de 7 competiciones), `modo` (1X2 o exacto), `visibilidad`, `codigoInvitacion` (6 caracteres aleatorios), `creadoPor`.

#### Modelo Partido
Campos: `partidoId` (clave única como `WC2026-A1`), `liga`, `jornada`, `fase`, `grupo`, `fecha`, `estado`, `equipoLocal/Visitante`, `escudoLocal/Visitante`, `golesLocal/Visitante`.

#### Modelo Predicción
Campos: `userId`, `grupoId`, `partidoId`, `jornada`, `liga`, `prediccion` (string: `'1'`, `'X'`, `'2'` o `'2-1'`), `resuelta`.

#### Modelo Puntuación
Campos: `userId`, `grupoId`, `prediccionId`, `jornada`, `puntos` (3 por 1X2, 5 por exacto), `acierto`.

### 7.3 Autenticación (JWT)

El flujo de autenticación es el siguiente:

1. El usuario envía email y contraseña a `POST /api/auth/login`.
2. El servidor verifica la contraseña con `bcrypt.compare`.
3. Si es correcta, genera un token JWT con `jwt.sign({ id, rol }, JWT_SECRET, { expiresIn: '7d' })`.
4. El cliente guarda el token en `localStorage` y lo envía en cada petición como `Authorization: Bearer <token>`.
5. El middleware `verificarToken` valida el token y añade el usuario a `req.usuario`.

### 7.4 API de partidos propia

En lugar de usar una API externa en tiempo real, los partidos se guardan en MongoDB. Esto garantiza:
- Disponibilidad sin depender de terceros.
- Control total sobre los datos (fases, grupos del Mundial, escudos).
- Posibilidad de actualizar resultados manualmente con `updatePartido.js`.

El seed inicial usa la API de `football-data.org` para descargar 1.941 partidos de las 5 ligas y la Champions. Los 73 partidos del Mundial 2026 se han introducido manualmente.

### 7.5 Sistema de predicciones

**Modo 1X2:**
```javascript
// El usuario pulsa un botón (1, X o 2) → se guarda en MongoDB
POST /api/predicciones { grupoId, partidoId, jornada, liga, prediccion: '1' }
```

**Modo marcador exacto:**
```javascript
// El usuario introduce goles locales y visitantes → se guarda como "2-1"
POST /api/predicciones { grupoId, partidoId, jornada, liga, prediccion: '2-1' }
```

**Resolución de jornada:**
```javascript
// Modo 1X2: 3 puntos si acierta el ganador/empate
// Modo exacto: 5 puntos si acierta el marcador exacto
if (grupo.modo === 'exacto') {
  const marcadorReal = `${partido.golesLocal}-${partido.golesVisitante}`
  acierto = prediccion.prediccion === marcadorReal
  puntos = acierto ? 5 : 0
}
```

### 7.6 Frontend — Estructura de páginas

El frontend usa el **App Router** de Next.js con componentes client (`'use client'`):

```
src/app/
├── page.js              # Dashboard con alertas de jornada
├── login/               # Autenticación
├── registro/            # Registro de nuevo usuario
├── recuperar-password/  # Cambio de contraseña sin sesión
├── grupos/              # Listado, crear, unirse, detalle
├── partidos/            # Vista de partidos por liga y jornada
├── predicciones/        # Hacer predicciones (1X2 o exacto)
├── resultados/          # Resultados y rankings por jornada
├── historial/           # Estadísticas y gráfico de puntos
├── perfil/              # Editar datos, foto, contraseña
└── admin/               # Panel superadmin
```

### 7.7 Componente Avatar

Componente reutilizable que muestra la foto de perfil (Base64) o las iniciales si no hay:

```jsx
<Avatar usuario={usuario} size="md" />
// Tamaños: xs, sm, md, lg, xl
```

Se usa en: Navbar, detalle de grupo (miembros), resultados (rankings), panel admin.

### 7.8 Foto de perfil — Base64 en MongoDB

En lugar de Cloudinary o Multer con sistema de ficheros (efímero en Render), la foto se convierte a Base64 en el navegador y se guarda directamente en MongoDB:

```javascript
// Frontend: comprime a 800px y calidad 0.8 antes de enviar
const base64 = await comprimirImagen(file, 800, 0.8)
await apiRequest('/users/me/foto', { method: 'POST', body: JSON.stringify({ foto: base64 }) })

// Backend: guarda el string Base64 en el documento del usuario
usuario.fotoPerfil = foto
await usuario.save()
```

Ventaja: la foto persiste para siempre en MongoDB Atlas, independiente del servidor.

---

## 8. Pruebas: testing, usabilidad y verificación de accesibilidad nivel A

### 8.1 Testing manual de funcionalidades

Se han hecho pruebas manuales de todas las funcionalidades principales:

| Funcionalidad | Resultado |
|---|---|
| Registro de usuario | ✅ Correcto |
| Login y logout | ✅ Correcto |
| Recuperar contraseña | ✅ Correcto |
| Crear grupo (todas las ligas) | ✅ Correcto |
| Unirse a grupo con código | ✅ Correcto |
| Hacer predicciones 1X2 | ✅ Correcto |
| Hacer predicciones marcador exacto | ✅ Correcto |
| Ver partidos (7 competiciones) | ✅ Correcto |
| Resolver jornada | ✅ Correcto |
| Ver resultados y ranking | ✅ Correcto |
| Historial por grupo | ✅ Correcto |
| Subir foto de perfil | ✅ Persistente en MongoDB |
| Avatar en toda la app | ✅ Correcto |
| Panel admin | ✅ Correcto |
| Despliegue Vercel + Render | ✅ Operativo |

### 8.2 Pruebas de usabilidad

Las pruebas de usabilidad se han hecho con usuarios reales (compañeros de clase) que han evaluado:

- **Flujo de registro y primer acceso:** Los usuarios han podido registrarse y unirse a un grupo en menos de 2 minutos sin instrucciones.
- **Hacer predicciones:** La interfaz de botones 1/X/2 y los campos numéricos para el modo exacto se consideran intuitivos.
- **Feedback visual:** Los botones se marcan en verde cuando se guarda la predicción y las tarjetas muestran borde verde cuando están completas.
- **Navegación:** La Navbar con acceso directo a todas las secciones se valora positivamente.

**Mejoras implementadas tras las pruebas:**
- Añadido mensaje "✓ Predicción guardada automáticamente" para confirmar el guardado.
- Añadido resumen de X/Y partidos predichos al final de la lista.
- Selector de grupo en Historial para filtrar por competición.
- Selector de jornadas adaptado a cada liga (38 LaLiga, 3 Mundial, etc.).

### 8.3 Verificación de accesibilidad nivel A (WCAG 2.1)

Se han verificado los criterios de accesibilidad de nivel A más relevantes:

| Criterio WCAG 2.1 | Nivel | Estado |
|---|---|---|
| 1.1.1 Contenido no textual (alt en imágenes) | A | ✅ Todas las imágenes (escudos, banderas) tienen atributo `alt` |
| 1.3.1 Información y relaciones (etiquetas de formulario) | A | ✅ Inputs con `label` asociado |
| 1.4.3 Contraste (texto sobre fondo) | AA | ✅ Zinc-950 + blanco/emerald ofrece contraste >4.5:1 |
| 2.1.1 Teclado (navegación sin ratón) | A | ✅ Todos los botones e inputs accesibles por teclado |
| 2.4.1 Omitir bloques (skip link) | A | ⚠️ No implementado (mejora futura) |
| 3.1.1 Idioma de la página | A | ✅ `lang="es"` en el tag `<html>` |
| 3.3.1 Identificación de errores | A | ✅ Mensajes de error textuales en los formularios |
| 4.1.1 Análisis (HTML válido) | A | ✅ Next.js genera HTML semántico correcto |
| 4.1.2 Nombre, rol, valor | A | ✅ Botones con texto descriptivo, inputs con `type` correcto |

**Herramientas usadas para verificar la accesibilidad:**
- Lighthouse (Chrome DevTools) — Puntuación de accesibilidad: **89/100**.
- Contrast checker manual para los colores principales del diseño.

### 8.4 Verificación de despliegue

| Entorno | URL | Estado |
|---|---|---|
| Frontend (Vercel) | https://frontend-rivalpick.vercel.app | ✅ Operativo |
| Backend (Render) | https://backend-rivalpick.onrender.com | ✅ Operativo |
| Base de datos (MongoDB Atlas) | Cluster0 | ✅ Operativo |

---

## Anexos

### Usuarios de prueba

| Email | Contraseña | Rol |
|---|---|---|
| ivangarciac10@gmail.com | Ivancete@1803 | superadmin |
| joel@gmail.com | Joel123 | usuario |
| oscar@gmail.com | oscar123 | usuario |

### Grupos de prueba

| Nombre | Liga | Modo | Código |
|---|---|---|---|
| Peña Barcelonista | LaLiga | Clásico | RHZPEJ |
| El mundialito de los jugones | Mundial | Clásico | PNQTUW |
| Porra Mundial Exacto | Mundial | Exacto | J7R8TM |

### Repositorios

- **Frontend:** https://github.com/ivaaan22/frontend-rivalpick
- **Backend:** https://github.com/ivaaan22/Backend-Rivalpick