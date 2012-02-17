/*
	Copyright (c) 2004-2011, The Dojo Foundation All Rights Reserved.
	Available via Academic Free License >= 2.1 OR the modified BSD license.
	see: http://dojotoolkit.org/license for details
*/


dojo._hasResource["dojox.sketch.UndoStack"]||(dojo._hasResource["dojox.sketch.UndoStack"]=!0,dojo.provide("dojox.sketch.UndoStack"),dojo.require("dojox.xml.DomParser"),function(){var e=dojox.sketch;e.CommandTypes={Create:"Create",Move:"Move",Modify:"Modify",Delete:"Delete",Convert:"Convert"};dojo.declare("dojox.sketch.UndoStack",null,{constructor:function(a){this.figure=a;this._steps=[];this._undoedSteps=[]},apply:function(a,b,c){if(!b&&!c&&a.fullText)this.figure.setValue(a.fullText);else{var d=b.shapeText,
a=c.shapeText;if(!(d.length==0&&a.length==0))d.length==0?(b=this.figure._loadAnnotation(dojox.xml.DomParser.parse(a).documentElement))&&this.figure._add(b):a.length==0?this.figure._delete([this.figure.getAnnotator(b.shapeId)],!0):(b=this.figure.getAnnotator(c.shapeId),c=dojox.xml.DomParser.parse(a).documentElement,b.draw(c),this.figure.select(b))}},add:function(a,b,c){var d=b?b.id:"",b=b?b.serialize():"";a==e.CommandTypes.Delete&&(b="");this._steps.push({cmdname:a,before:{shapeId:d,shapeText:c||""},
after:{shapeId:d,shapeText:b}});this._undoedSteps=[]},destroy:function(){},undo:function(){var a=this._steps.pop();a&&(this._undoedSteps.push(a),this.apply(a,a.after,a.before))},redo:function(){var a=this._undoedSteps.pop();a&&(this._steps.push(a),this.apply(a,a.before,a.after))}})}());