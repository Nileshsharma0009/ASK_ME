import React from 'react';
import {
  Cartesian2,
  Cartesian3,
  Color,
  DistanceDisplayCondition,
  HorizontalOrigin,
  LabelStyle,
  NearFarScalar,
  VerticalOrigin,
} from 'cesium';
import { Entity } from 'resium';
import { PORTS } from './constants';

export default function PortMarkers() {
  return PORTS.map((port) => (
    <Entity
      key={port.name}
      position={Cartesian3.fromDegrees(port.lon, port.lat, 12000)}
      point={{ pixelSize: 14, color: Color.WHITE, outlineColor: Color.fromCssColorString('#7c3aed'), outlineWidth: 3, disableDepthTestDistance: Number.POSITIVE_INFINITY, scaleByDistance: new NearFarScalar(2.5e6, 1.3, 2.2e7, 0.65) }}
      ellipse={{ semiMinorAxis: 56000, semiMajorAxis: 56000, material: Color.fromCssColorString('#38bdf8').withAlpha(0.14), outline: true, outlineColor: Color.fromCssColorString('#93c5fd').withAlpha(0.45), height: 900 }}
      label={{ text: port.name, font: '700 16px sans-serif', fillColor: Color.WHITE, style: LabelStyle.FILL_AND_OUTLINE, outlineWidth: 3, outlineColor: Color.fromCssColorString('#07111f').withAlpha(0.95), showBackground: true, backgroundColor: Color.fromCssColorString('#07111f').withAlpha(0.65), backgroundPadding: new Cartesian2(10, 6), horizontalOrigin: HorizontalOrigin.LEFT, verticalOrigin: VerticalOrigin.CENTER, pixelOffset: new Cartesian2(18, -12), disableDepthTestDistance: Number.POSITIVE_INFINITY, distanceDisplayCondition: new DistanceDisplayCondition(0, 2.4e7), scaleByDistance: new NearFarScalar(3.5e6, 1.08, 2.2e7, 0.72) }}
    />
  ));
}
