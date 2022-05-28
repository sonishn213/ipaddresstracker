var map = L.map("map"); //initialize map object
window.addEventListener("load", async () => {
  let value = "";
  let data = await getlocation(value); //load user location by default

  if (data.messages) {
    alert(data.messages);
  } else {
    maps(data.location.lat, data.location.lng); //show userlocation on map by default
    displayInfo(data);
  }

  let input = document.querySelector("#input");
  input.addEventListener("input", (event) => {
    value = event.target.value;
    //reading input values as they type
  });
  let btn = document.querySelector("#btn");
  btn.addEventListener("click", async () => {
    if (value.length > 0) {
      value = valuetrim(value); //removes https and other such from url
      let data = await getlocation(value); //getlocation of the entered ip or domain
      if (data.messages) {
        alert(data.messages); //if invalid value;
      } else {
        maps(data.location.lat, data.location.lng); //show location of entered ip on map
        displayInfo(data); //display info such as ip and locations on screen
      }
    }
  });
});

function maps(lat, lng) {
  //map api to show the location of ip address using the lat and lag returned by geo.ipify Api
  map = map.remove(); //remove to reintiate
  map = L.map("map").setView([lat, lng], 13);
  //map api leaflet
  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 50,
    attribution: "© OpenStreetMap",
  }).addTo(map);
  //change marker icon
  var myIcon = L.icon({
    iconUrl: "images/icon-location.svg",
  });
  L.marker([lat, lng], { icon: myIcon }).addTo(map); //load the marker icon
}

async function getlocation(value) {
  // geo.ipify api to get the location of ip
  let response = await fetch(
    `https://geo.ipify.org/api/v2/country,city?apiKey=at_YHmKOJI7j2dy32t30jFEEFxAelOmP&domain=${value}`
  );
  let data = await response.json();
  console.log(data);
  return await data;
}
function valuetrim(value) {
  // remove extras from url
  value = value.trim();
  value = value.replace("https", "");
  value = value.replace("http", "");
  value = value.replace("://", "");
  value = value.replace("www.", "");
  value = value.split("/")[0];
  return value;
}
function displayInfo(data) {
  // finally show all the info to user
  let ipaddr = document.querySelector("#ipaddress");
  let location = document.querySelector("#location");
  let timezone = document.querySelector("#timezone");
  let isp = document.querySelector("#isp");

  ipaddr.innerHTML = data.ip;
  location.innerHTML = `${data.location.city}, ${data.location.region}, ${data.location.country}`;
  timezone.innerHTML = `UTC ${data.location.timezone}`;
  isp.innerHTML = data.isp;
}
