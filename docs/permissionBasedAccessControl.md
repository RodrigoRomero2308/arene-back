npm# Permission based access control

Con esto nos referimos a la forma de controlar el acceso de los usuarios mediante el uso de permisos.

Todo resolver que se pueda invocar desde dentro de la aplicación y que requiera que el usuario este logueado debe estar decorado con el guard `IsAuthenticatedGuard` de la forma:

```typescript
@Query(() => [User])
@UseGuards(IsAuthenticatedGuard)
async getUsers() {
  return this.usersService.findMany();
}
```

De este forma el servidor verificara que el usuario:

- Tenga una sesion activa (mediante cookie).
- El usuario de dicha sesion exista en la base de datos y este activo.

Si algun servicio requiriera algun acceso mas elevado, lo daremos mediante permisos que seran agrupados en roles. Por ejemplo: cualquier usuario logueado no sera capaz de obtener determinado reporte ya que solo incumbe a ciertos profesionales. Por lo tanto se la dara al rol que lo representa un permiso especial para "Obtener reporte".<br/>
Una vez dado, el resolver que sirve para obtener dicho reporte tiene que ser decorado agregando el guard para checkear permisos y añadiendo en la metadata del servicio (por medio del decorador `RequiredPermissions`), el permiso necesario, por ejemplo:

```typescript
@Query(() => [Report])
@RequiredPermissions("Obtener reporte")
@UseGuards(IsAuthenticatedGuard, PermissionsGuard) // Es importante mantener el orden de los guards
async obtenerReporte() {
  return this.reportService.obtenerReporte();
}
```

En este caso los controles sobre el servicio seran:

- Que el llamado al server contenga una sesion valida (mediante cookie)
- El usuario de dicha sesion exista en DB y este activo
- El usuario contenga por lo menos un rol que tenga TODOS los permisos dentro del decorador RequiredPermissions (notar que se puede pasar un arreglo de datos)
