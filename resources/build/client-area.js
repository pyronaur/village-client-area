(function(){"use strict";var e,t,n,i;e=jQuery,t=e.q,i={},n=window.wp.hooks,function(){var t;t={standalone:!0},i.config=e.extend(!0,{},t,window.__CLIENT_AREA)}.call(this),function(){var t,n;t=function(){function t(){}return t.prototype.reload=function(){return e(".js__masonry").masonry("layout")},t.prototype.selected=function(){return this.all(),e(".ca-image").filter(function(){return 1!==e(this).find(".is-selected").length}).css("display","none"),this.reload()},t.prototype.unselected=function(){return this.all(),e(".ca-image").filter(function(){return 1===e(this).find(".is-selected").length}).css("display","none"),this.reload()},t.prototype.all=function(){return e(".ca-image").css("display",""),this.reload()},t}(),n=new t,e(document).on("click",".js__ca-action",function(){var t,i;return t=e(this),(i=t.data("action"))?(e(".js__ca-action").removeClass("is-active"),t.addClass("is-active"),n[i]()):void 0})}.call(this),function(){var t,o,a,r,l,s;t=-1,n.addAction("theme.resized",function(){t=-1}),a=function(){return e("#ca-preview").css("display","none")},s=function(i,o){var a,r,l,s;if(r=e("#ca-image-"+i),1===r.length){if(t===i)return void e("#ca-preview").css("display","block");a=r.find("img"),e("#ca-preview-content").html(a.clone()),s=o.offset(),l=o.outerHeight(),e("#ca-preview").css(n.applyFilters("client.previewPosition",{top:s.top+l+2,left:s.left,display:"block"})),t=i}},l=function(){var t,n,i;return t=e(this),n=t.text(),i=n.replace(/[^0-9]/g,""),s(i,t)},r=function(){return e("#ca-preview").length>0?e(document).on("mouseenter",".ca-preview-link",l).on("mouseleave",".ca-preview-link",a):void 0},o=function(){return e(document).off("mouseenter",".ca-preview-link",l).off("mouseleave",".ca-preview-link",a)},i.config.standalone&&e(document).ready(r),n.addAction("client.init",r),n.addAction("client.destroy",o)}.call(this),function(){var t,i,o,a,r,l,s,c,u,d,f;i=null,t=null,o=null,a="",u=function(){var t;return t=[],i.each(function(n,i){var o,a,r;return o=e(i),a=o.find(".js__filter_src"),r=a.text(),t.push({id:o.attr("id"),title:r,el:o.get(0)})}),t},s=function(e,t){var n,i,o,a;for(a=[],n=0,o=e.length;o>n;n++)i=e[n],t.test(i.title)&&a.push(i);return a},l=function(n){var r,l,c,u,d,f,p;if(f=t.val(),f!==a){if(a=f,f.length<1)return i.css("display",""),void e(".masonry").masonry();for(u=o,d=f.split(" "),l=0,c=d.length;c>l;l++)p=d[l],u=s(u,new RegExp(p,"i"));return u.length>0?(r=_.pluck(u,"el"),i.css("display","").not(r).css("display","none"),t.removeClass("not-found")):(i.css("display",""),t.addClass("not-found")),e(".masonry").masonry()}},f=_.throttle(l,750),d=function(e){return t.removeClass("not-found")},r=function(){return t=e("#js__filter-input"),1===t.length?(t.off("keyup",f),t.off("blur",d),i=null,t=null,o=null,a=""):void 0},c=function(){return t=e("#js__filter-input"),1===t.length?(i=e(".js__filter_element"),o=u(),t.on("keyup",f),t.on("blur",d)):void 0},e(document).ready(c),n.addAction("client.filters/init",c),n.addAction("client.filters/destroy",r)}.call(this),function(){var t,n,i;if((null==window.ajax_object||null==window.ajax_object.ajax_url)&&"undefined"!=typeof console&&null!==console&&null!=console.log)throw new Error("Ajax Object is required for Village Client Area");n=function(e,t){return 0===t?e.removeClass("is-selected"):e.addClass("is-selected")},i=function(e,i){return i=0===i?1:0,n(e,i),t(e)},t=function(t){var n,i,o;return i=t.data("imageId"),i||(i=0),n=e(".ca-error__message.js__template").clone().removeClass("js__template"),o=n.text(),o=o.replace("##image_id##","#"+i),n.text(o),n.css("opacity",0).appendTo(e(".ca-error__container")).velocity({properties:{translateY:[0,10],opacity:[1,0]},options:{duration:600}}),n.velocity({properties:"fadeOut",options:{duration:2e3,delay:3e3,easing:"easeInOutQuad",complete:function(){n.remove(),n=null}}})},e(document).on("click",".ca-image .ca-image__meta",function(){var t,o,a,r,l,s;return o=e(this),(r=o.data("imageId"))?(l=o.is(".is-selected")?0:1,o.addClass("is-loading"),a={action:"vca_save_state",attachment_id:r,attachment_state:l},s={type:"POST",url:ajax_object.ajax_url,data:a,dataType:"json",success:function(e){return o.removeClass("is-loading")}},t=e.ajax(s),n(o,l),t.fail(function(){return i(o,l)})):void console.log("AJAX Error: Can't select/unselect an image without an ID")})}.call(this)}).call(this);