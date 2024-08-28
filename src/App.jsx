import { Canvas } from "@react-three/fiber";
import { Experience } from "./components/Experience";
import { useGLTF } from "@react-three/drei";
import { Debug, Physics, useBox } from "@react-three/cannon";
import { useRef } from "react";
import ChainScene from "./components/demo-chain";

function App() {
  return (
    <>
      {/* <Canvas shadows camera={{ position: [3, 3, 3], fov: 30 }}>
        <color attach="background" args={["#ececec"]} />
        <Physics>
          <Debug color="black" scale={1.1}></Debug>
          <Experience />
        </Physics>
      </Canvas> */}
      <ChainScene />
    </>
  );
}

export default App;
