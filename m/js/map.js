function initialize()
{
  if(window.parent && !window.parent.closed)
  {
//    var latitude;
//    var longitude;
//    var hotelname;
//    var hoteladdr;
//    var country;

    if(window.parent.latitude && window.parent.latitude != undefined) { latitude = window.parent.latitude; }
    if(window.parent.longitude && window.parent.longitude != undefined) { longitude = window.parent.longitude; }
    if(window.parent.hotelname && window.parent.hotelname != undefined) { hotelname = window.parent.hotelname; }
    if(window.parent.hoteladdr && window.parent.hoteladdr != undefined) { hoteladdr = window.parent.hoteladdr; }
    if(window.parent.country && window.parent.country != undefined) { country = window.parent.country.toLowerCase(); }

    if(!latitude && !longitude && hoteladdr && country)
    {
      var geocoder = new google.maps.Geocoder();
      geocoder.geocode({ 'address': hoteladdr, 'region' : country }, function(results, status)
      {
        if (status == google.maps.GeocoderStatus.OK)
        {
          if(results[0].geometry.location_type == google.maps.GeocoderLocationType.ROOFTOP)
          {
              latitude = results[0].geometry.location.lat();
              longitude = results[0].geometry.location.lng();
              view(latitude, longitude, hotelname);
          }
          else
          {
            geocoder.geocode({ 'address': hoteladdr }, function(results, status)
            {
              if (status == google.maps.GeocoderStatus.OK && (results[0].geometry.location_type == google.maps.GeocoderLocationType.RANGE_INTERPOLATED || results[0].geometry.location_type == google.maps.GeocoderLocationType.ROOFTOP))
              {
                latitude = results[0].geometry.location.lat();
                longitude = results[0].geometry.location.lng();
                view(latitude, longitude, hotelname);
              }
              else {view(latitude, longitude, hotelname);}
            });
          }
        }
        else {view(latitude, longitude, hotelname);}
      });
    }
    else {view(latitude, longitude, hotelname);}
  }
}
function view(latitude, longitude, hotelname)
{
  var myOptions = {
    zoom: 15,
    center: new google.maps.LatLng(latitude, longitude),
    mapTypeId: google.maps.MapTypeId.ROADMAP
  }
  var map = new google.maps.Map(document.getElementById("map_canvas"), myOptions);
  var myLatLng = new google.maps.LatLng(latitude, longitude);
  var marker = new google.maps.Marker({
    position: myLatLng,
    map: map,
    icon: new google.maps.MarkerImage('./js/images/hotel.png', new google.maps.Size(32, 37), new google.maps.Point(0,0), new google.maps.Point(0, 32)),
    title: hotelname
  });
}