/*
	Copyright (c) 2004-2011, The Dojo Foundation All Rights Reserved.
	Available via Academic Free License >= 2.1 OR the modified BSD license.
	see: http://dojotoolkit.org/license for details
*/


if(!dojo._hasResource["dojox.mobile._base"])dojo._hasResource["dojox.mobile._base"]=!0,dojo.provide("dojox.mobile._base"),dojo.require("dijit._WidgetBase"),dojo.isBB=navigator.userAgent.indexOf("BlackBerry")!=-1&&!dojo.isWebKit,dojo.declare("dojox.mobile.View",dijit._WidgetBase,{selected:!1,keepScrollPos:!0,_started:!1,constructor:function(a,b){if(b)dojo.byId(b).style.visibility="hidden"},buildRendering:function(){this.domNode=this.containerNode=this.srcNodeRef||dojo.doc.createElement("DIV");this.domNode.className=
"mblView";this.connect(this.domNode,"webkitAnimationEnd","onAnimationEnd");this.connect(this.domNode,"webkitAnimationStart","onAnimationStart");var a=location.href.match(/#(\w+)([^\w=]|$)/)?RegExp.$1:null;this._visible=this.selected&&!a||this.id==a;if(this.selected)dojox.mobile._defaultView=this},startup:function(){if(!this._started){var a=this;setTimeout(function(){a._visible?(dojox.mobile.currentView=a,a.onStartView()):a.domNode.style.display="none";a.domNode.style.visibility="visible"},dojo.isIE?
100:0);this._started=!0}},onStartView:function(){},onBeforeTransitionIn:function(){},onAfterTransitionIn:function(){},onBeforeTransitionOut:function(){},onAfterTransitionOut:function(){},_saveState:function(a,b,c,d,f){this._context=d;this._method=f;if(c=="none"||!dojo.isWebKit)c=null;this._moveTo=a;this._dir=b;this._transition=c;this._arguments=[];var e;for(e=0;e<arguments.length;e++)this._arguments.push(arguments[e]);this._args=[];if(d||f)for(e=5;e<arguments.length;e++)this._args.push(arguments[e])},
performTransition:function(a,b,c,d,f){if(dojo.hash&&typeof a=="string"&&a.charAt(0)=="#"&&!dojox.mobile._params){dojox.mobile._params=[];for(var e=0;e<arguments.length;e++)dojox.mobile._params.push(arguments[e]);dojo.hash(a)}else{this._saveState.apply(this,arguments);if(a)typeof a=="string"?(a.match(/^#?([^&]+)/),e=RegExp.$1):e=a;else{if(!this._dummyNode)this._dummyNode=dojo.doc.createElement("DIV"),dojo.body().appendChild(this._dummyNode);e=this._dummyNode}var g=this.domNode;(e=this.toNode=dojo.byId(e))||
alert("dojox.mobile.View#performTransition: destination view not found: "+e);e.style.visibility="hidden";e.style.display="";this.onBeforeTransitionOut.apply(this,arguments);var k=dijit.byNode(e);if(k){if(this.keepScrollPos&&!dijit.getEnclosingWidget(this.domNode.parentNode)){var i=dojo.body().scrollTop||dojo.doc.documentElement.scrollTop||dojo.global.pageYOffset||0;if(b==1){if(e.style.top="0px",i>1)g.style.top=-i+"px",dojo.config.mblHideAddressBar!==!1&&setTimeout(function(){dojo.global.scrollTo(0,
1)},0)}else if(i>1||e.offsetTop!==0){var j=-e.offsetTop;e.style.top="0px";g.style.top=j-i+"px";dojo.config.mblHideAddressBar!==!1&&j>0&&setTimeout(function(){dojo.global.scrollTo(0,j+1)},0)}}else e.style.top="0px";k.onBeforeTransitionIn.apply(k,arguments)}e.style.display="none";e.style.visibility="visible";this._doTransition(g,e,c,b)}},_doTransition:function(a,b,c,d){d=d==-1?" reverse":"";b.style.display="";!c||c=="none"?(this.domNode.style.display="none",this.invokeCallback()):(dojo.addClass(a,c+
" out"+d),dojo.addClass(b,c+" in"+d))},onAnimationStart:function(){},onAnimationEnd:function(a){var b=!1;if(dojo.hasClass(this.domNode,"out"))b=!0,this.domNode.style.display="none",dojo.forEach([this._transition,"in","out","reverse"],function(a){dojo.removeClass(this.domNode,a)},this);if(a.animationName.indexOf("shrink")===0)a=a.target,a.style.display="none",dojo.removeClass(a,"mblCloseContent");b&&this.invokeCallback();this.domNode&&(this.domNode.className="mblView")},invokeCallback:function(){this.onAfterTransitionOut.apply(this,
this._arguments);var a=dijit.byNode(this.toNode);a&&a.onAfterTransitionIn.apply(a,this._arguments);dojox.mobile.currentView=a;var a=this._context,b=this._method;if(a||b)b||(b=a,a=null),a=a||dojo.global,typeof b=="string"?a[b].apply(a,this._args):b.apply(a,this._args)},getShowingView:function(){for(var a=this.domNode.parentNode.childNodes,b=0;b<a.length;b++)if(dojo.hasClass(a[b],"mblView")&&dojo.style(a[b],"display")!="none")return dijit.byNode(a[b])},show:function(){var a=this.domNode.style;this.getShowingView().domNode.style.display=
"none";a.display="";dojox.mobile.currentView=this},addChild:function(a){this.containerNode.appendChild(a.domNode)}}),dojo.declare("dojox.mobile.Heading",dijit._WidgetBase,{back:"",href:"",moveTo:"",transition:"slide",label:"",iconBase:"",buildRendering:function(){this.domNode=this.containerNode=this.srcNodeRef||dojo.doc.createElement("H1");this.domNode.className="mblHeading";this._view=dijit.getEnclosingWidget(this.domNode.parentNode);this.label?this.domNode.appendChild(document.createTextNode(this.label)):
(this.label="",dojo.forEach(this.domNode.childNodes,function(a){a.nodeType==3&&(this.label+=a.nodeValue)},this),this.label=dojo.trim(this.label));if(this.back){var a=dojo.create("DIV",{className:"mblArrowButton"},this.domNode,"first"),b=dojo.create("DIV",{className:"mblArrowButtonHead"},a),c=dojo.create("DIV",{className:"mblArrowButtonBody mblArrowButtonText"},a);this._body=c;this._head=b;this._btn=a;c.innerHTML=this.back;this.connect(c,"onclick","onClick");dojo.create("DIV",{className:"mblArrowButtonNeck"},
a);a.style.width=c.offsetWidth+b.offsetWidth+"px";this.setLabel(this.label)}},startup:function(){if(this._btn)this._btn.style.width=this._body.offsetWidth+this._head.offsetWidth+"px"},onClick:function(){var a=this.domNode;dojo.addClass(a,"mblArrowButtonSelected");setTimeout(function(){dojo.removeClass(a,"mblArrowButtonSelected")},1E3);this.goTo(this.moveTo,this.href)},setLabel:function(a){if(a!=this.label)this.label=a,this.domNode.firstChild.nodeValue=a},goTo:function(a,b){if(!this._view)this._view=
dijit.byNode(this.domNode.parentNode);this._view&&(b?this._view.performTransition(null,-1,this.transition,this,function(){location.href=b}):dojox.mobile.app&&dojox.mobile.app.STAGE_CONTROLLER_ACTIVE?dojo.publish("/dojox/mobile/app/goback"):this._view.performTransition(a,-1,this.transition))}}),dojo.declare("dojox.mobile.RoundRect",dijit._WidgetBase,{shadow:!1,buildRendering:function(){this.domNode=this.containerNode=this.srcNodeRef||dojo.doc.createElement("DIV");this.domNode.className=this.shadow?
"mblRoundRect mblShadow":"mblRoundRect"}}),dojo.declare("dojox.mobile.RoundRectCategory",dijit._WidgetBase,{label:"",buildRendering:function(){this.domNode=this.containerNode=this.srcNodeRef||dojo.doc.createElement("H2");this.domNode.className="mblRoundRectCategory";this.label?this.domNode.innerHTML=this.label:this.label=this.domNode.innerHTML}}),dojo.declare("dojox.mobile.EdgeToEdgeCategory",dojox.mobile.RoundRectCategory,{buildRendering:function(){this.inherited(arguments);this.domNode.className=
"mblEdgeToEdgeCategory"}}),dojo.declare("dojox.mobile.RoundRectList",dijit._WidgetBase,{transition:"slide",iconBase:"",iconPos:"",buildRendering:function(){this.domNode=this.containerNode=this.srcNodeRef||dojo.doc.createElement("UL");this.domNode.className="mblRoundRectList"},addChild:function(a){this.containerNode.appendChild(a.domNode);a.inheritParams();a.setIcon()}}),dojo.declare("dojox.mobile.EdgeToEdgeList",dojox.mobile.RoundRectList,{stateful:!1,buildRendering:function(){this.inherited(arguments);
this.domNode.className="mblEdgeToEdgeList"}}),dojo.declare("dojox.mobile.AbstractItem",dijit._WidgetBase,{icon:"",iconPos:"",href:"",hrefTarget:"",moveTo:"",scene:"",clickable:!1,url:"",urlTarget:"",transition:"",transitionDir:1,callback:null,sync:!0,label:"",toggle:!1,_duration:800,inheritParams:function(){var a=this.getParentWidget();if(a){if(!this.transition)this.transition=a.transition;if(!this.icon)this.icon=a.iconBase;if(!this.iconPos)this.iconPos=a.iconPos}},findCurrentView:function(a){var b;
if(a&&(b=dijit.byId(a)))return b.getShowingView();for(a=this.domNode.parentNode;;){b=dijit.getEnclosingWidget(a);if(!b)return null;if(b.performTransition)break;a=b.domNode.parentNode}return b},transitionTo:function(a,b,c,d){var f=this.findCurrentView(a);if(f&&!(a&&f===dijit.byId(a)))if(b)this.hrefTarget?dojox.mobile.openWindow(this.href,this.hrefTarget):f.performTransition(null,this.transitionDir,this.transition,this,function(){location.href=b});else if(d)dojo.publish("/dojox/mobile/app/pushScene",
[d]);else{if(c){var e;if(dojox.mobile._viewMap&&dojox.mobile._viewMap[c])e=dojox.mobile._viewMap[c];else{e=this._text;if(!e)if(this.sync)e=dojo.trim(dojo._getText(c));else{dojo.require("dojo._base.xhr");var g=dojox.mobile.ProgressIndicator.getInstance();dojo.body().appendChild(g.domNode);g.start();f=dojo.xhrGet({url:c,handleAs:"text"});f.addCallback(dojo.hitch(this,function(e){g.stop();if(e)this._text=e,this.transitionTo(a,b,c,d)}));f.addErrback(function(a){g.stop();alert("Failed to load "+c+"\n"+
(a.description||a))});return}this._text=null;e=this._parse(e);if(!dojox.mobile._viewMap)dojox.mobile._viewMap=[];dojox.mobile._viewMap[c]=e}a=e;f=this.findCurrentView(a)||f}f.performTransition(a,this.transitionDir,this.transition,this.callback&&this,this.callback)}},_parse:function(a){var b=dojo.create("DIV"),c,d=this.urlTarget,d=dijit.byId(d)&&dijit.byId(d).containerNode||dojo.byId(d)||dojox.mobile.currentView&&dojox.mobile.currentView.domNode.parentNode||dojo.body();if(a.charAt(0)=="<"){b.innerHTML=
a;c=b.firstChild;if(!c&&c.nodeType!=1){alert("dojox.mobile.AbstractItem#transitionTo: invalid view content");return}c.setAttribute("_started","true");c.style.visibility="hidden";d.appendChild(b);(dojox.mobile.parser||dojo.parser).parse(b);d.appendChild(d.removeChild(b).firstChild)}else if(a.charAt(0)=="{"){d.appendChild(b);this._ws=[];c=this._instantiate(eval("("+a+")"),b);for(a=0;a<this._ws.length;a++)b=this._ws[a],b.startup&&!b._started&&(!b.getParent||!b.getParent())&&b.startup();this._ws=null}c.style.display=
"none";c.style.visibility="visible";d=c.id;return dojo.hash?"#"+d:d},_instantiate:function(a,b,c){var d,f;for(f in a)if(f.charAt(0)!="@"){var e=dojo.getObject(f);if(e)for(var g={},k=e.prototype,i=dojo.isArray(a[f])?a[f]:[a[f]],j=0;j<i.length;j++){for(var h in i[j])h.charAt(0)=="@"&&(d=i[j][h],h=h.substring(1),typeof k[h]=="string"?g[h]=d:typeof k[h]=="number"?g[h]=d-0:typeof k[h]=="boolean"?g[h]=d!="false":typeof k[h]=="object"&&(g[h]=eval("("+d+")")));d=new e(g,b);b||this._ws.push(d);c&&c.addChild&&
c.addChild(d);this._instantiate(i[j],null,d)}}return d&&d.domNode},createDomButton:function(a,b){if(a.className.match(/mblDomButton\w+_(\d+)/))for(var c=RegExp.$1-0,d=0,f=b||a;d<c;d++)f=dojo.create("DIV",null,f)},select:function(){},defaultClickAction:function(){if(this.toggle)this.select(this.selected);else if(!this.selected){this.select();if(!this.selectOne){var a=this;setTimeout(function(){a.select(!0)},this._duration)}(this.moveTo||this.href||this.url||this.scene)&&this.transitionTo(this.moveTo,
this.href,this.url,this.scene)}},getParentWidget:function(){var a=this.srcNodeRef||this.domNode;return a&&a.parentNode?dijit.getEnclosingWidget(a.parentNode):null}}),dojo.declare("dojox.mobile.ListItem",dojox.mobile.AbstractItem,{rightText:"",btnClass:"",anchorLabel:!1,noArrow:!1,selected:!1,buildRendering:function(){this.inheritParams();var a=this.anchorNode=dojo.create("A");a.className="mblListItemAnchor";var b=dojo.create("DIV");b.className="mblListItemTextBox";if(this.anchorLabel)b.style.cursor=
"pointer";var c=this.srcNodeRef;if(c)for(var d=0,f=c.childNodes.length;d<f;d++)b.appendChild(c.removeChild(c.firstChild));this.label&&b.appendChild(dojo.doc.createTextNode(this.label));a.appendChild(b);this.rightText&&this._setRightTextAttr(this.rightText);if(this.moveTo||this.href||this.url||this.clickable){c=this.getParentWidget();if(!this.noArrow&&(!c||!c.stateful))c=dojo.create("DIV"),c.className="mblArrow",a.appendChild(c);this.connect(a,"onclick","onClick")}else if(this.btnClass){var e=this.btnNode=
dojo.create("DIV");e.className=this.btnClass+" mblRightButton";e.appendChild(dojo.create("DIV"));e.appendChild(dojo.create("P"));var g=dojo.create("DIV");g.className="mblRightButtonContainer";g.appendChild(e);a.appendChild(g);dojo.addClass(a,"mblListItemAnchorHasRightButton");setTimeout(function(){g.style.width=e.offsetWidth+"px";g.style.height=e.offsetHeight+"px";if(dojo.isIE)a.parentNode.style.height=a.parentNode.offsetHeight+"px"},0)}if(this.anchorLabel)b.style.display="inline";b=this.domNode=
this.containerNode=this.srcNodeRef||dojo.doc.createElement("LI");b.className="mblListItem"+(this.selected?" mblItemSelected":"");b.appendChild(a);this.setIcon()},setIcon:function(){if(!this.iconNode){var a=this.anchorNode;if(this.icon&&this.icon!="none"){var b=this.iconNode=dojo.create("IMG");b.className="mblListItemIcon";b.src=this.icon;this.domNode.insertBefore(b,a);dojox.mobile.setupIcon(this.iconNode,this.iconPos);dojo.removeClass(a,"mblListItemAnchorNoIcon")}else dojo.addClass(a,"mblListItemAnchorNoIcon")}},
onClick:function(a){var b=a.currentTarget.parentNode;if(!dojo.hasClass(b,"mblItemSelected")){if(this.anchorLabel)for(var c=a.target;c.tagName!="LI";c=c.parentNode)if(c.className=="mblListItemTextBox"){dojo.addClass(c,"mblListItemTextBoxSelected");setTimeout(function(){dojo.removeClass(c,"mblListItemTextBoxSelected")},1E3);this.onAnchorLabelClicked(a);return}if(this.getParentWidget().stateful)for(var a=0,d=b.parentNode.childNodes;a<d.length;a++)dojo.removeClass(d[a],"mblItemSelected");else setTimeout(function(){dojo.removeClass(b,
"mblItemSelected")},1E3);dojo.addClass(b,"mblItemSelected");this.transitionTo(this.moveTo,this.href,this.url,this.scene)}},onAnchorLabelClicked:function(){},_setRightTextAttr:function(a){this.rightText=a;if(!this._rightTextNode)this._rightTextNode=dojo.create("DIV",{className:"mblRightText"},this.anchorNode);this._rightTextNode.innerHTML=a}}),dojo.declare("dojox.mobile.Switch",dijit._WidgetBase,{value:"on",leftLabel:"ON",rightLabel:"OFF",_width:53,buildRendering:function(){this.domNode=this.srcNodeRef||
dojo.doc.createElement("DIV");this.domNode.className="mblSwitch";this.domNode.innerHTML='<div class="mblSwitchInner"><div class="mblSwitchBg mblSwitchBgLeft"><div class="mblSwitchText mblSwitchTextLeft">'+this.leftLabel+'</div></div><div class="mblSwitchBg mblSwitchBgRight"><div class="mblSwitchText mblSwitchTextRight">'+this.rightLabel+'</div></div><div class="mblSwitchKnob"></div></div>';var a=this.inner=this.domNode.firstChild;this.left=a.childNodes[0];this.right=a.childNodes[1];this.knob=a.childNodes[2];
dojo.addClass(this.domNode,this.value=="on"?"mblSwitchOn":"mblSwitchOff");this[this.value=="off"?"left":"right"].style.display="none"},postCreate:function(){this.connect(this.knob,"onclick","onClick");this.connect(this.knob,"touchstart","onTouchStart");this.connect(this.knob,"mousedown","onTouchStart")},_changeState:function(a){this.inner.style.left="";dojo.addClass(this.domNode,"mblSwitchAnimation");dojo.removeClass(this.domNode,a=="on"?"mblSwitchOff":"mblSwitchOn");dojo.addClass(this.domNode,a==
"on"?"mblSwitchOn":"mblSwitchOff");var b=this;setTimeout(function(){b[a=="off"?"left":"right"].style.display="none";dojo.removeClass(b.domNode,"mblSwitchAnimation")},300)},onClick:function(){if(!this._moved)this.value=this.value=="on"?"off":"on",this._changeState(this.value),this.onStateChanged(this.value)},onTouchStart:function(a){this._moved=!1;this.innerStartX=this.inner.offsetLeft;if(a.targetTouches)this.touchStartX=a.targetTouches[0].clientX,this._conn1=dojo.connect(this.inner,"touchmove",this,
"onTouchMove"),this._conn2=dojo.connect(this.inner,"touchend",this,"onTouchEnd");this.left.style.display="block";this.right.style.display="block";dojo.stopEvent(a)},onTouchMove:function(a){a.preventDefault();if(a.targetTouches){if(a.targetTouches.length!=1)return!1;a=a.targetTouches[0].clientX-this.touchStartX}else a=a.clientX-this.touchStartX;a=this.innerStartX+a;a<=-(this._width-10)&&(a=-this._width);a>=-10&&(a=0);this.inner.style.left=a+"px";this._moved=!0},onTouchEnd:function(){dojo.disconnect(this._conn1);
dojo.disconnect(this._conn2);if(this.innerStartX==this.inner.offsetLeft){if(dojo.isWebKit){var a=dojo.doc.createEvent("MouseEvents");a.initEvent("click",!0,!0);this.knob.dispatchEvent(a)}}else if(a=this.inner.offsetLeft<-(this._width/2)?"off":"on",this._changeState(a),a!=this.value)this.value=a,this.onStateChanged(this.value)},onStateChanged:function(){}}),dojo.declare("dojox.mobile.Button",dijit._WidgetBase,{btnClass:"mblBlueButton",duration:1E3,label:null,buildRendering:function(){this.domNode=
this.containerNode=this.srcNodeRef||dojo.doc.createElement("BUTTON");this.domNode.className="mblButton "+this.btnClass;if(this.label)this.domNode.innerHTML=this.label;this.connect(this.domNode,"onclick","onClick")},onClick:function(){var a=this.domNode,b="mblButtonSelected "+this.btnClass+"Selected";dojo.addClass(a,b);setTimeout(function(){dojo.removeClass(a,b)},this.duration)}}),dojo.declare("dojox.mobile.ToolBarButton",dojox.mobile.AbstractItem,{selected:!1,_defaultColor:"mblColorDefault",_selColor:"mblColorDefaultSel",
buildRendering:function(){this.inheritParams();this.domNode=this.containerNode=this.srcNodeRef||dojo.doc.createElement("div");dojo.addClass(this.domNode,"mblToolbarButton mblArrowButtonText");var a;if(this.selected)a=this._selColor;else if(this.domNode.className.indexOf("mblColor")==-1)a=this._defaultColor;dojo.addClass(this.domNode,a);this.label?this.domNode.innerHTML=this.label:this.label=this.domNode.innerHTML;if(this.icon&&this.icon!="none"){if(this.iconPos){var b=dojo.create("DIV",null,this.domNode);
a=dojo.create("IMG",null,b);a.style.position="absolute";var c=this.iconPos.split(/[ ,]/);dojo.style(b,{position:"relative",width:c[2]+"px",height:c[3]+"px"})}else a=dojo.create("IMG",null,this.domNode);a.src=this.icon;dojox.mobile.setupIcon(a,this.iconPos);this.iconNode=a}this.createDomButton(this.domNode);this.connect(this.domNode,"onclick","onClick")},select:function(a){dojo.toggleClass(this.domNode,this._selColor,!a);this.selected=!a},onClick:function(){this.defaultClickAction()}}),dojo.declare("dojox.mobile.ProgressIndicator",
null,{interval:100,colors:["#C0C0C0","#C0C0C0","#C0C0C0","#C0C0C0","#C0C0C0","#C0C0C0","#B8B9B8","#AEAFAE","#A4A5A4","#9A9A9A","#8E8E8E","#838383"],_bars:[],constructor:function(){this.domNode=dojo.create("DIV");this.domNode.className="mblProgContainer";for(var a=0;a<12;a++){var b=dojo.create("DIV");b.className="mblProg mblProg"+a;this.domNode.appendChild(b);this._bars.push(b)}},start:function(){var a=0,b=this;this.timer=setInterval(function(){a--;a=a<0?11:a;for(var c=b.colors,d=0;d<12;d++)b._bars[d].style.backgroundColor=
c[(a+d)%12]},this.interval)},stop:function(){this.timer&&clearInterval(this.timer);this.timer=null;this.domNode.parentNode&&this.domNode.parentNode.removeChild(this.domNode)}}),dojox.mobile.ProgressIndicator._instance=null,dojox.mobile.ProgressIndicator.getInstance=function(){if(!dojox.mobile.ProgressIndicator._instance)dojox.mobile.ProgressIndicator._instance=new dojox.mobile.ProgressIndicator;return dojox.mobile.ProgressIndicator._instance},dojox.mobile.addClass=function(){for(var a=document.getElementsByTagName("link"),
b=0,c=a.length;b<c;b++)if(a[b].href.match(/dojox\/mobile\/themes\/(\w+)\//)){dojox.mobile.theme=RegExp.$1;dojo.addClass(dojo.body(),dojox.mobile.theme);break}},dojox.mobile.setupIcon=function(a,b){if(a&&b){var c=dojo.map(b.split(/[ ,]/),function(a){return a-0}),d=c[0],f=c[1];a.style.clip="rect("+d+"px "+(c[1]+c[2])+"px "+(c[0]+c[3])+"px "+f+"px)";a.style.top=dojo.style(a,"top")-d+"px";a.style.left=dojo.style(a.parentNode,"paddingLeft")-f+"px"}},dojox.mobile.hideAddressBar=function(){dojo.body().style.minHeight=
"1000px";setTimeout(function(){scrollTo(0,1)},100);setTimeout(function(){scrollTo(0,1)},400);setTimeout(function(){scrollTo(0,1);dojo.body().style.minHeight=(dojo.global.innerHeight||dojo.doc.documentElement.clientHeight)+"px"},1E3)},dojox.mobile.openWindow=function(a,b){dojo.global.open(a,b||"_blank")},dojo._loaders.unshift(function(){var a=dojo.body().getElementsByTagName("*"),b,c,d;c=a.length;for(b=0;b<c;b++)if((d=a[b].getAttribute("dojoType"))&&a[b].parentNode.getAttribute("lazy")=="true")a[b].setAttribute("__dojoType",
d),a[b].removeAttribute("dojoType")}),dojo.addOnLoad(function(){dojox.mobile.addClass();dojo.config.mblApplyPageStyles!==!1&&dojo.addClass(dojo.doc.documentElement,"mobile");dojo.config.mblHideAddressBar!==!1&&(dojox.mobile.hideAddressBar(),dojo.config.mblAlwaysHideAddressBar==!0&&(dojo.global.onorientationchange!==void 0?dojo.connect(dojo.global,"onorientationchange",dojox.mobile.hideAddressBar):dojo.connect(dojo.global,"onresize",dojox.mobile.hideAddressBar)));var a=dojo.body().getElementsByTagName("*"),
b,c=a.length,d;for(b=0;b<c;b++)if(d=a[b].getAttribute("__dojoType"))a[b].setAttribute("dojoType",d),a[b].removeAttribute("__dojoType");if(dojo.hash){var f=function(a){for(var b=a=dijit.findWidgets(a),c=0;c<b.length;c++)a=a.concat(f(b[c].containerNode));return a};dojo.subscribe("/dojo/hashchange",null,function(a){var c=dojox.mobile.currentView;if(c){var d=dojox.mobile._params;if(!d){var a=a?a:dojox.mobile._defaultView.id,d=f(c.domNode),i=1,j="slide";for(b=0;b<d.length;b++){var h=d[b];if("#"+a==h.moveTo){j=
h.transition;i=h instanceof dojox.mobile.Heading?-1:1;break}}d=[a,i,j]}c.performTransition.apply(c,d);dojox.mobile._params=null}})}dojo.body().style.visibility="visible"}),dijit.getEnclosingWidget=function(a){for(;a&&a.tagName!=="BODY";){if(a.getAttribute&&a.getAttribute("widgetId"))return dijit.registry.byId(a.getAttribute("widgetId"));a=a._parentNode||a.parentNode}return null};