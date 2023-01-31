import NavBar from "./NavBar";

function Header({reset, dirty, onHandleDirty}) {
  return !reset ? (
    <NavBar dirty={dirty} onHandleDirty={onHandleDirty}></NavBar>
  ) : null;
}

export default Header;
