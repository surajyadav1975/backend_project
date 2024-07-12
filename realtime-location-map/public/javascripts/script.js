const socket=io();

if(navigator.geolocation){
    navigator.geolocation.watchPosition(
        (position)=>{
            const {latitude,longitude}=position.coords;
            socket.emit("send-location",{latitude,longitude});
        },
        (error)=>{
            console.error(error);
        },
        {
            enableHighAccuracy: true,
            timeout: 100000,
            maximumAge: 0,
        }
    );
}

const map=L.map("map").setView([0,0],10);
L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {attribution: 'suraj yadav'}).addTo(map);

const markers={};

socket.on("recieve",(data)=>{
    const {id,latitude,longitude}=data;
    console.log(latitude);
    console.log(longitude);
    map.setView([latitude,longitude],16);

    if(markers[id]){
        markers[id].setLatLng([latitude,longitude]);
    }
    else{
        markers[id]=L.marker([latitude,longitude]).addTo(map);
    }
})

socket.on("user-gone",(id)=>{
    if(markers[id]){
        map.removeLayer(markers[id]);
        delete markers[id];
    }
})