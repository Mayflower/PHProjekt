/*
	Copyright (c) 2004-2011, The Dojo Foundation All Rights Reserved.
	Available via Academic Free License >= 2.1 OR the modified BSD license.
	see: http://dojotoolkit.org/license for details
*/


dojo._hasResource["dojox.sketch.SingleArrowAnnotation"]||(dojo._hasResource["dojox.sketch.SingleArrowAnnotation"]=!0,dojo.provide("dojox.sketch.SingleArrowAnnotation"),dojo.require("dojox.sketch.Annotation"),dojo.require("dojox.sketch.Anchor"),function(){var c=dojox.sketch;c.SingleArrowAnnotation=function(a,b){c.Annotation.call(this,a,b);this.transform={dx:0,dy:0};this.start={x:0,y:0};this.control={x:100,y:-50};this.end={x:200,y:0};this.textPosition={x:0,y:0};this.textOffset=4;this.textYOffset=10;
this.rotation=0;this.labelShape=this.arrowheadGroup=this.arrowhead=this.pathShape=null;this.anchors.start=new c.Anchor(this,"start");this.anchors.control=new c.Anchor(this,"control");this.anchors.end=new c.Anchor(this,"end")};c.SingleArrowAnnotation.prototype=new c.Annotation;var f=c.SingleArrowAnnotation.prototype;f.constructor=c.SingleArrowAnnotation;f.type=function(){return"SingleArrow"};f.getType=function(){return c.SingleArrowAnnotation};f._rot=function(){this.rotation=Math.atan2(this.control.y-
this.start.y,this.control.x-this.start.x)};f._pos=function(){var a=this.textOffset,b=0,d=0,b=this.calculate.slope(this.control,this.end);this.textAlign="middle";Math.abs(b)>=1?(b=this.end.x+this.calculate.dx(this.control,this.end,a),d=this.control.y>this.end.y?this.end.y-a:this.end.y+a+this.textYOffset):b==0?(b=this.end.x+a,d=this.end.y+this.textYOffset):(this.start.x>this.end.x?(b=this.end.x-a,this.textAlign="end"):(b=this.end.x+a,this.textAlign="start"),d=this.start.y<this.end.y?this.end.y+this.calculate.dy(this.control,
this.end,a)+this.textYOffset:this.end.y+this.calculate.dy(this.control,this.end,-a));this.textPosition={x:b,y:d}};f.apply=function(a){if(a){if(a.documentElement)a=a.documentElement;this.readCommonAttrs(a);for(var b=0;b<a.childNodes.length;b++){var d=a.childNodes[b];if(d.localName=="text")this.property("label",d.childNodes.length?d.childNodes[0].nodeValue:"");else if(d.localName=="path"){var c=d.getAttribute("d").split(" "),e=c[0].split(",");this.start.x=parseFloat(e[0].substr(1),10);this.start.y=
parseFloat(e[1],10);e=c[1].split(",");this.control.x=parseFloat(e[0].substr(1),10);this.control.y=parseFloat(e[1],10);e=c[2].split(",");this.end.x=parseFloat(e[0],10);this.end.y=parseFloat(e[1],10);c=this.property("stroke");d=d.getAttribute("style");if(e=d.match(/stroke:([^;]+);/))c.color=e[1],this.property("fill",e[1]);if(e=d.match(/stroke-width:([^;]+);/))c.width=e[1];this.property("stroke",c)}}}};f.initialize=function(a){this.apply(a);this._rot();this._pos();dojox.gfx.matrix.rotate(this.rotation);
this.shape=this.figure.group.createGroup();this.shape.getEventSource().setAttribute("id",this.id);this.pathShape=this.shape.createPath("M"+this.start.x+","+this.start.y+" Q"+this.control.x+","+this.control.y+" "+this.end.x+","+this.end.y+" l0,0");this.arrowheadGroup=this.shape.createGroup();this.arrowhead=this.arrowheadGroup.createPath();this.labelShape=this.shape.createText({x:this.textPosition.x,y:this.textPosition.y,text:this.property("label"),align:this.textAlign});this.labelShape.getEventSource().setAttribute("id",
this.id+"-labelShape");this.draw()};f.destroy=function(){if(this.shape)this.arrowheadGroup.remove(this.arrowhead),this.shape.remove(this.arrowheadGroup),this.shape.remove(this.pathShape),this.shape.remove(this.labelShape),this.figure.group.remove(this.shape),this.shape=this.pathShape=this.labelShape=this.arrowheadGroup=this.arrowhead=null};f.draw=function(a){this.apply(a);this._rot();this._pos();a=dojox.gfx.matrix.rotate(this.rotation);this.shape.setTransform(this.transform);this.pathShape.setShape("M"+
this.start.x+","+this.start.y+" Q"+this.control.x+","+this.control.y+" "+this.end.x+","+this.end.y+" l0,0");this.arrowheadGroup.setTransform({dx:this.start.x,dy:this.start.y}).applyTransform(a);this.arrowhead.setFill(this.property("fill"));this.labelShape.setShape({x:this.textPosition.x,y:this.textPosition.y,text:this.property("label"),align:this.textAlign}).setFill(this.property("fill"));this.zoom()};f.zoom=function(a){if(this.arrowhead&&(a=a||this.figure.zoomFactor,c.Annotation.prototype.zoom.call(this,
a),this._curPct!==a)){this._curPct=a;var b=a>1?5:Math.floor(5/a),d=a>1?3:Math.floor(3/a);this.arrowhead.setShape("M0,0 l"+(a>1?20:Math.floor(20/a))+",-"+b+" -"+d+","+b+" "+d+","+b+" Z")}};f.getBBox=function(){var a=Math.min(this.start.x,this.control.x,this.end.x),b=Math.min(this.start.y,this.control.y,this.end.y);return{x:a,y:b,width:Math.max(this.start.x,this.control.x,this.end.x)-a,height:Math.max(this.start.y,this.control.y,this.end.y)-b}};f.serialize=function(){var a=this.property("stroke"),b=
this.rotation*(180/Math.PI),b=Math.round(b*Math.pow(10,4))/Math.pow(10,4);return"<g "+this.writeCommonAttrs()+'><path style="stroke:'+a.color+";stroke-width:"+a.width+';fill:none;" d="M'+this.start.x+","+this.start.y+" Q"+this.control.x+","+this.control.y+" "+this.end.x+","+this.end.y+'" /><g transform="translate('+this.start.x+","+this.start.y+") rotate("+b+')"><path style="fill:'+a.color+';" d="M0,0 l20,-5, -3,5, 3,5 Z" /></g><text style="fill:'+a.color+";text-anchor:"+this.textAlign+'" font-weight="bold" x="'+
this.textPosition.x+'" y="'+this.textPosition.y+'">'+this.property("label")+"</text></g>"};c.Annotation.register("SingleArrow")}());