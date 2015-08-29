/* Facebox Plugin - ©2008 Chris Wanstrath - famspam.com/facebox - Includes some functions by quirksmode.com */
(function ($) {
	$.facebox = function (data,klass) {
		$.facebox.loading();		
		if (data.ajax) {
			fillFaceboxFromAjax(data.ajax,klass);
		} else if (data.image) {
			fillFaceboxFromImage(data.image,klass);
		} else if (data.div) {
			fillFaceboxFromHref(data.div,klass);
		} else if ($.isFunction(data)) {
			data.call($);
		} else {
			$.facebox.reveal(data,klass);
		}
	};
	$.extend($.facebox, { 
		parentItem:'',
		settings: {
			opacity: 0.25,
			overlay: true,
			loadingImage: staticServer + '/themes/ankara/images/waiting.gif',
			imageTypes: ['jpg', 'jpeg'],
			videoTypes: ['mp4'],
			faceboxHtml: '<div id="facebox" style="display:none"><table role="dialog" title=""><tr><td class="body tl"><a href="#" class="visuallyhidden" id="popAnchor">Yeni Pencere Açıldı. Lütfen devam ediniz, pencereyi kapamak için ESC tuşuna basabilirsiniz.</a><div id="modalContent" class="content"></div></td><td class="tr"></td></tr><tr><td class="bl"></td><td class="br"></td></tr></table></div>'
		},
		loading: function () {
			init();
			if ($('#facebox .loading').length == 1) {
				return true;
			}
			showOverlay();
			$('#facebox .content').empty();
			$('#facebox .body').children().hide().end().append('<div class="loading"><img src="' + $.facebox.settings.loadingImage + '"/></div>');
			$('#facebox').css({
				top: getPageScroll()[1] + (getPageHeight() / 10),
				left: Math.round(($(window).width() - $('#facebox').width()) / 2)
			}).show();
			$(document).bind('keydown.facebox', function (e) {
				if (e.keyCode == 27) {
					$.facebox.close();
				}
				return true;
			});
			$(document).trigger('loading.facebox');
		},
		reveal: function (data, klass) {
			$(document).trigger('beforeReveal.facebox');
			if (klass) {
				$('#facebox .content').addClass(klass);
			}
			
			$('#facebox .footer').remove();
			if(klass != 'noclose'){				
				$('#facebox .content').after('<div class="footer"><a href="#" class="close" role="button">Kapat</a></div>');
				$('#facebox a.close').click($.facebox.close);
			}	
					
			$('#facebox .content').append(data);
			$('#facebox .loading').remove();
			$('#facebox .body').children().fadeIn('normal');
			$('#facebox').css('left',($(window).width()*0.5)-($('#facebox table').width()*0.5));
			$('#facebox').attr('data-parentid',$.facebox.parentItem);
			$(document).trigger('reveal.facebox').trigger('afterReveal.facebox');
			$('#popAnchor').focus();
			$('#facebox a[rel*="external"]').click(function(){			
				if(confirm('Şu anda e-Devlet Kapısı\'nı terk ederek '+$(this)[0].hostname+' sitesine gidiyorsunuz. Yönlendirildiğiniz sitedeki hizmet ve içerik kalitesi, ilgili kurumun sorumluluğundadır. \nDevam etmek için Tamam’a , bu sayfada kalmak için İptal’e basınız.')){window.open($(this).attr('href'));return false;}
				return false;
			});
		},
		close: function () {
			$(document).trigger('close.facebox');
			return false;
		}
	});
	$.fn.facebox = function (settings) {
		init(settings);
		function clickHandler(){			
			$.facebox.loading(true);
			var klass = $(this).attr("data-modalclass");
			$.facebox.parentItem=$(this).attr('id');
			fillFaceboxFromHref(this.href, klass);
			return false;
		}
		return this.click(clickHandler);
	};

	function init(settings) {
		if ($.facebox.settings.inited) {
			return true;
		} else {
			$.facebox.settings.inited = true;
		}
		$(document).trigger('init.facebox');
		makeCompatible();
		var imageTypes = $.facebox.settings.imageTypes.join('|');
		var videoTypes = $.facebox.settings.videoTypes.join('|');
		$.facebox.settings.imageTypesRegexp = new RegExp('\.' + imageTypes + '$', 'i');
		$.facebox.settings.videoTypesRegexp = new RegExp('\.' + videoTypes + '$', 'i');
		if (settings) {
			$.extend($.facebox.settings, settings);
		}
		$('body').append($.facebox.settings.faceboxHtml);
		var preload = [new Image(), new Image()];
		preload[0].src = $.facebox.settings.loadingImage;
		$('#facebox').find('.b:first, .bl, .br, .tl, .tr').each(function () {
			preload.push(new Image());
			preload.slice(-1).src = $(this).css('background-image').replace(/url\((.+)\)/, '$1');
		});
	}

	function getPageScroll() {
		var xScroll, yScroll;
		if (self.pageYOffset) {
			yScroll = self.pageYOffset;
			xScroll = self.pageXOffset;
		} else if (document.documentElement && document.documentElement.scrollTop) {
			yScroll = document.documentElement.scrollTop;
			xScroll = document.documentElement.scrollLeft;
		} else if (document.body) {
			yScroll = document.body.scrollTop;
			xScroll = document.body.scrollLeft;
		}
		return new Array(xScroll, yScroll);
	}

	function getPageHeight() {
		var windowHeight;
		if (self.innerHeight) {
			windowHeight = self.innerHeight;
		} else if (document.documentElement && document.documentElement.clientHeight) {
			windowHeight = document.documentElement.clientHeight;
		} else if (document.body) {
			windowHeight = document.body.clientHeight;
		}
		return windowHeight;
	}

	function makeCompatible() {
		var $s = $.facebox.settings;
		$s.loadingImage = $s.loading_image || $s.loadingImage;
		$s.imageTypes = $s.image_types || $s.imageTypes;
		$s.videoTypes = $s.video_types || $s.videoTypes;
		$s.faceboxHtml = $s.facebox_html || $s.faceboxHtml;
	}

	function fillFaceboxFromHref(href, klass) {
		if (href.match(/#googleMap/)) {
			fillFaceboxFromGmap(href, klass);
		} else if (href.match(/#popNews/)) {
			fillFaceboxFromNews(href, klass);
		} else if (href.match(/#/)) {
			var url = window.location.href.split('#')[0];
			var target = href.replace(url, '');
			$.facebox.reveal($(target).clone().show(), klass);
		} else if (href.match($.facebox.settings.imageTypesRegexp)) {
			fillFaceboxFromImage(href, klass);
		} else if (href.match($.facebox.settings.videoTypesRegexp)) {
			fillFaceboxFromVideo(href, klass);
		} else if (href.match(/www\.youtube\.com/)) {
			fillFaceboxFromYouTube(href, klass);
		} else {
			fillFaceboxFromAjax(href, klass);
		}
	}

	function fillFaceboxFromImage(href, klass) {
		var image = new Image();
		image.onload = function () {
			$.facebox.reveal('<div class="image"><img src="' + image.src + '" /></div>', klass);
		};
		image.src = href;
	}
	
	function fillFaceboxFromVideo(href, klass) {
		$.facebox.reveal('<video id="vplayer" width="640" height="360" controls muted autoplay><source src="'+href+'" type="video/mp4"><source src="'+href+'.ogg" type="video/ogg"><track label="Türkçe" kind="captions" srclang="tr" src="'+href+'.txt.php"></video><div id="captionBar"></div>', klass);
		loadTextTrack({videoId:"vplayer",targetId:"captionBar",kind:"captions",srclang:"tr"});	
	}
	
	function fillFaceboxFromYouTube(href, klass) {
		$.facebox.reveal('<iframe id="ytplayer" type="text/html" width="640" height="390" src="'+href+'?autoplay=1" frameborder="0"/>', klass);
		return false;
	}
	
	function fillFaceboxFromNews(href, klass) {
		var newsContent = "";
		var nr = 1;
		$("#newsBlock .newsItem").each(function (i) {
			newsContent += '<div class="popItem"><span>' + nr + '</span>' + $(this).html() + '</div>';
			nr++;
		});
		$.facebox.reveal('<div class="newspane">' + newsContent + '</div>', klass);
	}

	function fillFaceboxFromGmap(href, klass) {
		var queryString = href.replace(/^[^\?]+\??/, '');
		var params = parseQuery(queryString);
		$.facebox.reveal('<div id="googleMap" style="width:600px; height:400px;"></div>', klass);
		loadGoogleMap(params);
		return false;
	}

	function fillFaceboxFromAjax(href, klass) {
		$.ajax({
			url: href,
			timeout: 4000,
			success: function (data) {
				$.facebox.reveal(data, klass)
			}
		});
	}

	function skipOverlay() {
		return $.facebox.settings.overlay == false || $.facebox.settings.opacity === null;
	}

	function showOverlay() {
		if (skipOverlay()) {
			return;
		}
		if ($('#facebox_overlay').length == 0) {
			$("body").append('<div id="facebox_overlay" class="facebox_hide"></div>');
			$('#facebox_overlay').hide().addClass("facebox_overlayBG").height($(document).height()).css('opacity', $.facebox.settings.opacity).fadeIn(200);
			return false;
		}
	}

	function hideOverlay() {
		if (skipOverlay()) {
			return;
		}
		$('#facebox_overlay').fadeOut(200, function () {
			$("#facebox_overlay").removeClass("facebox_overlayBG");
			$("#facebox_overlay").addClass("facebox_hide");
			$("#facebox_overlay").remove();
		});
		return false;
	}

	function replaceutf8(text) {
		var trext = text;
		var newChars = ['Ğ', 'Ü', 'Ş', 'İ', 'Ö', 'Ç', 'ğ', 'ü', 'ş', 'ı', 'ö', 'ç', ' '];
		var oldChars = ['%C4%9E', '%C3%9C', '%C5%9E', '%C4%B0', '%C3%96', '%C3%87', '%C4%9F', '%C3%BC', '%C5%9F', '%C4%B1', '%C3%B6', '%C3%A7', '+'];
		for (var n = 0; n < oldChars.length; n++) {
			temp = trext.split(oldChars[n]);
			trext = temp.join(newChars[n]);
		}
		return trext;
	}

	function parseQuery(query) {
		var Params = {};
		if (!query) {
			return Params;
		}
		var Pairs = query.split(/[;&]/);
		for (var i = 0; i < Pairs.length; i++) {
			var KeyVal = Pairs[i].split('=');
			if (!KeyVal || KeyVal.length != 2) {
				continue;
			}
			var key = unescape(KeyVal[0]);
			var val = unescape(replaceutf8(KeyVal[1]));
			Params[key] = val;
		}
		return Params;
	}

	function loadGoogleMap(params) {
		var mapOptions=new Object();
		mapOptions.mapTypeId=google.maps.MapTypeId.HYBRID;		
		if (typeof(params["zoom"])!="undefined" && params["zoom"]!==null){mapOptions.zoom=parseInt(params["zoom"]);} else {mapOptions.zoom=18;}
		
		if(typeof(params["lat"])!="undefined" && params["lat"]!==null && typeof(params["lon"])!="undefined" && params["lon"]!==null) {
			mapOptions.center=new google.maps.LatLng(params["lat"],params["lon"]);
			var map = new google.maps.Map(document.getElementById("googleMap"),mapOptions);
			var marker = new google.maps.Marker({position:mapOptions.center,map:map});
			if (typeof(params["markerText"])!="undefined" && params["markerText"]!==null){
				var infowindow = new google.maps.InfoWindow({content: params["markerText"]}).open(map,marker);
			}			
		} else if (typeof(params["enc"])!="undefined" && params["enc"]!==null){
			var decodedPath = new google.maps.geometry.encoding.decodePath(params["enc"]);
			mapOptions.center=decodedPath[0];			
			var map = new google.maps.Map(document.getElementById("googleMap"),mapOptions);
			var gmapPoly = new google.maps.Polygon({paths:decodedPath,strokeColor:"#FF0000",strokeOpacity:1,strokeWeight:3,fillColor:"#0000FF",fillOpacity:0.5}).setMap(map);
		}
		return false;
	}
	
	$(document).bind('close.facebox', function () {
		$(document).unbind('keydown.facebox');
		$('#facebox').fadeOut(function () {
			$('#facebox .content').removeClass().addClass('content');
			hideOverlay();
			$('#facebox .loading').remove();
			$("#facebox .content").empty();
		});
	})
})(jQuery);

function loadTextTrack(t) {
    var e, r, n;
    e = jQuery("#" + t.videoId), n = void 0 != t.srclang ? t.kind + t.srclang : t.kind, r = jQuery(e).find("track[kind=" + t.kind + "]" + (void 0 != t.srclang ? "[srclang=opt['srclang']]" : "")).attr("src"), jQuery.ajax({
        method: "get",
        crossDomain: true,
        url: r,
        success: function(t) {			
            textTrack[n] = parseSRT(t)
        }
    }), textTrackCounter[n] = 0, e.bind("play", function() {
        return textTrackCounter[n] = 0
    }), e.bind("ended", function() {
        return textTrackCounter[n] = 0
    }), e.bind("seeked", function() {
        for (textTrackCounter[n] = 0; textTrack[n][textTrackCounter[n]][2] < this.currentTime.toFixed(1);)
            if (textTrackCounter[n] ++, textTrackCounter[n] > textTrackCounter[n].length - 1) {
                textTrackCounter[n] = textTrackCounter[n].length - 1;
                break
            }
    }), e.bind("timeupdate", function() {
        var e;
        return e = "", this.currentTime.toFixed(1) > textTrack[n][textTrackCounter[n]][1] && this.currentTime.toFixed(1) < textTrack[n][textTrackCounter[n]][2] && (e = textTrack[n][textTrackCounter[n]][3]), this.currentTime.toFixed(1) > textTrack[n][textTrackCounter[n]][2] && textTrackCounter[n] < textTrack[n].length - 1 && textTrackCounter[n] ++, currentText[n] != e ? (currentText[n] = e, console.log(e), jQuery("#" + t.targetId).html(e)) : ""
    })
}

function parseSRT(t) {
    var e = [];
    t = t.replace("WEBVTT FILE\r\n\r\n", "");	
	t = t.replace(/(\r\n|\r|\n)/g, "\n").split("\n\n");
    for (x in t) e[x] = t[x].split("\n"), e[x][3] = e[x][2], e[x][2] = timecode_max(e[x][1]), e[x][1] = timecode_min(e[x][1]);
    return e
}

var textTrack = [], textTrackCounter = [], currentText = [];
timecode_min = function(t) {
    var e;
    return e = t.split(" --> "), tcsecs(e[0])
}, timecode_max = function(t) {
    var e;
    return e = t.split(" --> "), tcsecs(e[1])
}, tcsecs = function(t) {
    var e, r, n;
    return r = t.split("."), n = r[0].split(":"), e = Math.floor(60 * n[0]) + Math.floor(n[1])
};