import { useEffect, useState } from "react";
import { GoogleMap, LoadScript, OverlayView } from "@react-google-maps/api";
import "./assets/character/knight.css"; 


const API_KEY = "AIzaSyC97MdvcRTmvJbKDd2rhzExjHoTphsQ6Ic";
console.log("Google Maps API Key:", import.meta.env.GOOGLE_API_KEY);
const mapContainerStyle = {
  width: "100vw",
  height: "100vh",
};

const center = { lat: 40.7128, lng: -74.006 };

export default function SurvivalMap() {
  const [playerPosition, setPlayerPosition] = useState(center);
  const [direction, setDirection] = useState("down"); // Default direction
  const [isMoving, setIsMoving] = useState(false);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition((position) => {
      setPlayerPosition({
        lat: position.coords.latitude,
        lng: position.coords.longitude,
      });
    });
  }, []);

  const handleMapClick = (event) => {
    const newPos = {
      lat: event.latLng.lat(),
      lng: event.latLng.lng(),
    };

    setIsMoving(true);

    // Determine direction based on movement
    if (newPos.lat > playerPosition.lat) setDirection("down");
    if (newPos.lat < playerPosition.lat) setDirection("up");
    if (newPos.lng > playerPosition.lng) setDirection("right");
    if (newPos.lng < playerPosition.lng) setDirection("left");

    setTimeout(() => setIsMoving(false), 500); // Stop animation after moving

    setPlayerPosition(newPos);
  };

  return (
    <LoadScript googleMapsApiKey={API_KEY}>
      <GoogleMap
        mapContainerStyle={mapContainerStyle}
        center={playerPosition}
        zoom={15}
        onClick={handleMapClick}
      >
        <OverlayView position={playerPosition} mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET}>
          <div className={`player ${isMoving ? "animate-walk" : ""}`} style={{
            backgroundPositionY: direction === "down" ? "0%" :
                                direction === "up" ? "25%" :
                                direction === "left" ? "50%" : "75%" // Adjust based on sprite sheet
          }} />
        </OverlayView>
      </GoogleMap>
    </LoadScript>
  );
}
