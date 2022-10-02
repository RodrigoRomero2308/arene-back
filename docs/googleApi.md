# Configuracion de Google API

Para poder configurar la api de google debemos seguir estos pasos:

## 1. Loguearnos con una cuenta de Google

La cuenta será la que queremos que sea la propietaria de la carpeta donde guardaremos los documentos mediante la API.

## 2. Creamos una cuenta de servicio de google.

- Logueados en la cuenta, nos dirigimos a la [consola de google cloud](https://console.cloud.google.com/), creamos un proyecto con el nombre que nos plazca.
- Luego en el buscador de la barra superior, (en la pagina de la consola), buscaremos la opcion `IAM y administración`
- En el menu lateral nos dirigimos a `Cuentas de servicio`
- Hacemos click en `Crear cuenta de servicio`, le damos un nombre y un id que querramos. Es importante en esta etapa, <b>copiar la direccion de correo electrónico que figura en el formulario</b>. No ingresaremos nada en las etapas opcionales y clickeamos en `Crear y continuar` en la primer etapa.
- Una vez creada, hacemos clic en la direccion de la cuenta de servicio en el listado.
- Nos dirigimos a claves en la solapa superior
- Hacemos clic en `Agregar clave` y `Crear clave nueva`
- Elegimos el tipo `JSON`
- Guardamos el archivo que nos dara para bajar google en algun lugar que recordemos, lo necesitaremos luego.
  <br/>
  Con esto ya tendremos la cuenta de servicio lista para usar

## 3. Damos permiso a la api de google drive al proyecto

- De nuevo en el buscador superior vamos a escribir `drive api`.
- Entre los resultados buscaremos el que salga en la categoria `Marketplace` y diga `Google Drive API`, le hacemos click
- Y hacemos click en Habilitar

## 4. Configurar el proyecto

- Vamos a tomar el archivo JSON generado, y lo vamos a minificar (lo necesitamos en una sola linea). Podemos usar paginas web para hacerlo, pero tener cuidado ya que el JSON generado es un archivo de credenciales.
- Al tenerlo minificado, nos dirigiremos al archivo `.env`, buscaremos la variable `GOOGLE_SERVICE_ACCOUNT`, y pegamos el JSON minificado luego del "="

## 5. Crear la carpeta del proyecto en drive y compartir con la cuenta de servicio

- Como ultima etapa, nos dirigiremos a la cuenta de google drive con la que nos logueamos en el paso 1. Creamos una carpeta con el nombre `arene`.
- Ingresamos en la carpeta y vamos a compartir
- En la lista de correos, ponemos el correo electronico que copiamos en el momento de genenrar la cuenta de servicio en el paso 2.
  <br/>
  <br/>
  Con esto, ya tenemos todo listo para empezar a trabajar con google drive
