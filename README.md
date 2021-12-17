# Catch the Bus SG

Catch the Bus SG is a rebuild and extension of [Simple Bus Arrivals SG](https://github.com/m-t-chang/simple-bus-arrivals-sg) using React.js.

Catch the Bus SG is a mobile-first web app for checking bus arrival timings in Singapore. It is intended for regular commuters who are familiar with the bus system, and want a simple app to track their commonly-taken buses and optimize their travel time.

Premise of the app: being in class, keep checking my phone to when to leave to get on bus (20 min bus and I don't want to waste time waiting at the bus stop), so notification is a central concept

Major features:

-   Check bus arrival times
-   Browse bus stops by closest, or search for specific bus stops and services
-   Get estimated walking distance
-   Get smart push notification to tell you when to walk to bus stop, based on arrival time and walking distance
-   Routing to individual service stops
-   Add to home screen for mobile

## Technologies Used

-   React.js
-   Material UI
-   Node.js (only needed to run the script that downloads bus service/route/stop data)

## Usage Instructions

The app is hosted at https://m-t-chang.github.io/simple-bus-arrivals-sg/.

For quick access on a mobile device, you can add the app to your home screen. In Android Chrome, use the "Add to Home screen" menu option.

## Installation Instructions

To set up your own version of this app, simply clone repository and it should work.

Note that HTTPS is required for the geolocation API to work.

If LTA changes bus services, routes, or stops, run "get-LTA-data.mjs" to download new data from LTA's API and create a new JSON file.

## Overview of How the App Works

Data sources

-   Static bus data (stops, services, and routes) from the [Land Transport Authority (LTA)](https://datamall.lta.gov.sg/content/datamall/en/dynamic-data.html)
-   Dynamic bus arrival times, from the LTA via [arrivelah](https://github.com/cheeaun/arrivelah)
-   Walking directions from [Openrouteservice](https://openrouteservice.org/)

React design

-   Material UI
-   Page and Component Hierarchy
    -   App
        -   NavBar (currently only a placeholder)
        -   Body (switches between views)
            -   View 1: Browse
                -   Stack
                    -   Arrival Card
                -   Search for Service and Stop
                    -   Autocomplete (MUI)
            -   View 2: Focus
        -   Footer
-   UseContext for several states, like user location, and static data

## Lessons learned

-   Most interesting
    -   Reuse old code
        -   API calls and data cleaning
        -   Filtering autocomplete options based on the other input
        -   Slower at first, but able to make more complicated
    -   Material UI. It saved me time with built in stuff:
        -   Autocomplete (built in validation. Just provide options. More powerful than HTML autocomplete)
        -   Cool animations in buttons
        -   Built in icons
        -   Drawer menu
        -   Toggle switch
    -   Data handling with context, Custom hooks
        -   Example is busArrivalData
    -   Push notifications
        -   Logic is, if walk time equals arrival time, AND notification is enabled, then push it
        -   Notification itself is simple to implement, with title, body, and image
        -   Favorite part, love to just toggle it and see the notification. Satisfying.
    -   API pagination
        -   static bus data has pagination, I have a Node.JS script to download the whole database, outside of the web app.
    -   Coding approach, process
        -   Approach was write code that works, refactor as needed
        -   Also, static first, then data. Build one component at a time.

## Known Issues

-   User is allowed to add a new stop without filling in both Bus Stop and Bus Service No. fields.
-   Inputs are not validated.
-   Bug: if the user enters a value into Bus Stop before the code finishes finding the closest bus stops, the process doesn't complete and the Bus Stops never get sorted by distance.
-   Some parts of the website are not translated to both languages.
-   The website should inform the user when no bus arrival time is retrieved (e.g. the service is not currently running) instead of simply not displaying a number.
-   There is no UI element to indicate that the arrival time cards can be clicked on to reveal more information.
-   The data source has information that is not included, such as the direction of the bus service, terminal stop, hours of service, capacity, etc.

## Credits

Many thanks to **[arrivelah](https://github.com/cheeaun/arrivelah)** for providing an API to access LTA's bus arrival time data.
