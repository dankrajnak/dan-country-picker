import { Canvas, useFrame } from "@react-three/fiber";
import { useRef, useState } from "react";
import { CubicBezierLine, OrbitControls, Stars } from "@react-three/drei";
import WorldModel from "./WorldModel";
import { DoubleSide, PointLight, Vector3 } from "three";
import { EffectComposer, SMAA, SSAO } from "@react-three/postprocessing";
import { geoDistance, geoInterpolate } from "d3-geo";

const latAndLong = (lon: number, lat: number, radius: number = 150) => {
  var phi = (90 - lat) * (Math.PI / 180),
    theta = (lon + 90) * (Math.PI / 180),
    x = -(radius * Math.sin(phi) * Math.cos(theta)),
    z = radius * Math.sin(phi) * Math.sin(theta),
    y = radius * Math.cos(phi);

  return new Vector3(x, y, z);
};

type LngLat = [number, number];

const Columbus: LngLat = [-82.98333, 39.9612];
const Seattle: LngLat = [-122.335167, 47.608013];
const CapeTown: LngLat = [18.4233, -33.918861];
const Lisbon: LngLat = [-9.142685, 38.736946];

const l = CapeTown;

const RouteLine = ({ start, end }: { start: LngLat; end: LngLat }) => {
  const startVec = latAndLong(start[0], start[1]);
  const endVec = latAndLong(end[0], end[1]);

  const interpolate = geoInterpolate(start, end);
  const altitude = Math.max(geoDistance(start, end) * 100, 180);

  const midA = latAndLong(interpolate(0.25)[0], interpolate(0.25)[1], altitude);
  const midB = latAndLong(interpolate(0.75)[0], interpolate(0.75)[1], altitude);

  const lineRef = useRef<any>(null);
  useFrame(({ clock }) => {
    const time = clock.elapsedTime * 3;
    if (lineRef.current) {
      lineRef.current.material.dashOffset = -time;
    }
  });

  return (
    <CubicBezierLine
      ref={lineRef}
      opacity={0.4}
      dashSize={10}
      gapSize={5}
      dashed
      transparent
      start={startVec}
      end={endVec}
      midA={midA}
      midB={midB}
      segments={70}
      color="#F2C079"
    />
  );
};

const Content = () => {
  const sunRef = useRef<PointLight>(null);
  useFrame(({ clock }) => {
    const time = clock.elapsedTime / 20;
    if (sunRef.current) {
      sunRef.current.position.x = Math.sin(time) * 300;
      sunRef.current.position.z = Math.cos(time) * 300;
    }
  });

  return (
    <>
      <EffectComposer>
        <SMAA />

        <SSAO
          samples={30} // amount of samples per pixel (shouldn't be a multiple of the ring count)
          rings={4} // amount of rings in the occlusion sampling pattern
          distanceThreshold={1.0} // global distance threshold at which the occlusion effect starts to fade out. min: 0, max: 1
          distanceFalloff={0.0} // distance falloff. min: 0, max: 1
          rangeThreshold={0.5} // local occlusion range threshold at which the occlusion starts to fade out. min: 0, max: 1
          rangeFalloff={0.1} // occlusion range falloff. min: 0, max: 1
          luminanceInfluence={0.9} // how much the luminance of the scene influences the ambient occlusion
          radius={20} // occlusion sampling radius
          scale={0.5} // scale of the ambient occlusion
          bias={0.5} // occlusion bias
        />
      </EffectComposer>
      <OrbitControls minDistance={160} zoomSpeed={0.1} />
      <WorldModel scale={30} />
      <Stars radius={400} />
      <RouteLine start={Seattle} end={l} />

      <pointLight
        ref={sunRef}
        color="white"
        intensity={3}
        position={[300, 100, 300]}
      />
    </>
  );
};

const Globe = () => {
  return (
    <Canvas>
      <Content />
    </Canvas>
  );
};

export default Globe;
