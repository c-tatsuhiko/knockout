// Grlobal
var showAlert;

(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
(function() {
  'use strict';

  //
  // Require
  //
	  var scrollpos;
  //
  // Modal window
  //
  $('#js-show-header-menu').on('click', function() {

    $('#js-header-menu').fadeIn('fast');
    if(!$('#body').hasClass('is-modal-open')) {
      $('#body').addClass('is-modal-open');
    }

    return false;
  });

  $('#js-close-header-menu').on('click', function() {

    $('#js-header-menu').fadeOut('fast');
    if($('#body').hasClass('is-modal-open')) {
      $('#body').removeClass('is-modal-open');
    }

    return false;
  });

  $('.js-show-modal').on('click', function() {
	scrollpos = $(window).scrollTop();

    var tarId = '#' + $(this).attr('data-target');

    $(tarId).fadeIn('fast');
    if(!$('#body').hasClass('is-modal-open')) {
      $('#body').addClass('is-modal-open');
    }

    $(tarId).find('.js-modal-contents').scrollTop(0);
    $(tarId).find('.js-slider').slick('setPosition');
    $(tarId).find('.js-carousel').slick('setPosition');

    $(tarId).find('.js-accordion-wrapper').removeClass('is-open');
    $(tarId).find('.js-toggle-accordion').removeClass('is-open');
    $(tarId).find('.js-accordion-contents').hide();

    return false;
  });

  $('.js-close-modal').on('click', function() {
    closeModal(this);
    return false;
  });

  function closeModal(tar) {
    var $closestModal = $(tar).closest('.js-modal');
    $closestModal.fadeOut('fast').find('.js-modal').fadeOut('fast');
    if($closestModal.parent().closest('.js-modal').length) {
      $('#body').removeClass('is-modal-open');

    }
    $('html,body').animate({scrollTop: scrollpos}, 100, 'swing');//スクロール

    return false;
  }

  $('.js-scroll-modal').on('click', function() {
    var target = $(this).attr('data-scrollto');
    scrollModal(target);
    return false;
  });

  $('.js-scroll-modal_hotel').on('click', function() {
    var target = $(this).attr('data-scrollto');
    scrollModal_hotel(target);
    return false;
  });

  function scrollModal(tar) {
    var $closestModalContents = $(tar).closest('.js-modal-contents');
    var $tar = $closestModalContents.find(tar).first();
    var boxScrollTop = $closestModalContents.scrollTop();

//    var targetTop2 = $tar.position().offset();
    if ($tar.position() && undefined == $tar.position().top) {
      var targetTop2 = $tar.position().offset();
      var targetTop = $targetTop2.top;
    }

    var speed = 400;
    $closestModalContents.stop().animate({
      scrollTop: boxScrollTop + targetTop
    });
  }

  function scrollModal_hotel(tar) {
    var $closestModalContents = $(tar).closest('.js-modal-contents');
    var $tar = $closestModalContents.find(tar).first();
    var boxScrollTop = $closestModalContents.scrollTop();
    var targetTop = $tar.position().top;
    var speed = 400;
    $closestModalContents.stop().animate({
      scrollTop: boxScrollTop + targetTop
    });
  }




  // Open Selector
  $('.js-open-selector').each(function() {
    var thisTemp = this;
    var tarId = '#' + $(this).attr('data-target');

    $(this).find('.js-select-item').on('click', function() {
      var selectValue = $(this).text();
      if($(this).hasClass('is-active')) {
        return;
      } else {
        $(thisTemp).find('.js-select-item').removeClass('is-active');
        $(this).addClass('is-active');
        setTimeout(function() {
          closeModal(thisTemp);
        }, 50);
      }

      $(tarId).text(selectValue);

      return false;
    });
  });

  //
  // Smooth scroll
  //
  $('.js-smooth-scroll').on('click', function() {
    var speed = 400;
    var adjustH = 0;
    var href= $(this).attr('href');
    var target = $(href === '#' || href === '' ? 'html' : href);
    var position = target.offset().top - adjustH;
    if(position < 0) {
      position = 0;
    }
    $('html, body').animate({scrollTop:position}, speed, 'swing');
    return false;
  });

  //
  // Go top
  //
  $(window).on('load scroll', function() {
    if($(window).scrollTop() > 70) {
      $('.js-show-scroll').removeClass('is-hide');
    } else {
      $('.js-show-scroll').addClass('is-hide');
    }
  });

  //
  // Tab
  //
  $(function() {
    $('.js-tabs').each(function() {
      var $tabs = $(this);
      var $siblingTabsWrapper = $tabs.siblings('.js-tabs');

      $(this).find('.js-tab').on('click', function() {
        var index = $(this).closest('.js-tabs').find('.js-tab').index(this);

        $tabs.add($siblingTabsWrapper).each(function() {
          $(this).find('.js-tab').removeClass('is-active').eq(index).addClass('is-active');
        });
        var $targetContents = $tabs.siblings('.js-tab-contents');
        $targetContents.removeClass('is-active').eq(index).addClass('is-active');

        $targetContents.find('.js-accordion-wrapper').removeClass('is-open');
        $targetContents.find('.js-toggle-accordion').removeClass('is-open');
        $targetContents.find('.js-accordion-contents').hide();

        scrollToTabs(this);

        return false;
      });
    });

    $('.js-tab-pager').on('click', function() {
      var targetTabs = $(this).attr('data-tabs');
      var pageIndex = $(this).attr('data-page');
      var $tabsWrapper = $(targetTabs).closest('.js-tabs-wrapper');
      $tabsWrapper.children('.js-tabs').each(function() {
        $(this).find('.js-tab').removeClass('is-active').eq(pageIndex).addClass('is-active');
      });
      $tabsWrapper.children('.js-tab-contents').removeClass('is-active').eq(pageIndex).addClass('is-active');

      scrollToTabs(targetTabs);
    });

    function scrollToTabs(tab) {
      var $tabsWrapper = $(tab).closest('.js-tabs-wrapper');
      var speed = 400;
//      var tabsWrapperTop = $tabsWrapper.position().top;
     if ($tabsWrapper.position()) {
       var tabsWrapperTop = $tabsWrapper.position().top;
     }
      // if(tabsWrapperTop < 0) {
        scrollModal($tabsWrapper);
      // }
    }
  });

  //
  // Accordion
  //
  $(function() {
    $('.js-toggle-accordion').on('click', function() {
      var $accordionWrapper = $(this).closest('.js-accordion-wrapper');
      var $accordionToggle = $accordionWrapper.find('.js-toggle-accordion');
      var $accordionContents = $accordionWrapper.children('.js-accordion-contents');

      if($accordionWrapper.hasClass('is-open')) {
        $accordionWrapper.removeClass('is-open');
        $accordionToggle.removeClass('is-open');
        $accordionContents.slideUp('fast');

      } else {
        $accordionWrapper.addClass('is-open');
        $accordionToggle.addClass('is-open');
        $accordionContents.slideDown('fast');
      }

      if(!$accordionToggle.hasClass('checkbox')) {
        return false;
      }
    });
  });

  $(function() {
    $('.js-close-accordion').on('click', function() {
      var $accordionWrapper = $(this).closest('.js-accordion-wrapper');
      var $accordionToggle = $accordionWrapper.find('.js-toggle-accordion');
      var $accordionContents = $accordionWrapper.children('.js-accordion-contents');

      $accordionWrapper.removeClass('is-open');
      $accordionToggle.removeClass('is-open');
      $accordionContents.slideUp('fast');

      scrollModal($accordionWrapper);

      return false;
    });
  });

  //
  // Alert
  //
  $(function() {
	  showAlert = function (message, positive) {
      if(positive) {
        $('#js-alert-box').removeClass('is-negative');
      } else {
        $('#js-alert-box').addClass('is-negative');
      }
      $('#js-alert-box')
        .text(message)
        .addClass('is-show')
        .delay(2000).queue(function() {
          $(this).removeClass('is-show').dequeue();
        });
    }

    $('.js-toggle-fav').on('click', function() {
      if($(this).hasClass('is-fav')) {
        $(this).closest('.js-item-wrapper').find('.js-toggle-fav').removeClass('is-fav');
        showAlert('お気に入りから削除しました', false);
      } else {
        $(this).closest('.js-item-wrapper').find('.js-toggle-fav').addClass('is-fav');
        showAlert('お気に入りに追加しました', true);
      }
      return false;
    });
  });

  //
  // Suggestion
  //
  $(function() {
    $('.js-open-input-airport').on('click', function() {
      var $modalAirport = $(this).next('.js-modal-input-airport');
      var $inputAirport = $modalAirport.find('.input-airport:first');
      var inputAirportPos = $(this).offset().top;
      var speed = 400;

      $('html, body').animate({scrollTop:inputAirportPos}, speed, 'swing');
      $modalAirport.fadeIn('fast');
      $inputAirport.focus();
      return false;
    });

    $('.js-close-input-airport').on('click', function() {
      $(this).closest('.js-modal-input-airport').fadeOut('fast').find('.input-airport:first').focusout();
      return false;
    });

    $('.js-select-airport').on('click', function() {
      $(this).closest('.js-modal-input-airport').fadeOut('fast');
      return false;
    });
  });

  //
  // Add flight
  //
  $(function() {
    var flightHtml = '<div class="search-form__flight form-flight js-form-flight"><div class="form-flight__header"><p class="flight-num"><svg role="image" class="icon-flight"><use xlink:href="/m/images/icons.svg#aircraft" /></svg>フライト<span class="js-flight-num">2</span></p><a href="#" class="delete-flight js-delete-flight">削除<span class="icon-close"></span></a></div><div class="search-form__row"><div class="search-airport is-departure"><a href="#" class="search-item js-open-input-airport"><span class="search-item__title"><svg role="image" class="svg-icon icon-departure"><use xlink:href="/m/images/icons.svg#takeoff"></svg><span class="label">出発地</span></span></a><div class="modal-input-airport js-modal-input-airport"><div class="input-airport-bg js-close-input-airport"></div><div class="input-area"><input type="text" class="input-airport"><div class="suggest-airport"><div class="suggest-airport__tabs js-tabs"><a href="#" class="tab js-tab">検索</a><a href="#" class="tab js-tab is-active">候補</a></div><div class="suggest-airport__body is-search suggest-tab-contents js-tab-contents"><p class="alert-message tab-contents-item is-alert">空港名・都市などを入力してください</p><div class="suggested-search tab-contents-item"></div><div class="suggested-search tab-contents-item"><a href="#" class="suggested-search__item js-select-airport"><span class="serial">HND</span><span class="detail"><span class="city">東京</span><span class="name">東京国際空港（羽田空港）</span></span></a></div><div class="input-airport-history tab-contents-item"><p class="input-airport-history__title">検索履歴</p><div class="suggested-search history"><a href="#" class="suggested-search__item js-select-airport"><span class="serial">NRT</span><span class="detail"><span class="city">千葉</span><span class="name">成田国際空港</span></span></a><a href="#" class="suggested-search__item js-select-airport"><span class="serial">ETD</span><span class="detail"><span class="city">ドバイ</span><span class="name">エティハド航空 エティハドトラベルモール・バスステーション</span></span></a><a href="#" class="suggested-search__item js-select-airport"><span class="serial">ACY</span><span class="detail"><span class="city">アトランティックシティ（ニュージャージー）</span><span class="name">アトランティックシティ国際空港</span></span></a><a href="#" class="suggested-search__item js-select-airport"><span class="serial">KIX</span><span class="detail"><span class="city">大阪</span><span class="name">関西国際空港</span></span></a><a href="#" class="suggested-search__item js-select-airport"><span class="serial">NGO</span><span class="detail"><span class="city">愛知</span><span class="name">中部国際空港</span></span></a></div></div></div><div class="suggest-airport__body suggest-tab-contents js-tab-contents is-active"><p class="alert-message tab-contents-item is-alert"> 下記より出発地をお選びいただくか、都市名を直接入力ください。 </p><div class="suggested-city tab-contents-item"><h3 class="suggested-city__area-name">【東アジア】</h3><a href="#" class="suggested-city__item js-select-airport" data-id="SEL">ソウル</a>  <a href="#" class="suggested-city__item js-select-airport" data-id="PUS">プサン</a>  <a href="#" class="suggested-city__item js-select-airport" data-id="TPE">台北</a>  <a href="#" class="suggested-city__item js-select-airport" data-id="HKG">香港</a>  <a href="#" class="suggested-city__item js-select-airport" data-id="SHA">上海</a>  <a href="#" class="suggested-city__item js-select-airport" data-id="BJS">北京</a>  <a href="#" class="suggested-city__item js-select-airport" data-id="CAN">広州</a>  <a href="#" class="suggested-city__item js-select-airport" data-id="MFM">マカオ</a><h3 class="suggested-city__area-name">【東南アジア】</h3>  <a href="#" class="suggested-city__item js-select-airport" data-id="BKK">バンコク</a>  <a href="#" class="suggested-city__item js-select-airport" data-id="KUL">クアラルンプール</a>  <a href="#" class="suggested-city__item js-select-airport" data-id="SIN">シンガポール</a>  <a href="#" class="suggested-city__item js-select-airport" data-id="MNL">マニラ</a>  <a href="#" class="suggested-city__item js-select-airport" data-id="SGN">ホーチミン</a>  <a href="#" class="suggested-city__item js-select-airport" data-id="HAN">ハノイ</a>  <a href="#" class="suggested-city__item js-select-airport" data-id="JKT">ジャカルタ</a><h3 class="suggested-city__area-name">【アメリカ】</h3>  <a href="#" class="suggested-city__item js-select-airport" data-id="LAX">ロサンゼルス</a>  <a href="#" class="suggested-city__item js-select-airport" data-id="SFO">サンフランシスコ</a>  <a href="#" class="suggested-city__item js-select-airport" data-id="LAS">ラスベガス</a>  <a href="#" class="suggested-city__item js-select-airport" data-id="CHI">シカゴ</a>  <a href="#" class="suggested-city__item js-select-airport" data-id="NYC">ニューヨーク</a>  <a href="#" class="suggested-city__item js-select-airport" data-id="YVR">バンクーバー</a>  <a href="#" class="suggested-city__item js-select-airport" data-id="YTO">トロント</a>  <a href="#" class="suggested-city__item js-select-airport" data-id="MEX">メキシコシティ</a><h3 class="suggested-city__area-name">【ヨーロッパ】</h3>  <a href="#" class="suggested-city__item js-select-airport" data-id="PAR">パリ</a>  <a href="#" class="suggested-city__item js-select-airport" data-id="LON">ロンドン</a>  <a href="#" class="suggested-city__item js-select-airport" data-id="FRA">フランクフルト</a>  <a href="#" class="suggested-city__item js-select-airport" data-id="ROM">ローマ</a>  <a href="#" class="suggested-city__item js-select-airport" data-id="MIL">ミラノ</a>  <a href="#" class="suggested-city__item js-select-airport" data-id="MAD">マドリード</a>  <a href="#" class="suggested-city__item js-select-airport" data-id="BCN">バルセロナ</a><h3 class="suggested-city__area-name">【ビーチ他】</h3>  <a href="#" class="suggested-city__item js-select-airport" data-id="CEB">セブ島</a>  <a href="#" class="suggested-city__item js-select-airport" data-id="DPS">デンパサール（バリ島）</a>  <a href="#" class="suggested-city__item js-select-airport" data-id="USM">サムイ</a>  <a href="#" class="suggested-city__item js-select-airport" data-id="HKT">プーケット</a>  <a href="#" class="suggested-city__item js-select-airport" data-id="HNL">ホノルル</a>  <a href="#" class="suggested-city__item js-select-airport" data-id="GUM">グアム</a>  <a href="#" class="suggested-city__item js-select-airport" data-id="SPN">サイパン</a>  <a href="#" class="suggested-city__item js-select-airport" data-id="SYD">シドニー</a>  <a href="#" class="suggested-city__item js-select-airport" data-id="AKL">オークランド</a></div></div></div></div></div></div><div class="search-airport is-arrival"><a href="#" class="search-item js-open-input-airport"><span class="search-item__title"><svg role="image" class="svg-icon icon-arrival"><use xlink:href="/m/images/icons.svg#landing"></svg><span class="label">目的地</span></span></a><div class="modal-input-airport js-modal-input-airport"><div class="input-airport-bg js-close-input-airport"></div><div class="input-area"><input type="text" class="input-airport"><div class="suggest-airport"><div class="suggest-airport__tabs js-tabs"><a href="#" class="tab js-tab">検索</a><a href="#" class="tab js-tab is-active">人気都市</a></div><div class="suggest-airport__body is-search suggest-tab-contents js-tab-contents"><div class="suggested-search tab-contents-item"><a href="#" class="suggested-search__item js-select-airport"><span class="serial">HND</span><span class="detail"><span class="city">東京</span><span class="name">東京国際空港（羽田空港）</span></span></a></div><div class="input-airport-history tab-contents-item"><p class="input-airport-history__title">検索履歴</p><div class="suggested-search history"><a href="#" class="suggested-search__item js-select-airport"><span class="serial">NRT</span><span class="detail"><span class="city">千葉</span><span class="name">成田国際空港</span></span></a><a href="#" class="suggested-search__item js-select-airport"><span class="serial">ETD</span><span class="detail"><span class="city">ドバイ</span><span class="name">エティハド航空 エティハドトラベルモール・バスステーション</span></span></a><a href="#" class="suggested-search__item js-select-airport"><span class="serial">ACY</span><span class="detail"><span class="city">アトランティックシティ（ニュージャージー）</span><span class="name">アトランティックシティ国際空港</span></span></a><a href="#" class="suggested-search__item js-select-airport"><span class="serial">KIX</span><span class="detail"><span class="city">大阪</span><span class="name">関西国際空港</span></span></a><a href="#" class="suggested-search__item js-select-airport"><span class="serial">NGO</span><span class="detail"><span class="city">愛知</span><span class="name">中部国際空港</span></span></a></div></div></div><div class="suggest-airport__body suggest-tab-contents js-tab-contents is-active"><p class="alert-message tab-contents-item is-alert"> 下記より目的地をお選びいただくか、都市名を直接入力ください。 </p><div class="suggested-city tab-contents-item"><h3 class="suggested-city__area-name">【東アジア】</h3><a href="#" class="suggested-city__item js-select-airport" data-id="SEL">ソウル</a>  <a href="#" class="suggested-city__item js-select-airport" data-id="PUS">プサン</a>  <a href="#" class="suggested-city__item js-select-airport" data-id="TPE">台北</a>  <a href="#" class="suggested-city__item js-select-airport" data-id="HKG">香港</a>  <a href="#" class="suggested-city__item js-select-airport" data-id="SHA">上海</a>  <a href="#" class="suggested-city__item js-select-airport" data-id="BJS">北京</a>  <a href="#" class="suggested-city__item js-select-airport" data-id="CAN">広州</a>  <a href="#" class="suggested-city__item js-select-airport" data-id="MFM">マカオ</a><h3 class="suggested-city__area-name">【東南アジア】</h3>  <a href="#" class="suggested-city__item js-select-airport" data-id="BKK">バンコク</a>  <a href="#" class="suggested-city__item js-select-airport" data-id="KUL">クアラルンプール</a>  <a href="#" class="suggested-city__item js-select-airport" data-id="SIN">シンガポール</a>  <a href="#" class="suggested-city__item js-select-airport" data-id="MNL">マニラ</a>  <a href="#" class="suggested-city__item js-select-airport" data-id="SGN">ホーチミン</a>  <a href="#" class="suggested-city__item js-select-airport" data-id="HAN">ハノイ</a>  <a href="#" class="suggested-city__item js-select-airport" data-id="JKT">ジャカルタ</a><h3 class="suggested-city__area-name">【アメリカ】</h3>  <a href="#" class="suggested-city__item js-select-airport" data-id="LAX">ロサンゼルス</a>  <a href="#" class="suggested-city__item js-select-airport" data-id="SFO">サンフランシスコ</a>  <a href="#" class="suggested-city__item js-select-airport" data-id="LAS">ラスベガス</a>  <a href="#" class="suggested-city__item js-select-airport" data-id="CHI">シカゴ</a>  <a href="#" class="suggested-city__item js-select-airport" data-id="NYC">ニューヨーク</a>  <a href="#" class="suggested-city__item js-select-airport" data-id="YVR">バンクーバー</a>  <a href="#" class="suggested-city__item js-select-airport" data-id="YTO">トロント</a>  <a href="#" class="suggested-city__item js-select-airport" data-id="MEX">メキシコシティ</a><h3 class="suggested-city__area-name">【ヨーロッパ】</h3>  <a href="#" class="suggested-city__item js-select-airport" data-id="PAR">パリ</a>  <a href="#" class="suggested-city__item js-select-airport" data-id="LON">ロンドン</a>  <a href="#" class="suggested-city__item js-select-airport" data-id="FRA">フランクフルト</a>  <a href="#" class="suggested-city__item js-select-airport" data-id="ROM">ローマ</a>  <a href="#" class="suggested-city__item js-select-airport" data-id="MIL">ミラノ</a>  <a href="#" class="suggested-city__item js-select-airport" data-id="MAD">マドリード</a>  <a href="#" class="suggested-city__item js-select-airport" data-id="BCN">バルセロナ</a><h3 class="suggested-city__area-name">【ビーチ他】</h3>  <a href="#" class="suggested-city__item js-select-airport" data-id="CEB">セブ島</a>  <a href="#" class="suggested-city__item js-select-airport" data-id="DPS">デンパサール（バリ島）</a>  <a href="#" class="suggested-city__item js-select-airport" data-id="USM">サムイ</a>  <a href="#" class="suggested-city__item js-select-airport" data-id="HKT">プーケット</a>  <a href="#" class="suggested-city__item js-select-airport" data-id="HNL">ホノルル</a>  <a href="#" class="suggested-city__item js-select-airport" data-id="GUM">グアム</a>  <a href="#" class="suggested-city__item js-select-airport" data-id="SPN">サイパン</a>  <a href="#" class="suggested-city__item js-select-airport" data-id="SYD">シドニー</a>  <a href="#" class="suggested-city__item js-select-airport" data-id="AKL">オークランド</a></div></div></div></div></div></div></div><div class="search-form__row"><a href="#" class="search-item flight-calendar" onclick="return false;" id="t-calendar"><span class="search-item__title"><svg role="image" class="svg-icon icon-calendar"><use xlink:href="/m/images/icons.svg#calendar"></svg><span class="label calendar_nittei">日程</span></span></a><input type="checkbox" class="checkbox flight-nonstop js-toggle-nonstop" id="nonstop"><label for="nonstop" class="search-item toggle-check">直行のみ</label></div></div>';

    function numberingFlights() {
      $('.js-form-flight').each(function() {
        var index = $(this).parent().children('.js-form-flight').index(this);
        var indexNum = index + 1;
        $(this).find('.js-flight-num').text(indexNum);
        $(this).find('.js-toggle-nonstop')
          .attr('id', 'nonstop-' + indexNum)
          .next('label').attr('for', 'nonstop-' + indexNum);
      });
    }

    $(document).on('click', '.js-delete-flight', function() {
      $(this).closest('.js-form-flight').remove();
      $('#js-add-flight').show();
      numberingFlights();
      return false;
    });

    $('#js-add-flight').on('click', function() {
	$('.add-flight_html').before(flightHtml);
      var flightsLength = $(this).parent().children('.js-form-flight').length;
      console.log(flightsLength);
      if(flightsLength > 5) { // フライト5までで追加ボタンを隠す
        $(this).hide();
      }
      numberingFlights();
      return false;
    });
  });

  //
  // Step input
  //
  $(function() {

    $(document).on('click', '.js-step-minus', function() {
      var $inputWrapper = $(this).closest('.js-step-input');
      var $input = $inputWrapper.find('.js-step-val');
      var val;
      var $minus = $inputWrapper.find('.js-step-minus');
      var $plus = $inputWrapper.find('.js-step-plus');
      var dataMin = $input.attr('data-input-min');
      var dataMax = $input.attr('data-input-max');

      val = parseInt($input.val());
      val--;

      if(val <= dataMin) {
        $minus.addClass('is-disable');
      }

      $plus.removeClass('is-disable');
      $input.val(val);

      if($input.attr('data-target-people')) {
        totalizePeopleNum($input);
      }

      if($input.hasClass('js-view-age')) {
        viewAge($input, val);
      }

      if($input.hasClass('js-step-rooms')) {
        stepRooms($input, val);
      }

      if($input.hasClass('js-select-adult')) {
        checkAdult($input, val);
      }
      return false;
    });

    $(document).on('click', '.js-step-plus', function() {
      var $inputWrapper = $(this).closest('.js-step-input');
      var $input = $inputWrapper.find('.js-step-val');
      var val;
      var $minus = $inputWrapper.find('.js-step-minus');
      var $plus = $inputWrapper.find('.js-step-plus');
      var dataMin = $input.attr('data-input-min');
      var dataMax = $input.attr('data-input-max');

      val = $input.val();
      val++;

      if(val >= dataMax) {
        $plus.addClass('is-disable');
      }

      $minus.removeClass('is-disable');
      $input.val(val);

      if($input.attr('data-target-people')) {
        totalizePeopleNum($input);
      }

      if($input.hasClass('js-view-age')) {
        viewAge($input, val);
      }

      if($input.hasClass('js-step-rooms')) {
        stepRooms($input, val);
      }

      if($input.hasClass('js-select-adult')) {
        checkAdult($input, val);
      }
      return false;
    });

    $(document).on('change', '.js-people-num', function() {
      var $inputWrapper = $(this).closest('.js-step-input');
      var $input = $inputWrapper.find('.js-step-val');
      var val = $input.val();
      var $minus = $inputWrapper.find('.js-step-minus');
      var $plus = $inputWrapper.find('.js-step-plus');
      var dataMin = $input.attr('data-input-min');
      var dataMax = $input.attr('data-input-max');

      $minus.removeClass('is-disable');
      $plus.removeClass('is-disable');

      if(val >= dataMax) {
        $input.val(dataMax);
        $plus.addClass('is-disable');
      } else if(val <= dataMin) {
        $input.val(dataMin);
        $minus.addClass('is-disable');
      }

      if($input.attr('data-target-people')) {
        totalizePeopleNum($input);
      }

      if($input.hasClass('js-view-age')) {
        viewAge($input, val);
      }

      if($input.hasClass('js-step-rooms')) {
        stepRooms($input, val);
      }

    if($input.hasClass('js-select-adult')) {
        checkAdult($input, val);
      }
      totalizePeopleNum($input);
    });

    function totalizePeopleNum($input) {
      var val = 0;
      var targetInput = $input.attr('data-target-people');
      if (undefined == targetInput){
        return;
      }
      var $selectorItem = $input.closest('.js-modal-contents').find('.js-people-num');
      $selectorItem.each(function() {
        if($(this).attr('data-target-people') === targetInput) {
          if (0 > targetInput.indexOf('input-child') && 0 > targetInput.indexOf('input-baby')) {
            val += parseInt($(this).val());
          }
          else {
            // 子供と赤ちゃん数は最初のノードだけ見てればよい
            if (-1 < targetInput.indexOf('input-child')){
              val = parseInt($('#js-people-selector-wrapper .js-people-selector:first-child .js-people-hidden-num-child').val());
              if (0 < $('.js-select-child-age-hotel').size()){
                // ホテルは赤ちゃんも子供にカウント
                var baby = parseInt($('#js-people-selector-wrapper .js-people-selector:first-child .js-people-hidden-num-baby').val());
                val = val + baby;
              }
            }
            else {
              val = parseInt($('#js-people-selector-wrapper .js-people-selector:first-child .js-people-hidden-num-baby').val());
              if (0 < $('.js-select-child-age-hotel').size()){
                  // ホテルは赤ちゃんも子供にカウント
                  var child = parseInt($('#js-people-selector-wrapper .js-people-selector:first-child .js-people-hidden-num-child').val());
                  val = val + child;
                }
            }
            return;
          }
        }
      });
      $(targetInput).text(val);
    }

    var roomSelectorHtml = null;
    function stepRooms($input, val) {
      var $roomSelector = $input.closest('.js-room-selector');
      var $peopleSelectorWrapper = $roomSelector.next('#js-people-selector-wrapper');
      var $peopleSelector = $peopleSelectorWrapper.children('.js-people-selector');
      var peopleSelectorLength = $peopleSelector.length;

      if(val > peopleSelectorLength) {
        if (roomSelectorHtml == null) {
          roomSelectorHtml = $('#js-modal-people .people-selector.js-people-selector').clone(true);
        }
        for(var i = peopleSelectorLength + 1; i <= val; i++) {
          var _roomSelectorHtml = roomSelectorHtml.clone(true);
          _roomSelectorHtml.find('.people-selector__title').text('部屋' + i);
          _roomSelectorHtml.find('.js-switch-seat').addClass('room-switch-seat');
          _roomSelectorHtml.find('.js-switch-seat').each(function (){
            $(this).attr('id', 'room-'+i+$(this).attr('id'));
          });
          _roomSelectorHtml.find('.js-switch-seat-label').each(function (){
        	  $(this).attr('for', 'room-'+i+$(this).attr('for'));
          });
          _roomSelectorHtml.find('.js-select-child-age').each(function (){
        	  $(this).addClass('room');
        	  $(this).attr('room', i);
          });
          _roomSelectorHtml.find('.js-switch-seat').attr('room', i);
          $peopleSelectorWrapper.append(_roomSelectorHtml);
        }
      } else {
        $peopleSelector.slice(val).remove();
      }

      $('#js-people-selector-wrapper').find('.js-people-selector:first').find('.js-people-num').each(function() {
        totalizePeopleNum($(this));
      });
    }

    function viewAge($input, val) {
      var $ageContents = $input.closest('.js-people-selector').find('.js-select-age');
      var style = $ageContents.attr('style');
      if (undefined != style && -1 < style.indexOf('height: 1px')){
        $ageContents.attr('style', '');
      }
      var $ageItem = $ageContents.find('.js-age-item');
      if(parseInt(val) !== 0 && val === val) {
        $ageItem.removeClass('is-show');
        $ageItem.hide();
        $ageContents.show();
        $ageContents.slideDown('fast', function() {
          $ageContents.attr('style', '');
          $ageContents.show();
          $ageItem.slice(0, val).addClass('is-show');
          $ageItem.slice(0, val).show();
          sortChildren($ageContents);
        });
      } else {
        // 減った子供の数を減算
        $ageItem.each(function (){
          if ($(this).hasClass('is-show')){
            if (0 < $(this).find('.js-select-child-age-hotel').size()) {
              // 子供数を減算
              var childNum = parseInt($('#js-people-selector-wrapper .js-people-selector:first-child .js-people-hidden-num-child').val());
              $('#js-people-selector-wrapper .js-people-selector:first-child .js-people-hidden-num-child').val(childNum - 1);
            }
            else {
              var age = parseInt($(this).find('.js-select-child-age').val());
              if (age == age){
                // 年齢が選択されているのでカウント減算対象
                if (age > 1){
                  // 非幼児確定
                  var childNum = parseInt($('#js-people-selector-wrapper .js-people-selector:first-child .js-people-hidden-num-child').val());
                  $('#js-people-selector-wrapper .js-people-selector:first-child .js-people-hidden-num-child').val(childNum - 1);
                }
                else {
                  if (0 < $(this).find('.js-switch-seat:checked').size()) {
                    // 非幼児確定
                    var childNum = parseInt($('#js-people-selector-wrapper .js-people-selector:first-child .js-people-hidden-num-child').val());
                    $('#js-people-selector-wrapper .js-people-selector:first-child .js-people-hidden-num-child').val(childNum - 1);
                  }
                  else {
                    // 幼児確定
                    var babyNum = parseInt($('#js-people-selector-wrapper .js-people-selector:first-child .js-people-hidden-num-baby').val());
                    $('#js-people-selector-wrapper .js-people-selector:first-child .js-people-hidden-num-baby').val(babyNum - 1);
                  }
                }
              }
            }
            $(this).removeClass('is-show');
          }
        }).end();
        $ageContents.slideUp('fast', function() {
          $ageItem.removeClass('is-show');
          if (val == 0){
            $ageContents.hide();
          }
          sortChildren($ageContents);
        });
      }
    }

    $('.js-select-child-age-hotel').on('change', function() {
        var $this = $(this);
        var $ageWrapper = $this.closest('.js-select-age');
        sortChildren($ageWrapper);
    });

    // 2歳以上で座席利用をチェックする
    $('.js-select-child-age').on('change', function() {
      var $this = $(this);
      var val = parseInt($this.val());
      var $switchSeat = $this.closest('.js-age-item').find('.js-switch-seat');
      var $ageWrapper = $this.closest('.js-select-age');
      if(0 <= val && val < 2) {
        $switchSeat.prop('checked', false).removeClass('is-checked-disable').next('label').tipso('destroy');
        // js-people-hidden-num-child
      } else {
        $switchSeat.prop('checked', true).addClass('is-checked-disable').next('label').tipso({
          background: '#ffffff',
          color: '#ff6c00',
          size: 'large',
          speed: 200,
          width: 220,
          maxWidth: ''
        });
        $this.closest('.js-age-item').next('.js-caution-babys-seat').remove();
        // js-people-hidden-num-baby
        $ageWrapper.find('.js-caution-babys-seat').remove();

      }

      sortChildren($ageWrapper);
    });

    // 座席利用時に子供料金が適用される注意文言
    $('.js-switch-seat').on('change', function() {
      var errorHtml = '<div class="children-age-error caution-message js-caution-babys-seat js-error"><p class="caution-message__title">座席利用をする場合は、幼児料金でなく子供料金が適用されます。</p></div>';
      var $wrapperItem = $(this).closest('.js-age-item');
      if($(this).is(':checked')) {
        if(!$(this).hasClass('is-checked-disable')) {
          $wrapperItem.find('.js-caution-babys-seat').remove();
          $wrapperItem.append(errorHtml);
        }
      } else {
        $wrapperItem.find('.js-caution-babys-seat').remove();
      }
      sortChildren($wrapperItem);
    });

    // 座席利用エラーバルーン
    $('.js-switch-seat-label').on('touchend', function(e) {
      if($(this).prev().hasClass('is-checked-disable')){
        if($(this).hasClass('is-show-tooltip')){
          $(this)
            .removeClass('is-show-tooltip')
            .tipso('hide')
          ;
        } else {
          $(this)
            .addClass('is-show-tooltip')
            .tipso('show')
            .delay(3500).queue(function() {
              $(this)
                .removeClass('is-show-tooltip')
                .tipso('hide')
                .dequeue()
              ;
            })
          ;
        }
        e.preventDefault();
      }
    });

    function sortChildren($wrapper) {
      var $ageWrapper = $('#js-people-selector-wrapper .js-select-age');

      var $inputAdult = $('#js-people-selector-wrapper').find('.js-people-num-adult');
      var $inputChild = $('#js-people-selector-wrapper').find('.js-people-selector:first-child .js-people-hidden-num-child');
      var $inputBaby = $('#js-people-selector-wrapper').find('.js-people-selector:first-child .js-people-hidden-num-baby');
      var $inputChild_view = $('#js-people-selector-wrapper').find('.js-view-age');
      var adultNum = 0;
      $inputAdult.each(function (){ 
        adultNum = adultNum + parseInt($(this).val());
      });
      var childViewNum = 0;
      $inputChild_view.each(function (){
        childViewNum = childViewNum + parseInt($(this).val());
      });
      var childNum = 0;
      var babyNum = 0;

      var $activeAgeItems = $ageWrapper.find('.js-age-item.is-show').find('.js-select-child-age');
      if (undefined != $ageWrapper.find('.js-age-item.is-show').find('.js-select-child-age-hotel') && 0 < $ageWrapper.find('.js-age-item.is-show').find('.js-select-child-age-hotel').size()){
        $activeAgeItems = $ageWrapper.find('.js-age-item.is-show').find('.js-select-child-age-hotel');
      }

      if($activeAgeItems.length) {

        var math = false;
        var def = false;
        var rootroomSeatIdx=0;
        var roomSeatIdx=0;
        $activeAgeItems.each(function() {
          var val = parseInt($(this).val());

          if(def != true && 0 <= val && val < 2) {
            // 座席にチェックが入っていたら乳幼児でも子供扱いする
            if($(this).hasClass('room')){
              roomSeatIdx++;
              var roomNum = parseInt($(this).attr('room'));
              // シートチェックのチェック
              var seatchecked = $('#js-modal-people .people-selector.js-people-selector #room-'+roomNum+'switch-seat0'+roomSeatIdx+'[room="'+roomNum+'"]:checked').val();
              if ('on' == seatchecked){
                childNum++;
                math = true;
              } else {
                babyNum++;
                math = true;
              }
            } else {
              rootroomSeatIdx++;
              // room1のシートチェックのチェック
              var seatchecked = $('#js-modal-people .people-selector.js-people-selector #switch-seat0'+rootroomSeatIdx+':checked').val();
              if ('on' == seatchecked){
                childNum++;
                math = true;
              } else {
                babyNum++;
                math = true;
              }
            }
          } else if(def != true && 2 <= val && val === val){
            rootroomSeatIdx++;
            childNum++;
            math = true;
          } else {
            // デフォルト値の場合
            if (math != true) {
              childNum = parseInt($inputChild.val());
              babyNum = parseInt($inputBaby.val());
              def = true;
              // おそらくプラスボタンが押されただけなので即返却
              return;
            }
          }
        });
      }
      else {
        childNum = parseInt($inputChild.val());
        babyNum = parseInt($inputBaby.val());
      }

      $inputChild.val(childNum);
      $inputBaby.val(babyNum);

      totalizePeopleNum($inputChild);
      totalizePeopleNum($inputBaby);

      if(childViewNum > 0) {
        if( babyNum > adultNum || babyNum < 0 || childViewNum != childNum+babyNum) {
          $('#js-people-selector-wrapper').nextAll('.js-close-people').addClass('is-disable');
        } else {
          $('#js-people-selector-wrapper').nextAll('.js-close-people').removeClass('is-disable');
        }
      } else {
          $('#js-people-selector-wrapper').nextAll('.js-close-people').removeClass('is-disable');
      }

	  //hotelなら常に押せるように
	  var $inputhotel = $('#js-people-selector-wrapper').find('.js-select-child-age-hotel');
	  if($inputhotel.length >0) {
		$('#js-people-selector-wrapper').nextAll('.js-close-people').removeClass('is-disable');
	  }

    }
    function checkAdult($input, val) {
      return sortChildren($input);
      /* 以下の処理は古いのでおそらく不要 */
      var $ageContents = $input.closest('.js-people-selector').find('.js-select-age');
      var $ageItem = $ageContents.find('.js-age-item');
      var $ageWrapper = $ageContents.closest('.js-select-age');

      var $inputAdult = $('#js-people-selector-wrapper').find('.js-people-num-adult');
      var $inputChild = $('#js-people-selector-wrapper').find('.js-people-hidden-num-child');
      var $inputBaby = $('#js-people-selector-wrapper').find('.js-people-hidden-num-baby');
      var $inputChild_view = $('#js-people-selector-wrapper').find('.js-view-age');
      var adultNum = $inputAdult.val();
      var childNum = 0;
      var babyNum = 0;

      var $activeAgeItems = $ageWrapper.find('.js-age-item.is-show').find('.js-select-child-age');

      if($activeAgeItems.length) {

        $activeAgeItems.each(function() {
          var val = parseInt($(this).val());

          if(0 <= val && val < 2) {
            babyNum++;
          } else if(2 <= val){
            childNum++;
          }

        });
      }

      $inputChild.val(childNum);
      $inputBaby.val(babyNum);

      totalizePeopleNum($inputChild);
      totalizePeopleNum($inputBaby);
//     マスク処理追加
      if($inputChild_view.val() > 0) {
        if( babyNum > adultNum || $inputChild_view.val() != childNum+babyNum) {
//        if( babyNum > adultNum || babyNum <= 0 || $inputChild_view.val() != childNum+babyNum) {
          $('#js-people-selector-wrapper').nextAll('.js-close-people').addClass('is-disable');
        } else {
          $('#js-people-selector-wrapper').nextAll('.js-close-people').removeClass('is-disable');
        }
      } else {
          $('#js-people-selector-wrapper').nextAll('.js-close-people').removeClass('is-disable');
      }
    }
  });

  //
  // Filter
  //
  $(function() {

    function getZeroDigit2(num) {
      if (num < 10) num = "0" + num;
      return num;
    }

    function separateNum3(num){
      num = String(num);

      var len = num.length;

      if(len > 3){
        return separateNum3(num.substring(0,len-3))+','+num.substring(len-3);
      } else {
        return num;
      }
    }

    function createRange() {
      var range = document.getElementsByClassName('js-range-normal');

      for(var i = 0; i < range.length; i++) {
        var dataMin = parseInt(range[i].getAttribute('data-range-min'));
        var dataMax = parseInt(range[i].getAttribute('data-range-max'));

        noUiSlider.create(range[i], {
          start: [dataMin, dataMax],
          step: 1,
          tooltips: [
            wNumb({ decimals: 0 }),
            wNumb({ decimals: 0 })
          ],
          behaviour: 'drag',
          connect: true,
          format: wNumb({
            decimals: 0
          }),
          margin: 1,
          range: {
            'min': dataMin,
            'max': dataMax
          }
        });
      }
    }

    function createTimeRange() {
      var range = document.getElementsByClassName('js-range-time');
      var timeTotalMinutes = 1440;

      function transformTime(target){

        target.noUiSlider.on('update', function(values, handle) {
          var tooltipMin = target.querySelectorAll('.noUi-tooltip')[0];
          var tooltipMax = target.querySelectorAll('.noUi-tooltip')[1];

          var valueMin = values[0];
          var valueMax = values[1];

          var hourMin = Math.floor(valueMin / 60);
          var hourMax = Math.floor(valueMax / 60);

          var minutesMin = Math.floor(valueMin % 60);
          var minutesMax = Math.floor(valueMax % 60);

          minutesMin = getZeroDigit2(Math.floor(valueMin % 60));
          minutesMax = getZeroDigit2(Math.floor(valueMax % 60));

          var timeValueMin = hourMin + ':' + minutesMin;
          var timeValueMax = hourMax + ':' + minutesMax;

          tooltipMin.innerHTML = timeValueMin;
          tooltipMax.innerHTML = timeValueMax;
        });
      }

      for(var i = 0; i < range.length; i++) {
        noUiSlider.create(range[i], {
          start: [0, timeTotalMinutes],
          step: 30,
          tooltips: [
            wNumb({ decimals: 0 }),
            wNumb({ decimals: 0 })
          ],
          behaviour: 'drag',
          connect: true,
          format: wNumb({
            decimals: 0
          }),
          margin: 30,
          range: {
            'min': 0,
            'max': timeTotalMinutes
          }
        });

        transformTime(range[i]);
      }
    }

    function createPriceRange() {
      var range = document.getElementsByClassName('js-range-price');

      function transformPrice(target){

        target.noUiSlider.on('update', function(values, handle) {
          var tooltipMin = target.querySelectorAll('.noUi-tooltip')[0];
          var tooltipMax = target.querySelectorAll('.noUi-tooltip')[1];

          var valueMin = values[0];
          var valueMax = values[1];

          tooltipMin.innerHTML = separateNum3(valueMin);
          tooltipMax.innerHTML = separateNum3(valueMax);
        });
      }

      for(var i = 0; i < range.length; i++) {
        var dataMin = parseInt(range[i].getAttribute('data-range-min'));
        var dataMax = parseInt(range[i].getAttribute('data-range-max'));

        noUiSlider.create(range[i], {
          start: [dataMin, dataMax],
          step: 1000,
          tooltips: [
            wNumb({ decimals: 0 }),
            wNumb({ decimals: 0 })
          ],
          behaviour: 'drag',
          connect: true,
          format: wNumb({
            decimals: 0
          }),
          margin: 0.5,
          range: {
            'min': dataMin,
            'max': dataMax
          }
        });

        transformPrice(range[i]);
      }
    }
    $(window).on('load', function() {
      createRange();
      createTimeRange();
      createPriceRange();
    });
  });

  //
  // Tooltips
  //
  // $('.js-toggle-tooltip').on('click', function() {
  //   $(this).nextAll('.js-tooltip:first')
  //     .stop(true, true).fadeIn('fast').delay(3500).fadeOut('fast');
  // });
  $('.js-toggle-tooltip').on('touchend', function(e) {
    if($(this).hasClass('is-show-tooltip')){
      $(this)
        .removeClass('is-show-tooltip')
        .tipso('hide')
      ;
    } else {
      $(this)
        .addClass('is-show-tooltip')
        .tipso('show')
        .delay(3500).queue(function() {
          $(this)
            .removeClass('is-show-tooltip')
            .tipso('hide')
            .dequeue()
          ;
        })
      ;
    }
    e.preventDefault();
  });

  $(document).on('touchmove click', function(e) {
      $('.js-toggle-tooltip').tipso('hide').removeClass('is-show-tooltip');
  });

  $('.js-toggle-tooltip').tipso({
    background: '#ffffff',
    color: '#ff6c00',
    size: 'large',
    speed: 200,
    width: 320,
    maxWidth: ''
  });

  $('.js-feature-tooltip').on('click', function() {
    var $balloon = $(this).find('.js-feature');

    if($balloon.hasClass('is-show')) {
      $balloon.removeClass('is-show');
    } else {
      $balloon.addClass('is-show').delay(5000).queue(function() {
        $balloon.removeClass('is-show').dequeue();
      });
    }
    return false;
  });

  //
  // Slider
  //
  $('.js-slider').slick({
    adaptiveHeight: true,
    cssEase: 'ease-in-out',
    speed: 400,
    useTransform: true
  });

  $('.js-top-slider').slick({
    adaptiveHeight: true,
    arrows: false,
    cssEase: 'ease-in-out',
    dots: true,
    speed: 400,
    useTransform: true
  });

  // Carousel
  $('.js-carousel').slick({
    arrows: false,
    centerMode: true,
    centerPadding: '40px',
    cssEase: 'ease-in-out',
    slidesToShow: 1,
    slidesToScroll: 1,
    speed: 400,
    // swipeToSlide: true,
    useTransform: true
  });

})();

},{}]},{},[1]);
