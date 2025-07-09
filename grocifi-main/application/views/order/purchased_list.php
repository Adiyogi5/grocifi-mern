<?php $model = $this->session->userdata('model'); ?>
<!-- Content Wrapper. Contains page content -->
<div class="content-wrapper">
    <section class="content">
        <!-- For Messages -->
        <?php $this->load->view('includes/_messages.php'); ?>
        <div class="card">
            <div class="card-header">
                <div class="d-inline-block" style="border-bottom: 1px solid #ddd;  width: 100%;  margin-bottom: 10px;">
                    <h3 class="card-title" style="width: 95%; float: left;"><i class="fa fa-list"></i>&nbsp; Purchased List </h3>
                </div>
                <div class="row col-sm-12">
                    <div class="col-sm-3">
                        <label for="date-of-purchase">Date of Purchase:</label>
                        <input type="date" class="form-control" value="<?php echo $today; ?>" id="date-of-purchase">
                    </div>
                    <div class="col-sm-3">
                        <label for="search_franchise_id">Franchise</label>
                        <select name="search_franchise_id" class="form-control" id="search_franchise_id" > 
                        <?php foreach ($franchise as $key => $value) { ?>
                          <option <?php if($franchise_id==$value['_id']){ echo 'selected'; } ?> value="<?=$value['_id']?>"><?=$value['firmname']?></option>
                        <?php } ?>
                        </select>
                    </div> 
                    <div class="col-sm-3 textAligh-right" style="margin-top:35px;">
                        <button title="Search" id="btn-date-of-purchase" class="btn btn-success btn-sm float-right" style="margin-left:10px;"><i aria-hidden="true" class="fa fa-search"></i> Search</button>
                    </div>
                </div>
            </div>
        </div>

        <div class="card">
            <div class="row p-3">
                <div class="card-body table-responsive p-0 table-div">
                    <table class="table table-head-fixed text-nowrap">
                        <thead>
                            <tr>
                                <th width="5%" scope="col">#</th>
                                <th width="20%" scope="col">Product Name</th>
                                <th width="15%" scope="col">Firm Name</th>
                                <th width="10%" scope="col">Price</th>
                                <th width="12%" scope="col">Stock</th>
                                <th width="8%" scope="col">Total Price	</th>
                                <th width="18%" scope="col">Manager</th>
                                <th width="12%" scope="col">Date</th>
                            </tr>
                        </thead>

                        <tbody>
                            <?php $i = 1;
                            if (count($list)) {
                                foreach ($list as $val) { ?>
                                    <tr>
                                        <th align="right" scope="row"><?php echo $i++; ?>.</th>
                                        <td><?php echo $val["title"]; ?></td>
                                        <td><?php echo $val["firm_name"]; ?></td>
                                        <td><?php echo number_format($val["price"],2); ?></td>
                                        <td>
                                        <?php echo $val["stock"]["quantity_1"]." ".@$units[$val["stock"]["unit_1"]]; ?><br/>
                                        <?php echo $val["stock"]["quantity_2"]." ".@$units[$val["stock"]["unit_2"]]; ?>
                                        </td>
                                        <td><?php echo number_format($val["total_price"], 2); ?></td>
                                        <td>
                                            <?php echo (!empty($val["pm_id"]))?$staff[$val["pm_id"]]:"-"; ?><br/>
                                            <?php echo (!empty($val["sm_id"]))?$staff[$val["sm_id"]]:"-"; ?><br/>
                                        </td>
                                        <td><?php echo date("d M Y", strtotime($val["created"])); ?></td>
                                    </tr>
                            <?php }
                            } else {
                                echo '<tr>
                                <td align="center" colspan="8">There is no purchased product(s).</td>
                            </tr>';
                            } ?>
                        </tbody>
                    </table>
                </div>
                <div class="col-sm-12 padding-10">
                <?php if (count($list)) { ?>
                <button id="print-list-btn" class="btn btn-outline-primary btn-sm float-right"><i aria-hidden="true" class="fa fa-print"></i> Print</button>
                <?php } ?>

                </div>
            </div>
        </div>
    </section>
</div>
<script>
    $(document).ready(function() {

        $("#print-list-btn").click(function(e) {
            $('#print-list-btn').hide();
            $("#btn-date-of-purchase").hide();
            window.print();
            setTimeout(() => {
                $('#print-list-btn').show();
                $("#btn-date-of-purchase").show();
            }, 100);
        });
        
        $("#btn-date-of-purchase").click(function(e) {
            window.location.href = "<?php echo base_url().$model; ?>/order/purchased_list?today="+$("#date-of-purchase").val()+"&franchise_id=" + $("#search_franchise_id").val();
        });
    });
</script>