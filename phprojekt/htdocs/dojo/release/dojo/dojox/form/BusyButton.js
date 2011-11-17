/*
	Copyright (c) 2004-2011, The Dojo Foundation All Rights Reserved.
	Available via Academic Free License >= 2.1 OR the modified BSD license.
	see: http://dojotoolkit.org/license for details
*/


dojo._hasResource["dojox.form.BusyButton"]||(dojo._hasResource["dojox.form.BusyButton"]=!0,dojo.provide("dojox.form.BusyButton"),dojo.require("dijit.form.Button"),dojo.requireLocalization("dijit","loading",null,"ROOT,ar,ca,cs,da,de,el,es,fi,fr,he,hu,it,ja,kk,ko,nb,nl,pl,pt,pt-pt,ro,ru,sk,sl,sv,th,tr,zh,zh-tw"),dojo.declare("dojox.form._BusyButtonMixin",null,{isBusy:!1,busyLabel:"",timeout:null,useIcon:!0,postMixInProperties:function(){this.inherited(arguments);if(!this.busyLabel)this.busyLabel=dojo.i18n.getLocalization("dijit",
"loading",this.lang).loadingState},postCreate:function(){this.inherited(arguments);this._label=this.containerNode.innerHTML;this._initTimeout=this.timeout;this.isBusy&&this.makeBusy()},makeBusy:function(){this.isBusy=!0;this.set("disabled",!0);this.setLabel(this.busyLabel,this.timeout)},cancel:function(){this.set("disabled",!1);this.isBusy=!1;this.setLabel(this._label);this._timeout&&clearTimeout(this._timeout);this.timeout=this._initTimeout},resetTimeout:function(a){this._timeout&&clearTimeout(this._timeout);
a?this._timeout=setTimeout(dojo.hitch(this,function(){this.cancel()}),a):(a==void 0||a===0)&&this.cancel()},setLabel:function(a,c){for(this.label=a;this.containerNode.firstChild;)this.containerNode.removeChild(this.containerNode.firstChild);this.containerNode.innerHTML=this.label;if(this.showLabel==!1&&!dojo.attr(this.domNode,"title"))this.titleNode.title=dojo.trim(this.containerNode.innerText||this.containerNode.textContent||"");c?this.resetTimeout(c):this.timeout=null;if(this.useIcon&&this.isBusy){var b=
new Image;b.src=this._blankGif;dojo.attr(b,"id",this.id+"_icon");dojo.addClass(b,"dojoxBusyButtonIcon");this.containerNode.appendChild(b)}},_clicked:function(){this.isBusy||this.makeBusy()}}),dojo.declare("dojox.form.BusyButton",[dijit.form.Button,dojox.form._BusyButtonMixin],{}),dojo.declare("dojox.form.BusyComboButton",[dijit.form.ComboButton,dojox.form._BusyButtonMixin],{}),dojo.declare("dojox.form.BusyDropDownButton",[dijit.form.DropDownButton,dojox.form._BusyButtonMixin],{}));