import React, { useEffect, useMemo, useRef } from 'react';
import { Cartesian3, Color, Math as CesiumMath, UrlTemplateImageryProvider, Camera, Rectangle } from 'cesium';
import { Viewer, ImageryLayer } from 'resium';

// Configure default startup view for Cesium to center on India/Asia
Camera.DEFAULT_VIEW_RECTANGLE = Rectangle.fromDegrees(60.0, 5.0, 100.0, 35.0);
Camera.DEFAULT_VIEW_FACTOR = 0.5;

export default function CesiumGlobe({ children }) {
  const viewerRef = useRef(null);

  const imageryProvider = useMemo(() => {
    return new UrlTemplateImageryProvider({
      url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
      maximumLevel: 19,
      credit: 'Tiles © Esri — Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EBP, and the GIS User Community'
    });
  }, []);

  useEffect(() => {
    const viewer = viewerRef.current?.cesiumElement;
    if (!viewer) return undefined;

    viewer.scene.globe.enableLighting = true;
    viewer.scene.globe.showGroundAtmosphere = true;
    viewer.scene.globe.baseColor = Color.fromCssColorString('#04111d');
    viewer.clock.shouldAnimate = true;
    viewer.scene.screenSpaceCameraController.enableTranslate = false;
    viewer.scene.screenSpaceCameraController.enableTilt = false;

    // Apply precise camera view centering after a short timeout to override default viewer flyTo / home resets
    const timer = setTimeout(() => {
      viewer.camera.setView({ 
        destination: Cartesian3.fromDegrees(78.0, 15.0, 8000000), 
        orientation: { 
          heading: CesiumMath.toRadians(0), 
          pitch: CesiumMath.toRadians(-85), 
          roll: 0 
        } 
      });
    }, 200);

    // Visibly rotate the camera on every frame pre-render
    const spin = () => viewer.scene.camera.rotate(Cartesian3.UNIT_Z, -0.00008);
    viewer.scene.preRender.addEventListener(spin);
    return () => {
      clearTimeout(timer);
      viewer.scene.preRender.removeEventListener(spin);
    };
  }, []);

  return (
    <Viewer 
      ref={viewerRef} 
      className="login-cesium-viewer" 
      baseLayer={false} 
      timeline={false} 
      animation={false} 
      baseLayerPicker={false} 
      geocoder={false} 
      homeButton={false} 
      sceneModePicker={false} 
      navigationHelpButton={false} 
      infoBox={false} 
      selectionIndicator={false} 
      fullscreenButton={false} 
      vrButton={false} 
      shouldAnimate 
      requestRenderMode={false} 
      scene3DOnly 
      skyBox={false}
    >
      <ImageryLayer 
        imageryProvider={imageryProvider} 
        brightness={0.8}
        contrast={1.35}
        saturation={1.25}
      />
      {children}
    </Viewer>
  );
}
// todo