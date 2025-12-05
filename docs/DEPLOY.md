# Guía de Despliegue - RestoSmartQR

## Requisitos Previos
- Docker >= 20.10
- Docker Compose >= 2.0

## Configuración Inicial

### 1. Configurar Variables de Entorno
Crea un archivo `.env` basado en `.env.example`:

```bash
cp .env.example .env
```

Edita el archivo `.env` y configura las siguientes variables:

```bash
# PostgreSQL Configuration
POSTGRES_USER=restosmart
POSTGRES_PASSWORD=tu_password_seguro_aqui
POSTGRES_DB=restosmart
POSTGRES_PORT=5432

# Application Configuration
APP_PORT=5000
NODE_ENV=production

# Database URL
DATABASE_URL=postgresql://${POSTGRES_USER}:${POSTGRES_PASSWORD}@db:5432/${POSTGRES_DB}

# Session Secret (genera un string aleatorio seguro)
SESSION_SECRET=genera_un_string_aleatorio_seguro
```

### 2. Construir y Levantar los Contenedores

```bash
# Construir las imágenes
docker-compose build

# Iniciar los servicios
docker-compose up -d
```

### 3. Verificar que los Servicios Están Corriendo

```bash
# Ver el estado de los contenedores
docker-compose ps

# Ver los logs de la aplicación
docker-compose logs -f app

# Ver los logs de la base de datos
docker-compose logs -f db
```

### 4. Acceder a la Aplicación

La aplicación estará disponible en: `http://localhost:5000`

## Comandos Útiles

### Detener los Servicios
```bash
docker-compose down
```

### Detener y Eliminar Volúmenes (¡CUIDADO! Esto elimina los datos)
```bash
docker-compose down -v
```

### Reiniciar la Aplicación
```bash
docker-compose restart app
```

### Ver Logs en Tiempo Real
```bash
docker-compose logs -f
```

### Ejecutar Comandos en la Base de Datos
```bash
# Conectarse a PostgreSQL
docker-compose exec db psql -U restosmart -d restosmart
```

### Backup de la Base de Datos
```bash
docker-compose exec db pg_dump -U restosmart restosmart > backup.sql
```

### Restaurar Base de Datos
```bash
docker-compose exec -T db psql -U restosmart restosmart < backup.sql
```

## Estructura de Archivos

- `Dockerfile` - Imagen de la aplicación (multi-stage build optimizado)
- `docker-compose.yml` - Orquestación de servicios
- `init-db.sql` - Script de inicialización de la base de datos
- `.env.example` - Plantilla de variables de entorno
- `.dockerignore` - Archivos excluidos de la imagen Docker

## Seguridad en Producción

1. **Cambiar Contraseñas por Defecto**: Asegúrate de cambiar todas las contraseñas en el archivo `.env`
2. **Secreto de Sesión**: Genera un string aleatorio seguro para `SESSION_SECRET`
3. **Firewall**: Configura el firewall para exponer solo el puerto de la aplicación
4. **HTTPS**: Usa un reverse proxy (Nginx/Traefik) con certificados SSL
5. **Backups**: Implementa una estrategia de respaldo automático de la base de datos

## Monitoreo

### Salud de los Contenedores
```bash
docker-compose ps
```

### Uso de Recursos
```bash
docker stats
```

## Troubleshooting

### La aplicación no se conecta a la base de datos
- Verifica que el contenedor de la BD esté corriendo: `docker-compose ps`
- Revisa los logs de la BD: `docker-compose logs db`
- Verifica la variable `DATABASE_URL` en el archivo `.env`

### La base de datos no tiene las tablas
- Verifica que el archivo `init-db.sql` está presente
- Elimina el volumen y vuelve a crear: `docker-compose down -v && docker-compose up -d`

### Puerto ocupado
- Cambia el puerto en `.env` (variable `APP_PORT`)
- O detén el servicio que está usando el puerto 5000

## Actualizaciones

Para actualizar la aplicación:

```bash
# Detener servicios
docker-compose down

# Reconstruir con los últimos cambios
docker-compose build --no-cache

# Iniciar de nuevo
docker-compose up -d
```

## Producción con Reverse Proxy (Nginx)

Ejemplo de configuración Nginx:

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
        proxy_cache_bypass $http_upgrade;
    }
}
```
