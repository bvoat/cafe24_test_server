refresh_discount();


//listnormal 더보기&할인율&할인가&무료배송 표시
function refresh_discount() {
    setTimeout(function () {
       

        $(".prdList").children("[id^='anchorBoxId_']").each(
            
            function () {
                var regex = /[^0-9]/g;				// 숫자가 아닌 문자열을 선택하는 정규식
                $(this).children(".box-desc").children(".product_section").children(".product_ListItem").children(".price_sale").text().replace(regex, "");	// 원래 문자열에서 숫자가 아닌 모든 문자열을 빈 문자로 변경
                $(this).children(".box-desc").children(".product_section").children(".product_ListItem").children(".product_price").text().replace(regex, "");	// 원래 문자열에서 숫자가 아닌 모든 문자열을 빈 문자로 변경

                if ($(this).children(".box-desc").children(".product_section").children(".product_ListItem").children(".price_sale").text() !== "") {
                    $(this).children(".box-desc").children(".product_section").children(".product_ListItem").children(".price_sale").children('span').attr("style", "");
                    $(this).children(".box-desc").children(".product_section").children(".product_ListItem").children(".price_sale").addClass("prd_price_sale");
                    $(this).children(".box-desc").children(".product_section").children(".product_ListItem").children(".product_price").addClass("strikeprice");

                }
                else {
                    $(this).children(".box-desc").children(".product_section").children(".product_ListItem").children(".price_sale").children('span').attr("style", "");
                    $(this).children(".box-desc").children(".product_section").children(".product_ListItem").children(".product_price").addClass("prd_price_sale");
                }
            })
    }, 500)

}