/*
	Copyright (c) 2004-2011, The Dojo Foundation All Rights Reserved.
	Available via Academic Free License >= 2.1 OR the modified BSD license.
	see: http://dojotoolkit.org/license for details
*/


dojo._hasResource["dojox.mobile.app.ListSelector"]||(dojo._hasResource["dojox.mobile.app.ListSelector"]=!0,dojo.provide("dojox.mobile.app.ListSelector"),dojo.experimental("dojox.mobile.app.ListSelector"),dojo.require("dojox.mobile.app._Widget"),dojo.require("dojo.fx"),dojo.declare("dojox.mobile.app.ListSelector",dojox.mobile.app._Widget,{data:null,controller:null,onChoose:null,destroyOnHide:!1,_setDataAttr:function(b){(this.data=b)&&this.render()},postCreate:function(){dojo.addClass(this.domNode,
"listSelector");var b=this;this.connect(this.domNode,"onclick",function(a){if(dojo.hasClass(a.target,"listSelectorRow")){if(b.onChoose)b.onChoose(b.data[a.target._idx].value);b.hide()}});this.connect(this.domNode,"onmousedown",function(a){dojo.hasClass(a.target,"listSelectorRow")&&dojo.addClass(a.target,"listSelectorRow-selected")});this.connect(this.domNode,"onmouseup",function(a){dojo.hasClass(a.target,"listSelectorRow")&&dojo.removeClass(a.target,"listSelectorRow-selected")});this.connect(this.domNode,
"onmouseout",function(a){dojo.hasClass(a.target,"listSelectorRow")&&dojo.removeClass(a.target,"listSelectorRow-selected")});this.controller.getWindowSize();this.mask=dojo.create("div",{"class":"dialogUnderlayWrapper",innerHTML:'<div class="dialogUnderlay"></div>'},this.controller.assistant.domNode);this.connect(this.mask,"onclick",function(){b.onChoose&&b.onChoose();b.hide()})},show:function(b){var a,c=this.controller.getWindowSize(),e;b?a=e=dojo._abs(b):(a.x=c.w/2,a.y=200);console.log("startPos = ",
a);dojo.style(this.domNode,{opacity:0,display:"",width:Math.floor(c.w*0.8)+"px"});var d=0;dojo.query(">",this.domNode).forEach(function(a){dojo.style(a,{"float":"left"});d=Math.max(d,dojo.marginBox(a).w);dojo.style(a,{"float":"none"})});d=Math.min(d,Math.round(c.w*0.8))+dojo.style(this.domNode,"paddingLeft")+dojo.style(this.domNode,"paddingRight")+1;dojo.style(this.domNode,"width",d+"px");var b=dojo.marginBox(this.domNode).h,g=this,f=e?Math.max(30,e.y-b-10):this.getScroll().y+30;console.log("fromNodePos = ",
e," targetHeight = ",b," targetY = "+f," startPos ",a);a=dojo.animateProperty({node:this.domNode,duration:400,properties:{width:{start:1,end:d},height:{start:1,end:b},top:{start:a.y,end:f},left:{start:a.x,end:c.w/2-d/2},opacity:{start:0,end:1},fontSize:{start:1}},onEnd:function(){dojo.style(g.domNode,"width","inherit")}});c=dojo.fadeIn({node:this.mask,duration:400});dojo.fx.combine([a,c]).play()},hide:function(){var b=this,a=dojo.animateProperty({node:this.domNode,duration:500,properties:{width:{end:1},
height:{end:1},opacity:{end:0},fontSize:{end:1}},onEnd:function(){b.get("destroyOnHide")&&b.destroy()}}),c=dojo.fadeOut({node:this.mask,duration:400});dojo.fx.combine([a,c]).play()},render:function(){dojo.empty(this.domNode);dojo.style(this.domNode,"opacity",0);for(var b,a=0;a<this.data.length;a++)b=dojo.create("div",{"class":"listSelectorRow "+(this.data[a].className||""),innerHTML:this.data[a].label},this.domNode),b._idx=a,a==0&&dojo.addClass(b,"first"),a==this.data.length-1&&dojo.addClass(b,"last")},
destroy:function(){this.inherited(arguments);dojo.destroy(this.mask)}}));