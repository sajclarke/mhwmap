import * as React from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";

interface MapboxMapProps {
  initialOptions?: Omit<mapboxgl.MapboxOptions, "container">;
  events: any[];
  onMapLoaded?(map: mapboxgl.Map): void;
  onMapClick?(map: mapboxgl.Map): void;
  onMapRemoved?(): void;
}

// async function fetcher(params: any) {
//   try {
//     const response = await fetch(params);
//     const responseJSON = await response.json();
//     return responseJSON;
//   } catch (error) {
//     console.error("Fetcher error: " + error);
//     return {};
//   }
// }

function MapboxMap({
  initialOptions = {},
  events = [],
  onMapLoaded,
  onMapClick,
  onMapRemoved,
}: MapboxMapProps) {
  const [map, setMap] = React.useState<mapboxgl.Map>();

  // const { data, error } = useSWR("/api/locations", fetcher);
  // console.log(initialOptions, events);
  // console.log(location);
  const mapNode = React.useRef(null);

  React.useEffect(() => {
    const node = mapNode.current;

    if (typeof window === "undefined" || node === null) return;

    const mapboxMap = new mapboxgl.Map({
      container: node,
      accessToken: process.env.NEXT_PUBLIC_MAPBOX_TOKEN,
      style: "mapbox://styles/mapbox/streets-v11",
      // center: [-80.20079209428363, 25.799100370012706],
      zoom: 13,
      ...initialOptions,
    });

    setMap(mapboxMap);

    mapboxMap.addControl(
      new mapboxgl.GeolocateControl({
        positionOptions: {
          enableHighAccuracy: true,
        },
        trackUserLocation: true,
      })
    );

    if (onMapLoaded) mapboxMap.once("load", () => onMapLoaded(mapboxMap));

    return () => {
      mapboxMap.remove();
      if (onMapRemoved) onMapRemoved();
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  React.useEffect(() => {
    if (map && events) {
      map.on("load", function () {
        // addDataLayer(map, data);
        console.log("something goes here", events);

        // console.log(
        //   "output",
        //   events.map((point: any) => ({
        //     name: point.title,
        //     location: point.location,
        //     description: point.notes,
        //     organizer: point.who,
        //     startTime: point.start_dt,
        //     endTime: point.end_dt,
        //   }))
        // );
        events.map((point: any) => {
          if (!point.latitude || !point.longitude) {
            return false;
          }
          new mapboxgl.Marker({
            // color: "#FFFFFF",
            // draggable: true,
          })
            .setPopup(
              new mapboxgl.Popup({ offset: 25 }) // add popups
                .setHTML(`<h3>${point.name}</h3><p>${point.location}</p>`)
            )
            .setLngLat([point.latitude, point.longitude])
            .addTo(map);
        });
      });
    }
  }, [setMap, events, map]);
  // style={{ width: "100%", height: "100%" }}
  return (
    <div
      ref={mapNode}
      className="flex-1 w-full h-full"
      style={{ width: "100%" }}
    />
  );
}

export default MapboxMap;
