//할인율 표시 listmain
$(".prdList").children("[id^='anchorBoxId_']").each(
    
    function () {

        $(this).find(".box-desc").find(".price[class*='displaynone']").next(".price2").attr("class","price");
        $(this).find(".box-desc").find(".price[class*='displaynone']").remove();
        if ($(this).find(".box-desc").find(".price2").text() !== "") {

            $(this).prepend(`<div class="discountPrd"></div>`)

            
            var regex = /[^0-9]/g;				// 숫자가 아닌 문자열을 선택하는 정규식
            var result = $(this).find(".box-desc").find(".price").text().replace(regex, "");	// 원래 문자열에서 숫자가 아닌 모든 문자열을 빈 문자로 변경
            var result2 = $(this).find(".box-desc").find(".price2").text().replace(regex, "");	// 원래 문자열에서 숫자가 아닌 모든 문자열을 빈 문자로 변경
            $(this).find(".discountPrd").append(`${((1 - (result / result2)) * 100).toFixed(0)}%`);
        }
        else {
        }

        if ($(this).children(".box-desc").find(".delivery_price").text() == "무료" && $(this).children(".freedeliveryPrd").length == 0) {
            $(this).prepend(`<div class="freedeliveryPrd"></div>`)
            $(this).children(".freedeliveryPrd").text(`무료배송`);
        }

    })
