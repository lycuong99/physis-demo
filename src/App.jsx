import { Canvas } from "@react-three/fiber";
import { Experience } from "./components/Experience";
import { useGLTF } from "@react-three/drei";
import { Debug, Physics, useBox } from "@react-three/cannon";
import { useRef } from "react";
import ChainScene from "./components/demo-chain";

function App() {
  return (
    <>
      <Canvas shadows camera={{ fov: 50, position: [0, 5, 20] }}>
        <color attach="background" args={["#ececec"]} />
        <Physics>
          <Debug color="red" scale={1.1}>
          <Experience />
          </Debug>
        </Physics>
      </Canvas>
      {/* <ChainScene /> */}
    </>
  );
}

export default App;
