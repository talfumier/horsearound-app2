import {useState} from "react";
import rando_equestre from "../img/packages/rando_equestre.jpg";
import rando_roulotte from "../img/packages/rando_roulotte.jpg";
import sejour_equitation_exterieure from "../img/packages/sejour_equitation_exterieure.jpg";
import sejour_equitation_club from "../img/packages/sejour_equitation_club.jpg";
import sejours_theme from "../img/packages/sejours_theme.jpg";
import bien_etre from "../img/packages/bien_etre.jpg";
import HomeToursHeader from "./HomeToursHeader";
import HomeToursContent from "./HomeToursContent";

function HomeToursPackage({announces}) {
  const [state, setState] = useState({
    selected_pack: ["cat1", "cat2", "cat3", "cat4", "cat5", "cat6"],
    cats_pack: {
      all: {
        pack: ["cat1", "cat2", "cat3", "cat4", "cat5", "cat6"],
        id: "src.components.homePage.HomePageToursPackage.all",
      },
      children: {
        pack: ["cat1", "cat3", "cat4", "cat5"],
        id: "src.components.homePage.HomePageToursPackage.children",
      },
      families: {
        pack: ["cat2", "cat3", "cat5"],
        id: "src.components.homePage.HomePageToursPackage.families",
      },
      adults: {
        pack: ["cat1", "cat3", "cat4", "cat5", "cat6"],
        id: "src.components.homePage.HomePageToursPackage.adults",
      },
    },
    cats: {
      cat1: {
        id: "src.components.allPages.Menu.navbar.activities.types.horsebackRiding.title",
        img: rando_equestre,
        link: "/announces?activities=horsebackRiding",
      },
      cat2: {
        id: "src.components.allPages.Menu.navbar.activities.types.trailerHike.title",
        img: rando_roulotte,
        link: "/announces?activities=trailerHike",
      },
      cat3: {
        id: "src.components.allPages.Menu.navbar.activities.types.outdoorRidingTrips.title",
        img: sejour_equitation_exterieure,
        link: "/announces?activities=outdoorRidingTrips",
      },
      cat4: {
        id: "src.components.allPages.Menu.navbar.activities.types.clubRidingTrips.title",
        img: sejour_equitation_club,
        link: "/announces?activities=clubRidingTrips",
      },
      cat5: {
        id: "src.components.allPages.Menu.navbar.activities.types.thematicTrips.title",
        img: sejours_theme,
        link: "/announces?activities=thematicTrips",
      },
      cat6: {
        id: "src.components.allPages.Menu.navbar.activities.types.wellBeingHorse.title",
        img: bien_etre,
        link: "/announces?activities=wellBeingHorse",
      },
    },
  });
  function handleChangePackage(key) {
    setState({...state, selected_pack: state.cats_pack[key].pack});
  }
  return (
    <section className="whiteSection mt-1 pt-0 ">
      <div className="container">
        <HomeToursHeader
          catsPack={state.cats_pack}
          onChangePackage={handleChangePackage}
        ></HomeToursHeader>
        <HomeToursContent
          selectedPack={state.selected_pack}
          cats={state.cats}
          announces={announces}
        ></HomeToursContent>
      </div>
    </section>
  );
}

export default HomeToursPackage;
