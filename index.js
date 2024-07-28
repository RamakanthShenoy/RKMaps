//Google Maps, Places, Marker related variables
let autocompleteSearch, map, infowindow, infowindowContent, geocoder, marker, pin;
let searchField;
//Addressform variables
let route, postalField, locality, subLocality1, subLocality2, district, state, country, premise;


async function initAutocomplete() {
  setAddressFields();

  // Create the autocomplete object, restricting the search predictions to
  // addresses in India.
  autocompleteSearch = new google.maps.places.Autocomplete(searchField, {
    componentRestrictions: { country: ["in"] },
    fields: ["address_components", "place_id", "geometry", "name", "formatted_address"],
    types: ["address"],
  });

  // Create Map for better visualization
  map = new google.maps.Map(document.getElementById("map"), {
    center: { lat: 22.65143151550798, lng: 79.34627909691477 },
    zoom: 17,
    mapId: "DEMO_MAP_ID"
  });

  // Configure the click listener.
  map.addListener("click", (mapsMouseEvent) => {
    if (mapsMouseEvent.placeId) {
      var request = {
        placeId: mapsMouseEvent.placeId,
        fields: ['name', 'address_components', 'geometry']
      };

      let service = new google.maps.places.PlacesService(map);
      service.getDetails(request, callback);

      function callback(place, status) {
        if (status == google.maps.places.PlacesServiceStatus.OK) {
          fillInAddressWithPlace(place);
        }
      }
    }

  });

  infowindow = new google.maps.InfoWindow();

  infowindowContent = document.getElementById("infowindow-content");

  geocoder = new google.maps.Geocoder();
  // Create a pin element.
  pin = new google.maps.marker.PinElement({
    scale: 1.25,
  });
  marker = new google.maps.marker.AdvancedMarkerElement({
    map: map, position: { lat: 22.65143151550798, lng: 79.34627909691477 },
    title: 'India', content: pin.element,
    gmpClickable: true
  });

  searchField.focus();
  // When the user selects an address from the drop-down, populate the
  // address fields in the form.
  autocompleteSearch.addListener("place_changed", fillInAddress);
  document.querySelector("#saveAddress").onclick = showAddressToSave;
  autocompleteSearch.bindTo("bounds", map);
  //map.controls[google.maps.ControlPosition.TOP_LEFT].push(searchField);
  infowindow.setContent(infowindowContent);
  marker.addListener("click", () => {
    infowindow.open(map, marker);
  });
}

function showAddressToSave() {
  let finalAddress = `${trimEmpty(premise.value)}
  ${trimEmpty(route.value)}
  ${trimEmpty(subLocality2.value)}
  ${trimEmpty(subLocality1.value)}
  ${trimEmpty(locality.value)}
  ${trimEmpty(district.value + "-" + postalField.value)}
  ${trimEmpty(state.value)}
  ${trimEmpty(country.selectedOptions[0].innerText)}`;
  finalAddress = trimFinalAddress(finalAddress);
  document.querySelector("#address").innerHTML += finalAddress + "<br>";
}

function setAddressFields() {
  searchField = document.querySelector("#ship-address");
  route = document.querySelector("#address1");
  postalField = document.querySelector("#postcode");
  premise = document.querySelector("#premise");
  locality = document.querySelector("#city");
  subLocality1 = document.querySelector("#sublocality1");
  subLocality2 = document.querySelector("#sublocality2");
  district = document.querySelector("#district");
  state = document.querySelector("#state");
  country = document.querySelector("#country");
}

function clearAddressFields() {
  searchField.value = "";
  route.value = "";
  postalField.value = "";
  premise.value = "";
  locality.value = "";
  subLocality1.value = "";
  subLocality2.value = "";
  district.value = "";
  state.value = "";
}

function trimFinalAddress(finalAddress) {
  return finalAddress.replace(/,([^,]*)$/, '.$1')
}

function trimEmpty(val) {
  if (val && val != "") {
    val = val + ",<br>"
  }
  return val;
}

function updateGeoCodeMarker() {

  infowindow.close();

  const place = autocompleteSearch.getPlace();

  if (!place.place_id) {
    return;
  }

  geocoder
    .geocode({ placeId: place.place_id })
    .then(({ results }) => {
      map.setZoom(11);
      map.setCenter(results[0].geometry.location);
      marker.position = results[0].geometry.location,
        marker.title = place.place_id;

      infowindowContent.children["place-name"].textContent = place.name;
      infowindowContent.children["place-id"].textContent = place.place_id;
      infowindowContent.children["place-address"].textContent =
        results[0].formatted_address;
      infowindow.open(map, marker);
    })
    .catch((e) => window.alert("Geocoder failed due to: " + e));
}

function fillInAddressWithPlace(place) {

  clearAddressFields();
  // Get each component of the address from the place details,
  // and then fill-in the corresponding field on the form.
  // place.address_components are google.maps.GeocoderAddressComponent objects
  // which are documented at http://goo.gle/3l5i5Mr
  console.log(place);
  if (place.name) {
    premise.value = place.name;
  }
  for (const component of place.address_components) {
    // @ts-ignore remove once typings fixed
    const componentType = component.types[0];

    switch (componentType) {

      case "premise": {
        premise.value = component.long_name || premise.value;
        break;
      }

      case "postal_code": {
        postalField.value = component.long_name;
        break;
      }

      case "locality": {
        city.value = component.long_name;
        break;
      }
      case "administrative_area_level_1": {
        state.value = component.long_name;
        break;
      }
      case "country": {
        country.value = component.short_name;
        break;
      }
      case "sublocality_level_1": {
        subLocality1.value = component.long_name;
        break;
      }

      case "sublocality_level_2": {
        subLocality2.value = component.long_name;
        break;
      }

      case "administrative_area_level_3": {
        district.value = component.long_name;
        break;
      }
      case "route": {
        route.value = component.long_name;
        break;
      }

    }
  }
}

function fillInAddress() {

  // Get the place details from the autocomplete object.
  const place = autocompleteSearch.getPlace();

  if (!place.geometry || !place.geometry.location) {
    // User entered the name of a Place that was not suggested and
    // pressed the Enter key, or the Place Details request failed.
    window.alert("No details available for input: '" + place.name + "'");
    return;
  }
   // If the place has a geometry, then present it on a map.
   if (place.geometry.viewport) {
    map.fitBounds(place.geometry.viewport);
  } else {
    map.setCenter(place.geometry.location);
    map.setZoom(17);
  }
  fillInAddressWithPlace(place);
  //Update marker
  updateGeoCodeMarker();
}

window.initAutocomplete = initAutocomplete;
