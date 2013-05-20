define([
    'dojo/_base/declare',
    'dojo/_base/lang',
    'dojo/_base/array',
    'dojo/dom-class',
    'dojo/dom-construct',
    'dojo/promise/all',
    'dojo/json',
    'dojo/io-query',
    'dijit/_Widget',
    'dijit/_TemplatedMixin',
    'dijit/_WidgetsInTemplateMixin',
    'dojo/text!phpr/template/statisticsView.html',
    'dojo/on',
    'dojo/Deferred',
    'phpr/Statistics/WorktimeMonthGraph',
    'phpr/Statistics/WorktimeMonthTable',
    'phpr/ProjectChooser',
    'phpr/models/Project',
    'phpr/Timehelper',
    'dijit/layout/ContentPane',
    'phpr/Statistics/ProjectUserTimeTable'
], function(
    declare,
    lang,
    array,
    clazz,
    domConstruct,
    all,
    json,
    ioQuery,
    Widget,
    Templated,
    WidgetsInTemplate,
    templateString,
    on,
    Deferred,
    monthGraph,
    monthTable,
    projectChooser,
    projects,
    timehelper
) {
    var StatisticsProjectChooser = declare([projectChooser], {
        createOptions: function(queryResults) {
            var def = new Deferred();
            var options = [];

            var first = null;
            var add = function(p) {
                options.push({
                    id: '' + p.id,
                    name: '' + p.id + ' ' + p.title,
                    label: '<span class="projectId">' + p.id + '</span> ' + p.title
                });
            };

            array.forEach(queryResults.recent, add);

            if (queryResults.recent.length > 0) {
                options.push({ label: '<hr/>' });
            }

            options.push({
                id: '-1',
                name: 'All',
                label: 'All'
            });

            for (var p in queryResults.projects) {
                add(queryResults.projects[p]);
            }

            def.resolve(options);

            return def;
        },

        getData: function() {
            return all({
                recent: projects.getRecentProjects(),
                projects: projects.getBookedProjects()
            });
        },

        postStoreSet: function() {
            this.set('value', '-1');
        }
    });

    return declare([Widget, Templated, WidgetsInTemplate], {
        templateString: templateString,
        activeMonthWidget: null,
        monthState: 'graph',
        projectChooser: null,
        _monthUpdateTimer: null,

        buildRendering: function() {
            this.inherited(arguments);

            this.projectChooser = new StatisticsProjectChooser({}, domConstruct.create('select'));
            this.projectChooserContainer.set('content', this.projectChooser);

            this.own(on(this.monthViewGraphBtn, 'click', lang.hitch(this, '_onMonthViewGraph')));
            this.own(on(this.monthViewTableBtn, 'click', lang.hitch(this, '_onMonthViewTable')));
            this.own(on(this.filterBtn, 'click', lang.hitch(this, '_onFilter')));
            this.own(on(this.projectChooser, 'change', lang.hitch(this, '_updateMonthWidget')));
            this.own(on(this.startDate, 'change', lang.hitch(this, '_updateMonthWidget')));
            this.own(on(this.endDate, 'change', lang.hitch(this, '_updateMonthWidget')));

            this.own(this.exportButton.on('click', lang.hitch(this, this._openExport)));
        },

        _onMonthViewGraph: function() {
            clazz.remove(this.monthViewTableBtn, 'active');
            clazz.add(this.monthViewGraphBtn, 'active');
            this._setMonthGraph();
        },

        _onMonthViewTable: function() {
            clazz.add(this.monthViewTableBtn, 'active');
            clazz.remove(this.monthViewGraphBtn, 'active');
            this._setMonthTable();
        },

        _setMonthTable: function() {
            if (this._destoyed) {
                return;
            }

            this._setMonthWidget(new monthTable(this._getMonthWidgetOptions()), 'table');
        },

        _setMonthGraph: function() {
            if (this._destoyed) {
                return;
            }

            this._setMonthWidget(new monthGraph(this._getMonthWidgetOptions()), 'graph');
        },

        _setMonthWidget: function(widget, state) {
            if (this.activeMonthWidget !== null) {
                this.activeMonthWidget.destroyRecursive();
                this.activeMonthWidget = null;
            }
            this.activeMonthWidget = widget;
            this.monthContainer.set('content', this.activeMonthWidget);
            this.monthState = state;
        },

        _getMonthWidgetOptions: function() {
            return {
                projects: this._getSelectedProjects(),
                startDate: this.startDate.get('value'),
                endDate: this.endDate.get('value')
            };
        },

        _getSelectedProjects: function() {
            var project = this.projectChooser.get('value');
            if (project === '-1' || project === '') {
                return [];
            } else {
                return [project];
            }
        },

        _updateMonthWidget: function() {
            this._scheduleMonthWidgetUpdate();
        },

        _scheduleMonthWidgetUpdate: function() {
            clearTimeout(this._monthUpdateTimer);
            this._monthUpdateTimer = setTimeout(lang.hitch(this, function() {
                switch (this.monthState) {
                    case 'table':
                        this._setMonthTable();
                        break;
                    case 'graph':
                        this._setMonthGraph();
                        break;
                }
            }), 250);
        },

        _openExport: function(evt) {
            if (evt) {
                evt.stopPropagation();
            }

            if (this.exportForm.validate()) {
                var url = 'index.php/Timecard/Timecard/index';
                var data = this.exportForm.get('value');

                var query = {format: 'csv'};
                query.filter = json.stringify({
                    startDatetime: {
                        '!ge': timehelper.jsDateToIsoDatetime(data.start),
                        '!lt': timehelper.jsDateToIsoDatetime(data.end)
                    }
                });
                window.open(url + '?' + ioQuery.objectToQuery(query));
            }
            return false;
        },

        _onFilter: function() {
            clazz.toggle(this.filters, 'open');
        }
    });

});
