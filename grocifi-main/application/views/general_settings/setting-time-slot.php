<!-- Content Wrapper. Contains page content -->
<?php $model = $this->session->userdata('model'); ?>
<div class="content-wrapper">
 
    <!-- Main content -->
    <section class="content">
        <div class="card card-default color-palette-bo">
            <div class="card-header">
              <div class="d-inline-block">
                  <h3 class="card-title"> <i class="fa fa-pencil"></i>
                  Setting Delivery Slot </h3>
              </div>
            </div>
            <div class="card-body">   
                 <!-- For Messages -->
                <?php $this->load->view('includes/_messages.php') ?>

                <?php echo form_open(base_url(MODEL.'/settings/setting_delivery_slot'), 'class="form-horizontal" id="dtForm"'); ?>	
                <div class="form-group">
                    <div class="statics-info-box col-md-12">
                    <p class="text-left">
                      <i class="fa fa-file"></i> &nbsp; <strong> <span style="color: red;">Note:</span> Few instruction for setting the delivery limit of per day orders.</strong>
                    </p>
                   <p class="text-left">
                    <ol style="line-height: 28px; font-size: 14px;">
                      <li> Set value '0' (Zero), If you don't want to set any limit for that time slot (that means Unlimited Orders).</li>
                      <li>Set a negetive number like '-1', If you don't want any order for that time slot.</li>
                      <li>Set any positive number like 1, 2 or 3..., For a limit of delivery order for that time slot.</li>
                    </ol>
                    </p>
                    </div>  
                </div> 
                <div class="form-group row">
                    <div class="col-sm-4">
                      <label class="control-label" for="start_time">Start Time </label>
                      <input type="time" class="form-control" name="start_time" id="start_time" placeholder="Enter Start Time" value="<?=set_value('start_time')?>"> 
                      <span id="startError"></span>
                    </div>
                    <div class="col-sm-4">
                      <label class="control-label" for="end_time">End Time </label>
                      <input type="time" class="form-control" name="end_time" id="end_time" placeholder="Enter End Time" value="<?=set_value('end_time')?>"> 
                      <span id="endError"></span>
                    </div>
                    <div class="col-md-4 d-flex align-items-end">
                        <button id="addTimeSlot" type="button" class="btn btn-dark">Add Timeslot</button>
                    </div>
                </div> 
                 <div class="form-group row">
                    <div class="col-sm-5">
                      <label class="control-label" for="end_time">Franchise </label>
                      <select class="form-select" name="franchiseId" id="franchiseId" onchange="getDeliverySlot(this.value)">
                        <option value=""> Select Franchise </option> 
                        <?php foreach ($franchise as $key => $value) { ?>
                          <option value="<?=$value['_id']?>" <?= ($value['_id'] == MAINFRANCHISE )?"selected":"";?> ><?=$value['firmname']?></option>
                       <?php }?>

                      </select>
                      <span id="franchiseError"></span>
                    </div>
                </div> 
                <div class="form-group row" id="timeSlotsContainer">
               
                </div>
                <div class="box-footer"> 
                  <?php if($this->session->userdata('role_type')!='2' || (isset($this->general_user_premissions['delivery_time_slot']['is_edit']) && $this->general_user_premissions['delivery_time_slot']['is_edit']==1)){ ?>  
                    
                    <input type="submit" name="submit" value="Save Changes" class="btn btn-primary pull-right">
                  <?php } ?>
                </div>	
                <?php echo form_close(); ?>
            </div>
        </div>
    </section>
</div> 
<script type="text/javascript">
  var count = 0;
 $(document).ready(function(){   
    getDeliverySlot($('#franchiseId').val());
    sessionStorage.setItem("deliverySlot",[{'start_time':null, 'end_time':null}]);

    $('#addTimeSlot').click(function() {
      var startTime = $('#start_time').val();
      var endTime   = $('#end_time').val();
      var franchiseId   = $('#franchiseId').val();
      
      $("#startError").text('');
      $("#endError").text('');
      $("#franchiseError").text('');

      if(!startTime){
           $("#startError").text("Please Enter Start Time.").css("color", "red");
          return false;
      }

      if(!endTime){
           $("#endError").text("Please Enter End Time.").css("color", "red");
          return false;
      }
      if(!franchiseId){
           $("#franchiseError").text("Please Select Franchise id.").css("color", "red");
          return false;
      }

      if(startTime >= endTime){
         $("#endError").text("Please Enter End Time Greater Than Start Time.").css("color", "red");
          return false;
      }

      var deliverySlot = sessionStorage.getItem("deliverySlot");
      var timeSlotHtml = HtmlSlotAdd(startTime ,endTime);
    
      $('#timeSlotsContainer').append(timeSlotHtml);
    });

    $('#timeSlotsContainer').on('click', '.removeTimeSlot', function() {
        $(this).parent().remove()
    });

    $("#dtForm").validate({
        rules: {
            'timeslot[][value]':"required"
        },
        messages: {
           'timeslot[][value]':"Please Enter value"
        }
    });

    $("body").on("click", ".btn-submit", function(e){
        if ($("#dtForm").valid()){
            $("#dtForm").submit();
        }
    });
  });  

  function HtmlSlotAdd(startTime,endTime,timeslot=null){
      
      var timeSlotHtml = `
            <div class="col-sm-4" class="removeTimeSlot">
              <label class="control-label">${startTime}  - ${endTime} </label>
              <input type="hidden" name="timeslot[${count}][start_time]" value="${startTime}"/>
              <input type="hidden" name="timeslot[${count}][end_time]" value="${endTime}"/>`;
             
              if(timeslot){
                timeSlotHtml +=`<input type="hidden" name="timeslot[${count}][id]" value="${timeslot._id}"/>`; 
              }
                timeSlotHtml +=`<input type="text" class="form-control" name="timeslot[${count}][value]" placeholder="Enter order limit for ${startTime} - ${endTime} " value="${(timeslot)?timeslot.value:0} ">`;
              if(timeslot && timeslot.default != 1){
                timeSlotHtml +=`<a  href="javascript:void(0)"class="badge badge-dark badge-sm removeTimeSlot position-absolute" style="top:60%;right: 20px;"> X </a>`;
              }  
        timeSlotHtml +=`</div>`;

      count++;
      return timeSlotHtml;
  }

  function getDeliverySlot(id){
      count = 0;
      $.get('<?=base_url($model."/settings/get_franchise_timeslote")?>',
      {
        _id : id,
      },
      function(response){
        var data = JSON.parse(response);
        var timeSlotHtml = "";
        if(data.status == true){
           $.each(data.data, function( i, k ){
                 timeSlotHtml += HtmlSlotAdd(k.start_time ,k.end_time,k);
            });
        }
         
        $('#timeSlotsContainer').html(timeSlotHtml);
      
      });
    
  }
</script>   