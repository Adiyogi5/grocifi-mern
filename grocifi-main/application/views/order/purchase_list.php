<?php $model = $this->session->userdata('model'); ?>
<!-- Content Wrapper. Contains page content -->
<div class="content-wrapper">
    <section class="content">
        <!-- For Messages -->
        <?php $this->load->view('includes/_messages.php'); ?>
        <div class="card">
            <div class="card-header">
                <div class="d-inline-block" style="border-bottom: 1px solid #ddd;  width: 100%;  margin-bottom: 10px;">
                    <h3 class="card-title" style="width: 95%; float: left;"><i class="fa fa-list"></i>&nbsp; Purchase List </h3>
                </div> 
                <div class="row col-sm-12"> 
                    <div class="col-sm-2">
                        <label for="fromDate">Delivery Date From:</label>
                        <input type="date" class="form-control" value="<?php echo $start_date; ?>" id="fromDate" placeholder="Enter order date">
                    </div>
                    <div class="col-sm-2">
                        <label for="todate">Delivery Date To:</label>
                        <input type="date" class="form-control" value="<?php echo $end_date; ?>" id="todate" placeholder="Enter order date">
                    </div>

                    <div class="col-sm-3">
                        <label for="search_franchise_id">Franchise</label>
                        <select name="search_franchise_id" class="form-control" id="search_franchise_id" > 
                        <?php foreach ($franchise as $key => $value) { ?>
                          <option <?php if($franchise_id==$value['_id']){ echo 'selected'; } ?> value="<?=$value['_id']?>"><?=$value['firmname']?></option>
                        <?php } ?>
                        </select>
                    </div>  

                    <div class="col-sm-3">
                        <label for="search_category_id">Categories</label>
                        <select name="search_category_id" class="form-control" id="search_category_id" > 
                        <option value="" <?php if($category_id==''){ echo 'selected'; } ?> > All </option>
                        <?php foreach ($category as $key => $value) { ?>
                          <option <?php if($category_id==$value['_id']){ echo 'selected'; } ?> value="<?=$value['_id']?>"><?=$value['title']?></option>
                        <?php } ?>
                        </select>
                    </div> 

                    <?php if($this->general_settings['is_wholesaler']==1){ ?>
                    <div class="col-sm-2">
                        <label for="search_is_wholesaler">Purchase Type</label>
                        <select name="search_is_wholesaler" class="form-control" id="search_is_wholesaler" >  
                          <option value="0">All</option>   
                          <option value="1" <?php echo ($is_wholesaler=='1')?"Selected":"" ?>>Customers</option> 
                          <option value="2" <?php echo ($is_wholesaler=='2')?"Selected":"" ?>>Wholesaler</option> 
                        </select>
                    </div>
                    <?php } ?>

                    <div class="col-sm-12 textAligh-right" style="margin-top: 35px;"> 
                        <button title="Today Order" id="today-order" class="btn btn-info btn-sm float-right" style="margin-left:10px;"><i aria-hidden="true" class="fa fa-search"></i> Today Order</button> 
                        
                        <button title="Search" id="today-order-filter" class="btn btn-success btn-sm float-right" style="margin-left:10px;"><i aria-hidden="true" class="fa fa-search"></i> Search</button>
                    </div>
                </div>
            </div>
        </div>

        <div class="card">
            <div class="row p-3">
                <div id="date-title" class="col-sm-12" style="text-align: center;font-weight: 800;">
                    Delivery Date : <?php echo date("d M Y", strtotime($start_date)) . " - " . date("d M Y", strtotime($end_date)); ?>
                </div>
                <div class="card-body table-responsive p-0 table-div">
                    <table class="table table-head-fixed text-nowrap">
                        <thead>
                            <tr>
                                <th width="5%" scope="col">#</th>
                                <th width="30%" scope="col">Product Name</th>
                                <th width="10%" scope="col">No. of Order</th>
                                <th width="15%" scope="col">Quantity / Unit</th>
                                <th width="40%" scope="col"></th>
                            </tr>
                        </thead>

                        <tbody>
                            <?php $i = 1;
                            if (count($today_order)) {
                                foreach ($today_order as $val) { ?>
                                    <tr>
                                        <th align="right" scope="row"><?php echo $i++; ?>.</th>
                                        <td><?php echo $val["title"]; ?></td>
                                        <td align="center"><?php echo $val["qty"]; ?></td>
                                        <td><?php echo $val["munit"]; ?>&nbsp;&nbsp;<?php echo $units[$val["unit"]]; ?></td>
                                        <td></td>
                                    </tr>
                            <?php }
                            } else {
                                echo '<tr>
                                <td align="center" colspan="5">There is no product(s) to purchase.</td>
                            </tr>';
                            } ?>
                        </tbody>
                    </table>
                </div>
                <div class="col-sm-12 padding-10">
                <?php if (count($today_order)) { ?>
                    <button id="print-list-btn" class="btn btn-outline-primary btn-sm float-right"><i aria-hidden="true" class="fa fa-print"></i> Print</button><?php } ?>

                </div>
            </div>
        </div>
    </section>
</div>
<script>
    $(document).ready(function() {
        $("#print-list-btn").click(function(e) {
            $('#print-list-btn').hide();
            $("#today-order-filter").hide();
            $("#today-order").hide();
            window.print();
            setTimeout(() => {
                $('#print-list-btn').show();
                $("#today-order-filter").show();
                $("#today-order").show();
            }, 100);
        });
        $("#today-order-filter").click(function(e) {
            $("#date-title").html("Delivery Date : " + $("#fromDate").val() + "  -  " + $("#todate").val());
            window.location.href = "<?php echo base_url().$model; ?>/order/purchase_list?fromDate=" + $("#fromDate").val() + "&todate=" + $("#todate").val()+"&franchise_id=" + $("#search_franchise_id").val()+"&is_wholesaler=" + $("#search_is_wholesaler").val()+"&category_id=" + $("#search_category_id").val();
        });

        $("#today-order").click(function(e) {
            window.location.href = "<?php echo base_url().$model; ?>/order/purchase_list";
        });
    });
</script>