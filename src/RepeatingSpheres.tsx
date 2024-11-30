import Sdf from "./Sdf";

export default function RepeatingSpheres() {
    return <Sdf sceneID={0} pos={(t) => [-10.0 * t, 10.0 * Math.sin(t), 0.0]} angle={(t) => t} />;
}