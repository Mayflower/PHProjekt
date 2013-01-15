//>>built
define("dojox/xmpp/widget/ChatSession",["dojo","dijit","dojox","dojo/require!dijit/layout/LayoutContainer,dijit/_Templated"],function(a,b){a.provide("dojox.xmpp.widget.ChatSession");a.require("dijit.layout.LayoutContainer");a.require("dijit._Templated");a.declare("dojox.xmpp.widget.ChatSession",[b.layout.LayoutContainer,b._Templated],{templateString:a.cache("dojox.xmpp.widget","templates/ChatSession.html",'<div>\n<div dojoAttachPoint="messages" dojoType="dijit.layout.ContentPane" layoutAlign="client" style="overflow:auto">\n</div>\n<div dojoType="dijit.layout.ContentPane" layoutAlign="bottom" style="border-top: 2px solid #333333; height: 35px;"><input dojoAttachPoint="chatInput" dojoAttachEvent="onkeypress: onKeyPress" style="width: 100%;height: 35px;" /></div>\n</div>'),
enableSubWidgets:!0,widgetsInTemplate:!0,widgetType:"ChatSession",chatWith:null,instance:null,postCreate:function(){},displayMessage:function(a){a&&(this.messages.domNode.innerHTML+="<b>"+(a.from?this.chatWith:"me")+":</b> "+a.body+"<br/>",this.goToLastMessage())},goToLastMessage:function(){this.messages.domNode.scrollTop=this.messages.domNode.scrollHeight},onKeyPress:function(b){if((b.keyCode||b.charCode)==a.keys.ENTER&&""!=this.chatInput.value)this.instance.sendMessage({body:this.chatInput.value}),
this.displayMessage({body:this.chatInput.value},"out"),this.chatInput.value=""}})});