if (window!=top){top.location.replace(window.location);}
var _paq=_paq||[];
$(document).ready(function(){
	$('a[data-modal="true"]').facebox().addClass('modalLink');
	$('a[data-confirm="true"]').click(function(){if(confirm('İşleminizi iptal etmek istediğinizden emin misiniz?')){window.location.href=$(this).attr('href');return false;}return false;});
	$('a[rel*="external"]').click(function(){if(confirm('Şu anda e-Devlet Kapısı\'nı terk ederek '+$(this)[0].hostname+' sitesine gidiyorsunuz. Yönlendirildiğiniz sitedeki hizmet ve içerik kalitesi, ilgili kurumun sorumluluğundadır. \nDevam etmek için Tamam’a , bu sayfada kalmak için İptal’e basınız.')){window.open($(this).attr('href'));return false;}return false;}).addClass('externalLink');
	
	var viewMode=(document.cookie.match('(^|; )viewMode=([^;]*)')||0)[2];
	var textMode=(document.cookie.match('(^|; )textMode=([^;]*)')||0)[2];
	
	var toggleText=function(){
		if($('footer .textOnlyToggle').attr('data-state')=="html"){
			$('footer .textOnlyToggle').html('HTML Sürümü').attr('data-state','text');
			$('link[rel="stylesheet"]').attr('disabled','disabled');
			$('body').prepend('<a href="#" id="textSwitcher">HTML (Normal) Görünüme Dön<hr></a>');
			$('#textSwitcher').click(function(){toggleText();});
			document.cookie="viewMode=text";
		} else {
			$('footer .textOnlyToggle').html('Salt Metin Sürümü').attr('data-state','html');
			$('link[rel="stylesheet"]').removeAttr('disabled');
			$('#textSwitcher').remove();
			document.cookie="viewMode=html";
		}
	};
	
	var toggleSize=function(){
		if($('footer .fontSizeToggle').attr('data-state')=="normal"){
			$('footer .fontSizeToggle').html('Normal Yazı Tipi').attr('data-state','large');
			if (navigator.appName=='Microsoft Internet Explorer'){
				$('body').css('zoom','125%').css('-ms-transform-origin','50% 0%');
			}else{
				$('html').css('zoom','125%').css('transform','scale(1.25)').css('transform-origin','50% 0%');
			}
			document.cookie="textMode=large";
		} else {
			$('footer .fontSizeToggle').html('Büyük Yazı Tipi').attr('data-state','normal');
			$('html,body').css('zoom','100%').css('transform','scale(1)').css('transform-origin','50% 0%');
			document.cookie="textMode=normal";
		}
	};
	
	$('footer .textOnlyToggle').click(function(){if($(this).attr('data-state')=="text"){toggleText();return false;};if(confirm('Salt metin görünümüne geçtiğinizde sayfa üzerindeki görsel öğeler gösterilmez. Salt metin sürümünden çıkmak için sayfanın altında ve üstünde bulunan "HTML Sürümü" bağlantısını kullanabilir veya tarayıcınızı kapatıp açabilirsiniz.')){toggleText();}return false;});	
	$('footer .fontSizeToggle').click(function(){if($(this).attr('data-state')=="large"){toggleSize();return false;};if(confirm('Eğer yazıları okumakta zorlanıyorsanız, bu seçeneği kullanarak sayfayı büyütebilirsiniz. Bu görünümden çıkmak için sayfanın en altında bulunan "Normal Yazı Tipi" bağlantısını kullanabilir veya tarayıcınızı kapatıp açabilirsiniz.')){toggleSize();}return false;});
	if(viewMode=='text'){toggleText();}
	if(textMode=='large'){toggleSize();}
	
	if($('#logoutLink').length){
		$('#userContextMenu').css('left',$('#profileLink').offset().left+'px').css('width',($('#profileLink').outerWidth()+$('#myMessagesLink').outerWidth()+$('#myPageLink').outerWidth()-2)+'px');
		$('#profileLink').click(function(){
			if($(this).hasClass('active')){
				$('#userContextMenu').slideUp(500,function(){$('#profileLink').removeClass('active');});				
			} else {
				$('#userContextMenu').slideDown(500);			
				$(this).addClass('active');
			}
			return false;
		});
		
		var sessionLastActivity=new Date().getTime();
		var sessionAwayTimer,sessionCheckTimeout,sessionExtend;
		var sessionTime=599;			
		var sessionExtend = function(){
			$.ajax({
				url:"common-ajax-operations?submit",
				type:"POST",
				cache:false,
				dataType:"json",
				data:"token="+$('body').attr('data-token')+"&ajax=1&islemTipi=extendTimeout",
				timeout:10000,
				success:function(data,textStatus,jqXHR){
					if(data.time<=0){
						window.location.href='/logout';
					}else if(data.time>0){
						sessionTime=data.time;
					}else{
						sessionTime=599;
					}
				}
			});
		}		
		var sessionPrompt = function(){
			jQuery.facebox('<div class="timeoutPop"><h3>Oturumunuz Kapanmak Üzere...</h3>Güvenliğiniz için, e-Devlet Kapısı oturumunuz açıldıktan 1 saat sonra otomatik olarak kapatılmakta ve yeniden sisteme giriş yapmanız gerekmektedir. e-Devlet Kapısı oturumunuz <strong id="sessionPopSeconds">90</strong> saniye sonra otomatik olarak kapatılacaktır.<div><a href="#" class="exitButton">Tamam</a></div></div>','noclose');
			$('#facebox a.exitButton').click(function(){jQuery.facebox.close();return false;});
		}		
		var sessionCheckTimeout = function(){
			sessionTime=sessionTime?sessionTime-1:0;
			var minutes = Math.floor(sessionTime/60);
			var seconds = sessionTime-(minutes*60);			
			if(sessionTime>90 && seconds==10){
				var t=new Date().getTime();
				if((t-sessionLastActivity)<50000){
					sessionExtend();
				}
			}				
			if(sessionTime==90){jQuery.facebox.close();sessionPrompt();}			
			if(sessionTime<90){$('#facebox #sessionPopSeconds').html(sessionTime);}
			if(sessionTime==1){jQuery.facebox.close();sessionExtend();}			
		};
		window.onclick = function(){sessionLastActivity = new Date().getTime();};
		window.onkeydown = function(){sessionLastActivity = new Date().getTime();};
		sessionAwayTimer = setInterval(sessionCheckTimeout,1000);
	}
		
	var acSearchLimit;
	var acSelItem=0;	
	var acRequest;				
	var acUpdateIndex=function(dir){
		if(dir=="U"){acSelItem--;} else if(dir=="D"){acSelItem++;}else{acSelItem=dir;}
		if(acSelItem<0){acSelItem=0;}
		if(acSelItem>$('#popSearch li').length){acSelItem=$('#popSearch li').length;}				
		$('#popSearch li').removeClass('sel');
		$('#searchField').attr('aria-activedescendant',$('#popSearch li:nth-child('+acSelItem+')').addClass('sel').attr('id'));
	};		
	$('#popSearch').css('top','90px').hide();
	$('#searchField').attr('autocorrect','off').attr('autocapitalize','off');
	$('#searchForm').submit(function(e){
		if(acSelItem>0){
			e.preventDefault();
			window.location.href=$('#popSearch li:nth-child('+acSelItem+') a').attr('href');
			return false;
		}
	});				
	$('#searchField').keyup(function(e){
		if(e.keyCode!=37 && e.keyCode!=38 && e.keyCode!=39 && e.keyCode!=40 && e.keyCode!=13){
			if($(this).val().length>=3){
				clearTimeout(acSearchLimit);acSearchLimit=setTimeout(function(){
					if(acRequest&&acRequest.readystate!=4){acRequest.abort();}											
					acRequest = $.ajax({
						url:"/arama?submit",
						type:"POST",
						data:"ajax=1&token="+$('body').attr('data-token')+"&aranan="+$('#searchField').val(),
						dataType:"json"
					}).done(function(data){
						var htmlData='';
						acSelItem=0;						
						$.each(data,function(i,obj){
							if(obj.agency){
								htmlData+='<li role="option" id="'+obj.id+'"><a href="'+obj.url+'"><img src="https://static.turkiye.gov.tr/themes/ankara/images/logos/64px/'+obj.agency+'.png" width="32" height="32" alt=""><span><em>'+obj.lineone+'</em>'+obj.linetwo+'</span></a></li>';
							} else {
								htmlData+='<li role="option" id="'+obj.id+'"><a href="'+obj.url+'">'+obj.lineone+'</a></li>';
							}
						});
						if(htmlData!=''){							
							var curHeight=$('#popSearch').height();
							$('#popSearch').css('left',$('#searchField').offset().left+'px').css('height','auto').html(htmlData).show();
							$('#searchField').attr('aria-expanded','true');
							var autoHeight=$('#popSearch').height();
							$('#popSearch').height(curHeight).animate({height:autoHeight},250);
							$('#popSearch li').hover(function(){
								acUpdateIndex($('#popSearch li').index(this)+1);
							});
						} else {
							$('#popSearch').hide();
							$('#searchField').attr('aria-expanded','false');
						}
					}).fail(function() {
						$('#popSearch').hide();
						$('#searchField').attr('aria-expanded','false');
					});						
				},100);
			} else {
				clearTimeout(acSearchLimit);
				if(acRequest&&acRequest.readystate!=4){acRequest.abort();}
				$('#popSearch').slideUp(250);
				$('#searchField').attr('aria-expanded','false');
			}				
		} else if(e.keyCode==40){
			acUpdateIndex('D');
		} else if(e.keyCode==38){
			acUpdateIndex('U');					
		}				
	}).blur(function(){
		clearTimeout(acSearchLimit);
		if(acRequest&&acRequest.readystate!=4){acRequest.abort();}
		setTimeout(function(){$('#popSearch').slideUp(250);},1000);
		$('#searchField').attr('aria-expanded','false');
		acSelItem=0;
	});
	
	$(window).resize(function(){
		$('#popSearch').css('left',$('#searchField').offset().left+'px');
		if($('#profileLink').length){$('#userContextMenu').css('left',$('#profileLink').offset().left+'px').css('width',($('#profileLink').outerWidth()+$('#myMessagesLink').outerWidth()+$('#myPageLink').outerWidth()-2)+'px');}
	});

	(function(){
		var u="https://analitik.turkiye.gov.tr/";
		_paq.push(['setTrackerUrl',u+'analitik.php']);			
		_paq.push(['setSiteId',1]);
		if (window!=top){_paq.push(['setCustomVariable',1,'ParentFrame',document.referrer.substr(0,200),'page']);}
		_paq.push(['trackPageView']);
		_paq.push(['enableLinkTracking']);		
		var d=document,g=d.createElement('script'),s=d.getElementsByTagName('script')[0];g.type='text/javascript';g.defer=true;g.async=true;g.src=u+'analitik.js';s.parentNode.insertBefore(g,s);
	})();
});