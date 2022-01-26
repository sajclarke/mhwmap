import * as React from "react";
import useSWR from "swr";
import MapboxMap from "../components/mapbox-map";
import MapLoadingHolder from "../components/map-loading-holder";
import format from "date-fns/format";

async function fetcher(params: any) {
  try {
    const response = await fetch(params);
    const responseJSON = await response.json();
    return responseJSON;
  } catch (error) {
    console.error("Fetcher error: " + error);
    return {};
  }
}

function App() {
  // const { events } = data;
  // const [loading, setLoading] = React.useState(true);
  const [activeMap, setActiveMap] = React.useState<any>();
  const [filter, setFilter] = React.useState<any>("");

  const todayDate = format(new Date(), "yyyy/mm/dd");
  console.log(todayDate);

  const handleMapLoading = (data: any) => {
    setActiveMap(data);
  };

  const { data: events, error } = useSWR("/api/locations", fetcher);

  const handleFilterChange = (e: any) => {
    const { value } = e.target;
    setFilter(value);
  };

  const handleMapClick = (map: any) => {
    console.log("map clicked", map);
  };

  const handleEventClick = (event: any) => {
    activeMap.jumpTo({ center: [event.latitude, event.longitude] });
  };

  if (error) return "An error has occurred.";

  if (!events)
    return (
      <MapLoadingHolder className="w-full h-full min-h-screen grid place-items-center" />
    );

  return (
    <div className="w-full h-full h-screen bg-gray-100 flex flex-col md:flex-row">
      <div className="w-full md:w-1/4 bg-gray-50 p-2 overflow-auto">
        <p className="text-md mx-3 md:mx-6 font-semibold text-gray-500 text-center py-3">
          Unofficial List of Events for Miami Hack Week
        </p>
        <input
          type="text"
          className="w-full bg-gray-100 rounded border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
          value={filter}
          placeholder="filter by name of event"
          onChange={handleFilterChange}
        />
        {events
          ?.filter(
            (event: any) =>
              format(new Date(event.startTime), "yyyy/MM/dd") ===
              format(new Date(), "yyyy/MM/dd")
          )
          ?.filter((event: any) =>
            event.name.toLowerCase().includes(filter?.toLowerCase())
          )
          ?.filter((event: any) => event.latitude && event.longitude)
          ?.map((event: any) => (
            <div
              key={event.name + "-" + event.startTime}
              onClick={() => handleEventClick(event)}
              className="bg-white shadow-lg rounded border border-gray-200 my-3 p-2"
            >
              <p className="text-xs text-gray-400">
                {format(new Date(event.startTime), "do LLL yyyy hh:mm aa")} -{" "}
                {format(new Date(event.endTime), "hh:mm aa")}
              </p>
              <h3 className="text-md font-semibold text-gray-600">
                {event.name}
              </h3>
              <p className="text-sm">{event.location}</p>
            </div>
          ))}

        {events?.filter((event: any) =>
          event.name.toLowerCase().includes(filter?.toLowerCase())
        ).length === 0 && (
          <div className="text-sm text-gray-400 mt-10">
            Sorry, but no events match your search
          </div>
        )}
      </div>
      <div className="w-full md:flex-1 bg-blue-50">
        <MapboxMap
          initialOptions={{
            center: [-80.20160645767147, 25.799290216030386],
          }}
          events={events}
          onMapClick={handleMapClick}
          onMapLoaded={handleMapLoading}
        />
      </div>
    </div>
  );
}

export default App;
