import { Canvas, useFrame } from "@react-three/fiber";
import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  CubicBezierLine,
  OrbitControls,
  PerspectiveCamera,
  Stars,
} from "@react-three/drei";
import WorldModel from "./WorldModel";
import { PointLight, Vector3 } from "three";
import { EffectComposer, SMAA, SSAO } from "@react-three/postprocessing";
import { geoDistance, geoInterpolate } from "d3-geo";
import { useThree } from "@react-three/fiber";
import { useDrag } from "@use-gesture/react";
import { a, SpringValue, useSpring } from "@react-spring/three";

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

const seattlePos = latAndLong(Seattle[0], Seattle[1], 300);

const Content = () => {
  const sunRef = useRef<PointLight>(null);
  const cameraRef = useRef<any>(null);

  useFrame(({ clock }) => {
    const time = clock.elapsedTime / 20;
    if (sunRef.current) {
      sunRef.current.position.x = Math.sin(time) * 300;
      sunRef.current.position.z = Math.cos(time) * 300;
    }
    if (cameraRef.current) {
      cameraRef.current.lookAt(0, 0, 0);
    }
  });

  const { size } = useThree();
  const [globeSpring, setGlobeSpring] = useSpring(() => ({
    rotation: [0, 0, 0],
    position: [0, 0, 0],
    config: { mass: 1, friction: 40, tension: 800 },
  }));
  const bind = useDrag(({ movement: [x, y], down }) => {
    if (down) {
      document.body.style.cursor = "grabbing";
    } else {
      document.body.style.cursor = "default";
    }
    const xPercent = x / size.width / 2;
    const yPercent = y / size.height / 2;
    setGlobeSpring({
      config: { mass: down ? 1 : 4, tension: down ? 2000 : 800 },
      rotation: down
        ? [yPercent * 2 * Math.PI, xPercent * 2 * Math.PI, 0]
        : [0, 0, 0],
      position: down
        ? [0, 0, -(Math.abs(xPercent) + Math.abs(yPercent)) * 200]
        : [0, 0, 0],
    });
  });

  const posSprings = useMemo(
    () => [
      new SpringValue({
        config: { mass: 40, friction: 400, tension: 200 },
      }).set(Seattle[0]),
      new SpringValue({
        config: { mass: 40, friction: 400, tension: 200 },
      }).set(Seattle[1]),
    ],
    []
  );

  useEffect(() => {
    setTimeout(() => {
      posSprings[0].start({ to: l[0] });
      posSprings[1].start({ to: l[1] });
    }, 3000);
  }, []);

  useFrame(() => {
    if (cameraRef.current) {
      const pos = latAndLong(posSprings[0].get(), posSprings[1].get(), 400);
      cameraRef.current.position.x = pos.x;
      cameraRef.current.position.y = pos.y;
      cameraRef.current.position.z = pos.z;
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

      <PerspectiveCamera ref={cameraRef} makeDefault />

      {/* <OrbitControls minDistance={160} zoomSpeed={0.1} /> */}
      <ambientLight />

      <a.group
        // @ts-ignore
        onPointerEnter={() => {
          document.body.style.cursor = "grab";
        }}
        // @ts-ignore
        onPointerLeave={() => {
          document.body.style.cursor = "default";
        }}
        {...bind()}
        {...globeSpring}
      >
        <WorldModel scale={30} />
        <RouteLine start={Seattle} end={l} />
      </a.group>
      <Stars radius={400} />

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
