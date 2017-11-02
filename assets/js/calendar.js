import Moment from 'moment';
import {
    extendMoment
} from 'moment-range';

window['moment-range'].extendMoment(moment);

window.ENA = window.ENA || {};
window.ENA.Calendar = function (state) {
    state = state || {};
    var Calendar = this;

    this.selected = new(function () {
        var _selected = this;
        this.from = ko.observable(null);
        this.to = ko.observable(null);
        this.from.subscribe(function (day) {
            //	Fromがfalsyな値ならToも一緒にリセット
            if (!(day && moment(day) && moment(day).isValid())) {
                _selected.to(null);
            }
        });
    })();

    this.first = ko.observable(state.first && moment(state.first, 'YYYY-MM-DD').isValid() ? new moment(state.first, 'YYYY-MM-DD') : moment());
    this.last = ko.observable(state.last && moment(state.last, 'YYYY-MM-DD').isValid() ? new moment(state.last, 'YYYY-MM-DD') : this.first().clone().add(12, 'M').endOf('month'));
    this.range = ko.computed(function () {
        return moment.range(this.first(), this.last());
    }, this);

    this.Day = function (date) {
        this.moment = ko.observable(date.clone().startOf('day'));
        this.today = ko.computed(function () {
            return this.moment().isSame(moment(), 'day');
        }, this);
        this.past = ko.computed(function () {
            return this.moment().isBefore(Calendar.first(), 'day');
        }, this);
        this.first = ko.computed(function () {
            return this.moment().isSame(Calendar.selected.from(), 'day');
        }, this);
        this.between = ko.computed(function () {
            return this.moment().isBetween(Calendar.selected.from(), Calendar.selected.to(), 'day');
        }, this);
        this.last = ko.computed(function () {
            return this.moment().isSame(Calendar.selected.to(), 'day');
        }, this);
        this.disabled = ko.computed(function () {
            return Calendar.selected.from() && moment(Calendar.selected.from()) && moment(Calendar.selected.from()).isValid() && this.moment().isBefore(Calendar.selected.from(), 'day');
        }, this);
    };

    this.Week = function (first) {
        this.first = ko.observable(first.clone().startOf('week'));
        this.last = ko.observable(first.clone().endOf('week'));
        this.range = ko.computed(function () {
            return moment.range(this.first(), this.last());
        }, this);
        this.days = ko.observableArray(
            Array.from(this.range().by('day')).map(function (day) {
                return new Calendar.Day(day);
            })
        );
    }

    this.Month = function (first) {
        this.first = ko.observable(first.clone().startOf('month'));
        this.last = ko.observable(first.clone().endOf('month'));
        this.range = ko.computed(function () {
            return moment.range(this.first(), this.last())
        }, this);
        this.weeks = ko.observableArray(
            Array.from(
                moment.range(
                    this.first().clone().startOf('week'),
                    this.last().clone().endOf('week')
                ).by('week')
            ).map(function (week) {
                return new Calendar.Week(week);
            })
        );
    }

    this.months = ko.observableArray(
        Array.from(
            this.range().by('month', {
                exclusive: true
            })
        ).map((month) => {
            return new Calendar.Month(month);
        })
    );

    this.onSelect = function (date) {
        if (this.selected.from()) {
            this.selected.to(date);
        } else {
            this.selected.from(date);
        }
    }

    if (state.from && moment(state.from, 'YYYYMMDD') && moment(state.from, 'YYYYMMDD').isValid()) {
        this.selected.from(moment(state.from, 'YYYYMMDD'));
    }
    if (state.to && moment(state.to, 'YYYYMMDD') && moment(state.to, 'YYYYMMDD').isValid()) {
        this.selected.to(moment(state.to, 'YYYYMMDD'));
    }
}