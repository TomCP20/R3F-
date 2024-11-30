import Scene from "./Scene";

export default function Menger() {
    return <Scene sceneID={1} pos={(t) => [5 * Math.sin(t), 0, 5 * Math.cos(t)]} angle={(t) => -t} />;
}