import {useEffect, useRef} from "react";
import NavBarNoLink from "./NavBarNoLink.jsx";
import PageLoader from "./PageLoader.jsx";
import HomePage from "../home/HomePage.jsx";
import KeepInTouch from "../home/pageElements/KeepInTouch.jsx";
import Footer from "../common/Footer.jsx";

function LoadingPage() {
  const scroll = () => {
    window.scrollTo({top: 0, left: 0, behavior: "smooth"});
  };
  document.addEventListener("click", scroll);
  useEffect(() => {
    setTimeout(() => {
      try {
        document.getElementById("LoadingPage").click();
      } catch (error) {}
    }, 1000);
    return () => {
      // unsubscribe event listener > return is triggered when component has unmounted
      document.removeEventListener("click", scroll);
    };
  });
  return (
    <div id="LoadingPage" className="main-wrapper">
      <NavBarNoLink></NavBarNoLink>
      <PageLoader origin="App.js"></PageLoader>
      <HomePage announces={null} />
      {/* <KeepInTouch></KeepInTouch> */}
      <Footer noLink={true} />
    </div>
  );
}

export default LoadingPage;
