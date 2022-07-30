import * as THREE from "three";
import React, { useEffect, useRef } from "react";
import { useGLTF, useAnimations } from "@react-three/drei";
import { GLTF } from "three-stdlib";

const PATH = "/globeSmall/scene.gltf";

type GLTFResult = GLTF & {
  nodes: {
    ["Earth_Material_#50_0"]: THREE.Mesh;
    ["EarthClouds_Material_#62_0"]: THREE.Mesh;
  };
  materials: {
    Material_50: THREE.MeshStandardMaterial;
    Material_62: THREE.MeshStandardMaterial;
  };
};

type ActionName = "Take 001";
type GLTFActions = Record<ActionName, THREE.AnimationAction>;

export default function WorldModel({
  ...props
}: JSX.IntrinsicElements["group"]) {
  const group = useRef<THREE.Group>(null);
  const { nodes, materials, animations } = useGLTF(PATH) as GLTFResult;
  const { actions } = useAnimations<any>(animations, group);
  useEffect(() => {
    // @ts-ignore
    actions["Take 001"].timeScale = 1 / 50;
    // @ts-ignore
    actions["Take 001"].play();
  }, [actions]);

  return (
    <group ref={group} {...props} dispose={null}>
      <group name="Sketchfab_Scene">
        <group name="Sketchfab_model" rotation={[-Math.PI / 2, 0, 0]}>
          <group
            name="3f0d8c1a7c7c45138e5b99b56838fcb9fbx"
            rotation={[Math.PI / 2, 0, 0]}
          >
            <group name="Object_2">
              <group name="RootNode">
                <group
                  name="Earth"
                  rotation={[-Math.PI / 2, 0, 0]}
                  receiveShadow
                  castShadow
                >
                  <mesh
                    name="Earth_Material_#50_0"
                    geometry={nodes["Earth_Material_#50_0"].geometry}
                    material={materials.Material_50}
                  />
                </group>
                <group
                  castShadow
                  receiveShadow
                  name="EarthClouds"
                  rotation={[-Math.PI / 2, -Math.PI / 9, 0]}
                  scale={1.01}
                >
                  <mesh
                    name="EarthClouds_Material_#62_0"
                    geometry={nodes["EarthClouds_Material_#62_0"].geometry}
                    material={materials.Material_62}
                  />
                </group>
              </group>
            </group>
          </group>
        </group>
      </group>
    </group>
  );
}

useGLTF.preload(PATH);
