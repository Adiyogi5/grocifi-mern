/*
Template Name: Groci - Organic Food & Grocery Market Template
Author: Askbootstrap
Author URI: https://themeforest.net/user/askbootstrap
Version: 1.1
*/
$(document).ready(function () {
    "use strict";

    // ===========Featured Owl Carousel============
    var objowlcarousel = $(".owl-carousel-featured");
    if (objowlcarousel.length > 0) {
        objowlcarousel.owlCarousel({
            responsive: {
                0: {
                    items: 2,
                },
                600: {
                    items: 2,
                    nav: false
                },
                1000: {
                    items: 4,
                },
                1200: {
                    items: 4,
                },
            },
            lazyLoad: true,
            pagination: false,
            loop: true,
            dots: false,
            autoPlay: false,
            navigation: true,
            stopOnHover: true,
            nav: true,
            navigationText: ["<i class='mdi mdi-chevron-left'></i>", "<i class='mdi mdi-chevron-right'></i>"]
        });
    }

    // ===========Category Owl Carousel============
    var objowlcarousel = $(".owl-carousel-category");
    if (objowlcarousel.length > 0) {
        objowlcarousel.owlCarousel({
            responsive: {
                0: {
                    items: 1,
                    margin: 10,
                },
                600: {
                    items: 2,
                    margin: 10,
                    nav: false
                },
                1000: {
                    items: 3,
                },
                1200: {
                    items: 3,
                },
            },
            items: 4,
            lazyLoad: true,
            pagination: false,
            loop: true,
            dots: false,
            autoPlay: 2000,
            navigation: true,
            stopOnHover: true,
            nav: true,
            navigationText: ["<i class='mdi mdi-chevron-left'></i>", "<i class='mdi mdi-chevron-right'></i>"]
        });
    }

    var objowlcarousel = $(".home-medical-carousel");
    if (objowlcarousel.length > 0) {
        objowlcarousel.owlCarousel({
            responsive: {
                0: {
                    items: 1,
                    margin: 10,
                },
                600: {
                    items: 2,
                    margin: 10,
                    nav: false
                },
                1000: {
                    items: 3,
                },
                1200: {
                    items: 3,
                },
            },
            items: 4,
            lazyLoad: true,
            pagination: false,
            loop: true,
            dots: false,
            autoPlay: 2000,
            navigation: true,
            stopOnHover: true,
            nav: true,
            navigationText: ["<i class='mdi mdi-chevron-left'></i>", "<i class='mdi mdi-chevron-right'></i>"]
        });
    }

    var objowlcarousel = $(".vcc_vegetable-carousel");
    if (objowlcarousel.length > 0) {
        objowlcarousel.owlCarousel({
            responsive: {
                0: {
                    items: 1,
                    margin: 10,
                },
                600: {
                    items: 2,
                    margin: 10,
                    nav: false
                },
                1000: {
                    items: 3,
                },
                1200: {
                    items: 3,
                },
            },
            items: 4,
            lazyLoad: true,
            pagination: false,
            loop: true,
            dots: false,
            autoPlay: 2000,
            navigation: true,
            stopOnHover: true,
            nav: true,
            navigationText: ["<i class='mdi mdi-chevron-left'></i>", "<i class='mdi mdi-chevron-right'></i>"]
        });
    }

    // ===========Right Sidebar============
    $('[data-toggle="offcanvas"]').on('click', function () {
        $('body').toggleClass('toggled');
    });

    // ===========Slider============
    var mainslider = $(".owl-carousel-slider");
    if (mainslider.length > 0) {
        mainslider.owlCarousel({
            items: 1,
            dots: false,
            lazyLoad: true,
            pagination: true,
            autoPlay: 4000,
            loop: true,
            singleItem: true,
            navigation: true,
            stopOnHover: true,
            nav: true,
            navigationText: ["<i class='mdi mdi-chevron-left'></i>", "<i class='mdi mdi-chevron-right'></i>"]
        });
    }

    // ===========Select2============
    //$('select').select2();

    // ===========Tooltip============
    $('[data-toggle="tooltip"]').tooltip()

    // ===========Single Items Slider============   
    var sync1 = $("#sync1");
    var sync2 = $("#sync2");
    sync1.owlCarousel({
        singleItem: true,
        items: 1,
        slideSpeed: 1000,
        pagination: false,
        navigation: true,
        autoPlay: 2500,
        dots: false,
        nav: true,
        navigationText: ["<i class='mdi mdi-chevron-left'></i>", "<i class='mdi mdi-chevron-right'></i>"],
        afterAction: syncPosition,
        responsiveRefreshRate: 200,
    });
    sync2.owlCarousel({
        items: 5,
        navigation: true,
        dots: false,
        pagination: false,
        nav: true,
        navigationText: ["<i class='mdi mdi-chevron-left'></i>", "<i class='mdi mdi-chevron-right'></i>"],
        responsiveRefreshRate: 100,
        afterInit: function (el) {
            el.find(".owl-item").eq(0).addClass("synced");
        }
    });

    function syncPosition(el) {
        var current = this.currentItem;
        $("#sync2")
            .find(".owl-item")
            .removeClass("synced")
            .eq(current)
            .addClass("synced")
        if ($("#sync2").data("owlCarousel") !== undefined) {
            center(current)
        }
    }
    $("#sync2").on("click", ".owl-item", function (e) {
        e.preventDefault();
        var number = $(this).data("owlItem");
        sync1.trigger("owl.goTo", number);
    });

    function center(number) {
        var sync2visible = sync2.data("owlCarousel").owl.visibleItems;
        var num = number;
        var found = false;
        for (var i in sync2visible) {
            if (num === sync2visible[i]) {
                var found = true;
            }
        }
        if (found === false) {
            if (num > sync2visible[sync2visible.length - 1]) {
                sync2.trigger("owl.goTo", num - sync2visible.length + 2)
            } else {
                if (num - 1 === -1) {
                    num = 0;
                }
                sync2.trigger("owl.goTo", num);
            }
        } else if (num === sync2visible[sync2visible.length - 1]) {
            sync2.trigger("owl.goTo", sync2visible[1])
        } else if (num === sync2visible[0]) {
            sync2.trigger("owl.goTo", num - 1)
        }
    }

});