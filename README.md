# RestoSmartQR 🍽️

Sistema de gestión integral para restaurantes con código QR, punto de venta y administración.

## 🚀 Características

- 📱 Menú digital con código QR
- 💳 Sistema de punto de venta (POS)
- 📊 Dashboard de administración
- 👥 Gestión de personal y horarios
- 📦 Control de inventario
- 💰 Gestión de transacciones
- 🧾 Facturación electrónica (mock DIAN)
- 📈 Reportes y estadísticas

## 🛠️ Stack Tecnológico

- **Frontend**: React + TypeScript + Vite + TailwindCSS
- **Backend**: Node.js + Express + TypeScript
- **Base de datos**: PostgreSQL
- **ORM**: Drizzle ORM
- **Containerización**: Docker + Docker Compose

## 📋 Requisitos Previos

- Node.js >= 20
- npm o yarn
- Docker >= 20.10 (para producción)
- Docker Compose >= 2.0 (para producción)

## 🏃 Quick Start

### Desarrollo Local

```bash
# Instalar dependencias
npm install

# Configurar variables de entorno
cp .env.example .env
# Editar .env con tus credenciales

# Iniciar en modo desarrollo
npm run dev
```

### Docker Compose (Producción)

```bash
# Configurar variables de entorno
cp .env.example .env
# Editar .env con tus credenciales

# Construir e iniciar
docker-compose up -d

# O usar el Makefile
make prod-up
```

### Docker Compose (Desarrollo)

```bash
docker-compose -f docker-compose.dev.yml up
```

## 📚 Documentación

- [Guía de Despliegue](DEPLOY.md) - Instrucciones detalladas para producción
- [Diseño](design_guidelines.md) - Guidelines de diseño

## 🎯 Scripts Disponibles

```bash
npm run dev        # Modo desarrollo
npm run build      # Construir para producción
npm start          # Iniciar en producción
npm run check      # Verificar TypeScript
npm run db:push    # Sincronizar esquema con BD
```

## 🐳 Comandos Docker (Makefile)

```bash
make help          # Ver todos los comandos disponibles
make build         # Construir imágenes
make up            # Iniciar servicios
make down          # Detener servicios
make logs          # Ver logs
make backup        # Backup de BD
make shell-db      # Acceder a PostgreSQL
```

## 🗄️ Base de Datos

La base de datos se inicializa automáticamente con el script `init-db.sql` que crea:

- Tablas principales (users, categories, products, orders, etc.)
- Índices para optimización
- Extensiones necesarias (pgcrypto)

Para poblar con datos de ejemplo, ejecuta:

```bash
npm run dev
# En otra terminal:
node --loader tsx server/seed.ts
```

## 🌐 URLs

- **Aplicación**: http://localhost:5000
- **API**: http://localhost:5000/api
- **PostgreSQL**: localhost:5432

## 🔒 Seguridad

**IMPORTANTE**: Antes de desplegar en producción:

1. Cambiar todas las contraseñas en `.env`
2. Generar un `SESSION_SECRET` seguro
3. Configurar HTTPS con reverse proxy
4. Implementar backups automáticos
5. Configurar firewall

## 📦 Estructura del Proyecto

```
.
├── client/          # Frontend React
├── server/          # Backend Express
├── shared/          # Schemas compartidos
├── Dockerfile       # Imagen de producción
├── docker-compose.yml     # Producción
├── docker-compose.dev.yml # Desarrollo
├── init-db.sql      # Inicialización de BD
└── Makefile         # Comandos útiles
```

## 🤝 Contribuir

1. Fork el proyecto
2. Crea tu rama (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

MIT
