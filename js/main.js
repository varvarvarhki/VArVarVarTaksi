const nappi = document.getElementById("nappi");
nappi.addEventListener("click", changeAddress);
let coordinates = [];
let linestring = [];
let distance;
let duration;
const meneva = document.getElementById('menevaHinta');
const taksiHelsinki = document.getElementById('taksihelsinkiHinta');
const kajon = document.getElementById('kajonHinta');
const lahitaksi  = document.getElementById('lahitaksiHinta');
const kovanen  = document.getElementById('kovanenHinta');
const fixutaxi = document.getElementById('fixutaxiHinta');
const retrotaksi = document.getElementById('retrotaksiHinta');
const hinnasto = document.getElementById('hinnasto');
const info = document.getElementById("info");

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
        for(let i = 0; i < document.getElementById("lahtoerror").childNodes.length; i ++) {
            document.getElementById("lahtoerror").removeChild(document.getElementById("lahtoerror").lastChild);
        }
        if(json['features'].length===0|| json['features'].length>1) {
            if(coordinates[0]!==undefined) {
                coordinates[0] = null;
            }
            linestring  = []
            document.getElementById("lahto").value = null;
            let p = document.createElement("p");
            p.innerText= "Lähtöosoitetta ei löytynyt";
            document.getElementById("lahtoerror").appendChild(p);
            document.getElementById("map").style.display="none";
            hinnasto.style= "display:none";
            info.style="display:none";
            throw new Error("Lähtöosoitetta ei löynyt.");
        } else {
            coordinates[0] = "" + json['bbox'][0] + "," + json['bbox'][1];
            console.log(coordinates[0]);
        }

    });

    const fetch2 = fetch(searchadd2).then(function(vastaus) {
        return vastaus.json();

    }).then(function(json) {
        for(let i = 0; i < document.getElementById("saapuminenerror").childNodes.length; i ++) {
            document.getElementById("saapuminenerror").removeChild(document.getElementById("saapuminenerror").lastChild);
        }
        if(json['features'].length===0 || json['features'].length>1)  {
            if(coordinates[1]!==undefined) {
                coordinates[1] = null;
            }
            linestring =[];
            document.getElementById("saapuminen").value = null;
            let p = document.createElement("p");
            p.innerText= "Saapumisosoitetta ei löytynyt";
            document.getElementById("saapuminenerror").appendChild(p);
            document.getElementById("map").style.display="none";
            hinnasto.style="dispaly:none";
            info.style ="display:none";
            info.innerText ="";
            throw new Error("Saapumissositetta ei löytynyt");

        } else {
            coordinates[1] = "" + json['bbox'][0] + "," + json['bbox'][1];
            console.log(coordinates[1]);
        }
    });

    Promise.all([fetch1, fetch2]).then(function() {
        document.getElementById("map").style.display="block";
        hinnasto.style.display ='table';
        search();
    }).catch(function(error) {
        console.log(error);
    });

}

function search() {

    if (coordinates.includes(
        "24.99935,20.20787" || "25.012523,60.09489" || "24.65104,60.20956" ||
        "24.716896,60.135897")) {
        confirm("Paikkaa ei ole");
    } else {
        let searchaddress = "https://api.openrouteservice.org/directions?api_key=5b3ce3597851110001cf62488bdc9c76f18d4844942745fee4a44696&coordinates=";
        let searchaddress2 = "&profile=driving-car&format=geojson";

        let cs = coordinates[0] + "|" + coordinates[1];
        searchaddress += cs;
        searchaddress += searchaddress2;
        let stat;
        fetch(searchaddress).then(function(vastaus) {
            stat = vastaus.status;
            if (stat === 404) {
                let parent = document.getElementsByTagName("main")[0];
                let child = document.createElement("p");
                child.textContent = "Haulla ei löydy tietoja";
                parent.appendChild(child);
            } else {
                return vastaus.json()

            }

        }).then(function(geojson) {
            if (stat !== 404) {
                useData(geojson);

            }
        }).catch(function(error) {
            console.log(error);
        });
    }

    function useData(geojson) {
        let i = coordinates[0].indexOf(",");
        let cord1 = coordinates[0].substring(0, i);
        let cord2 = coordinates[0].substring(i + 1, coordinates[0].length);
        let j = coordinates[0].indexOf(",");
        let cord3 = coordinates[1].substring(0, i);
        let cord4 = coordinates[1].substring(i + 1, coordinates[1].length);
        let c1 = parseFloat(cord1);
        let c2 = parseFloat(cord2);
        let c3 = parseFloat(cord3);
        let c4 = parseFloat(cord4);

        mapboxgl.accessToken = 'pk.eyJ1IjoidmFydmFydmFyaGtpIiwiYSI6ImNqc29meHo3aDBrY2EzeWp2NnNsdTNlejIifQ.Lr5nSKYjznoAIrtfgg6jpQ';
        let map = new mapboxgl.Map({
            container: 'map',
            style: 'mapbox://styles/mapbox/streets-v9',
            center: [c1, c2],
            zoom: 15
        });

        for (let i = 0; i <
        geojson['features'][0]['geometry']['coordinates'].length; i++) {
            linestring[i] = [
                geojson['features'][0]['geometry']['coordinates'][i][0],
                geojson['features'][0]['geometry']['coordinates'][i][1]];

        }
        calculateDistance();
        calculateTime();
            map.on("load", function() {
                /* Image: An image is loaded and added to the map. */
                map.loadImage("https://i.imgur.com/MK4NUzI.png",
                    function(error, image) {
                        if (error) throw error;
                        map.addImage("custom-marker", image);
                        /* Style layer: A style layer ties together the source and image and specifies how they are displayed on the map. */
                        map.addLayer({
                            id: "marker1",
                            type: "symbol",
                            /* Source: A data source specifies the geographic coordinate where the image marker gets placed. */
                            source: {
                                type: "geojson",
                                data: {
                                    type: 'FeatureCollection',
                                    features: [
                                        {
                                            type: 'Feature',
                                            properties: {},
                                            geometry: {
                                                type: "Point",
                                                coordinates: [c1, c2]
                                            }
                                        }
                                    ]
                                }
                            },
                            layout: {
                                "icon-image": "custom-marker",
                            }
                        });
                    });
                map.loadImage("https://i.imgur.com/MK4NUzI.png",
                    function(error, image) {
                        if (error) throw error;
                        map.addImage("custom-image", image);
                        /* Style layer: A style layer ties together the source and image and specifies how they are displayed on the map. */
                        map.addLayer({
                            id: "marker2",
                            type: "symbol",
                            /* Source: A data source specifies the geographic coordinate where the image marker gets placed. */
                            source: {
                                type: "geojson",
                                data: {
                                    type: 'FeatureCollection',
                                    features: [
                                        {
                                            type: 'Feature',
                                            properties: {},
                                            geometry: {
                                                type: "Point",
                                                coordinates: [c3, c4]
                                            }
                                        }
                                    ]
                                }
                            },
                            layout: {
                                "icon-image": "custom-marker",
                            }
                        });

                    });
                map.addLayer({
                    "id": "route",
                    "type": "line",
                    "source": {
                        "type": "geojson",
                        "data": {
                            "type": "Feature",
                            "properties": {},
                            "geometry": {
                                "type": "LineString",
                                "coordinates":
                                linestring
                            }
                        }
                    },
                    "layout": {
                        "line-join": "round",
                        "line-cap": "round"
                    },
                    "paint": {
                        "line-color": "#f00",
                        "line-width": 5
                    }
                });

            });
        }

    }

function calculateDistance() {
    let sadd = "https://api.openrouteservice.org/matrix?api_key=5b3ce3597851110001cf62488bdc9c76f18d4844942745fee4a44696&profile=driving-car&locations=";
    let sadd2 = "&metrics=distance&units=km";
    sadd += coordinates[0] +"%7C" + coordinates[1] + sadd2;
    fetch(sadd).then(function(answer) {
        return answer.json();
    }).then(function(json) {
       distance = json['distances'][0][1];
    }).catch(function (error) {
        console.log(error);
    });
}
function calculateTime() {
    let sadd = "https://api.openrouteservice.org/matrix?api_key=5b3ce3597851110001cf62488bdc9c76f18d4844942745fee4a44696&profile=driving-car&locations=";
    let sadd2 = "&metrics=duration";
    sadd += coordinates[0] +"%7C" + coordinates[1] + sadd2;
    fetch(sadd).then(function(answer) {
        return answer.json();
    }).then(function (json) {
        duration = (json['durations'][0][1]/60);
    }).catch(function (error) {
        console.log(error);
    });
}
window.setInterval(laske, 1000);



function laske(){
    info.textContent ="Matka: " + getDistance().toFixed(0) + "km" +
        " Aika: " + getDuration().toFixed(0) + "min";
    meneva.textContent = menevaHinta(getDistance(),getDuration()).toFixed(2)+'e';
    taksiHelsinki.textContent = taksiHelsinkiHinta(getDistance(),getDuration()).toFixed(2)+'e';
    kajon.textContent = kajonHinta(getDistance(),getDuration()).toFixed(2)+'e';
    lahitaksi.textContent = lahitaksiHinta(getDistance(),getDuration()).toFixed(2)+'e';
    kovanen.textContent = kovanenHinta(getDistance(),getDuration()).toFixed(2)+'e';
    fixutaxi.textContent = fixutaxiHinta(getDistance(),getDuration()).toFixed(2)+'e';
    retrotaksi.textContent = retroTaksiHinta(getDistance()).toFixed(2)+'e';
}

function getDistance() {
    return distance;
}

function getDuration() {
    return duration;
}


function menevaHinta(matka,aika){
    let hinta = 3.00;
    hinta +=(matka*0.9 +aika*0.9);
    if (hinta<10){
        return 10
    } else{
        return hinta;
    }
}

function taksiHelsinkiHinta(matka,aika){
    let hinta = 3.90;
    const day = new Date();
    if(day.getDay()<6&&(8<day.getHours()&&day.getHours()<15)){
        hinta += (matka*0.99+0.79*aika);

    } else if ((day.getDay()===5&&day.getHours()===23)||(day.getDay()===6&&day.getHours()<7)||(day.getDay()===6&&day.getHours()===23)||(day.getDay()===1&&day.getHours()<7)||day.getDay()===7){
        hinta += (matka*1.19+aika*0.99);
    } else{
        hinta += (matka*1.09+0.89*aika);
    }
    if(hinta<7){
        return 7;
    } else {
        return hinta;
    }

}

function kajonHinta(matka,aika){
    return 5.90 + matka * 0.89 + aika * 0.89;
}

function lahitaksiHinta(matka,aika){
    const day = new Date();
    let hinta =0;
    if((1<day.getDay()&&day.getDay()<7)&&(5<day.getHours()&&day.getHours()<19)){
        hinta = 3.90+(matka*1+aika*0.75);
    } else{
        hinta = 7.90+(matka*1+aika*0.75);
    }
    return hinta;
}
function kovanenHinta(matka,aika){
    let hinta = 3.90;
    const day = new Date();
    if(day.getDay()<6&&(8<day.getHours()&&day.getHours()<15)){
        hinta += (matka*0.99+0.79*aika);
    } else if ((day.getDay()===5&&day.getHours()===23)||(day.getDay()===6&&day.getHours()<7)||(day.getDay()===6&&day.getHours()===23)||(day.getDay()===1&&day.getHours()<7)||day.getDay()===7){
        hinta += (matka*1.19+aika*0.99);
    } else{
        hinta += (matka*1.09+0.89*aika);
    }

    if(hinta<7){
        return 7;
    } else {
        return hinta;
    }
}
function fixutaxiHinta(matka,aika){
    const day = new Date();
    let hinta =0;
    if (5<day.getHours()&&day.getHours()<18){
        hinta = matka*0.99+aika*0.9;
    } else{
        hinta = matka*1.17+aika*0.99;
    }
    if(hinta<10){
        return 10
    } else {
        return hinta;
    }
}
function retroTaksiHinta(matka){
    const day = new Date();
    let hinta = 0;
    if(day.getDay()<6&&(5<day.getHours()&&day.getHours()<20)||(day.getDay()===6&&(5<day.getHours()&&day.getHours()<16))){
        hinta = 4.70+matka*1.58;
    } else {
        hinta = 7.20+matka*1.58;
    }
    return hinta;
}
(function() {
    var placesAutocomplete = places({
        appId: 'plG4UGHQVISH',
        apiKey: '0b96a80abd2ecc48f79aa96c67f521b9',
        container: document.querySelector('#lahto'),
        style: false,
        debug: true
    });
})();
(function() {
    var placesAutocomplete = places({
        appId: 'plG4UGHQVISH',
        apiKey: '0b96a80abd2ecc48f79aa96c67f521b9',
        container: document.querySelector('#saapuminen'),
        style: false,
        debug: true
    });
})();





