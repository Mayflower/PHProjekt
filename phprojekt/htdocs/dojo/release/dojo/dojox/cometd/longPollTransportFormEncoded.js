/*
	Copyright (c) 2004-2011, The Dojo Foundation All Rights Reserved.
	Available via Academic Free License >= 2.1 OR the modified BSD license.
	see: http://dojotoolkit.org/license for details
*/


if(!dojo._hasResource["dojox.cometd.longPollTransportFormEncoded"])dojo._hasResource["dojox.cometd.longPollTransportFormEncoded"]=!0,dojo.provide("dojox.cometd.longPollTransportFormEncoded"),dojo.require("dojox.cometd._base"),dojox.cometd.longPollTransportFormEncoded=new function(){this._connectionType="long-polling";this._cometd=null;this.check=function(a,b,c){return!c&&dojo.indexOf(a,"long-polling")>=0};this.tunnelInit=function(){var a={channel:"/meta/connect",clientId:this._cometd.clientId,connectionType:this._connectionType,
id:""+this._cometd.messageId++},a=this._cometd._extendOut(a);this.openTunnelWith({message:dojo.toJson([a])})};this.tunnelCollapse=function(){if(this._cometd._initialized&&!(this._cometd._advice&&this._cometd._advice.reconnect=="none")){var a=this._cometd._interval();this._cometd._status=="connected"?setTimeout(dojo.hitch(this,"_connect"),a):setTimeout(dojo.hitch(this._cometd,function(){this.init(this.url,this._props)}),a)}};this._connect=function(){if(this._cometd._initialized&&!this._cometd._polling)if(this._cometd._advice&&
this._cometd._advice.reconnect=="handshake")this._cometd._status="unconnected",this._initialized=!1,this._cometd.init(this._cometd.url,this._cometd._props);else if(this._cometd._status=="connected"){var a={channel:"/meta/connect",connectionType:this._connectionType,clientId:this._cometd.clientId,id:""+this._cometd.messageId++};if(this._cometd.connectTimeout>=this._cometd.expectedNetworkDelay)a.advice={timeout:this._cometd.connectTimeout-this._cometd.expectedNetworkDelay};a=this._cometd._extendOut(a);
this.openTunnelWith({message:dojo.toJson([a])})}};this.deliver=function(){};this.openTunnelWith=function(a,b){this._cometd._polling=!0;var c={url:b||this._cometd.url,content:a,handleAs:this._cometd.handleAs,load:dojo.hitch(this,function(a){this._cometd._polling=!1;this._cometd.deliver(a);this._cometd._backon();this.tunnelCollapse()}),error:dojo.hitch(this,function(a){a={failure:!0,error:a,advice:this._cometd._advice};this._cometd._polling=!1;this._cometd._publishMeta("connect",!1,a);this._cometd._backoff();
this.tunnelCollapse()})},d=this._cometd._connectTimeout();if(d>0)c.timeout=d;this._poll=dojo.xhrPost(c)};this.sendMessages=function(a){for(var b=0;b<a.length;b++)a[b].clientId=this._cometd.clientId,a[b].id=""+this._cometd.messageId++,a[b]=this._cometd._extendOut(a[b]);return dojo.xhrPost({url:this._cometd.url||dojo.config.cometdRoot,handleAs:this._cometd.handleAs,load:dojo.hitch(this._cometd,"deliver"),content:{message:dojo.toJson(a)},error:dojo.hitch(this,function(){this._cometd._publishMeta("publish",
!1,{messages:a})}),timeout:this._cometd.expectedNetworkDelay})};this.startup=function(){this._cometd._status!="connected"&&this.tunnelInit()};this.disconnect=function(){var a={channel:"/meta/disconnect",clientId:this._cometd.clientId,id:""+this._cometd.messageId++},a=this._cometd._extendOut(a);dojo.xhrPost({url:this._cometd.url||dojo.config.cometdRoot,handleAs:this._cometd.handleAs,content:{message:dojo.toJson([a])}})};this.cancelConnect=function(){if(this._poll)this._poll.cancel(),this._cometd._polling=
!1,this._cometd._publishMeta("connect",!1,{cancel:!0}),this._cometd._backoff(),this.disconnect(),this.tunnelCollapse()}},dojox.cometd.longPollTransport=dojox.cometd.longPollTransportFormEncoded,dojox.cometd.connectionTypes.register("long-polling",dojox.cometd.longPollTransport.check,dojox.cometd.longPollTransportFormEncoded),dojox.cometd.connectionTypes.register("long-polling-form-encoded",dojox.cometd.longPollTransport.check,dojox.cometd.longPollTransportFormEncoded);