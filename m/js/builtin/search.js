var key_ = null;
$(function() {
  'use strict';

  var SETTINGS = {
    AIR: {
      HISTORY: {
        SEARCH: 5,
        DETAIL: 5
      },
      PAGER: 20,
      DELAY: 3000,
      REQUIRE: {
        SCHEDULE: true
      },
      RESERVATION: air_reservation
    },
    HOTEL: {
      HISTORY: {
        SEARCH: 5,
        DETAIL: 5
      },
      PAGER: 20,
      DELAY: 5000,
      REQUIRE: {
        SCHEDULE: true
      },
      RESERVATION: hotel_reservation
    },
    TOUR: {
        HISTORY: {
          SEARCH: 5,
          DETAIL: 5
        },
        PAGER: 20,
        DELAY: 3000,
        REQUIRE: {
          SCHEDULE: true
        },
        RESERVATION: tour_reservation
    },
    PAYMETHOD: {
      VI: {name: 'VISAカード', icon: 'm-item-paymethod-cnt_visa.gif'},
      CA: {name: 'マスターカード', icon: 'm-item-paymethod-cnt_master.gif'},
      JB: {name: 'JCBカード', icon: 'm-item-paymethod-cnt_jcb.gif'},
      DC: {name: 'ダイナースカード', icon: 'm-item-paymethod-cnt_dc.gif'},
      AX: {name: 'アメリカンエクスプレスカード', icon: 'm-item-paymethod-cnt_amex.gif'},
      BK: {name: '銀行振込', icon: 'm-item-paymethod-cnt_bank.gif'},
      CV: {name: 'コンビニエンスストア', icon: 'm-item-paymethod-cnt_conv.gif'},
      NB: {name: 'ネットバンク', icon: 'm-item-paymethod-cnt_net.gif'},
      PV: {name: 'ペイジー', icon: 'm-item-paymethod-cnt_payeasy.gif'}
    },
    ERROR: {
      SEARCH_FAILURE: '検索結果が正常に表示できません。<br>再度検索項目を設定して検索しなおしてください。',
      SEARCH_TOO_MANY_TRAVELERS: '合計人数は9人以内で指定してください。',
      SEARCH_TOO_MANY_TRAVELERS_11: '合計人数は11人以内で指定してください。',
      SEARCH_TOO_MANY_BABIES: '幼児の人数は大人の人数以下で指定してください。',
      SEARCH_MISSING_DEPARTURE: '出発地を選択してください。',
      SEARCH_MISSING_ARRIVAL: '目的地を選択してください。',
      SEARCH_MISSING_SCHEDULE: '日程を選択してください。',
      SEARCH_MISSING_STAYPLACE: '滞在地を選択してください。',
      SEARCH_OUTOFRANGE_SCHEDULE: '今日以降の日付を選択してください。',
      SEARCH_DP_FROMHOTEL: '目的地を指定して下さい。'
    }
  };

  var Status = (function() {
    var value = {
      basepath: $('base').attr('href') || '',
      pathname: [],
      search: {},
    };

    $.each(location.pathname.replace(value.basepath, '').split(/\//), function() {
      var dir = $.trim(decodeURIComponent(this));
      dir !== '' && value.pathname.push(dir);
    });

    $.each(location.search.replace(/^\?/, '').split(/&/), function() {
      var p = $.map(this.split(/=/), function(n) {
        return $.trim(decodeURIComponent(n.replace(/\+/g, ' ')));
      });
      if (p[0] !== '') {
        value.search[p[0]] = p.length >= 2 ? p[1] : true;
      }
    });

    if (document.referrer) {
      var a = document.createElement('a');
      a.href = document.referrer;
      if (a.hostname !== location.hostname) {
        value.referer = document.referrer;
      }
    }

    return value;
  })();


  var Func = {
    vsprintf: function(txt, values) {
      var matches = txt.match(/%.*?(?:d|s)/g);
      for (var i = 0; i < matches.length; i ++) {
        var char = ' ';
        var size = 0
        var f = matches[i].slice(1, -1);
        if (f.length >= 2) {
          char = f.slice(0, 1);
          size = f.slice(1)|0;
        } else if (f.length >= 1) {
          size = f|0;
        }
        var value = String(matches[i].slice(-1) === 'd' ? values[i]|0 : values[i]);
        for (var n = value.length; n < size; n ++) {
          value = char + value;
        }
        txt = txt.replace(matches[i], value);
      }
      return txt;
    },

    money: function(n, type) {
      var money = n.toString().replace(/(\d)(?=(\d{3})+$)/g, '$1,');
      switch (type) {
        case 'prefix':
          return '&yen;' + money;
        case 'suffix':
          return money + '円';
        default:
          return money;
      }
    },

    date: function(data, type) {
      if (typeof data === 'string') {
        var date = new Date(data);
      } else {
        var date = new Date(data.year, data.month - 1, data.day);
      }
      var week = ['日', '月', '火', '水', '木', '金', '土'];
      switch (type) {
        case 'simple':
          var format = '%d%02d%02d';
          var values = [date.getFullYear(), date.getMonth() + 1, date.getDate()];
          break;
        case 'mini':
          var format = '%02d/%02d(%s)';
          var values = [date.getMonth() + 1, date.getDate(), week[date.getDay()]];
          break;
        case 'slim':
          var format = '%02d/%02d/%02d(%s)';
          var values = [date.getFullYear() - 2000, date.getMonth() + 1, date.getDate(), week[date.getDay()]];
          break;
        case 'full':
          var format = '%d/%02d/%02d(%s)';
          var values = [date.getFullYear(), date.getMonth() + 1, date.getDate()];
          break;
        default:
          var format = '%d/%02d/%02d';
          var values = [date.getFullYear(), date.getMonth() + 1, date.getDate()];
          break;
      }
      return Func.vsprintf(format, values);
    },

    error: function(message, showAlertFlg) {
      if ($('#loading').parent().hasClass('js-modal')){
        $('#loading').parent().find('.js-close-modal').trigger('click');
      }
      if ($('.loading').parent().hasClass('js-modal')){
        $('.loading').parent().find('.js-close-modal').trigger('click');
      }
      $('#loading').remove();
      $('#js-modal-loading').hide();
      $('.loading').remove();
      $('.button-area>.button').removeClass('is-disable');
      $('.button-area>button').removeClass('is-disable');
      if (typeof message === 'string') {
        if (message.charAt(0) === '*') {
          var id = message.substr(1);
          SETTINGS.ERROR[id] && (message = SETTINGS.ERROR[id]);
        }
        $('.search-error p').html(message);
        $('.search-error:hidden').show();
        if (showAlertFlg === true){
          showAlert(message, true);
        }
      } else {
        console.warn(message);
      }
      return false;
    },

    debug: function(message) {
      console.debug(JSON.stringify(message, null, '  '));
    },

    url: function(path, query, callback) {
      var exists = false;
      var data = {};
      $.each(query || {}, function(index) {
        if (
          (typeof this === 'string' && this !== '') ||
          (typeof this === 'boolean' && this !== false) ||
          (typeof this === 'number' && this > 0)
        ) {
          data[index] = this;
          exists = true;
        }
      });
      if (typeof callback === 'function') {
        callback(data);
      }
      var append = exists ? '?' + $.param(data) : '';
      
      var basedomain = Status.basepath;
      if (web_r_url) {
          basedomain = web_r_url;
      }
      return basedomain + path.replace(/^\//, '') + append;
    },

    absorb: function(selector, target, n) {
      var element = $(selector).get(0);
      if (element) {
        var events = $._data(element).events;
        if (events && events[target]) {
          var e = events[target][n|0];
          if (e && typeof e.handler === 'function') {
            return e.handler;
          }
        }
      }
      return function() {};
    },

    history: function(type, item) {
      var data = Func.storage('history');
      if (data === null || typeof data !== 'object') {
        data = {};
      }
      if (type in data === false) {
        data[type] = [];
      }
      var keys = type.toUpperCase().split(/\//);
      if (SETTINGS[keys[0]||''] && SETTINGS[keys[0]||''].HISTORY[keys[1]||'']) {
        var limit = SETTINGS[keys[0]||''].HISTORY[keys[1]||''];
      } else {
        var limit = 1;
      }
      if (item) {
        var exists = -1;
        if (typeof item === 'string') {
          exists = data[type].indexOf(item);
        } else if (item.id) {
          $.each(data[type], function(index) {
            if (item.id === this.id) {
              exists = index;
              return false;
            }
          });
        }
        exists >= 0 && data[type].splice(exists, 1);
        data[type].unshift(item);
        data[type] = data[type].slice(0, limit);
        Func.storage('history', data);
      } else {
        if (item === false){
          // 該当キーのデータを全てクリア
          data[type] = [];
          Func.storage('history', data);
        }
        else {
          return data[type];
        }
      }
    },

    googlemap: function(target, name, lat, lon) {
      var pos = new google.maps.LatLng(lat, lon);
      var map = new google.maps.Map(target.get(0), {
        zoom: 15,
        center: pos,
        mapTypeId: google.maps.MapTypeId.ROADMAP
      });
      var marker = new google.maps.Marker({position: pos, map: map, title: name});
    },

    storage: function(name, value) {
      var target = localStorage;
      var prefix = 'ena.';
      var getname = function(key) {
        return 'ena.' + key;
      };
      if (typeof value === 'undefined') {
        var get = function(key, error) {
          var value = target.getItem(getname(key));
          try {
            return JSON.parse(value);
          } catch (e) {
            return error || value;
          }
        };
        var result = null;
        if (name instanceof Array) {
          result = {};
          $.each(name, function() {
            result[this] = get(this);
          });

        } else if (typeof name === 'object') {
          result = {};
          $.each(name, function(index) {
            result[index] = get(index, this);
          });
        } else if (typeof name === 'string') {
          result = get(name);
        }
        return result;
      } else {
        var set = function(key, value) {
          if (value === null) {
            target.removeItem(getname(key));
          } else if (typeof value === 'string' || typeof value === 'number') {
            target.setItem(getname(key), value);
          } else {
            target.setItem(getname(key), JSON.stringify(value));
          }
        };
        if (name instanceof Array) {
          if (typeof value === 'object') {
            $.each(name, function() {
              this in value && set(this, value[this]);
            });
          }
        } else if (name === true) {
          if (typeof value === 'object') {
            $.each(value, function(index) {
              set(index, this);
            });
          }
        } else if (typeof name === 'string') {
          set(name, value);
        }
      }
    },
    amoundetail: function(air,htl) {

      $('.amount__detail .detail-header-status').text('の表示');

      if (air.point | 0 > 0) {
        $('.amount.dp-amount .amount__point').find('.point').text(air.point).end().show();
      } else {
        $('.amount.dp-amount .amount__point').find('.point').text('').end().hide();
      }

      var airprice = air.price;
      var htlprice = htl.price;
      if (air.TravelerGroups) {
        var travelergroups = air.TravelerGroups;
      }
      else {
        var travelergroups = air.travelergroups;
      }
      var persons = 0;
      for (i in travelergroups){
        persons += travelergroups[i]['persons'];
      }
      $('.amount__detail .air-item').text(persons);
      var nights = htl.chargeablerateinfo.NightlyRatesPerRooms.length;
      var tourCond = Func.history('tour/cond').shift();
      var roomCount = ~~tourCond.room.split(' ').length;
      $('.amount__detail .htl-item').text(nights+'泊'+roomCount);
      $('.amount__detail dl:nth-of-type(1) dd').text('¥' + (airprice.toString().replace(/(\d)(?=(\d{3})+$)/g, '$1,')));
      $('.amount__detail dl:nth-of-type(3)').hide();
      var sumPrice = htlprice + airprice;
      if (htl.chargeablerateinfo.discount) {
        htlprice = htl.chargeablerateinfo.total;
        var discount = htl.chargeablerateinfo.discount * roomCount;
        sumPrice = htlprice + airprice - discount;
        $('.amount__detail dl:nth-of-type(2) dd').text('¥' + (htlprice.toString().replace(/(\d)(?=(\d{3})+$)/g, '$1,')));
        $('.amount__detail dl:nth-of-type(3)').show();
        $('.amount__detail dl:nth-of-type(3) dd').text('¥-' + (discount.toString().replace(/(\d)(?=(\d{3})+$)/g, '$1,')));
      }
      else {
        $('.amount__detail dl:nth-of-type(2) dd').text('¥' + (htlprice.toString().replace(/(\d)(?=(\d{3})+$)/g, '$1,')));
      }
      $('.amount__detail dl:nth-of-type(4) dd').text('¥' + (sumPrice.toString().replace(/(\d)(?=(\d{3})+$)/g, '$1,')));
      var averagePrice = Math.ceil(sumPrice / persons);
      $('.amount__detail .dp-price-average .price-average').text('¥' + (averagePrice.toString().replace(/(\d)(?=(\d{3})+$)/g, '$1,')));
      $('.amount-dp-detail__header.js-toggle-accordion').on('click', function () {
        var $accordionWrapper = $('.amount__detail.js-accordion-wrapper');
        var $accordionToggle = $(this);
        var $accordionContents = $('.amount-dp-detail__contents.js-accordion-contents');
        if ($('.amount__detail.js-accordion-wrapper').hasClass('is-open')) {
          $accordionWrapper.addClass('is-open');
          $accordionToggle.addClass('is-open');
          $accordionContents.slideDown('fast');
          $('.amount__detail .detail-header-status').text('を閉じる');
        }
        else {
          $accordionWrapper.removeClass('is-open');
          $accordionToggle.removeClass('is-open');
          $accordionContents.slideUp('fast');
          $('.amount__detail .detail-header-status').text('の表示');
        }
      });
    },
    brandini: function() {
      var option = {
        method: 'GET',
        url: Func.url('/top/brandini'),
        contentType: 'application/json',
        dataType: 'json'
      };
      $.ajax(option).done(function(result) {
         Func.history('top/brand', result);
      });
    },
    refreshover: function(date) {
      var eDate = new Date(date);
      var refresreload = setInterval(function(){
        var now = new Date();
        if (eDate <= now) {
          clearInterval(refresreload);
          location.reload();
        }
      },1000);
    }
  };


  var Calendar = (function() {
    var methods = {};

    methods.bindUpdate = function() {
      $(document).on('update', '.flight-calendar', function(event, range) {
        if (range.from) {
          var value = [Func.date(range.from)];
          range.to && value.push(Func.date(range.to));
          var label = value.join('〜');
          $(this).data('range', range);
          // DPの場合、フライト日程以内でない場合にエラーにしてあげる処理
          if (true == $(this).hasClass('hoteloptioncalendar')){
              //console.log(range);
              // 日程のdateを取る
              var airdate = $('.search-item.flight-calendar:not(.hoteloptioncalendar) .search-item__data').text();
              if (0 < airdate.length){
                //console.log(this);
                //console.log($('.search-item.flight-calendar:not(.hoteloptioncalendar) .search-item__data'));
                //console.log(airdate);
                var airdates = airdate.split('〜');
                var airrange = {from:'', to:''};
                var airfrom = airdates[0].split('/');
                var airto = airdates[1].split('/');
                airrange.from = {year:parseInt(airfrom[0]),month:parseInt(airfrom[1]),day:parseInt(airfrom[2])};
                airrange.to = {year:parseInt(airto[0]),month:parseInt(airto[1]),day:parseInt(airto[2])};
                // 日付比較 期間内かどうか
                airfrom = new Date(airrange.from.year, airrange.from.month -1, airrange.from.day);
                airto = new Date(airrange.to.year, airrange.to.month -1, airrange.to.day);
                var rangefrom = new Date(range.from.year, range.from.month -1, range.from.day);
                var rangeto = new Date(range.to.year, range.to.month -1, range.to.day);
                airfrom.setDate(airfrom.getDate()-3);
                airto.setDate(airto.getDate()+3);
                if (false === (airfrom <= rangefrom && rangeto <= airto)){
                    // 日程に収まっていないので、このホテルの日程はエラー
                    $('.search-form__row.hoteloptioncalendar .caution-message').removeClass('is-hidden');
                    //$('.search-form__row.hoteloptioncalendar #part-trip').prop('checked', false);
                    return;
                }
                else if (airfrom > rangefrom && rangeto < airto) {
                  $('.search-form__row.hoteloptioncalendar #part-trip').prop('checked', true);
                }
              }
          }
          if ($(this).find('.search-item__data').text(label).length <= 0) {
            $(this)
              .append($('<span>').addClass('search-item__data').text(label))
              .find('.search-item__title').addClass('is-left').end();
          }
        }
      });
    };

    methods.setValue = function(n, range) {
      var match = function(r) {
        for (var i = 0; i < total_hiniti.length; i ++) {
          if (total_year[i] === r.year && total_month[i] === r.month && total_hiniti[i] === r.day) {
            return i;
          }
        }
        return -1;
      };
      if (range.from) {
        saved_start[n] = match(range.from);
        if (range.to) {
          saved_end[n] = match(range.to);
        }
        first_scroll_flg[n] = true;
        $('.flight-calendar:eq(' + n + ')').trigger('update', range);
      }
    };

    methods.defaultValue = function(value) {
      value || (value = {});
      if (value.from) {
        var origin = new Date(value.from.year, value.from.month - 1, value.from.day);
      } else {
        var origin = new Date();
        var y = origin.getFullYear();
        var m = origin.getMonth() + 1;
        var d = origin.getDate();
        if (m === 12 && d >= 11 && d <= 22) {
          // 12/11-12/22 -> 1/6
          origin = new Date(y + 1, 0, 6);
        } else if (m === 4 && d >= 11 && d <= 24) {
          // 4/11-4/24 -> 5/10
          origin = new Date(y, 4, 10);
        } else if ((m === 7 && d >= 6) || (m === 8 && d <= 12)) {
          // 7/6-8/12 -> 8/27
          origin = new Date(y, 7, 27);
        } else {
          origin = new Date(y, m - 1, d + 14);
        }
        value.from = {
          year: origin.getFullYear(),
          month: origin.getMonth() + 1,
          day: origin.getDate()
        };
      }
      if (!value.to) {
        origin.setTime(origin.getTime() + (2 * 24 * 60 * 60 * 1000));
        value.to = {
          year: origin.getFullYear(),
          month: origin.getMonth() + 1,
          day: origin.getDate()
        };
      }
      return value;
    };

    return methods;
  })();



  var Filter = (function() {
    var methods = {};

    methods.text = function(self) {
      return {
        reset: function() {
          self.find('input[type="text"]').val('');
        },
        change: function(callback) {
          self.find('input[type="text"]').on('keyup', callback);
        },
        get: function() {
          var result = $.trim(self.find('input[type="text"]').val());
          return result !== '' ? result : null;
        }
      };
    };

    methods.radio = function(self, init) {
      return {
        reset: function() {
          self.find('input[type="radio"]').val([init]);
        },
        change: function(callback) {
          self.find('input[type="radio"]').on('change', callback);
        },
        get: function() {
          var result = self.find('input[type="radio"]:checked').val();
          return result !== init ? result : null;
        }
      };
    };

    methods.checkbox = function(self) {
      return {
        reset: function() {
          self.find('input[type="checkbox"]').prop('checked', false);
        },
        change: function(callback) {
          self.on('change', 'input[type="checkbox"]', callback);
        },
        get: function() {
          var value = [];
          self.find('input[type="checkbox"]:checked').each(function() {
            var n = $(this).val();
            n !== '' && value.push(n);
          });
          return value.length > 0 ? value : null;
        },
        view: function(data, selector, name, count, labelIs) {
          var prefix = 'filter-' + name;
          var list = [];
          $.each(data, function() {
            this.count > 0 && list.push(this);
          })
          list.sort(function(a, b) {
            return a.name > b.name ? 1 : -1;
          });
          count && list.splice(count);
          self.find(selector).empty();
          if (list.length > 0) {
            $.each(list, function(index) {
              var id = Func.vsprintf('%s%02d', [prefix, index + 1]);
              var input = $('<input>')
                .attr({type: 'checkbox', id: id, name: prefix})
                .addClass('checkbox')
                .val(this.value);
              var label = $('<label>').attr('for', id);
              if (typeof labelIs === 'function') {
                labelIs(label, this);
              } else if ($.trim(this.name) !== '') {
                label.text(this.name);
              } else {
                return true;
              }
              self.find(selector).append(function() {
                return $('<p>').addClass('filter-checkbox').append(input).append(label);
              });
            });
            self.show();
          } else {
            self.hide();
          }
        }
      };
    };

    methods.slider = function(self, multi, extend) {
      extend || (extend = {});
      return {
        reset: function() {
          self.find('.js-range').each(function() {
            this.noUiSlider && this.noUiSlider.set([
              this.noUiSlider.options.range.min,
              this.noUiSlider.options.range.max
            ]);
          });
          extend.reset && extend.reset(self);
        },
        change: function(callback) {
          self.find('.js-range').each(function() {
            this.noUiSlider && this.noUiSlider.on('change', callback);
          });
          extend.change && extend.change(self, callback);
        },
        get: function() {
          var retrieve = function(target) {
            if (target.is(':hidden')) {
              return null;
            }
            var slider = target.find('.js-range').get(0).noUiSlider;
            if (!slider) {
              return null;
            }
            var value = slider.get();
            var range = slider.options.range;
            var result = {min: value[0]|0, max: value[1]|0};
            if (result.min === range.min && result.max === range.max) {
              return null;
            }
            extend.get && $.extend(result, extend.get(target));
            return result;
          };
          if (multi) {
            var value = [];
            self.find(multi).each(function() {
              value.push(retrieve($(this)));
            });
            return value;
          } else {
            return retrieve(self);
          }
        },
        set: function(range) {
          self.find('.js-range').each(function() {
            if (this.noUiSlider) {
              if (range.min === range.max) {
                range.max += this.noUiSlider.options.step;
              }
              this.noUiSlider.updateOptions({range: range});
              this.noUiSlider.options.range = range;
              this.noUiSlider.set([range.min, range.max]);
            }
          });
        },
        view: function(count, selector) {
          self.find(selector).each(function() {
            if ($(this).index() < count) {
              $(this).show();
            } else {
              $(this).hide();
            }
          });
        }
      };
    };

    return methods;
  })();


  var Air = (function() {
    var methods = {};

    // See: http://www.ena.travel/template/toppage/js/all_master.js
    AIR_LINE || (AIR_LINE = {});
    LOCATION || (LOCATION = []);

    var sectionId = 'default';

    var location_index = {};
    var getLocation = function(id) {
      if (id in location_index === false) {
        return null;
      } else if (location_index[id] instanceof Array) {
        return LOCATION[location_index[id][0]].airports[location_index[id][1]];
      } else {
        return LOCATION[location_index[id]];
      }
    };
    $.each(LOCATION, function(index1) {
      location_index[this.citycode] = index1;
      $.each(this.airports || [], function(index2) {
        var id = this.citycode.replace(/_.*/, '');
        if (!location_index[id]) {
          location_index[id] = [index1, index2];
        }
      });
    });

    var qFlight = {
      encode: function(value) {
        if (value.date) {
          var block = [
            Func.vsprintf('%s-%s', [value.departure, value.arrival]),
            Func.date(value.date, 'simple')
          ];
          value.direct && block.push('DR');
          return block.join(' ');
        } else {
          return null;
        }
      },
      decode: function(value) {
        var match = (value || '').match(/^(.{0,3})-(.{0,3})\s+(\d{4})(\d{2})(\d{2})(?:\s+(DR))?$/);
        if (match !== null) {
          return {
            departure: match[1],
            arrival: match[2],
            date: {year: match[3]|0, month: match[4]|0, day: match[5]|0},
            direct: !!match[6]
          };
        } else {
          return null;
        }
      },
      summary: function(search) {
        var range = {};
        $.each(search, function(index) {
          if (index.match(/^flight.(\d)$/)) {
            var n = RegExp.$1|0;
            if ('max' in range === false || range.max < n) {
              range.max = n;
            }
            if ('min' in range === false || range.min > n) {
              range.min = n;
            }
          }
        });
        var result = {};
        if ('min' in range) {
          var n = Func.vsprintf('flight.%d', [range.min]);
          result.first = qFlight.decode(search[n]);
          if (range.min !== range.max) {
            var n = Func.vsprintf('flight.%d', [range.max]);
            result.last = qFlight.decode(search[n]);
          }
        }
        return result;
      }
    };

    var qTraveler = {
      encode: function(value) {
        value.adult || (value.adult = 1);
        var encoded = [];
        if (value.children.length > 0) {
          var block2 = [];
          $.each(value.children, function() {
            if (this.age > 11){
              value.adult++;
              value.child--;
            }
            else {
              block2.push(this.age + (this.seat ? '' : ''));
              // XXX 誤動作するので一旦封印
              //block2.push(this.age + (this.seat ? '.s' : ''));
            }
          });
        }
        var block1 = [value.adult, value.child, value.baby];
        encoded.push(block1.join('-'));
        if (value.child > 0){
          encoded.push(block2.join('-'));
        }
        return encoded.join(' ');
      },
      decode: function(value) {
        var decoded = {};
        var block = value.split(/\s/);
        (function(n) {
          var s = (n || '').split(/-/);
          decoded.adult = s[0]|0;
          decoded.child = s[1]|0;
          decoded.baby = s[2]|0;
        })(block.shift());
        (function(n) {
          decoded.children = [];
          var s = (n || '').split(/-/);
          $.each(s, function() {
            var m = this.match(/^(\d+)(?:\.(.))?$/);
            m && decoded.children.push({age: m[1]|0, seat: !!m[2]});
          });
        })(block.shift());
        return decoded;
      }
    };

    var qStay = {
      encode: function(data) {
        var convert = function(o) {
          if (o && o.year && o.month && o.day) {
            return Func.date(o, 'simple');
          } else {
            return null;
          }
        };
        if (typeof data === 'object') {
          var r1 = convert(data.from);
          var r2 = convert(data.to);
          if (r1 && r2) {
            return [r1, r2].join('-');
          }
        }
        return null;
      },
      decode: function(data) {
        var convert = function(s) {
          if (typeof s === 'string' && s.length === 8) {
            return {year: s.substr(0, 4)|0, month: s.substr(4, 2)|0, day: s.substr(6, 2)|0};
          } else {
            return null;
          }
        };
        if (typeof data === 'string') {
          var part = data.split(/-/);
          var r1 = convert(part.shift());
          var r2 = convert(part.shift());
          if (r1) {
            var decoded = {from: r1};
            r2 && $.extend(decoded, {to: r2});
            return decoded;
          }
        }
        return null;
      }
    };

    var qRoom = {
      encode: function(data) {
        var list = [];
        $.each(data, function() {
          var parts = [this.adult];
          if (this.children.length > 0) {
            parts.push(this.children.join('.'));
          }
          list.push(parts.join('-'));
        });
        if (list.length > 0) {
          return list.join(' ');
        } else {
          return null;
        }
      },
      decode: function(data) {
        var list = [];
        $.each((data || '').split(/ /), function() {
          var part = this.split(/-/);
          var n = {adult: part[0]|0, children: []};
          if (part[1]) {
            $.each(part[1].split(/\./), function() {
              n.children.push(this|0);
            });
          }
          list.push(n);
        });
        return list;
      }
    };

    var Entry = {
      sort: function(getEntries) {
        var list = $('#js-modal-sort .js-open-selector');
        var sort = function(result) {
          var types = [
            function(a) {
              if ('_p' in a === false) {
                a._p = a.baseFare;
              }
              return a._p;
            },
            function(a) {
              if ('_r' in a === false) {
                var value = null;
                $.each(a.Flights, function() {
                  $.each(this.Segments, function() {
                    var r = this.Carrier.classOfService.seatremains;
                    if (value === null || value < r) {
                      value = r;
                    }
                  });
                });
                a._r = value;
              }
              return a._r;
            }
          ];
          var reverse = [true, false];
          var selected = list.find('.is-active').index();
          var entries = getEntries();
          entries.sort(function(a, b) {
            var a1 = types[selected](a);
            var b1 = types[selected](b);
            var a2 = types[selected === 0 ? 1 : 0](a);
            var b2 = types[selected === 0 ? 1 : 0](b);
            if (reverse[selected]) {
              return a1 === b1 ? (b2 - a2) : (a1 - b1);
            } else {
              return a1 === b1 ? (b2 - a2) : (b1 - a1);
            }
          });
          return entries;
        };
        list.find('a').on('click', function() {
          Entry.view(sort());
        });
        return sort;
      },

      filter: function(getEntries) {
        var modal = $('#js-modal-filter');

        var f = modal.find('.filter-contents__item');
        var filters = {
          nonstop: Filter.checkbox(f.eq(0)),
          flightTime: Filter.slider(f.eq(1), '.filter-flight', {
            reset: function(self) {
              self.find('input[type="radio"]').val([0]);
            },
            change: function(self, callback) {
              self.on('change', 'input[type="radio"]', callback);
            },
            get: function(self) {
              var checked = self.find('input[type="radio"]:checked').val()|0 !== 0;
              return {type: checked ? 'arrival' : 'departure'};
            }
          }),
          connectTime: Filter.slider(f.eq(2), '.filter-flight'),
          airport: (function() {
            var self = f.eq(3);
            var result = Filter.checkbox(self);
            result.get = function() {
              var value = [];
              self.find('.flight-airport').each(function() {
                var index = $(this).index();
                value[index] = null;
                if ($(this).is(':visible')) {
                  var data = {departure: [], arrival: []};
                  $(this).find('input[type="checkbox"]:checked').each(function() {
                    var type = $(this).attr('name').split(/-/g).pop();
                    data[type].push($(this).val());
                  });
                  if (data.departure.length > 0 || data.arrival.length > 0) {
                    value[index] = data;
                  }
                }
              });
              return value;
            };
            result.view = function(airports) {
              var order = function(self, n, type, callback) {
                var list = [];
                var data = airports[n][type];
                $.each(data, function() {
                  list.push(this);
                });
                list.sort(function(a, b) {
                  return b.count - a.count;
                });
                list.splice(3);
                $.each(list, function(index) {
                  var name = Func.vsprintf('filter-airport%02d-%s', [n + 1, type]);
                  var id = Func.vsprintf('filter-airport%02d-%s-%d', [n + 1, type, index + 1]);
                  var input = $('<input>')
                    .attr({type: 'checkbox', id: id, name: name})
                    .addClass('checkbox')
                    .val(this.value);
                  var label = $('<label>')
                    .attr('for', id)
                    .text(this.name);
                  callback(self, function() {
                    return $('<p>').addClass('filter-checkbox is-child').append(input).append(label);
                  });
                });
              };
              self.find('.flight-airport').each(function() {
                var index = $(this).index();
                if (index in airports) {
                  $(this).find('.is-child').remove();
                  order(this, index, 'departure', function(self, item) {
                    $(self).find('h5:last-child').before(item);
                  });
                  order(this, index, 'arrival', function(self, item) {
                    $(self).append(item);
                  });
                  $(this).show();
                } else {
                  $(this).hide();
                }
              });
            };
            return result;
          })(),
          airline: Filter.checkbox(f.eq(4)),
          seat: Filter.checkbox(f.eq(5)),
          equipment: Filter.checkbox(f.eq(6)),
          type: Filter.checkbox(f.eq(7)),
          payment: Filter.checkbox(f.eq(8)),
          charge: Filter.slider(f.eq(9)),
          other: Filter.checkbox(f.eq(10))
        };

        var status = function() {
          var entries = getEntries();
          var matched = 0;
          $.each(entries, function() {
            this._hidden || (matched ++);
          });
          $('.filter-count').each(function() {
            $(this).find('.num').text(matched);
            $(this).find('.all').text(entries.length);
          });
        };

        var changed = false;
        modal.find('.js-close-modal').on('click', function() {
          if (changed) {
            changed = false;
            Entry.view(getEntries(), key_);
          }
        });

        var conditions = {};
        var initialized = false;
        var filter = function(result) {
          var entries = getEntries();

          $.each(filters, function(index) {
            conditions[index] = this.get();
          });

          var filtering = function() {
            var minute = function(time) {
              var s = time.split(/:/);
              return (s[0]|0) * 60 + (s[1]|0);
            };
            try {
              if (conditions.payment !== null) {
                var unit = {
                  1: ['VI', 'CA', 'JB', 'DC', 'AX', 'DD'],
                  2: ['CV'],
                  3: ['BK', 'NB', 'PV']
                }
                var exists = {};
                $.each(this.ConditionsOfUse.PaymentMethods, function() {
                  var n = this.type;
                  $.each(unit, function(index) {
                    this.indexOf(n) >= 0 && (exists[index] = true);
                  });
                });
                $.each(conditions.payment, function() {
                  if (!exists[this]) {
                    throw 'payment';
                  }
                });
              }
              if (conditions.type !== null) {
                if (conditions.type.indexOf(this.ConditionsOfUse.ticketType) < 0) {
                  throw 'type';
                }
              }
              if (conditions.charge !== null) {
                if (conditions.charge.min > this.baseFare || conditions.charge.max < this.baseFare) {
                  throw 'charge';
                }
              }
              if (conditions.other !== null && conditions.other.indexOf('offline') >= 0) {
                if (this.ConditionsOfUse.reservationtype.type === 'offline') {
                  throw 'other.offline';
                }
              }
              $.each(this.Flights, function(index) {
                if (conditions.nonstop instanceof Array && conditions.nonstop.indexOf('nonstop') >= 0) {
                  if (this.flighttype !== 'DR') {
                    throw 'nonstop';
                  }
                }
                if (conditions.flightTime[index] !== null) {
                  var cond = conditions.flightTime[index];
                  var value = minute(this[cond.type].time);
                  if (cond.min > value || cond.max < value) {
                    throw 'flightTime';
                  }
                }
                if (conditions.airport[index] !== null) {
                  var cond = conditions.airport[index];
                  if (cond.departure.length > 0 && cond.departure.indexOf(this.departure.code) < 0) {
                    throw 'airport';
                  }
                  if (cond.arrival.length > 0 && cond.arrival.indexOf(this.arrival.code) < 0) {
                    throw 'airport';
                  }
                }
                var checkSegment = (
                  conditions.connectTime[index] !== null ||
                  conditions.airline !== null ||
                  conditions.seat !== null ||
                  conditions.equipment !== null ||
                  (conditions.other !== null && conditions.other.indexOf('sharing') >= 0) ||
                  (conditions.other !== null && conditions.other.indexOf('remain') >= 0)
                );
                if (checkSegment) {
                  $.each(this.Segments, function(index) {
                    if (conditions.connectTime[index] !== null && index > 0) {
                      var value = minute(this.Departure.time);
                      if (cond.min > value || cond.max < value) {
                        throw 'connectTime';
                      }
                    }
                    if (conditions.airline !== null) {
                      if (conditions.airline.indexOf(this.Carrier.airline.code) < 0) {
                        throw 'airline';
                      }
                    }
                    if (conditions.seat !== null) {
                      if (conditions.seat.indexOf(this.Carrier.classOfService.cabinclass) < 0) {
                        throw 'seat';
                      }
                    }
                    if (conditions.equipment !== null) {
                      if (conditions.equipment.indexOf(this.Carrier.equipment.code) < 0) {
                        throw 'equipment';
                      }
                    }
                    if (conditions.other !== null && conditions.other.indexOf('sharing') >= 0) {
                      if (this.Carrier.operator && this.Carrier.operator.name) {
                        throw 'other.sharing';
                      }
                    }
                    if (conditions.other !== null && conditions.other.indexOf('remain') >= 0) {
                      if (this.Carrier.classOfService.seatremains <= 0) {
                        throw 'other.remain';
                      }
                    }
                  });
                }
              });
              delete this._hidden;
            } catch (e) {
              this._hidden = true;
            }
          };

          var flightLength = 0;
          var airports = {};
          var airlines = {};
          var equipments = {};
          var charge = {};

          $.each(entries, function() {
            var entry = this;

            if (entry.Flights.length > flightLength) {
              flightLength = entry.Flights.length;
            }

            var basefare = entry.baseFare|0;
            if ('min' in charge === false || charge.min > basefare) {
              charge.min = basefare;
            }
            if ('max' in charge === false || charge.max < basefare) {
              charge.max = basefare;
            }

            $.each(entry.Flights, function(index) {
              if (index in airports === false) {
                airports[index] = {departure: {}, arrival: {}};
              }
              var append = function(self, type) {
                if (self[type].code in airports[index][type]) {
                  airports[index][type][self[type].code].count ++;
                } else {
                  airports[index][type][self[type].code] = {value: self[type].code, count: 1, name: self[type].name};
                }
              };
              append(this, 'departure');
              append(this, 'arrival');

              if (this.departure.code in airports[index].departure) {
                airports[index].departure[this.departure.code].count ++;
              } else {
                airports[index].departure[this.departure.code] = {
                  value: this.departure.code,
                  count: 1,
                  name: this.departure.name
                };
              }
              if (this.arrival.code in airports[index].arrival) {
                airports[index].arrival[this.arrival.code].count ++;
              } else {
                airports[index].arrival[this.arrival.code] = {
                  value: this.arrival.code,
                  count: 1,
                  name: this.arrival.name
                };
              }

              $.each(this.Segments, function() {
                var a = this.Carrier.airline;
                if (a.code in airlines === false) {
                  airlines[a.code] = {value: a.code, count: 0, name: a.name};
                }
                if ('min' in airlines[a.code] === false || airlines[a.code].min > entry.baseFare) {
                  airlines[a.code].min = entry.baseFare;
                }
                airlines[a.code].count ++;

                var e = this.Carrier.equipment;
                if (e.code in equipments) {
                  equipments[e.code].count ++;
                } else {
                  equipments[e.code] = {value: e.code, count: 0, name: e.name};
                }
              });
            });

            filtering.apply(this);
          });
          status();

          filters.flightTime.view(flightLength, '.filter-flight');
          filters.connectTime.view(flightLength, '.filter-flight');
          filters.airport.view(airports);
          filters.airline.view(airlines, '.filter-contents__body', 'airline', false, function(label, data) {
            return label
              .append($('<span>').addClass('is-left').text(data.name))
              .append($('<span>').addClass('is-right').text(Func.money(data.min, 'suffix') + '〜'));
          });
          filters.equipment.view(equipments, '.filter-contents__body', 'equipment');
          filters.charge.set(charge);

          if (!initialized) {
            initialized = true;
            $.each(filters, function(index) {
              var self = this;
              this.change(function() {
                conditions[index] = self.get();
                $.each(entries, filtering);
                status();
                changed = true;
              });
            });
          }

          return entries;
        };

        modal.find('.filter-reset').on('click', function() {
          $.each(filters, function() {
            this.reset();
          });
          filter();
          changed = true;
          return false;
        });

        return filter;
      },

      stack: function(result, entries, index) {
        $.each(result.FareGroups.FareGroup, function() {
          if (!index[this.id]) {
            index[this.id] = true;
            this._q = entries.length;
            entries.push(this);
          }
        });
        $('.list-count').each(function() {
          var format = $(this).data('format');
          if (!format) {
            $(this).data('format', format = $(this).text());
          }
          $(this).text(format.replace(/−/, entries.length));
        });
      },

      view: function(entries, key) {
        var list = $('ul.list:not(.selecteddom)').hide();
        $('#loading').remove();

        var itemObj = list.data('item');
        if (!itemObj) {
          itemObj = list.find('> li').detach();
          list.data('item', itemObj);
        }
        list.empty();

        var toDuration = function(n, en) {
          var m = n % 60;
          var h = Math.floor(n / 60);
          var part = [];
          h > 0 && part.push(h + (en ? 'h ' : '時間'));
          m > 0 && part.push(m + (en ? 'm' : '分'));
          return part.join('');
        };

        var embed = function(item, data) {
          var last = data.Flights.length - 1;
          var vary = {
            departure: (last !== 0 && data.Flights[0].departure.code !== data.Flights[last].arrival.code),
            arrival: (last === 1 && data.Flights[0].arrival.code !== data.Flights[last].departure.code)
          };

          var logo = function(target, code) {
            //target.attr('src', Func.vsprintf('images/icon_%s.png', [code]));
            target.attr('src', Func.vsprintf('https://www.ena.travel/air/images/air_common/crr/%s.png', [code]));
          };

          item.find('.title-airline__name').text(data.ConditionsOfUse.airline.name);
          item.find('.data-price__num').html(Func.money(data.baseFare, 'prefix'));

          logo(item.find('.title-airline__logo'), data.ConditionsOfUse.airline.code);

          var traveler = {};
          $.each(data.TravelerGroups, function() {
            if (this.type === 'ADT') {
              traveler.adult = this.Price.baseFare;
            } else if (this.type === 'CHD') {
              traveler.child = this.Price.baseFare;
            }
          });
          if (!traveler.adult || !traveler.child || traveler.adult === traveler.child) {
            item.find('.js-feature-tooltip li:eq(0)').hide();
          }
          if (data.ConditionsOfUse.reservationtype.type !== 'offline') {
            item.find('.js-feature-tooltip li:eq(1)').hide();
          }
          if (data.ConditionsOfUse.ticketType === 'IT') {
            item.find('.js-feature-tooltip li:eq(3)').hide();
          } else if (data.ConditionsOfUse.ticketType === 'PEX') {
            item.find('.js-feature-tooltip li:eq(2)').hide();
          } else {
            item.find('.js-feature-tooltip li:eq(2)').hide();
            item.find('.js-feature-tooltip li:eq(3)').hide();
          }
          var seat = {};
          $.each(data.Flights, function() {
            $.each(this.Segments, function() {
              seat[this.Carrier.classOfService.cabinclass] = true;
            })
          });
          if (Status.search.seat) {
            seat[Status.search.seat] = false;
          } else {
            seat.EC = false;
          }
          seat.EC || item.find('.js-feature-tooltip li:eq(4)').hide();
          seat.PE || item.find('.js-feature-tooltip li:eq(5)').hide();
          seat.BU || item.find('.js-feature-tooltip li:eq(6)').hide();
          seat.FI || item.find('.js-feature-tooltip li:eq(7)').hide();

          var flightObj = item.find('.flight-outline > li').detach();
          for (var i = 0; i <= last; i ++) {
            var f = data.Flights[i];
            var flight = flightObj.clone(true);

            flight.find('.flight-num').append(i + 1);

            flight.find('.flight-airport:eq(0)')
              .find('.time').text(f.departure.time).end()
              .find('.airport-serial').text(f.departure.code).end();
            flight.find('.flight-airport:eq(1)')
              .find('.time').text(f.arrival.time).end()
              .find('.airport-serial').text(f.arrival.code).end();
            flight.find('.flight-time .time').text(toDuration(f.totalFlightDuration));

            flight.find('.flight-airport:eq(1) .time').prepend(function() {
              var value = null;
              var p1 = Math.floor((new Date(f.departure.date)).getTime() / (86400 * 1000));
              var p2 = Math.floor((new Date(f.arrival.date)).getTime() / (86400 * 1000));
              if (p1 > p2) {
                value = '-' + (p1 - p2) + '日';
              } else if (p2 > p1) {
                value = '+' + (p2 - p1) + '日';
              }
              if (value !== null) {
                return $('<span>').addClass('distance').text(value);
              }
            });

            if (vary.departure) {
              i === 0 && flight.find('.flight-airport:eq(0) .airport-serial').addClass('is-caution');
              i === last && flight.find('.flight-airport:eq(1) .airport-serial').addClass('is-caution');
            }
            if (vary.arrival) {
              i === 0 && flight.find('.flight-airport:eq(1) .airport-serial').addClass('is-caution');
              i === last && flight.find('.flight-airport:eq(0) .airport-serial').addClass('is-caution');
            }

            switch (f.flighttype) {
              case 'DR':
                flight.find('.flight-connection').addClass('is-no-connect').text('直行便');
                break;
              case 'TR':
                var connection = -1;
                $.each(f.Segments, function() {
                  connection += this.numOfStops + 1;
                });
                var n = '乗継' + connection + '回';
                flight.find('.flight-connection').text(n);
                break;
              case 'VA':
                flight.find('.flight-connection').addClass('is-no-connect').text('経由便');
                break;
            }

            item.find('.flight-outline').append(flight);
          }

          item.find('a.js-show-modal').on('click', function() {
            var modal = $('#js-modal-detail').data('entry', data);

            modal.find('.js-tabs .js-tab:eq(0)').trigger('click');

            var format = modal.data('format');
            if (!format) {
              format = {};
              format.timeline = modal.find('.timeline > li').detach();
              format.flight = modal.find('.flights-list > li').detach();
              format.caution = modal.find('.caution-message').detach();
              format.price = modal.find('.price-detail__type').detach();
              format.remark = modal.find('.tab-info__contents:eq(2) .caution').detach();
              modal.data('format', format);
            }

            var balloon = function(message) {
              return $('<p>').addClass('balloon').text(message);
            };

            modal.find('.modal-header .price').html(Func.money(data.baseFare, 'prefix'));
            modal.find('.flights-list').empty();
            modal.find('.caution-message').remove();

            modal.find('.amount .price').html(Func.money(data.totalPrice, 'prefix'));
            if (data.point|0 > 0) {
              modal.find('.amount .amount__point').find('.point').text(data.point).end().show();
            } else {
              modal.find('.amount .amount__point').find('.point').text('').end().hide();
            }

            var late = false;
            for (var i = 0; i <= last; i ++) {
              var f = data.Flights[i];
              var flight = format.flight.clone(true);

              flight.find('.flight-num').append(i + 1);
              flight.find('.flight-time').text(toDuration(f.totalFlightDuration));

              switch (f.flighttype) {
                case 'DR':
                  flight.find('.flight-connection').addClass('is-no-connect').text('直行便');
                  break;
                case 'TR':
                  var connection = -1;
                  $.each(f.Segments, function() {
                    connection += this.numOfStops + 1;
                  });
                  var n = '乗継' + connection + '回';
                  flight.find('.flight-connection').text(n);
                  break;
                case 'VA':
                  flight.find('.flight-connection').remove();
                  break;
              }

              var classes = {
                'EC': 'エコノミー',
                'PE': 'プレミアムエコノミー',
                'BU': 'ビジネス',
                'FI': 'ファースト	',
              };
              for (var j = 0; j < f.Segments.length; j ++) {
                var s = f.Segments[j];
                var l = (j + 1) >= f.Segments.length;

                var carrier = [
                  s.Carrier.airline.code,
                  s.Carrier.flightNumber,
                  '/',
                  classes[s.Carrier.classOfService.cabinclass],
                  '(' + s.Carrier.classOfService.bookingclass + ')'
                ];
                var t1 = format.timeline.clone(true);
                t1.find('.head')
                  .find('.time').text(s.Departure.time).end()
                  .find('.date').text(Func.date(s.Departure.date, 'mini')).end();
                logo(t1.find('.logo'), s.Carrier.airline.code);
                t1.find('.travel-time .time').text(toDuration(s.flightDuration, true));
                t1.find('.airport-serial').text(s.Departure.airport.code);
                t1.find('.airport-name').text(s.Departure.airport.name);
                t1.find('.timeline-content .airline')
                  .append(document.createTextNode(s.Carrier.airline.name))
                  .append('<br>')
                  .append(document.createTextNode(carrier.join(' ')))
                  .append('<br>')
                  .append(document.createTextNode(s.Carrier.equipment.name));
                if (vary.departure && i === 0 && j === 0) {
                  t1.find('.airport-serial').addClass('is-caution');
                  t1.find('.timeline-content').append(balloon('発着空港が異なります。'));
                }
                if (vary.arrival && i === last && j === 0) {
                  t1.find('.airport-serial').addClass('is-caution');
                }
                if (s.numOfStops > 0) {
                  t1.find('.timeline-content').append(balloon('この便は経由便となりますので、途中経由地に立ち寄ります。'));
                }
                if (s.Carrier.equipment.code === 'TRN') {
                  t1.find('.timeline-content').append(balloon('この区間は鉄道利用となります。'));
                }
                if (s.Carrier.equipment.code === 'BUS') {
                  t1.find('.timeline-content').append(balloon('この区間はバス利用となります。'));
                }
                if (s.Carrier.operator && s.Carrier.operator.name) {
                  t1.find('.timeline-content').append(balloon('コードシェア便です。運航：' + s.Carrier.operator.name));
                }

                var t2 = format.timeline.clone(true);
                t2.find('.head')
                  .find('.time').text(s.Arrival.time).end()
                  .find('.date').text(Func.date(s.Arrival.date, 'mini')).end();
                t2.find('.travel-time').remove();
                t2.find('.airport-serial').text(s.Arrival.airport.code);
                t2.find('.airport-name').text(s.Arrival.airport.name);
                t2.find('.timeline-content .airline').remove();
                if (!l) {
                  t2.addClass('is-connection');
                  if (s.changeOfAirport === 'Y') {
                    t2.find('.timeline-content').append(balloon('お乗り継ぎに空港間の移動を伴います。'));
                  }
                  if (s.changeOfDate === 'Y') {
                    t2.find('.timeline-content').append(balloon('お乗り継ぎに日をまたぎます。'));
                  }
                }
                if (vary.arrival && i === 0 && l) {
                  t2.find('.airport-serial').addClass('is-caution');
                }
                if (vary.departure && i == last && l) {
                  t2.find('.airport-serial').addClass('is-caution');
                  t2.find('.timeline-content').append(balloon('発着空港が異なります。'));
                }

                flight.find('.timeline').append(t1).append(t2);
              }

              var h = f.Segments[0].Departure.time.split(/:/).shift()|0;
              if (h >= 0 && h <= 2) {
                late = true;
              }

              modal.find('.flights-list').append(flight);
            }
            var img;
            modal.find('.payment-list').empty();
            $.each(data.ConditionsOfUse.PaymentMethods, function() {
              if (SETTINGS.PAYMETHOD[this.type]) {
                img = $('<img>').attr('src', 'images/' + SETTINGS.PAYMETHOD[this.type].icon);
                modal.find('.payment-list').append(img);
              }
            });

            if (!img) {
              $(".payment-list").prev("p").fadeOut(10);
              var payment_txt = '決済方法は手配完了後にご案内します';
              modal.find('.payment-list').append(payment_txt);
            }
            var traveler = [
              {type: 'ADT', label: '大人'},
              {type: 'CHD', label: '子供'},
              {type: 'INF', label: '幼児'}
            ];
            modal.find('.price-detail').empty();
            $.each(traveler, function() {
              var n = this;
              $.each(data.TravelerGroups, function() {
                if (this.type === n.type) {
                  var price = format.price.clone(true)
                    .find('dl:eq(0) dd').text(n.label + this.persons + '人').end()
                    .find('dl:eq(1) dd').text(Func.money(this.Price.baseFare, 'suffix')).end()
                    .find('dl:eq(2) dd').text(Func.money(this.Price.Taxes.total, 'suffix')).end()
                    .find('dl:eq(3) dd').text(Func.money(this.Price.Fee.total, 'suffix')).end()
                    .find('dl:eq(4) dd').text(Func.money(this.Price.total, 'suffix')).end()
                    .find('dl:eq(5) dd').text(Func.money(this.totalPrice, 'suffix')).end();
                  modal.find('.price-detail').append(price);
                }
              });
            });
            modal.find('.js-tab:eq(2)').on('click', function() {
              if((!data.ConditionsOfUse.remark) && (modal.find('#loading').length < 1)){
                var var_loading = '<div id="loading" class="loading"><img src="images/loading.png" alt="" class="loading__icon" width="50" height="50"></div>';
                modal.find('.tab-info__tabs').after(var_loading);
                $('.caution').hide();
              }
            });
            var remark = function(value) {
              var buffer = [];
              var addCaution = function() {
                if (buffer.length > 0) {
                  modal.find('.tab-info__contents:eq(2)').append(function() {
                    return format.remark.clone(true).html(buffer.join('<br>'));
                  });
                  buffer = [];
                }
              };
              $.each((value || '').split(/\n/g), function() {
                var line = $.trim(this);
                if (line === '') {
                  addCaution();
                } else {
                  buffer.push(line);
                }
              });
              $('#loading').remove();
              addCaution();
            };
            modal.find('.tab-info__contents:eq(2)').empty();
            if (data.ConditionsOfUse.remark) {
              remark(data.ConditionsOfUse.remark);
            } else {
              var query = Func.storage(['session', 'code']);
              query.key = key;
              var option = {
                method: 'POST',
                url: Func.url('/air/data/detail/rule', query),
                contentType: 'application/json',
                data: JSON.stringify({id: data.id}),
                dataType: 'json'
              };
              $.ajax(option).done(function(result) {
                remark(data.ConditionsOfUse.remark = result.remark);
              });
            }
            if (late && data.ConditionsOfUse.undetermined === 'AVS') {
              modal.find('.share-buttons').before(function() {
                return format.caution.clone(true)
                  .find('h4').text('お選びのフライトは、午前０時以降にを出発する深夜便です。').end()
                  .find('p').html('深夜便のご予約において、搭乗日をお間違えになる事例が発生しております。<br>午前0時過ぎに出発する深夜便は、出発日の「前日」に空港へお越しいただくこととなります。').end();
              });
            }
            if (data.ConditionsOfUse.reservationtype.type === 'offline') {
              modal.find('.share-buttons').before(function() {
                return format.caution.clone(true)
                  .find('h4').text('リクエスト予約商品です。').end()
                  .find('p').html('予約確定につきましては２４営業時間内に回答いたします。<br>コールセンターにて航空券の利用条件等を確認後に手配を行う商品の為、座席確保できない場合がございます。予めご了承ください。').end();
              });
            }
            if (data.ConditionsOfUse.ticketingCondition === 'REQ') {
              modal.find('.share-buttons').before(function() {
                return format.caution.clone(true)
                  .find('h4').text('').end()
                  .find('p').html('航空会社のルールにより、ただいまの時間こちらの商品は、カード決済以外の場合一旦リクエストでお預かりいたしますので、予めご了承ください。').end();
              });
            }
            if (data.ConditionsOfUse.airline.code === 'YY' && data.ConditionsOfUse.undetermined === 'AVS') {
              modal.find('.share-buttons').before(function() {
                return format.caution.clone(true)
                  .find('h4').text('複数の航空会社を利用する商品です。').end()
                  .find('p').html('フライト変更・キャンセルについては、航空会社の運送約款に基づいた対応がされますが、場合によっては希望通りの代替がされない、代替自体に追加料金が必要な場合がございます。<br>また、お乗り継ぎの際の対応もご自身で管理する必要があります。<br>このようなリスクを低下させる為には、同一航空会社で旅程が完了する商品の購入が必要です。予めご了承ください。').end();
              });
            }

            // DPの場合、追加ボタンアクションを設定してあげる
            var airprice = parseInt(modal.find('.amount__price .price').text().replace(',','').replace(',','').replace(',','').replace('¥','').replace('円','').replace('〜',''));
            var selectedPlanDom = $('<ul class="list selecteddom">'+($(this).parent().prop('outerHTML'))+'</ul>');
            selectedPlanDom.find('.js-show-modal').remove();
            selectedPlanDom.find('.data').append('<input type="hidden" class="price" value="'+airprice+'"/>');
            modal.find('.selectairplan').off('click').on('click', function() {
              $('.dp-current-list__item:first-child .dp-current-item__header .dp-select').addClass('is-selected');
              $('.dp-current-list__item:first-child .dp-current-item__header .dp-select').text('選択済み');
              selectedPlanDom.removeClass('selected');
              selectedPlanDom.find('.selected-head').remove();
              $('.dp-current-list__item:first-child .dp-current-item__contents').html(selectedPlanDom);
              // ホテルも航空券も設定されていたら予約ボタンを表示
              var hotelprice = parseInt($('.dp-current-list__item:last-child .hotel-list-data .price').val());
              if (-1 < parseInt(hotelprice + airprice)){
                var hotelDetail = Func.history('hotel/detail').shift();
                if (hotelDetail == undefined || 0 > hotelDetail.indexOf('{')){
                  return;
                }
                hotelDetail = JSON.parse(hotelDetail);
                if (true != ('paymentmethods' in hotelDetail)){
                    return;
                }
                $('.amount-panel .price').text('¥'+((hotelprice + airprice).toString().replace(/(\d)(?=(\d{3})+$)/g , '$1,')));
                var viewData = data;
                viewData.price = airprice;
                Func.amoundetail(viewData,hotelDetail);
                $('.amount-panel .button-area a').removeClass('is-disable');
                $('.amount-panel .payment-list').empty();
                $.each(data.ConditionsOfUse.PaymentMethods, function() {
                  if (SETTINGS.PAYMETHOD[this.type]) {
                    var baseType = this.type;
                    $.each(hotelDetail.paymentmethods, function() {
                      if (SETTINGS.PAYMETHOD[this.type] && baseType == this.type) {
                        var img = $('<img>').attr('src', 'images/' + SETTINGS.PAYMETHOD[this.type].icon);
                        $('.amount-panel .payment-list').append(img);
                      }
                    });
                  }
                });
                $('.amount-panel').show();
              }
              // 航空券詳細の選択
              // ホテル選択画面用に取っておく
              Func.history('tour/detail/airdom', selectedPlanDom.prop('outerHTML'));
              // 航空券画面での復帰用に取っておく
              var arrival = qFlight.decode(Status.search['flight.1']);
              var airpoint = 0;
              if (data.point| 0 > 0) {
                airpoint = data.point;
              }
              Func.history('air/detail', JSON.stringify({key: key, id:data.id, arrival:arrival.arrival, paymentmethods:data.ConditionsOfUse.PaymentMethods, price: airprice, point:airpoint, travelergroups:data.TravelerGroups, time:new Date().getTime()}));
              // モーダル閉じる
              modal.find('.js-close-modal').trigger('click');
            });

            modal.find('.button-area a.is-set').off('click').on('click', function() {
              var conditions = Status.search;
              // チェックイン期間の特定
              var range = $('.search-form .flight-calendar').data('range');
              conditions['stay'] = qStay.encode(range);
              var rooms = [];
              $('#js-modal-people .js-people-selector').each(function() {
                var adult = $(this).find('.js-people-num-adult').val()|0;
                var children = [];
                $(this).find('.select-children-age .is-show').each(function() {
                  children.push($(this).find('select').val()|0);
                });
                adult > 0 && rooms.push({adult: adult, children: children});
              });
              if (rooms.length <= 0) {
                return Func.error('*SEARCH_FAILURE');
              }
              conditions['room'] = qRoom.encode(rooms);
              var arrival = qFlight.decode(conditions['flight.1']);
              // DPの場合はホテルのリージョン情報をまず手に入れる
//              var e = getLocation(arrival.arrival);
//              if (typeof e != 'object'){
//                return Func.error('*SEARCH_MISSING_STAYPLACE');
//              }
//              var arrivalName = e.jp || e.cityname || e.airport;
//              if (0 >= arrivalName.length){
//                return Func.error('*SEARCH_MISSING_STAYPLACE');
//              }
              var option = {
                method: 'GET',
                url: Func.url('/hotel/data/suggestion', {q: arrival.arrival, type:'airportcity'}),
                contentType: 'application/json',
                dataType: 'json'
              };
              $.ajax(option).done(function(result) {
                var _data = result.found[0];
                conditions[_data.datatype] = _data.id;
                // ホテル選択画面用に取っておく
                Func.history('tour/detail/airdom', selectedPlanDom.prop('outerHTML'));
                // DP航空券画面での復帰用に取っておく
                var airprice = parseInt(modal.find('.amount__price .price').text().replace(',','').replace(',','').replace(',','').replace('¥','').replace('円','').replace('〜',''));
                var airpoint = 0;
                if (data.point| 0 > 0) {
                  airpoint = data.point;
                }
                Func.history('air/detail', JSON.stringify({key:key_, id:data.id, arrival:arrival.arrival, paymentmethods:data.ConditionsOfUse.PaymentMethods, price: airprice, point:airpoint, travelergroups:data.TravelerGroups, time:new Date().getTime()}));
                // DPの航空券検索結果画面へ遷移
                location.href = Func.url('tour/search', conditions, function(build) {
                  if (Status.pathname[0] === 'air' && Status.pathname[1] === 'search') {
                    Func.history('hotel/detail', false);
                    Func.history('tour/detail/hoteldom', false);
                  }
                  //var _condition = Func.history('air/cond').shift();
                  var _condition = Func.history('air/search').shift();
                  if (_condition != undefined){
                    // 検索条件のマージ
                    if (true == ('region' in _condition) && true != ('region' in build) && true != ('hotel' in build)){
                      Func.history('tour/detail/hoteldom', false);
                      Func.history('hotel/detail', false);
                      build.region = _condition.region;
                    }
                    if (true == ('hotel' in _condition) && true != ('region' in build) && true != ('hotel' in build)){
                      Func.history('tour/detail/hoteldom', false);
                      Func.history('hotel/detail', false);
                      build.hotel = _condition.hotel;
                    }
                    if (true == ('room' in _condition) && true != ('room' in build)){
                      build.room = _condition.room;
                    }
                    if (true == ('stay' in _condition) && true != ('stay' in build)){
                      build.stay = _condition.stay;
                    }

                    // 航空券選択キャッシュ削除判定
                    if (false == (true == ('flight.1' in _condition) && true == ('flight.1' in build) && build['flight.1'] == _condition['flight.1'])) {
                      // 条件が変わったのでキャッシュをクリアする
                      Func.history('tour/detail/airdom', false);
                      Func.history('air/detail', false);
                    }
                    // 航空券選択キャッシュ削除判定
                    if (false == (true == ('flight.2' in _condition) && true == ('flight.2' in build) && build['flight.2'] == _condition['flight.2'])) {
                      // 条件が変わったのでキャッシュをクリアする
                      Func.history('tour/detail/airdom', false);
                      Func.history('air/detail', false);
                    }
                    // 航空券選択キャッシュ削除判定
                    if (true == ('seat' in build) && false == (true == ('seat' in _condition) && true == ('seat' in build) && build['seat'] == _condition['seat'])) {
                      Func.history('tour/detail/airdom', false);
                      Func.history('air/detail', false);
                    }
                    // 航空券選択キャッシュ削除判定
                    if (false == (true == ('traveler' in _condition) && true == ('traveler' in build) && build['traveler'] == _condition['traveler'])) {
                      // XXX 年齢しか変わっていなくて同乗者数に変わりがないかを再判定
                      var buildTraveler = null;
                      if (true == ('traveler' in build)){
                        buildTraveler = build.traveler.split(' ');
                      }
                      var condTraveler = null;
                      if (true == ('traveler' in _condition)){
                        condTraveler = _condition.traveler.split(' ');
                      }
                      var airclear = false;
                      if (buildTraveler == null){
                        airclear = true;
                      }
                      else if (condTraveler == null){
                          airclear = true;
                      }
                      else if (condTraveler[0] != buildTraveler[0]){
                          airclear = true;
                      }
                      if (airclear == true){
                        Func.history('tour/detail/airdom', false);
                        Func.history('air/detail', false);
                      }
                    }
                    // ホテル選択キャッシュ削除判定
                    if (false == (true == ('stay' in _condition) && true == ('stay' in build) && build['stay'] == _condition['stay'])) {
                      Func.history('tour/detail/hoteldom', false);
                      Func.history('hotel/detail', false);
                    }
                    // ホテル選択キャッシュ削除判定
                    if (false == (true == ('room' in _condition) && true == ('room' in build) && build['room'] == _condition['room'])) {
                      Func.history('tour/detail/hoteldom', false);
                      Func.history('hotel/detail', false);
                    }
                    // ホテル選択キャッシュ削除判定
                    if (false == 
                      (  true == (true == ('region' in _condition) && true == ('region' in build) && build['region'] == _condition['region'])
                      || true == (true == ('hotel' in _condition) && true == ('hotel' in build) && build['hotel'] == _condition['hotel'])
                    )) {
                      Func.history('tour/detail/hoteldom', false);
                      Func.history('hotel/detail', false);
                    }
                  }
                  Func.history('tour/cond', build);
                });
              });
              return false;;
            });

            modal.find('.button-area a:not(.is-set):not(.selectairplan)')
              .removeClass('is-disable')
              .off('click')
              .on('click', function() {
                $(this).addClass('is-disable');
                // loading
                if( ($('#js-modal-loading').find('.loading').length < 1)){
                  var var_loading = '<div id="loading" class="loading"><img src="images/loading.png" alt="" class="loading__icon" width="50" height="50" margin-top="50%"></div>';
                  $('#js-modal-loading').find('.modal__window').after(var_loading);
                }
                $('#js-modal-loading').show();
                var option = {
                  method: 'POST',
                  url: Func.url('/air/data/detail/seat', Func.storage(['session', 'code'])),
                  contentType: 'application/json',
                  data: JSON.stringify({key: key_, id: data.id}),
                  dataType: 'json'
                };
                $.ajax(option).done(function(result) {
                  if (result.status === 'success') {
                    var referer = Func.storage('referer');
                    var traveler = qTraveler.decode(Status.search.traveler);
                    var ins = 0;
                    $.each(traveler.children, function() {
                      if (this.age <= 1 && this.seat) {
                        ins ++;
                      }
                    });
                    var routes = [];
                    for (var i = 1; i <= 6; i ++) {
                      var key = Func.vsprintf('flight.%d', [i]);
                      var flight = qFlight.decode(Status.search[key]);
                      flight && routes.push(Func.vsprintf('%s-%s-%d%02d%02d-%s', [
                        flight.departure,
                        flight.arrival,
                        flight.date.year,
                        flight.date.month,
                        flight.date.day,
                        flight.direct ? 'direct' : 'nondirect'
                      ]));
                    }

                    var param = {
                      backurl: location.href,
                      operate: 'union',
                      adt: traveler.adult,
                      chd: traveler.child,
                      ins: ins,
                      inf: traveler.baby - ins,
                      referer: referer || document.referrer,
                      sessionkey: result.sessionkey,
                      url: document.referrer,
                      route: routes.join('|')
                    };

                    $('<form/>')
                      .attr({
                        method: 'POST',
                        action: SETTINGS.AIR.RESERVATION + '?' + $.param(param)
                      })
                      .appendTo(document.body).submit();
                      //.trigger('submit');

                  } else {
                    // FIXME: Error
                    var errors = {
                      OTAD0001:	'JSON/XMLの形式が不正',
                      OTAD0002: 'セッションタイムアウト',
                      OTAD0003: '指定商品番号なし',
                      OTAD0004: '空席なし',
                      OTAD0005: '販売終了',
                      OTAD0006: '空室なし',
                      OTAD0007: '該当ホテルなし',
                      OTAD0008: '販売不可',
                      OTAD0009: '検索結果該当なし',
                      OTAI0001: 'OriginDestination未指定',
                      OTAI0002: 'OriginDestinationがMAX以上',
                      OTAI0003: '大人人数不正',
                      OTAI0004: '幼児人数不正',
                      OTAI0005: '合計人数不正',
                      OTAI0006: '出発日不正',
                      OTAI0007: '出発地未指定',
                      OTAI0008: '目的地未指定',
                      OTAI0009: '商品コード不備',
                      OTAI0010: 'チェックイン日不正',
                      OTAI0011: 'チェックアウト日不正',
                      OTAI0012: '宿泊日数不正',
                      OTAI0013: '宿泊人数未指定',
                      OTAI0014: '宿泊エリア未指定',
                      OTAI0015: 'ホテル未指定',
                      OTAN0001: '外部API通信エラー',
                      OTAN0002: '外部APIレスポンスエラー(リトライ不可)',
                      OTAN0003: '外部APIレスポンスエラー(リトライ可)',
                      OTAN0004: '内部エラー(リトライ不可)',
                      OTAN0005: '内部エラー(リトライ可)'
                    };
                    Func.error('エラーが発生しました : ' + errors[result.code], true);
                    //Func.debug(errors[result.code]);
                    $('#js-modal-loading').hide();
                    $(this).removeClass('is-disable');
                  }
                });
                return false;
              });

            var option = {
              method: 'POST',
              url: Func.url('/air/data/favorite/exists', Func.storage(['session'])),
              contentType: 'application/json',
              data: JSON.stringify({id: data.id}),
              dataType: 'json'
            };
            $.ajax(option).done(function(result) {
              var fav = $('#js-modal-detail .js-toggle-fav');
              result.exists ? fav.addClass('is-fav') : fav.removeClass('is-fav');
            });

            return false;
          });

          var airprice = -1;
          var hotelprice = -1;
          var airpaymentmethods = [];
          var hotelpaymentmethods = [];
          // DP航空券の場合の復帰処理
          if (0 < $('.dp-current-list__item:first-child .dp-current-item__header .dp-select:not(.is-selected)').size()){
            var airDetail = Func.history('air/detail').shift();
            if (airDetail != undefined && -1 < airDetail.indexOf('{')){
              airDetail = JSON.parse(airDetail);
              if (true == ('id' in airDetail)  && true == ('arrival' in airDetail) && airDetail.id == data.id && airDetail.arrival == data.Flights[0].arrival.code) {
                // 航空券の復帰
                var currentPlanDom = $('<ul class="list selecteddom">'+(item.prop('outerHTML'))+'</ul>');
                currentPlanDom.find('.js-show-modal').remove();
                $('.dp-current-list__item:first-child .dp-current-item__header .dp-select').addClass('is-selected');
                $('.dp-current-list__item:first-child .dp-current-item__header .dp-select').text('選択済み');
                currentPlanDom.removeClass('selected');
                currentPlanDom.find('.selected-head').remove();
                $('.dp-current-list__item:first-child .dp-current-item__contents').html(currentPlanDom);
                airprice = airDetail.price;
                airpaymentmethods = airDetail.paymentmethods;
              }
            }
            $('.dp-current-list__item:first-child .dp-current-item__header .dp-select:not(.is-selected)').text('未選択');
          }
          if (0 < $('.dp-current-list__item:last-child .dp-current-item__header .dp-select:not(.is-selected)').size()){
            var hotelDetail = Func.history('hotel/detail').shift();
            if (hotelDetail != undefined && -1 < hotelDetail.indexOf('{')){
              // ホテルの復帰
              hotelDetail = JSON.parse(hotelDetail);
              //var flight = qFlight.decode(Status.search['flight.1']);
              //if (true == ('arrival' in hotelDetail) && hotelDetail.arrival == flight.arrival) {
              if (true == ('price' in hotelDetail)){
                var currentPlanDom = Func.history('tour/detail/hoteldom').shift();
                if (currentPlanDom != undefined){
                  //var _currentPlanDom = $('<ul class="list selecteddom">'+(currentPlanDom)+'</ul>');
                  $('.dp-current-list__item:last-child .dp-current-item__header .dp-select').addClass('is-selected');
                  $('.dp-current-list__item:last-child .dp-current-item__header .dp-select').text('選択済み');
                  currentPlanDom.removeClass('selected');
                  currentPlanDom.find('.selected-head').remove();
                  $('.dp-current-list__item:last-child .dp-current-item__contents').html(currentPlanDom);
                  hotelprice = hotelDetail.price;
                  hotelpaymentmethods = hotelDetail.paymentmethods;
                }
              }
            }
            $('.dp-current-list__item:last-child .dp-current-item__header .dp-select:not(.is-selected)').text('未選択');
          }
          // ホテルも航空券も設定されていたら予約ボタンを表示
          if (-1 < airprice && -1 < hotelprice && -1 < parseInt(hotelprice + airprice)){
            $('.amount-panel .price').text('¥'+((hotelprice + airprice).toString().replace(/(\d)(?=(\d{3})+$)/g , '$1,')));
            Func.amoundetail(airDetail,hotelDetail);
            $('.amount-panel .button-area a').removeClass('is-disable');
            $('.amount-panel .payment-list').empty();
            $.each(airpaymentmethods, function() {
              if (SETTINGS.PAYMETHOD[this.type]) {
                var baseType = this.type;
                $.each(hotelpaymentmethods, function() {
                  if (SETTINGS.PAYMETHOD[this.type] && baseType == this.type) {
                    var img = $('<img>').attr('src', 'images/' + SETTINGS.PAYMETHOD[this.type].icon);
                    $('.amount-panel .payment-list').append(img);
                  }
                });
              }
            });
            $('.amount-panel').show();
          }
          return item;
        };

        var created = [];
        var create = function() {
          if (entries.length > created.length) {
            var pager = SETTINGS.AIR.PAGER;
            $.each(entries, function() {
              if (!this._hidden && created.indexOf(this.id) < 0) {
                if (-- pager >= 0) {
                  created.push(this.id);
                  var cItemObj = itemObj.clone(true);
                  cItemObj.removeClass('selected');
                  cItemObj.find('.selected-head').remove();
                  list.append(embed(cItemObj, this));
                  //list.append(embed(itemObj.clone(true), this));
                } else {
                  return false;
                }
              }
            });
          }
        };
        create();

        $(document).off('.pagination').on('scroll.pagination', function() {
          var margin = 100;
          var bottom = $(this).height() - $(window).height() - $(this).scrollTop() - margin < 0;
          var overflow = $(document).height() !== $(window).height();
          bottom && overflow && create();
        });

        list.show();
      }
    };

    methods.bindAirline = function() {
      $('[data-target="js-airline-value"]').each(function() {
        var self = this;
        var onClick = Func.absorb($(this).find('a'), 'click');

        $.each(AIR_LINE, function(index) {
          var a = $('<a>')
            .data('id', index)
            .attr('href', '#')
            .addClass('open-selector__item js-select-item')
            .text(this)
            .on('click', onClick);
          $(self).append(a);
        });
      });
    };

    methods.bindAirport = function() {
      var append = function(target, id, name, detail) {
        var e = getLocation(id);
        if (e !== null) {
          var a = $('<a>')
            .data('id', id)
            .attr('href', '#')
            .addClass('js-select-airport')
            .addClass(name);
          if (detail) {
            a.append($('<span>').addClass('serial').text(id));
            a.append(function() {
              return $('<span>')
                .addClass('detail')
                .append($('<span>').addClass('city').text(e.cityname))
                .append($('<span>').addClass('name').text(e.airport));
            });
          } else {
            a.text(e.airport);
          }
          target.append(a);
        }
      };

      var initialize = function() {
        var self = this;
        var path = ['air', 'search'];
        $(this).hasClass('is-departure') && path.push('departure');
        $(this).hasClass('is-arrival') && path.push('arrival');

        var click = function() {
          var id = $(this).data('id');
          if ($(self).find('.search-item__value').text(id).length <= 0) {
            $(self)
              .find('.search-item').append($('<span>').addClass('search-item__value').text(id)).end()
              .find('.search-item__title').addClass('is-left is-half').end();
          }
          Func.history(path.join('/'), id);
          $('.search-airport').trigger('flush');
          $(self).find('.js-close-input-airport').trigger('click');
          return false;
        };

        $(this).find('.suggested-city .js-select-airport').on('click', click);
        var search = $(this).find('.suggested-search.tab-contents-item').on('click', '.js-select-airport', click);
        var histories = $(this).find('.suggested-search.history').on('click', '.js-select-airport', click);

        $(this).find('.input-airport')
          .on('keyup touchend change', function(event) {
            var value = $.trim($(this).val());
            search.empty();
            if (value !== '') {
              $.each(location_index, function(index) {
                var e = getLocation(index);
                if (e.value.indexOf(value.toUpperCase()) >= 0 || e.en.toUpperCase().indexOf(value.toUpperCase()) >= 0) {
                  append(search, index, 'suggested-search__item', true);
                }
              });
            }
          })
          .on('keypress', function(event) {
            var tab = $(this).closest('.input-area').find('.js-tab:first');
            tab.hasClass('is-active') || tab.trigger('click');
            if (event.keyCode === 13) {
              search.find('.js-select-airport:first').trigger('click');
            }
          });

        $(this).on('flush', function() {
          var list = Func.history(path.join('/'));
          if (list.length > 0) {
            histories.empty();
            $.each(list, function() {
              append(histories, this, 'suggested-search__item', true);
            });
            histories.closest('.input-airport-history').show();
          } else {
            histories.closest('.input-airport-history').hide();
          }
        });

        $(this).trigger('flush');
      };

      if ($('#js-add-flight').length > 0) {
        var events = {
          open: Func.absorb($('.js-open-input-airport'), 'click'),
          close: Func.absorb($('.js-close-input-airport'), 'click'),
          calendar: Func.absorb($('.flight-calendar'), 'update')
        };
        var obs = new MutationObserver(function(mutations) {
          $.each(mutations, function() {
            $.each(this.addedNodes, function() {
              $(this).find('.js-open-input-airport').on('click', events.open);
              $(this).find('.js-close-input-airport').on('click', events.close);
              $(this).find('.flight-calendar').on('update', events.calendar);
              $(this).find('.search-airport').each(initialize);
            });
          });
        });
        obs.observe($('.form-flight__wrapper').get(0), {childList: true});
      }

      $('.search-airport').each(initialize);
    };

    methods.bindSearch = function(type, locationurl) {
      var targets = [
        '.search-panel:not(.hotel-search) .button-area a',
        '.research-panel:not(.hotel-search) .button-area a',
        'a.dp-link-search',
      ];
      $(targets.join(',')).bind('click', function() {
        var traveler = {
          adult: $('section:not(.modal) .search-form .js-input-adult').text()|0,
          child: $('section:not(.modal) .search-form .js-input-child').text()|0,
          baby: $('section:not(.modal) .search-form .js-input-baby').text()|0,
          children: []
        };
        if (traveler.adult < 1) {
          traveler.adult = 1;
        }

        //var brandData = Func.history('top/brand').shift();
        if (traveler.adult + traveler.child + traveler.baby > 11) {
          return Func.error('*SEARCH_TOO_MANY_TRAVELERS');
        }

        if (traveler.adult < traveler.baby) {
          return Func.error('*SEARCH_TOO_MANY_BABIES');
        }

        $('#js-modal-people .js-select-age .is-show').each(function() {
          traveler.children.push({
            age: $(this).find('.js-select-child-age').val()|0,
            seat: $(this).find('.js-switch-seat').prop('checked')
          });
        });

        var isset = $(this).hasClass('is-set');
        if (!isset){
          isset = $(this).hasClass('isset');
        }
        var conditions = {
          referer: setreferer || type,
          traveler: qTraveler.encode(traveler),
          airline: $('[data-target="js-airline-value"] a.is-active').data('id'),
          seat: $('[data-target="js-seat-value"] a.is-active').data('id'),
          set: isset
        };

        var flight = function(target) {
          var data = {
            departure: target.find('.is-departure .search-item__value').text(),
            arrival: target.find('.is-arrival .search-item__value').text(),
            range: target.find('.flight-calendar').data('range'),
            direct: target.find('.flight-nonstop').prop('checked')
          };
          if (data.departure === '') {
            throw '*SEARCH_MISSING_DEPARTURE';
          }
          if (data.arrival === '') {
            throw '*SEARCH_MISSING_ARRIVAL';
          }
          if (SETTINGS.AIR.REQUIRE.SCHEDULE && !data.range) {
            throw '*SEARCH_MISSING_SCHEDULE';
          }
          // 日付が過去日ならエラー
          if (SETTINGS.AIR.REQUIRE.SCHEDULE){
            var chk_rangefrom = new Date(data.range.from.year, data.range.from.month -1, data.range.from.day);
            var chk_nowdate = new Date();
            chk_rangefrom.setDate(chk_rangefrom.getDate() + 1);
            if (false === (chk_nowdate < chk_rangefrom)){
              throw '*SEARCH_OUTOFRANGE_SCHEDULE';
            }
          }
          return data;
        };

        var arrivalID;
        try {
          var flights = $('.js-form-flight');
          if (flights.length > 0) {
            flights.each(function(index) {
              var n = flight($(this));
              var name = Func.vsprintf('flight.%d', [index + 1]);
              conditions[name] = qFlight.encode({
                departure: n.departure,
                arrival: n.arrival,
                date: n.range.from,
                direct: n.direct
              });
              arrivalID = n.arrival;
            });
          } else {
            var n = flight($('section:not(.modal) .search-form'));
            conditions['flight.1'] = qFlight.encode({
              departure: n.departure,
              arrival: n.arrival,
              date: n.range.from,
              direct: n.direct
            });
            if (n.range.to) {
              conditions['flight.2'] = qFlight.encode({
                departure: n.arrival,
                arrival: n.departure,
                date: n.range.to,
                direct: n.direct
              });
            }
            // フライトからホテルのリージョンを変える用
            arrivalID = n.arrival;
          }
        } catch (e) {
          return Func.error(e);
        }

        // ホテルオプションがあれば入れておく
        if (0 < $('#part-trip:checked').size() && true == ('on' == $('#part-trip:checked').val() || 1 == $('#part-trip:checked').val())){
          // チェックイン期間の特定
          var checkinrange = $('.search-item.flight-calendar.hoteloptioncalendar').data('range');
          conditions['stay'] = qStay.encode(checkinrange);
          // 期間のチェック
          var airrange = $('.search-form .flight-calendar:not(.hoteloptioncalendar)').data('range');
          var range = $('.search-form .flight-calendar:not(.hoteloptioncalendar)').data('range');
          if (0 < $('#part-trip:checked').size() && true == ('on' == $('#part-trip:checked').val() || 1 == $('#part-trip:checked').val())){
            // チェックイン期間の特定
            airrange = $('.search-form .flight-calendar:not(.hoteloptioncalendar)').data('range');
            // XXX チェックイン期間がフライト日程内かどうかのチェックも必要！
            range = $('.search-item.flight-calendar.hoteloptioncalendar').data('range');
            // 日付比較 期間内かどうか
            var airfrom = new Date(airrange.from.year, airrange.from.month -1, airrange.from.day);
            var airto = new Date(airrange.to.year, airrange.to.month -1, airrange.to.day);
            var rangefrom = new Date(range.from.year, range.from.month -1, range.from.day);
            var rangeto = new Date(range.to.year, range.to.month -1, range.to.day);
            airfrom.setDate(airfrom.getDate()-3);
            airto.setDate(airto.getDate()+3);
            if (false === (airfrom <= rangefrom && rangeto <= airto)){
                // 日程に収まっていないので、このホテルの日程はエラー
                $('.search-form__row.hoteloptioncalendar .caution-message').removeClass('is-hidden');
                //$('.search-form__row.hoteloptioncalendar #part-trip').prop('checked', false);
                return;
            }
            else if (airfrom > rangefrom && rangeto < airto) {
              $('.search-form__row.hoteloptioncalendar #part-trip').prop('checked', true);
            }
          }
        }
        else {
          var range = $('.search-form .flight-calendar:not(.hoteloptioncalendar)').data('range');
          conditions['stay'] = qStay.encode(range);
        }
        if (0 < $('#part-trip').size()){
          var rooms = [];
          $('#js-modal-people .js-people-selector').each(function() {
            var adult = $(this).find('.js-people-num-adult').val()|0;
            var children = [];
            $(this).find('.select-children-age .is-show').each(function() {
              children.push($(this).find('select').val()|0);
            });
            adult > 0 && rooms.push({adult: adult, children: children});
          });
          if (rooms.length <= 0) {
            return Func.error('*SEARCH_FAILURE');
          }
          conditions['room'] = qRoom.encode(rooms);

          if (0 < $('.search-form .search-airport.is-arrival .search-item').size()){
            var airport = $('.search-form .search-airport.is-arrival .search-item').data();
            if (('id' in airport) && ('datatype' in airport)){
              conditions[airport.datatype] = airport.id;
            }
            else if (('region' in Status.search)){
              conditions['region'] = Status.search.region;
            }
            //else if (('hotel' in Status.search)){
            //  conditions['hotel'] = Status.search.hotel;
            //}
          }
        }

        var hotelId = Status.search.hotel;

        if (hotelId) {
            conditions['hotel'] = hotelId;
            delete conditions.region;
        }

        var historyPath = 'tour/cond';
        if ('undefined' == typeof locationurl && true != $(this).hasClass('is-set')){
            locationurl = 'air/search';
            historyPath = 'air/cond';
        }

        if (historyPath == 'tour/cond') {
          if ('undefined' == typeof locationurl){
            locationurl = 'tour/search';
          }
          location.href = Func.url(locationurl, conditions, function () {
            //Func.history(historyPath + '/cache', 'clear');
          });
          return false;
        }
        location.href = Func.url(locationurl, conditions, function() {
          //Func.history(historyPath+'/cache', 'clear');
        });
        return false;
      });
    };


    methods.embedConditions = function() {
      if (0 < $('.dp-current-list__item:first-child .dp-current-item__header .dp-select:not(.is-selected)').size()){
        var airDetail = Func.history('air/detail').shift();
        if (airDetail != undefined && -1 < airDetail.indexOf('{')){
          airDetail = JSON.parse(airDetail);
          if (true == ('id' in airDetail)) {
            $('.dp-current-list__item:first-child .dp-current-item__header .dp-select:not(.is-selected)').text('読み込み中');
          }
        }
      }
      var panel = $('.research-panel');

      var flight = qFlight.summary(Status.search);
      if (flight.first) {
        panel.find('.current-search-info__area').text(function() {
          var departure = getLocation(flight.first.departure);
          if (departure == null){
            departure = {cityname:'', airport:''};
          }
          var arrival = getLocation(flight.first.arrival);
          if (!arrival) {
              arrival = {
                  cityname:'',
                  airport:''
              };
          }
          return Func.vsprintf('%s - %s', [
            departure.cityname || departure.airport,
            arrival.cityname || arrival.airport
          ]);
        });
        panel.find('.current-search-info__date').text(function() {
          var value = [Func.date(flight.first.date, 'slim')];
          flight.last && value.push(Func.date(flight.last.date, 'slim'));
          return value.join(' - ');
        });
      }

      if (Status.search.traveler != undefined) {
        var traveler = qTraveler.decode(Status.search.traveler);
        panel.find('.people-list__item:eq(0) .num').text(Func.vsprintf('x%d', [traveler.adult]));
        panel.find('.people-list__item:eq(1) .num').text(Func.vsprintf('x%d', [traveler.child]));
        panel.find('.people-list__item:eq(2) .num').text(Func.vsprintf('x%d', [traveler.baby]));
      }

      panel.show();
    };


    methods.startingForm = function() {

      $('.search-tabs__item').bind('click', function() {
        $('.search-tabs .is-current').removeClass('is-current');
        $('#'+this.id).addClass('is-current');
        $('.form-type').hide();
        sectionId = this.id.split(/-/)[1];
        $('#'+sectionId).show();

      });
    };


    return methods;
  })();


  var Hotel = (function() {
    var methods = {};
    var selectedPlanDom = '';

    LOCATION || (LOCATION = []);

    var location_index = {};
    var getLocation = function(id) {
      if (id in location_index === false) {
        return null;
      } else if (location_index[id] instanceof Array) {
        return LOCATION[location_index[id][0]].airports[location_index[id][1]];
      } else {
        return LOCATION[location_index[id]];
      }
    };
    $.each(LOCATION, function(index1) {
      location_index[this.citycode] = index1;
      $.each(this.airports || [], function(index2) {
        var id = this.citycode.replace(/_.*/, '');
        if (!location_index[id]) {
          location_index[id] = [index1, index2];
        }
      });
    });

    var qFlight = {
      encode: function(value) {
        if (value.date) {
          var block = [
            Func.vsprintf('%s-%s', [value.departure, value.arrival]),
            Func.date(value.date, 'simple')
          ];
          value.direct && block.push('DR');
          return block.join(' ');
        } else {
          return null;
        }
      },
      decode: function(value) {
        var match = (value || '').match(/^(.{0,3})-(.{0,3})\s+(\d{4})(\d{2})(\d{2})(?:\s+(DR))?$/);
        if (match !== null) {
          return {
            departure: match[1],
            arrival: match[2],
            date: {year: match[3]|0, month: match[4]|0, day: match[5]|0},
            direct: !!match[6]
          };
        } else {
          return null;
        }
      },
    };

    var qTraveler = {
      encode: function(value) {
        value.adult || (value.adult = 1);
        var encoded = [];
        if (value.children.length > 0) {
          var block2 = [];
          $.each(value.children, function() {
            if (this.age > 11){
              value.adult++;
              value.child--;
            }
            else {
              block2.push(this.age + (this.seat ? '' : ''));
              // XXX 誤動作するので一旦封印
              //block2.push(this.age + (this.seat ? '.s' : ''));
            }
          });
        }
        var block1 = [value.adult, value.child, value.baby];
        encoded.push(block1.join('-'));
        if (value.child > 0){
          encoded.push(block2.join('-'));
        }
        return encoded.join(' ');
      },
      decode: function(value) {
        var decoded = {};
        if (value) {
          var block = value.split(/\s/);
          (function(n) {
            var s = (n || '').split(/-/);
            decoded.adult = s[0]|0;
            decoded.child = s[1]|0;
            decoded.baby = s[2]|0;
          })(block.shift());
          (function(n) {
            decoded.children = [];
            var s = (n || '').split(/-/);
            $.each(s, function() {
              var m = this.match(/^(\d+)(?:\.(.))?$/);
              m && decoded.children.push({age: m[1]|0, seat: !!m[2]});
            });
          })(block.shift());
        }
        return decoded;
      }
    };

    var qStay = {
      encode: function(data) {
        var convert = function(o) {
          if (o && o.year && o.month && o.day) {
            return Func.date(o, 'simple');
          } else {
            return null;
          }
        };
        if (typeof data === 'object') {
          var r1 = convert(data.from);
          var r2 = convert(data.to);
          if (r1 && r2) {
            return [r1, r2].join('-');
          }
        }
        return null;
      },
      decode: function(data) {
        var convert = function(s) {
          if (typeof s === 'string' && s.length === 8) {
            return {year: s.substr(0, 4)|0, month: s.substr(4, 2)|0, day: s.substr(6, 2)|0};
          } else {
            return null;
          }
        };
        if (typeof data === 'string') {
          var part = data.split(/-/);
          var r1 = convert(part.shift());
          var r2 = convert(part.shift());
          if (r1) {
            var decoded = {from: r1};
            r2 && $.extend(decoded, {to: r2});
            return decoded;
          }
        }
        return null;
      }
    };

    var qRoom = {
      encode: function(data) {
        var list = [];
        $.each(data, function() {
          var parts = [this.adult];
          if (this.children.length > 0) {
            parts.push(this.children.join('.'));
          }
          list.push(parts.join('-'));
        });
        if (list.length > 0) {
          return list.join(' ');
        } else {
          return null;
        }
      },
      decode: function(data) {
        var list = [];
        $.each((data || '').split(/ /), function() {
          var part = this.split(/-/);
          var n = {adult: part[0]|0, children: []};
          if (part[1]) {
            $.each(part[1].split(/\./), function() {
              n.children.push(this|0);
            });
          }
          list.push(n);
        });
        return list;
      }
    };

    var Entry = {
      sort: function(getEntries) {
        var list = $('#js-modal-sort .js-open-selector');
        var sort = function(result) {
          var types = [
            function(a) {
              return a._q;
            },
            function(a) {
              if ('_rh' in a === false) {
                a._rh = a.ConditionsOfUse.hotelRating;
              }
              return a._rh;
            },
            function(a) {
              if ('_rh' in a === false) {
                a._rh = a.ConditionsOfUse.hotelRating;
              }
              return a._rh;
            },
            function(a) {
              return a.proximityDistance;
            },
            function(a) {
              if ('_rt' in a === false) {
                a._rt = a.ConditionsOfUse.tripAdvisorRating;
              }
              return a._rt;
            },
            function(a) {
              if ('_cl' in a === false) {
                var value = null;
                $.each(a.RoomTypes, function() {
                  var n = this.ChargeableRateInfo.averageRate;
                  if (value === null || value < n) {
                    value = n;
                  }
                });
                a._cl = value;
              }
              return a._cl;
            },
            function(a) {
              if ('_ch' in a === false) {
                var value = null;
                $.each(a.RoomTypes, function() {
                  var n = this.ChargeableRateInfo.averageRate;
                  if (value === null || value > n) {
                    value = n;
                  }
                });
                a._ch = value;
              }
              return a._ch;
            }
          ];
          var reverse = [true, false, true, true, false, true, false];
          var selected = list.find('.is-active').index();
          var entries = getEntries();
          entries.sort(function(a, b) {
            var a1 = types[selected](a);
            var b1 = types[selected](b);
            var a2 = types[selected === 0 ? 6 : 0](a);
            var b2 = types[selected === 0 ? 6 : 0](b);
            if (reverse[selected]) {
              return a1 === b1 ? (b2 - a2) : (a1 - b1);
            } else {
              return a1 === b1 ? (b2 - a2) : (b1 - a1);
            }
          });
          return entries;
        };
        list.find('a').on('click', function() {
          Entry.view(sort());
        });
        return sort;
      },

      filter: function(getEntries) {
        var modal = $('#js-modal-filter');

        var f = modal.find('.filter-contents__item');
        var filters = {
          name: Filter.text(f.eq(0)),
          charge: Filter.slider(f.eq(1)),
          star: Filter.radio(f.eq(2), '0'),
          guest: Filter.slider(f.eq(3)),
          area: Filter.checkbox(f.eq(4)),
          spot: Filter.checkbox(f.eq(5)),
          type: Filter.checkbox(f.eq(6)),
          equipment: Filter.checkbox(f.eq(7)),
          barrierfree: Filter.checkbox(f.eq(8))
        };

        var status = function() {
          var entries = getEntries();
          var matched = 0;
          $.each(entries, function() {
            this._hidden || (matched ++);
          });
          $('.filter-count').each(function() {
            $(this).find('.num').text(matched);
            $(this).find('.all').text(entries.length);
          });
        };

        var changed = false;
        modal.find('.js-close-modal').on('click', function() {
          if (changed) {
            changed = false;
            Entry.view(getEntries(), key_);
          }
        });

        var conditions = {};
        var initialized = false;
        var filter = function(result) {
          var entries = getEntries();

          $.each(filters, function(index) {
            conditions[index] = this.get();
          });

          var filtering = function() {
            try {
              if (conditions.name !== null) {
                var cond = conditions.name;
                var item = this.ConditionsOfUse.hotelname;
                if (item.generalname.indexOf(cond) < 0 && item.name.indexOf(cond) < 0) {
                  throw 'name';
                }
              }
              if (conditions.charge !== null) {
                var cond = conditions.charge;
                var item = null;
                $.each(this.RoomTypes, function() {
                  var n = this.ChargeableRateInfo.averageRate|0;
                  (item === null || item > n) && (item = n);
                });
                if (item === null || cond.min > item || cond.max < item) {
                  throw 'charge';
                }
              }
              if (conditions.star !== null) {
                var cond = conditions.star|0;
                var item = Math.floor(this.ConditionsOfUse.hotelRating);
                if (cond !== item) {
                  throw 'star';
                }
              }
              if (conditions.guest !== null) {
                var cond = conditions.guest;
                var item = this.ConditionsOfUse.tripAdvisorRating|0;
                if (cond.min > item || cond.max < item) {
                  throw 'guest';
                }
              }
              if (conditions.area !== null) {
                var cond = conditions.area;
                var item = this.regionCodes;
                var match = false;
                $.each(cond, function() {
                  item.indexOf('|' + this + '|') >= 0 && (match = true);
                });
                if (!match) {
                  throw 'area';
                }
              }
              if (conditions.spot !== null) {
                var cond = conditions.spot;
                var item = this.regionCodes;
                var match = false;
                $.each(cond, function() {
                  item.indexOf('|' + this + '|') >= 0 && (match = true);
                });
                if (!match) {
                  throw 'spot';
                }
              }
              if (conditions.type !== null) {
                var cond = conditions.type;
                var item = this.ConditionsOfUse.accommodationType + '';
                if (cond.indexOf(item) < 0) {
                  throw 'type';
                }
              }
              if (conditions.equipment !== null) {
                var cond = conditions.equipment;
                var match = true;
                $.each(this.HotelAmenitys, function() {
                  cond.indexOf(this + '') < 0 && (match = false);
                });
                if (!match) {
                  throw 'equipment';
                }
              }
              if (conditions.barrierfree !== null) {
                var cond = conditions.barrierfree;
                var match = true;
                $.each(this.HotelAmenitys, function() {
                  cond.indexOf(this + '') < 0 && (match = false);
                });
                if (!match) {
                  throw 'barrierfree';
                }
              }
              delete this._hidden;
            } catch (e) {
              this._hidden = true;
            }
          };

          var areas = null;
          var spots = null;
          var charge = {};

          if (result && result.DistrictInfo) {
            areas = {};
            spots = {};
            $.each(result.DistrictInfo.NeighborhoodDistricts, function() {
              switch (this.subClass.toLowerCase()) {
                case 'city':
                case 'neighbor':
                  areas[this.regionCode] = {name: this.regionName, value: this.regionCode, count: 0};
                  break;
                default:
                  spots[this.regionCode] = {name: this.regionName, value: this.regionCode, count: 0};
                  break;
              }
            });
          }

          $.each(entries, function() {
            var entry = this;

            areas !== null && $.each(areas, function() {
              (entry.regionCodes || '').indexOf('|' + this.value + '|') >= 0 && (++ this.count);
            });
            spots !== null && $.each(spots, function() {
              (entry.regionCodes || '').indexOf('|' + this.value + '|') >= 0 && (++ this.count);
            });

            var minCharge = null;
            $.each(this.RoomTypes, function() {
              var n = this.ChargeableRateInfo.averageRate|0;
              (minCharge === null || minCharge > n) && (minCharge = n);
            });
            if ('min' in charge === false || charge.min > minCharge) {
              charge.min = minCharge;
            }
            if ('max' in charge === false || charge.max < minCharge) {
              charge.max = minCharge;
            }

            filtering.apply(this);
          });
          status();

          areas !== null && filters.area.view(areas, '.filter-contents__body', 'area', false);
          spots !== null && filters.spot.view(spots, '.filter-contents__body', 'spot', false);
          filters.charge.set(charge);

          if (!initialized) {
            initialized = true;
            $.each(filters, function(index) {
              var self = this;
              this.change(function() {
                conditions[index] = self.get();
                $.each(entries, filtering);
                status();
                changed = true;
              });
            });
          }

          return entries;
        };

        modal.find('.filter-reset').on('click', function() {
          $.each(filters, function() {
            this.reset();
          });
          filter();
          changed = true;
          return false;
        });

        return filter;
      },

      stack: function(result, entries, index) {
        $.each(result.HotelSummarys.HotelSummary, function() {
          if (!index[this.hotelid]) {
            index[this.hotelid] = true;
            this._q = entries.length;
            entries.push(this);
          }
        });
        $('.list-count').each(function() {
          var format = $(this).data('format');
          if (!format) {
            $(this).data('format', format = $(this).text());
          }
          $(this).text(format.replace(/−/, entries.length));
        });
      },

      view: function(entries) {
        var list = $('ul.list:not(.selecteddom)').hide();
        $('#loading').remove();

        var itemObj = list.data('item');
        if (!itemObj) {
          itemObj = list.find('> li').detach();
          list.data('item', itemObj);
        }
        list.empty();

        var roomembed = function(item, data, detail, sessionKey) {
            var part = {
              star: function(target, rating) {
                var n = Math.round(rating * 2) / 2;
                for (var i = Math.floor(n); i < 5; i ++) {
                  target.find('.rate-stars__item').eq(i).hide();
                }
                if (n === Math.floor(n)) {
                  target.find('.rate-stars__item').eq(5).hide();
                }
              },
              trip: function(target, rating) {
                if (rating >= 3.5) {
                  var n = Math.round(rating * 2) / 2;
                  var text = '良い';
                  if (n >= 5) {
                    text = '最高に素晴らしい';
                  } else if (n >= 4.5) {
                    text = 'とても素晴らしい';
                  } else if (n >= 4.0) {
                    text = 'とても良い';
                  }
                  var image = Func.vsprintf('images/tripadvisor_%s.png', [n.toString().replace(/\./, '_')]);
                  target
                    .find('.rate-num__point').text(n).end()
                    .find('.rate-num__text').text(text).end()
                    .find('.star-tripadvisor img').attr('src', image).end();
                } else {
                  target.hide();
                }
              },
              sale: function(target, desc) {
                if (desc) {
                  target.find('.hotel-sale:not(.room)').text(desc);
                } else {
                  target.find('.hotel-sale:not(.room)').hide();
                }
              },
              charge: function(target, charge) {
                if (charge.averageBaseRate === charge.averageRate) {
                  target.find('.strike').hide();
                } else {
                  target.find('.strike').html(Func.money(charge.averageBaseRate, 'prefix'));
                }
                target.find('.data-price__num').html(Func.money(charge.averageRate, 'prefix') + '〜');
              },
              basic: function(target, data) {
                if (typeof data != 'undefined' && 0 < data.length) {
                  target.css({opacity: '1.0'});
                  target.text(data);
                }
                else {
                  target.text('');
                  target.css({opacity: '0.0'});
                }
              },
              images: function(target, data) {
                if (true == (typeof data == 'array' || typeof data == 'object') && 0 < data.length && true == ('url' in data[0])) {
                  target.find('img').attr('src', data[0].url);
                  // モーダル制御
                  item.find('.js-show-modal').on('click', function() {
                      var tarId = '#' + $(this).attr('data-target');

                      var modal = $(tarId).data('entry', data);
                      var photos = modal.find('.room-slider');
                      while (photos.slick('slickRemove', 0)) {}
                      $.each(data, function(index) {
                        var img = $('<img>').attr('src', this.url);
                        photos.slick('slickAdd', $('<div>').append(img));
                        img.bind('load', function() {
                          photos.slick('setPosition');
                        });
                      });

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
                }
              },
              cancel: function(target, data) {
                // XXX キャンセルポリシーにそった追加実装が必要！
                if (typeof data == 'object' && true == ('nonRefundable' in data) && 'Y' == data.nonRefundable) {
                  target.find('.policyshort').text('返金不可');
                  target.attr('data-tipso', '変更またはキャンセルされる場合、理由を問わずお支払い済み料金の返金には応じられませんので予めご了承ください。');
                  if (true == ('cancellationPolicy' in data) && 0 < data.cancellationPolicy.length) {
                    target.attr('data-tipso', data.cancellationPolicy);
                  }
                  target.show();
                }
                else if (typeof data == 'object' && true == ('charged' in data) && 'Y' == data.charged) {
                  target.find('.policyshort').text('キャンセル有料');
                  target.attr('data-tipso', 'キャンセル料が発生します。');
                  if (true == ('cancellationPolicy' in data) && 0 < data.cancellationPolicy.length) {
                    target.attr('data-tipso', data.cancellationPolicy);
                  }
                  target.show();
                }
                else {
                  target.find('.policyshort').text('無料キャンセル可');
                  target.attr('data-tipso', '期限内であればキャンセル可能です。');
                  if (true == ('cancellationPolicy' in data) && 0 < data.cancellationPolicy.length) {
                    target.attr('data-tipso', data.cancellationPolicy);
                  }
                  target.show();
                }
              },
              amenities: function(target, data) {
                item.find('.amenities .amenities-icon').hide();
                if (true == (typeof data == 'array' || typeof data == 'object') && 0 < data.length) {
                  $.each(data, function() {
                    if (true == ('category' in this) && typeof this.category == 'number' && -1 < this.category){
                      if (0 < target.find('.amenities-'+this.category).size()){
                        target.find('.amenities-'+this.category).show();
                      }
                    }
                  });
                }
              },
              valueadds: function(target, data) {
                item.find('.valueadds .valueadds-icon').hide();
                if (true == (typeof data == 'array' || typeof data == 'object') && 0 < data.length) {
                  $.each(data, function() {
                    if (true == ('category' in this) && typeof this.category == 'number' && -1 < this.category){
                      if (0 < target.find('.valueadds-'+this.category).size()){
                        target.find('.valueadds-'+this.category).show();
                      }
                    }
                  });
                }
              },
              payments: function(target, data) {
                item.find('.payments').hide();
                if (true == (typeof data == 'array' || typeof data == 'object') && 0 < data.length) {
                  $.each(data, function() {
                    if (true == ('type' in this) && typeof this.type == 'string' && 0 < this.type.length){
                      if (0 < target.find('.payment-'+this.type).size()){
                        target.find('.payment-'+this.type).show();
                      }
                    }
                  });
                }
              },
              roomrest: function(target, data) {
                item.find('.rest').show();
                item.find('.rest').css({opacity: '0.0'});
                if (typeof data == 'number' && 0 < parseInt(data) && 6 > parseInt(data)) {
                  item.find('.rest .currentAllotment').text(data);
                  item.find('.rest').show();
                  item.find('.rest').css({opacity: '1.0'});
                }
              },
              nosmoking: function(target, data) {
                if (true == (typeof data == 'array' || typeof data == 'object') && 0 < data.length && typeof data[0] == 'string' && data[0] == 'NS') {
                  target.show();
                }
                else if (typeof data == 'string' && 0 < data == 'NS') {
                  target.show();
                }
                else {
                  target.hide();
                }
              },
              price: function(target, data) {
                target.text((data.toString().replace(/(\d)(?=(\d{3})+$)/g , '$1,')) + '円');
              },
              numberbasic: function(target, data) {
                  target.text((data.toString().replace(/(\d)(?=(\d{3})+$)/g , '$1,')));
              },
              description: function(target, data) {
                  target.html(data);
              },
            };
            part.basic(item.find('.hotel-sale.room'), data.promoDescription);
            part.cancel(item.find('.cancellationPolicy'), data.CancelPolicies);
            part.basic(item.find('.room-outline__title .title'), data.roomRateDescription);
            part.images(item.find('.room-body__photo'), data.RoomTypeImages);
            part.amenities(item.find('.amenities'), data.RoomAmenities);
            part.valueadds(item.find('.valueadds'), data.ValueAdds);
            part.nosmoking(item.find('.nosmoking'), data.SmokingPreferences);
            part.payments(item.find('.room-payment'), data.PaymentMethods);
            part.roomrest(item.find('.room-text__more'), data.currentAllotment);
            part.numberbasic(item.find('.room-text__price .paymentTotal'), data.ChargeableRateInfo.paymentTotal);
            part.numberbasic(item.find('.quotedOccupancy'), data.quotedOccupancy);
            part.description(item.find('.descriptionLong'), data.descriptionLong);
            item.find('.js-toggle-accordion').on('click', function() {
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
            item.find('.js-close-accordion').on('click', function() {
                var $accordionWrapper = $(this).closest('.js-accordion-wrapper');
                var $accordionToggle = $accordionWrapper.find('.js-toggle-accordion');
                var $accordionContents = $accordionWrapper.children('.js-accordion-contents');

                $accordionWrapper.removeClass('is-open');
                $accordionToggle.removeClass('is-open');
                $accordionContents.slideUp('fast');
                return false;
            });
            item.find('.js-toggle-tooltip').tipso({
                background: '#ffffff',
                color: '#ff6c00',
                size: 'large',
                speed: 200,
                width: 320,
                maxWidth: ''
            });
            item.find('.js-feature-tooltip').on('click', function() {
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
            item.find('.selecthotel').off('click').on('click', function() {
                var hotelprice = parseInt(item.find('.room-text__price .price').text().replace(',','').replace(',','').replace(',','').replace('¥','').replace('円','').replace('〜',''));
                selectedPlanDom.find('.hotel-list-data .price').remove();
                selectedPlanDom.find('.hotel-list-data').append('<input type="hidden" class="price" value="'+hotelprice+'"/>');
                $('.dp-current-list__item:last-child .dp-current-item__header .dp-select').addClass('is-selected');
                $('.dp-current-list__item:last-child .dp-current-item__header .dp-select').text('選択済み');
                selectedPlanDom.removeClass('selected');
                selectedPlanDom.find('.selected-head').remove();
                $('.dp-current-list__item:last-child .dp-current-item__contents').html(selectedPlanDom);
                var flight = qFlight.decode(Status.search['flight.1']);
                // フライト選択画面用に取っておく
                Func.history('tour/detail/hoteldom', selectedPlanDom.prop('outerHTML'));
                Func.history('hotel/detail', JSON.stringify({hotelid: detail.hotelid, paymentmethods:data.PaymentMethods, price:hotelprice, roomTypeCode: data.roomTypeCode, rateCode: data.rateCode, rateKey: data.rateKey, chargeablerateinfo: data.ChargeableRateInfo,time:new Date().getTime()}));
                //Func.history('hotel/detail', JSON.stringify({arrival: flight.arrival, hotelid: detail.hotelid, paymentmethods:data.PaymentMethods, price:hotelprice, roomTypeCode: data.roomTypeCode, rateCode: data.rateCode, rateKey: data.rateKey, time:new Date().getTime()}));
                // モーダル閉じる
                $('#js-modal-detail .js-close-modal').trigger('click');
                // ホテルも航空券も設定されていたら予約ボタンを表示
                var airprice = parseInt($('.dp-current-list__item:first-child .data .price').val());
                if (-1 < parseInt(hotelprice + airprice)){
                  var airDetail = Func.history('air/detail').shift();
                  if (airDetail == undefined){
                    return;
                  }
                  airDetail = JSON.parse(airDetail);
                  if (true != ('paymentmethods' in airDetail)){
                      return;
                  }
                  $('.amount-panel .price').text('¥'+((hotelprice + airprice).toString().replace(/(\d)(?=(\d{3})+$)/g , '$1,')));
                  Func.amoundetail(airDetail, {price:hotelprice, chargeablerateinfo: data.ChargeableRateInfo} );
                  $('.amount-panel .button-area a').removeClass('is-disable');
                  $('.amount-panel .payment-list').empty();
                  $.each(data.PaymentMethods, function() {
                    if (SETTINGS.PAYMETHOD[this.type]) {
                      var baseType = this.type;
                      $.each(airDetail.paymentmethods, function() {
                        if (SETTINGS.PAYMETHOD[this.type] && baseType == this.type) {
                          var img = $('<img>').attr('src', 'images/' + SETTINGS.PAYMETHOD[this.type].icon);
                          $('.amount-panel .payment-list').append(img);
                        }
                      });
                    }
                  });
                  $('.amount-panel').show();
                }
            });
            item.find('.button-area a:not(.is-set):not(.selecthotel)').off('click').on('click', function() {
              $(this).addClass('is-disable');
              // loading
              if( ($('#js-modal-loading').find('.loading').length < 1)){
                var var_loading = '<div id="loading" class="loading"><img src="images/loading.png" alt="" class="loading__icon" width="50" height="50" margin-top="50%"></div>';
                $('#js-modal-loading').find('.modal__window').after(var_loading);
              }
              $('#js-modal-loading').show();
              var referer = Func.storage('referer');
              var stay = qStay.decode(Status.search.stay);
              var room = qRoom.decode(Status.search.room);
              var param = {
                backurl: location.href,
                operate: 'union',
                chkin: stay.from.year + ('00'+stay.from.month).slice(-2) + ('00'+stay.from.day).slice(-2),
                chkout: stay.to.year + ('00'+stay.to.month).slice(-2) + ('00'+stay.to.day).slice(-2),
                hotelid: detail.hotelid,
                roomTypeCode: data.roomTypeCode,
                rateCode: data.rateCode,
                rateKey: data.rateKey,
                referer: referer || document.referrer || location.href,
                sessionkey: sessionKey,
                url: document.referrer || location.href,
              };
              for (var rIdx=0; rIdx < room.length; rIdx++){
                param['adtN_'+rIdx] = room[rIdx].adult;
                param['chdN_'+rIdx] = room[rIdx].children.length;
                if (0 < room[rIdx].children.length){
                  for (var cIdx=0; cIdx < room[rIdx].children.length; cIdx++){
                    // 子供の年齢
                    param['chdN_'+rIdx+'_'+cIdx] = room[rIdx].children[cIdx];
                  }
                }
              }
              //console.log('ホテル予約パラメータ');
              //console.log(param);
              $('<form/>')
              .attr({
                method: 'POST',
                action: SETTINGS.HOTEL.RESERVATION + '?' + $.param(param)
              })
              .appendTo(document.body).submit();
              //.trigger('submit');
              return false;
            });
            item.find('.button-area a.is-set').off('click').on('click', function() {
                // DPの航空券検索結果画面へ遷移
              var query = {q: detail.ConditionsOfUse.Address.county, type:'type3', lat: detail.ConditionsOfUse.Address.latitude, lon:detail.ConditionsOfUse.Address.longitude };
              var option = {
                method: 'GET',
                url: Func.url('/hotel/data/suggestion', query),
                contentType: 'application/json',
                dataType: 'json'
              };
              $.ajax(option).done(function(result) {
                var arrivalData = {fid:null};
                if (result['found'][0]) {
                  arrivalData.fid = result['found'][0]['fid'];
                }
                var href = Func.url('tour/hotel', Status.search, function(build) {
                    // DPへ移動するのでフライト条件を滞在地からデフォルト設定する
                    var range = qStay.decode(build.stay);

                    build['flight.1'] = qFlight.encode({
                        departure: '',
                        arrival: arrivalData.fid,
                        date: range.from,
                        direct: false
                    });
                    build['flight.2'] = qFlight.encode({
                        departure: arrivalData.fid,
                        arrival: '',
                        date: range.to,
                        direct: false
                    });
                    var rooms = qRoom.decode(build.room);
                    var _adult = 0;
                    var _child = 0;
                    var _baby = 0;
                    var _children = [];
                    for (var ridx=0; ridx < rooms.length; ridx++){
                      _adult += rooms[ridx].adult;
                      _child += rooms[ridx].children.length;
                      for (var cidx=0; cidx < rooms[ridx].children.length; cidx++){
                        _children.push({age:rooms[ridx].children[cidx],seat:false});
                        if (2 > rooms[ridx].children[cidx]){
                          _baby++;
                          _child--;
                        }
                      }
                    }
                    var traveler = {
                      adult: _adult,
                      child: _child,
                      baby: _baby,
                      children: _children
                    };
                    build.traveler = qTraveler.encode(traveler);
                    var _condition = Func.history('hotel/cond').shift();
                    if (_condition != undefined){
                      // 検索条件のマージ
                      if (true == ('airline' in _condition) && true != ('airline' in build)){
                        build.airline = _condition.airline;
                      }
                      if (true == ('flight.1' in _condition) && true != ('flight.1' in build)){
                        build['flight.1'] = _condition['flight.1'];
                      }
                      if (true == ('flight.2' in _condition) && true != ('flight.2' in build)){
                        build['flight.2'] = _condition['flight.2'];
                      }
                      if (true == ('seat' in _condition) && true != ('seat' in build)){
                        build.seat = _condition.seat;
                      }
                      if (true == ('traveler' in _condition) && true != ('traveler' in build)){
                        build.traveler = _condition.traveler;
                      }
                      if (detail.hotelid) {
                          build.hotel = detail.hotelid;
                          delete build.region;
                          delete Status.search.region;
                      }
                    }
                    //Func.history('tour/cond', build);

                    // PackageRate=Yでホテル詳細
                    var _postdata = JSON.stringify({
                        stay: build.stay,
                        room: build.room,
                        hotel: build.hotel,
                        PackageRate: 'Y',
                    });
                    var _option = {
                      method: 'POST',
                      url: Func.url('/hotel/data/detail', Func.storage(['session', 'code'])),
                      contentType: 'application/json',
                      data: _postdata,
                      dataType: 'json'
                    };
                    $.ajax(_option).done(function(_result) {
                      // DPホテル画面での復帰用に取っておく
                      var _detail = _result.result.HotelSummarys.HotelSummary.shift();
                      var _roomData = null;
                      for (var _roomIdx=0; _roomIdx<_detail.RoomTypes.length; _roomIdx++){
                        if (data.roomTypeCode == _detail.RoomTypes[_roomIdx].roomTypeCode) {
                          _roomData = _detail.RoomTypes[_roomIdx];
                        }
                      }
                      if (null == _roomData){
                        Func.error('ご案内出来る客室が見つかりませんでした', true);
                      }
                      var hotelprice = _roomData.ChargeableRateInfo.paymentTotal;
                      selectedPlanDom.find('.hotel-list-data .price').remove();
                      selectedPlanDom.find('.hotel-list-data').append('<input type="hidden" class="price" value="'+hotelprice+'"/>');
                      Func.history('tour/detail/hoteldom', selectedPlanDom.prop('outerHTML'));
                      Func.history('hotel/detail', JSON.stringify({hotelid: detail.hotelid, paymentmethods:_roomData.PaymentMethods, price:hotelprice, roomTypeCode: _roomData.roomTypeCode, rateCode: _roomData.rateCode, rateKey: _roomData.rateKey, time:new Date().getTime()}));
                      Func.history('tour/detail/airdom', false);
                      Func.history('air/detail', false);
                      location.href = Func.url('tour/hotel', build, function(_build) {
                        _build = build;
                        Func.history('tour/cond', build);
                      });
                    });
                    //Func.history('hotel/detail', JSON.stringify({arrival: arrivalData.fid, hotelid: detail.hotelid, paymentmethods:data.PaymentMethods, price:hotelprice, roomTypeCode: data.roomTypeCode, rateCode: data.rateCode, rateKey: data.rateKey, time:new Date().getTime()}));
                });
              });
            });

            return item;
        };

        var embed = function(item, data) {
          var part = {
            star: function(target, rating) {
              var n = Math.round(rating * 2) / 2;
              for (var i = Math.floor(n); i < 5; i ++) {
                target.find('.rate-stars__item').eq(i).hide();
              }
              if (n === Math.floor(n)) {
                target.find('.rate-stars__item').eq(5).hide();
              }
            },
            trip: function(target, rating) {
              if (rating >= 3.5) {
                var n = Math.round(rating * 2) / 2;
                var text = '良い';
                if (n >= 5) {
                  text = '最高に素晴らしい';
                } else if (n >= 4.5) {
                  text = 'とても素晴らしい';
                } else if (n >= 4.0) {
                  text = 'とても良い';
                }
                var image = Func.vsprintf('images/tripadvisor_%s.png', [n.toString().replace(/\./, '_')]);
                target
                  .find('.rate-num__point').text(n).end()
                  .find('.rate-num__text').text(text).end()
                  .find('.star-tripadvisor img').attr('src', image).end();
              } else {
                target.hide();
              }
            },
            sale: function(target, desc) {
              if (desc) {
                target.find('.hotel-sale:not(.room)').text(desc);
              } else {
                target.find('.hotel-sale:not(.room)').hide();
              }
            },
            charge: function(target, charge) {
              if (charge.averageBaseRate === charge.averageRate) {
                target.find('.strike').hide();
              } else {
                target.find('.strike').html(Func.money(charge.averageBaseRate, 'prefix'));
              }
              target.find('.data-price__num').html(Func.money(charge.averageRate, 'prefix') + '〜');
            }
          };

          var minCharge = null;
          $.each(data.RoomTypes, function() {
            if (minCharge === null || this.ChargeableRateInfo.averageRate < minCharge.averageRate) {
              minCharge = this.ChargeableRateInfo;
            }
          });

          item.find('h3.list-item__title').text(data.ConditionsOfUse.hotelname.name);
          item.find('.hotel-list-body__photo').attr('src', data.ConditionsOfUse.thumbNailUrl);

          part.star(item.find('.rate-stars'), data.ConditionsOfUse.hotelRating);
          part.trip(item.find('.hotel-list-data__tripadvisor'), data.ConditionsOfUse.tripAdvisorRating);
          part.sale(item, data.RoomTypes[0].promoDescription);
          part.charge(item.find('.hotel-list-data__price'), minCharge);

          var detailModalBase = null;
          item.on('click', function() {

            var modal = $('#js-modal-detail').data('entry', data);
            modal.find('.modal__window').hide();

            if( (modal.find('.loading').length < 1)){
              var var_loading = '<div class="loading"><img src="images/loading.png" alt="" class="loading__icon" width="50" height="50" margin-top="50%"></div>';
              modal.find('.modal__window').after(var_loading);
            }

            var latestRooms = [];
            var roomlist;
            var showDetail = function(detail, sessionKey) {
              // ルーム処理
              latestRooms = detail.RoomTypes;
              if (latestRooms == undefined || 1 > latestRooms.length){
                // 空室が無い
                Func.error('ご案内出来る客室が見つかりませんでした', true);
                return;
              }

              var roomdom = modal.find('ul.room-list .room-list__item:first-child');
              roomlist = modal.find('ul.room-list').hide();
              roomlist.data('items', latestRooms);
              roomlist.empty();
              $.each(latestRooms, function() {
                var _item = roomembed(roomdom.clone(), this, detail, sessionKey);
                roomlist.append(_item);
              });
              roomlist.show();

              var minCharge = null;
              $.each(detail.RoomTypes, function() {
                if (minCharge === null || this.ChargeableRateInfo.averageRate < minCharge.averageRate) {
                  minCharge = this.ChargeableRateInfo;
                }
              });
              part.star(modal.find('.rate-stars'), detail.ConditionsOfUse.hotelRating);
              part.trip(modal.find('.hotel-detail-header__tripadvisor'), detail.ConditionsOfUse.tripAdvisorRating);
              part.sale(modal, detail.RoomTypes[0].promoDescription);
              part.charge(modal.find('.hotel-detail-header__price'), minCharge);

              modal.find('.modal-header__price .price').html(Func.money(minCharge.averageRate, 'prefix') + '〜');
              modal.find('.hotel-detail-header__title')
                .find('.ja').text(detail.ConditionsOfUse.hotelname.name).end()
                .find('.small').hide().end()
                .find('.en').text(detail.ConditionsOfUse.hotelname.generalname).end();

              var photos = modal.find('.hotel-slider');
              while (photos.slick('slickRemove', 0)) {}
              $.each(detail.HotelDetailInfo.HotelImages, function(index) {
                var img = $('<img>').attr('src', this.url);
                photos.slick('slickAdd', $('<div>').append(img));
                img.bind('load', function() {
                  photos.slick('setPosition');
                });
              });

              modal.find('#js-modal-map .modal-header__title').text(detail.ConditionsOfUse.hotelname.name);
              modal.find('.hotel-detail-header a[data-target="js-modal-map"]').html(function() {
                return [
                  detail.ConditionsOfUse.Address.addressLine,
                  detail.ConditionsOfUse.locationDescription
                ].join('<br>');
              });
              modal.find('a[data-target="js-modal-map"]').one('click', function() {
                Func.googlemap(
                  modal.find('#js-modal-map .map_canvas'),
                  detail.ConditionsOfUse.hotelname.name,
                  detail.ConditionsOfUse.Address.latitude,
                  detail.ConditionsOfUse.Address.longitude);
              });
              modal.find('.js-tabs-hotel-detail a:last-child, a.caution-message__title').one('click', function() {
                Func.googlemap(
                  modal.find('.hotel-introduction .map_canvas'),
                  detail.ConditionsOfUse.hotelname.name,
                  detail.ConditionsOfUse.Address.latitude,
                  detail.ConditionsOfUse.Address.longitude);
              });

              var intro = modal.find('.hotel-introduction-contents');
              var format = intro.data('format');
              if (!format) {
                format = intro.find('.hotel-introduction-item').detach();
                intro.data('format', format);
              } else {
                intro.find('.hotel-introduction-item').remove();
              }

              var showIntroduction = function(_introductionTitle, _introductionlMsg){
                if (typeof _introductionlMsg == 'string' && 0 < _introductionlMsg.length) {
                  intro.append(function() {
                    var descritionHead = '';
                    var descritionBody = '';
                    var descritions = _introductionlMsg.split('<br />');
                    if (1 < descritions.length){
                      descritionHead = descritions[0];
                      for (var didx=1; didx < descritions.length; didx++){
                        descritionBody = descritionBody + descritions[didx] + '<br />';
                      }
                    }
                    else if (_introductionlMsg.indexOf('</')) {
                      // タグの場合
                      descritionHead = _introductionlMsg;
                    }
                    else {
                      var descritions = _introductionlMsg.split('。');
                      var midx=0;
                      while(80 > descritionHead.length && true === (midx in descritions)){
                        descritionHead = descritionHead + descritions[midx] + '。';
                        midx++;
                      }
                      for (var didx=midx; didx < descritions.length; didx++){
                        if ('' != descritions[didx] && 0 < descritions[didx].length){
                          descritionBody = descritionBody + descritions[didx] + '。<br />';
                        }
                      }
                    }
                    return format.clone(true)
                      .find('.hotel-introduction-item__title').text(_introductionTitle).end()
                      .find('.hotel-introduction-item__body:eq(0)').html(descritionHead).end()
                      .find('.hotel-introduction-item__body.js-accordion-contents').html(descritionBody).end()
                  });
                  // 重要情報ありますリンクの表示
                  modal.find('.caution-message').show();
                  return true;
                }
              };
              // 重要情報ありますリンクの表示
              modal.find('.caution-message').hide();
              // 重要情報
              showIntroduction('チェックインに関する重要情報', detail.HotelDetailInfo.specialCheckInInstructions);
              if (typeof detail.HotelDetailInfo.checkInMinGuestAge != 'undefined' && 0 < detail.HotelDetailInfo.checkInMinGuestAge.length){
                showIntroduction('チェックイン可能な最低年齢', detail.HotelDetailInfo.checkInMinGuestAge+'歳');
              }
              if (true !== showIntroduction('チェックイン時に必要なもの', detail.HotelDetailInfo.hotelPolicy)){
                showIntroduction('チェックインに関する重要情報', detail.HotelDetailInfo.knowBeforeYouGoDescription);
              }
              showIntroduction('必須手数料および税金', detail.HotelDetailInfo.mandatoryFeesDescription);
              showIntroduction('オプションの追加料金', detail.HotelDetailInfo.roomFeesDescription);

              $('.loading').remove();
              //console.log(data, detail);

              modal.find('.modal__window').show();
            };

            if (Status.pathname[1] == 'favorite'){
              // お気に入り画面用
              var postdata = JSON.stringify({
                stay: qStay.encode(Calendar.defaultValue()),
                room: '1-2',
                hotel: data.hotelid
              });
            }
            else {
              var packageRate = '';
              if (0 < $('.dp-current-list__item:last-child').size()){
                // DPの場合、パッケージ価格の計算をする
                packageRate = 'Y';
              }
              var postdata = JSON.stringify({
                stay: Status.search.stay,
                room: Status.search.room,
                hotel: data.hotelid,
                PackageRate: packageRate,
              });
            }

            var _this = this;
            var _option = {
              method: 'POST',
              url: Func.url('/hotel/data/detail', Func.storage(['session', 'code'])),
              contentType: 'application/json',
              data: postdata,
              dataType: 'json'
            };
            $.ajax(_option).done(function(result) {
              selectedPlanDom = $('<ul class="list selecteddom">'+($(_this).prop('outerHTML'))+'</ul>');
              var detail = result.result.HotelSummarys.HotelSummary.shift();
              var sessionKey = result.result.StatusInfo.sessionKey;
              showDetail(detail, sessionKey);
            });

            var option = {
              method: 'POST',
              url: Func.url('/hotel/data/favorite/exists', Func.storage(['session'])),
              contentType: 'application/json',
              data: JSON.stringify({hotel: data.hotelid}),
              dataType: 'json'
            };
            $.ajax(option).done(function(result) {
              var fav = $('#js-modal-detail .js-toggle-fav');
              result.exists ? fav.addClass('is-fav') : fav.removeClass('is-fav');
            });
            return false;
          });

          // DPホテルの場合の復帰処理
          var airprice = -1;
          var hotelprice = -1;
          var airpaymentmethods = [];
          var hotelpaymentmethods = [];
          if (0 < $('.dp-current-list__item:first-child .dp-current-item__header .dp-select:not(.is-selected)').size()){
            var currentPlanDom = Func.history('tour/detail/airdom').shift();
            if (currentPlanDom != undefined){
              // 航空券の復帰
              var arrivalID = $(currentPlanDom).find('.flight-outline .flight-outline__item:first-child .flight-flow .flight-flow__item:last-child .airport-serial').text();
              if (arrivalID != undefined && -1 < Status.search['flight.2'].indexOf(arrivalID)){
                $('.dp-current-list__item:first-child .dp-current-item__header .dp-select').addClass('is-selected');
                $('.dp-current-list__item:first-child .dp-current-item__header .dp-select').text('選択済み');
                selectedPlanDom.removeClass('selected');
                selectedPlanDom.find('.selected-head').remove();
                $('.dp-current-list__item:first-child .dp-current-item__contents').html(currentPlanDom);
                var airDetail = Func.history('air/detail').shift();
                if (airDetail != undefined && -1 < airDetail.indexOf('{')){
                  airDetail = JSON.parse(airDetail);
                  airprice = airDetail.price;
                  airpaymentmethods = airDetail.paymentmethods;
                }
              }
            }
            $('.dp-current-list__item:first-child .dp-current-item__header .dp-select:not(.is-selected)').text('未選択');
          }
          if (0 < $('.dp-current-list__item:last-child .dp-current-item__header .dp-select:not(.is-selected)').size()){
            var hotelDetail = Func.history('hotel/detail').shift();
            if (hotelDetail != undefined && -1 < hotelDetail.indexOf('{')){
              hotelDetail = JSON.parse(hotelDetail);
              // ホテルの復帰
              if (true == ('hotelid' in hotelDetail) && hotelDetail.hotelid == data.hotelid) {
                // 最後の選択アイテムとして表示を復帰してあげる
                var currentPlanDom = $('<ul class="list selecteddom">'+(item.prop('outerHTML'))+'</ul>');
                $('.dp-current-list__item:last-child .dp-current-item__header .dp-select').addClass('is-selected');
                $('.dp-current-list__item:last-child .dp-current-item__header .dp-select').text('選択済み');
                selectedPlanDom.removeClass('selected');
                selectedPlanDom.find('.selected-head').remove();
                $('.dp-current-list__item:last-child .dp-current-item__contents').html(currentPlanDom);
                hotelprice = hotelDetail.price;
                hotelpaymentmethods = hotelDetail.paymentmethods;
              }
            }
            $('.dp-current-list__item:last-child .dp-current-item__header .dp-select:not(.is-selected)').text('未選択');
          }
          // ホテルも航空券も設定されていたら予約ボタンを表示
          if (-1 < airprice && -1 < hotelprice && -1 < parseInt(hotelprice + airprice)){
            $('.amount-panel .price').text('¥'+((hotelprice + airprice).toString().replace(/(\d)(?=(\d{3})+$)/g , '$1,')));
            Func.amoundetail(airDetail,hotelDetail);
            $('.amount-panel .button-area a').removeClass('is-disable');
            $('.amount-panel .payment-list').empty();
            $.each(airpaymentmethods, function() {
              if (SETTINGS.PAYMETHOD[this.type]) {
                var baseType = this.type;
                $.each(hotelpaymentmethods, function() {
                  if (SETTINGS.PAYMETHOD[this.type] && baseType == this.type) {
                    var img = $('<img>').attr('src', 'images/' + SETTINGS.PAYMETHOD[this.type].icon);
                    $('.amount-panel .payment-list').append(img);
                  }
                });
              }
            });
            $('.amount-panel').show();
          }
          return item;
        };

        var created = [];
        var create = function() {
          if (entries.length > created.length) {
            var pager = SETTINGS.HOTEL.PAGER;
            $.each(entries, function() {
              if (!this._hidden && created.indexOf(this.hotelid) < 0) {
                if (-- pager >= 0) {
                  created.push(this.hotelid);
                  var cItemObj = itemObj.clone(true);
                  cItemObj.removeClass('selected');
                  cItemObj.find('.selected-head').remove();
                  list.append(embed(cItemObj, this));
                  //list.append(embed(itemObj.clone(true), this));
                } else {
                  return false;
                }
              }
            });
          }
        };

        $(document).off('.pagination').on('scroll.pagination', function() {
          var margin = 100;
          var bottom = $(this).height() - $(window).height() - $(this).scrollTop() - margin < 0;
          var overflow = $(document).height() !== $(window).height();
          bottom && overflow && create();
        });

        create();
        list.show();
      }
    };

    methods.bindAirport = function() {
        var append = function(target, data) {
          var a = $('<a>')
          .data(data)
          .attr('href', '#')
          .addClass('suggested-search__item js-select-airport')
          .append(function() {
            return $('<span>')
              .addClass('detail')
              .append($('<span>').addClass('city').text(data.type))
              .append($('<span>').addClass('name').text(data.name));
          });
          target.append(a);
        };

      var history = function(add) {
        var list = Func.storage('hotel.history');
        list instanceof Array || (list = []);
        if (add) {
          var exists = -1;
          $.each(list, function(index) {
            if (this.id === add.id) {
              exists = index;
              return false;
            }
          });
          exists >= 0 && list.splice(exists, 1);
          list.unshift(add);
          Func.storage('hotel.history', list.slice(0, SETTINGS.HOTEL.HISTORY.SEARCH));
        } else {
          return list;
        }
      };

      $('.search-airport').each(function() {
        var self = this;

        var click = function() {
          var data = $(this).data();
          var select = function(data) {
              
            var hotelId  = Status.search.hotel;
            if (Status.pathname[0] === 'tour' && Status.pathname[1] === 'hotel') {
              var storageData = Func.storage('history');
              if (storageData['hotel/detail'][0]) {
                var storageHtl = jQuery.parseJSON(storageData['hotel/detail'][0]);
                if (storageHtl['hotelid'] != hotelId) {
                  hotelId = storageHtl['hotelid'];
                }
              }
            }

            if ((true == (0 < $('.search-airport.is-arrival .search-item__value').size() && 0 < $('.search-airport.is-arrival .suggest-airport .suggested-city').size())) || hotelId){
              // DP用
              if (data.fid != undefined) {
                if ($(self).find('.search-item .search-item__value').length === 0) {
                  $(self)
                    .find('.search-item').append($('<span>').addClass('search-item__value').text(data.fid)).end()
                    .find('.search-item__title').addClass('is-left is-half').end();
                }
                $(self).find('.search-item .search-item__value').text(data.fid).end();
              }
              else if (typeof data.id == 'string' && parseInt(data.id) != parseInt(data.id)) {
                if (hotelId && $(self).find('.search-item .search-item__value').length === 0) {
                  $(self)
                    .find('.search-item').append($('<span>').addClass('search-item__value').text(data.id)).end()
                    .find('.search-item__title').addClass('is-left is-half').end();
                }
                $(self).find('.search-item .search-item__value').text(data.id).end();
              }
              //else if (hotelId && Status.pathname[0] === 'tour' && Status.pathname[1] === 'hotel') {
              //    $(self).find('.search-item .search-item__value').text(data.id).end();
              //}
              else {
                Func.storage('suggest', data);
                console.log('xxx', 'DP-Error');
                Func.error('最寄りの空港が見つかりませんでした。もう一度目的地を選択して下さい。', true);
              }
              $(self).find('.search-item').data(data)
            }
            else {
              var _name = data.text;
              if (undefined == _name && undefined != data.name){
                _name = data.name;
              }
              $(self).find('.search-item').data(data)
              .find('.label').text(_name).end();
              Func.history('hotel/search', data);
              $('.search-airport').trigger('flush');
            }
            $(self).find('.js-close-input-airport').trigger('click');
          };
          if (data.id) {
            select(data);
          } else {
            var query = {q: data.text};
            if (typeof data.fid != 'undefined') {
              query = {q: data.fid, type:'airportcity'};
            }
            var option = {
              method: 'GET',
              url: Func.url('/hotel/data/suggestion', query),
              contentType: 'application/json',
              dataType: 'json'
            };
            $.ajax(option).done(function(result) {
              $.each(result.found, function() {
                $.extend(data, this);
                return false;
              });
              data.id && select(data);
            });
          }
          return false;
        };

        $(this).find('.suggested-city .js-select-airport').on('click', click);
        var search = $(this).find('.suggested-search.tab-contents-item').on('click', '.js-select-airport', click);
        var histories = $(this).find('.suggested-search.history').on('click', '.js-select-airport', click);

        $(this).find('.input-airport')
          .on('keyup touchend change', function(event) {
            var value = $.trim($(this).val());
            if (value !== '') {
              var option = {
                method: 'GET',
                url: Func.url('/hotel/data/suggestion', {q: value, type:'index'}),
                contentType: 'application/json',
                dataType: 'json'
              };
              $.ajax(option).done(function(result) {
                search.empty();
                $.each(result.found, function() {
                  append(search, this);
                });
              });
            }
            else {
              search.empty();
            }
          })
          .on('keypress', function(event) {
            var tab = $(this).closest('.input-area').find('.js-tab:first');
            tab.hasClass('is-active') || tab.trigger('click');
            if (event.keyCode === 13) {
              search.find('.js-select-airport:first').trigger('click');
            }
          });

        $(this).on('flush', function() {
          var list = Func.history('hotel/search');
          if (list.length > 0) {
            histories.empty();
            $.each(list, function() {
              append(histories, this);
            });
            histories.closest('.input-airport-history').show();
          } else {
            histories.closest('.input-airport-history').hide();
          }
        });

        $(this).trigger('flush');
      });
    };

    methods.bindSearch = function(type, locationurl) {
      var targets = [
        '.search-panel:not(.air-search) .button-area a',
        '.research-panel:not(.air-search) .button-area a',
        'a.dp-link-hotel',
      ];
      $(targets.join(',')).bind('click', function() {
        var rooms = [];
        $('#js-modal-people .js-people-selector').each(function() {
          var adult = $(this).find('.js-people-num-adult').val()|0;
          var children = [];
          $(this).find('.select-children-age .is-show').each(function() {
            children.push($(this).find('select').val()|0);
          });
          adult > 0 && rooms.push({adult: adult, children: children});
        });
        var storageData = Func.storage('suggest');
        if (Status.pathname[0] === 'tour' && Status.pathname[1] === 'hotel' && storageData) {
          Func.storage('suggest', null);
          var conditions = {
            stay: Status.search.stay,
            room: Status.search.room,
            region: Status.search.region,
            hotel: Status.search.hotel,
          };
          location.href = Func.url(locationurl, conditions);
        }
        else {
        
          if (rooms.length <= 0) {
            return Func.error('*SEARCH_FAILURE');
          }

          var isset = $(this).hasClass('is-set');
          if (!isset){
            isset = $(this).hasClass('isset');
          }
          var range = $('.search-form .flight-calendar').data('range');
          if (!range) {
            return Func.error('*SEARCH_MISSING_SCHEDULE');
          }
          var chk_rangefrom = new Date(range.from.year, range.from.month -1, range.from.day);
          var chk_nowdate = new Date();
          chk_rangefrom.setDate(chk_rangefrom.getDate() + 1)
          if (SETTINGS.HOTEL.REQUIRE.SCHEDULE && !range) {
            return Func.error('*SEARCH_MISSING_SCHEDULE');
          }
          if (SETTINGS.HOTEL.REQUIRE.SCHEDULE){
            if (false === (chk_nowdate < chk_rangefrom)){
              // 過去日程の検索条件はエラー
              return Func.error('*SEARCH_OUTOFRANGE_SCHEDULE');
            }
          }
          var conditions = {
            stay: qStay.encode(Calendar.defaultValue(range)),
            room: qRoom.encode(rooms),
            set: isset
          };
        }

        var searchHotel = function(arrivalID, dom) {
            var range = $('.search-form .flight-calendar').data('range');
            var chk_rangefrom = new Date(range.from.year, range.from.month -1, range.from.day);
            var chk_nowdate = new Date();
            chk_rangefrom.setDate(chk_rangefrom.getDate() + 1);
            if (SETTINGS.HOTEL.REQUIRE.SCHEDULE && !range) {
              return Func.error('*SEARCH_MISSING_SCHEDULE');
            }
            if (SETTINGS.HOTEL.REQUIRE.SCHEDULE){
              if (false === (chk_nowdate < chk_rangefrom)){
                // 過去日程の検索条件はエラー
                return Func.error('*SEARCH_OUTOFRANGE_SCHEDULE');
              }
            }

            if (0 < $('#part-trip:checked').size() && true == ('on' == $('#part-trip:checked').val() || 1 == $('#part-trip:checked').val())){
              // チェックイン期間の特定
              var airrange = $('.search-form .flight-calendar:not(.hoteloptioncalendar)').data('range');
              // XXX チェックイン期間がフライト日程内かどうかのチェックも必要！
              range = $('.search-item.flight-calendar.hoteloptioncalendar').data('range');
              // 日付比較 期間内かどうか
              var airfrom = new Date(airrange.from.year, airrange.from.month -1, airrange.from.day);
              var airto = new Date(airrange.to.year, airrange.to.month -1, airrange.to.day);
              var rangefrom = new Date(range.from.year, range.from.month -1, range.from.day);
              var rangeto = new Date(range.to.year, range.to.month -1, range.to.day);
              airfrom.setDate(airfrom.getDate()-3);
              airto.setDate(airto.getDate()+3);
              if (false === (airfrom <= rangefrom && rangeto <= airto)){
                // 日程に収まっていないので、このホテルの日程はエラー
                $('.search-form__row.hoteloptioncalendar .caution-message').removeClass('is-hidden');
                return;
              }
              else if (airfrom > rangefrom && rangeto < airto) {
                $('.search-form__row.hoteloptioncalendar #part-trip').prop('checked', true);
              }
            }
            if (SETTINGS.HOTEL.REQUIRE.SCHEDULE && !range) {
              return Func.error('*SEARCH_MISSING_SCHEDULE');
            }

            conditions['stay'] = qStay.encode(range);
            var historyPath = 'tour/cond';
            if ('undefined' == typeof locationurl && true != $(dom).hasClass('is-set')){
                locationurl = '/hotel/search';
                historyPath = 'hotel/cond';
            }
            if (true == $(dom).hasClass('is-set') || -1 < location.pathname.indexOf('/m/tour/')){
              locationurl = 'tour/hotel';

              if (0 > location.pathname.indexOf('/m/tour/') && typeof airport.fid != 'string'){
                // 目的地を暫定決定出来ないのでツアーのトップに遷移先を差し替える
                locationurl = 'tour/';
                Func.history(historyPath, false);
                Func.history('tour/detail/airdom', false);
                Func.history('air/detail', false);
              }
              else if (0 > location.pathname.indexOf('/m/tour/')){

                Func.history(historyPath, false);
                Func.history('tour/detail/airdom', false);
                Func.history('air/detail', false);
                if (true == $(dom).hasClass('is-set')){
                  Func.history('tour/detail/hoteldom', false);
                  Func.history('hotel/detail', false);
                }
              }
              var _adult = 0;
              var _child = 0;
              var _baby = 0;
              var _children = [];
              for (var ridx=0; ridx < rooms.length; ridx++){
                _adult += rooms[ridx].adult;
                _child += rooms[ridx].children.length;
                for (var cidx=0; cidx < rooms[ridx].children.length; cidx++){
                  _children.push({age:rooms[ridx].children[cidx],seat:false});
                  if (2 > rooms[ridx].children[cidx]){
                    _baby++;
                    _child--;
                  }
                }
              }
              var traveler = {
                adult: _adult,
                child: _child,
                baby: _baby,
                children: _children
              };
              conditions.traveler = qTraveler.encode(traveler);
            }
            if (undefined == arrivalID || '' == arrivalID || null == arrivalID){
              location.href = Func.url(locationurl, conditions, function(build) {
                var _condition = Func.history(historyPath).shift();
                if (_condition != undefined){
                  // 検索条件のマージ
                  if (true == ('airline' in _condition) && true != ('airline' in build)){
                    build.airline = _condition.airline;
                  }
                  if (true == ('flight.1' in _condition) && true != ('flight.1' in build)){
                    build['flight.1'] = _condition['flight.1'];
                  }
                  if (true == ('flight.2' in _condition) && true != ('flight.2' in build)){
                    build['flight.2'] = _condition['flight.2'];
                  }
                  if (true == ('seat' in _condition) && true != ('seat' in build)){
                    build.seat = _condition.seat;
                  }
                  if (true == ('traveler' in _condition) && true != ('traveler' in build)){
                    build.traveler = _condition.traveler;
                  }
                  if (historyPath.match(/\/cond$/) && document.referrer.match(/m\/top$/)) {
                    //Func.history(historyPath+'/cache', 'clear');
                  }

                  // 航空券選択キャッシュ削除判定
                  if (false == (true == ('flight.1' in _condition) && true == ('flight.1' in build) && build['flight.1'] == _condition['flight.1'])) {
                    // 条件が変わったのでキャッシュをクリアする
                    Func.history('tour/detail/airdom', false);
                    Func.history('air/detail', false);
                  }
                  // 航空券選択キャッシュ削除判定
                  if (false == (true == ('flight.2' in _condition) && true == ('flight.2' in build) && build['flight.2'] == _condition['flight.2'])) {
                    // 条件が変わったのでキャッシュをクリアする
                    Func.history('tour/detail/airdom', false);
                    Func.history('air/detail', false);
                  }
                  // 航空券選択キャッシュ削除判定
                  if (true == ('seat' in build) && false == (true == ('seat' in _condition) && true == ('seat' in build) && build['seat'] == _condition['seat'])) {
                    Func.history('tour/detail/airdom', false);
                    Func.history('air/detail', false);
                  }
                  // 航空券選択キャッシュ削除判定
                  if (false == (true == ('traveler' in _condition) && true == ('traveler' in build) && build['traveler'] == _condition['traveler'])) {
                      // XXX 年齢しか変わっていなくて同乗者数に変わりがないかを再判定
                      var buildTraveler = null;
                      if (true == ('traveler' in build)){
                        buildTraveler = build.traveler.split(' ');
                      }
                      var condTraveler = null;
                      if (true == ('traveler' in _condition)){
                        condTraveler = _condition.traveler.split(' ');
                      }
                      var airclear = false;
                      if (buildTraveler == null){
                        airclear = true;
                      }
                      else if (condTraveler == null){
                          airclear = true;
                      }
                      else if (condTraveler[0] != buildTraveler[0]){
                          airclear = true;
                      }
                      if (airclear == true){
                        Func.history('tour/detail/airdom', false);
                        Func.history('air/detail', false);
                      }
                  }
                  // ホテル選択キャッシュ削除判定
                  if (false == (true == ('stay' in _condition) && true == ('stay' in build) && build['stay'] == _condition['stay'])) {
                    Func.history('tour/detail/hoteldom', false);
                    Func.history('hotel/detail', false);
                  }
                  // ホテル選択キャッシュ削除判定
                  if (false == (true == ('room' in _condition) && true == ('room' in build) && build['room'] == _condition['room'])) {
                    Func.history('tour/detail/hoteldom', false);
                    Func.history('hotel/detail', false);
                  }
                  // ホテル選択キャッシュ削除判定
                  if (false == 
                    (  true == (true == ('region' in _condition) && true == ('region' in build) && build['region'] == _condition['region'])
                    || true == (true == ('hotel' in _condition) && true == ('hotel' in build) && build['hotel'] == _condition['hotel'])
                  )) {
                    Func.history('tour/detail/hoteldom', false);
                    Func.history('hotel/detail', false);
                  }
                }
                if (-1 < locationurl.indexOf('tour/') && true != ('flight.1' in build)){
                    var toairport = '';
                    if (('fid' in airport) && '' != airport.fid){
                      var toairport = airport.fid
                    }
                    if (undefined != airrange){
                      range = airrange;
                    }
                    build['flight.1'] = qFlight.encode({
                      departure: '',
                      arrival: toairport,
                      date: range.from,
                      direct: false
                    });
                    build['flight.2'] = qFlight.encode({
                      departure: toairport,
                      arrival: '',
                      date: range.to,
                      direct: false
                    });
                }
                Func.history(historyPath, build);
              });
              return false;
            }
            var option = {
              method: 'GET',
              url: Func.url('/hotel/data/suggestion', {q: arrivalID, type:'airportcity'}),
              contentType: 'application/json',
              dataType: 'json'
            };
            $.ajax(option).done(function(result) {
              var data = null;
              for (var didx=0; didx < result.found.length; didx++){
                if (arrivalID == result.found[didx].fid){
                  data = result.found[didx];
                  if (!('region' in conditions) && !('hotel' in conditions) && ('id' in data)) {
                    conditions[data.datatype] = data.id;
                  }
                  break;
                }
              }
              if (-1 < location.pathname.indexOf('/tour/hotel')){
                // DPホテル画面での検索ボタン押下時の追加制御
                var hotelId = Status.search.hotel;
                if (hotelId) {
                  // 目的地が変わっていたら、ホテルIDを捨てる 変わっていなければ捨てない
                  var flight = qFlight.decode(Status.search['flight.1']);
                  if (undefined != flight && null != flight && null != flight.arrival && arrivalID == flight.arrival) {
                    // 一度航空券に行っている場合はarrivalID == flight.arrivalであっても検索条件の変更にあたるものとする
                    if (true != ('back' in Status.search)) {
                      // 目的地が変わらないので変えない
                      conditions['hotel'] = hotelId;
                      delete conditions.region;
                    }
                  }
                  else if (undefined == flight || null == flight){
                    // 目的地が変わらないので変えない
                    conditions['hotel'] = hotelId;
                    delete conditions.region;
                  }
                }
              }
              else if (0 > $(dom).text().indexOf('検索')){
                // DP航空券からDPホテルへタブ遷移する場合がココに該当
                var hotelId = Status.search.hotel;

                if (hotelId) {
                  conditions['hotel'] = hotelId;
                  conditions['back'] = '1';
                  delete conditions.region;
                }
              }
              location.href = Func.url(locationurl, conditions, function(build) {
                // TOPからDPへの遷移
                if (historyPath == 'tour/cond' && 0 > location.pathname.indexOf('/m/tour/') && true == (-1 < location.pathname.indexOf('/air') || -1 < location.pathname.indexOf('/hotel'))) {
                  // キャッシュをクリアする
                  Func.history('tour/detail/airdom', false);
                  Func.history('tour/detail/hoteldom', false);
                  Func.history('air/detail', false);
                  Func.history('hotel/detail', false);
                  Func.history(historyPath, false);
                }
                var _condition = Func.history(historyPath).shift();
                if (-1 < locationurl.indexOf('tour/') && true == (true == ('flight.1' in build) || true == ('flight.1' in _condition))){
                    var fromairport = '';
                    if (true == ('flight.1' in build)) {
                      fromairport = qFlight.decode(build['flight.1']);
                    }
                    if (true == ('flight.1' in _condition)) {
                      fromairport = qFlight.decode(_condition['flight.1']);
                    }              
                    if (!fromairport) {
                      fromairport = {};
                      fromairport.departure = $('.search-airport.is-departure .search-item .search-item__value').text();
                    }
                    if (0 < $('.search-form .search-airport.is-departure .search-item__value').size() && fromairport.departure != $('.search-form .search-airport.is-departure .search-item__value').text()){
                      fromairport.departure = $('.search-form .search-airport.is-departure .search-item__value').text();
                      // 出発空港が変えられた
                      Func.history('tour/detail/airdom', false);
                      Func.history('air/detail', false);
                    }
                    if (undefined != airrange){
                      range = airrange;
                    }
                    build['flight.1'] = qFlight.encode({
                      departure: fromairport.departure,
                      arrival: arrivalID,
                      date: range.from,
                      direct: fromairport.direct
                    });
                    build['flight.2'] = qFlight.encode({
                      departure: arrivalID,
                      arrival: fromairport.departure,
                      date: range.to,
                      direct: fromairport.direct
                    });
                }
                if (_condition != undefined){
                  // 検索条件のマージ
                  if (true == ('airline' in _condition) && true != ('airline' in build)){
                    build.airline = _condition.airline;
                  }
                  if (true == ('flight.1' in _condition) && true != ('flight.1' in build)){
                    build['flight.1'] = _condition['flight.1'];
                  }
                  if (true == ('flight.2' in _condition) && true != ('flight.2' in build)){
                    build['flight.2'] = _condition['flight.2'];
                  }
                  if (true == ('seat' in _condition) && true != ('seat' in build)){
                    build.seat = _condition.seat;
                  }
                  if (true == ('traveler' in _condition) && true != ('traveler' in build)){
                    build.traveler = _condition.traveler;
                  }
                  // 航空券選択キャッシュ削除判定
                  if (false == (true == ('flight.1' in _condition) && true == ('flight.1' in build) && build['flight.1'] == _condition['flight.1'])) {
                    // 条件が変わったのでキャッシュをクリアする
                    Func.history('tour/detail/airdom', false);
                    Func.history('air/detail', false);
                  }
                  // 航空券選択キャッシュ削除判定
                  if (false == (true == ('flight.2' in _condition) && true == ('flight.2' in build) && build['flight.2'] == _condition['flight.2'])) {
                    // 条件が変わったのでキャッシュをクリアする
                    Func.history('tour/detail/airdom', false);
                    Func.history('air/detail', false);
                  }
                  // 航空券選択キャッシュ削除判定
                  if (true == ('seat' in build) && false == (true == ('seat' in _condition) && true == ('seat' in build) && build['seat'] == _condition['seat'])) {
                    Func.history('tour/detail/airdom', false);
                    Func.history('air/detail', false);
                  }
                  // 航空券選択キャッシュ削除判定
                  if (false == (true == ('traveler' in _condition) && true == ('traveler' in build) && build['traveler'] == _condition['traveler'])) {
                      // XXX 年齢しか変わっていなくて同乗者数に変わりがないかを再判定
                      var buildTraveler = null;
                      if (true == ('traveler' in build)){
                        buildTraveler = build.traveler.split(' ');
                      }
                      var condTraveler = null;
                      if (true == ('traveler' in _condition)){
                        condTraveler = _condition.traveler.split(' ');
                      }
                      var airclear = false;
                      if (buildTraveler == null){
                        airclear = true;
                      }
                      else if (condTraveler == null){
                          airclear = true;
                      }
                      else if (condTraveler[0] != buildTraveler[0]){
                          airclear = true;
                      }
                      if (airclear == true){
                        Func.history('tour/detail/airdom', false);
                        Func.history('air/detail', false);
                      }
                  }
                  // ホテル選択キャッシュ削除判定
                  if (false == (true == ('stay' in _condition) && true == ('stay' in build) && build['stay'] == _condition['stay'])) {
                    Func.history('tour/detail/hoteldom', false);
                    Func.history('hotel/detail', false);
                  }
                  // ホテル選択キャッシュ削除判定
                  if (false == (true == ('room' in _condition) && true == ('room' in build) && build['room'] == _condition['room'])) {
                    Func.history('tour/detail/hoteldom', false);
                    Func.history('hotel/detail', false);
                  }
                  // ホテル選択キャッシュ削除判定
                  if (false == 
                    (  true == (true == ('region' in _condition) && true == ('region' in build) && build['region'] == _condition['region'])
                    || true == (true == ('hotel' in _condition) && true == ('hotel' in build) && build['hotel'] == _condition['hotel'])
                  )) {
                    Func.history('tour/detail/hoteldom', false);
                    Func.history('hotel/detail', false);
                  }
                }
                Func.history(historyPath, build);
              });
            });
        };

        var airport = {id:false};
        var arrivalID = '';
        if (0 < $('.search-form .search-hotel .search-item').size()){
          airport = $('.search-form .search-hotel .search-item').data();
          if (!airport.id) {
            return Func.error('*SEARCH_MISSING_STAYPLACE');
          }
        }
        else if (0 < $('.search-form .search-airport.is-arrival .search-item__value').size() && 0 < $('.search-form .search-airport.is-arrival .suggest-airport .suggested-city').size()){
          arrivalID = $('.search-form .search-airport.is-arrival .search-item__value').text();
          airport = $('.search-form .search-airport.is-arrival .search-item').data();
        }

        if (arrivalID == '' && airport.id) {

          conditions[airport.datatype] = airport.id;
          searchHotel('', this);
        } else if (0 < $('.search-form .search-airport.is-arrival .search-item__value').size()) {
          // 3レターが現在の検索のリージョンコードと一致するかどうか
          if (true == ('flight.1' in Status.search)){
            var flight = qFlight.decode(Status.search['flight.1']);
            if (null != flight && null != flight.arrival && flight.arrival != arrivalID){
              // リージョンIDが検索条件にある場合リージョンコードからfidを逆引きする
              
              if (Status.search.hotel) {
                  conditions['hotel'] = Status.search.hotel;
              }

                var replaceRegion = true;

                if (replaceRegion == true){
                  // 目的地が変わっているのでキャッシュ削除
                  Func.history('tour/detail/airdom', false);
                  Func.history('air/detail', false);
                  if (true != ('hotel' in Status.search)) {
                      conditions['hotel'] = Status.search.hotel;
                      delete conditions.region;
                      Func.history('tour/detail/hoteldom', false);
                      Func.history('hotel/detail', false);
                  }
                }
                if (undefined != airport.id && Status.search.region != airport.id){
                  conditions[airport.datatype] = airport.id;
                }
                else if (('region' in Status.search)){
                  conditions['region'] = Status.search.region;
                }
                else if (('hotel' in Status.search)){
                  conditions['hotel'] = Status.search.hotel;
                }
                searchHotel(arrivalID, this);

            }
            else {
              // 変更無し
              searchHotel(arrivalID, this);
            }
          }
          else {
            conditions[airport.datatype] = airport.id;
            searchHotel(arrivalID, this);
          }

          return false;
        }

      });
      return false;
    };


    methods.embedConditions = function() {
      var defer = new $.Deferred;
      var panel = $('.research-panel');

      defer.done(function() {
        panel.show();
      });

      if (0 < $('.dp-current-list__item:last-child .dp-current-item__header .dp-select:not(.is-selected)').size()){
        var hotelDetail = Func.history('hotel/detail').shift();
        if (hotelDetail != undefined && -1 < hotelDetail.indexOf('{')){
          hotelDetail = JSON.parse(hotelDetail);
          if (true == ('hotelid' in hotelDetail)) {
            $('.dp-current-list__item:last-child .dp-current-item__header .dp-select:not(.is-selected)').text('読み込み中');
          }
        }
      }

      if (Status.search.region || Status.search.hotel) {
        var type = '';
        if (Status.search.region) {
          type = 'region';
        }
        else if (Status.search.hotel) {
          type = 'hotel';
        }

      } else {
        defer.resolve();
      }

      var stay = qStay.decode(Status.search.stay);
      if (stay !== null) {
        var r1 = new Date(stay.from.year, stay.from.month - 1, stay.from.day);
        var r2 = new Date(stay.to.year, stay.to.month - 1, stay.to.day);
        var dist = Math.ceil((r2.getTime() - r1.getTime()) / 86400000);
        var label = [
          Func.date(stay.from, 'slim'),
          '〜',
          Func.date(stay.to, 'slim'),
          ' ',
          Func.vsprintf('%d泊', [dist])
        ];
        panel.find('.current-search-info__date').text(label.join(''));
      }

      // 検索条件の部屋数・人数をセットする
      var firstPanel = panel.find('.people-list__item:eq(0) .num');
      if (firstPanel.hasClass('room')){
          var room = qRoom.decode(Status.search.room);
          panel.find('.people-list__item:eq(0) .num').text(room.length);
          if (true === (-1 < location.pathname.indexOf('/m/tour/') && undefined != Status.search.room) || undefined == Status.search.traveler){
            var adult = 0;
            var child = 0;
            var baby = 0;
            for (var ridx=0; ridx < room.length; ridx++){
              adult += room[ridx].adult;
              child += room[ridx].children.length;
              if (-1 < location.pathname.indexOf('/m/tour/')) {
                for (var cidx=0; cidx < room[ridx].children.length; cidx++){
                  if (2 > room[ridx].children[cidx]){
                    baby++;
                    child--;
                  }
                }
              }
            }
            panel.find('.people-list__item:eq(1) .num').text(Func.vsprintf('x%d', [adult]));
            panel.find('.people-list__item:eq(2) .num').text(Func.vsprintf('x%d', [child]));
            if (-1 < location.pathname.indexOf('/m/tour/')) {
              panel.find('.people-list__item:eq(3) .num').text(Func.vsprintf('x%d', [baby]));
            }
          } else {
            var traveler = qTraveler.decode(Status.search.traveler);
            panel.find('.people-list__item:eq(1) .num').text(Func.vsprintf('x%d', [traveler.adult]));
            panel.find('.people-list__item:eq(2) .num').text(Func.vsprintf('x%d', [traveler.child]));
            panel.find('.people-list__item:eq(3) .num').text(Func.vsprintf('x%d', [traveler.baby]));
          }
      }
      else {
        var traveler = qTraveler.decode(Status.search.traveler);
        panel.find('.people-list__item:eq(0) .num').text(Func.vsprintf('x%d', [traveler.adult]));
        panel.find('.people-list__item:eq(1) .num').text(Func.vsprintf('x%d', [traveler.child]));
        panel.find('.people-list__item:eq(2) .num').text(Func.vsprintf('x%d', [traveler.baby]));
      }
      panel.show();

    };

    return methods;
  })();


  var Tour = (function() {
    var methods = {};

    var qFlight = {
      encode: function(value) {
        if (value.date) {
          var block = [
            Func.vsprintf('%s-%s', [value.departure, value.arrival]),
            Func.date(value.date, 'simple')
          ];
          value.direct && block.push('DR');
          return block.join(' ');
        } else {
          return null;
        }
      },
      decode: function(value) {
        var match = (value || '').match(/^(.{0,3})-(.{0,3})\s+(\d{4})(\d{2})(\d{2})(?:\s+(DR))?$/);
        if (match !== null) {
          return {
            departure: match[1],
            arrival: match[2],
            date: {year: match[3]|0, month: match[4]|0, day: match[5]|0},
            direct: !!match[6]
          };
        } else {
          return null;
        }
      },
    };

    var qTraveler = {
      encode: function(value) {
        value.adult || (value.adult = 1);
        var encoded = [];
        if (value.children.length > 0) {
          var block2 = [];
          $.each(value.children, function() {
            if (this.age > 11){
              value.adult++;
              value.child--;
            }
            else {
              block2.push(this.age + (this.seat ? '' : ''));
              // XXX 誤動作するので一旦封印
              //block2.push(this.age + (this.seat ? '.s' : ''));
            }
          });
        }
        var block1 = [value.adult, value.child, value.baby];
        encoded.push(block1.join('-'));
        if (value.child > 0){
          encoded.push(block2.join('-'));
        }
        return encoded.join(' ');
      },
      decode: function(value) {
        var decoded = {};
        var block = value.split(/\s/);
        (function(n) {
          var s = (n || '').split(/-/);
          decoded.adult = s[0]|0;
          decoded.child = s[1]|0;
          decoded.baby = s[2]|0;
        })(block.shift());
        (function(n) {
          decoded.children = [];
          var s = (n || '').split(/-/);
          $.each(s, function() {
            var m = this.match(/^(\d+)(?:\.(.))?$/);
            m && decoded.children.push({age: m[1]|0, seat: !!m[2]});
          });
        })(block.shift());
        return decoded;
      }
    };

    var qStay = {
      encode: function(data) {
        var convert = function(o) {
          if (o && o.year && o.month && o.day) {
            return Func.date(o, 'simple');
          } else {
            return null;
          }
        };
        if (typeof data === 'object') {
          var r1 = convert(data.from);
          var r2 = convert(data.to);
          if (r1 && r2) {
            return [r1, r2].join('-');
          }
        }
        return null;
      },
      decode: function(data) {
        var convert = function(s) {
          if (typeof s === 'string' && s.length === 8) {
            return {year: s.substr(0, 4)|0, month: s.substr(4, 2)|0, day: s.substr(6, 2)|0};
          } else {
            return null;
          }
        };
        if (typeof data === 'string') {
          var part = data.split(/-/);
          var r1 = convert(part.shift());
          var r2 = convert(part.shift());
          if (r1) {
            var decoded = {from: r1};
            r2 && $.extend(decoded, {to: r2});
            return decoded;
          }
        }
        return null;
      }
    };

    var qRoom = {
      encode: function(data) {
        var list = [];
        $.each(data, function() {
          var parts = [this.adult];
          if (this.children.length > 0) {
            parts.push(this.children.join('.'));
          }
          list.push(parts.join('-'));
        });
        if (list.length > 0) {
          return list.join(' ');
        } else {
          return null;
        }
      },
      decode: function(data) {
        var list = [];
        $.each((data || '').split(/ /), function() {
          var part = this.split(/-/);
          var n = {adult: part[0]|0, children: []};
          if (part[1]) {
            $.each(part[1].split(/\./), function() {
              n.children.push(this|0);
            });
          }
          list.push(n);
        });
        return list;
      }
    };

    methods.bindSearch = function(type) {
      // DPの航空券で選択キャッシュを即時表示を行う(24時間以内限定処理)
      if (0 < $('#part-trip').size()){
          var airprice = -1;
          var hotelprice = -1;
          var airpaymentmethods = [];
          var hotelpaymentmethods = [];
          // DP航空券の場合の復帰処理
          var expired = new Date().getTime() - 24*60*60*1000;
          var flight = qFlight.decode(Status.search['flight.1']);
          if ('/m/tour/' != location.pathname && '/m/tour' != location.pathname && !flight && !qFlight.decode(Status.search['flight.2'])) {
              //Func.error('*SEARCH_DP_FROMHOTEL');
          }
          if (0 < $('.dp-current-list__item:first-child .dp-current-item__header .dp-select:not(.is-selected)').size()){
            var _currentPlanDom = Func.history('tour/detail/airdom').shift();
            var airDetail = Func.history('air/detail').shift();
            if (airDetail != undefined && -1 < airDetail.indexOf('{')){
              airDetail = JSON.parse(airDetail);
              //console.log(airDetail.time);
              //console.log(expired);
              if (true == ('id' in airDetail) && true == ('time' in airDetail) && true == ('arrival' in airDetail) && airDetail.arrival == flight.arrival && airDetail.time > expired) {
                // 航空券の復帰
                var currentPlanDom = $('<ul class="list selecteddom">'+(_currentPlanDom)+'</ul>');
                currentPlanDom.find('.js-show-modal').remove();
                $('.dp-current-list__item:first-child .dp-current-item__header .dp-select').addClass('is-selected');
                $('.dp-current-list__item:first-child .dp-current-item__header .dp-select').text('選択済み');
                currentPlanDom.removeClass('selected');
                currentPlanDom.find('.selected-head').remove();
                $('.dp-current-list__item:first-child .dp-current-item__contents').html(currentPlanDom);
                airprice = airDetail.price;
                airpaymentmethods = airDetail.paymentmethods;
              }
            }
            $('.dp-current-list__item:first-child .dp-current-item__header .dp-select:not(.is-selected)').text('未選択');
          }
          if (0 < $('.dp-current-list__item:last-child .dp-current-item__header .dp-select:not(.is-selected)').size()){
            var hotelDetail = Func.history('hotel/detail').shift();
            if (hotelDetail != undefined && -1 < hotelDetail.indexOf('{')){
              // ホテルの復帰
              hotelDetail = JSON.parse(hotelDetail);
              //console.log(hotelDetail.time);
              //console.log(expired);
              if (true == ('time' in hotelDetail) /*&& hotelDetail.arrival && hotelDetail.arrival == flight.arrival*/ && hotelDetail.time > expired) {
                var currentPlanDom = Func.history('tour/detail/hoteldom').shift();
                if (currentPlanDom != undefined){
                  //var _currentPlanDom = $('<ul class="list selecteddom">'+(currentPlanDom)+'</ul>');
                  $('.dp-current-list__item:last-child .dp-current-item__header .dp-select').addClass('is-selected');
                  $('.dp-current-list__item:last-child .dp-current-item__header .dp-select').text('選択済み');
                  $('.dp-current-list__item:last-child .dp-current-item__contents').html(currentPlanDom);
                  hotelprice = hotelDetail.price;
                  hotelpaymentmethods = hotelDetail.paymentmethods;
                }
              }
            }
            $('.dp-current-list__item:last-child .dp-current-item__header .dp-select:not(.is-selected)').text('未選択');
          }
          // ホテルも航空券も設定されていたら予約ボタンを表示
          if (-1 < airprice && -1 < hotelprice && -1 < parseInt(hotelprice + airprice)){
            $('.amount-panel .price').text('¥'+((hotelprice + airprice).toString().replace(/(\d)(?=(\d{3})+$)/g , '$1,')));
            Func.amoundetail(airDetail,hotelDetail);
            $('.amount-panel .button-area a').removeClass('is-disable');
            $('.amount-panel .payment-list').empty();
            $.each(airpaymentmethods, function() {
              if (SETTINGS.PAYMETHOD[this.type]) {
                var baseType = this.type;
                $.each(hotelpaymentmethods, function() {
                  if (SETTINGS.PAYMETHOD[this.type] && baseType == this.type) {
                    var img = $('<img>').attr('src', 'images/' + SETTINGS.PAYMETHOD[this.type].icon);
                    $('.amount-panel .payment-list').append(img);
                  }
                });
              }
            });
            $('.amount-panel').show();
          }
      }
      Air.bindSearch(Status.pathname[1], '/tour/search');
      Hotel.bindSearch(Status.pathname[1], '/tour/hotel');
      $('.amount-panel .button-area a:not(.is-set)').off('click').on('click', function(){
        if( ($('#js-modal-loading').find('.loading').length < 1)){
          var var_loading = '<div id="loading" class="loading"><img src="images/loading.png" alt="" class="loading__icon" width="50" height="50" margin-top="50%"></div>';
          $('#js-modal-loading').find('.modal__window').after(var_loading);
        }
        $('#js-modal-loading').show();

        $(this).addClass('is-disable');
        // 航空券のシート確認
        var airDetail = Func.history('air/detail').shift();
        airDetail = JSON.parse(airDetail);
        var option = {
          method: 'POST',
          url: Func.url('/air/data/detail/seat', Func.storage(['session', 'code'])),
          contentType: 'application/json',
          data: JSON.stringify({key: airDetail.key, id: airDetail.id}),
          dataType: 'json'
        };
        $.ajax(option).done(function(result) {
          var hotelDetail = JSON.parse(Func.history('hotel/detail').shift());
          if (result.status === 'success') {
            // ホテルの詳細を参照する
            var postdata = JSON.stringify({
              stay: Status.search.stay,
              room: Status.search.room,
              hotel: hotelDetail.hotelid,
              PackageRate: 'Y',
            });
            var option = {
              method: 'POST',
              url: Func.url('/hotel/data/detail', Func.storage(['session', 'code'])),
              contentType: 'application/json',
              data: postdata,
              dataType: 'json'
            };
            $.ajax(option).done(function(_result) {
              var detail = _result.result.HotelSummarys.HotelSummary.shift();
              var room = null;
              for (var roomIdx=0; roomIdx<detail.RoomTypes.length; roomIdx++){
                if (hotelDetail.roomTypeCode == detail.RoomTypes[roomIdx].roomTypeCode && hotelDetail.rateCode == detail.RoomTypes[roomIdx].rateCode){
                  room = detail.RoomTypes[roomIdx];
                  break;
                }
              }
              if (null == room){
                Func.error('ご指定のお部屋は現在ご案内出来ません', true);
                return false;
              }
              var sessionKey2 = _result.result.StatusInfo.sessionKey;
              var referer = Func.storage('referer');
              var traveler = qTraveler.decode(Status.search.traveler);
              var adult = traveler.adult;
              var child = traveler.child;
              var ins = 0;
              $.each(traveler.children, function() {
                if (this.age <= 1 && this.seat) {
                  ins ++;
                }
                // DPだけの特殊処理 12歳以上の子供は大人として航空券予約に入れ直す
                else if (this.age > 11){
                  adult++;
                  child--;
                }
              });
              var routes = [];
              for (var i = 1; i <= 6; i ++) {
                var key = Func.vsprintf('flight.%d', [i]);
                var flight = qFlight.decode(Status.search[key]);
                flight && routes.push(Func.vsprintf('%s-%s-%d%02d%02d-%s', [
                  flight.departure,
                  flight.arrival,
                  flight.date.year,
                  flight.date.month,
                  flight.date.day,
                  flight.direct ? 'direct' : 'nondirect'
                ]));
              }
              var stay = qStay.decode(Status.search.stay);

              var param = {
                backurl: location.href,
                operate: 'union',
                adt: adult,
                chd: child,
                ins: ins,
                inf: traveler.baby - ins,
                referer: referer || document.referrer,
                sessionkey1: result.sessionkey,
                sessionkey2: sessionKey2,
                chkin: stay.from.year + ('00'+stay.from.month).slice(-2) + ('00'+stay.from.day).slice(-2),
                chkout: stay.to.year + ('00'+stay.to.month).slice(-2) + ('00'+stay.to.day).slice(-2),
                hotelid: detail.hotelid,
                roomTypeCode: hotelDetail.roomTypeCode,
                rateCode: room.rateCode,
                rateKey: room.rateKey,
                url: document.referrer,
                route: routes.join('|'),
                package: 'Y',
              };

              var room = qRoom.decode(Status.search.room);
              for (var rIdx=0; rIdx < room.length; rIdx++){
                param['adtN_'+rIdx] = room[rIdx].adult;
                param['chdN_'+rIdx] = room[rIdx].children.length;
                if (0 < room[rIdx].children.length){
                  for (var cIdx=0; cIdx < room[rIdx].children.length; cIdx++){
                    // 子供の年齢
                    param['chdN_'+rIdx+'_'+cIdx] = room[rIdx].children[cIdx];
                  }
                }
              }

              //console.log('DPホテル予約パラメータ');
              //console.log(param);
              $('<form/>')
              .attr({
                method: 'POST',
                action: SETTINGS.TOUR.RESERVATION + '?' + $.param(param)
              })
              .appendTo(document.body).submit();
              //.trigger('submit');
            });
            // XXX ホテル詳細エラー
            $('#js-modal-loading').hide();
            $(this).removeClass('is-disable');
          } else {
            // FIXME: Error
            var errors = {
              OTAD0001:	'JSON/XMLの形式が不正',
              OTAD0002: 'セッションタイムアウト',
              OTAD0003: '指定商品番号なし',
              OTAD0004: '空席なし',
              OTAD0005: '販売終了',
              OTAD0006: '空室なし',
              OTAD0007: '該当ホテルなし',
              OTAD0008: '販売不可',
              OTAD0009: '検索結果該当なし',
              OTAI0001: 'OriginDestination未指定',
              OTAI0002: 'OriginDestinationがMAX以上',
              OTAI0003: '大人人数不正',
              OTAI0004: '幼児人数不正',
              OTAI0005: '合計人数不正',
              OTAI0006: '出発日不正',
              OTAI0007: '出発地未指定',
              OTAI0008: '目的地未指定',
              OTAI0009: '商品コード不備',
              OTAI0010: 'チェックイン日不正',
              OTAI0011: 'チェックアウト日不正',
              OTAI0012: '宿泊日数不正',
              OTAI0013: '宿泊人数未指定',
              OTAI0014: '宿泊エリア未指定',
              OTAI0015: 'ホテル未指定',
              OTAN0001: '外部API通信エラー',
              OTAN0002: '外部APIレスポンスエラー(リトライ不可)',
              OTAN0003: '外部APIレスポンスエラー(リトライ可)',
              OTAN0004: '内部エラー(リトライ不可)',
              OTAN0005: '内部エラー(リトライ可)'
            };
            Func.error('エラーが発生しました : ' + errors[result.code], true);
            //Func.debug(errors[result.code]);
            $(this).removeClass('is-disable');
          }
        });
        return false;
      });
    };

    return methods;
  })();

  if (outerType === 'air') {
      Air.bindAirline();
      Air.bindAirport();
      Air.bindSearch();
      Calendar.bindUpdate();
      Air.embedConditions();
      //Air.startingForm();
  }
  if (outerType === 'hotel') {
      Hotel.bindAirport();
      Hotel.bindSearch();
      Calendar.bindUpdate();
      Hotel.embedConditions();
  }
  if (outerType === 'tour') {
      Air.bindAirline();
      Air.bindAirport();
      Tour.bindSearch();
      Calendar.bindUpdate();
      Air.embedConditions();
      Hotel.embedConditions();
  }


  Status.referer && Func.storage('referer', Status.referer);

  // モーダルを閉じる共通処理
  $('.js-close-modal').on('click', function() {
   if($('body').hasClass('is-modal-open')){
     $('body').removeClass('is-modal-open')
   }
  });
  $('.js-modal').on('click', function(e) {
    if ($(e.target).hasClass('js-modal')){
      $('.js-close-modal').trigger('click');
    }
  });

  // FIXME: Debug code
  $(document).on('click', 'a', function() {
    //Func.debug(this);
    return $(this).attr('href') !== '#';
  });
  Func.debug(Status);
});
