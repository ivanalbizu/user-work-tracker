# Requerimientos

NodeJS 14.0.0

Base de datos Mongo


# Generación de nuevos usuarios

Actualmente, para agregar nuevo usuario se requiere dos operaciones

1. Insertarlo en la base de datos Mongo. Mail + Pass con Bcrypt 10 steps

2. Registrar en la carpeta <code>./data</code> al usuario

    1. Carpeta nombrada con el mail <code>./data/user@mail.com</code>
    2. Fichero JSON Template <code>./data/user@mail.com/user-template.json</code> que se copia de <code>./data/user-template.json</code>


# TO-DO

Posibles mejoras    
- [ ] Grabar en la Base de datos Mongo los datos mínimos de usuario que se encuentran en <code>./data/user-template.json</code>