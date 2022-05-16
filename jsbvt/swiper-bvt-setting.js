


var swiper1 = new Swiper(".normalBanner-swipe", {
    slidesPerView: '1',
    spaceBetween: 13,
    calculateHeight: true,
    autoplay: {
        delay: 3500,
        disableOnInteraction: false,
    },
    pagination: {
        el: ".normalBanner-swiper-pagination",
        clickable: true,
    },
});

var swiper2 = new Swiper(".squareBanner-swipe", {
    slidesPerView: '1',
    calculateHeight: true,
    autoplay: {
        delay: 5000,
        disableOnInteraction: false,
    },
});

var swiper3 = new Swiper(".best-swipe", {
    slidesPerView: 'auto',
    spaceBetween: 15,

});

var swiper4 = new Swiper(".listmain_swipe-swipe", {
    slidesPerView: 2,
    slidesPerColumn: 1,
    slidesPerGroup: 2,
    slidesPerColumnFill: 'row',
    pagination: {
        el: ".listmain_swipe-swiper-pagination",
        clickable: true,
    },
});

var swiper5 = new Swiper(".pollticle_listmain-swipe", {
    slidesPerView: 'auto',
    centeredSlides: true,
    spaceBetween: 30,
    pagination: {
        el: ".pollticle_listmain_swiper-pagination",
        clickable: true,
    },
});


var swiper_cat = new Swiper(".category-swipe", {
    slidesPerView: 'auto',
    spaceBetween: 8,
    autoHeight: true, //enable auto height

    pagination: {
        el: ".swiper-pagination",
        clickable: true,
        type: "progressbar",
    },
});

var swiper_order = new Swiper(".order-swipe", {
    slidesPerView: 'auto',
    spaceBetween: 5,

    pagination: {
        el: ".swiper-pagination",
        clickable: true,
        type: "progressbar",
    },
});


function setCurrentSlide(ele, index) {
    $(".swipertab .swiper-slide").removeClass("selected");
    ele.addClass("selected");
}

var swipertab = new Swiper('.swipertab', {
    slidesPerView: 2,
    paginationClickable: true,
    autoHeight: true, //enable auto height
    loop: false,
    onTab: function (swiper) {
        var n = swipertab.clickedIndex;
        alert(1);
    }
});

if(swipertab.slides !== undefined) {
    swipertab.slides.each(function (index, val) {
        var ele = $(this);
        ele.on("click", function () {
            setCurrentSlide(ele, index);
            swipercontent.slideTo(index, 500, false);
        });
    });
  }


var swipercontent = new Swiper('.swipercontent', {
    direction: 'horizontal',
    loop: false,
    autoHeight: true,
    observer: true,
    observeParents: true,
    onSlideChangeEnd: function (swiper) {
        var n = swiper.activeIndex;
        setCurrentSlide($(".swipertab .swiper-slide").eq(n), n);
        swipertab.slideTo(n, 500, false);
    },
    onClick: function (swiper) {
        swiper.update();
    }

});

var listmain_swipe2 = new Swiper(".listmain_swipe2-swipe", {
    slidesPerView: 2,
    slidesPerColumn: 2,
    slidesPerGroup: 2,
    pagination: {
        el: ".listmain_swipe2-swiper-pagination",
        clickable: true,
    },
});


var swiper_order = new Swiper(".add-order-swipe", {
    slidesPerView: 2,
    slidesPerColumn: 4,
    spaceBetween: 5,

    pagination: {
        el: ".swiper-pagination",
        clickable: true,
        type: "progressbar",
    },
});
