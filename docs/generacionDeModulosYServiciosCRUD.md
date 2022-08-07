# Flujo de desarrollo para una nueva tabla y servicios CRUD

Dadas las herramientas de la solucion, dar de alta una base de datos, con los permisos asociados para los servicios que utilizaremos y la generacion del codigo necesario para dichos servicios es relativamente sencillo.

## Dar de alta la base de datos

Todas las tablas de la BD estan en el archivo [schema.prisma](../prisma/schema.prisma) para dar de alta una tabla, simplemente agregamos un modelo segun el lenguaje de Prisma (tomar como ejemplo las demas tablas de la base de datos). Referencia (TODO: agregar link a documentacion de prisma)
<br/>
<br/>
Por ejemplo:

```prisma
model Permission {
  code           String           @id
  shortname      String
  description    String?
  PermissionRole PermissionRole[]
}
```

El desarrollador debera evaluar si se necesita:

- Datos iniciales para la tabla
- Permisos asociados a los servicios

## Datos iniciales para la tabla

Para los datos iniciales, el desarrollador tendra que generar un archivo para realizar el seeding de la DB (Leer el [siguiente doc](./seeding.md))
<br>

## Permisos asociados a los servicios

Para añadir permisos en la solucion, hay que realizar una serie de operaciones:

- Agregar los permisos al [siguiente enumerado](../src/enums/permissionCodes.enum.ts)
- Agregar los permisos en el archivo de [seed de permisos](../src/prisma/seed/02-permissionSeed.ts)
- Agregar la asignacion de los permisos a los roles indicados en el [siguiente archivo](../src/prisma/seed/05-rolesPermissionsSeed.ts)
- Ejecutar `npm run db-update`

## Creacion de servicios

Dependiendo de la tarea a realizar quizas debamos generar nuevos servicios en un modulo existente o deberemos crear un modulo desde cero (Por ejemplo en el caso mencionado en esta documentacion). En este documento nos centraremos en la forma de generar servicios CRUD desde cero, utilizando el CLI de NestJS

### Utilizando el CLI de Nest

Primero hay que verificar que tenemos el CLI instalado, por lo cual podemos abrir una terminal cualquiera y ejecutar `nest --help`, si nos sale un mensaje de ayuda significa que lo tenemos instalado.
<br>
<br>
El CLI cuenta con un comando que nos permite generar cosas del framework, como por ejemplo: modulos, servicios, resolvers, controladores, etc. Podemos ver la lista completa ejecutando `nest generate --help`.
<br>
<br>
La forma mas rapida de generar un CRUD es con la generacion de recurso(resource) por lo cual podemos ejecutar `nest generate --no-spec resource {nombre del modulo a crear}`. La opcion `--no-spec` es para que NestJS no genere archivos de testing para el modulo. Supongamos que queremos crear el modulo de roles, deberiamos ejecutar `nest generate --no-spec resource role`
<br>
<br>
Nest nos preguntara que tipo de recurso queremos generar, entre las opciones una dice `GraphQL (code first)`, elegimos esta con las flechas del teclado y apretamos enter.
<br>
<br>
Nos deberia saltar que se crearon archivos para el modulo en una carpeta segun el nombre del modulo. En el ejemplo anterior se habria generado la carpeta "role" dentro de src. A partir de ahi ya es cuestion de cambiar el codigo.

### Cambiando el codigo generado

Nest nos generara un archivo de module, un resolver y un service para el modulo, ademas de 2 DTOs, uno de creacion y uno de actualizacion.
<br>
<br>
Lo primero que haremos sera borrar la carpeta entity, ya que Prisma nos da los modelos de entidad, luego pasaremos a modificar los dtos para usar uno de los modelos generados por prisma. Esta el ejemplo en el modulo de area. Nos deberia quedar algo como esto:

```javascript
@InputType()
export class CreateRoleInput extends OmitType(RoleUncheckedCreateInput, [
  'created_by',
  'deleted_by',
  'updated_by',
  'its',
  'uts',
  'dts',
  'isSystemRole',
  'RoleUser',
  'PermissionRole',
]) {}
```

Con `OmitType` basicamente estamos generando un nuevo tipo a partir el primer parametro, omitiendo ciertas propiedades. Entre las propiedades que siempre debemos excluir de estos dtos tenemos:

- created_by, updated_by, deleted_by, its, uts, dts: son propiedades que se utilizan para saber quien creo, modifico y elimino las entidades y saber cuando ocurrio.
- Todos los campos que refieran a relaciones en el modelo de prisma (Veran que el tipo en el modelo no es primitivo, por ejemplo RoleUser)

Una vez que tengamos los DTOs modificados, debemos modificar los resolvers para que usen estos dtos en lugar de los viejos, pero ademas debemos ponerles las guards segun si es requerido controlar si es necesario control de acceso o de permisos. Pueden leer mas sobre eso [aqui](./permissionBasedAccessControl.md)
<br>
<br>
Una vez que esto este hecho, solo queda modificar el codigo del service, si se guian por el modulo de area, podran notar lo siguiente:

- El service tiene principalmente codigo de negocio, es el que da respuesta a lo que se requirio
- El resolver define que queries o mutaciones se pueden llamar desde el playground o desde el frontend
- Los controles **siempre** deben estar en el backend, no se puede confiar en que los controles estaran en el frontend
- Se puede usar el decorador `@CurrentUser` para acceder a los datos del usuario logueado, siempre y cuando el metodo esté protegido por la guard `IsAuthenticatedGuard`. Tomar como referencia lo hecho en el modulo de areas. Notar que usamos este decorador para tomar por ejemplo el id del usuario logueado para marcar el autor de la accion.
