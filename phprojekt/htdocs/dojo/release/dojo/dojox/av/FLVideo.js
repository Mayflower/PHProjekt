/*
	Copyright (c) 2004-2011, The Dojo Foundation All Rights Reserved.
	Available via Academic Free License >= 2.1 OR the modified BSD license.
	see: http://dojotoolkit.org/license for details
*/


dojo._hasResource["dojox.av.FLVideo"]||(dojo._hasResource["dojox.av.FLVideo"]=!0,dojo.provide("dojox.av.FLVideo"),dojo.experimental("dojox.av.FLVideo"),dojo.require("dijit._Widget"),dojo.require("dojox.embed.Flash"),dojo.require("dojox.av._Media"),dojo.declare("dojox.av.FLVideo",[dijit._Widget,dojox.av._Media],{_swfPath:dojo.moduleUrl("dojox.av","resources/video.swf"),constructor:function(){dojo.global.swfIsInHTML=function(){return!0}},postCreate:function(){this._subs=[];this._cons=[];this.mediaUrl=
this._normalizeUrl(this.mediaUrl);this.initialVolume=this._normalizeVolume(this.initialVolume);var a={path:this._swfPath.uri,width:"100%",height:"100%",minimumVersion:9,expressInstall:!0,params:{allowFullScreen:this.allowFullScreen,wmode:this.wmode,allowScriptAccess:this.allowScriptAccess,allowNetworking:this.allowNetworking},vars:{videoUrl:this.mediaUrl,id:this.id,autoPlay:this.autoPlay,volume:this.initialVolume,isDebug:this.isDebug}};this._sub("stageClick","onClick");this._sub("stageSized","onSwfSized");
this._sub("mediaStatus","onPlayerStatus");this._sub("mediaMeta","onMetaData");this._sub("mediaError","onError");this._sub("mediaStart","onStart");this._sub("mediaEnd","onEnd");this._flashObject=new dojox.embed.Flash(a,this.domNode);this._flashObject.onError=function(a){console.error("Flash Error:",a)};this._flashObject.onLoad=dojo.hitch(this,function(a){this.flashMedia=a;this.isPlaying=this.autoPlay;this.isStopped=!this.autoPlay;this.onLoad(this.flashMedia);this._initStatus();this._update()});this.inherited(arguments)},
play:function(a){this.isPlaying=!0;this.isStopped=!1;this.flashMedia.doPlay(this._normalizeUrl(a))},pause:function(){this.isStopped=this.isPlaying=!1;if(this.onPaused)this.onPaused();this.flashMedia.pause()},seek:function(a){this.flashMedia.seek(a)},volume:function(a){if(a){if(!this.flashMedia)this.initialVolume=a;this.flashMedia.setVolume(this._normalizeVolume(a))}return!this.flashMedia||!this.flashMedia.doGetVolume?this.initialVolume:this.flashMedia.getVolume()},_checkBuffer:function(a,b){if(this.percentDownloaded==
100)this.isBuffering&&(this.onBuffer(!1),this.flashMedia.doPlay());else if(!this.isBuffering&&b<0.1)this.onBuffer(!0),this.flashMedia.pause();else{var c=this.percentDownloaded*0.01*this.duration;!this.isBuffering&&a+this.minBufferTime*0.0010>c?(this.onBuffer(!0),this.flashMedia.pause()):this.isBuffering&&a+this.bufferTime*0.0010<=c&&(this.onBuffer(!1),this.flashMedia.doPlay())}},_update:function(){var a=Math.min(this.getTime()||0,this.duration),b=this.flashMedia.getLoaded();this.percentDownloaded=
Math.ceil(b.bytesLoaded/b.bytesTotal*100);this.onDownloaded(this.percentDownloaded);this.onPosition(a);this.duration&&this._checkBuffer(a,b.buffer);this._updateHandle=setTimeout(dojo.hitch(this,"_update"),this.updateTime)},destroy:function(){clearTimeout(this._updateHandle);dojo.disconnect(this._positionHandle);this.inherited(arguments)}}));