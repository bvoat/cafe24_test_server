refresh_discount();


//listnormal 더보기&할인율&할인가&무료배송 표시
function refresh_discount() {
    setTimeout(function () {
        $(".prdList").children("[id^='anchorBoxId_']").each(
            function () {
                if ($(this).children(".box-desc").children(".price1").text() !== "" && $(this).children(".discountPrd").length == 0) {
                    $(this).prepend(`<div class="discountPrd"></div>`)
                    var regex = /[^0-9]/g;				// 숫자가 아닌 문자열을 선택하는 정규식
                    var result = $(this).children(".box-desc").children(".price1").text().replace(regex, "");	// 원래 문자열에서 숫자가 아닌 모든 문자열을 빈 문자로 변경
                    var result2 = $(this).children(".box-desc").children(".price2").text().replace(regex, "");	// 원래 문자열에서 숫자가 아닌 모든 문자열을 빈 문자로 변경
                    $(this).children(".discountPrd").text(`${((1 - (result / result2)) * 100).toFixed(0)}%`);

                    var result = $(this).children(".box-desc").children(".price1").addClass("price");
                    var result = $(this).children(".box-desc").children(".price2").addClass("strikeprice");

                }
                else {
                    var result = $(this).children(".box-desc").children(".price2").addClass("price");

                }

                if ($(this).children(".box-desc").children(".delivery_price").text() == "무료" && $(this).children(".freedeliveryPrd").length == 0) {
                    $(this).prepend(`<div class="freedeliveryPrd"></div>`)
                    $(this).children(".freedeliveryPrd").text(`무료배송`);
                }

            })
    }, 1000)

}