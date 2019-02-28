const nappi = document.getElementById("nappi")
nappi.addEventListener("click", changeAddress);
let coordinates = [];

function  changeAddress() {
    let searchadd = "https://api.openrouteservice.org/geocode/search?api_key=5b3ce3597851110001cf62488bdc9c76f18d4844942745fee4a44696&text=";
    let searchadd2 = "https://api.openrouteservice.org/geocode/search?api_key=5b3ce3597851110001cf62488bdc9c76f18d4844942745fee4a44696&text=";
    let address1 = document.getElementById("lahto").value;
    let address2 = document.getElementById("saapuminen").value;
    address1 = address1.replace(/\s/g, "%20");
    address2 = address2.replace(/\s/g, "%20");
    searchadd += address1 + "&boundary.country=FI";
    searchadd2 += address2 + "&boundary.country=FI";
    console.log(searchadd);

    const fetch1 = fetch(searchadd).then(function(vastaus) {
        return vastaus.json();

    }).then(function(json) {
        coordinates[0]="" + json['bbox'][0] + "," +json['bbox'][1];
        console.log((coordinates[0]));
    }).catch(function(error) {

        console.log(error);

    });

    const fetch2 = fetch(searchadd2).then(function(vastaus) {
        return vastaus.json();

    }).then(function(json) {
        coordinates[1]= "" + json['bbox'][0] + "," +json['bbox'][1];
        console.log(coordinates[1]);
    }).catch(function(error) {

        console.log(error);

    });

    Promise.all([fetch1, fetch2]).then(function() {
            search();
    });
}

function search() {
    let searchaddress =  "https://api.openrouteservice.org/directions?api_key=5b3ce3597851110001cf62488bdc9c76f18d4844942745fee4a44696&coordinates=";
    let searchaddress2 = "&profile=driving-car&format=geojson";

    let cs = coordinates[0] + "|" + coordinates[1];
    searchaddress += cs;
    searchaddress += searchaddress2;
    let stat;
    fetch(searchaddress).then(function(vastaus) {
        stat = vastaus.status;
        if(stat ===404) {
            let parent = document.getElementsByTagName("main")[0];
            let child = document.createElement("p");
            child.textContent =  "Haulla ei löydy tietoja";
            parent.appendChild(child);
        } else {
            return vastaus.json()

        }

    }).then(function(geojson) {
        if(stat!==404) {
            useData(geojson);
        }
    }).catch(function(error) {
        console.log(error);
    });
}
function useData(geojson) {
    console.log(geojson);
    let i = coordinates[0].indexOf(",");
    let cord1 = coordinates[0].substring(0,i);
    let cord2 = coordinates[0].substring(i +1, coordinates[0].length);
    let c1= parseFloat(cord1);
    let c2 = parseFloat(cord2);

    mapboxgl.accessToken = 'pk.eyJ1IjoidmFydmFydmFyaGtpIiwiYSI6ImNqc29meHo3aDBrY2EzeWp2NnNsdTNlejIifQ.Lr5nSKYjznoAIrtfgg6jpQ';
    let map = new mapboxgl.Map({
        container: 'map',
        style: 'mapbox://styles/mapbox/streets-v9',
        center: [c1,c2],
        zoom: 
    });
    L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
        attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
        maxZoom: 18,
        id: 'mapbox.streets',
        accessToken: 'pk.eyJ1IjoidmFydmFydmFyaGtpIiwiYSI6ImNqc29meHo3aDBrY2EzeWp2NnNsdTNlejIifQ.Lr5nSKYjznoAIrtfgg6jpQ'
    }).addTo(map);
}
