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
    console.log(day.getHours());
    console.log(day.getDay());
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
    const day = new Date;
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
    console.log(day.getHours());
    console.log(day.getDay());
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
function retroTaksi(matka){
    const day = new Date();
    if(day.getDay()<6&&(5<day.getHours()&&day.getHours()<20)||(day.getDay()===6&&(5<day.getHours()&&day.getHours()<16))){
        hinta = 4.70+matka*1.58;
    } else {
        hinta = 7.20+matka*1.58;
    }
}
