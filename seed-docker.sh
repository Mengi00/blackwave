#!/bin/bash
# Script para ejecutar seed de datos en el contenedor Docker

echo "🌱 Iniciando seed de datos..."

# Verificar que el contenedor esté corriendo
if ! docker ps | grep -q restosmart-app; then
    echo "❌ Error: El contenedor de la aplicación no está corriendo"
    echo "Ejecuta: docker-compose up -d"
    exit 1
fi

# Ejecutar el script de seed
docker-compose exec app node --loader tsx server/seed.ts

if [ $? -eq 0 ]; then
    echo "✅ Seed completado exitosamente!"
else
    echo "❌ Error al ejecutar el seed"
    exit 1
fi
