import React from 'react';
import CesiumGlobe from './CesiumGlobe';
import GlobeEffects from './GlobeEffects';
import PortMarkers from './PortMarkers';
import ShipTraffic from './ShipTraffic';

import './LoginMaritimeBackground.css';

export default function LoginMaritimeBackground() {
  return (
    <div className="login-maritime-scene" aria-hidden="true">
      <GlobeEffects />
      <div className="login-cesium-shell">
        <CesiumGlobe>
          <PortMarkers />
          <ShipTraffic />
        </CesiumGlobe>
      </div>
      <div className="login-scene-caption">
        <p className="login-caption-kicker">Maritime Intelligence Surface</p>
        <h2>Premium operational globe with port, route, and vessel motion.</h2>
        <p>A refined Cesium backdrop with a darker control-room palette and a safer viewer setup for debugging.</p>
      </div>
      {/* <div className="login-feature-strip">
        {FEATURE_CARDS.map(([title, body]) => (
          <div key={title} className="login-feature-card">
            <strong>{title}</strong>
            <span>{body}</span>
          </div>
        ))}
      </div> */}
    </div>
  );
}
