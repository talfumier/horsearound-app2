import {useState} from "react";
import {useQuery} from "react-query";
import {useIntl} from "react-intl";
import {ThemeProvider} from "@mui/material";
import _ from "lodash";
import {createBrowserRouter, RouterProvider} from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";
import {getMuiTheme} from "./AppMuiTheme";
import ContainerToast from "./components/pages/common/toastSwal/ContainerToast.jsx";
import "./App.css";
import Header from "./components/pages/common/Header";
import HomePage from "./components/pages/home/HomePage";
import MemberPage from "./components/pages/member/MemberPage.jsx";
import ActivityPage from "./components/pages/common/ActivityPage.jsx";
import Footer from "./components/pages/common/Footer";
import NotFound from "./components/pages/NotFound";
import AboutUs from "./components/pages/AboutUs";
import LegalNotice from "./components/pages/LegalNotice";
import Support from "./components/pages/Support";
import CguCgv from "./components/pages/CguCgv";
import AnnouncesPage from "./components/pages/announces/AnnouncesPage";
import AnnouncePage from "./components/pages/announce/AnnouncePage";
import FormRecover from "./components/pages/logIn&Out/FormRecover";
import {getAnnounces} from "./services/httpAnnounces.js";
import {getImagesIndexes, getImagesById} from "./services/httpImages.js";
import {getKeys} from "./components/pages/utils/utilityFunctions.js";
import LoadingPage from "./components/pages/loading/LoadingPage.jsx";
import {getRefreshTime} from "./services/utilsFunctions.js";
import UserContext from "./components/pages/common/context/UserContext.js";
import ProContext from "./components/pages/common/context/ProContext.js";
import ImagesContext from "./components/pages/common/context/ImagesContext";
import AnnounceForm from "./components/pages/member/announces/form/AnnounceForm.jsx";
import ViewerPage from "./components/pages/common/viewer/ViewerPage.jsx";

function App() {
  const reset = {
    resetpassword: window.location.pathname.includes("resetpassword"),
    viewFile: window.location.pathname.includes("viewFile"),
  };
  const contextImages = useIntl().formats; //used when switching languages (coming from LanguageSwitch)
  const {messages} = useIntl();
  const [user, setUser] = useState({});
  const [pro, setPro] = useState({});
  const [anns, setAnns] = useState({});
  const [state, setState] = useState({});
  const [dirty, setDirty] = useState(false);
  async function loadData(signal) {
    if (JSON.stringify(reset).indexOf(true) !== -1) return null; //no data loading when resetting password or viewing file in a new window
    try {
      const res = await getAnnounces(
        null, //status=any
        null, //archived=any
        null, //all fields to be retrieved
        null, //limit parameter set to null > retrieves all announces from the database
        null, //lang parameter set to null
        "-horseAroundNote",
        signal
      );
      const filtered = _.filter(res.data.anns, {
        status: "publique",
        archived: false,
      });
      setAnns({
        announces: {data: filtered, len: filtered.length},
        allAnnounces: {data: res.data.anns, len: res.data.nb},
      });
    } catch (error) {
      alert(
        "An error has occured in App.js announces data fetching : " +
          error.message
      );
      abortController.abort(); //clean-up code
      return "errorApp.js";
    }
  }
  async function loadAllImages(contextImages, signal) {
    if (JSON.stringify(reset).indexOf(true) !== -1) return null; //no data loading when resetting password or viewing file in a new window
    if (Object.keys(contextImages).length > 0) {
      setState(contextImages);
      return;
    }
    const msg = "An error has occured in App.js images data fetching : ";
    try {
      console.log("start images loading", new Date());
      const indexes = await getImagesIndexes(signal);
      const imgs = {};
      let res = null;
      await Promise.all(
        indexes.data.map(async (index, idx) => {
          res = await getImagesById(index._id, signal);
          if (Object.keys(res.data !== ["error"]))
            if (!imgs[res.data.id_announce])
              imgs[res.data.id_announce] = res.data.images;
        })
      )
        .then(() => {
          console.log("images loading complete", new Date());
          setState(imgs);
        })
        .catch((error) => {
          console.log(msg + error.message);
          abortController.abort(); //clean-up code
        });
    } catch (error) {
      alert(msg + error.message);
      abortController.abort(); //clean-up code
      return "errorApp.js";
    }
  }
  const abortController = new AbortController();
  const {isLoading, error, data} = useQuery(
    "announces",
    () => loadData(abortController.signal),
    getRefreshTime("App.js")
  );
  //console.log("announces data refreshed in App.js", new Date(), data);
  const {
    isLoading: loading,
    error: err,
    data: images,
  } = useQuery(
    "images",
    () => {
      loadAllImages(contextImages, abortController.signal);
    },
    {
      staleTime: Infinity,
      cacheTime: Infinity,
    }
  );
  if (data === "errorApp.js") return null;
  if (isLoading) return <LoadingPage></LoadingPage>;
  if (error) {
    alert("An error has occured in App.js useQuery hook : " + error.message);
    return null;
  }
  function handleSaveDelete(cs, id, body) {
    //save, delete operation in AnnounceForm
    const n = anns.allAnnounces.len;
    switch (cs) {
      case "save":
        const keys = Object.keys(body);
        for (let i = 0; i < n; i++) {
          if (anns.allAnnounces.data[i]._id === id) {
            //edit announce case
            keys.map((key) => {
              anns.allAnnounces.data[i][key] = body[key];
            });
            break;
          }
          if (i === n - 1) {
            //new announce case
            const dta = {_id: id};
            keys.map((key) => {
              dta[key] = body[key];
            });
            anns.allAnnounces.data.push(dta);
            anns.allAnnounces.len = n + 1;
          }
        }
        break;
      case "delete":
        for (let i = 0; i < n; i++) {
          if (anns.allAnnounces.data[i]._id === id) {
            anns.allAnnounces.data.splice(i, 1);
            anns.allAnnounces.len = n - 1;
            break;
          }
        }
        break;
      case "images":
        let imgs = _.cloneDeep(state);
        switch (id) {
          case "save":
            if (body.images.length === 0) delete imgs[body.id_announce];
            else imgs[body.id_announce] = body.images;
            break;
          case "delete":
            imgs = _.filter(imgs, (img) => {
              return img.id_announce !== body; //body=id_announce
            });
        }
        setState(imgs);
    }
  }
  function wrapElement(element, cs = false) {
    return (
      <div className="main-wrapper">
        <Header
          reset={cs}
          dirty={dirty}
          onHandleDirty={(bl) => {
            setDirty(bl);
          }}
        />
        <br />
        {element}
        {!reset.viewFile && <Footer noLink={cs} />}
      </div>
    );
  }
  let router = null,
    cs = -1;
  if (reset.resetpassword) {
    router = createBrowserRouter([
      {
        path: "/resetpassword/:id/:token",
        element: wrapElement(<FormRecover />, true),
      },
    ]);
    cs += 1;
  }
  if (reset.viewFile) {
    router = createBrowserRouter([
      {
        path: "/viewFile",
        element: wrapElement(<ViewerPage params={null} />, true),
      },
    ]);
    cs += 1;
  }
  if (cs == -1) {
    const routes = [];
    getKeys(["activities", "subactivities"], messages).map((key) => {
      routes.push({
        path: `/activities/${key[0]}/${key[1]}`,
        element: wrapElement(<ActivityPage />),
      });
    });
    getKeys(["destinations", "countries"], messages).map((key) => {
      routes.push({
        path: `/destinations/${key[0]}/${key[1]}`,
        element: wrapElement(<AnnouncesPage announces={anns.announces} />),
      });
    });
    router = createBrowserRouter([
      {
        path: "/",
        element: wrapElement(<HomePage announces={anns.announces} />),
      },
      ...routes,
      {
        path: "/member",
        element: wrapElement(
          <MemberPage
            announces={anns.allAnnounces}
            onHandleSaveDelete={handleSaveDelete} //deletion made in the member page announces table
            onHandleDirty={(bl) => {
              setDirty(bl);
            }}
          />
        ),
      },
      {
        path: "/member/announces/edit/:id",
        element: wrapElement(
          <AnnounceForm
            data={anns.allAnnounces}
            onHandleSaveDelete={handleSaveDelete} //deletion made in the announce form (edit case)
            onHandleDirty={(bl) => {
              setDirty(bl);
            }}
          />
        ),
      },
      {
        path: "/member/announces/new",
        element: wrapElement(
          <AnnounceForm
            onHandleSaveDelete={handleSaveDelete} //deletion made in the announce form (creation case)
            onHandleDirty={(bl) => {
              setDirty(bl);
            }}
          />
        ),
      },
      {
        path: "/announces",
        element: wrapElement(<AnnouncesPage announces={anns.announces} />),
      },
      {
        path: "/announce/details",
        element: wrapElement(<AnnouncePage announces={anns.allAnnounces} />),
      },
      {path: "/about", element: wrapElement(<AboutUs />)},
      {path: "/mentions-legales", element: wrapElement(<LegalNotice />)},
      {path: "/support", element: wrapElement(<Support />)},
      {path: "/CGU-CGV", element: wrapElement(<CguCgv />)},
      {path: "*", element: wrapElement(<NotFound />)},
    ]);
  }
  function handleUser(data) {
    setUser(data);
  }
  function handlePro(key, data) {
    setPro(
      data !== null
        ? {...pro, [key]: data}
        : _.filter(pro, (ky) => {
            return ky !== key; //remove pro[key]
          })
    );
  }
  return (
    //  Object.keys(anns).length > 0 && (
    <ThemeProvider theme={getMuiTheme()}>
      <UserContext.Provider value={{user, onHandleUser: handleUser}}>
        <ProContext.Provider value={{pro, onHandlePro: handlePro}}>
          <ImagesContext.Provider value={state}>
            <RouterProvider router={router}>
              <ContainerToast></ContainerToast>
            </RouterProvider>
          </ImagesContext.Provider>
        </ProContext.Provider>
      </UserContext.Provider>
    </ThemeProvider>
    //  )
  );
}
export default App;
