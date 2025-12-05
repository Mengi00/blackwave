# Configuración Docker - RestoSmartQR

## 📦 Archivos Creados

### Docker
- `Dockerfile` - Imagen optimizada multi-stage para producción
- `docker-compose.yml` - Orquestación para producción
- `docker-compose.dev.yml` - Configuración para desarrollo con hot-reload
- `.dockerignore` - Archivos excluidos de la imagen

### Base de Datos
- `init-db.sql` - Script de inicialización de PostgreSQL con:
  - Creación de todas las tablas del esquema
  - Índices para optimización
  - Extensión pgcrypto para UUIDs
  - Usuario admin por defecto

### Scripts
- `healthcheck.sh` - Health check para el contenedor
- `seed-docker.sh` - Script para poblar datos de ejemplo
- `Makefile` - Comandos útiles simplificados

### Documentación
- `README.md` - Actualizado con información completa
- `DEPLOY.md` - Guía detallada de despliegue
- `.env.example` - Plantilla de variables de entorno

## 🚀 Despliegue Rápido

### 1. Configuración Inicial

```bash
# Copiar variables de entorno
cp .env.example .env

# Editar con tus credenciales
nano .env
```

### 2. Lanzar en Producción

```bash
# Opción 1: Con docker-compose directamente
docker-compose build
docker-compose up -d

# Opción 2: Con Makefile (recomendado)
make prod-up
```

### 3. Verificar Despliegue

```bash
# Ver estado
make ps

# Ver logs
make logs

# O específicos
make logs-app
make logs-db
```

### 4. Poblar con Datos de Ejemplo (Opcional)

```bash
make seed
```

## 🔧 Modo Desarrollo

Para desarrollo local con hot-reload:

```bash
docker-compose -f docker-compose.dev.yml up
```

Esto monta tu código local en el contenedor, permitiendo cambios en tiempo real.

## 📊 Arquitectura

```
┌─────────────────────────────────────────┐
│          Internet / Cliente             │
└────────────────┬────────────────────────┘
                 │
                 │ Port 5000
                 ▼
┌─────────────────────────────────────────┐
│      Contenedor: restosmart-app         │
│                                         │
│  - Node.js 20                          │
│  - Express Server                       │
│  - React App (build)                    │
│  - Health Check                         │
└────────────────┬────────────────────────┘
                 │
                 │ PostgreSQL Connection
                 ▼
┌─────────────────────────────────────────┐
│      Contenedor: restosmart-db          │
│                                         │
│  - PostgreSQL 16                        │
│  - Volume persistente                   │
│  - Health Check                         │
└─────────────────────────────────────────┘
```

## 🗄️ Esquema de Base de Datos

El esquema incluye las siguientes tablas:

- **users** - Usuarios del sistema
- **categories** - Categorías de productos
- **products** - Productos del menú
- **inventory** - Control de inventario
- **customers** - Clientes
- **staff** - Personal
- **schedules** - Horarios del personal
- **attendance** - Registro de asistencia
- **orders** - Órdenes
- **order_items** - Items de las órdenes
- **transactions** - Transacciones financieras
- **invoices** - Facturas electrónicas

Todas las tablas tienen:
- ID UUID autogenerado
- Timestamps donde corresponde
- Índices optimizados
- Foreign keys con referencias

## 🔒 Seguridad en Producción

### Configuración Obligatoria

1. **Variables de Entorno**
   ```bash
   # Generar password seguro
   openssl rand -base64 32
   
   # Generar SESSION_SECRET
   openssl rand -hex 64
   ```

2. **Firewall**
   ```bash
   # Permitir solo puerto de la app
   ufw allow 5000/tcp
   ufw enable
   ```

3. **Reverse Proxy (Nginx)**
   ```nginx
   server {
       listen 80;
       server_name tu-dominio.com;
       
       location / {
           proxy_pass http://localhost:5000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_set_header X-Real-IP $remote_addr;
           proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
           proxy_cache_bypass $http_upgrade;
       }
   }
   ```

4. **SSL con Certbot**
   ```bash
   sudo certbot --nginx -d tu-dominio.com
   ```

## 📋 Mantenimiento

### Backups Automáticos

Añadir a crontab:
```bash
# Backup diario a las 2 AM
0 2 * * * cd /ruta/al/proyecto && make backup
```

### Monitoreo

```bash
# Ver uso de recursos en tiempo real
make stats

# Ver estado de contenedores
make ps

# Ver logs recientes
make logs
```

### Actualización

```bash
# Detener servicios
make down

# Actualizar código
git pull

# Reconstruir y reiniciar
make rebuild
```

## 🐛 Troubleshooting

### Error: Puerto 5000 ocupado
```bash
# Cambiar puerto en .env
APP_PORT=3000
```

### Error: Base de datos no se conecta
```bash
# Verificar logs de la BD
make logs-db

# Reiniciar servicios
make restart
```

### Error: Tablas no existen
```bash
# Eliminar volúmenes y recrear
make clean
make build
make up
```

### Error: Contenedor no inicia
```bash
# Ver logs detallados
make logs-app

# Verificar que el build fue exitoso
docker images | grep restosmart
```

## 📈 Optimizaciones

### Producción
- Multi-stage build para imagen pequeña (~150MB)
- Solo dependencias de producción
- Health checks automáticos
- Restart automático en fallo
- Volume persistente para PostgreSQL

### Desarrollo
- Hot-reload habilitado
- Volumen compartido para código
- Logs en tiempo real
- Sin rebuild necesario

## 🎯 Próximos Pasos

1. ✅ Configurar `.env` con credenciales seguras
2. ✅ Levantar servicios con `make prod-up`
3. ✅ Verificar salud con `make ps`
4. ✅ Poblar datos con `make seed` (opcional)
5. ⏭️ Configurar dominio y SSL
6. ⏭️ Implementar monitoreo (Prometheus/Grafana)
7. ⏭️ Configurar backups automáticos
8. ⏭️ Configurar CI/CD

## 📞 Soporte

Para problemas o dudas:
- Revisa los logs: `make logs`
- Consulta DEPLOY.md para más detalles
- Verifica la configuración de red y puertos
