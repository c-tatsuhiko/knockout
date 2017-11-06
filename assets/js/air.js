$(function () {
    $("#header").load("/header/header.html");
})

var viewModel = function () {
    this.myHandler = function () {
        alert("test");
    }
};
ko.applyBindings(viewModel);