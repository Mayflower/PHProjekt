/**
 * This software is free software; you can redistribute it and/or
 * modify it under the terms of the GNU Lesser General Public
 * License version 3 as published by the Free Software Foundation
 *
 * This library is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU
 * Lesser General Public License for more details.
 *
 * @category   PHProjekt
 * @package    Application
 * @subpackage Timecard
 * @copyright  Copyright (c) 2010 Mayflower GmbH (http://www.mayflower.de)
 * @license    LGPL v3 (See LICENSE file)
 * @link       http://www.phprojekt.com
 * @since      File available since Release 6.0
 * @version    Release: @package_version@
 * @author     Gustavo Solt <solt@mayflower.de>
 */

dojo.provide("phpr.Timecard.Main");

dojo.declare("phpr.Timecard.BookingStore", null, {
    _date: null,
    _url: null,
    _detailsUrl: null,
    _projectRange: null,
    _loading: false,
    _unassignedProjectId: 1,
    _data: null,
    _metaData: null,

    constructor: function(date) {
        this._date = date;
    },

    _setUrls: function() {
        this._url = phpr.webpath +
                    'index.php/Timecard/index/jsonGetRunningBookings/' +
                    'year/' + this._date.getFullYear() +
                    '/month/' + (this._date.getMonth() + 1) +
                    '/date/' + this._date.getDate()
                                ;
        this._detailsUrl = phpr.webpath + 'index.php/Timecard/index/jsonDetail/nodeId/1/id/0';
    },

    _onDataLoaded: function(data) {
        this._data = data[0][1].data;
        this._metaData = phpr.DataStore.getMetaData({url: this._detailsUrl});
        this._runningBooking = null;

        this._projectRange = this._getProjectRange(this._metaData);

        if (this._data.length !== 0) {
            this._runningBooking = this._data;
        }

        this._stopLoading();
        this.onChange();
    },

    _getProjectRange: function(metaData) {
        var range = dojo.clone(metaData[3].range);

        var l = range.length;
        for (var i = 0; i < l; i++) {
            if (range[i].id == this._unassignedProjectId) {
                range[i].name = phpr.nls.get("Unassigned", "Timecard");
                break;
            }
        }

        return range;
    },

    _updateData: function() {
        if (!this.isLoading()) {
            this._setUrls();
            this._startLoading();

            phpr.DataStore.deleteData({url: this._url});

            phpr.DataStore.addStore({url: this._url});
            phpr.DataStore.addStore({url: this._detailsUrl});

            var dlist = new dojo.DeferredList([
                phpr.DataStore.requestData({url: this._url}),
                phpr.DataStore.requestData({url: this._detailsUrl})
            ]);

            dlist.addCallback(dojo.hitch(this, "_onDataLoaded"));
        }
    },

    _startLoading: function() {
        this._loading = true;
        this.onLoadingStart();
    },

    _stopLoading: function() {
        this._loading = false;
        this.onLoadingStop();
    },

    hasRunningBooking: function() {
        return this._runningBooking !== null;
    },

    getRunningBooking: function() {
        return this._runningBooking;
    },

    getProjectRange: function() {
        return this._projectRange;
    },

    startWorking: function(projectId, notes) {
        var data = {
            startDatetime: phpr.date.getIsoDate(this._date) + " " + phpr.date.getIsoTime(new Date()),
            projectId: projectId || this._unassignedProjectId,
            notes: notes || ""
        };

        phpr.send({
            url: phpr.webpath + 'index.php/Timecard/index/jsonSave/nodeId/1/id/0',
            content: data
        }).then(dojo.hitch(this, function(data) {
            if (data) {
                new phpr.handleResponse('serverFeedback', data);
                if (data.type == 'success') {
                    this.dataChanged();
                    this.onWorkingStart();
                }
            }
        }));
    },

    stopWorking: function(projectId, notes) {
        if (!this.hasRunningBooking()) {
            throw new Error("no running booking");
        }

        var data = {
            startDatetime: phpr.date.getIsoDate(this._date) + " " + phpr.date.getIsoTime(this._runningBooking.startTime),
            endTime: phpr.date.getIsoTime(new Date()),
            projectId: projectId || this.getLastProjectId(),
            notes: notes || this._runningBooking.note || ""
        };

        phpr.send({
            url: phpr.webpath + 'index.php/Timecard/index/jsonSave/nodeId/1/id/' + this._runningBooking.id,
            content: data
        }).then(dojo.hitch(this, function(data) {
            if (data) {
                new phpr.handleResponse('serverFeedback', data);
                if (data.type == 'success') {
                    this.dataChanged();
                    this.onWorkingStop();
                }
            }
        }));
    },

    getLastProjectId: function() {
        if (this.hasRunningBooking()) {
            return parseInt(this._runningBooking.projectId);
        } else {
            return this._unassignedProjectId;
        }
    },

    dataChanged: function() {
        this._updateData();
    },

    setDate: function(date) {
        this._date = date;
        this.dataChanged();
    },

    isLoading: function() {
        return this._loading === true;
    },

    onWorkingStart: function() { },
    onWorkingStop: function() { },
    onLoadingStart: function() { },
    onLoadingStop: function() { },
    onChange: function() { }
});

dojo.declare("phpr.Timecard.Main", phpr.Default.Main, {
    _date: new Date(),
    _contentWidget: null,
    _menuCollector: null,
    _bookingStore: null,

    constructor: function() {
        this.module = 'Timecard';
        this.loadFunctions(this.module);

        this.gridWidget = phpr.Timecard.Grid;
        this.formWidget = phpr.Timecard.Form;
        this._bookingStore = new phpr.Timecard.BookingStore(this._date);

        this._menuCollector = new phpr.Default.System.GarbageCollector();

        dojo.subscribe("Timecard.changeDate", this, "changeDate");
        dojo.subscribe("phpr.dateChanged", this, "_systemDateChanged");
        dojo.connect(this._bookingStore, "onChange", this, "_dataChanged");
    },

    _systemDateChanged: function() {
        this._bookingStore.setDate(new Date());
    },

    renderTemplate: function() {
        // Summary:
        //   Custom renderTemplate for timecard
        var view = phpr.viewManager.useDefaultView({blank: true}).clear();
        this._contentWidget = new phpr.Default.System.TemplateWrapper({
            templateName: "phpr.Timecard.template.mainContent.html",
            templateData: {
                manageFavoritesText: phpr.nls.get('Manage project list'),
                monthTxt:            phpr.date.getLongTranslateMonth(this._date.getMonth())
            }
        });
        view.centerMainContent.set('content', this._contentWidget);
        this.garbageCollector.addNode(this._contentWidget);

        // manageFavorites opens a dialog which places itself outside of the regular dom, so we need to clean it up
        // manually
        this.garbageCollector.addNode('manageFavorites');
    },

    setWidgets: function() {
        // Summary:
        //   Custom setWidgets for timecard
        this._bookingStore.dataChanged();
        this.grid = new this.gridWidget(this, this._date);
        this.form = new this.formWidget(this, this._date);
    },

    _dataChanged: function() {
        if (this.form) {
            this.form.updateData();
        }

        if (this.grid) {
            this.grid.reload(this._date, true);
        }

        this._updateMenuButton();
    },

    _updateMenuButton: function() {
        var that = this;
        if (this._menuButton && this._menuButton.dropDown) {
            this._menuCollector.collect();
            this._menuButton.dropDown.destroyDescendants();
            var button;

            if (this._bookingStore.hasRunningBooking()) {
                var range = this._bookingStore.getProjectRange();
                var l = range.length;
                var lastProjectName = "";
                var lastProjectId = this._bookingStore.getLastProjectId();

                for (var i = 0; i < l; i++) {
                    button = new dijit.MenuItem({
                        label: range[i].name,
                        onClick: dojo.hitch(this._bookingStore, function(id) {
                            this.stopWorking(id);
                        }, range[i].id)
                    });

                    if (range[i].id === lastProjectId) {
                        lastProjectName = range[i].name;
                    }

                    this._menuCollector.addNode(button);
                    this._menuButton.dropDown.addChild(button);
                }

                button = new dijit.MenuItem({
                    label: "Stop (" + lastProjectName + ")",
                    onClick: dojo.hitch(this._bookingStore, function() {
                        this.stopWorking();
                    })
                });

                this._menuCollector.addNode(button);
                this._menuButton.dropDown.addChild(button, 0);

                dojo.addClass(this._menuButton.focusNode, "runningBooking");
            } else {
                this._menuCollector.addEvent(
                    dojo.connect(this._menuButton.dropDown, "onOpen", this._bookingStore,
                        function (evt) {
                            if (!this.hasRunningBooking()) {
                                dijit.popup.close(that._menuButton.dropDown.currentPopup);
                                this.startWorking();
                            }
                        }));
                dojo.removeClass(this._menuButton.focusNode, "runningBooking");
            }
            button = null;
        }
    },

    formDataChanged: function(newDate, forceReload) {
        this._bookingStore.dataChanged();
    },

    setSubGlobalModulesNavigation: function(currentModule) {
    },

    getGlobalModuleNavigationButton: function(label) {
        var moduleName = this.module;
        var buttonContainer = new phpr.Default.System.TemplateWrapper({
            templateName: "phpr.Timecard.template.menuButton.html",
            templateData: { label: label }
        });

        var button = buttonContainer.menuButton;
        this._menuButton = button;

        dojo.connect(button, "onClick", function() {
            phpr.currentProjectId = phpr.rootProjectId;
            phpr.pageManager.modifyCurrentState(
                dojo.mixin(dojo.clone(this._emptyState), { moduleName: moduleName }));
        });

        setTimeout(
            dojo.hitch(this, function() {
                this._bookingStore.dataChanged();
            }),
            15
        );
        return button;
    },

    changeDate: function(date) {
        // summary:
        //    Update the date and reload the views
        // description:
        //    Update the date and reload the views
        this._date = date;

        this.form.setDate(date);
        this.form.updateData();
        this.form.drawDayView();

        this.grid.reload(date);
    }
});
