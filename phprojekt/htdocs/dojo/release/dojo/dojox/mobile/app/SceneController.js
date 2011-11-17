/*
	Copyright (c) 2004-2011, The Dojo Foundation All Rights Reserved.
	Available via Academic Free License >= 2.1 OR the modified BSD license.
	see: http://dojotoolkit.org/license for details
*/


dojo._hasResource["dojox.mobile.app.SceneController"]||(dojo._hasResource["dojox.mobile.app.SceneController"]=!0,dojo.provide("dojox.mobile.app.SceneController"),dojo.experimental("dojox.mobile.app.SceneController"),dojo.require("dojox.mobile._base"),function(){var f=dojox.mobile.app,e={};dojo.declare("dojox.mobile.app.SceneController",dojox.mobile.View,{stageController:null,keepScrollPos:!1,init:function(a,b){this.sceneName=a;this.params=b;var c=f.resolveTemplate(a);this._deferredInit=new dojo.Deferred;
e[a]?this._setContents(e[a]):dojo.xhrGet({url:c,handleAs:"text"}).addCallback(dojo.hitch(this,this._setContents));return this._deferredInit},_setContents:function(a){e[this.sceneName]=a;this.domNode.innerHTML="<div>"+a+"</div>";for(var b="",a=this.sceneName.split("-"),c=0;c<a.length;c++)b+=a[c].substring(0,1).toUpperCase()+a[c].substring(1);b+="Assistant";this.sceneAssistantName=b;var d=this;dojox.mobile.app.loadResourcesForScene(this.sceneName,function(){console.log("All resources for ",d.sceneName,
" loaded");if(typeof dojo.global[b]!="undefined")d._initAssistant();else{var a=f.resolveAssistant(d.sceneName);dojo.xhrGet({url:a,handleAs:"text"}).addCallback(function(a){try{dojo.eval(a)}catch(b){throw console.log("Error initializing code for scene "+d.sceneName+". Please check for syntax errors"),b;}d._initAssistant()})}})},_initAssistant:function(){console.log("Instantiating the scene assistant "+this.sceneAssistantName);var a=dojo.getObject(this.sceneAssistantName);if(!a)throw Error("Unable to resolve scene assistant "+
this.sceneAssistantName);this.assistant=new a(this.params);this.assistant.controller=this;this.assistant.domNode=this.domNode.firstChild;this.assistant.setup();this._deferredInit.callback()},query:function(a,b){return dojo.query(a,b||this.domNode)},parse:function(a){for(var a=this._widgets=dojox.mobile.parser.parse(a||this.domNode,{controller:this}),b=0;b<a.length;b++)a[b].set("controller",this)},getWindowSize:function(){return{w:dojo.global.innerWidth,h:dojo.global.innerHeight}},showAlertDialog:function(a){dojo.marginBox(this.assistant.domNode);
a=new dojox.mobile.app.AlertDialog(dojo.mixin(a,{controller:this}));this.assistant.domNode.appendChild(a.domNode);console.log("Appended ",a.domNode," to ",this.assistant.domNode);a.show()},popupSubMenu:function(a){var b=new dojox.mobile.app.ListSelector({controller:this,destroyOnHide:!0,onChoose:a.onChoose});this.assistant.domNode.appendChild(b.domNode);b.set("data",a.choices);b.show(a.fromNode)}})}());