<section class="user_profile">
    <div class="container">
        <div class="row justify-content-center">
            <div class="col-md-12 my-lg-5 my-3">
                <div class="user_profile_card">
                    <div class="card vcc_profile_card">
                        <?php include('includes/userheader.php');?>

                        <div class="container mb-3">                             
                            <?php $this->load->view('home/includes/_messages.php') ?>
                            <div class="row"> 
                                <div class="card">                                     
                                     <div class="user-card-header card-header">
                                            <div class="row">
                                                <div class="col-6">
                                                    <h5 class="card-title">
                                                        <?=$title;?>
                                                    </h5>
                                                </div> 
                                            </div>
                                        </div>
                                         <div class="card-body">
                                            <?=form_open_multipart(base_url('add_address'), 'id="addAddressForm", class="form-horizontal"')?>
                                            <div class="row">
                                                <div class="col-md-12 mb-md-3">
                                                    <label for="address1" class="form-label">Address Line 1 <span class="required">*</span></label>
                                                    <input type="text" class="form-control" value="<?=set_value('address1')?>" name="address1" required> 
                                                </div>
                                                <div class="col-md-12 mb-md-3">
                                                    <label for="address2" class="form-label">Address Line 2 <span class="required">*</span></label>
                                                    <input type="text" class="form-control" name="address2" value="<?=set_value('address2')?>" required>
                                                </div>
                                                <div class="col-md-6 mb-md-3">
                                                    <label for="address_type" class="form-label">Address Type <span class="required">*</span></label>
                                                    <select name="address_type" id="address_type" class="form-control">
                                                        <?php foreach ($addressTypeArr as $addtypekey => $addtypevalue) {?>
                                                            <option value="<?=$addtypekey?>"><?=$addtypevalue?></option>
                                                        <?php }?>
                                                    </select>
                                                </div>
                                                <div class="col-md-6 mb-md-3">
                                                    <label for="countryId" class="form-label"> Country <span class="required">*</span></label>
                                                    <select id="search_country" name="countryId" class="form-control custom-select border-form-control">
                                                      <option value="0">Select Country</option>
                                                       <?php foreach ($search_country as $val) { ?>
                                                           <option value="<?php echo $val["_id"]; ?>"<?= (set_value('countryId') == $val["_id"])?"selected":"" ?> ><?php echo $val["title"]; ?></option>
                                                       <?php } ?>
                                                   </select>
                                                </div>
                                                <div class="col-md-6 mb-md-3">
                                                    <label for="stateId" class="form-label"> State <span class="required">*</span></label>  
                                                    <select id="search_state" name="stateId" class="form-control custom-select border-form-control">
                                                      <option value="0">Select State</option>
                                                   </select>
                                                </div>
                                                <div class="col-md-6 mb-md-3">
                                                    <label for="cityId" class="form-label"> City <span class="required">*</span></label>
                                                    <select id="search_city" name="cityId" class="form-control custom-select border-form-control">
                                                      <option value="0">Select City</option>
                                                   </select>
                                                </div>
                                                <div class="col-md-6 mb-md-3">
                                                    <label for="areaId" class="form-label" > Area <span class="required">*</span></label>
                                                    <select id="search_area" name="areaId"  class="form-control custom-select border-form-control">
                                                      <option value="0">Select Area</option>
                                                   </select>
                                                </div>
                                                <div class="col-md-6 mb-md-3">
                                                    <label for="Address 1" class="form-label">Zip Code <span class="required">*</span></label>
                                                    <input type="number" class="form-control" value="<?=set_value('pincode')?>" name="pincode" placeholder="eq-123456" required>
                                                </div>
                                                <div class="col-md-6 mb-md-3">
                                                    <input type="checkbox" class="custom-control-input" id="default_address" name="default_address" value="true">
                                                    <label class="custom-control-label ms-2" for="default_address">Make it default</label>
                                                </div>
                                            </div>

                                            <div class="row">
                                                 <div class="form-group">
                                                  <label class="col-sm-2 control-label">Drag Marker To Your Location</label>
                                                  <div class="col-sm-12"> 
                                                  <input type="hidden" name="long" id="long" value="<?=set_value('long')?>">
                                                  <input type="hidden" name="lat" id="lat" value="<?=set_value('lat')?>">
                                                      <input id="address" type="textbox" value="Jodhpur, Rajasthan ">
                                                      <input type="button" value="Geocode" onclick="codeAddress()">
                                                      <div id="map" style="width:100%; height: 250px;"></div>
                                          
                                                  </div>
                                                </div> 
                                            </div>
                                            <div class="row">&nbsp;</div>

                                            <div class="row">
                                                <div class="col-sm-12 d-flex justify-content-end">
                                                    <input type="hidden" name="phone_no" value="">
                                                    <input type="hidden" name="from_cart" value="<?php echo (isset($_GET["fromcart"]) ? "true" : "false") ?>">
                                                    <button id="save_user_address" type="submit" class="btn btn-success btn-lg"> Save Address </button> 
                                                </div>
                                            </div>
                                            </form>
                                        </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</section>
<script async  src="https://maps.googleapis.com/maps/api/js?key=<?=$this->config->item('MapKey')?>&callback=initMap&v=weekly&channel=2"></script>
<script> 

// map
var latitude = Number(document.getElementById("lat").value);
var longitude = Number(document.getElementById("long").value);

var geocoder;
var map;
var marker;
var infowindow;

function initMap() { 
  let zoom = 16;
  if(latitude=='' || longitude =='')
  {
    latitude = 26.297954962350808;
    longitude = 73.03960917781264;
  } 
  var uluru = {
    lat: latitude,
    lng: longitude
  };
  geocoder = new google.maps.Geocoder();
  infowindow = new google.maps.InfoWindow({
    size: new google.maps.Size(150, 50)
  });
  map = new google.maps.Map(document.getElementById('map'), {
    zoom: zoom,
    center: uluru
  });
  marker = new google.maps.Marker({
    map: map,
    draggable: true,
    animation: google.maps.Animation.DROP,
    position: uluru
  });
  google.maps.event.addListener(marker, 'dragend',
    function(marker) {
      var latLng = marker.latLng;
      currentLatitude = latLng.lat();
      currentLongitude = latLng.lng();
      $("#lat").val(currentLatitude);
      $("#long").val(currentLongitude);
    }
  );
}

function geocodePosition(pos) {
  geocoder.geocode({
    latLng: pos
  }, function(responses) {
    if (responses && responses.length > 0) {
      marker.formatted_address = responses[0].formatted_address;
      var latLng = marker.getPosition(); 
      currentLatitude = latLng.lat();
      currentLongitude = latLng.lng();
      $("#lat").val(currentLatitude);
      $("#long").val(currentLongitude);
    } else {
      marker.formatted_address = 'Cannot determine address at this location.';
    }
    infowindow.setContent(marker.formatted_address + "<br>coordinates: " + marker.getPosition().toUrlValue(6));
    infowindow.open(map, marker);
  });
}

function codeAddress() {
  var address = document.getElementById('address').value;   
  geocoder.geocode({
    'address': address
  }, function(results, status) {
    if (status == google.maps.GeocoderStatus.OK) {
      map.setCenter(results[0].geometry.location);
      if (marker) {
        marker.setMap(null);
        if (infowindow) infowindow.close();
      }
      marker = new google.maps.Marker({
        map: map,
        draggable: true,
        position: results[0].geometry.location
      });
      google.maps.event.addListener(marker, 'dragend', function() {
        geocodePosition(marker.getPosition());
      });
      google.maps.event.addListener(marker, 'click', function() {
        if (marker.formatted_address) {
          infowindow.setContent(marker.formatted_address + "<br>coordinates: " + marker.getPosition().toUrlValue(6));
        } else {
          infowindow.setContent(address + "<br>coordinates: " + marker.getPosition().toUrlValue(6));
        }
        infowindow.open(map, marker);
      });
      google.maps.event.trigger(marker, 'click');
    } else {
      alert('Geocode was not successful for the following reason: ' + status);
    }
  });
}
 
</script>
<script type="text/javascript">
     $(document).ready(function(){  

        setTimeout(function () { 
            $("#search_country").trigger("change"); 

            setTimeout(function () { $("#search_state").val('<?=set_value('stateId')?>'); }, 700);

            /// get state
            setTimeout(function () {                 
                $("#search_state").trigger("change"); 
                setTimeout(function () { $("#search_city").val('<?=set_value('cityId')?>'); }, 700); 
                // get city
                setTimeout(function () { 
                    $("#search_city").trigger("change"); 
                    setTimeout(function () { $("#search_area").val('<?=set_value('areaId')?>'); }, 700);                
                }, 1000);

            }, 800);

        }, 500);      
        // add address form
        $('#addAddressForm').validate({
            rules:{
                address1:"required",
                address2:"required",
                address_type:"required",
                countryId:"required",
                stateId:"required",
                cityId:"required",
                areaId:"required",
                pincode:"required",
            },
            messages:{
                address1:"Please Fill this Field",
                address2:"Please Fill this Field",
                address_type:"Please Select this Field",
                countryId:"Please Select this Field",
                stateId:"Please Select this Field",
                cityId:"Please Select this Field",
                areaId:"Please Select this Field",
                pincode:"Please Fill this Field",
            }
        });

        $('body').on('click','.save_user_address',function(){
            if($('#addAddressForm').valid()){
             $('#addAddressForm').submit();
            }
        });
    });    
</script>