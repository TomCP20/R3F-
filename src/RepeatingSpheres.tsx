import Scene from "./Scene";

export default function RepeatingSpheres() {
    return <Scene sceneID={0} pos={(t) => [-10.0 * t, 10.0 * Math.sin(t), 0.0]} angle={(t) => t} />;
}