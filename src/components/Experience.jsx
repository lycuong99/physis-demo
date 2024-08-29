import {
  useBox,
  useConeTwistConstraint,
  useCylinder,
  useParticle,
  usePlane,
  usePointToPointConstraint,
  useSphere,
} from "@react-three/cannon";
import { Line, OrbitControls, useGLTF } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { createRef, useCallback, useEffect, useRef } from "react";
import { LineSegments, Mesh } from "three";

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
    // const x = mouse.x * width;
    // const y = (mouse.y * height) / 1.9 + -x / 3.5;
    // api.position.set(x / 1.4, y, 1);
    const { x, y } = mouse;
    api.position.set((x * width) / 2, (y * height) / 2, 0);
  });

  return (
    <mesh ref={ref}>
      <sphereGeometry args={[0.1, 32, 32]} />
      <meshBasicMaterial fog={false} depthTest={false} opacity={0.5} />
    </mesh>
  );
};

const Rubber = ({ points }) => {};

export const Experience = () => {
  const { nodes, scene } = useGLTF("conf-badge-4.glb");
  console.log(nodes);
  const ref1 = useRef();
  const [cardRef, api] = useBox(() => ({ mass: 10, type: "Dynamic" }));
  const [fixed] = useSphere(() => ({ args: [1], position: [0, 7, 0], type: "Kinematic" }));
  const [lineRef] = useCylinder(
    () => ({
      // args,
      linearDamping: 0.8,
      mass: 12,
      // position: [0, 4, 0],
      // type: "Static"
    }),
    useRef < Mesh > null
  );
  const bind = useDragConstraint(cardRef);
  // useFrame(({ clock }) => api.position.set(Math.sin(clock.getElapsedTime()) * 1, 0, 0))
  // const lineRef = useRef();

  usePointToPointConstraint(fixed, lineRef, { pivotA: [0, -1, 0], pivotB: [0, 1, 0] });
  // usePointToPointConstraint(lineRef, ref, { pivotA: [0, 0, 0], pivotB: [0, 0, 0] });
  useConeTwistConstraint(lineRef, cardRef, {
    // angle: Math.PI / 8,
    axisA: [0, 1, 0],
    axisB: [0, 1, 0],
    // maxMultiplier,
    pivotA: [0, -1, 0],
    pivotB: [0, 0, 0],
    // twistAngle: Math.PI,
  });

  // const [lineRef1] = useParticle(() => ({
  //   // args: [0.5, 0.5, 2, 16],
  //   // linearDamping: 0.8,
  //   mass: 1,
  //   position: [0, 2, 0],
  // }));

  const lineRef1 = useRef();

  console.log(lineRef1.current);

  return (
    <>
      <OrbitControls />
      <mesh ref={lineRef}>
        <cylinderGeometry args={[0.1, 0.1, 2]} />
        <meshStandardMaterial color={"#994747"} />
      </mesh>
      <primitive
        ref={cardRef}
        object={scene}
        position={[0, 10, 0]}
        onPointerDown={(e) => {
          console.log(e);
        }}
        onPointerUp={() => {
          console.log("up");
        }}
        onPointerMove={(e) => {
          console.log(e);
        }}
        // {...bind}
      />
      <Plane />
      <Cursor />
      <mesh ref={fixed}>
        <sphereGeometry args={[1, 32, 32]} />
        <meshBasicMaterial />
      </mesh>

      {/* <Line
        ref={lineRef1}
        points={[
          [0, 3, 0],
          [12, 2, 4],
        ]} // Array of points, Array<Vector3 | Vector2 | [number, number, number] | [number, number] | number>
        color="black" // Default
        lineWidth={12} // In pixels (default)
        segments // If true, renders a THREE.LineSegments2. Otherwise, renders a THREE.Line2
        dashed={false} // Default
        vertexColors={[[0, 0, 0]]} // Optional array of RGB values for each point
        // All THREE.LineMaterial props are valid
      /> */}
      {/* <line ref={lineRef1}>
        <lineBasicMaterial color="black" />
        <bufferGeometry />
      </line> */}
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
