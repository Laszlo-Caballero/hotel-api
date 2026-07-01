CREATE DATABASE hoteles

go
use hoteles

-- ============================================================
-- SCRIPT DE MIGRACIÓN: Hoteles del RAR a SQL Server
-- Total: 1044 hoteles | 11 ciudades
-- ============================================================

-- 1. Crear tabla principal
IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='hotel' AND xtype='U')
BEGIN
  CREATE TABLE hotel (
    hotelId          INT IDENTITY(1,1) PRIMARY KEY,
    name             NVARCHAR(500)     NOT NULL,
    location         NVARCHAR(255),
    price_per_night  DECIMAL(10,2),
    nights           INT,
    persons          INT,
    tax_info         NVARCHAR(255),
    url_map          NVARCHAR(2000),
    ranking          NVARCHAR(50),
    url_image        NVARCHAR(2000),
    image_name       NVARCHAR(500),
    lat              NVARCHAR(50),
    lng              NVARCHAR(50),
    location_details NVARCHAR(MAX),
    GeoLocation      GEOGRAPHY,
    createdAt        DATETIME DEFAULT GETDATE()
  );
  PRINT 'Tabla hotel creada.';
END
GO

-- 2. Tabla de reservas
IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='reservas' AND xtype='U')
BEGIN
  CREATE TABLE reservas (
    reservaId      INT IDENTITY(1,1) PRIMARY KEY,
    hotelId        INT            NOT NULL REFERENCES hotel(hotelId),
    guestName      NVARCHAR(255)  NOT NULL,
    guestEmail     NVARCHAR(255)  NOT NULL,
    checkIn        DATE           NOT NULL,
    checkOut       DATE           NOT NULL,
    numPersons     INT            DEFAULT 1,
    typeRoom       NVARCHAR(255),
    totalPrice     DECIMAL(10,2),
    nights         INT,
    status         VARCHAR(50)    DEFAULT 'CONFIRMADA',
    createdAt      DATETIME       DEFAULT GETDATE()
  );
  PRINT 'Tabla reservas creada.';
END
GO

-- 4. Añadir columna GeoLocation (si no existe)
IF NOT EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID('hotel') AND name = 'GeoLocation')
BEGIN
  ALTER TABLE hotel ADD [GeoLocation] GEOGRAPHY;
  PRINT 'Columna GeoLocation añadida.';
END
GO

-- 5. Limpiar registros con lat/lng vacíos
DELETE FROM hotel WHERE lat = '' OR lng = '';
GO

-- 6. Actualizar GeoLocation en todos los registros existentes
UPDATE hotel
SET [GeoLocation] = geography::STPointFromText(
  'POINT(' + CAST(lng AS nvarchar(255)) + ' ' + CAST(lat AS nvarchar(255)) + ')',
  4326
)
WHERE lat IS NOT NULL AND lng IS NOT NULL
  AND LTRIM(RTRIM(CAST(lat AS nvarchar(255)))) <> ''
  AND LTRIM(RTRIM(CAST(lng AS nvarchar(255)))) <> '';
PRINT CAST(@@ROWCOUNT AS VARCHAR) + ' registros actualizados con GeoLocation.';
GO

-- 7. Stored Procedure: find_by_distance
IF OBJECT_ID('find_by_distance', 'P') IS NOT NULL
  DROP PROCEDURE find_by_distance;
GO
CREATE PROCEDURE find_by_distance
  @Distance int,
  @LAT     varchar(255),
  @LNG     varchar(255)
AS
BEGIN
  DECLARE @origin GEOGRAPHY;
  SET @origin = GEOGRAPHY::STGeomFromText(
    'POINT(' + CAST(@LNG AS nvarchar(255)) + ' ' + CAST(@LAT AS nvarchar(255)) + ')',
    4326
  );
  SELECT
    hotelId,
    name,
    location,
    price_per_night,
    ranking,
    lat,
    lng,
    image_name,
    url_image,
    GeoLocation.STDistance(@origin) AS Distance
  FROM hotel
  WHERE @origin.STDistance(GeoLocation) <= @Distance
  ORDER BY Distance ASC;
END
GO

-- Prueba del SP (Trujillo centro):
-- EXEC find_by_distance @Distance=2000, @Lat='-8.094947', @LNG='-79.049472';

-- 8. Trigger: ParseLatLng (auto-actualizar GeoLocation en INSERT/UPDATE)
IF OBJECT_ID('ParseLatLng', 'TR') IS NOT NULL
  DROP TRIGGER ParseLatLng;
GO
CREATE TRIGGER ParseLatLng
ON hotel
AFTER INSERT, UPDATE
AS
BEGIN
  SET NOCOUNT ON;
  UPDATE p
  SET p.GeoLocation = geography::STPointFromText(
    'POINT(' + CAST(i.lng AS nvarchar(255)) + ' ' + CAST(i.lat AS nvarchar(255)) + ')',
    4326
  )
  FROM hotel p
  INNER JOIN INSERTED i ON p.hotelId = i.hotelId
  WHERE i.lat IS NOT NULL AND i.lng IS NOT NULL
    AND LTRIM(RTRIM(CAST(i.lat AS nvarchar(255)))) <> ''
    AND LTRIM(RTRIM(CAST(i.lng AS nvarchar(255)))) <> '';
END
GO

-- ============================================================
-- RESUMEN DEL SCRIPT
-- ============================================================
-- Tabla hotel:    hoteles con geolocalización (GEOGRAPHY)
-- Tabla reservas: reservas básicas de hotel
-- SP find_by_distance: busca hoteles en un radio (metros)
-- Trigger ParseLatLng: mantiene GeoLocation actualizado
-- ============================================================
