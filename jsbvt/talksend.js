

if ($.cookie('talksend')){
console.log("already")
}
else{
// 7일 뒤에 만료되는 쿠키 생성
$.cookie('talksend', 'true', { expires: 7 });
function calldata(no) {
$.ajax({
    type: "POST",
    url: "221.139.14.189/API/alimtalk_api",
    api_key: "EUG5QNN8YFA0413",
    template_code :"",
    variable :"",
    callback :"",
    dstaddr :"",
    next_type :"",
    send_reserve :"",
    success: function (data) {
     

    },
})
}
}
