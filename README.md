# Generación de nuevos usuarios

Actualmente, para agragar nuevo usuario se requiere dos operaciones

1. Insertarlo en la base de datos Mongo

2. Registrar en la carpeta <code>./data</code> al usuario

    1. Carpeta nombrada con el mail <code>./data/user@mail.com</code>
    1. Fichero JSON Template <code>./data/user@mail.com/user-template.json</code> que se copia de <code>./data/user-template.json</code>


# TO-DO

Posibles mejoras    
- [ ] Grabar en la Base de datos Mongo los datos mínimos de usuario que se encuentran en <code>./data/user-template.json</code>