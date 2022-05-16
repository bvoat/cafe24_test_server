/**
 * 전체 금액 리턴
 * @returns {Number}
 */
function getTotalPrice() {
    var iTotalPrice = 0;
    $('.option_box_price').each(function () {
        iTotalPrice += parseInt($(this).val());
    });

    return iTotalPrice;
}

/**
 * 금액설정(옵션이 없는 경우)
 */
function setPriceHasOptionF() {
    if ($('#totalProducts').length === 0) {
        return;
    }
    try {
        iQuantity = parseInt($(quantity_id).val().replace(/^[\s]+|[\s]+$/g, '').match(/[\d\-]+/), 10);
    } catch (e) { }
    var iMaxCnt = 999999;
    if (iQuantity > iMaxCnt) {
        $(quantity_id).val(iMaxCnt);
        iQuantity = iMaxCnt;
    }
    // 모바일 할인가 추가.
    if (typeof ($('#span_product_price_mobile_text')) != 'undefined') {
        try {
            var iPriceMobile = parseFloat(product_price_mobile, 10);
        }
        catch (e) { var iPriceMobile = product_price; }
    }

    var iTotalPrice = getProductPrice(iQuantity, product_price, item_code, null, function (iTotalPrice) {
        var sTotalOriginPrice = SHOP_PRICE_FORMAT.toShopPrice(iTotalPrice);
        var iTotalOriginPrice = iTotalPrice;

        var sItemCode = $('.option_box_price').attr('item_code');
        sItemCode = (typeof (sItemCode) === 'undefined') ? item_code : sItemCode;
        iVatSubTotalPrice = TotalAddSale.getVatSubTotalPrice(sItemCode);

        if (iVatSubTotalPrice != iTotalPrice && iVatSubTotalPrice != 0 && iTotalPrice != 0) {
            iTotalPrice = iVatSubTotalPrice;
        }

        var sTotalPrice = SHOP_PRICE_FORMAT.toShopPrice(iTotalPrice);
        var sTotalSalePrice = sTotalPrice;
        iTotalAddSalePrice = TotalAddSale.getTotalAddSalePrice();
        if (typeof (iTotalAddSalePrice) != 'undefined' && iTotalAddSalePrice != 0) {
            iTotalSalePrice = iTotalPrice - parseFloat(iTotalAddSalePrice, 10);
            sTotalSalePrice = SHOP_PRICE_FORMAT.toShopPrice(iTotalSalePrice);
        } else {
            iTotalSalePrice = iTotalPrice;
        }

        //옵션이 없는 상품이고 추가구성상품 추가시 수량처리 및 상품금액 처리
        var iAddQuantity = 0;
        if ($('.add_product_option_box_price').length > 0) {
            $('.quantity_opt').each(function () {
                iAddQuantity += parseFloat($(this).val());
            });

            sTotalSalePrice = getAddProductExistTotalSalePrice(iTotalSalePrice);
        }
        var iTotalQuantity = iQuantity + iAddQuantity;

        var sQuantityString = '(' + sprintf(__('%s개'), iTotalQuantity) + ')';
        // ECHOSTING-58174
        if (sIsDisplayNonmemberPrice == 'T') {
            sTotalOriginPrice = sNonmemberPrice;
            sTotalPrice = sNonmemberPrice;
            sTotalSalePrice = sNonmemberPrice;
        }

        if (true) {
            $(oSingleSelection.getTotalPriceSelector()).html('<strong class="price">' + sTotalSalePrice + ' ' + sQuantityString + '</strong>');
            $('#quantity').html('<input type="hidden" name="option_box_price" class="option_box_price" value="' + iTotalOriginPrice + '" item_code="' + item_code + '">');
        } else {
            $('#totalProducts .total').html('<strong><em>' + sTotalSalePrice + '</em></strong> ' + sQuantityString + '</span>');

            //품목 할인가 보여주는 설정일 경우 할인가 노출
            var sDisplayPrice = sTotalOriginPrice;
            if (TotalAddSale.getIsUseSalePrice() === true) {
                //1+N상품은 할인가 보여주지 않음
                sDisplayPrice = (TotalAddSale.getIsBundleProduct() === true) ? '' : sTotalSalePrice;
                sDisplayPrice = '<span class="ec-front-product-item-price" code="' + item_code + '" product-no="' + iProductNo + '">' + sDisplayPrice + '</span>';
            }

            $('#totalProducts').find('.quantity_price').html(sDisplayPrice + '<input type="hidden" name="option_box_price" class="option_box_price" value="' + iTotalOriginPrice + '" item_code="' + item_code + '">');
            if (typeof (mileage_val) !== 'undefined' && TotalAddSale.checkVaildMileageValue(mileage_val) === true) {
                var mileage_price = TotalAddSale.getMileageGenerateCalc(item_code, iQuantity);

                if (sIsDisplayNonmemberPrice == 'T') {
                    $('#totalProducts').find('.mileage_price').html(sNonmemberPrice);
                } else {
                    $('#totalProducts').find('.mileage_price').html(SHOP_PRICE_FORMAT.toShopMileagePrice(mileage_price));
                }
            } else {
                $('#totalProducts').find('.mileage').hide();
            }
        }

        if (typeof (iTotalAddSalePrice) != 'undefined' && iTotalAddSalePrice != 0) {
            setTotalPriceRef(iTotalSalePrice, sQuantityString);
        } else {
            setTotalPriceRef(iTotalPrice, sQuantityString);
        }

        try {
            $('#spnViewPriceOrg').html(SHOP_PRICE_FORMAT.toShopPrice(_iPrdtPriceOrg * iQuantity));
        } catch (e) { }

        try {
            $('#spnViewPriceTax').html(SHOP_PRICE_FORMAT.toShopPrice(_iPrdtPriceTax * iQuantity));
        } catch (e) { }

        // 총 주문금액/수량 처리
        setTotalData();
        // 적립금 / 품목금액 갱신
        TotalAddSale.updatePrice();
    });
}

/**
 * 금액설정(옵션이 있는 경우)
 * 복합/조합 - 단독/일체 구분없이 item_code만으로 처리하도록 변경
 */
function setPriceHasOptionT(bOption, sOptionId) {
    if (typeof (option_stock_data) == 'undefined') {
        return;
    }

    if (sIsDisplayNonmemberPrice === 'T') {
        return;
    }

    if (bOption !== true) {
        return;
    }

    var sSelectElementId = sOptionId;
    var temp_product_option_id = product_option_id;

    //뉴상품+구스킨 : 옵션추가버튼을 이용해 추가된 옵션 select box id 예외처리
    if (sOptionId.split('_')[0] == 'add') {
        temp_product_option_id = sOptionId.split('_')[0] + '_' + sOptionId.split('_')[1] + '_' + temp_product_option_id;
    }

    var sSoldoutDisplayText = EC_SHOP_FRONT_NEW_OPTION_EXTRA_SOLDOUT.getSoldoutDiplayText(iProductNo);
    var aStockData = $.parseJSON(option_stock_data);
    // bItemSelected : 모든 셀렉트 박스가 선택됐는지 여부
    var bItemSelected, bSoldOut = false;
    var sOptionId, sOptionText = '';
    var iPrice = 0;

    var iBuyUnit = EC_FRONT_NEW_PRODUCT_QUANTITY_VALID.getBuyUnitQuantity('base');
    var iProductMin = EC_FRONT_NEW_PRODUCT_QUANTITY_VALID.getProductMinQuantity();

    var iQuantity = (iBuyUnit >= iProductMin ? iBuyUnit : iProductMin);
    // 조합구성 & 분리선택형
    if (option_type == 'T' && item_listing_type == 'S') {
        var aOption = new Array();
        $('select[id^="' + temp_product_option_id + '"]').each(function () {
            var cVal = EC_SHOP_FRONT_NEW_OPTION_COMMON.getOptionSelectedValue(this);
            if (cVal.indexOf('|') > -1) {
                cVal = cVal.split('|')[0];
            }
            aOption.push(cVal);
        });

        // 아직 totalProduct에 Element추가가 안되서 getItemCode를 사용할 수 없다.
        sOptionId = ITEM.getOldProductItemCode('[id^="' + temp_product_option_id + '"]');
        sOptionValue = aOption.join('/');
        sOptionText = aOption.join('#$%');
        if (ITEM.isOptionSelected(aOption) === true) {
            bItemSelected = true;
        }

        if (typeof (aStockData[sOptionId]) != 'undefined' && aStockData[sOptionId].stock_price != 0) {
            if (typeof (product_option_price_display) == 'undefined' || product_option_price_display === 'T') {
                sOptionText += '(' + getOptionPrice(aStockData[sOptionId].stock_price) + ')';
            }
        }

        if (bItemSelected === true && sOptionId === false) {
            alert(sprintf(__("선택하신 '%s' 옵션은 판매하지 않은 옵션입니다.\n다른 옵션을 선택해 주세요."), sOptionValue));
            throw e;
            return false;
        }
    } else {
        var sElementId = sOptionId;
        var oSelect = $('#' + sElementId);

        if (oSelect.attr('is_selected') !== 'T') {
            sOptionText = $('#' + sOptionId + ' option:selected').text();
            sOptionId = $('#' + sOptionId + ' option:selected').val();
            bItemSelected = true;
        } else {
            if (isNewProductSkin() === true && NEWPRD_OPTION.isOptionSelectTitleOrDivider(EC_SHOP_FRONT_NEW_OPTION_COMMON.getOptionSelectedValue(oSelect)) !== true) {
                alert(__('이미 선택되어 있는 옵션입니다.'));
                NEWPRD_OPTION.resetSelectElement(oSelect);
                return false;
            }
            sOptionId = '*';
        }

        // 독립선택형 옵션별로 한개씩 선택시
        if (oSingleSelection.isItemSelectionTypeM() === true && typeof (is_onlyone) === 'string' && is_onlyone === 'T' && isNewProductSkin() === true) {

            if (NEWPRD_OPTION.isOptionSelectTitleOrDivider(oSelect.val()) !== true) {
                $('#' + sElementId).attr('is_selected', 'T');
            }
        }

        if (ITEM.isOptionSelected(sOptionId) === false) {
            bItemSelected = false;
        }
    }

    if (checkOptionBox(sOptionId) === true) {
        alert(__('이미 선택되어 있는 옵션입니다.'));
        NEWPRD_OPTION.resetSelectElement(oSelect);
        return false;
    }

    // get_stock_info
    if (aStockData[sOptionId] == undefined) {
        iStockNumber = -1;
        iOptionPrice = 0;
        bStock = false;
        sIsDisplay = 'T';
        sIsSelling = 'T';
        sIsReserveStat = 'N';
    } else {
        iStockNumber = aStockData[sOptionId].stock_number;
        iOptionPrice = aStockData[sOptionId].option_price;
        bStock = aStockData[sOptionId].use_stock;
        sIsDisplay = aStockData[sOptionId].is_display;
        sIsSelling = aStockData[sOptionId].is_selling;
        sIsReserveStat = aStockData[sOptionId].is_reserve_stat; //이건 어디서
    }

    if (EC_SHOP_FRONT_NEW_OPTION_VALIDATION.isItemCode(sOptionId) === true && typeof (EC_SHOP_FRONT_PRODUCT_DEATAIL_BUNDLE.oBundleConfig[iProductNo]) === 'object') {
        iOptionPrice = aStockData[sOptionId].option_price - aStockData[sOptionId].stock_price;
    }
    if (sIsSelling == 'F' || ((iStockNumber < iBuyUnit || iStockNumber <= 0) && (bStock === true || sIsDisplay == 'F'))) {
        //뉴상품+구스디 스킨 (옵션추가 버튼나오는 디자인 - 옵션선택시 재고체크)
        if ($('#totalProducts').length <= 0) {
            var aOptionName = new Array();
            var aOptionText = new Array();

            aOptionName = option_name_mapper.split('#$%');
            aOptionText = sOptionText.split('#$%');
            for (var i = 0; i < aOptionName.length; i++) {
                aOptionText[i] = aOptionName[i] + ':' + aOptionText[i];
            }
            option_text = aOptionText.join('\n');
            alert(__('이 상품은 현재 재고가 부족하여 판매가 잠시 중단되고 있습니다.') + '\n\n' + __('제품명') + ' : ' + product_name + '\n\n' + __('재고없는 제품옵션') + ' : \n' + option_text);
            EC_SHOP_FRONT_NEW_OPTION_COMMON.setValue($('#' + sSelectElementId), '*');
        }
        bSoldOut = true;
        sOptionText = sOptionText.split('#$%').join('/').replace('[' + sSoldoutDisplayText + ']', '') + ' <span class="soldOut">[' + sSoldoutDisplayText + ']</span>';
    } else {
        sOptionText = sOptionText.split('#$%').join('/');
    }


    //예약주문|당일발송
    if (aStockData[sOptionId] !== undefined) {
        if (aReserveStockMessage['show_stock_message'] === 'T' && sIsReserveStat !== 'N') {
            var sReserveStockMessage = '';
            bSoldOut = false; //품절 사용 안함

            sReserveStockMessage = aReserveStockMessage[sIsReserveStat];
            sReserveStockMessage = sReserveStockMessage.replace(aReserveStockMessage['stock_message_replace_name'], iStockNumber);
            sReserveStockMessage = sReserveStockMessage.replace('[:PRODUCT_STOCK:]', iStockNumber);

            sOptionText = sOptionText.replace(sReserveStockMessage, '') + ' <span class="soldOut">' + sReserveStockMessage + '</span>';
        }
    }

    if (oSingleSelection.isItemSelectionTypeS() === true) {
        iQuantity = PRODUCTSUBMIT.getQuantity();
        if (option_type === 'F') {
            var iOptionSequence = EC_SHOP_FRONT_NEW_OPTION_COMMON.getOptionSortNum(oSelect);
            iQuantity = PRODUCTSUBMIT.getQuantity($('[product-no=' + iProductNo + '][option-sequence=' + iOptionSequence + ']'));
        }
    }

    iPrice = getProductPrice(iQuantity, iOptionPrice, sOptionId, bSoldOut, function (iPrice) {
        // 옵션박스 호출
        if (bItemSelected === true) {
            // 구상품스킨일때는 옵션박스 호출안함
            if (isNewProductSkin() === false) {
                if (sIsDisplayNonmemberPrice == 'T') {
                    $('#span_product_price_text').html(sNonmemberPrice);
                } else {
                    $('#span_product_price_text').html(SHOP_PRICE_FORMAT.toShopPrice(iPrice));
                }
            } else {
                setOptionBox(sOptionId, sOptionText, iPrice, bSoldOut, sSelectElementId, sIsReserveStat, iQuantity);
            }

            if (typeof (EC_SHOP_FRONT_NEW_OPTION_EXTRA_DIRECT_BASKET) !== 'undefined') {
                EC_SHOP_FRONT_NEW_OPTION_EXTRA_DIRECT_BASKET.bIsLoadedPriceAjax = true;
            }
        }
    });
}

/**
 * 옵션 사용가능 체크
 */
function checkOptionBox(sOptionId) {
    if (oSingleSelection.isItemSelectionTypeS() === true) {
        return false;
    }
    var bSelected = false;

    // 이미 선택된 옵션은 아무 처리도 하지 않도록 처리한다.
    $('.option_box_id').each(function (i) {
        if ($(this).val() == sOptionId) {
            bSelected = true;
        }
    });

    $('.soldout_option_box_id').each(function (i) {
        if ($(this).val() == sOptionId) {
            bSelected = true;
        }
    });

    return bSelected;
}

/*
 * 옵션선택 박스 설정
 * @todo totalproduct id를 컨트롤러로 밀어야함
 */
function setOptionBox(sItemCode, sOptionText, iPrice, bSoldOut, sSelectElementId, sIsReserveStat, iManualQuantity) {
    var sReadonly = '';
    var oSelect = $("#" + sSelectElementId);

    // 필수 추가옵션 작성여부 검증
    if (checkAddOption() !== true) {
        delete oProductList[sItemCode];
        NEWPRD_ADD_OPTION.resetSelectElement(oSelect);

        // 독립선택형 옵션별로 한개씩 선택시
        if (typeof (is_onlyone) === 'string' && is_onlyone === 'T' && isNewProductSkin() === true) {
            oSelect.removeAttr('is_selected');
        }

        return false;
    }

    if (checkOptionBox(sItemCode) === true) {
        alert(__('이미 선택되어 있는 옵션입니다.'));
        NEWPRD_OPTION.resetSelectElement(oSelect);
        return false;
    }

    var iBuyUnit = EC_FRONT_NEW_PRODUCT_QUANTITY_VALID.getBuyUnitQuantity('base');
    var iProductMin = EC_FRONT_NEW_PRODUCT_QUANTITY_VALID.getProductMinQuantity();

    if (parseInt(buy_unit, 10) > 1) {
        sReadonly = 'readonly';
    }

    var sStrPrice = SHOP_PRICE_FORMAT.toShopPrice(iPrice);

    var iQuantity = (iBuyUnit >= iProductMin ? iBuyUnit : iProductMin);
    if (typeof (iManualQuantity) !== 'undefined') {
        iQuantity = iManualQuantity;
    }


    // 적립금 추가 필요
    var iMileageVal = 0;
    var sMileageIcon = (typeof (mileage_icon) != 'undefined') ? mileage_icon : '//img.echosting.cafe24.com/design/common/icon_sett04.gif';
    var sMileageAlt = (typeof (mileage_icon_alt) != 'undefined') ? mileage_icon_alt : '';

    if (typeof (option_stock_data) !== 'undefined') {
        var aStockData = $.parseJSON(option_stock_data);
    }

    if (typeof (mileage_val) != 'undefined') {
        var iStockPrice = 0;
        if (Olnk.isLinkageType(option_type) === true) {
            var aOptionTmp = sItemCode.split('||');
            var aOptionIdTmp = new Array;
            var sItemCodeTemp = '';
            for (i = 0; i < aOptionTmp.length; i++) {
                if (aOptionTmp[i] !== '') {
                    aOptionIdTmp = aOptionTmp[i].split('_');
                    if (/^\*+$/.test(aOptionIdTmp[0]) === false) {
                        iStockPrice = parseFloat(aStockData[aOptionIdTmp[0]].option_price);
                    }
                }
            }
        } else if (typeof (aStockData[sItemCode].stock_price) != 'undefined') {
            iStockPrice = aStockData[sItemCode].stock_price;
        }
        iMileageVal = TotalAddSale.getMileageGenerateCalc(sItemCode, iQuantity);
    }
    var sMileageVal = SHOP_PRICE_FORMAT.toShopMileagePrice(iMileageVal);
    // ECHOSTING-58174
    if (sIsDisplayNonmemberPrice == 'T') {
        sStrPrice = sNonmemberPrice;
        sMileageVal = sNonmemberPrice;
    }


    var sProductName = product_name;
    if (sProductName != null) {
        sProductName = product_name.replace(/\\"/g, '"');
    }

    var aAddOption = NEWPRD_ADD_OPTION.getCurrentAddOption();

    var sAddOptionTitle = NEWPRD_ADD_OPTION.getCurrentAddOptionTitle(aAddOption);

    var iIndex = 1;
    if (parseInt($('#totalProducts > table > tbody').find('tr.option_product').length) > 0) {
        // max
        iIndex = parseInt($('#totalProducts > table > tbody').find('tr.option_product:last').data('option-index')) + 1;
    }
    var iTargetKey = iProductNo;
    if (option_type === 'F') {
        iTargetKey = iProductNo + '|' + EC_SHOP_FRONT_NEW_OPTION_COMMON.getOptionSortNum(oSelect);
    }

    var sDisplayOption = '';
    /**
     * 옵션선택시 바로 장바구니 담기 상태라면 hide처리
     * @see EC_SHOP_FRONT_NEW_OPTION_EXTRA_DIRECT_BASKET.setUseDirectBasket()
     */
    if (typeof (EC_SHOP_FRONT_NEW_OPTION_EXTRA_DIRECT_BASKET) !== 'undefined' && EC_SHOP_FRONT_NEW_OPTION_EXTRA_DIRECT_BASKET.isAvailableDirectBasket(oSelect) === true) {
        sDisplayOption = 'displaynone';
    }

    var sOptionBoxId = 'option_box' + iIndex;
    var sOptionId = (typeof (aStockData[sItemCode]) != 'undefined' && typeof (aStockData[sItemCode].option_id) != 'undefined') ? aStockData[sItemCode].option_id : '';
    var sTableRow = '<tr class="option_product ' + sDisplayOption + '" data-option-index="' + iIndex + '" target-key="' + iTargetKey + '">';

    if (true) {
        sTableRow += '<td>';
        sOptionText = '<p class="product"><strong>' + sProductName + '</strong> - <span>' + sAddOptionTitle + sOptionText + '</span></p>';

        if (bSoldOut === true) {
            try {
                if ($('#NaverChk_Button').length > 0 && $('#NaverChk_Button').children().length > 0) {
                    $('#NaverChk_Button').css('display', 'none');
                }
            } catch (e) { }

            sTableRow += '<input type="hidden" class="soldout_option_box_id" id="' + sOptionBoxId + '_id" value="' + sItemCode + '">' + sOptionText;
            sTableRow += '<a href="#none"><img src="/bvtIMG/btn_option_delete.svg" alt="삭제" id="' + sOptionBoxId + '_del" class="option_box_del" /></a><p><input type="text" readonly value="0"/></td>';
            sTableRow += '<td class="right"><strong class="price">' + sStrPrice + '</strong></td>';
            sTableRow += '<td>';
            sTableRow += '<a href="#none" class="up"><img width="30" height="27" src="/bvtIMG/btn_quantity_up.svg"/></a>';
            sTableRow += '<a href="#none" class="down"><img width="30" height="27" src="/bvtIMG/btn_quantity_up.svg"/></a></span></p></td>';
        } else {

            //ECHOSTING 162635 예약주문 속성추가
            var sInputHiddenReserved = 'data-item-reserved="' + sIsReserveStat + '" ';

            sTableRow += '<input type="hidden" class="option_box_id" id="' + sOptionBoxId + '_id" value="' + sItemCode + '" name="item_code[]" data-item-add-option="' + escape(aAddOption.join(NEWPRD_OPTION.DELIMITER_SEMICOLON)) + '"' + sInputHiddenReserved + ' data-option-id="' + sOptionId + '">' + sOptionText + '</td>';
            sTableRow += '<td class="right"><a href="#none" class="delete"><img src="/bvtIMG/btn_option_delete.svg" alt="삭제" id="' + sOptionBoxId + '_del" class="option_box_del" /></a>';
            if (TotalAddSale.checkVaildMileageValue(iMileageVal) === true && sIsMileageDisplay === 'T') {
                // sTableRow += '<span class="mileage">(<img src="' + sMileageIcon + '" alt="' + sMileageAlt + '" /> <span id="' + sOptionBoxId + '_mileage" class="mileage_price" code="' + sItemCode + '">' + sMileageVal + '</span>)</span>';
            }
            sTableRow += '</td>';
            sTableRow += '<td>';
            sTableRow += '<a href="#none" class="down eProductQuantityDownClass" data-target="' + sOptionBoxId + '_down"><img width="30" height="27" src="/bvtIMG/btn_quantity_down.svg" id="' + sOptionBoxId + '_down" class="option_box_down" alt="down" /></a>';
            sTableRow += '<input type="text" id="' + sOptionBoxId + '_quantity" name="quantity_opt[]" autocomplete="off" class="quantity_opt eProductQuantityClass" ' + sReadonly + ' value="' + iQuantity + '" product-no="' + iProductNo + '"/> ';
            sTableRow += '<a href="#none" class="up eProductQuantityUpClass" data-target="' + sOptionBoxId + '_up"><img width="30" height="27" src="/bvtIMG/btn_quantity_up.svg" id="' + sOptionBoxId + '_up" class="option_box_up" alt="up" /></a></td>';
            sTableRow += '<td><span id="' + sOptionBoxId + '_price" class="price"><input type="hidden" class="option_box_price" value="' + iPrice + '" product-no="' + iProductNo + '" item_code="' + sItemCode + '"><span class="ec-front-product-item-price" code="' + sItemCode + '" product-no="' + iProductNo + '">' + sStrPrice + '</span></span></td>'
        }
        sTableRow += '</tr>';

        if (EC_SHOP_FRONT_PRODUCT_OPTIONLAYER.isDisplayLayer(true) === true) {
            parent.$('#totalProducts > table > tbody:last').append(sTableRow);
        }
        if (EC_SHOP_FRONT_PRODUCT_OPTIONLAYER.isExistLayer() === true) {
            if (EC_SHOP_FRONT_PRODUCT_OPTIONLAYER.isDisplayLayer() === false) {
                $("#productOptionIframe").contents().find('#totalProducts > table > tbody:last').append(sTableRow);
            }
        }
    } else {
        sOptionText = '<p class="product">' + sProductName + ' - <span>' + sAddOptionTitle + sOptionText + '</span></p>';

        if (bSoldOut === true) {
            try {
                if ($('#NaverChk_Button').length > 0 && $('#NaverChk_Button').children().length > 0) {
                    $('#NaverChk_Button').css('display', 'none');
                }
            } catch (e) { }
            sTableRow += '<td><input type="hidden" class="soldout_option_box_id" id="' + sOptionBoxId + '_id" value="' + sItemCode + '">' + sOptionText + '</td>';
            sTableRow += '<td><span class="quantity" style="width:65px;"><a href="#none" class="down"><img src="/bvtIMG/btn_quantity_down.svg" alt="수량감소" /></a><input type="text" ' + sReadonly + ' value="0"/><a href="#none" class="up"><img src="/bvtIMG/btn_quantity_up.svg" alt="수량증가" /></a></span>';
            sTableRow += '<a href="#none" class="delete"><img src="/bvtIMG/btn_option_delete.svg" alt="삭제" id="' + sOptionBoxId + '_del" class="option_box_del" /></a></td>';
            sTableRow += '<td class="right"><span id="' + sOptionBoxId + '_price"><span>' + sStrPrice + '</span></span>';
        } else {

            //ECHOSTING 162635 예약주문 속성추가 (위치변경)
            var sInputHiddenReserved = 'data-item-reserved="' + sIsReserveStat + '" ';
            sTableRow += '<td><input type="hidden" class="option_box_id" id="' + sOptionBoxId + '_id" value="' + sItemCode + '" name="item_code[]" data-item-add-option="' + escape(aAddOption.join(NEWPRD_OPTION.DELIMITER_SEMICOLON)) + '"' + sInputHiddenReserved + ' data-option-id="\'+sOptionId+\'">' + sOptionText + '</td>';
            sTableRow += '<td><a href="#none" class="delete"><img src="/bvtIMG/btn_option_delete.svg" alt="삭제" id="' + sOptionBoxId + '_del" class="option_box_del" /></a></td>';
            sTableRow += '<td class="right"><span id="' + sOptionBoxId + '_price">';
            sTableRow += '<input type="hidden" class="option_box_price" value="' + iPrice + '" product-no="' + iProductNo + '" item_code="' + sItemCode + '">';
            sTableRow += '<span class="ec-front-product-item-price" code="' + sItemCode + '" product-no="' + iProductNo + '">' + sStrPrice + '</span></span>';
            sTableRow += '<td><span class="quantity" style="width:65px;">';
            sTableRow += '<a href="#none" class="down eProductQuantityDownClass" data-target="' + sOptionBoxId + '_down"><img src="/bvtIMG/btn_quantity_down.svg" id="' + sOptionBoxId + '_down" class="option_box_down" alt="수량감소" /></a>';
            sTableRow += '<input type="text" id="' + sOptionBoxId + '_quantity" name="quantity_opt[]" class="quantity_opt eProductQuantityClass" ' + sReadonly + ' value="' + iQuantity + '" product-no="' + iProductNo + '"/>';
            sTableRow += '<a href="#none" class="up eProductQuantityUpClass"" data-target="' + sOptionBoxId + '_up" ><img src="/bvtIMG/btn_quantity_up.svg" id="' + sOptionBoxId + '_up" class="option_box_up" alt="수량증가" /></a>';
            sTableRow += '</span></td>';
        }

        if (TotalAddSale.checkVaildMileageValue(iMileageVal) === true && sIsMileageDisplay === 'T') {
            sTableRow += '<span class="mileage">(<img src="' + sMileageIcon + '" alt="' + sMileageAlt + '" /> <span id="' + sOptionBoxId + '_mileage" class="mileage_price" code="' + sItemCode + '">' + sMileageVal + '</span>)</span>';
        }

        sTableRow += '</td></tr>';
    }

    if (0 == $('#totalProducts > table > tbody.option_products').length) {
        $('#totalProducts > table > tbody:last').addClass("option_products").after($('<tbody class="add_products"/>'));
    }

    $('#totalProducts > table > tbody.option_products').append(sTableRow);
    // 총 주문금액/수량 처리
    setTotalData();

    //적립금 / 품목금액 업데이트
    TotalAddSale.updatePrice(sOptionBoxId, sItemCode);
}

/**
 * 총 상품금액/수량 적용
 */
function setTotalData() {
    // 실제 계산
    var iTotalCount = 0;
    var iTotalPrice = 0;
    var iVatSubTotalPrice = 0;
    var aEventQuantity = new Array();
    var aEventQuantityCheck = {};
    //add_product_option_box_price추가구성상품
    var bIsValidBundleObject = typeof (EC_SHOP_FRONT_PRODUCT_DEATAIL_BUNDLE) === 'object';
    var fEventProductPrice = 0;

    $('.option_box_price, .option_add_box_price, .add_product_option_box_price').each(function (i) {
        var iProductNum = (has_option === 'T') ? $(this).attr('product-no') : iProductNo;
        var sItemCode = $(this).attr('item_code');
        if (parseInt(iProductNum) === parseInt(iProductNo) && bIsValidBundleObject === true && EC_SHOP_FRONT_PRODUCT_DEATAIL_BUNDLE.oBundleConfig.hasOwnProperty(iProductNum) === true) {
            if (has_option === 'T') {
                var iSingleQuantity = parseInt($('.quantity_opt[product-no="' + iProductNum + '"]').eq(i).val(), 10);
            } else {
                var iSingleQuantity = parseInt($('input[name="quantity_opt[]"]').eq(i).val(), 10);
            }

            if (typeof (aEventQuantityCheck[iProductNum]) === 'undefined') {
                aEventQuantityCheck[iProductNum] = 0;
                aEventQuantity.push({ 'product_no': iProductNum });
            }

            aEventQuantityCheck[iProductNum] += iSingleQuantity;
        } else {
            if (typeof EC_FRONT_JS_CONFIG_SHOP.bSoldout === 'undefined') {
                iTotalPrice += parseFloat($(this).val());
                iVatSubTotalPrice += TotalAddSale.getVatSubTotalPrice(sItemCode);
            }
        }
    });
    $(aEventQuantity).each(function () {
        fEventProductPrice = fEventProductPrice + (product_price * EC_SHOP_FRONT_PRODUCT_DEATAIL_BUNDLE.getQuantity(aEventQuantityCheck[this.product_no], this.product_no));
    });
    iTotalPrice = iTotalPrice + fEventProductPrice;

    if (iVatSubTotalPrice != iTotalPrice && iVatSubTotalPrice != 0 && iTotalPrice != 0) {
        iTotalPrice = iVatSubTotalPrice;
    }
    iTotalAddSalePrice = TotalAddSale.getTotalAddSalePrice();
    if (typeof (iTotalAddSalePrice) != 'undefined' && iTotalAddSalePrice != 0) {
        iTotalPrice -= parseFloat(iTotalAddSalePrice, 10);
    }

    $('input[name="quantity_opt[]"]', (has_option === 'F' ? '' : '#totalProducts')).each(function (i) {
        iTotalCount += parseInt($(this).val());
    });
    iTotalPrice = (iTotalPrice <= 0) ? 0 : iTotalPrice;

    var sQuantityString = '(' + sprintf(__('%s개'), iTotalCount) + ')';
    var sStrPrice = SHOP_PRICE_FORMAT.toShopPrice(iTotalPrice);

    // ECHOSTING-58174
    if (sIsDisplayNonmemberPrice == 'T') {
        sStrPrice = sNonmemberPrice;
    }
    var sTotalPriceSelector = oSingleSelection.getTotalPriceSelector();
    // 실제 노출
    if (true) {
        $(sTotalPriceSelector).html('<strong class="price">' + sStrPrice + '</strong> ' + sQuantityString);

        if (EC_SHOP_FRONT_PRODUCT_OPTIONLAYER.isDisplayLayer(true) === true) {
            parent.$(sTotalPriceSelector).html('<strong class="price">' + sStrPrice + '</strong> ' + sQuantityString);
        }
        if (EC_SHOP_FRONT_PRODUCT_OPTIONLAYER.isExistLayer() === true) {
            if (EC_SHOP_FRONT_PRODUCT_OPTIONLAYER.isDisplayLayer() === false) {
                $("#productOptionIframe").contents().find(sTotalPriceSelector).html('<strong class="price">' + sStrPrice + '</strong> ' + sQuantityString);
            }
        }
    } else {
        $(sTotalPriceSelector).html('<strong><em>' + sStrPrice + '</em></strong> ' + sQuantityString + '</span>');
    }

    setTotalPriceRef(iTotalPrice, sQuantityString);
    setProductPriceTaxTypeText(iTotalPrice);
    setActionButtonVisible();

}