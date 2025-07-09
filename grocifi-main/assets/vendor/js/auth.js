(function ($) {
    var adityom = window.adityom || {};
    window.lawDiary = adityom;
    $().ready(function () {
        var loginForm = false;
        var signupForm = false;

        let timerWait = 90;
        function timer(remaining) {
            var m = Math.floor(remaining / 60);
            var s = remaining % 60;
            m = m < 10 ? '0' + m : m;
            s = s < 10 ? '0' + s : s;
            document.getElementById('otp-timer').innerHTML = m + ':' + s;
            remaining -= 1;

            if (remaining >= 0 /* && timerOn */) {
                setTimeout(function () {
                    timer(remaining);
                }, 1000);
                return;
            }
            $("#resend-otp-btn").removeClass("hidden-div");
            $("#otp-btn").addClass("hidden-div");
        }

        $("#loginForm").each(function () {
            $("#login-btn").click(function () {
                var options = {
                    data: {},
                    dataType: 'JSON',
                    beforeSubmit: function (data) {
                        $("#login-txt > .err-msg").remove();

                        if ($("#phone-login").val().trim() == "") {
                            $("#phone-login").focus();
                            $("#phone-login").addClass("error-border");
                            $("#login-txt").append('<div class="err-msg">Please enter a valid mobile number.</div>');
                            loginForm = false;
                            return false;
                        } else {
                            $("#phone-login").removeClass("error-border");
                        }

                        if ($("#phone-login").val().trim().length != 10) {
                            $("#phone-login").focus();
                            $("#login-txt").append('<div class="err-msg">Please enter a valid mobile number.</div>');
                            loginForm = false;
                            return false;
                        }
                        return true;
                    },
                    type: 'post',
                    success: function (data) {
                        if (data.success == 200) {
                            $("#phone-otp").val($("#phone-login").val());
                            $("#otp-link").click();
                            timer(timerWait);
                        }

                        if (data.success == 404) {
                            $("#login-txt").append('<div class="err-msg">Mobile number not found.</div>');
                        }

                        if (data.success == 422) {
                            $("#login-txt").append('<div class="err-msg">' + data.msg + '</div>');
                        }
                        loginForm = false;
                    },
                    url: SITEPATH + "home/login",
                    error: function (xhr, ajaxOptions, thrownError) {
                        loginForm = false;
                    }
                };
                if (!loginForm) {
                    loginForm = true;
                    $("#loginForm").ajaxSubmit(options);
                }
            });
        });


        function combineFormData() {    
                var combinedData = {};              
                combinedData['fname'] = $('#reg-fname').val();
                combinedData['lname'] = $('#reg-lname').val();
                combinedData['friends_code'] = $('#friends_code').val(); 
                return combinedData;    
        }

        $("#varifyotpForm").each(function () {
            // $(window).keydown(function(event) {
            //     if (event.keyCode == 13) {
            //         event.preventDefault();
            //         $("#otp-btn").click();
            //         return false;
            //     }
            // });

            $("#otp-btn").click(function () {
                var options = {
                    data: combineFormData(),
                    dataType: 'JSON',
                    beforeSubmit: function (data) {
                        $("#otp-txt > .err-msg").remove();

                        if ($("#otp").val().trim() == "") {
                            $("#otp").focus();
                            $("#otp").addClass("error-border");
                            $("#otp-txt").append('<div class="err-msg">Please enter a valid otp number.</div>');
                            loginForm = false;
                            return false;
                        } else {
                            $("#otp").removeClass("error-border");
                        }
                        return true;
                    },
                    type: 'post',
                    success: function (data) {
                        if (data.success == 200) {
                            window.location.reload();
                        }

                        if (data.success == 204) {
                            $("#otp").addClass("error-border");
                            $("#otp-txt").append('<div class="err-msg">Please enter valid OTP.</div>');
                        }

                        if (data.success == 404) {
                            $("#login-txt").append('<div class="err-msg">Mobile number not found.</div>');
                        }
                        loginForm = false;
                    },
                    url: SITEPATH + "home/verifyotp",
                    error: function (xhr, ajaxOptions, thrownError) {
                        ///console.log(thrownError);
                        loginForm = false;
                    }
                };
                if (!loginForm) {
                    loginForm = true;
                    $("#varifyotpForm").ajaxSubmit(options);
                }
            });

            $("#resend-otp-btn").click(function () {
                $("#otp-btn").removeClass("hidden-div");
                $("#resend-otp-btn").addClass("hidden-div");
                if ($("#phone-login").val().trim() != "") {
                    $.ajax({
                        type: "POST",
                        dataType: "html",
                        url: SITEPATH + "home/resendotp",
                        data: { q: "resendotp", phone: $("#phone-login").val() },
                        success: function (data) {
                            timer(timerWait);
                        }
                    });
                }
            });
        });

        $("#reg-fname").keypress(function () {
            $("#signup-txt-fname > .err-msg").remove();
        });
        $("#phone-reg").keypress(function () {
            $("#signup-txt > .err-msg").remove();
        });

        $("#signupForm").each(function () {
            $("#signup-btn").click(function () {
                var options = {
                    data: {},
                    dataType: 'JSON',
                    beforeSubmit: function (data) {
                        $("#signup-txt > .err-msg").remove();
                        $("#signup-txt-fname > .err-msg").remove();
                        $("#signup-txt-lname > .err-msg").remove();

                        if ($("#reg-fname").val().trim() == "") {
                            $("#reg-fname").focus();
                            $("#reg-fname").addClass("error-border");
                            $("#signup-txt-fname").append('<div class="err-msg">Please enter first name.</div>');
                            signupForm = false;
                            return false;
                        } else {
                            $("#reg-fname").removeClass("error-border");
                        }

                        if ($("#phone-reg").val().trim() == "") {
                            $("#phone-reg").focus();
                            $("#phone-reg").addClass("error-border");
                            $("#signup-txt").append('<div class="err-msg">Please enter a valid mobile number.</div>');
                            signupForm = false;
                            return false;
                        } else {
                            $("#signup-txt").removeClass("error-border");
                        }

                        if ($("#phone-reg").val().trim().length != 10) {
                            $("#phone-reg").focus();
                            signupForm = false;
                            $("#signup-txt").append('<div class="err-msg">Please enter a valid mobile number.</div>');
                            return false;
                        }
                        return true;
                    },
                    type: 'post',
                    success: function (data) {
                        if (data.success == 200) {
                            $("#phone-otp").val($("#phone-reg").val());
                            $("#otp-link").click();
                            timer(timerWait);
                        }

                        if (data.success == 400) {
                            $("#signup-txt").append('<div class="err-msg">Mobile number already exists.</div>');
                        }
                        signupForm = false;
                    },
                    url: SITEPATH + "home/register",
                    error: function (xhr, ajaxOptions, thrownError) {
                        //console.log(thrownError);
                        signupForm = false;
                    }
                };
                if (!signupForm) {
                    signupForm = true;
                    $("#signupForm").ajaxSubmit(options);
                }
            });
        });
        
        $("#bd-example-modal").on('show.bs.modal', function () {
            $("#login-link").click();
            $("#phone-login").val('');
            $("#otp-btn").removeClass("hidden-div");

            $("#resend-otp-btn").addClass("hidden-div");
        });
    });
})(window.jQuery);