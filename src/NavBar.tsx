import NavBarElement from "./NavBarElement";

export default function NavBar() {
  return <nav className="bg-gray-600 text-center my-1">
    <ul className="overflow-hidden inline-block p-0 m-0 align-middle">
      <NavBarElement to={"/"}>Repeating Spheres</NavBarElement>
      <NavBarElement to={"/menger"}>Menger Sponge</NavBarElement>
    </ul>
  </nav>;
}