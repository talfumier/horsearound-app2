import {useState, useEffect, useContext} from "react";
import {useIntl} from "react-intl";
import {GoogleMap, InfoWindow, Marker, s} from "@react-google-maps/api";
import ImagesContext from "../common/context/ImagesContext.js";
import dummy from "./dummy_markers.json";
import {formatValue} from "../member/announces/form/DropDown.jsx";
import {getMainImage} from "../utils/utilityFunctions.js";
import "../../../css/map.css";

function AnnouncesMap({announces}) {
  const contextImages = useContext(ImagesContext);
  const {formatMessage} = useIntl();
  const [state, setState] = useState([]);
  useEffect(() => {
    function getMarkers() {
      if (typeof announces === "undefined" || announces.length === 0) {
        setState([]);
        return;
      }
      const markers = {
        dummy, //dummy markers to set map bounds (coming from dummy_markers.json file)
        locations: [],
      };
      let id = 2;
      announces.map((ann) => {
        markers.locations.push({
          id: (id += 1),
          name: (
            <div
              className="mt-0 pt-0 mb-2"
              style={{color: "#1F4E78", fontWeight: 500}}
            >
              {`${ann.postalCode} ${ann.city}`}
              <br></br>
              {formatValue("destinations", ann.destination, formatMessage)}
            </div>
          ),
          position: ann.position,
          ann_id: ann._id,
        });
      });
      setState([...markers.dummy, ...markers.locations]);
    }
    getMarkers();
  }, [announces]);
  const [map, setMap] = useState(null);
  useEffect(() => {
    if (map && state.length > 0) {
      const bounds = new window.google.maps.LatLngBounds();
      state.forEach(({position}) => bounds.extend(position));
      map.fitBounds(bounds);
    }
  }, [map, state]);
  function handleActiveMarker(id) {
    const n = state.length,
      markers = [...state];
    for (let i = 0; i < n; i++) {
      if (state[i].dummy) continue;
      markers[i].active = state[i].id === id ? true : false;
    }
    setState(markers);
  }
  function handleOnLoad(map) {
    setMap(map);
  }
  function handleOnClose(id) {
    const n = state.length;
    for (let i = 0; i < n; i++) {
      if (!state[i].dummy && state[i].id === id) {
        const markers = [...state];
        markers[i].active = false;
        setState(markers);
        break;
      }
    }
  }
  function handleCloseAll() {
    const markers = [...state],
      n = markers.length;
    for (let i = 0; i < n; i++) {
      markers[i].active = false;
    }
    setState(markers);
  }
  function getInfoWindow(id, name) {
    let data = null;
    const n = state.length;
    for (let i = 0; i < n; i++) {
      if (!state[i].dummy && state[i].id === id) {
        console.log(contextImages[state[i].ann_id]);
        data = getMainImage(contextImages[state[i].ann_id]);
        return state[i].active ? (
          <InfoWindow
            /*  options={{
              disableAutoPan: true,
            }} */
            onCloseClick={() => {
              handleOnClose(id);
            }}
          >
            <div className="gm-style-iw">
              {name}
              <img
                src={data}
                style={{width: 150, cursor: "pointer"}}
                onClick={() => {
                  document
                    .getElementById(`announce_${state[i].ann_id}`)
                    .scrollIntoView();
                  window.scrollBy(0, -100);
                }}
              ></img>
            </div>
          </InfoWindow>
        ) : null;
        break;
      }
    }
  }
  return (
    <div
      className="row location-aria"
      style={{
        maxHeight: 400,
        maxWidth: 800,
        marginTop: "-35px",
      }}
    >
      {
        <GoogleMap
          defaultZoom={5}
          defaultCenter={{lat: 48.85, lng: 2.35}} //Paris coordinates
          onLoad={handleOnLoad}
          onClick={handleCloseAll}
          mapContainerStyle={{width: "35vw", height: "46vh"}}
          mapTypeId="terrain"
        >
          {state.map(
            ({id, name, position, dummy}) =>
              !dummy && (
                <Marker
                  key={id}
                  position={position}
                  onMouseOver={() => handleActiveMarker(id)}
                >
                  {getInfoWindow(id, name)}
                </Marker>
              )
          )}
        </GoogleMap>
      }
    </div>
  );
}

export default AnnouncesMap;
