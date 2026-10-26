# Smart Campus ANPR — Interactive Demo

[**Open the demo**](https://kaiqingkhaw.github.io/smart-campus-anpr-demo/)

Explore the Smart Campus ANPR dashboard in your browser. No installation or login is required. This demo uses fictional vehicle records and simulated access decisions.

## Try it

1. Select **Authorised entry** and run a scan to update parking availability.
2. Try a vehicle exit, an unregistered vehicle, or a visitor scan while visitor parking is full.
3. Open **Logs** to inspect and filter the decisions.
4. Open **Vehicles** to add a fictional record or change its active status.
5. Choose **Reset demo** to restore the starting data.

Changes exist only in the current browser tab and reset when the page is refreshed. Please use fictional names and plates.

## Scope

The full project combines Python, Flask, MySQL, YOLOv8, EasyOCR, an ESP32-CAM and an Arduino barrier controller. This browser version demonstrates the dashboard and access workflow; it does not run OCR, connect to a database, capture camera images or operate hardware.

## Run locally

Download `index.html` and open it in a browser. The page contains the demo logic, styles and logo. An internet connection is needed for Bootstrap, icons and fonts loaded from public CDNs.

## Deployment

GitHub Pages serves `index.html` from the root of the `main` branch. No build step or backend is required.

## Checks

With Node.js installed, run `node --test test-demo.cjs` from this repository. The seven tests cover entry and exit capacity, denied and unreadable plates, full parking, inactive records, category changes, sample-plate collisions and fresh session state. They test the simulation logic embedded in the published page; they do not validate OCR accuracy or physical hardware.
