# Solvere · Prototipo navegable

Prototipo de la gestión de una Copa Mundial, realizado con React y Vite a partir de la especificación de requerimientos V.3 y los diagramas provistos. No representa una edición real del torneo.

## Iniciar

```sh
npm install
npm run dev
```

Abrí la dirección que muestra Vite (habitualmente http://localhost:5173).

## Recorrido sugerido

1. En Administrador, recorré el panel y las selecciones. Probá agregar una selección o editar un jugador desde su pestaña.
2. En Partidos, abrí un encuentro para cargar un resultado y eventos. La tabla de posiciones se recalcula con el resultado.
3. Usá el selector «Vista demo» para pasar a Usuario.
4. En Entradas, elegí un partido, sector y asientos. Probá un pago rechazado y luego confirmá el pago simulado.
5. En Mis entradas, consultá el ticket y transferí una entrada a Luciana.
6. Cerrá sesión e ingresá como Luciana para consultar la entrada recibida.
7. En Administrador → Control de acceso, pegá el código de un ticket y elegí su partido y fecha. La segunda validación se rechaza.
8. En Reportes, consultá las compras y asistencias de esta sesión y descargá el CSV.

## Cuentas de demostración

- Administrador: admin@demo.test
- Usuario: manuel@demo.test
- Destinataria de transferencias: luciana@demo.test
- Contraseña inicial para estas cuentas: demo1234

El selector de perfiles es un atajo de demostración: no implementa seguridad real. El registro y los cambios de contraseña usan únicamente memoria durante esta sesión. No utilices contraseñas ni datos personales reales.

## Alcance

- Administración de selecciones, convocados, cuerpos técnicos, árbitros, sedes, estadios, ediciones, fases, grupos y usuarios.
- Búsquedas y formularios de alta, edición y eliminación, con confirmaciones.
- Fixture, detalle de partido, programación con comprobación básica de conflictos, marcador y eventos.
- Tabla de posiciones, clasificación provisional y goleadores derivados de los eventos cargados.
- Stock de muestra, compra por sector/asiento, pago aprobado o rechazado, emisión de ticket, transferencia y notificaciones internas.
- Acceso de muestra de un solo uso, cuenta de usuario y reportes CSV.
- Vistas Administrador, Usuario registrado y Visitante; diseño adaptable a móvil.

## Límites intencionales

Todo es una simulación en el navegador. Al recargar se reinicia la información. No hay servidor, base de datos, envío de correos, pasarela de pago ni lector de códigos. Los códigos de barras son decorativos y los tickets no tienen validez real.

El selector permite administrar varias competencias con selecciones, jugadores, partidos y entradas independientes durante la sesión. La edición inicial incluye 12 selecciones, 25 jugadores y tablas para los tres grupos. Los jugadores tienen peso, fecha de nacimiento y altura. Hay 40 asientos por sector en el plano simplificado y un cupo global por partido. No se modelan reservas concurrentes ni vencimientos. La clasificación permanece provisional: no se implementan todos los desempates ni la generación automática de cruces. Los eventos y el resultado se cargan por separado. Los filtros estadísticos iniciales son por grupo.

Los requisitos no funcionales de disponibilidad, seguridad, concurrencia, auditoría y respaldo corresponden a una futura aplicación real. Los códigos RF se interpretaron según el cuerpo de la V.3, porque difieren de su índice.

## Organización

- `src/App.jsx`: navegación, perfiles y estado compartido de la demostración.
- `src/data.js`: datos ficticios y cálculo de posiciones.
- `src/components/Management.jsx`: formularios y consultas de gestión.
- `src/components/Matches.jsx`: fixture, programación y resultados.
- `src/components/TicketFlow.jsx`: selección de asientos y compra simulada.
- `src/components/UI.jsx`: controles, iconos, modales y tarjetas reutilizables.
- `src/design/app.css`: identidad visual y adaptación a tamaños de pantalla.

Se conservaron Inicio.jsx y Menu.jsx como referencia de los ejercicios previos; ya no se importan en la aplicación.

## Verificación

```sh
npm run build
npm run lint
```

Las pruebas de recorrido en `qa/` usan el Playwright y Microsoft Edge de este entorno local. Sus rutas de ejecución son específicas del equipo de desarrollo. Las capturas muestran el panel, los tickets y la versión móvil.
