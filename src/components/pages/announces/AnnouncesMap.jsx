import {useState, useEffect} from "react";
import {GoogleMap, InfoWindow, Marker} from "@react-google-maps/api";
import dummy from "./dummy_markers.json";
import "../../../css/map.css";

function AnnouncesMap({announces}) {
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
          name: `${ann.postalCode}, ${ann.city}, ${ann.destination}`,
          position: ann.position,
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
    const n = state.length;
    for (let i = 0; i < n; i++) {
      if (!state[i].dummy && state[i].id === id) {
        const markers = [...state];
        markers[i].active = true;
        setState(markers);
        break;
      }
    }
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
    const n = state.length;
    for (let i = 0; i < n; i++) {
      if (!state[i].dummy && state[i].id === id) {
        return state[i].active ? (
          <InfoWindow
            onCloseClick={() => {
              handleOnClose(id);
            }}
          >
            <div className="gm-style-iw">{name}</div>
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
                  onClick={() => handleActiveMarker(id)}
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
