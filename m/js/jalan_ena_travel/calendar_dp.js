var mode = '';
var total_year = [];
var total_month = [];
var total_hiniti = [];
var total_youbi = [];
var total_canselect = [];
var total_tsukigawari = [];
var total_tsukigawari_idx = [];

// 本日から選択出来る日数
var canselect_days = 330;
// 現地発を選択してからカレンダーが閉じる時間
var delay_time = 500;
// スクロールされる量
var scroll_position = 130;

//出発の文言
var hotel_departure_name = "ﾁｪｯｸｲﾝを選択してください";
//現地発の文言
var hotel_arrival_name = "ﾁｪｯｸｱｳﾄを選択してください";
//出発のバルーン文言
var hotel_name_in = "ﾁｪｯｸｲﾝ";
//現地発のバルーン文言
var hotel_name_out = "ﾁｪｯｸｱｳﾄ";

//出発の文言
var air_departure_name = "出発日を選択してください";
// 現地発の文言
var air_arrival_name = "現地出発日を選択してください";
// 出発のバルーン文言
var air_name_in = "出発日";
// 現地発のバルーン文言
var air_name_out = "現地発";

// 出発の文言
var departure_name = air_departure_name;
// 現地発の文言
var arrival_name = air_arrival_name;
// 出発のバルーン文言
var name_in = air_name_in;
// 現地発のバルーン文言
var name_out = air_name_out;

// 初期表示でスクロールさせるフラグと値
/*var first_scroll_flg = false;*/
var first_scroll_val = 20;

var cantselectcolor = "#DCDCDC";
var selectedcolor = "#C8E0FA";
var arrival_col = "#FF6C00";
var departure_col = "#019BFF";
var holiday_color = "#FF6C00";
var sunday_color = "#FF6C00";
var saturday_color = "#FF6C00";
var weekday_color = "#355577";
var calendar_validation_bg_color = "#C8E0FA";
var dep_arr_samecell_color = "#89c0fa";
var tsukigawari_a_color = "#FFFFFF";
var tsukigawari_b_color = "#FFFFFF";


// タイムゾーンが現地時間での値を取得
var date = new Date();
var this_year = date.getFullYear();//今年
var this_month = date.getMonth()+1;//今月
var this_day = date.getDate();//今日

// 今月の一日の前にスキップする数
var date_tsuitachi = new Date(this_year+"/"+this_month+"/1");
var first_skip = date_tsuitachi.getDay();
first_skip = first_skip - 1;

// 検索日の前月の最終日を取得（6なら30、2なら29など）
var copied_month = -1;
var copied_year = -1;
if(this_month == 1){
    copied_month = 12;
    copied_year = this_year - 1;
}else{
    copied_month = this_month - 1;
    copied_year = this_year;
}
var dateforlastday = new Date(copied_year,copied_month,0);
var lastday = dateforlastday.getDate();

// 検索日の前月の始まる日にち
var first_skip_startday = lastday - first_skip;


// 検索日の前月の終わりの方を配列に代入（29,30,31...という感じ）
var day_count = 0;
for(var i=first_skip_startday;i<=lastday;i++){
    total_hiniti[day_count] = i;
    total_month[day_count] = copied_month;
    total_year[day_count] = copied_year;
    total_canselect[day_count] = -1;
    day_count++;
}


// 検索日（今日）の前日までを配列に代入（今日が30日なら、29日までを代入）
for(var i=1;i<this_day;i++){
    total_hiniti[day_count] = i;
    total_month[day_count] = this_month;
    total_year[day_count] = this_year;
    total_canselect[day_count] = -1;
    day_count++;
}


// 検索日（今日）から330日後までを配列に代入
copied_year = this_year;
copied_month = this_month;
var copied_day = this_day;
var hiniti_len = total_hiniti.length;
var canselect_count = canselect_days + hiniti_len + 1;
dateforlastday = new Date(copied_year,copied_month,0);// 年月切替処理用
lastday = dateforlastday.getDate();// 年月切替処理用
for(var i=hiniti_len;i<canselect_count;i++){
    total_hiniti[i] = copied_day;
    total_month[i] = copied_month;
    total_year[i] = copied_year;
    total_canselect[i] = 1;

    // 年月切替処理
    if(copied_day >=lastday){
        copied_day = 1;
        copied_month = copied_month + 1;
        if(copied_month > 12){
            copied_year = copied_year + 1;
            copied_month = 1;
        }
        dateforlastday = new Date(copied_year,copied_month,0);
        lastday = dateforlastday.getDate();
    }else{
        copied_day++;
    }
}


// カレンダー最終月の日にちを取得
dateforlastday = new Date(copied_year,copied_month,0);// 年月切替処理用
lastday = dateforlastday.getDate();// 年月切替処理用

// カレンダー331日目～最終月最終日までの日にちを取得
hiniti_len = total_hiniti.length;
var remaining_days = lastday - total_hiniti[hiniti_len-1];

// カレンダー331日目～最終月最終日までを配列に代入
for(var i=hiniti_len;i<hiniti_len+remaining_days;i++){
    total_hiniti[i] = copied_day;
    total_month[i] = copied_month;
    total_year[i] = copied_year;
    total_canselect[i] = -1;
    copied_day++;
}


// 曜日配列を作成
hiniti_len = total_hiniti.length;
var youbi_count = 0;
for(var i=0;i<hiniti_len;i++){
    if(youbi_count>6){
        youbi_count = 0;
    }
    if(youbi_count == 0){
        total_youbi[i] = "sun";
    }else if(youbi_count == 1){
        total_youbi[i] = "mon";
    }else if(youbi_count == 2){
        total_youbi[i] = "tue";
    }else if(youbi_count == 3){
        total_youbi[i] = "wed";
    }else if(youbi_count == 4){
        total_youbi[i] = "thu";
    }else if(youbi_count == 5){
        total_youbi[i] = "fri";
    }else if(youbi_count == 6){
        total_youbi[i] = "sat";
    }

    youbi_count++;
}


// カレンダー最終月の次の月(6日間以内)を割り出すために、曜日の配列を整えておく
for(var i=hiniti_len;i<hiniti_len+7;i++){
    var last_youbi = total_youbi[i-1];

    if(last_youbi == "sun"){
        total_youbi[i] = "mon";
    }else if(last_youbi == "mon"){
        total_youbi[i] = "tue";
    }else if(last_youbi == "tue"){
        total_youbi[i] = "wed";
    }else if(last_youbi == "wed"){
        total_youbi[i] = "thu";
    }else if(last_youbi == "thu"){
        total_youbi[i] = "fri";
    }else if(last_youbi == "fri"){
        total_youbi[i] = "sat";
        break;
    }
}


// カレンダー最終月の次の月(6日間以内)を配列に代入
var youbi_len = total_youbi.length;
copied_day = 1;
if(copied_month == 12){
    copied_month = 1;
    copied_year = copied_year + 1;
}else{
    copied_month = copied_month + 1;
}
for(var i=hiniti_len;i<youbi_len;i++){
    total_hiniti[i] = copied_day;
    total_month[i] = copied_month;
    total_year[i] = copied_year;
    total_canselect[i] = -1;
    copied_day++;
}


// スクロール位置を取得するためにデータを整える
var saved_old_month = -1;
var saved_old_month_idx = -1;
var month_idx_count = 0;
for(var i=0;i<youbi_len;i++){
    if(saved_old_month != total_month[i]){
        saved_old_month = total_month[i];
        saved_old_month_idx = i;
        total_tsukigawari_idx[month_idx_count] = i;
        month_idx_count++;
    }
    total_tsukigawari[i] = saved_old_month_idx;
}


// カレンダー部分のhtmlを生成
var cellbgcol;
function first_loading(){
    var td_count = 1;
    var calendar_html ="";
    var calendar_html ="<table>";
    for(var i=0;i<youbi_len;i++){
        var holiday_flg = false;
        var holiday = total_month[i] + "/" + total_hiniti[i];
        var holiday_len = days_kyujitsu.length;
        for(var j=0;j<holiday_len;j++){
            if(days_kyujitsu[j] == holiday){
                holiday_flg = true;
                break;
            }
        }


        // カレンダーの背景色
        cellbgcol = tsukigawari_a_color;

        // 日曜日
        if(td_count == 1){
            if(total_canselect[i] > 0){
                if(holiday_flg){
                    if(total_hiniti[i] == 1){
                        calendar_html += "<tr><td class='calendar_cell' style='font-weight:bold;color:"+holiday_color+";background-color:"+cellbgcol+"'><div class='td_relative'><div class='td_departure'>"+name_in+"</div><div class='td_arrival'>"+name_out+"</div>"+total_month[i]+"月<br>"+total_hiniti[i]+"</td>";
                    }else{
                        calendar_html += "<tr><td class='calendar_cell' style='color:"+holiday_color+";background-color:"+cellbgcol+"'><div class='td_relative'><div class='td_departure'>"+name_in+"</div><div class='td_arrival'>"+name_out+"</div>"+total_hiniti[i]+"</td>";
                    }
                }else{
                    if(total_hiniti[i] == 1){
                        calendar_html += "<tr><td class='calendar_cell' style='font-weight:bold;color:"+sunday_color+";background-color:"+cellbgcol+"'><div class='td_relative'><div class='td_departure'>"+name_in+"</div><div class='td_arrival'>"+name_out+"</div>"+total_month[i]+"月<br>"+total_hiniti[i]+"</td>";
                    }else{
                        calendar_html += "<tr><td class='calendar_cell' style='color:"+sunday_color+";background-color:"+cellbgcol+"'><div class='td_relative'><div class='td_departure'>"+name_in+"</div><div class='td_arrival'>"+name_out+"</div>"+total_hiniti[i]+"</td>";
                    }
                }
            }else{
                if(total_hiniti[i] == 1){
                    calendar_html += "<tr><td class='calendar_cell' style='font-weight:bold;color:"+cantselectcolor+";background-color:"+cellbgcol+"'><div class='td_relative'><div class='td_departure'>"+name_in+"</div><div class='td_arrival'>"+name_out+"</div>"+total_month[i]+"月<br>"+total_hiniti[i]+"</td>";
                }else{
                    calendar_html += "<tr><td class='calendar_cell' style='color:"+cantselectcolor+";background-color:"+cellbgcol+"'><div class='td_relative'><div class='td_departure'>"+name_in+"</div><div class='td_arrival'>"+name_out+"</div>"+total_hiniti[i]+"</td>";
                }
            }

        // 土曜日
        }else if(td_count == 7){
            if(total_canselect[i] > 0){
                if(holiday_flg){
                    if(total_hiniti[i] == 1){
                        calendar_html += "<td class='calendar_cell' style='font-weight:bold;color:"+holiday_color+";background-color:"+cellbgcol+"'><div class='td_relative'><div class='td_departure'>"+name_in+"</div><div class='td_arrival'>"+name_out+"</div>"+total_month[i]+"月<br>"+total_hiniti[i]+"</td></tr>";
                    }else{
                        calendar_html += "<td class='calendar_cell' style='color:"+holiday_color+";background-color:"+cellbgcol+"'><div class='td_relative'><div class='td_departure'>"+name_in+"</div><div class='td_arrival'>"+name_out+"</div>"+total_hiniti[i]+"</td></tr>";
                    }
                }else{
                    if(total_hiniti[i] == 1){
                        calendar_html += "<td class='calendar_cell' style='font-weight:bold;color:"+saturday_color+";background-color:"+cellbgcol+"'><div class='td_relative'><div class='td_departure'>"+name_in+"</div><div class='td_arrival'>"+name_out+"</div>"+total_month[i]+"月<br>"+total_hiniti[i]+"</td></tr>";
                    }else{
                        calendar_html += "<td class='calendar_cell' style='color:"+saturday_color+";background-color:"+cellbgcol+"'><div class='td_relative'><div class='td_departure'>"+name_in+"</div><div class='td_arrival'>"+name_out+"</div>"+total_hiniti[i]+"</td></tr>";
                    }
                }

            }else{
                if(total_hiniti[i] == 1){
                    calendar_html += "<td class='calendar_cell' style='font-weight:bold;color:"+cantselectcolor+";background-color:"+cellbgcol+"'><div class='td_relative'><div class='td_departure'>"+name_in+"</div><div class='td_arrival'>"+name_out+"</div>"+total_month[i]+"月<br>"+total_hiniti[i]+"</td></tr>";
                }else{
                    calendar_html += "<td class='calendar_cell' style='color:"+cantselectcolor+";background-color:"+cellbgcol+"'><div class='td_relative'><div class='td_departure'>"+name_in+"</div><div class='td_arrival'>"+name_out+"</div>"+total_hiniti[i]+"</td></tr>";
                }
            }

            td_count = 0;

        // 平日
        }else{
            if(total_canselect[i] > 0){
                if(holiday_flg){
                    if(total_hiniti[i] == 1){
                        calendar_html += "<td class='calendar_cell' style='font-weight:bold;color:"+holiday_color+";background-color:"+cellbgcol+"'><div class='td_relative'><div class='td_departure'>"+name_in+"</div><div class='td_arrival'>"+name_out+"</div>"+total_month[i]+"月<br>"+total_hiniti[i]+"</td>";
                    }else{
                        calendar_html += "<td class='calendar_cell' style='color:"+holiday_color+";background-color:"+cellbgcol+"'><div class='td_relative'><div class='td_departure'>"+name_in+"</div><div class='td_arrival'>"+name_out+"</div>"+total_hiniti[i]+"</td>";
                    }
                }else{
                    if(total_hiniti[i] == 1){
                        calendar_html += "<td class='calendar_cell' style='font-weight:bold;color:"+weekday_color+";background-color:"+cellbgcol+"'><div class='td_relative'><div class='td_departure'>"+name_in+"</div><div class='td_arrival'>"+name_out+"</div>"+total_month[i]+"月<br>"+total_hiniti[i]+"</td>";
                    }else{
                        calendar_html += "<td class='calendar_cell' style='color:"+weekday_color+";background-color:"+cellbgcol+"'><div class='td_relative'><div class='td_departure'>"+name_in+"</div><div class='td_arrival'>"+name_out+"</div>"+total_hiniti[i]+"</td>";
                    }
                }
            }else{
                if(total_hiniti[i] == 1){
                    calendar_html += "<td class='calendar_cell' style='font-weight:bold;color:"+cantselectcolor+";background-color:"+cellbgcol+"'><div class='td_relative'><div class='td_departure'>"+name_in+"</div><div class='td_arrival'>"+name_out+"</div>"+total_month[i]+"月<br>"+total_hiniti[i]+"</td>";
                }else{
                    calendar_html += "<td class='calendar_cell' style='color:"+cantselectcolor+";background-color:"+cellbgcol+"'><div class='td_relative'><div class='td_departure'>"+name_in+"</div><div class='td_arrival'>"+name_out+"</div>"+total_hiniti[i]+"</td>";
                }
            }
        }
        td_count++;
    }

    return(calendar_html);
}


// セルの初期化
function init(){
    var hiniti_len = total_hiniti.length;
    $('.td_departure').css({display:'none'});
    $('.td_arrival').css({display:'none'});

    for(var i=0;i<hiniti_len;i++){

        switch(total_month[i]){
            case 1: cellbgcol = tsukigawari_a_color; break;
            case 2: cellbgcol = tsukigawari_b_color; break;
            case 3: cellbgcol = tsukigawari_a_color; break;
            case 4: cellbgcol = tsukigawari_b_color; break;
            case 5: cellbgcol = tsukigawari_a_color; break;
            case 6: cellbgcol = tsukigawari_b_color; break;
            case 7: cellbgcol = tsukigawari_a_color; break;
            case 8: cellbgcol = tsukigawari_b_color; break;
            case 9: cellbgcol = tsukigawari_a_color; break;
            case 10: cellbgcol = tsukigawari_a_color; break;
            case 11: cellbgcol = tsukigawari_b_color; break;
            case 12: cellbgcol = tsukigawari_a_color; break;
            default : cellbgcol = tsukigawari_a_color; break;
        }


        var holiday_flg = false;
        var holiday = total_month[i] + "/" + total_hiniti[i];
        var holiday_len = days_kyujitsu.length;
        for(var j=0;j<holiday_len;j++){
            if(days_kyujitsu[j] == holiday){
                holiday_flg = true;
                break;
            }
        }
        if(total_canselect[i] > 0){
            if(total_youbi[i] == "sun"){
                if(holiday_flg){
					$('.calendar_cell').eq(i).css({color:holiday_color,backgroundColor:cellbgcol,backgroundImage:'none'});
				}else{
					$('.calendar_cell').eq(i).css({color:sunday_color,backgroundColor:cellbgcol,backgroundImage:'none'});
				}
			}else if(total_youbi[i] == "sat"){
                if(holiday_flg){
					$('.calendar_cell').eq(i).css({color:holiday_color,backgroundColor:cellbgcol,backgroundImage:'none'});
				}else{
					$('.calendar_cell').eq(i).css({color:saturday_color,backgroundColor:cellbgcol,backgroundImage:'none'});
				}
			}else{
                if(holiday_flg){
					$('.calendar_cell').eq(i).css({color:holiday_color,backgroundColor:cellbgcol,backgroundImage:'none'});
				}else{
					$('.calendar_cell').eq(i).css({color:weekday_color,backgroundColor:cellbgcol,backgroundImage:'none'});
				}
			}
        }else{
            $('.calendar_cell').eq(i).css({color:cantselectcolor,backgroundColor:cellbgcol,backgroundImage:'none'});
        }
    }
}

// 出発日をタップしたら、その前の日にちの色を変更する
function cant_select_color(idx){
    for(var i=0;i<idx;i++){
        $('.calendar_cell').eq(i).css({color:cantselectcolor});
    }
}

// COM:クリック処理
/*
var start_end_flg = true;
var saved_start = -1;
var saved_end = -1;
var open_calendar_scroll_val = -1;
*/

function click_cell(idx){
    if(start_end_flg[clicked_calendarbtn_index]){
        init();
        $('.calendar_cell').eq(idx).css({color:'#FFF',backgroundImage:'url(images/select_start.png)',backgroundSize:'100% 100%'});
        $('.td_departure').eq(idx).css({display:'block'});
        $('#calendar_validation').slideUp(200,function(){
            $(this).html(arrival_name);
            //$(this).css({backgroundColor:calendar_validation_bg_color});
            $(this).slideDown(200);
        });


        // タップしたセルの位置が一番上にある場合は、「出発日」が見えるようにスクロールさせる
        var cell_offset = $('.calendar_cell').eq(idx).offset().top;
        //var scroll_cell_offset = cell_offset + $('#calendar').scrollTop()-1000;
        var scroll_cell_offset = cell_offset + $('#calendar').scrollTop()-160;
        if(cell_offset<=145){
            title_scroll(scroll_cell_offset);
        }

        cant_select_color(idx);

        saved_start[clicked_calendarbtn_index] = idx;
        open_calendar_scroll_val[clicked_calendarbtn_index] = $('.calendar_cell').eq(total_tsukigawari[saved_start[clicked_calendarbtn_index]]).offset().top;
        open_calendar_scroll_val[clicked_calendarbtn_index] = open_calendar_scroll_val[clicked_calendarbtn_index] + $('#calendar').scrollTop() - scroll_position - 50;
        start_end_flg[clicked_calendarbtn_index] = false;

    }else{
        if(idx < saved_start[clicked_calendarbtn_index]){
            return 0;
        }

        $('#calendar_wrapper_overlayer').fadeIn(1);
        if(idx != saved_start[clicked_calendarbtn_index]){
            $('.calendar_cell').eq(idx).css({color:'#FFF',backgroundImage:'url(images/select_end.png)',backgroundSize:'100% 100%'});
            saved_end[clicked_calendarbtn_index] = idx;
            cell_to_gray(-1);
        }else{
            $('.calendar_cell').eq(idx).css({color:'#FFF',backgroundImage:'none',backgroundColor:dep_arr_samecell_color});
            saved_end[clicked_calendarbtn_index] = idx;
		}
        $('.td_arrival').eq(idx).css({display:'block'});
        $('#calendar_body').delay(delay_time).fadeOut(1,function(){
            $('#calendar_validation').html(departure_name);
            //$('#calendar_validation').css({backgroundColor:calendar_validation_bg_color});
            $('#calendar_wrapper_overlayer').fadeOut(1);
            $('#calendar_wrapper_underlayer').fadeOut(1);
        });

        var start_dweek = "";
        var end_dweek = "";
        switch (total_youbi[saved_start[clicked_calendarbtn_index]]) {
            case "sun":
                start_dweek = "日";
                break;
            case "mon":
                start_dweek = "月";
                break;
            case "tue":
                start_dweek = "火";
                break;
            case "wed":
                start_dweek = "水";
                break;
            case "thu":
                start_dweek = "木";
                break;
            case "fri":
                start_dweek = "金";
                break;
            case "sat":
                start_dweek = "土";
                break;
        }
        switch (total_youbi[saved_end[clicked_calendarbtn_index]]) {
            case "sun":
                end_dweek = "日";
                break;
            case "mon":
                end_dweek = "月";
                break;
            case "tue":
                end_dweek = "火";
                break;
            case "wed":
                end_dweek = "水";
                break;
            case "thu":
                end_dweek = "木";
                break;
            case "fri":
                end_dweek = "金";
                break;
            case "sat":
                end_dweek = "土";
                break;
        }

        //var display_to_calendardisplayinput = total_year[saved_start[clicked_calendarbtn_index]]+"年"+total_month[saved_start[clicked_calendarbtn_index]]+"月"+total_hiniti[saved_start[clicked_calendarbtn_index]]+"日("+start_dweek+")～"+total_year[saved_end[clicked_calendarbtn_index]]+"年"+total_month[saved_end[clicked_calendarbtn_index]]+"月"+total_hiniti[saved_end[clicked_calendarbtn_index]]+"日("+end_dweek+")";
        //$('.calendar_nittei').eq(clicked_calendarbtn_index).html(display_to_calendardisplayinput);
        start_end_flg[clicked_calendarbtn_index] = true;

        $('.calendar_nittei').eq(clicked_calendarbtn_index).trigger('update', {
            from: {
                year: total_year[saved_start[clicked_calendarbtn_index]],
                month: total_month[saved_start[clicked_calendarbtn_index]],
                day: total_hiniti[saved_start[clicked_calendarbtn_index]]
            },
            to: {
                year: total_year[saved_end[clicked_calendarbtn_index]],
                month: total_month[saved_end[clicked_calendarbtn_index]],
                day: total_hiniti[saved_end[clicked_calendarbtn_index]]
            }
        });
    }
}




// start～endの間をグレーにする
function cell_to_gray(num){
    for(var i=saved_start[clicked_calendarbtn_index];i<=saved_end[clicked_calendarbtn_index];i++){
        $('.calendar_cell').eq(i).css({backgroundColor:selectedcolor});
    }
    if(num>0){
        $('.calendar_cell').eq(saved_start[clicked_calendarbtn_index]).css({color:'#FFF',backgroundImage:'url(images/select_start.png)',backgroundSize:'100% 100%'});
        $('.calendar_cell').eq(saved_end[clicked_calendarbtn_index]).css({color:'#FFF',backgroundImage:'url(images/select_end.png)',backgroundSize:'100% 100%'});
        $('.td_departure').eq(saved_start[clicked_calendarbtn_index]).css({display:'block'});
        $('.td_arrival').eq(saved_end[clicked_calendarbtn_index]).css({display:'block'});
    }
}


// NOTE:スクロール処理
function title_scroll(obj_y){
    $('#calendar').animate({
        scrollTop:obj_y
    }, 400);

    return false;
}

function cout_class_flightCalendar(){
    $('.flight-calendar').each
}














var clicked_calendarbtn_index = -1;
var first_scroll_flg = [];
var start_end_flg = [];
var saved_start = [];
var saved_end = [];
var open_calendar_scroll_val = [];
var first_scroll_flg_len = $('.flight-calendar').length;//カレンダーを表示させるボタンの数
for(var i=0;i<first_scroll_flg_len;i++){
    first_scroll_flg[i] = false;
    start_end_flg[i] = true;
    saved_start[i] = -1;
    saved_end[i] = -1;
    open_calendar_scroll_val[i] = -1;
}







$(window).load(function(){




    var calendar_html = '';


    // カレンダーセルのクリック処理
    $(document).on('click','.calendar_cell',function(){
        var this_index = $('.calendar_cell').index(this);
        if(total_canselect[this_index] > 0){

            click_cell(this_index);
        }
    });

    // カレンダー表示処理
    $('.flight-calendar').on('click',function(){
        mode = '';
        departure_name = air_departure_name;
        arrival_name = air_arrival_name;
        name_in = air_name_in;
        name_out = air_name_out;
        if (true === $(this).hasClass('hoteloptioncalendar')){
            mode = 'hotel';
            departure_name = hotel_departure_name;
            arrival_name = hotel_arrival_name;
            name_in = hotel_name_in;
            name_out = hotel_name_out;
            // フライト日程がまだ未指定ならカレンダーは開けない
            if (1 > $('.search-item.flight-calendar:not(.hoteloptioncalendar) .search-item__data').text().length) {
                $('.search-form__row.hoteloptioncalendar .caution-message').removeClass('is-hidden');
                return;
            }
        }
        $('.search-form__row.hoteloptioncalendar .caution-message').addClass('is-hidden');

        calendar_html = first_loading();
        $('#calendar').html(calendar_html);
        $('#calendar_year').html(total_year[10]+"年"+total_month[10]+"月");
        clicked_calendarbtn_index = $('.flight-calendar').index(this);
        $('#calendar_wrapper_underlayer').fadeIn(1,function(){
            $('#calendar_body').fadeIn(1,function(){
                if(first_scroll_flg[clicked_calendarbtn_index]){
                    // 2回目以降の表示
                    title_scroll(open_calendar_scroll_val[clicked_calendarbtn_index]);
                    init();
                    cell_to_gray(1);
                }else{
                    // 初の表示
                    title_scroll(first_scroll_val);
                    init();
                    first_scroll_flg[clicked_calendarbtn_index] = true;
                }
            });
        });
		return false;
    });



    $('#js-add-flight').click(function(){
        var array_len = first_scroll_flg.length;

        first_scroll_flg[array_len] = first_scroll_flg[array_len-1];
        first_scroll_flg[array_len-1] = false;

        start_end_flg[array_len] = start_end_flg[array_len-1];
        start_end_flg[array_len-1] = true;

        saved_start[array_len] = saved_start[array_len-1];
        saved_start[array_len-1] = -1;

        saved_end[array_len] = saved_end[array_len-1];
        saved_end[array_len-1] = -1;

        open_calendar_scroll_val[array_len] = open_calendar_scroll_val[array_len-1];
        open_calendar_scroll_val[array_len-1] = -1;
    });

	$(document).on('click','.delete-flight',function(){
        var delete_idx = $(this).prev('.flight-num').children('.js-flight-num').html();
        delete_idx = delete_idx - 1;

        first_scroll_flg.splice(delete_idx, 1);
        start_end_flg.splice(delete_idx, 1);
        saved_start.splice(delete_idx, 1);
        saved_end.splice(delete_idx, 1);
        open_calendar_scroll_val.splice(delete_idx, 1);

    });
    /*
	$('.js-delete-flight').on('click',function(i){
        var delete_idx = $('.js-delete-flight').index(this);
        alert(i);
    });
    */

    $('#btn_close').click(function(){
        $('#calendar_body').fadeOut(1);
        $('#calendar_wrapper_underlayer').fadeOut(1);
    });


    // カレンダースクロールした時の「年」「月」の表示切り替え
    var total_tsukigawari_idx_len = total_tsukigawari_idx.length;
    $('#calendar').scroll(function(){
        var scroll_val;
        var scroll_val_idx;
        for(var i=0;i<total_tsukigawari_idx_len;i++){
            scroll_val = $('.calendar_cell').eq(total_tsukigawari_idx[i]).offset().top - 200;

            if(scroll_val < scroll_position){
                $('#calendar_year').html(total_year[total_tsukigawari_idx[i]]+"年"+total_month[total_tsukigawari_idx[i]]+"月");
            }
        }
    });

});






