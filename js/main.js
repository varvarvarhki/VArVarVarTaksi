const nappi = document.getElementById("nappi");
let address1 = document.getElementById("lahto");
let address2 = document.getElementById("saapuminen");
nappi.addEventListener("click", search);

function  changeAddress( add) {
    let cordinate;
    // tähän reverse geocoding
    return cordinate;
}
function search() {
    let searchaddress = "https://api.openrouteservice.org/directions?api_key=5b3ce3597851110001cf62488bdc9c76f18d4844942745fee4a44696&coordinates="
    let searchaddress2 = "&profile:driving-car&format:geojson&instructions:false"
    let coordinates = chnageAddress(address1) + "|" +changeAddress(address2);
    searchaddress += coordinates;
}
