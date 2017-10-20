$(window).load(function(){
    
    // リンク設定ここから ######################################################################################
    // DESC:リンク設定 :初めての方へ
    var $otAnchorlinkHajimete = $('.ot-anchorlink-hajimete');
    //$otAnchorlinkHajimete.eq(0).prop('href','http://52.196.97.215/6/hajimetenokatahe.html#ot-title_M-hajimete7');//お支払方法について####################################
    $otAnchorlinkHajimete.eq(1).prop('href','http://www.ena.travel/special/oilcharge.html');//燃油サーチャージ込みの「総額表示」について
    $otAnchorlinkHajimete.eq(2).prop('href','/ena/support/userguide.html');//ご利用ガイド
    $otAnchorlinkHajimete.eq(3).prop('href','http://www.ena.travel/tour/merit/');//ダイナミック海外ツアー（航空券＋ホテル・セット割）について
    $otAnchorlinkHajimete.eq(4).prop('href','http://www.ena.travel/tour/merit/');//ダイナミック海外ツアー（航空券＋ホテル・セット割）について
    //$otAnchorlinkHajimete.eq(5).prop('href','http://52.196.97.215/6/hajimetenokatahe.html#ot-title_M-hajimete7');//お支払方法について####################################
    $otAnchorlinkHajimete.eq(6).prop('href','http://www.ena.travel/tour/support/dp00.html');//ご利用ガイド
    $otAnchorlinkHajimete.eq(7).prop('href','http://www.ena.travel/hotel/price_guarantee/');//「ホテル最低価格保証」について
    $otAnchorlinkHajimete.eq(8).prop('href','http://www.ena.travel/hotel/price_guarantee/');//「ホテル最低価格保証」について
    //$otAnchorlinkHajimete.eq(9).prop('href','http://52.196.97.215/6/hajimetenokatahe.html#ot-title_M-hajimete7');//お支払方法について####################################
    $otAnchorlinkHajimete.eq(10).prop('href','http://www.ena.travel/hotel/support/hotel00.html');//ご利用ガイド
    $otAnchorlinkHajimete.eq(11).prop('href','http://www.ena.travel/package/');//こちらから商品をお選びいただけます。
    $otAnchorlinkHajimete.eq(12).prop('href','http://www.ena.travel/package/');//こちらから商品をお選びいただけます。
    //$otAnchorlinkHajimete.eq(13).prop('href','http://52.196.97.215/6/hajimetenokatahe.html#ot-title_M-hajimete7');//お支払方法について####################################
    $otAnchorlinkHajimete.eq(14).prop('href','http://www.ena.travel/package/support/faq.html');//ご利用ガイド
    $otAnchorlinkHajimete.eq(15).prop('href','http://www.ena.travel/insurance/');//海外旅行保険
    $otAnchorlinkHajimete.eq(16).prop('href','http://www.ena.travel/special/cashpassport/');//キャッシュパスポート
    $otAnchorlinkHajimete.eq(17).prop('href','http://www.ena.travel/special/worldgift/');//海外おみやげ宅急便
    $otAnchorlinkHajimete.eq(18).prop('href','http://www.ena.travel/rentacar/');//海外レンタカー
    $otAnchorlinkHajimete.eq(19).prop('href','http://www.ena.travel/special/travel_goods/');//旅行用品
    $otAnchorlinkHajimete.eq(20).prop('href','http://www.ena.travel/special/train/');//鉄道バス・チケット
    $otAnchorlinkHajimete.eq(21).prop('href','http://www.ena.travel/special/myq/');//myQ
    $otAnchorlinkHajimete.eq(22).prop('href','http://www.ena.travel/ena/support/price_oversea.html');//ＶＩＳＡなどの代行手数料について
    //$otAnchorlinkHajimete.eq(23).prop('href','http://52.196.97.215/6/hajimetenokatahe.html#ot-title_M-hajimete7');//お支払方法について####################################
    $otAnchorlinkHajimete.eq(24).prop('href','http://kokunai.ena.travel/kokunai/air/?_ga=1.88372763.1474529826.1463980734');//こちらから商品をお選びいただけます。
    $otAnchorlinkHajimete.eq(25).prop('href','http://kokunai.ena.travel/kokunai/air/support/payment.html?_ga=1.88372763.1474529826.1463980734');//お支払方法について
    $otAnchorlinkHajimete.eq(26).prop('href','http://kokunai.ena.travel/kokunai/air/support/application.html?_ga=1.250508806.1474529826.1463980734');//ご利用ガイド
    $otAnchorlinkHajimete.eq(27).prop('href','http://www.ena.travel/special/tabireg/');//外務省海外旅行情報配信サービス「たびレジ」について
    $otAnchorlinkHajimete.eq(28).prop('href','http://www.ena.travel/ena/support/trust.html');//エアプラス３つの安心と信頼
    $otAnchorlinkHajimete.eq(29).prop('href','http://www.ena.travel/ena/support/sl.html');//弊社の取り組み
    
    var hajimete_flg1 = -1;
    var hajimete_flg2 = -1;
    var hajimete_flg3 = -1;
    var hajimete_flg4 = -1;
    var hajimete_flg5 = -1;
    var hajimete_flg6 = -1;
    var hajimete_flg7 = -1;
    var hajimete_flg8 = -1;
    var hajimete_flg9 = -1;
    
    $otAnchorlinkHajimete.eq(0).click(function(){
        $('#ot-modal').css({display:'block'});
        $('.ot-modal__contents').animate({
            scrollTop : 0
        }, {
            queue : false
        });
    });
    $otAnchorlinkHajimete.eq(5).click(function(){
        $('#ot-modal').css({display:'block'});
        $('.ot-modal__contents').animate({
            scrollTop : 0
        }, {
            queue : false
        });
    });
    $otAnchorlinkHajimete.eq(9).click(function(){
        $('#ot-modal').css({display:'block'});
        $('.ot-modal__contents').animate({
            scrollTop : 0
        }, {
            queue : false
        });
    });
    $otAnchorlinkHajimete.eq(13).click(function(){
        $('#ot-modal').css({display:'block'});
        $('.ot-modal__contents').animate({
            scrollTop : 0
        }, {
            queue : false
        });
    });
    $otAnchorlinkHajimete.eq(23).click(function(){
        $('#ot-modal').css({display:'block'});
        $('.ot-modal__contents').animate({
            scrollTop : 0
        }, {
            queue : false
        });
    });
    $('.close-ot-modal').click(function(){
        $('#ot-modal').css({display:'none'});
    });
    
    function reset_hide_hajimete(flg_num){
        var cur_flg_num = flg_num + 1;
        $('.ot-hidebox_hajimete').slideUp(1);
        $('.ot-hajimete_open').html("&#9660;");
        if(cur_flg_num != 1){hajimete_flg1 = -1;}
        if(cur_flg_num != 2){hajimete_flg2 = -1;}
        if(cur_flg_num != 3){hajimete_flg3 = -1;}
        if(cur_flg_num != 4){hajimete_flg4 = -1;}
        if(cur_flg_num != 5){hajimete_flg5 = -1;}
        if(cur_flg_num != 6){hajimete_flg6 = -1;}
        if(cur_flg_num != 7){hajimete_flg7 = -1;}
        if(cur_flg_num != 8){hajimete_flg8 = -1;}
        if(cur_flg_num != 9){hajimete_flg9 = -1;}
    }
    
    $('.ot-hajimete_topbtn').eq(0).click(function(){
        var cur_idx = 0;
        reset_hide_hajimete(cur_idx);
        if(hajimete_flg1 < 0){
            $('.ot-hidebox_hajimete').eq(cur_idx).slideDown(400,function(){
                var position_parent = $('.ot-hajimete_topbtn').eq(cur_idx).offset().top;
                $("html,body").animate({
                    scrollTop : position_parent
                }, {
                    queue : false
                });
            });
            $('.ot-hajimete_open').eq(cur_idx).html("&#9650;");
            hajimete_flg1 = 1;
        }else{
            $('.ot-hidebox_hajimete').eq(cur_idx).slideUp(1,function(){
                $("html,body").animate({
                    scrollTop : 0
                }, {
                    queue : false
                });
            });
            $('.ot-hajimete_open').eq(cur_idx).html("&#9660;");
            hajimete_flg1 = -1;
        }
    });
    $('.ot-hajimete_topbtn').eq(1).click(function(){
        var cur_idx = 1;
        reset_hide_hajimete(cur_idx);
        if(hajimete_flg2 < 0){
            $('.ot-hidebox_hajimete').eq(cur_idx).slideDown(400,function(){
                var position_parent = $('.ot-hajimete_topbtn').eq(cur_idx).offset().top;
                $("html,body").animate({
                    scrollTop : position_parent
                }, {
                    queue : false
                });
            });
            $('.ot-hajimete_open').eq(cur_idx).html("&#9650;");
            hajimete_flg2 = 1;
        }else{
            $('.ot-hidebox_hajimete').eq(cur_idx).slideUp(1,function(){
                $("html,body").animate({
                    scrollTop : 0
                }, {
                    queue : false
                });
            });
            $('.ot-hajimete_open').eq(cur_idx).html("&#9660;");
            hajimete_flg2 = -1;
        }
    });
    $('.ot-hajimete_topbtn').eq(2).click(function(){
        var cur_idx = 2;
        reset_hide_hajimete(cur_idx);
        if(hajimete_flg3 < 0){
            $('.ot-hidebox_hajimete').eq(cur_idx).slideDown(400,function(){
                var position_parent = $('.ot-hajimete_topbtn').eq(cur_idx).offset().top;
                $("html,body").animate({
                    scrollTop : position_parent
                }, {
                    queue : false
                });
            });
            $('.ot-hajimete_open').eq(cur_idx).html("&#9650;");
            hajimete_flg3 = 1;
        }else{
            $('.ot-hidebox_hajimete').eq(cur_idx).slideUp(1,function(){
                $("html,body").animate({
                    scrollTop : 0
                }, {
                    queue : false
                });
            });
            $('.ot-hajimete_open').eq(cur_idx).html("&#9660;");
            hajimete_flg3 = -1;
        }
    });
    $('.ot-hajimete_topbtn').eq(3).click(function(){
        var cur_idx = 3;
        reset_hide_hajimete(cur_idx);
        if(hajimete_flg4 < 0){
            $('.ot-hidebox_hajimete').eq(cur_idx).slideDown(400,function(){
                var position_parent = $('.ot-hajimete_topbtn').eq(cur_idx).offset().top;
                $("html,body").animate({
                    scrollTop : position_parent
                }, {
                    queue : false
                });
            });
            $('.ot-hajimete_open').eq(cur_idx).html("&#9650;");
            hajimete_flg4 = 1;
        }else{
            $('.ot-hidebox_hajimete').eq(cur_idx).slideUp(1,function(){
                $("html,body").animate({
                    scrollTop : 0
                }, {
                    queue : false
                });
            });
            $('.ot-hajimete_open').eq(cur_idx).html("&#9660;");
            hajimete_flg4 = -1;
        }
    });
    $('.ot-hajimete_topbtn').eq(4).click(function(){
        var cur_idx = 4;
        reset_hide_hajimete(cur_idx);
        if(hajimete_flg5 < 0){
            $('.ot-hidebox_hajimete').eq(cur_idx).slideDown(400,function(){
                var position_parent = $('.ot-hajimete_topbtn').eq(cur_idx).offset().top;
                $("html,body").animate({
                    scrollTop : position_parent
                }, {
                    queue : false
                });
            });
            $('.ot-hajimete_open').eq(cur_idx).html("&#9650;");
            hajimete_flg5 = 1;
        }else{
            $('.ot-hidebox_hajimete').eq(cur_idx).slideUp(1,function(){
                $("html,body").animate({
                    scrollTop : 0
                }, {
                    queue : false
                });
            });
            $('.ot-hajimete_open').eq(cur_idx).html("&#9660;");
            hajimete_flg5 = -1;
        }
    });
    $('.ot-hajimete_topbtn').eq(5).click(function(){
        var cur_idx = 5;
        reset_hide_hajimete(cur_idx);
        if(hajimete_flg6 < 0){
            $('.ot-hidebox_hajimete').eq(cur_idx).slideDown(400,function(){
                var position_parent = $('.ot-hajimete_topbtn').eq(cur_idx).offset().top;
                $("html,body").animate({
                    scrollTop : position_parent
                }, {
                    queue : false
                });
            });
            $('.ot-hajimete_open').eq(cur_idx).html("&#9650;");
            hajimete_flg6 = 1;
        }else{
            $('.ot-hidebox_hajimete').eq(cur_idx).slideUp(1,function(){
                $("html,body").animate({
                    scrollTop : 0
                }, {
                    queue : false
                });
            });
            $('.ot-hajimete_open').eq(cur_idx).html("&#9660;");
            hajimete_flg6 = -1;
        }
    });
    $('.ot-hajimete_topbtn').eq(6).click(function(){
        var cur_idx = 6;
        reset_hide_hajimete(cur_idx);
        if(hajimete_flg7 < 0){
            $('.ot-hidebox_hajimete').eq(cur_idx).slideDown(400,function(){
                var position_parent = $('.ot-hajimete_topbtn').eq(cur_idx).offset().top;
                $("html,body").animate({
                    scrollTop : position_parent
                }, {
                    queue : false
                });
            });
            $('.ot-hajimete_open').eq(cur_idx).html("&#9650;");
            hajimete_flg7 = 1;
        }else{
            $('.ot-hidebox_hajimete').eq(cur_idx).slideUp(1,function(){
                $("html,body").animate({
                    scrollTop : 0
                }, {
                    queue : false
                });
            });
            $('.ot-hajimete_open').eq(cur_idx).html("&#9660;");
            hajimete_flg7 = -1;
        }
    });
    $('.ot-hajimete_topbtn').eq(7).click(function(){
        var cur_idx = 7;
        reset_hide_hajimete(cur_idx);
        if(hajimete_flg8 < 0){
            $('.ot-hidebox_hajimete').eq(cur_idx).slideDown(400,function(){
                var position_parent = $('.ot-hajimete_topbtn').eq(cur_idx).offset().top;
                $("html,body").animate({
                    scrollTop : position_parent
                }, {
                    queue : false
                });
            });
            $('.ot-hajimete_open').eq(cur_idx).html("&#9650;");
            hajimete_flg8 = 1;
        }else{
            $('.ot-hidebox_hajimete').eq(cur_idx).slideUp(1,function(){
                $("html,body").animate({
                    scrollTop : 0
                }, {
                    queue : false
                });
            });
            $('.ot-hajimete_open').eq(cur_idx).html("&#9660;");
            hajimete_flg8 = -1;
        }
    });
    $('.ot-hajimete_topbtn').eq(8).click(function(){
        var cur_idx = 8;
        reset_hide_hajimete(cur_idx);
        if(hajimete_flg9 < 0){
            $('.ot-hidebox_hajimete').eq(cur_idx).slideDown(400,function(){
                var position_parent = $('.ot-hajimete_topbtn').eq(cur_idx).offset().top;
                $("html,body").animate({
                    scrollTop : position_parent
                }, {
                    queue : false
                });
            });
            $('.ot-hajimete_open').eq(cur_idx).html("&#9650;");
            hajimete_flg9 = 1;
        }else{
            $('.ot-hidebox_hajimete').eq(cur_idx).slideUp(1,function(){
                $("html,body").animate({
                    scrollTop : 0
                }, {
                    queue : false
                });
            });
            $('.ot-hajimete_open').eq(cur_idx).html("&#9660;");
            hajimete_flg9 = -1;
        }
    });
    
    
    
    
    
    
    // DESC:リンク設定 :会社概要
    var $otAnchorlinkCompany = $('.ot-anchorlink-company');
    $otAnchorlinkCompany.eq(0).prop('href','http://www.ena.travel/');//サービスサイトを見る
    $otAnchorlinkCompany.eq(1).prop('href','http://www.airplus.co.jp/com_corp.html');//エアプラス株式会社（Airplus Co.,Ltd.）
    $otAnchorlinkCompany.eq(2).prop('href','http://www.ena.travel/ena/support/trust.html');//日本旅行業協会正会員（JATA）
    $otAnchorlinkCompany.eq(3).prop('href','http://www.ena.travel/ena/support/trust.html');//国際航空運送協会（IATA）公認代理店
    $otAnchorlinkCompany.eq(4).prop('href','http://www.airplus.co.jp/');//【エアプラス株式会社（運営会社）】（http://www.airplus.co.jp/）
    $otAnchorlinkCompany.eq(5).prop('href','http://www.nsk.co.jp/');//【日本システム開発株式会社】（http://www.nsk.co.jp/）
    $otAnchorlinkCompany.eq(6).prop('href','http://www.dhe.co.jp/');//【DHE 株式会社（デジタルハリウッド エンタテインメント）】（http://www.dhe.co.jp/）
    
    // DESC:リンク設定 :条件書
    var $otAnchorlinkCondition = $('.ot-anchorlink-condition');
    $otAnchorlinkCondition.eq(0).prop('href','http://www.ena.travel/ena/support/change_rate.html');//サービスサイトを見る

    // DESC:リンク設定 :ご利用の流れ
    var $otAnchorlinkFlow = $('.ot-anchorlink-flow');
    $otAnchorlinkFlow.eq(0).prop('href','http://www.ena.travel/ena/support/userguidesettle.html?&_ga=1.64330863.1114229888.1464318454#con');//詳しくはコチラ
    $otAnchorlinkFlow.eq(1).prop('href','http://www.econtext.jp/sp_support/cvs.html');//コンビニ端末利用法はコチラ
    $otAnchorlinkFlow.eq(2).prop('href','mailto:yoyaku@ena.travel');//メール
    // 各タイトルのtotop
    $('.ot-flow_totop').click(function(){
        var position_parent = $('#ot-flow_menu').offset().top;
        $("html,body").animate({
            scrollTop : position_parent
        }, {
            queue : false
        });
    });
    // ご利用の流れのメニューボタンを押して各コンテンツの表示切り替え
    var flow_flg1 = -1;
    var flow_flg2 = -1;
    var flow_flg3 = -1;
    var flow_flg4 = -1;
    var flow_flg5 = -1;
    var flow_flg6 = -1;
    var flow_titlenum = -1;
    function reset_hide_flow(flg_num){
        $('.ot-hidebox_flow').slideUp(1);
        $('.ot-flow_open').html("&#9660;");
        if(flg_num != 1){flow_flg1 = -1;}
        if(flg_num != 2){flow_flg2 = -1;}
        if(flg_num != 3){flow_flg3 = -1;}
        if(flg_num != 4){flow_flg4 = -1;}
        if(flg_num != 5){flow_flg5 = -1;}
        if(flg_num != 6){flow_flg6 = -1;}
    }
    $('.ot-flow_topbtn').eq(0).click(function(){
        reset_hide_flow(1);
        if(flow_flg1 < 0){
            $('.ot-hidebox_flow').eq(0).slideDown(400,function(){
                var position_parent = $('.ot-flow_topbtn').eq(0).offset().top;
                $("html,body").animate({
                    scrollTop : position_parent
                }, {
                    queue : false
                });
            });
            $('.ot-flow_open').eq(0).html("&#9650;");
            flow_flg1 = 1;
            flow_titlenum = 0;
        }else{
            $('.ot-hidebox_flow').eq(0).slideUp(400,function(){
                $("html,body").animate({
                    scrollTop : 0
                }, {
                    queue : false
                });
            });
            $('.ot-flow_open').eq(0).html("&#9660;");
            flow_flg1 = -1;
            flow_titlenum = -1;
        }
    });
    $('.ot-flow_topbtn').eq(1).click(function(){
        reset_hide_flow(2);
        if(flow_flg2 < 0){
            $('.ot-hidebox_flow').eq(1).slideDown(400,function(){
                var position_parent = $('.ot-flow_topbtn').eq(1).offset().top;
                $("html,body").animate({
                    scrollTop : position_parent
                }, {
                    queue : false
                });
            });
            $('.ot-flow_open').eq(1).html("&#9650;");
            flow_flg2 = 1;
            flow_titlenum = 1;
        }else{
            $('.ot-hidebox_flow').eq(1).slideUp(400,function(){
                $("html,body").animate({
                    scrollTop : 0
                }, {
                    queue : false
                });
            });
            $('.ot-flow_open').eq(1).html("&#9660;");
            flow_flg2 = -1;
            flow_titlenum = -1;
        }
    });
    $('.ot-flow_topbtn').eq(2).click(function(){
        reset_hide_flow(3);
        if(flow_flg3 < 0){
            $('.ot-hidebox_flow').eq(2).slideDown(400,function(){
                var position_parent = $('.ot-flow_topbtn').eq(2).offset().top;
                $("html,body").animate({
                    scrollTop : position_parent
                }, {
                    queue : false
                });
            });
            $('.ot-flow_open').eq(2).html("&#9650;");
            flow_flg3 = 1;
            flow_titlenum = 2;
        }else{
            $('.ot-hidebox_flow').eq(2).slideUp(400,function(){
                $("html,body").animate({
                    scrollTop : 0
                }, {
                    queue : false
                });
            });
            $('.ot-flow_open').eq(2).html("&#9660;");
            flow_flg3 = -1;
            flow_titlenum = -1;
        }
    });
    $('.ot-flow_topbtn').eq(3).click(function(){
        reset_hide_flow(4);
        if(flow_flg4 < 0){
            $('.ot-hidebox_flow').eq(3).slideDown(400,function(){
                var position_parent = $('.ot-flow_topbtn').eq(3).offset().top;
                $("html,body").animate({
                    scrollTop : position_parent
                }, {
                    queue : false
                });
            });
            $('.ot-flow_open').eq(3).html("&#9650;");
            flow_flg4 = 1;
            flow_titlenum = 3;
        }else{
            $('.ot-hidebox_flow').eq(3).slideUp(400,function(){
                $("html,body").animate({
                    scrollTop : 0
                }, {
                    queue : false
                });
            });
            $('.ot-flow_open').eq(3).html("&#9660;");
            flow_flg4 = -1;
            flow_titlenum = -1;
        }
    });
    $('.ot-flow_topbtn').eq(4).click(function(){
        reset_hide_flow(5);
        if(flow_flg5 < 0){
            $('.ot-hidebox_flow').eq(4).slideDown(400,function(){
                var position_parent = $('.ot-flow_topbtn').eq(4).offset().top;
                $("html,body").animate({
                    scrollTop : position_parent
                }, {
                    queue : false
                });
            });
            $('.ot-flow_open').eq(4).html("&#9650;");
            flow_flg5 = 1;
            flow_titlenum = 4;
        }else{
            $('.ot-hidebox_flow').eq(4).slideUp(400,function(){
                $("html,body").animate({
                    scrollTop : 0
                }, {
                    queue : false
                });
            });
            $('.ot-flow_open').eq(4).html("&#9660;");
            flow_flg5 = -1;
            flow_titlenum = -1;
        }
    });
    $('.ot-flow_topbtn').eq(5).click(function(){
        reset_hide_flow(6);
        if(flow_flg6 < 0){
            $('.ot-hidebox_flow').eq(5).slideDown(400,function(){
                var position_parent = $('.ot-flow_topbtn').eq(5).offset().top;
                $("html,body").animate({
                    scrollTop : position_parent
                }, {
                    queue : false
                });
            });
            $('.ot-flow_open').eq(5).html("&#9650;");
            flow_flg6 = 1;
            flow_titlenum = 5;
            $('.ot-circle_flow_back').eq(flow_titlenum).fadeIn(1);
        }else{
            $('.ot-hidebox_flow').eq(5).slideUp(400,function(){
                $("html,body").animate({
                    scrollTop : 0
                }, {
                    queue : false
                });
            });
            $('.ot-flow_open').eq(5).html("&#9660;");
            flow_flg6 = -1;
            flow_titlenum = -1;
            $('.ot-circle_flow_back').fadeOut(1);
        }
    });
    // ご注意への移動
    $('.cautionlink1').click(function(){
        var position_parent = $('#ot-cautiontitle_M1').offset().top;
        $('.ot-circle_flow_back').eq(0).fadeIn(1);
        $("html,body").animate({
            scrollTop : position_parent
        }, {
            queue : false
        });
    });
    $('.cautionlink2').click(function(){
        var position_parent = $('#ot-cautiontitle_M2').offset().top;
        $('.ot-circle_flow_back').eq(1).fadeIn(1);
        $("html,body").animate({
            scrollTop : position_parent
        }, {
            queue : false
        });
    });
    $('.cautionlink3').click(function(){
        var position_parent = $('#ot-cautiontitle_M3').offset().top;
        $('.ot-circle_flow_back').eq(2).fadeIn(1);
        $("html,body").animate({
            scrollTop : position_parent
        }, {
            queue : false
        });
    });
    $('.cautionlink4').click(function(){
        var position_parent = $('#ot-cautiontitle_M4').offset().top;
        $('.ot-circle_flow_back').eq(3).fadeIn(1);
        $("html,body").animate({
            scrollTop : position_parent
        }, {
            queue : false
        });
    });
    // 注意の右側にあるＴＯＰへ戻るボタンをクリックした場合
    $('.ot-circle_flow_back').click(function(){
        var position_parent = $('.ot-flow_topbtn').eq(flow_titlenum).offset().top;
        $("html,body").animate({
            scrollTop : position_parent
        }, {
            queue : false
        });
        $(this).css({display:'none'});
    });

    
    
    
    
    // リンク設定ここまで ######################################################################################
    
    
    // COM:条件書のページのTABLEデータ
    $('.tbl1_a').eq(0).html("業務範囲");
    $('.tbl1_a').eq(1).html("登録番号");
    $('.tbl1_a').eq(2).html("登録年月日");
    $('.tbl1_a').eq(3).html("有効期限");
    $('.tbl1_a').eq(4).html("氏名又は名称");
    $('.tbl1_a').eq(5).html("営業所");
    $('.tbl1_a').eq(6).html("住所");
    $('.tbl1_a').eq(7).html("Eメール");
    $('.tbl1_a').eq(8).html("営業日");
    $('.tbl1_a').eq(9).html("休業日");
    $('.tbl1_a').eq(10).html("営業時間");
    $('.tbl1_a').eq(11).html("主任者対応時間");
    $('.tbl1_a').eq(12).html("管理主任者");
    $('.tbl1_a').eq(13).html("受託取扱企画旅行会社名");
    $('.tbl1_a').eq(14).html("所属旅行業協会");

    $('.tbl1_b').eq(0).html("海外旅行・国内旅行");
    $('.tbl1_b').eq(1).html("観光庁長官登録旅行業　第1833号");
    $('.tbl1_b').eq(2).html("平成8年4月12日");
    $('.tbl1_b').eq(3).html("平成26年4月12日から平成31年4月11日まで");
    $('.tbl1_b').eq(4).html("エアプラス株式会社");
    $('.tbl1_b').eq(5).html("ena(イーナ)　オペレーションセンター");
    $('.tbl1_b').eq(6).html("東京都港区新橋2-12-15　田中田村町ビル４階");
    $('.tbl1_b').eq(7).html("<a href='mailto:info@ena.travel'>info@ena.travel</a>");
    $('.tbl1_b').eq(8).html("月曜日～土曜日");
    $('.tbl1_b').eq(9).html("日曜日、祝日、年末年始");
    $('.tbl1_b').eq(10).html("月曜日～金曜日の9時45分～18時00分、土曜日の9時45分～17時00分 <br>※電話での受付は月曜～金曜の営業時間内とさせていただき　土曜はメールのみの受付・対応となっております。");
    $('.tbl1_b').eq(11).html("上記営業日の営業時間内");
    $('.tbl1_b').eq(12).html("総合旅行業取扱管理者：登山幸典<br>【総合旅行業取扱管理者とは、お客様の旅行を取り扱う営業所での取引の責任者です。この旅行の契約に関して担当者からの説明にご不明な点がありましたら、ご遠慮なく表記の総合旅行業取扱管理者にご質問下さい】");
    $('.tbl1_b').eq(13).html("（株）ユナイテッドツアーズ<br>（株）トラベルプラザインターナショナル<br>（株）アバンティリゾートクラブ<br>（株）クロノス・インターナショナル<br>（株）ジャルセールス<br>オーベルインターナショナル（株）<br>ジェイエッチシー（株）<br>（株）エヌ・ティー・エス<br>（株）アールアンドシーツアーズ<br>（株）オーバーシーズトラベル<br>（株）かもめ");
    $('.tbl1_b').eq(14).html("<a href='http://www.ena.travel/ena/support/trust.html'>社団法人　日本旅行業協会（JATA）</a>");
    
                            
    // 各種旅行関連書類 table  
    $('.tbl2_a').eq(0).html("<a href='http://www.ena.travel/ena/support/stipulation#tehai' target='_blank'>旅行業約款 手配旅行契約の部</a>");
    $('.tbl2_a').eq(1).html("<a href='/ena/support/stipulation#bosyu' target='_blank'>募集型企画旅行契約の部</a>");
    $('.tbl2_a').eq(2).html("<a href='/ena/support/price_domestic.html' target='_blank'>国内取扱料金表</a>");
                            
    $('.tbl2_b').eq(0).html("<a href='http://www.ena.travel/ena/support/stipulation#soudan' target='_blank'>旅行業約款 旅行相談契約の部</a>");
    $('.tbl2_b').eq(1).html("<a href='/ena/support/travel.html' target='_blank'>手配旅行条件書<br>（オンライン予約）</a>");
    $('.tbl2_b').eq(2).html("<a href='/ena/support/creditcard.html' target='_blank'>クレジットカード利用規約</a>");

    $('.tbl2_c').eq(0).html("<a href='http://www.ena.travel/ena/support/stipulation#tokou' target='_blank'>渡航手続代行契約の部</a>");
    $('.tbl2_c').eq(1).html("<a href='http://www.ena.travel/ena/support/price_oversea.html' target='_blank'>海外取扱料金表</a>");
                            
                            
    // COM:初めての方へ ----------------------------------------------------------------------------------
    // DESC:javascript動作判定
    $('#ot-jsoff').html("※現在お使いのブラウザはJavascriptの設定が有効になっています。このままの状態でena(イーナ)をご覧ください。");
                            
                            
    // COM:初めての方へ ----------------------------------------------------------------------------------
    //$("#ot-howtouse_step1").load("ot-howtouse_step1.html");
    $('.ot-howtouse_topbtn').eq(0).click(function(){
        $.ajax('howtouse_step1.html', {
            timeout : 1000,
            datatype:'html'
        }).then(function(data){
            $('#ot-howtouse_step1').html(data);
        },function(jqXHR, textStatus) {
            if(textStatus!=="success") {
                var txt = "<p>textStatus:"+ textStatus + "</p>" +
                    "<p>status:"+ jqXHR.status + "</p>" +
                    "<p>responseText : </p><div>" + jqXHR.responseText +
                    "</div>";
                $('#ot-howtouse_step1').html(txt);
            }
        });
    });
    
    

});