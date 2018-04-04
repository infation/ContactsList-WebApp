var map;
var markers = [];
$(document).ready(function(){
    initMap();
});

$( "tr" ).click(function() {
    var id = $(this).attr("_id").val();
    console.log(id);  
    alert( "Handler for .click() called." );
});

function focusMap(){
    
}


function initMap(){
    map = new google.maps.Map(document.getElementById('map'), {
        center: {lat: -34.397, lng: 150.644},
        zoom: 1
      });

    for(var i = 0; i < contacts.length; i++){
        addExtras(contacts[i])
    }

}

function addExtras(c) {
    var contact = c.contact;
    var latlng = { lat: parseFloat(contact.lat), lng: parseFloat(contact.lng)}

    var contentString ='<div id="content">'+
            '<div>Name: '+ contact.first + " " + contact.last + '</div>'+
            '<div>Address: '+ contact.street + ", " + contact.city + ", " + contact.state + ", " + contact.zip + '</div>'+
            '<div>Phone: '+ contact.phone + '</div>'+
            '<div>Email: '+ contact.email + '</div>';
    var infowindow = new google.maps.InfoWindow({
        content: contentString,
        maxWidth: 200
      });

    var marker = new google.maps.Marker({
        position: latlng,
        map: map
      });
      /*
      marker.addListener('mouseover', function() {
        infowindow.open(map, marker);
      });

      marker.addListener('mouseout', function(){
        marker.infowindow.close();
      });*/
}