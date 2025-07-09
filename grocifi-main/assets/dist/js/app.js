(function($) {
    var adityom = window.adityom || {};
    window.adityom = adityom;
    $(document).ready(function() {
        setTimeout(() => {
            $("select").addClass("form-control custom-select form-control-border");
        }, 1000);
    });

    setTimeout(function() {
	    $('.alert').fadeOut('slow');
	}, 5000);

})(window.jQuery);