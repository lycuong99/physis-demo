import { useBox, usePlane, usePointToPointConstraint, useSphere } from "@react-three/cannon";
import { OrbitControls, useGLTF } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { createRef, useCallback, useEffect, useRef } from "react";
import { Mesh } from "three";

const cursor = createRef();
function Plane() {
  const [ref] = usePlane(() => ({
    rotation: [-Math.PI / 2, 0, 0], // Quay mặt phẳng nằm ngang
  }));

  return (
    <mesh ref={ref} position={[0, 0, 0]}>
      <planeGeometry args={[10, 10]} />
      <meshBasicMaterial color="#994747" />
    </mesh>
  );
}
function useDragConstraint(child) {
  const [, , api] = usePointToPointConstraint(cursor, child, { pivotA: [0, 0, 0], pivotB: [0, 0, 0] });
  // TODO: make it so we can start the constraint with it disabled
  useEffect(() => void api.disable(), []);
  const onPointerDown = useCallback((e) => {
    e.stopPropagation();
    //@ts-expect-error Investigate proper types here.
    e.target.setPointerCapture(e.pointerId);
    api.enable();
  }, []);
  const onPointerUp = useCallback(() => api.disable(), []);
  return { onPointerDown, onPointerUp };
}

const Cursor = () => {
  const [ref, api] = useSphere(() => ({ args: [0.5], position: [0, 0, 10000], type: "Static" }), cursor);

  useFrame(({ mouse, viewport: { height, width } }) => {
    const x = mouse.x * width;
    const y = (mouse.y * height) / 1.9 + -x / 3.5;
    api.position.set(x / 1.4, y, 1);
  });

  return (
    <mesh ref={ref}>
      <sphereGeometry args={[0.1, 32, 32]} />
      <meshBasicMaterial fog={false} depthTest={false} opacity={0.5} />
    </mesh>
  );
};

export const Experience = () => {
  const { nodes, scene } = useGLTF("conf-badge-4.glb");
  console.log(nodes);
  const ref1 = useRef();
  const [ref, api] = useBox(() => ({ mass: 10 }));
  const [fixed] = useSphere(() => ({ args: [1], position: [0, 4, 0], type: "Static" }));
  usePointToPointConstraint(fixed, ref, { pivotA: [0, -0.1, 0], pivotB: [0, 0, 0] });
  const bind = useDragConstraint(ref);
  // useFrame(({ clock }) => api.position.set(Math.sin(clock.getElapsedTime()) * 1, 0, 0))
  return (
    <>
      <OrbitControls />
      <primitive
        ref={ref}
        object={scene}
        position={[0, 10, 0]}
        onPointerDown={(e) => {
          console.log(e);
        }}
        // {...bind}
      />
      <Plane />
      <Cursor />
      <mesh ref={fixed}>
        <sphereGeometry args={[0.1, 32, 32]} />
        <meshBasicMaterial />
      </mesh>
      {/* <mesh ref={ref} position={[0, 2, 0]} {...bind} scale={1} geometry={nodes.SM_Blue.geometry} castShadow>
        <m flatShading />
      </mesh> */}
      {/* <group>
        <mesh scale={1} geometry={nodes.SM_Blue.geometry} castShadow>
          <meshBasicMaterial flatShading />
        </mesh>
        <mesh scale={1} geometry={nodes.SM_Steel_02.geometry} castShadow>
          <meshBasicMaterial flatShading />
        </mesh>
        <mesh scale={1} geometry={nodes.SM_Steel_02.geometry} castShadow>
          <meshBasicMaterial flatShading />
        </mesh>
      </group> */}
    </>
  );
};
