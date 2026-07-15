import React from 'react';

export default function GlobeEffects() {
  return (
    <>
      <div className="login-space-layer" />
      <div className="login-starfield login-starfield-near" />
      <div className="login-starfield login-starfield-far" />
      <div className="login-space-grid" />
      <div className="login-space-glow login-space-glow-top" />
      <div className="login-space-glow login-space-glow-bottom" />
      <div className="login-cesium-vignette" />
      <div className="login-cesium-rim" />
      <div className="login-cesium-rim login-cesium-rim-soft" />
      <div className="login-cesium-arc login-cesium-arc-one" />
      <div className="login-cesium-arc login-cesium-arc-two" />
    </>
  );
}
