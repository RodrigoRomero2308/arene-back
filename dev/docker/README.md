# Instalaciones para entornos de desarrollo

## Requerimientos

- Docker

El proyecto cuenta con archivos docker-compose para poder levantar de forma local lo necesario para que el proyecto funcione

## Comandos:

Para levantar la base de datos debemos ejecutar:

```shellscript
docker-compose -f dev/docker/docker-compose.yml up -d
```

Y luego para pasar las tablas:

```shellscript
npx prisma db push
```

## Redis

El docker compose levanta un redis en el puerto 6379. Para poder ver los datos en él podemos usar herramientas como redis-commander. Ejecutamos:

```shellscript
npm i -g redis-commander
redis-commander --redis-password redis
```
