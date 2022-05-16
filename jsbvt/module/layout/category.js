/**
 * 카테고리 마우스 오버 이미지
 * 카테고리 대분류 설정
 */

$(document).ready(function () {
    var methods = {
        aCategory: [],
        aSubCategory: {},
        parent: [],
        parent_tag: [],
        get: function () {
            $.ajax({
                url: '/exec/front/Product/SubCategory',
                dataType: 'json',
                success: function (aData) {
                    if (aData == null || aData == 'undefined') return;
                    for (var i = 0; i < aData.length; i++) {
                        var sParentCateNo = aData[i].parent_cate_no;
                        if (!methods.aSubCategory[sParentCateNo]) {
                            methods.aSubCategory[sParentCateNo] = [];
                        }
                        methods.aSubCategory[sParentCateNo].push(aData[i]);
                    }
                }
            });
        },
        getparent: function () {
            $.ajax({
                url: '/exec/front/Product/SubCategory',
                dataType: 'json',
                success: function (aData) {
                    if (aData == null || aData == 'undefined') return;
                    //대분류 선택 커스텀
                    for (var i = 0; i < aData.length; i++) {
                        var sParentCateNo = aData[i].parent_cate_no;
                        if (sParentCateNo == 1 && aData[i].cate_no != 207 && aData[i].cate_no != 157 && aData[i].cate_no != 186 && aData[i].cate_no != 273) {
                            var tmp = {
                                "cate_no": aData[i].cate_no,
                                "name": aData[i].name,
                            }
                            methods.parent.push(tmp);
                        }
                    }
                }
            });
        },
        getParam: function (sUrl, sKey) {
            var aUrl = sUrl.split('?');
            var sQueryString = aUrl[1];
            var aParam = {};
            if (sQueryString) {
                var aFields = sQueryString.split("&");
                var aField = [];
                for (var i = 0; i < aFields.length; i++) {
                    aField = aFields[i].split('=');
                    aParam[aField[0]] = aField[1];
                }
            }
            return sKey ? aParam[sKey] : aParam;
        },
        show: function (overNode, iCateNo) {
            if (methods.aSubCategory[iCateNo].length == 0) {
                return;
            }
            var aHtml = [];
            aHtml.push('<ul>');
            $(methods.aSubCategory[iCateNo]).each(function () {
                aHtml.push('<li><a href="/' + this.design_page_url + this.param + '">' + this.name + '</a></li>');
            });
            aHtml.push('</ul>');
            var offset = $(overNode).offset();
            $('<div class="sub-category"></div>')
                .appendTo(overNode)
                .html(aHtml.join(''))
                .find('li').mouseover(function (e) {
                    $(this).addClass('over');
                }).mouseout(function (e) {
                    $(this).removeClass('over');
                });
        },
        close: function () {
            $('.sub-category').remove();
        }
    };
    methods.get();
    methods.getparent();


    //상품별 카테고리
    setTimeout(() => {
        methods.parent.map(function (param) {
            var _no = param.cate_no;
            $(".cat_by-prd").append(`<div class="main-category-${_no}">${param.name}</div>`)
            if (methods.aSubCategory[_no]) {
                $(`.main-category-${_no}`).after(`<div class="main-middle"></div>`)
                methods.aSubCategory[_no].map(function (param2, index) {
                    if ((index + 1) % 3 == 0) {
                        $(`.main-category-${_no}`).next(`.main-middle`).append(`<div class="middle-category-line-${param2.cate_no}"><div class="middle-title">${param2.name}</div></div>`)
                    }
                    else {
                        $(`.main-category-${_no}`).next(`.main-middle`).append(`<div class="middle-category-${param2.cate_no}"><div class="middle-title">${param2.name}</div></div>`)

                    }

                })
            }

        });

    }, 500);

    //가치별 카테고리
    setTimeout(() => {
        $(".cat_by-tag").append(`<div class="main-tag-category"><div class="main-middle"></div></div>`)
        if (methods.aSubCategory[273]) {
            methods.aSubCategory[273].map(function (param2, index) {
                if ((index + 1) % 2 == 0) {
                    $(`.main-tag-category`).children(`.main-middle`).append(`<div class="middle-tag-category-line-${param2.cate_no}"><div class="middle-title">${param2.name}</div></div>`)
                }
                else {
                    $(`.main-tag-category`).children(`.main-middle`).append(`<div class="middle-tag-category-${param2.cate_no}"><div class="middle-title">${param2.name}</div></div>`)

                }
            })
        }
    }, 500);

    $(document).on("click", `div[class^="middle-category"]`, function () {
        var click_tmp = $(this);
        var segment_array = click_tmp.attr("class").split('-');
        var last_segment = segment_array.pop();
    
    
        $(`div[class^="middle-category"]`).next(`.middle-small`).remove();
        $(`div[class^="middle-category"]`).children(`.middle-title`).removeClass("active");
    
    
    
        clickable_prd = false;
        if (methods.aSubCategory[last_segment]) {
            if ($(`.middle-category-${last_segment}`).nextAll(`div[class^="middle-category-line"]`).eq(0).length) {
                $(`.middle-category-${last_segment}`).nextAll(`div[class^="middle-category-line"]`).eq(0).after(`<div class="middle-small"></div>`);
                $(`.middle-category-${last_segment}`).nextAll(`div[class^="middle-category-line"]`).eq(0).next(`.middle-small`).append(`<div class="small-category-${last_segment} all"><a href="/product/list.html?cate_no=${last_segment}">전체보기</a></div>`);
                $(this).children(`.middle-title`).addClass("active");
    
                methods.aSubCategory[last_segment].map(function (param2) {
                    $(`.middle-category-${last_segment}`).nextAll(`div[class^="middle-category-line"]`).eq(0).next(`.middle-small`).append(`<div class="small-category-${param2.cate_no}"><a href="/product/list.html?cate_no=${param2.cate_no}">${param2.name}</a></div>`);
                })
            }
            else {
                click_tmp.after(`<div class="middle-small"></div>`);
                click_tmp.next(`.middle-small`).append(`<div class="small-category-${last_segment} all"><a href="/product/list.html?cate_no=${last_segment}">전체보기</a></div>`);
                $(this).children(`.middle-title`).addClass("active");
    
                methods.aSubCategory[last_segment].map(function (param2) {
                    click_tmp.next(`.middle-small`).append(`<div class="small-category-${param2.cate_no}"><a href="/product/list.html?cate_no=${param2.cate_no}">${param2.name}</a></div>`);
                })
            }
    
    
        }
        else {
            location.href = `/product/list.html?cate_no=${last_segment}`
        }
    
    })
    
    $(document).on("click", `div[class^="middle-tag-category"]`, function () {
        var click_tmp = $(this);
        var segment_array = click_tmp.attr("class").split('-');
        var last_segment = segment_array.pop();
    
    
        $(`div[class^="middle-tag-category"]`).next(`.middle-small`).remove();
        $(`div[class^="middle-tag-category"]`).children(`.middle-title`).removeClass("active");
    
    
    
        clickable_tag = false;
        if (methods.aSubCategory[last_segment]) {
            if ($(`.middle-tag-category-${last_segment}`).next(`div[class^="middle-tag-category-line"]`)[0]) {
                $(`.middle-tag-category-${last_segment}`).next(`div[class^="middle-tag-category-line"]`).after(`<div class="middle-small"></div>`);
                $(`.middle-tag-category-${last_segment}`).next(`div[class^="middle-tag-category-line"]`).next(`.middle-small`).append(`<div class="small-tag-category-${last_segment} all"><a href="/product/list.html?cate_no=${last_segment}">전체보기</a></div>`);
                $(this).children(`.middle-title`).addClass("active");
    
                methods.aSubCategory[last_segment].map(function (param2) {
                    $(`.middle-tag-category-${last_segment}`).next(`div[class^="middle-tag-category-line"]`).next(`.middle-small`).append(`<div class="small-tag-category-${param2.cate_no}"><a href="/product/list.html?cate_no=${param2.cate_no}">${param2.name}</a></div>`);
                })
            }
            else {
                click_tmp.after(`<div class="middle-small"></div>`);
                click_tmp.next(`.middle-small`).append(`<div class="small-tag-category-${last_segment} all"><a href="/product/list.html?cate_no=${last_segment}">전체보기</a></div>`);
                $(this).children(`.middle-title`).addClass("active");
    
                methods.aSubCategory[last_segment].map(function (param2) {
                    click_tmp.next(`.middle-small`).append(`<div class="small-tag-category-${param2.cate_no}"><a href="/product/list.html?cate_no=${param2.cate_no}">${param2.name}</a></div>`);
                })
            }
    
    
        }
        else {
            location.href = `/product/list.html?cate_no=${last_segment}`
        }
    
    })

    $('.xans-layout-category li').mouseenter(function (e) {
        var $this = $(this).addClass('on'),
            iCateNo = Number(methods.getParam($this.find('a').attr('href'), 'cate_no'));
        if (!iCateNo) {
            return;
        }
        methods.show($this, iCateNo);
    }).mouseleave(function (e) {
        $(this).removeClass('on');
        methods.close();
    });
});

