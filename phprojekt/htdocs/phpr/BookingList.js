define([
    'dojo/_base/array',
    'dojo/_base/declare',
    'dijit/_WidgetBase',
    'dijit/_TemplatedMixin',
    'dijit/_WidgetsInTemplateMixin',
    'dojo/date/locale',
    'dojo/html',
    'dojo/json',
    'dojo/when',
    'dojo/store/JsonRest',
    'dojo/store/Memory',
    'dojo/store/Observable',
    'dojo/store/Cache',
    'dojo/date',
    'dojo/dom-construct',
    'phpr/BookingList/DayBlock',
    'phpr/JsonRestQueryEngine',
    'dojo/_base/lang',
    'phpr/Timehelper',
    //templates
    'dojo/text!phpr/template/bookingList.html',
    // only used in templates
    'phpr/BookingList/BookingCreator',
    'dijit/form/FilteringSelect',
    'dijit/form/Textarea',
    'dijit/form/Button',
    'dijit/form/DateTextBox',
    'dijit/form/Form',
    'phpr/DateTextBox'
], function(array, declare, _WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin, locale, html, json, when, JsonRest,
            Memory, Observable, Cache, date, domConstruct, DayBlock, JsonRestQueryEngine, lang, timehelper,
            bookingListTemplate) {
    return declare([_WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin], {
        store: null,

        date: new Date(),

        templateString: bookingListTemplate,

        observer: null,

        data: null,

        day2dayBlock: null,

        constructor: function() {
            this._setStoreAttr(new JsonRest({
                target: 'index.php/Timecard/Timecard/',
                queryEngine: JsonRestQueryEngine
            }));

            this.data = [];

            this.day2dayBlock = {};
        },

        startup: function() {
            this.inherited(arguments);
            this._update();
        },

        _setStoreAttr: function(store) {
            this.store = new Observable(new Cache(
                store,
                new Memory()
            ));

            this._update();
        },

        _setDateAttr: function(date) {
            var monthChanged = (!this._started ||
                    (date.getFullYear() !== this.date.getFullYear() || date.getMonth() !== this.date.getMonth()));
            this.date = date;
            this.bookingCreator.set('date', date);
            if (monthChanged) {
                this._update();
            }
        },

        _updating: false,

        _update: function() {
            if (this._updating || !this._started) {
                return;
            }

            this._updating = true;

            this.bookingCreator.set('store', this.store);

            if (this.observer) {
                this.observer.cancel();
                this.observer = null;
            }

            var results = this.store.query(
                {filter: this._getQueryString()},
                {sort: [{attribute: 'start_datetime', descending: true}]}
            );

            when(results, lang.hitch(this, function(data) {
                var bookingsByDay = this._partitionBookingsByDay(data);

                this.data = lang.clone(data);

                domConstruct.empty(this.content);
                this.day2dayBlock = {};

                this._addBookingsPartitionedByDay(bookingsByDay);
                this._updating = false;
            }));

            this.observer = results.observe(lang.hitch(this, '_storeChanged'), true);
        },

        _storeChanged: function(object, removedFrom, insertedInto) {
            object = lang.clone(object);
            var newDate = timehelper.datetimeToJsDate(object.startDatetime);

            if (removedFrom > -1) {
                var originalDate = timehelper.datetimeToJsDate(this.data[removedFrom].startDatetime);
                this.data.splice(removedFrom, 1);
                if (date.compare(newDate, originalDate, 'date') !== 0) {
                    this._reloadDay(originalDate);
                }
            }

            if (insertedInto > -1) {
                this.data.splice(insertedInto, 0, object);
            }

            this._reloadDay(newDate, newDate);
        },

        _reloadDay: function(startDatetime, highlightDate) {
            var ddate = new Date(startDatetime.getFullYear(), startDatetime.getMonth(), startDatetime.getDate());

            var results = this.store.query({filter: this._getQueryString(ddate, date.add(ddate, 'day', 1))});
            when(results, lang.hitch(this, function(data) {
                var entry = this.day2dayBlock[ddate.getTime()];
                if (entry && entry.widget) {
                    entry.widget.destroyRecursive();
                    delete this.day2dayBlock[ddate.getTime()];
                }

                var partitions = this._partitionBookingsByDay(data);
                if (highlightDate) {
                    array.some(partitions, function(partition) {
                        return array.some(partition.bookings, function(b) {
                            var ret = date.compare(timehelper.datetimeToJsDate(b.startDatetime), highlightDate) === 0;
                            if (ret) {
                                b.highlight = true;
                            }

                            return ret;
                        });
                    });
                }
                this._addBookingsPartitionedByDay(partitions);
            }));
        },

        _addBookingsPartitionedByDay: function(bookingsByDay) {
            array.forEach(bookingsByDay, this._addDayBlock, this);
            this._reorderDayWidgets();
        },

        _addDayBlock: function(params) {
            var entry = this.day2dayBlock[params.day.getTime()];
            if (entry && entry.widget) {
                entry.widget.destroyRecursive();
                delete this.day2dayBlock[params.day.getTime()];
            }

            params.store = this.store;
            widget = new DayBlock(params);
            widget.placeAt(this.content);
            this.own(widget);
            this.day2dayBlock[params.day.getTime()] = {
                widget: widget,
                placed: false
            };
        },

        _getQueryString: function(start, end) {
            if (!start) {
                start = this.date || new Date();
                start = new Date(start.getFullYear(), start.getMonth(), 1);
            }
            end = end || date.add(start, 'month', 1);

            return json.stringify({
                startDatetime: {
                    '!ge': timehelper.jsDateToIsoDatetime(start),
                    '!lt': timehelper.jsDateToIsoDatetime(end)
                }
            });
        },

        _partitionBookingsByDay: function(bookings) {
            var partitions = {};
            array.forEach(bookings, function(b) {
                var start = timehelper.datetimeToJsDate(b.startDatetime),
                    day = new Date(
                    start.getFullYear(),
                    start.getMonth(),
                    start.getDate()
                );
                partitions[day] = partitions[day] || [];
                partitions[day].push(b);
            });

            var ret = [];
            for (var day in partitions) {
                ret.push({
                    day: new Date(day),
                    bookings: partitions[day]
                });
            }

            return ret;
        },

        _reorderDayWidgets: function() {
            var entries = [];

            for (var timestamp in this.day2dayBlock) {
                entries.push({
                    ts: timestamp,
                    entry: this.day2dayBlock[timestamp]
                });
            }

            entries.sort(function(a, b) {
                return parseInt(b.ts, 10) > parseInt(a.ts, 10);
            });

            array.forEach(entries, function(e, index, a) {
                if (e.entry.placed === false) {
                    var w = e.entry.widget;
                    if (index === 0) {
                        w.placeAt(this.content, 'first');
                    } else if (index === a.length - 1) {
                        w.placeAt(this.content, 'last');
                    } else {
                        w.placeAt(a[index - 1].entry.widget, 'after');
                    }
                    e.entry.placed = true;
                    if (index < 2) {
                        w.set('open', true);
                    }
                }
            }, this);
        }
    });
});
