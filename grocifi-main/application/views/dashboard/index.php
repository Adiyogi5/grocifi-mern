<?php $model = $this->session->userdata('model'); ?>
  <!-- Content Wrapper. Contains page content -->
  <div class="content-wrapper">
    <!-- Content Header (Page header) -->
    <div class="content-header">
      <div class="container-fluid">
        <div class="row mb-2">
          <div class="col-sm-6">
            <h1 class="m-0 text-dark">Dashboard</h1>
          </div><!-- /.col -->
          <div class="col-sm-6">
            <ol class="breadcrumb float-sm-right">
              <li class="breadcrumb-item"><a href="#">Home</a></li>
              <li class="breadcrumb-item active">Dashboard</li>
            </ol>
          </div><!-- /.col -->
        </div><!-- /.row -->
      </div><!-- /.container-fluid -->
    </div>
     
    <?php if($this->session->userdata('role_type')!='2' || (isset($this->general_user_premissions['dashboard']['is_view']) && $this->general_user_premissions['dashboard']['is_view']==1)){ ?> 
     <section class="content">
      <div class="container-fluid"> 
        <div class="col-md-12">
          <div class="card">
            <div class="card-header">
            <div class="d-inline-block">
              <h5 class="card-title">Over All Report</h5>
            </div>
            <div class="d-inline-block float-right" style="width: 300px;">
              <div class="row" style="margin: 0px 8px;">
                <div class="col-sm-6" style="padding: 0px;"><label for="title" class="control-label" style="margin-top: 5px;">Selected Franchise </label></div>
                <div class="col-sm-6" style="padding: 0px;">
                  <select name="main_franchise_id" class="form-control" id="main_franchise_id" > 
                    <?php foreach ($franchise as $key => $value) { ?>
                      <option <?php if($this->session->userdata('main_franchise_id') ==$value['_id']){ echo "selected='selected'"; }  ?> value="<?=$value['_id']?>"><?=$value['firmname']?></option>
                    <?php } ?>
                  </select>
                </div>
              </div>
            </div>
            </div>
            <div class="card-body">
              <div class="row">
                <div class="col-12 col-sm-12 col-md-12">
                  <?php echo form_open(base_url($model.'/dashboard/getorderdata'), 'class="form-horizontal", id="dashboardForm"');  ?> 
                    <div class="form-group row">                
                      <div class="col-sm-4">
                        <label for="fromDate" class="col-sm-12 control-label">From Date <span class="red">*</span></label>
                        <input type="date" name="fromdate" class="form-control" id="fromdate" placeholder="" value="<?= $fromdate; ?>">
                      </div>
                      <div class="col-sm-4">
                      <label for="todate" class="col-sm-12 control-label">To Date<span class="red">*</span></label>  
                        <input type="date" name="todate" class="form-control" id="todate" placeholder="" value="<?= $todate; ?>">
                      </div>
                      <div class="col-sm-4">
                        <label class="col-sm-12 control-label">&nbsp;</label> 
                        <input type="button" name="findOrder" id="findOrder" value="Find Order" class="btn btn-info ">
                      </div>
                    </div> 
                  <?php echo form_close( ); ?>
                </div>
                <div class="col-12 col-sm-6 col-md-3">
                  <div class="info-box">
                    <span class="info-box-icon bg-info elevation-1"><i class="fa fa-shopping-cart"></i></span>
                    <div class="info-box-content">
                      <span class="info-box-text">Total Orders</span>
                      <span class="info-box-number"><span class="total_order"><?=!empty($orderdetail['total_order'])?$orderdetail['total_order']:0?></span></span>
                    </div> 
                  </div> 
                </div>
                <!-- /.col -->
                <div class="col-12 col-sm-6 col-md-3">
                  <div class="info-box mb-3">
                    <span class="info-box-icon bg-danger elevation-1"><i class="fa fa-calendar"></i></span>
                    <div class="info-box-content">
                      <span class="info-box-text">Total Days</span>
                      <span class="info-box-number"> <span class="total_days"><?=!empty($orderdetail['total_days'])?$orderdetail['total_days']:0?></span></span>
                    </div> 
                  </div> 
                </div>
                <!-- /.col --> 
                <div class="clearfix hidden-md-up"></div> 
                <div class="col-12 col-sm-6 col-md-3">
                  <div class="info-box mb-3">
                    <span class="info-box-icon bg-success elevation-1"><i class="fa fa-money"></i></span>

                    <div class="info-box-content">
                      <span class="info-box-text">Total Amount</span>
                      <span class="info-box-number"> <?=$this->general_settings['currency']; ?> <span class="total_amount"><?=!empty($orderdetail['total_amount'])?$orderdetail['total_amount']:0?></span></span>
                    </div> 
                  </div> 
                </div>
                <!-- /.col -->
                <div class="col-12 col-sm-6 col-md-3">
                  <div class="info-box mb-3">
                    <span class="info-box-icon bg-warning elevation-1"><i class="fa fa-shopping-cart"></i></span>

                    <div class="info-box-content">
                      <span class="info-box-text">Average orders</span>
                      <span class="info-box-number"> <span class="avg_order"><?=!empty($orderdetail['avg_order'])?$orderdetail['avg_order']:0?></span></span>
                    </div> 
                  </div> 
                </div>
                 <!-- /.col -->
                <div class="col-12 col-sm-6 col-md-3">
                  <div class="info-box mb-3">
                    <span class="info-box-icon bg-warning elevation-1"><i class="fa fa-money"></i></span>
                    <div class="info-box-content">
                      <span class="info-box-text">Average Amount</span>
                      <span class="info-box-number"><?=$this->general_settings['currency']; ?> <span class="avg_amount"><?=!empty($orderdetail['avg_amount'])?$orderdetail['avg_amount']:0?></span></span>
                    </div> 
                  </div> 
                </div>
                 <!-- /.col -->
              </div>
            </div>
          </div>
        </div>
        <?php if(!empty($latestcustomer)){ ?>
        <div class="col-md-12">
          <div class="card">
            <div class="card-header">
              <h5 class="card-title">Over All Statics</h5>
            </div>
            <div class="card-body">
              <div class="row">
                <div class="col-12 col-sm-6 col-md-6">
                  <div class="statics-info-box col-md-12">
                    <p class="text-left">
                      <i class="fa fa-users"></i> &nbsp; <strong>Statics Of Customers</strong>
                    </p>

                    <div class="progress-group">
                      Total Customer
                      <span class="float-right"><b><?=$latestcustomer['total_customer']?></b></span>
                      <div class="progress progress-sm">
                        <div class="progress-bar bg-success" style="width: 80%"></div>
                      </div>
                    </div>
                    <div class="progress-group">
                      Last Week's Customers
                      <span class="float-right"><b><?=$latestcustomer['last_week_customer']?></b></span>
                      <div class="progress progress-sm">
                        <div class="progress-bar bg-primary" style="width: 80%"></div>
                      </div>
                    </div>
                    <div class="progress-group">
                      Today's Customers
                      <span class="float-right"><b><?=$latestcustomer['today_customer']?></b></span>
                      <div class="progress progress-sm">
                        <div class="progress-bar bg-danger" style="width: 80%"></div>
                      </div>
                    </div>

                  </div>
                </div>
                <div class="col-12 col-sm-6 col-md-6">
                  <div class="statics-info-box col-md-12">
                    <p class="text-left">
                      <i class="fa fa-shopping-cart"></i> &nbsp; <strong>Statics Of Orders</strong>
                    </p>

                    <div class="progress-group">
                      Total Orders
                      <span class="float-right"><b><?=!empty($latestorder['total_order'])?$latestorder['total_order']:0?></b></span>
                      <div class="progress progress-sm">
                        <div class="progress-bar bg-success" style="width: 80%"></div>
                      </div>
                    </div>
                    <div class="progress-group">
                      Last Week's Orders
                      <span class="float-right"><b><?=!empty($latestorder['last_week_orders'])?$latestorder['last_week_orders']:0?></b></span>
                      <div class="progress progress-sm">
                        <div class="progress-bar bg-primary" style="width: 80%"></div>
                      </div>
                    </div>
                    <div class="progress-group">
                      Today's Orders
                      <span class="float-right"><b><?=!empty($latestorder['today_orders'])?$latestorder['today_orders']:0?></b></span>
                      <div class="progress progress-sm">
                        <div class="progress-bar bg-danger" style="width: 80%"></div>
                      </div>
                    </div>

                  </div>
                </div> 
              </div>
            </div>
          </div>
        </div>
        <?php } ?>
        <div class="col-md-12">
          <div class="card">
            <div class="card-header">
              <h5 class="card-title">Other Details</h5>
            </div>
            <div class="card-body">
              <div class="row">
              <?php if(!empty($productcount)){ ?>  
                <div class="col-12 col-sm-6 col-md-4">
                  <div class="statics-info-box col-md-12">
                    <p class="text-left">
                      <i class="fa fa-gear"></i> &nbsp; <strong>Statics Of Category</strong>
                    </p>
                    <div class="row" style="height:450px; overflow-x: auto;">
                      <table style="border-collapse: collapse; width: 96%; margin-left:5px;">
                        <thead>
                          <tr>
                            <th style="padding:5px 0px; vertical-align: top; border-top: 1px solid #dee2e6;" style="width: 90%">Category</th>
                            <th style="padding:5px 0px; vertical-align: top; border-top: 1px solid #dee2e6;" style="width: 10%" class="text-right">No. of Product</th>
                          </tr>
                        </thead>
                        <tbody>
                        <?php foreach ($productcount as $pkey => $pvalue) { ?>
                          <tr>
                            <td style="padding:5px 0px; vertical-align: top; border-top: 1px solid #dee2e6;"><?=$pvalue['title']?></td> 
                            <td style="padding:5px 0px; vertical-align: top; border-top: 1px solid #dee2e6;" class="text-right"><?=$pvalue['products']?></td>
                          </tr>
                        <?php } ?>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              <?php } ?>
              <?php if(!empty($salegraphsucess)){ ?> 
                <div class="col-12 col-sm-6 col-md-8">
                  <div class="statics-info-box col-md-12">
                    <div class="card-header no-border">
                      <div class="d-flex justify-content-between">
                        <h3 class="card-title">Sales Graph</h3> 
                      </div>
                    </div>
                    <div class="position-relative mb-4">
                      <canvas id="barChart" height="200"></canvas>
                    </div>
                  </div>
                </div>
              <?php } ?>  
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
    <?php } ?>
  </div> 
<!-- ChartJS 1.0.1 -->
<script src="<?= base_url()?>assets/plugins/chartjs-old/Chart.min.js"></script>

<!-- page script -->
<script>
  $(function () { 
    var salegraphsucess = '<?php echo $salegraphsucess ?>'; 

    $("body").on("change","#main_franchise_id",function(){
      $.post('<?=base_url($model."/dashboard/change_franchise")?>',
      {
        '<?php echo $this->security->get_csrf_token_name(); ?>' : '<?php echo $this->security->get_csrf_hash(); ?>', 
        franchise_id: $('#main_franchise_id').val()
      },
      function(response){
        window.location.reload();
      });
    });
    $("body").on("click","#findOrder",function(){
      var url = $('#dashboardForm').attr('action');  
      $.post(url,
      {
        '<?php echo $this->security->get_csrf_token_name(); ?>' : '<?php echo $this->security->get_csrf_hash(); ?>',
        fromdate : $('#dashboardForm #fromdate').val(),
        todate :  $('#dashboardForm #todate').val(),
        franchise_id: $('#main_franchise_id').val()
      },
      function(response){
        var data = JSON.parse(response);
        if(data.sucess==200){
          $('.total_order').html(data.data.total_order);
          $('.total_days').html(data.data.total_days);
          $('.avg_order').html(data.data.avg_order);
          $('.total_amount').html(data.data.total_amount);
          $('.avg_amount').html(data.data.avg_amount);
          $.notify("Record Fetch Successfully", "success");
        }else{
          $.notify(data.msg, "error");
        }
      });
    });

    var areaChartData = {
      labels  : [<?php echo $salelabels; ?>],
      datasets: [
        {
          label               : 'Sale',
          fillColor           : 'rgba(210, 214, 222, 1)',
          strokeColor         : 'rgba(210, 214, 222, 1)',
          pointColor          : 'rgba(210, 214, 222, 1)',
          pointStrokeColor    : '#c1c7d1',
          pointHighlightFill  : '#fff',
          pointHighlightStroke: 'rgba(220,220,220,1)',
          data                : [<?php echo $saleamt; ?>]
        }
      ]
    }
    //-------------
    //- BAR CHART -
    //-------------
    var barChartCanvas                   = $('#barChart').get(0).getContext('2d')
    var barChart                         = new Chart(barChartCanvas)
    var barChartData                     = areaChartData
    barChartData.datasets[0].fillColor   = '#00a65a'
    barChartData.datasets[0].strokeColor = '#00a65a'
    barChartData.datasets[0].pointColor  = '#00a65a'
    var barChartOptions                  = {
      //Boolean - Whether the scale should start at zero, or an order of magnitude down from the lowest value
      scaleBeginAtZero        : true,
      //Boolean - Whether grid lines are shown across the chart
      scaleShowGridLines      : true,
      //String - Colour of the grid lines
      scaleGridLineColor      : 'rgba(0,0,0,.05)',
      //Number - Width of the grid lines
      scaleGridLineWidth      : 1,
      //Boolean - Whether to show horizontal lines (except X axis)
      scaleShowHorizontalLines: true,
      //Boolean - Whether to show vertical lines (except Y axis)
      scaleShowVerticalLines  : true,
      //Boolean - If there is a stroke on each bar
      barShowStroke           : true,
      //Number - Pixel width of the bar stroke
      barStrokeWidth          : 2,
      //Number - Spacing between each of the X value sets
      barValueSpacing         : 5,
      //Number - Spacing between data sets within X values
      barDatasetSpacing       : 1,
      //String - A legend template
      legendTemplate          : '<ul class="<%=name.toLowerCase()%>-legend"><% for (var i=0; i<datasets.length; i++){%><li><span style="background-color:<%=datasets[i].fillColor%>"></span><%if(datasets[i].label){%><%=datasets[i].label%><%}%></li><%}%></ul>',
      //Boolean - whether to make the chart responsive
      responsive              : true,
      maintainAspectRatio     : true
    }
    barChartOptions.datasetFill = false
    barChart.Bar(barChartData, barChartOptions)

  });
</script>