# 🚀 Quick Start - RestoSmartQR

## ⚡ Inicio Rápido (3 Pasos)

### 1️⃣ Configurar Variables de Entorno

```bash
cp .env.example .env
```

Edita `.env` y cambia las contraseñas:
```bash
POSTGRES_PASSWORD=tu_password_seguro
SESSION_SECRET=genera_un_string_aleatorio_largo
```

### 2️⃣ Levantar la Aplicación

```bash
# Con Makefile (recomendado)
make prod-up

# O con docker-compose directamente
docker-compose up -d
```

### 3️⃣ ¡Listo! 🎉

Abre tu navegador en: **http://localhost:5000**

---

## 📝 Comandos Útiles

```bash
make help          # Ver todos los comandos
make logs          # Ver logs en tiempo real
make ps            # Estado de contenedores
make seed          # Poblar con datos de ejemplo
make backup        # Backup de base de datos
make down          # Detener todo
```

---

## 🗄️ Poblar con Datos de Ejemplo

```bash
make seed
```

Esto creará:
- ✅ Categorías de productos
- ✅ Productos del menú
- ✅ Inventario inicial
- ✅ Clientes de ejemplo
- ✅ Personal
- ✅ Horarios
- ✅ Transacciones de ejemplo

---

## 🔍 Verificar que Todo Funciona

```bash
# 1. Ver estado de contenedores
make ps

# 2. Ver logs de la aplicación
make logs-app

# 3. Probar la aplicación
curl http://localhost:5000/api/categories
```

---

## 🛑 Detener la Aplicación

```bash
make down
```

---

## 🔧 Modo Desarrollo (con Hot-Reload)

```bash
docker-compose -f docker-compose.dev.yml up
```

---

## 📚 Más Información

- [README.md](README.md) - Documentación completa
- [DEPLOY.md](DEPLOY.md) - Guía de despliegue detallada
- [DOCKER-SETUP.md](DOCKER-SETUP.md) - Configuración Docker completa

---

## ⚠️ Importante para Producción

Antes de desplegar en producción:

1. ✅ Cambiar **todas** las contraseñas en `.env`
2. ✅ Generar un `SESSION_SECRET` seguro
3. ✅ Configurar HTTPS con reverse proxy
4. ✅ Configurar backups automáticos
5. ✅ Configurar firewall

Ver [DEPLOY.md](DEPLOY.md) para detalles completos.

---

## 🆘 ¿Problemas?

### Puerto ocupado
```bash
# Cambiar puerto en .env
APP_PORT=3000
```

### Base de datos no conecta
```bash
make logs-db
make restart
```

### Contenedor no inicia
```bash
make logs-app
```

### Empezar de cero
```bash
make clean
make prod-up
```

---

## 📞 URLs Útiles

- **Aplicación**: http://localhost:5000
- **API**: http://localhost:5000/api
- **PostgreSQL**: localhost:5432

---

¡Disfruta de RestoSmartQR! 🍽️✨
