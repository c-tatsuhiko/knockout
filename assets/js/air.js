$(function () {
    $("#header").load("/header/header.html");
})

//詳細オプションクリック時
var viewModel = function () {
    var flg = "default";
    this.myHandler = function () {
        $('#accordion').slideToggle("fast");

        //jQueryで実装
        if (flg == "default") {
            $('#DetailOption').text("－");
            flg = "change";
        } else {
            $('#DetailOption').text("＋");
            flg = "default";

        }

        //knockoutで実装

    }
};
ko.applyBindings(new viewModel);