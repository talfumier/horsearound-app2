import {useLocation} from "react-router-dom";
import _ from "lodash";
import PageContent from "./PageContent";
import l1_data from "../../intl/translations.json";

function AnnouncesPage({announces}) {
  let path = useLocation().pathname;
  let params = [];
  params[1] = path.slice(path.lastIndexOf("/") + 1);
  path = path.slice(0, path.lastIndexOf("/"));
  params[0] = path.slice(path.lastIndexOf("/") + 1);
  let queryParams = [];
  if (params[0].length === 0) {
    //routes like /announces?activities=horsebackRiding&subactivities=accompaniedHike or /announces?destinations=france&countries=auvergneRhoneAlpes
    const uRLSearch = new URLSearchParams(window.location.search);
    for (let item of uRLSearch) {
      queryParams.push(item);
    }
  } else
    queryParams =
      //routes like /activities/horsebackRiding/accompaniedHike or /announces/france/bretagne
      [
        ["destinations", params[0]],
        ["countries", params[1]],
      ];
  function initPresetFilter(id) {
    const obj = {},
      ob = {};
    obj[id] = {};
    Object.keys(
      l1_data["en-EN"].src.components.allPages.Menu.navbar[id][
        id === "activities" ? "types" : "continents"
      ]
    ).map((key) => {
      obj[id][key] = {};
    });
    Object.keys(
      l1_data["en-EN"].src.components.allPages.Menu.navbar[id][
        id === "activities" ? "types" : "continents"
      ][queryParams[0][1]][id === "activities" ? "subactivities" : "countries"]
    ).map((key) => {
      ob[key] = true;
    });
    obj[id][queryParams[0][1]] = ob;
    return obj;
  }
  const n = queryParams.length;
  try {
    const filter = initPresetFilter(queryParams[0][0]);
    switch (n) {
      case 1: //activities group or continent destination
        break;
      case 2: //specific subactivity or country destination
        Object.keys(filter[queryParams[0][0]][queryParams[0][1]]).map((key) => {
          filter[queryParams[0][0]][queryParams[0][1]][key] =
            key === queryParams[1][1] ? true : false;
        });
    }
    queryParams = _.cloneDeep(filter);
  } catch (error) {
    queryParams = {};
  }
  return <PageContent announces={announces} presetFilter={queryParams} />;
}

export default AnnouncesPage;
