$(document).ready(function () {
    //하단정보더보기
    $(".footer-mobile-toggle-box").click(function () {
        $(".footerBox4").fadeToggle("fast");
     
    });


});

function onPopKBAuthMark() {
    window.open('', 'KB_AUTHMARK', 'height=604, width=648, status=yes, toolbar=no, menubar=no,location=no');
    document.KB_AUTHMARK_FORM.action = 'https://okbfex.kbstar.com/quics';
    document.KB_AUTHMARK_FORM.target = 'KB_AUTHMARK';
    document.KB_AUTHMARK_FORM.submit();
}