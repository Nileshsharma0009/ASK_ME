import React, { useMemo } from 'react';
import { ArcType, CallbackProperty, Cartesian2, Cartesian3, Color, Cartographic, EllipsoidGeodesic } from 'cesium';
import { Entity } from 'resium';
import { PORTS, ROUTES, SHIP_ICON, SHIP_ROUTES } from './constants';

function createPosition(startLon, startLat, endLon, endLat, durationMs, phaseMs) {
  const start = Cartographic.fromDegrees(startLon, startLat);
  const end = Cartographic.fromDegrees(endLon, endLat);
  const geodesic = new EllipsoidGeodesic(start, end);
  const cartoResult = new Cartographic();

  return new CallbackProperty(() => {
    const progress = ((Date.now() + phaseMs) % durationMs) / durationMs;
    // Ease-in-out motion
    const eased = 0.5 - Math.cos(progress * Math.PI * 2) / 2;
    geodesic.interpolateUsingFraction(eased, cartoResult);
    // Position the ship slightly above the ocean surface (15,000 meters)
    return Cartesian3.fromRadians(cartoResult.longitude, cartoResult.latitude, 15000);
  }, false);
}

export default function ShipTraffic() {
  const portMap = useMemo(() => Object.fromEntries(PORTS.map((port) => [port.name, port])), []);
  const ships = useMemo(() => SHIP_ROUTES.map((route, index) => ({ ...route, position: createPosition(route.start[0], route.start[1], route.end[0], route.end[1], route.durationMs, index * 6000) })), []);

  return (
    <>
      {ROUTES.map(([from, to]) => (
        <Entity
          key={`${from}-${to}`}
          polyline={{ positions: Cartesian3.fromDegreesArray([portMap[from].lon, portMap[from].lat, portMap[to].lon, portMap[to].lat]), width: 2.8, arcType: ArcType.GEODESIC, material: Color.fromCssColorString('#38bdf8').withAlpha(0.7) }}
        />
      ))}
      {ships.map((ship) => (
        <Entity
          key={ship.name}
          position={ship.position}
          point={{ pixelSize: 8, color: Color.fromCssColorString('#e0f2fe').withAlpha(0.95), outlineColor: Color.fromCssColorString('#0ea5e9').withAlpha(0.85), outlineWidth: 2, disableDepthTestDistance: Number.POSITIVE_INFINITY }}
          billboard={{ image: SHIP_ICON, width: 82, height: 36, disableDepthTestDistance: Number.POSITIVE_INFINITY, pixelOffset: new Cartesian2(0, -10) }}
        />
      ))}
    </>
  );
}
