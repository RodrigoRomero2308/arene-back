# Seeding

Con seeding nos referimos a poblar la base de datos con datos precargados. Notese que en el archivo [package.json](../package.json), tenemos un script que podemos ejecutar con el siguiente comando

```
npm run db-update
```

Esto hara 2 cosas:

- La primera es actualizar la estructura de nuestra base de datos con `npx prisma db push`. Esto significa que nuestro schema, que podemos encontrar en el archivo [schema.prisma](../prisma/schema.prisma) es impactado en la base de datos objetivo que tenemos en la variable `DATABASE_URL` de nuestro archivo `.env`.
- La segunda es ejecutar los scripts de [esta carpeta](../src/prisma/seed/seed.ts), los cuales insertaran datos iniciales en la base de datos. No importa si corremos este comando mas de una vez, los archivos deberian estar preparados para que si se ejecutan nuevamente, no vuelvan a insertar los mismos datos que ya existen. (Dato importante para la creacion de los scripts, y una prueba que podemos hacer es ejecutar 2 veces el comando, no deberia insertar los mismos datos de nuevo)
