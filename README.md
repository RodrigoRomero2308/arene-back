# AReNe Backend

Este servidor esta hecho con NestJS como framework. Junto a él tenemos multiples librerias que nos aportan los siguientes features:

- Helmet: seguridad ante vulnerabilidades comunes
- Bcrypt: libreria para generar one-way hashes principalmente para el manejo de contraseñas y datos secretos
- Prisma: ORM para la base de datos
- Passport: libreria para autenticacion

## Como configurar este proyecto en local:

Debes copiar el archivo `.env.example` con el nombre `.env` y completar las variables que se indican alli.
<br/>
Luego debemos verificar que la base de datos esta inicializada. Podemos ejecutar `npx prisma studio` para acceder a los datos de la base en tiempo real, si no vemos los ultimos cambios, podemos ejecutar `npx prisma db push` para actualizar la base de datos. En caso de levantar la base de datos en local, ver readme en carpeta dev/docker
<br/>
Una vez que tenemos todo listo, debemos ejecutar `npm start` para arrancar el servidor
