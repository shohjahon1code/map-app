const GOOGLE_API_KEY = "AIzaSyB51X7Zc2I6l6t5e2mrPY4kVKsP0jvOsLo";

export async function getAddressFromCoords(coords) {
  const res = await fetch(
    `https://maps.googleapis.com/maps/api/geocode/json?latlng=${coords.lat},${coords.lng}&key=${GOOGLE_API_KEY}`
  );
  if (!res.ok) {
    throw new Error("Failed to fetch coordinates. Please try again!!!");
  }
  const data = await res.json();
  if (data.error_message) {
    throw new Error(data.error_message);
  }

  const address = data.results[0].formatted_address;
  return address;
}

export async function getCoordsFromAdress(address) {
  const urlAddress = encodeURI(address);
  const res = await fetch(
    `https://maps.googleapis.com/maps/api/geocode/json?address=${urlAddress}&key=${GOOGLE_API_KEY}`
  );
  if (!res.ok) {
    throw new Error("Failed to fetch coordinates. Please try again!!!");
  }

  const data = await res.json();
  if (data.error_message) {
    throw new Error(data.error_message);
  }

  const coordinates = data.results[0].geometry.location;
  return coordinates;
}
