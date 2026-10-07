# Centro Universitario Quevedo · Gestión escolar

Demo en React + Vite + TypeScript. Abre directamente en Inicio, sin login ni backend. Todos los nombres y registros son ficticios. Los datos se guardan únicamente en localStorage del navegador.

## Ejecutar

```sh
npm install
npm run dev
```

## Verificar

```sh
npm run build
npm run lint
node scripts/verify-data.mjs
```

La comprobación de datos requiere Node 22.18 o posterior (lectura nativa de TypeScript). Vite requiere una versión compatible de Node 20.19+ o 22.12+.

## Flujos disponibles

- Inicio: indicadores calculados sobre 10 alumnos y 2 grupos; accesos y pendientes.
- Asistencia: grupo, materia, fecha, búsqueda, cuatro estados, marcado colectivo y corrección de listas guardadas.
- Reporte: filtros locales, conteos, CSV e impresión/PDF.
- Calificaciones: actividades 40% + examen 60%, escala provisional de 0 a 10. Las celdas vacías permanecen pendientes. Guardar antes de revisar la boleta.
- Boleta: selección de alumno y periodo, calificaciones guardadas, promedio y asistencia acumulada. Descargar PDF abre el diálogo de impresión; elegir Guardar como PDF.
- Restablecer demo: reemplaza las modificaciones locales con los datos iniciales.

La fecha del inicio y del pase de lista utiliza America/Mexico_City. La asistencia porcentual usa presentes / registros y cuenta cada materia por separado. Retardos y justificadas no cuentan como presentes. Los datos iniciales incluyen septiembre y octubre de 2026.

## Estructura

- `src/lib/data.ts`: alumnos, grupos, materias, datos iniciales y cálculos.
- `src/lib/storage.tsx`: inicialización, validación, recuperación de JSON inválido, guardado y restablecimiento.
- `src/components`: layout y controles compartidos.
- `src/pages`: pantallas.
- `src/index.css`: tokens guinda/dorado, responsive, foco, movimiento reducido e impresión.

## Referencias y pendientes

Se siguieron Inicio y Reporte obtenidos por MCP, y las capturas suministradas de Pasar lista, Calificaciones y Boleta. Se conserva la composición con Grid/Flexbox y se adapta la identidad al nombre Centro Universitario Quevedo y a la paleta solicitada. No se recibió logo ni fotografía; se utiliza una marca tipográfica.

Faltan las referencias de Asistencia guardada (2:231) y Asistencia móvil (2:235). Por ahora el guardado se confirma dentro del pase de lista y existe una adaptación responsive general del mismo flujo; su fidelidad a esas dos pantallas está pendiente. No se pudieron recuperar las animaciones de Figma por el límite del MCP; se incluyen transiciones CSS breves y prefers-reduced-motion.

DM Sans se carga desde Google Fonts con Arial como alternativa. No se usan APIs de datos ni servicios externos de autenticación.

Verificación realizada: build y lint sin errores, cálculos y coherencia de datos, navegación en Chrome, persistencia de asistencia y calificaciones tras recarga, actualización de reporte y boleta, restablecimiento y revisión visual del pase de lista a 400 px.
