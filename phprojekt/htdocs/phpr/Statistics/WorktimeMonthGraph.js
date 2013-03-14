define([
    'dojo/_base/lang',
    'dojo/_base/declare',
    'dojo/dom-attr',
    'dojo/date/locale',
    'dojo/promise/all',
    'dijit/_Widget',
    'dijit/_TemplatedMixin',
    'phpr/Api',
    'phpr/Timehelper',
    'phpr/models/Timecard',
    'dojo/text!phpr/template/statistics/WorktimeMonthGraph.html',
    'd3/d3.v3.js'
], function(
    lang,
    declare,
    domAttr,
    locale,
    all,
    Widget,
    Templated,
    api,
    timehelper,
    timecardModel,
    templateString
) {

    var maxMinutes = 60 * 15,
        barPadding = 2;

    return declare([Widget, Templated], {
        templateString: templateString,
        baseClass: 'thisMonthDiagram',

        year: (new Date()).getFullYear(),
        month: (new Date()).getMonth(),

        buildRendering: function() {
            this.inherited(arguments);

            this._updateLabels();

            timecardModel.getMonthList().then(lang.hitch(this, function(data) {
                this._renderDays(data.days);
                this._updateUpperLeftRect();
            }));

            timecardModel.getMonthStatistics().then(lang.hitch(this, function(result) {
                var overtime = result.booked.minutesBooked - result.towork.minutesToWork;
                this.overtimeLabel.innerHTML = timehelper.minutesToHMString(overtime) + ' Overtime';
            }), function(err) {
                api.defaultErrorHandler(err);
            });
        },

        _updateLabels: function() {
            var first = new Date(this.year, this.month, 1, 0, 0, 0),
                last = new Date(this.year, this.month + 1, 0, 0, 0, 0);
            this.firstDayLabel.innerHTML = locale.format(first, {selector: 'date', datePattern: 'EEE d'});
            this.lastDayLabel.innerHTML = locale.format(last, {selector: 'date', datePattern: 'EEE d'});
        },

        // Stores the data by day we got from the server for helper functions.
        _days: null,

        _renderDays: function(days) {
            this.days = days;

            var svg = d3.select(this.bookedTimePerDayGraph);
            var svgData = svg.selectAll().data(days);

            svgData.enter()
                .append('svg:rect')
                    .attr('fill', lang.hitch(this, function(d) {
                        return d.sumInMinutes < this._minutesToWork() ? '#b5b5b5' : 'white';
                    }))
                    .attr('x', lang.hitch(this, function(d, i) {
                        return i * (barPadding + this._barWidth());
                    }))
                    .attr('y', lang.hitch(this, function(d) {
                        return Math.min(
                            this._heightForTimebars() - 2,
                            this._heightForTimebars() - this._heightPerMinute() * d.sumInMinutes
                        );
                    }))
                    .attr('width', this._barWidth())
                    .attr('height', lang.hitch(this, function(d) {
                        return Math.max(2, this._heightPerMinute() * d.sumInMinutes);
                    }))
                    .append('svg:title')
                        .text(function(d) {
                            var date = locale.format(timehelper.dateToJsDate(d.date), {selector: 'date'});
                            return date + ' (' + d.sumInHours + ')';
                        });

            var greenBarY = lang.hitch(this, function(d, i) {
                var date = timehelper.dateToJsDate(d.date);
                if (locale.isWeekend(date)) {
                    return this._heightForTimebars();
                }
                return this._heightForMinutesToWork();
            });

            // horizontal lines
            svgData.enter()
                .append('svg:line')
                    .attr('x1', lang.hitch(this, function(d, i) {
                        return i * (barPadding + this._barWidth());
                    }))
                    .attr('x2', lang.hitch(this, function(d, i) {
                        return (i + 1) * (barPadding + this._barWidth());
                    }))
                    .attr('y1', greenBarY)
                    .attr('y2', greenBarY)
                    .attr('stroke', '#6aa700');

            // vertical lines
            svgData.enter()
                .append('svg:line')
                    .attr('x1', lang.hitch(this, function(d, i) {
                        return i * (barPadding + this._barWidth());
                    }))
                    .attr('x2', lang.hitch(this, function(d, i) {
                        return (i) * (barPadding + this._barWidth());
                    }))
                    .attr('y1', function(d, i) {
                        if (i === 0) {
                            return greenBarY(d, i);
                        }
                        return greenBarY(days[i - 1], i - 1);
                    })
                    .attr('y2', greenBarY)
                    .attr('stroke', '#6aa700');

            if (this._onCurrentMonth(this.year, this.month)) {
                var currentDate = (new Date()).getDate();
                svg.append('rect')
                    .attr('x', this._todayX() - 1)
                    .attr('width', 2)
                    .attr('y', 0)
                    .attr('height', this._heightForTimebars())
                    .attr('fill', '#0d639b');
            }

        },

        // Functions below here assume _days is set
        _heightPerMinute: function() {
            return this._heightForTimebars() / maxMinutes;
        },

        _heightForMinutesToWork: function() {
            return this._heightForTimebars() - this._heightPerMinute() * this._minutesToWork();
        },

        _heightForTimebars: function() {
            return domAttr.get(this.bookedTimePerDayGraph, 'height');
        },

        _minutesToWork: function() {
            return 450;
        },

        _displayWidth: function() {
            return domAttr.get(this.bookedTimePerDayGraph, 'width') - 40;
        },

        _barWidth: function() {
            return (this._displayWidth() / this.days.length) - barPadding;
        },

        _onCurrentMonth: function(year, month) {
            var currentYear = (new Date()).getFullYear(),
                currentMonth = (new Date()).getMonth();
            return (year == currentYear && month == currentMonth);
        },

        _onPreviousMonth: function(year, month) {
            var currentYear = (new Date()).getFullYear(),
                currentMonth = (new Date()).getMonth();
            return (year < currentYear || month < currentMonth);
        },

        _todayX: function() {
            return (new Date()).getDate() * (this._barWidth() + barPadding) - (barPadding / 2);
        },

        _updateUpperLeftRect: function() {
            if (this._onCurrentMonth(this.year, this.month)) {
                domAttr.set(this.upperLeftRect, 'height', this._heightForMinutesToWork());
                domAttr.set(this.upperLeftRect, 'width', this._todayX());
            } else if (this._onPreviousMonth(this.year, this.month)) {
                domAttr.set(this.upperLeftRect, 'height', this._heightForMinutesToWork());
                domAttr.set(this.upperLeftRect, 'width', this._displayWidth());
            } else {
                domAttr.set(this.upperLeftRect, 'width', 0);
            }
        }
    });
});

