# RK Maps [![APACHE2.0 License](https://img.shields.io/badge/License-APACHE%202.0-green.svg)](https://choosealicense.com/licenses/apache-2.0/)
This is a simple HTML project which demonstrates the use of a few Google Maps Platform APIs.
We have used the Places API, GeoCode API, Maps API mainly in this project.

## Setup
- Download the files to a folder.
- Use your favorite server or you may choose to use http-server using the below steps.

## Local Server Setup
Install http-server globally. You need to have node and npm in your system.
```bash
  npm install -g http-server
```
Navigate to your code folder and run a terminal command as below to bring a local server up
```bash
  http-server
```

## API KEY
In maps-demo.html please replace the key=APIKEY to your actual API key

## Features:
- Restricted to India for demo purposes.
- Users can search an address and populate everything to the address fields.
- If they don't like it they can manually enter in the fields.
- Save address just collates the field values and displays it at the side.
- Bonus - If address they are searching is not directly shown or they are not aware, they can search a place nearby and use the map to navigate to the actual place and click on it to load the address.
- Error Handling if user enters invalid location.

## Other Learnings:
- India Latitude Longitude can be set as 22.65143151550798, 79.34627909691477
- Learned and generated maps API key and restricted it to my website only and for the places API, Geocoding and Maps API only.
- Learned how to show map and change markers on the map
- Learned how to capture click events and get details from the map.

## Improvements:
- Clear form option can be provided.
- Can open up for US and dynamically change address form fields for US context.
- Additional non conventional fields like - Landmark, phone can be added.
- Not that responsive as just demonstrating the capability of maps.
- Required Fields check is not applied.
- Cannot populate address from any latitude longitude in the map as of now as it needs more handling in code.
- Used basic styles from google documentation and not modified any look and feel there.
- More fine tuning in maps display needed.

## Screenshots
![App Screenshot](https://rkshenoy.in/rkmaps/1.png)
