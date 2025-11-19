.PHONY: help build up down restart logs logs-app logs-db shell-app shell-db backup restore clean

help: ## Muestra esta ayuda
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-20s\033[0m %s\n", $$1, $$2}'

build: ## Construye las imágenes Docker
	docker-compose build

up: ## Inicia todos los servicios en segundo plano
	docker-compose up -d

down: ## Detiene todos los servicios
	docker-compose down

restart: ## Reinicia todos los servicios
	docker-compose restart

restart-app: ## Reinicia solo la aplicación
	docker-compose restart app

logs: ## Muestra logs de todos los servicios en tiempo real
	docker-compose logs -f

logs-app: ## Muestra logs de la aplicación
	docker-compose logs -f app

logs-db: ## Muestra logs de la base de datos
	docker-compose logs -f db

ps: ## Muestra el estado de los contenedores
	docker-compose ps

shell-app: ## Abre una shell en el contenedor de la aplicación
	docker-compose exec app sh

shell-db: ## Abre psql en la base de datos
	docker-compose exec db psql -U restosmart -d restosmart

backup: ## Crea un backup de la base de datos
	@mkdir -p backups
	@docker-compose exec -T db pg_dump -U restosmart restosmart > backups/backup_$$(date +%Y%m%d_%H%M%S).sql
	@echo "Backup creado en backups/backup_$$(date +%Y%m%d_%H%M%S).sql"

restore: ## Restaura la base de datos desde un backup (usar: make restore FILE=backup.sql)
	@if [ -z "$(FILE)" ]; then echo "Error: Especifica el archivo con FILE=backup.sql"; exit 1; fi
	docker-compose exec -T db psql -U restosmart restosmart < $(FILE)

clean: ## Elimina contenedores, volúmenes e imágenes (¡CUIDADO!)
	docker-compose down -v
	docker-compose rm -f

rebuild: clean build up ## Reconstruye todo desde cero

dev-setup: ## Configura el entorno para desarrollo
	@if [ ! -f .env ]; then cp .env.example .env; echo "Archivo .env creado. Edítalo antes de continuar."; fi

prod-up: dev-setup build up ## Setup completo para producción

stats: ## Muestra estadísticas de uso de recursos
	docker stats

inspect-app: ## Inspecciona el contenedor de la aplicación
	docker-compose exec app ls -la

inspect-dist: ## Inspecciona el directorio dist de la aplicación
	docker-compose exec app ls -la dist

seed: ## Ejecuta el seed de datos en la base de datos
	@./seed-docker.sh
