# RivalPick — Frontend

Interfaz web de la plataforma de predicciones de fútbol entre amigos. Construida con Next.js 16 y Tailwind CSS.

## Tecnologías

- **Next.js 16** (App Router)
- **React 19**
- **Tailwind CSS 4**
- Diseño solo modo oscuro (zinc-950 + emerald-500)

## Requisitos previos

- Node.js 18+
- Backend de RivalPick corriendo en local o desplegado

## Instalación

```bash
git clone https://github.com/ivaaan22/frontend-rivalpick.git
cd frontend-rivalpick
npm install
npm run dev
```

La app estará disponible en `http://localhost:3000`.

## Configuración

El archivo `src/app/services/api.js` contiene la URL base del backend:

```javascript
const API_URL = 'http://localhost:3001/api'
```

Cámbiala a la URL de producción cuando despliegues.

## Estructura del proyecto

```
src/app/
├── page.js                     # Dashboard principal
├── login/page.js               # Inicio de sesión
├── registro/page.js            # Crear cuenta
├── grupos/
│   ├── page.js                 # Lista de grupos
│   ├── nuevo/page.js           # Crear grupo
│   ├── unirse/page.js          # Unirse con código
│   └── [id]/page.js            # Detalle del grupo
├── partidos/page.js            # Partidos por liga y jornada
├── predicciones/page.js        # Hacer predicciones
├── resultados/page.js          # Resultados y rankings
├── historial/page.js           # Historial personal con gráfica
├── perfil/page.js              # Editar perfil y foto
├── admin/page.js               # Panel superadmin
├── components/
│   ├── Navbar.js               # Navbar sticky con avatar
│   ├── Avatar.js               # Componente avatar reutilizable
│   ├── Loading.js              # Spinner de carga
│   └── ProtectedRoute.js       # Protección de rutas privadas
└── services/
    └── api.js                  # Helper para peticiones al backend
```

## Funcionalidades

### Autenticación
- Registro e inicio de sesión con JWT
- Rutas protegidas con `ProtectedRoute`
- Cierre de sesión desde el Navbar

### Grupos
- Crear grupos con liga, modo de juego (1X2 o exacto) y apuesta
- Unirse con código de invitación de 6 caracteres
- Ver miembros con foto de perfil
- Panel de admin del grupo (editar, eliminar, expulsar miembros)
- Ligas disponibles: LaLiga, Premier, Bundesliga, Serie A, Ligue 1, Champions League, Mundial 2026

### Partidos
- Visualización por liga con logos oficiales
- Navegación por jornadas
- Champions League con fases (grupos, playoffs, octavos, cuartos, semis, final)
- Mundial 2026 con selector de grupos A-L
- Estados: Programado, En juego, Finalizado

### Predicciones
- Sistema 1X2 por partido
- Guardado automático al seleccionar
- Indicador de progreso (X/Y predichos)
- Tarjetas con borde verde cuando hay predicción guardada
- Resumen final con botón de vuelta al grupo

### Resultados
- Ranking de jornada y ranking general
- Avatares de usuario en los rankings
- Número de jornadas según la liga (38 ligas, 8 Champions, 3 Mundial)
- Curiosidades: partido más acertado/fallado, porcentaje de acierto

### Historial
- Gráfica de barras de puntos por jornada
- Estadísticas globales: puntos totales, % acierto, jornadas jugadas

### Perfil
- Editar nombre, username y equipo favorito
- Subir foto de perfil (JPG, PNG, WEBP hasta 5MB)
- Avatar visible en Navbar, grupos, rankings y panel admin

### Panel de administración
- Solo accesible para usuarios con rol `superadmin`
- Estadísticas globales: usuarios, grupos, predicciones
- Gestión de usuarios y grupos (ver y eliminar)

## Componente Avatar

Reutilizable en toda la app. Muestra la foto de perfil si existe, o las iniciales del nombre si no.

```jsx
import Avatar from '../components/Avatar'

<Avatar usuario={usuario} size="md" />
```

Tamaños disponibles: `xs`, `sm`, `md`, `lg`, `xl`

## Scripts

```bash
npm run dev      # Desarrollo con hot reload
npm run build    # Build de producción
npm run start    # Servidor de producción
npm run lint     # Linter
```
