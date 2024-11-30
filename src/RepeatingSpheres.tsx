import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import { ShaderMaterial, Vector3 } from "three";
import Sdf from "./Sdf";


export default function RepeatingSpheres({ DPR }: Readonly<{ DPR: number; }>) {
    const shaderRef = useRef<ShaderMaterial>(null!);
    useFrame((state) => {
        const { clock } = state;
        shaderRef.current.uniforms.uCamPos.value = new Vector3(-10.0 * clock.getElapsedTime(), 10.0 * Math.sin(clock.getElapsedTime()), 0.0);
        shaderRef.current.uniforms.uCamAngle.value = clock.getElapsedTime();
    });

    return <Sdf shaderRef={shaderRef} DPR={DPR} sceneID={0} />;
}