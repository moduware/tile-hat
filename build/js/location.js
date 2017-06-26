function locationReceivedHandler(location) {
  console.log(location);
  window.geo_location = location;
  document.getElementById("location-city").textContent = location.city == null ? location.country : location.country + ', ' + location.city;
}
