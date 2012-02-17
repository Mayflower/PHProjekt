/*
	Copyright (c) 2004-2011, The Dojo Foundation All Rights Reserved.
	Available via Academic Free License >= 2.1 OR the modified BSD license.
	see: http://dojotoolkit.org/license for details
*/


dojo._hasResource["dojo.hash"]||(dojo._hasResource["dojo.hash"]=!0,dojo.provide("dojo.hash"),function(){function o(a,e){var b=a.indexOf(e);return b>=0?a.substring(b+1):""}function c(){return o(location.href,"#")}function k(){dojo.publish("/dojo/hashchange",[c()])}function g(){c()!==b&&(b=c(),k())}function h(a){if(d)if(d.isTransitioning())setTimeout(dojo.hitch(null,h,a),l);else{var b=d.iframe.location.href,c=b.indexOf("?");d.iframe.location.replace(b.substring(0,c)+"?"+a)}else location.replace("#"+
a),!i&&g()}function q(){function a(){b=c();g=f?b:o(p.href,"?");m=!1;n=null}var e=document.createElement("iframe"),d=dojo.config.dojoBlankHtmlUrl||dojo.moduleUrl("dojo","resources/blank.html");dojo.config.useXDomain&&!dojo.config.dojoBlankHtmlUrl&&console.warn("dojo.hash: When using cross-domain Dojo builds, please save dojo/resources/blank.html to your domain and set djConfig.dojoBlankHtmlUrl to the path on your domain to blank.html");e.id="dojo-hash-iframe";e.src=d+"?"+c();e.style.display="none";
document.body.appendChild(e);this.iframe=dojo.global["dojo-hash-iframe"];var g,m,n,h,f,p=this.iframe.location;this.isTransitioning=function(){return m};this.pollLocation=function(){if(!f)try{var i=o(p.href,"?");if(document.title!=h)h=this.iframe.document.title=document.title}catch(q){f=!0,console.error("dojo.hash: Error adding history entry. Server unreachable.")}var j=c();if(m&&b===j)if(f||i===n)a(),k();else{setTimeout(dojo.hitch(this,this.pollLocation),0);return}else if(!(b===j&&(f||g===i)))if(b!==
j){b=j;m=!0;n=j;e.src=d+"?"+n;f=!1;setTimeout(dojo.hitch(this,this.pollLocation),0);return}else if(!f)location.href="#"+p.search.substring(1),a(),k();setTimeout(dojo.hitch(this,this.pollLocation),l)};a();setTimeout(dojo.hitch(this,this.pollLocation),l)}dojo.hash=function(a,b){if(!arguments.length)return c();a.charAt(0)=="#"&&(a=a.substring(1));b?h(a):location.href="#"+a;return a};var b,d,i,l=dojo.config.hashPollFrequency||100;dojo.addOnLoad(function(){"onhashchange"in dojo.global&&(!dojo.isIE||dojo.isIE>=
8&&document.compatMode!="BackCompat")?i=dojo.connect(dojo.global,"onhashchange",k):document.addEventListener?(b=c(),setInterval(g,l)):document.attachEvent&&(d=new q)})}());