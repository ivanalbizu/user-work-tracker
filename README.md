# Requerimientos

NodeJS 14.0.0

Base de datos Mongo


# Base de datos Mongo

Establecer conexión en el fichero <code>./config/config.env</code>


# Generación de nuevos usuarios

Actualmente, para agregar nuevo usuario se requiere dos operaciones

1. Insertarlo en la base de datos Mongo. Mail + Pass con Bcrypt 10 steps

2. Registrar en la carpeta <code>./data</code> al usuario

    1. Carpeta nombrada con el mail <code>./data/user@mail.com</code>
    2. Fichero JSON Template <code>./data/user@mail.com/user-template.json</code> que se copia de <code>./data/user-template.json</code>


# Funcionamiento

Si el usuario cierra el navegador, caso de que no pulsase previamente el botón de STOP, se guarda la hora actual (descanso o trabajo, según proceda)

Si el usuario durante el mismo día vuelve a abrir el navegador podrá pulsar sobre PLAY o PAUSE (según el estado de tracking) y se reanuda el tracking. El tiempo fin del estado actual se actualizará a la hora que se produzca el Click


# TO-DO
- [ ] Descarga del tracking en formato CSV
- [ ] Usar la configuración tiempos de jornada laboral para representar las estadísticas

Posibles mejoras    
- [ ] Notificaciones con socket.io o push notifications desde Node
- [ ] Detectar cierre del navegador y grabar el Tracking actual
- [ ] Usuarios con privilegios para poder ver tracking de resto de usuarios
- [ ] Mostrar suma horas trabajadas/descansos
- [ ] Diagramas de horas trabajados tipo gráficos
- [ ] Jornadas de verano
- [ ] Guardias
