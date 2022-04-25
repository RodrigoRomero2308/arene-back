# Instalaciones para entornos de desarrollo

## Requerimientos

- Docker

El proyecto cuenta con archivos docker-compose para poder levantar de forma local lo necesario para que el proyecto funcione

## Comandos:

Para levantar la base de datos debemos ejecutar:

```shellscript
docker-compose -f mysql-docker-compose.yml up -d
```

Y luego para pasar las tablas:

```shellscript
npx prisma db push
```
