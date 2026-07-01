# 🏨 Hotel API - NestJS + SQL Server

API REST para hoteles del norte del Perú con geolocalización.

## 📋 Stack

- **Backend:** NestJS (Node.js + TypeScript)
- **Base de datos:** SQL Server (con GEOGRAPHY para geolocalización)
- **Datos:** 1,044 hoteles de 11 ciudades peruanas

---

## 🚀 Instalación

```bash
# Instalar dependencias
npm install

# Configurar variables de entorno (o editar database.service.ts)
DB_USER=sa
DB_PASSWORD=YourPassword123!
DB_HOST=localhost
DB_NAME=HotelesDB
DB_PORT=1433

# Ejecutar en desarrollo
npm run start:dev
```

---

## 🗄️ Migración SQL Server

Ejecuta el archivo `migration.sql` en SQL Server Management Studio o sqlcmd:

```bash
sqlcmd -S localhost -U sa -P YourPassword123! -d HotelesDB -i migration.sql
```

El script hace:
1. Crea tabla `posta` (hoteles)
2. Crea tabla `reservas`
3. Inserta **1,044 hoteles** de 11 ciudades
4. Agrega columna `GeoLocation GEOGRAPHY`
5. Limpia registros sin lat/lng
6. Actualiza GeoLocation en todos los registros
7. Crea el Stored Procedure `find_by_distance`
8. Crea el Trigger `ParseLatLng`

---

## 📡 Endpoints

### `GET /hotel?limit=10&page=1`
Lista paginada de hoteles.

**Query params:**
| Param | Tipo | Default | Descripción |
|-------|------|---------|-------------|
| `limit` | number | 10 | Resultados por página |
| `page` | number | 1 | Número de página |

**Respuesta:**
```json
{
  "data": [
    {
      "postaId": 1,
      "name": "Wyndham Costa del Sol Trujillo",
      "location": "Trujillo",
      "price_per_night": 344.0,
      "ranking": "8,7",
      "lat": "-8.142892",
      "lng": "-79.039754"
    }
  ],
  "meta": {
    "total": 1044,
    "page": 1,
    "limit": 10,
    "totalPages": 105,
    "hasNextPage": true,
    "hasPrevPage": false
  }
}
```

---

### `GET /hotel/cercanos?lat=-8.094947&lng=-79.049472&distance=2000`
Hoteles cercanos usando el SP `find_by_distance`.

**Query params:**
| Param | Tipo | Default | Descripción |
|-------|------|---------|-------------|
| `lat` | number | requerido | Latitud |
| `lng` | number | requerido | Longitud |
| `distance` | number | 2000 | Radio en metros |

**Respuesta:**
```json
{
  "data": [
    {
      "postaId": 5,
      "name": "Gran Bolívar Hotel",
      "location": "Trujillo",
      "price_per_night": 280.0,
      "ranking": "8,5",
      "lat": "-8.112156",
      "lng": "-79.028743",
      "Distance": 387.45
    }
  ],
  "meta": {
    "lat": -8.094947,
    "lng": -79.049472,
    "distanceMeters": 2000,
    "total": 12
  }
}
```

---

### `POST /hotel/reservar`
Registra una reserva básica.

**Body (JSON):**
```json
{
  "postaId": 1,
  "guestName": "Juan Pérez",
  "guestEmail": "juan@example.com",
  "checkIn": "2026-06-01",
  "checkOut": "2026-06-03",
  "numPersons": 2,
  "typeRoom": "Habitación Doble Superior"
}
```

**Respuesta:**
```json
{
  "message": "Reserva creada exitosamente",
  "data": {
    "reservaId": 1,
    "hotel": "Wyndham Costa del Sol Trujillo",
    "postaId": 1,
    "guestName": "Juan Pérez",
    "guestEmail": "juan@example.com",
    "checkIn": "2026-06-01",
    "checkOut": "2026-06-03",
    "nights": 2,
    "numPersons": 2,
    "typeRoom": "Habitación Doble Superior",
    "pricePerNight": 344.0,
    "totalPrice": 688.0,
    "status": "CONFIRMADA",
    "createdAt": "2026-05-12T22:00:00.000Z"
  }
}
```

---

## 🗺️ Ciudades incluidas

| Ciudad | Hoteles |
|--------|---------|
| Lima | 677 |
| Mancora | 62 |
| Trujillo | 73 |
| Chiclayo | 59 |
| Piura | 48 |
| Talara | 38 |
| Los Órganos | 26 |
| Chimbote | 24 |
| Tumbes | 24 |
| Paita | 9 |
| Sullana | 4 |
| **Total** | **1,044** |

---

## 🔧 SQL Útil

```sql
-- Buscar hoteles cercanos en 2km de Trujillo centro
EXEC find_by_distance @Distance=2000, @Lat='-8.094947', @LNG='-79.049472';

-- Hoteles más baratos
SELECT TOP 10 name, price_per_night, location FROM posta ORDER BY price_per_night ASC;

-- Ver reservas de un hotel
SELECT r.*, p.name AS hotel
FROM reservas r
JOIN posta p ON r.postaId = p.postaId
WHERE r.postaId = 1;
```
