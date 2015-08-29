/* CalendarView for Jquery - Based on CalendarView for Prototype http://calendarview.org/ which is based on Dynarch DHTML Calendar http://www.dynarch.com/projects/calendar/old */
(function($){var Calendar=function(){this.date=new Date();};Calendar.VERSION='1.2';Calendar.TODAY='Bugün';Calendar.DAY_NAMES=new Array('Pazar','Pazartesi','Salı','Çarşamba','Perşembe','Cuma','Cumartesi');Calendar.SHORT_DAY_NAMES=new Array('Pz','Pt','Sa','Ça','Pe','Cu','Ct');Calendar.MONTH_NAMES=new Array('Ocak','Şubat','Mart','Nisan','Mayıs','Haziran','Temmuz','Ağustos','Eylül','Ekim','Kasım','Aralık');Calendar.SHORT_MONTH_NAMES=new Array('Oca','Şub','Mar','Nis','May','Haz','Tem','Ağu','Eyl','Eki','Kas','Ara');Calendar.NAV_PREVIOUS_YEAR=-2;Calendar.NAV_PREVIOUS_MONTH=-1;Calendar.NAV_TODAY=0;Calendar.NAV_NEXT_MONTH=1;Calendar.NAV_NEXT_YEAR=2;Calendar._checkCalendar=function(event){if(!window._popupCalendar){return false;}if($(event.target).parents().index($(window._popupCalendar.container))>=0){return false;}window._popupCalendar.callCloseHandler();return event.preventDefault();};Calendar.handleMouseDownEvent=function(event){$(document).mouseup(Calendar.handleMouseUpEvent);event.preventDefault();};Calendar.handleMouseUpEvent=function(event){var el=event.target;var calendar=el.calendar;var isNewDate=false;if(!calendar){return false;}if(typeof el.navAction=='undefined'){if(calendar.currentDateElement){calendar.currentDateElement.removeClass('selected');$(el).addClass('selected');calendar.shouldClose=(calendar.currentDateElement==$(el));if(!calendar.shouldClose){calendar.currentDateElement=$(el);}}calendar.date.setDateOnly(el.date);isNewDate=true;calendar.shouldClose=!$(el).hasClass('otherDay');var isOtherMonth=!calendar.shouldClose;if(isOtherMonth){calendar.update(calendar.date);}}else{var date=new Date(calendar.date);if(el.navAction==Calendar.NAV_TODAY){date.setDateOnly(new Date());}var year=date.getFullYear();var mon=date.getMonth();function setMonth(m){var day=date.getDate();var max=date.getMonthDays(m);if(day>max){date.setDate(max);}date.setMonth(m);};switch(el.navAction){case Calendar.NAV_PREVIOUS_YEAR:if(year>calendar.minYear){date.setFullYear(year-1);}break;case Calendar.NAV_PREVIOUS_MONTH:if(mon>0){setMonth(mon-1);}else if(year-- >calendar.minYear){date.setFullYear(year);setMonth(11);}break;case Calendar.NAV_TODAY:break;case Calendar.NAV_NEXT_MONTH:if(mon<11){setMonth(mon+1);}else if(year<calendar.maxYear){date.setFullYear(year+1);setMonth(0);}break;case Calendar.NAV_NEXT_YEAR:if(year<calendar.maxYear)date.setFullYear(year+1);break;}if(!date.equalsTo(calendar.date)){calendar.shouldClose=false;calendar.setDate(date);isNewDate=true;}else if(el.navAction==0){isNewDate=(calendar.shouldClose=true);}}if(isNewDate)event&&calendar.callSelectHandler();if(calendar.shouldClose)event&&calendar.callCloseHandler();$(document).unbind('mouseup',Calendar.handleMouseUpEvent);return event.preventDefault();};Calendar.defaultSelectHandler=function(calendar){if(!calendar.dateField){return false;}(calendar.dateField.prop('tagName')=='INPUT')?calendar.dateField.val(calendar.date.print(calendar.dateFormat)):calendar.dateField.html(calendar.date.print(calendar.dateFormat));calendar.dateField.trigger('change');if(calendar.shouldClose){calendar.callCloseHandler();}return true;};Calendar.defaultCloseHandler=function(calendar){calendar.hide();};Calendar.prototype={container:null,date:null,currentDateElement:null,shouldClose:false,isPopup:true,update:function(date){var calendar=this;var today=new Date();var thisYear=today.getFullYear();var thisMonth=today.getMonth();var thisDay=today.getDate();var month=date.getMonth();var dayOfMonth=date.getDate();if(date.getFullYear()<this.minYear){date.setFullYear(this.minYear);}else if(date.getFullYear()>this.maxYear){date.setFullYear(this.maxYear);}this.date=new Date(date);date.setDate(1);var day1=(date.getDay()-this.firstDayOfWeek)%7;if(day1<0)day1+=7;date.setDate(-day1);date.setDate(date.getDate()+1);$('tbody tr',this.container).each(function(){var rowHasDays=false;$(this).children().each(function(){var day=date.getDate();var dayOfWeek=date.getDay();var isCurrentMonth=(date.getMonth()==month);cell=$(this);cell.removeAttr('class');cell[0].date=new Date(date);cell.html(day);if(!isCurrentMonth){cell.addClass('otherDay');}else{rowHasDays=true;}if(isCurrentMonth&&day==dayOfMonth){cell.addClass('selected');calendar.currentDateElement=cell;}if(date.getFullYear()==thisYear&&date.getMonth()==thisMonth&&day==thisDay){cell.addClass('today');}if(calendar.weekend.indexOf(dayOfWeek.toString())!=-1){cell.addClass('weekend');}date.setDate(day+1);});!rowHasDays?$(this).hide():$(this).show();});$('td.title',this.container).html(Calendar.MONTH_NAMES[month]+' '+calendar.date.getFullYear());},create:function(parent){this.isPopup=false;if(!parent){parent=$('body');this.isPopup=true;}var table=$('<table/>');var thead=$('<thead />');table.append(thead);var row=$('<tr />');var cell=$('<td colspan="7" class="title" />');row.append(cell);thead.append(row);row=$('<tr />');this._drawButtonCell(row,'«',1,Calendar.NAV_PREVIOUS_YEAR);this._drawButtonCell(row,'‹',1,Calendar.NAV_PREVIOUS_MONTH);this._drawButtonCell(row,Calendar.TODAY,3,Calendar.NAV_TODAY);this._drawButtonCell(row,'›',1,Calendar.NAV_NEXT_MONTH);this._drawButtonCell(row,'»',1,Calendar.NAV_NEXT_YEAR);thead.append(row);row=$('<tr />');for(var i=0;i<7;++i){var realDay=(i+this.firstDayOfWeek)%7;cell=$('<th />').html(Calendar.SHORT_DAY_NAMES[realDay]);if(this.weekend.indexOf(realDay.toString())!=-1)cell.addClass('weekend');row.append(cell);}thead.append(row);var tbody=table.append($('<tbody />'));for(i=6;i>0;--i){row=$('<tr />').addClass('days');tbody.append(row);for(var j=7;j>0;--j){cell=$('<td />');cell[0].calendar=this;row.append(cell);}}this.container=$('<div />').addClass('calendar').append(table);if(this.isPopup){this.container.css({position:'absolute',display:'none'}).addClass('popup');}this.update(this.date);this.container.mousedown(Calendar.handleMouseDownEvent);parent.append(this.container);},_drawButtonCell:function(parent,text,colSpan,navAction){var cell=$('<td />');if(colSpan>1)cell[0].colSpan=colSpan;cell.addClass('button').html(text).attr('unselectable','on');cell[0].calendar=this;cell[0].navAction=navAction;parent.append(cell);return cell;},callSelectHandler:function(){if(this.selectHandler){this.selectHandler(this,this.date.print(this.dateFormat));}},callCloseHandler:function(){if(this.closeHandler){this.closeHandler(this);}},show:function(){this.container.show();if(this.isPopup){window._popupCalendar=this;$(document).mousedown(Calendar._checkCalendar);}},showAt:function(x,y){this.container.css({left:x+'px',top:y+'px'});this.show();},showAtElement:function(element){var offset=element.offset();this.showAt(offset.left,offset.top);},hide:function(){if(this.isPopup){$(document).unbind('mousedown',Calendar._checkCalendar);}this.container.hide();},parseDate:function(str,format){if(!format){format=this.dateFormat;}this.setDate(Date.parseDate(str,format));},setDate:function(date){if(!date.equalsTo(this.date))this.update(date);},setRange:function(minYear,maxYear){this.minYear=minYear;this.maxYear=maxYear;}};window._popupCalendar=null;Date.DAYS_IN_MONTH=new Array(31,28,31,30,31,30,31,31,30,31,30,31);Date.SECOND=1000;Date.MINUTE=60*Date.SECOND;Date.HOUR=60*Date.MINUTE;Date.DAY=24*Date.HOUR;Date.WEEK=7*Date.DAY;Date.parseDate=function(str,fmt){var today=new Date();var y=0;var m=-1;var d=0;var a=str.split(/\W+/);var b=fmt.match(/%./g);var i=0,j=0;var hr=0;var min=0;for(i=0;i<a.length;++i){if(!a[i])continue;switch(b[i]){case"%d":case"%e":d=parseInt(a[i],10);break;case"%m":m=parseInt(a[i],10)-1;break;case"%Y":case"%y":y=parseInt(a[i],10);(y<100)&&(y+=(y>29)?1900:2000);break;case"%b":case"%B":for(j=0;j<12;++j){if(Calendar.MONTH_NAMES[j].substr(0,a[i].length).toLowerCase()==a[i].toLowerCase()){m=j;break;}}break;case"%H":case"%I":case"%k":case"%l":hr=parseInt(a[i],10);break;case"%P":case"%p":if(/pm/i.test(a[i])&&hr<12)hr+=12;else if(/am/i.test(a[i])&&hr>=12)hr-=12;break;case"%M":min=parseInt(a[i],10);break;}}if(isNaN(y))y=today.getFullYear();if(isNaN(m))m=today.getMonth();if(isNaN(d))d=today.getDate();if(isNaN(hr))hr=today.getHours();if(isNaN(min))min=today.getMinutes();if(y!=0&&m!=-1&&d!=0)return new Date(y,m,d,hr,min,0);y=0;m=-1;d=0;for(i=0;i<a.length;++i){if(a[i].search(/[a-zA-Z]+/)!=-1){var t=-1;for(j=0;j<12;++j){if(Calendar.MONTH_NAMES[j].substr(0,a[i].length).toLowerCase()==a[i].toLowerCase()){t=j;break;}}if(t!=-1){if(m!=-1){d=m+1;}m=t;}}else if(parseInt(a[i],10)<=12&&m==-1){m=a[i]-1;}else if(parseInt(a[i],10)>31&&y==0){y=parseInt(a[i],10);(y<100)&&(y+=(y>29)?1900:2000);}else if(d==0){d=a[i];}}if(y==0)y=today.getFullYear();if(m!=-1&&d!=0)return new Date(y,m,d,hr,min,0);return today;};Date.prototype.getMonthDays=function(month){var year=this.getFullYear();if(typeof month=="undefined")month=this.getMonth();if(((0==(year%4))&&((0!=(year%100))||(0==(year%400))))&&month==1){return 29;}else{return Date.DAYS_IN_MONTH[month];}};Date.prototype.getDayOfYear=function(){var now=new Date(this.getFullYear(),this.getMonth(),this.getDate(),0,0,0);var then=new Date(this.getFullYear(),0,0,0,0,0);var time=now-then;return Math.floor(time/Date.DAY);};Date.prototype.getWeekNumber=function(){var d=new Date(this.getFullYear(),this.getMonth(),this.getDate(),0,0,0);var DoW=d.getDay();d.setDate(d.getDate()-(DoW+6)%7+3);var ms=d.valueOf();d.setMonth(0);d.setDate(4);return Math.round((ms-d.valueOf())/(7*864e5))+1;};Date.prototype.equalsTo=function(date){return((this.getFullYear()==date.getFullYear())&&(this.getMonth()==date.getMonth())&&(this.getDate()==date.getDate())&&(this.getHours()==date.getHours())&&(this.getMinutes()==date.getMinutes()));};Date.prototype.setDateOnly=function(date){var tmp=new Date(date);this.setDate(1);this.setFullYear(tmp.getFullYear());this.setMonth(tmp.getMonth());this.setDate(tmp.getDate());};Date.prototype.print=function(str){var m=this.getMonth();var d=this.getDate();var y=this.getFullYear();var wn=this.getWeekNumber();var w=this.getDay();var s={};var hr=this.getHours();var pm=(hr>=12);var ir=(pm)?(hr-12):hr;var dy=this.getDayOfYear();if(ir==0)ir=12;var min=this.getMinutes();var sec=this.getSeconds();s["%a"]=Calendar.SHORT_DAY_NAMES[w];s["%A"]=Calendar.DAY_NAMES[w];s["%b"]=Calendar.SHORT_MONTH_NAMES[m];s["%B"]=Calendar.MONTH_NAMES[m];s["%C"]=1+Math.floor(y/100);s["%d"]=(d<10)?("0"+d):d;s["%e"]=d;s["%H"]=(hr<10)?("0"+hr):hr;s["%I"]=(ir<10)?("0"+ir):ir;s["%j"]=(dy<100)?((dy<10)?("00"+dy):("0"+dy)):dy;s["%k"]=hr;s["%l"]=ir;s["%m"]=(m<9)?("0"+(1+m)):(1+m);s["%M"]=(min<10)?("0"+min):min;s["%n"]="\n";s["%p"]=pm?"PM":"AM";s["%P"]=pm?"pm":"am";s["%s"]=Math.floor(this.getTime()/1000);s["%S"]=(sec<10)?("0"+sec):sec;s["%t"]="\t";s["%U"]=s["%W"]=s["%V"]=(wn<10)?("0"+wn):wn;s["%u"]=w+1;s["%w"]=w;s["%y"]=(''+y).substr(2,2);s["%Y"]=y;s["%%"]="%";var re=/%./g;var a=str.match(re);for(var i=0;i<a.length;i++){var tmp=s[a[i]];if(tmp){re=new RegExp(a[i],'g');str=str.replace(re,tmp);}}return str;};Date.prototype.__msh_oldSetFullYear=Date.prototype.setFullYear;Date.prototype.setFullYear=function(y){var d=new Date(this);d.__msh_oldSetFullYear(y);if(d.getMonth()!=this.getMonth())this.setDate(28);this.__msh_oldSetFullYear(y);};$.fn.calendar=function(options){var defaults={triggerElement:null,parentElement:null,minYear:1900,maxYear:2100,firstDayOfWeek:1,weekend:"0,6",dateFormat:'%d/%m/%Y',dateField:null,selectHandler:null,closeHandler:null};var settings=$.extend({},defaults,options);this.each(function(){var self=$(this);var calendar=new Calendar();calendar.minYear=settings.minYear;calendar.maxYear=settings.maxYear;calendar.firstDayOfWeek=settings.firstDayOfWeek;calendar.weekend=settings.weekend;calendar.dateFormat=settings.dateFormat;calendar.dateField=(settings.dateField||self);calendar.selectHandler=(settings.selectHandler||Calendar.defaultSelectHandler);var selfDate=self.html()||self.val();if(settings.parentElement){calendar.create($(settings.parentElement));if(selfDate)calendar.parseDate(selfDate);calendar.show();}else{calendar.create();if(selfDate)calendar.parseDate(selfDate);var triggerElement=$(settings.triggerElement||self);triggerElement.click(function(){calendar.closeHandler=(settings.closeHandler||Calendar.defaultCloseHandler);calendar.showAtElement(triggerElement);return false;});triggerElement.keydown(function(e){if(e.keyCode==27 || e.keyCode==9){calendar.hide();}});}});return this;};})(jQuery);
/* Date picker Stefan Petre www.eyecon.ro */
!function(e){var a=function(){var a={years:"datepickerViewYears",moths:"datepickerViewMonths",days:"datepickerViewDays"},t={wrapper:'<div class="datepicker"><div class="datepickerContainer"><table cellspacing="0" cellpadding="0"><tbody><tr></tr></tbody></table></div></div>',head:["<td>",'<table cellspacing="0" cellpadding="0">',"<thead>","<tr>",'<th class="datepickerGoPrev"><a href="#"><span><%=prev%></span></a></th>','<th colspan="5" class="datepickerMonth"><a href="#"><span></span></a></th>','<th class="datepickerGoNext"><a href="#"><span><%=next%></span></a></th>',"</tr>",'<tr class="datepickerDoW">','<th style="display:none"><span><%=week%></span></th>',"<th><span><%=day1%></span></th>","<th><span><%=day2%></span></th>","<th><span><%=day3%></span></th>","<th><span><%=day4%></span></th>","<th><span><%=day5%></span></th>","<th><span><%=day6%></span></th>","<th><span><%=day7%></span></th>","</tr>","</thead>","</table></td>"],space:'<td class="datepickerSpace"><div></div></td>',days:['<tbody class="datepickerDays">',"<tr>",'<th class="datepickerWeek" style="display:none"><a href="#"><span><%=weeks[0].week%></span></a></th>','<td class="<%=weeks[0].days[0].classname%>"><a href="#"><span><%=weeks[0].days[0].text%></span></a></td>','<td class="<%=weeks[0].days[1].classname%>"><a href="#"><span><%=weeks[0].days[1].text%></span></a></td>','<td class="<%=weeks[0].days[2].classname%>"><a href="#"><span><%=weeks[0].days[2].text%></span></a></td>','<td class="<%=weeks[0].days[3].classname%>"><a href="#"><span><%=weeks[0].days[3].text%></span></a></td>','<td class="<%=weeks[0].days[4].classname%>"><a href="#"><span><%=weeks[0].days[4].text%></span></a></td>','<td class="<%=weeks[0].days[5].classname%>"><a href="#"><span><%=weeks[0].days[5].text%></span></a></td>','<td class="<%=weeks[0].days[6].classname%>"><a href="#"><span><%=weeks[0].days[6].text%></span></a></td>',"</tr>","<tr>",'<th class="datepickerWeek" style="display:none"><a href="#"><span><%=weeks[1].week%></span></a></th>','<td class="<%=weeks[1].days[0].classname%>"><a href="#"><span><%=weeks[1].days[0].text%></span></a></td>','<td class="<%=weeks[1].days[1].classname%>"><a href="#"><span><%=weeks[1].days[1].text%></span></a></td>','<td class="<%=weeks[1].days[2].classname%>"><a href="#"><span><%=weeks[1].days[2].text%></span></a></td>','<td class="<%=weeks[1].days[3].classname%>"><a href="#"><span><%=weeks[1].days[3].text%></span></a></td>','<td class="<%=weeks[1].days[4].classname%>"><a href="#"><span><%=weeks[1].days[4].text%></span></a></td>','<td class="<%=weeks[1].days[5].classname%>"><a href="#"><span><%=weeks[1].days[5].text%></span></a></td>','<td class="<%=weeks[1].days[6].classname%>"><a href="#"><span><%=weeks[1].days[6].text%></span></a></td>',"</tr>","<tr>",'<th class="datepickerWeek" style="display:none"><a href="#"><span><%=weeks[2].week%></span></a></th>','<td class="<%=weeks[2].days[0].classname%>"><a href="#"><span><%=weeks[2].days[0].text%></span></a></td>','<td class="<%=weeks[2].days[1].classname%>"><a href="#"><span><%=weeks[2].days[1].text%></span></a></td>','<td class="<%=weeks[2].days[2].classname%>"><a href="#"><span><%=weeks[2].days[2].text%></span></a></td>','<td class="<%=weeks[2].days[3].classname%>"><a href="#"><span><%=weeks[2].days[3].text%></span></a></td>','<td class="<%=weeks[2].days[4].classname%>"><a href="#"><span><%=weeks[2].days[4].text%></span></a></td>','<td class="<%=weeks[2].days[5].classname%>"><a href="#"><span><%=weeks[2].days[5].text%></span></a></td>','<td class="<%=weeks[2].days[6].classname%>"><a href="#"><span><%=weeks[2].days[6].text%></span></a></td>',"</tr>","<tr>",'<th class="datepickerWeek" style="display:none"><a href="#"><span><%=weeks[3].week%></span></a></th>','<td class="<%=weeks[3].days[0].classname%>"><a href="#"><span><%=weeks[3].days[0].text%></span></a></td>','<td class="<%=weeks[3].days[1].classname%>"><a href="#"><span><%=weeks[3].days[1].text%></span></a></td>','<td class="<%=weeks[3].days[2].classname%>"><a href="#"><span><%=weeks[3].days[2].text%></span></a></td>','<td class="<%=weeks[3].days[3].classname%>"><a href="#"><span><%=weeks[3].days[3].text%></span></a></td>','<td class="<%=weeks[3].days[4].classname%>"><a href="#"><span><%=weeks[3].days[4].text%></span></a></td>','<td class="<%=weeks[3].days[5].classname%>"><a href="#"><span><%=weeks[3].days[5].text%></span></a></td>','<td class="<%=weeks[3].days[6].classname%>"><a href="#"><span><%=weeks[3].days[6].text%></span></a></td>',"</tr>","<tr>",'<th class="datepickerWeek" style="display:none"><a href="#"><span><%=weeks[4].week%></span></a></th>','<td class="<%=weeks[4].days[0].classname%>"><a href="#"><span><%=weeks[4].days[0].text%></span></a></td>','<td class="<%=weeks[4].days[1].classname%>"><a href="#"><span><%=weeks[4].days[1].text%></span></a></td>','<td class="<%=weeks[4].days[2].classname%>"><a href="#"><span><%=weeks[4].days[2].text%></span></a></td>','<td class="<%=weeks[4].days[3].classname%>"><a href="#"><span><%=weeks[4].days[3].text%></span></a></td>','<td class="<%=weeks[4].days[4].classname%>"><a href="#"><span><%=weeks[4].days[4].text%></span></a></td>','<td class="<%=weeks[4].days[5].classname%>"><a href="#"><span><%=weeks[4].days[5].text%></span></a></td>','<td class="<%=weeks[4].days[6].classname%>"><a href="#"><span><%=weeks[4].days[6].text%></span></a></td>',"</tr>","<tr>",'<th class="datepickerWeek" style="display:none"><a href="#"><span><%=weeks[5].week%></span></a></th>','<td class="<%=weeks[5].days[0].classname%>"><a href="#"><span><%=weeks[5].days[0].text%></span></a></td>','<td class="<%=weeks[5].days[1].classname%>"><a href="#"><span><%=weeks[5].days[1].text%></span></a></td>','<td class="<%=weeks[5].days[2].classname%>"><a href="#"><span><%=weeks[5].days[2].text%></span></a></td>','<td class="<%=weeks[5].days[3].classname%>"><a href="#"><span><%=weeks[5].days[3].text%></span></a></td>','<td class="<%=weeks[5].days[4].classname%>"><a href="#"><span><%=weeks[5].days[4].text%></span></a></td>','<td class="<%=weeks[5].days[5].classname%>"><a href="#"><span><%=weeks[5].days[5].text%></span></a></td>','<td class="<%=weeks[5].days[6].classname%>"><a href="#"><span><%=weeks[5].days[6].text%></span></a></td>',"</tr>","</tbody>"],months:['<tbody class="<%=className%>">',"<tr>",'<td colspan="2"><a href="#"><span><%=data[0]%></span></a></td>','<td colspan="2"><a href="#"><span><%=data[1]%></span></a></td>','<td colspan="2"><a href="#"><span><%=data[2]%></span></a></td>','<td colspan="2"><a href="#"><span><%=data[3]%></span></a></td>',"</tr>","<tr>",'<td colspan="2"><a href="#"><span><%=data[4]%></span></a></td>','<td colspan="2"><a href="#"><span><%=data[5]%></span></a></td>','<td colspan="2"><a href="#"><span><%=data[6]%></span></a></td>','<td colspan="2"><a href="#"><span><%=data[7]%></span></a></td>',"</tr>","<tr>",'<td colspan="2"><a href="#"><span><%=data[8]%></span></a></td>','<td colspan="2"><a href="#"><span><%=data[9]%></span></a></td>','<td colspan="2"><a href="#"><span><%=data[10]%></span></a></td>','<td colspan="2"><a href="#"><span><%=data[11]%></span></a></td>',"</tr>","</tbody>"]},n={flat:!1,starts:1,prev:"&#9664;",next:"&#9654;",lastSel:!1,mode:"single",view:"days",calendars:1,format:"Y-m-d",position:"bottom",eventName:"dblclick",onRender:function(){return{}},onChange:function(){return!0},onShow:function(){return!0},onBeforeShow:function(){return!0},onHide:function(){return!0},locale:{days:["Pazar","Pazartesi","Salı","Çarşamba","Perşembe","Cuma","Cumartesi","Pazar"],daysShort:["Paz","Pzt","Sal","Çar","Per","Cum","Cmt","Paz"],daysMin:["Pz","Pt","Sa","Ça","Pe","Cu","Ct","Pz"],months:["Ocak","Şubat","Mart","Nisan","Mayıs","Haziran","Temmuz","Ağustos","Eylül","Ekim","Kasım","Aralık"],monthsShort:["Oca","Şub","Mar","Nis","May","Haz","Tem","Ağu","Eyl","Eki","Kas","Ara"],weekMin:"H"}},d=function(a){var s,n,d,r,c,p,l,o,h,k=e(a).data("datepicker"),f=e(a),y=Math.floor(k.calendars/2),u=0;f.find("td>table tbody").remove();for(var m=0;m<k.calendars;m++){switch(s=new Date(k.current),s.addMonths(-y+m),h=f.find("table").eq(m+1),h[0].className){case"datepickerViewDays":d=i(s,"B, Y");break;case"datepickerViewMonths":d=s.getFullYear();break;case"datepickerViewYears":d=s.getFullYear()-6+" - "+(s.getFullYear()+5)}h.find("thead tr:first th:eq(1) span").text(d),d=s.getFullYear()-6,n={data:[],className:"datepickerYears"};for(var w=0;12>w;w++)n.data.push(d+w);o=tmpl(t.months.join(""),n),s.setDate(1),n={weeks:[],test:10},r=s.getMonth();var d=(s.getDay()-k.starts)%7;for(s.addDays(-(d+(0>d?7:0))),c=-1,u=0;42>u;){p=parseInt(u/7,10),l=u%7,n.weeks[p]||(c=s.getWeekNumber(),n.weeks[p]={week:c,days:[]}),n.weeks[p].days[l]={text:s.getDate(),classname:[]},r!=s.getMonth()&&n.weeks[p].days[l].classname.push("datepickerNotInMonth"),0==s.getDay()&&n.weeks[p].days[l].classname.push("datepickerSunday"),6==s.getDay()&&n.weeks[p].days[l].classname.push("datepickerSaturday");var g=k.onRender(s),D=s.valueOf();(g.selected||k.date==D||e.inArray(D,k.date)>-1||"range"==k.mode&&D>=k.date[0]&&D<=k.date[1])&&n.weeks[p].days[l].classname.push("datepickerSelected"),g.disabled&&n.weeks[p].days[l].classname.push("datepickerDisabled"),g.className&&n.weeks[p].days[l].classname.push(g.className),n.weeks[p].days[l].classname=n.weeks[p].days[l].classname.join(" "),u++,s.addDays(1)}o=tmpl(t.days.join(""),n)+o,n={data:k.locale.monthsShort,className:"datepickerMonths"},o=tmpl(t.months.join(""),n)+o,h.append(o)}},r=function(e,a){if(e.constructor==Date)return new Date(e);for(var t,n,d,r,i=e.split(/\W+/),c=a.split(/\W+/),p=new Date,l=0;l<i.length;l++)switch(c[l]){case"d":case"e":t=parseInt(i[l],10);break;case"m":n=parseInt(i[l],10)-1;break;case"Y":case"y":d=parseInt(i[l],10),d+=d>100?0:29>d?2e3:1900;break;case"H":case"I":case"k":case"l":r=parseInt(i[l],10);break;case"P":case"p":/pm/i.test(i[l])&&12>r?r+=12:/am/i.test(i[l])&&r>=12&&(r-=12);break;case"M":s=parseInt(i[l],10)}return("number"!=typeof d||isNaN(d))&&(d=p.getFullYear()),("number"!=typeof n||isNaN(n))&&(n=p.getMonth()),("number"!=typeof t||isNaN(t))&&(t=p.getDate()),("number"!=typeof r||isNaN(r))&&(r=p.getHours()),("number"!=typeof s||isNaN(s))&&(s=p.getMinutes()),new Date(d,n,t,r,s,0)},i=function(e,a){var t=e.getMonth(),s=e.getDate(),n=e.getFullYear(),d=(e.getWeekNumber(),e.getDay()),r=e.getHours(),i=r>=12,c=i?r-12:r,p=e.getDayOfYear();0==c&&(c=12);for(var l,o=e.getMinutes(),h=e.getSeconds(),k=a.split(""),f=0;f<k.length;f++){switch(l=k[f],k[f]){case"a":l=e.getDayName();break;case"A":l=e.getDayName(!0);break;case"b":l=e.getMonthName();break;case"B":l=e.getMonthName(!0);break;case"C":l=1+Math.floor(n/100);break;case"d":l=10>s?"0"+s:s;break;case"e":l=s;break;case"H":l=10>r?"0"+r:r;break;case"I":l=10>c?"0"+c:c;break;case"j":l=100>p?10>p?"00"+p:"0"+p:p;break;case"k":l=r;break;case"l":l=c;break;case"m":l=9>t?"0"+(1+t):1+t;break;case"M":l=10>o?"0"+o:o;break;case"p":case"P":l=i?"PM":"AM";break;case"s":l=Math.floor(e.getTime()/1e3);break;case"S":l=10>h?"0"+h:h;break;case"u":l=d+1;break;case"w":l=d;break;case"y":l=(""+n).substr(2,2);break;case"Y":l=n}k[f]=l}return k.join("")},c=function(e){Date.prototype.tempDate||(Date.prototype.tempDate=null,Date.prototype.months=e.months,Date.prototype.monthsShort=e.monthsShort,Date.prototype.days=e.days,Date.prototype.daysShort=e.daysShort,Date.prototype.getMonthName=function(e){return this[e?"months":"monthsShort"][this.getMonth()]},Date.prototype.getDayName=function(e){return this[e?"days":"daysShort"][this.getDay()]},Date.prototype.addDays=function(e){this.setDate(this.getDate()+e),this.tempDate=this.getDate()},Date.prototype.addMonths=function(e){null==this.tempDate&&(this.tempDate=this.getDate()),this.setDate(1),this.setMonth(this.getMonth()+e),this.setDate(Math.min(this.tempDate,this.getMaxDays()))},Date.prototype.addYears=function(e){null==this.tempDate&&(this.tempDate=this.getDate()),this.setDate(1),this.setFullYear(this.getFullYear()+e),this.setDate(Math.min(this.tempDate,this.getMaxDays()))},Date.prototype.getMaxDays=function(){var e,a=new Date(Date.parse(this)),t=28;for(e=a.getMonth(),t=28;a.getMonth()==e;)t++,a.setDate(t);return t-1},Date.prototype.getFirstDay=function(){var e=new Date(Date.parse(this));return e.setDate(1),e.getDay()},Date.prototype.getWeekNumber=function(){var e=new Date(this);e.setDate(e.getDate()-(e.getDay()+6)%7+3);var a=e.valueOf();return e.setMonth(0),e.setDate(4),Math.round((a-e.valueOf())/6048e5)+1},Date.prototype.getDayOfYear=function(){var e=new Date(this.getFullYear(),this.getMonth(),this.getDate(),0,0,0),a=new Date(this.getFullYear(),0,0,0,0,0),t=e-a;return Math.floor(t/24*60*60*1e3)})},p=function(a){var t=e(a).data("datepicker"),s=e("#"+t.id);if(!t.extraHeight){e(a).find("div")}var n=s.find("table:first").get(0),d=n.offsetWidth,r=n.offsetHeight;s.css({width:d+t.extraWidth+"px",height:r+t.extraHeight+"px"}).find("div.datepickerContainer").css({width:d+"px",height:r+"px"})},l=function(a){e(a.target).is("span")&&(a.target=a.target.parentNode);var t=e(a.target);if(t.is("a")){if(a.target.blur(),t.hasClass("datepickerDisabled"))return!1;var s=e(this).data("datepicker"),n=t.parent(),r=n.parent().parent().parent(),c=e("table",this).index(r.get(0))-1,p=new Date(s.current),l=!1,h=!1;if(n.is("th")){if(n.hasClass("datepickerWeek")&&"range"==s.mode&&!n.next().hasClass("datepickerDisabled")){var k=parseInt(n.next().text(),10);p.addMonths(c-Math.floor(s.calendars/2)),n.next().hasClass("datepickerNotInMonth")&&p.addMonths(k>15?-1:1),p.setDate(k),s.date[0]=p.setHours(0,0,0,0).valueOf(),p.setHours(23,59,59,0),p.addDays(6),s.date[1]=p.valueOf(),h=!0,l=!0,s.lastSel=!1}else if(n.hasClass("datepickerMonth"))switch(p.addMonths(c-Math.floor(s.calendars/2)),r.get(0).className){case"datepickerViewDays":r.get(0).className="datepickerViewMonths",t.find("span").text(p.getFullYear());break;case"datepickerViewMonths":r.get(0).className="datepickerViewYears",t.find("span").text(p.getFullYear()-6+" - "+(p.getFullYear()+5));break;case"datepickerViewYears":r.get(0).className="datepickerViewDays",t.find("span").text(i(p,"B, Y"))}else if(n.parent().parent().is("thead")){switch(r.get(0).className){case"datepickerViewDays":s.current.addMonths(n.hasClass("datepickerGoPrev")?-1:1);break;case"datepickerViewMonths":s.current.addYears(n.hasClass("datepickerGoPrev")?-1:1);break;case"datepickerViewYears":s.current.addYears(n.hasClass("datepickerGoPrev")?-12:12)}h=!0}}else if(n.is("td")&&!n.hasClass("datepickerDisabled")){switch(r.get(0).className){case"datepickerViewMonths":s.current.setMonth(r.find("tbody.datepickerMonths td").index(n)),s.current.setFullYear(parseInt(r.find("thead th.datepickerMonth span").text(),10)),s.current.addMonths(Math.floor(s.calendars/2)-c),r.get(0).className="datepickerViewDays";break;case"datepickerViewYears":s.current.setFullYear(parseInt(t.text(),10)),r.get(0).className="datepickerViewMonths";break;default:var k=parseInt(t.text(),10);switch(p.addMonths(c-Math.floor(s.calendars/2)),n.hasClass("datepickerNotInMonth")&&p.addMonths(k>15?-1:1),p.setDate(k),s.mode){case"multiple":k=p.setHours(0,0,0,0).valueOf(),e.inArray(k,s.date)>-1?e.each(s.date,function(e,a){return a==k?(s.date.splice(e,1),!1):void 0}):s.date.push(k);break;case"range":s.lastSel||(s.date[0]=p.setHours(0,0,0,0).valueOf()),k=p.setHours(23,59,59,0).valueOf(),k<s.date[0]?(s.date[1]=s.date[0]+86399e3,s.date[0]=k-86399e3):s.date[1]=k,s.lastSel=!s.lastSel;break;default:s.date=p.valueOf()}}h=!0,l=!0}h&&d(this),l&&s.onChange.apply(this,o(s))}return!1},o=function(a){var t;return"single"==a.mode?(t=new Date(a.date),[i(t,a.format),t,a.el]):(t=[[],[],a.el],e.each(a.date,function(e,s){var n=new Date(s);t[0].push(i(n,a.format)),t[1].push(n)}),t)},h=function(){var e="CSS1Compat"==document.compatMode;return{l:window.pageXOffset||(e?document.documentElement.scrollLeft:document.body.scrollLeft),t:window.pageYOffset||(e?document.documentElement.scrollTop:document.body.scrollTop),w:window.innerWidth||(e?document.documentElement.clientWidth:document.body.clientWidth),h:window.innerHeight||(e?document.documentElement.clientHeight:document.body.clientHeight)}},k=function(e,a,t){if(e==a)return!0;if(e.contains)return e.contains(a);if(e.compareDocumentPosition)return!!(16&e.compareDocumentPosition(a));for(var s=a.parentNode;s&&s!=t;){if(s==e)return!0;s=s.parentNode}return!1},f=function(){var a=e("#"+e(this).data("datepickerId"));if(!a.is(":visible")){var t=a.get(0);d(t);var s=a.data("datepicker");s.onBeforeShow.apply(this,[a.get(0)]);{var n=e(this).offset(),r=h(),i=n.top,c=n.left;e.curCSS(t,"display")}switch(a.css({visibility:"hidden",display:"block"}),p(t),s.position){case"top":i-=t.offsetHeight;break;case"left":c-=t.offsetWidth;break;case"right":c+=this.offsetWidth;break;case"bottom":i+=this.offsetHeight}i+t.offsetHeight>r.t+r.h&&(i=n.top-t.offsetHeight),i<r.t&&(i=n.top+this.offsetHeight+t.offsetHeight),c+t.offsetWidth>r.l+r.w&&(c=n.left-t.offsetWidth),c<r.l&&(c=n.left+this.offsetWidth),a.css({visibility:"visible",display:"block",top:i+"px",left:c+"px"}),0!=s.onShow.apply(this,[a.get(0)])&&a.show(),e(document).bind("mousedown",{cal:a,trigger:this},y)}return!1},y=function(a){a.target==a.data.trigger||k(a.data.cal.get(0),a.target,a.data.cal.get(0))||(0!=a.data.cal.data("datepicker").onHide.apply(this,[a.data.cal.get(0)])&&a.data.cal.hide(),e(document).unbind("mousedown",y))};return{init:function(s){return s=e.extend({},n,s||{}),c(s.locale),s.calendars=Math.max(1,parseInt(s.calendars,10)||1),s.mode=/single|multiple|range/.test(s.mode)?s.mode:"single",this.each(function(){if(!e(this).data("datepicker")){if(s.el=this,s.date.constructor==String&&(s.date=r(s.date,s.format),s.date.setHours(0,0,0,0)),"single"!=s.mode)if(s.date.constructor!=Array)s.date=[s.date.valueOf()],"range"==s.mode&&s.date.push(new Date(s.date[0]).setHours(23,59,59,0).valueOf());else{for(var n=0;n<s.date.length;n++)s.date[n]=r(s.date[n],s.format).setHours(0,0,0,0).valueOf();"range"==s.mode&&(s.date[1]=new Date(s.date[1]).setHours(23,59,59,0).valueOf())}else s.date=s.date.valueOf();s.current=s.current?r(s.current,s.format):new Date,s.current.setDate(1),s.current.setHours(0,0,0,0);var i,c="datepicker_"+parseInt(1e3*Math.random());s.id=c,e(this).data("datepickerId",s.id);var o=e(t.wrapper).attr("id",c).bind("click",l).data("datepicker",s);s.className&&o.addClass(s.className);for(var h="",n=0;n<s.calendars;n++)i=s.starts,n>0&&(h+=t.space),h+=tmpl(t.head.join(""),{week:s.locale.weekMin,prev:s.prev,next:s.next,day1:s.locale.daysMin[i++%7],day2:s.locale.daysMin[i++%7],day3:s.locale.daysMin[i++%7],day4:s.locale.daysMin[i++%7],day5:s.locale.daysMin[i++%7],day6:s.locale.daysMin[i++%7],day7:s.locale.daysMin[i++%7]});o.find("tr:first").append(h).find("table").addClass(a[s.view]),d(o.get(0)),s.flat?(o.appendTo(this).show().css("position","relative"),p(o.get(0))):(o.appendTo(document.body),e(this).bind(s.eventName,f))}})},showPicker:function(){return this.each(function(){e(this).data("datepickerId")&&f.apply(this)})},hidePicker:function(){return this.each(function(){e(this).data("datepickerId")&&e("#"+e(this).data("datepickerId")).hide()})},setDate:function(a,t){return this.each(function(){if(e(this).data("datepickerId")){var s=e("#"+e(this).data("datepickerId")),n=s.data("datepicker");if(n.date=a,n.date.constructor==String&&(n.date=r(n.date,n.format),n.date.setHours(0,0,0,0)),"single"!=n.mode)if(n.date.constructor!=Array)n.date=[n.date.valueOf()],"range"==n.mode&&n.date.push(new Date(n.date[0]).setHours(23,59,59,0).valueOf());else{for(var i=0;i<n.date.length;i++)n.date[i]=r(n.date[i],n.format).setHours(0,0,0,0).valueOf();"range"==n.mode&&(n.date[1]=new Date(n.date[1]).setHours(23,59,59,0).valueOf())}else n.date=n.date.valueOf();t&&(n.current=new Date("single"!=n.mode?n.date[0]:n.date)),d(s.get(0))}})},getDate:function(a){return this.size()>0?o(e("#"+e(this).data("datepickerId")).data("datepicker"))[a?0:1]:void 0},clear:function(){return this.each(function(){if(e(this).data("datepickerId")){var a=e("#"+e(this).data("datepickerId")),t=a.data("datepicker");"single"!=t.mode&&(t.date=[],d(a.get(0)))}})},fixLayout:function(){return this.each(function(){if(e(this).data("datepickerId")){var a=e("#"+e(this).data("datepickerId")),t=a.data("datepicker");t.flat&&p(a.get(0))}})}}}();e.fn.extend({DatePicker:a.init,DatePickerHide:a.hidePicker,DatePickerShow:a.showPicker,DatePickerSetDate:a.setDate,DatePickerGetDate:a.getDate,DatePickerClear:a.clear,DatePickerLayout:a.fixLayout})}(jQuery),function(){var e={};this.tmpl=function a(t,s){var n=/\W/.test(t)?new Function("obj","var p=[],print=function(){p.push.apply(p,arguments);};with(obj){p.push('"+t.replace(/[\r\t\n]/g," ").split("<%").join("	").replace(/((^|%>)[^\t]*)'/g,"$1\r").replace(/\t=(.*?)%>/g,"',$1,'").split("	").join("');").split("%>").join("p.push('").split("\r").join("\\'")+"');}return p.join('');"):e[t]=e[t]||a(document.getElementById(t).innerHTML);return s?n(s):n}}();

var initializeHelpers=function(){
	$("#serviceBlock .formRow").each(function(index){
		var fieldTest=false;
		var helpText="";
		if($(this).children('.fieldHelp').length==1){fieldTest=true;helpText+='<p>'+$(this).children('.fieldHelp').html()+'</p>';}
		if($(this).find('.calendarLink').length>=1){fieldTest=true;helpText+='<p>Bu alan(lar) takvim simgesine tıklayarak ya da GG/AA/YYYY biçiminde doldurulmalıdır.<br><br><strong>Örn:</strong> 15/06/2012</p>';}
		if($(this).find('.multiBox').length>=1){fieldTest=true;helpText+='<p>Bu alanda birden fazla değer seçebilirsiniz. PC için <strong>CTRL</strong>, MAC için <strong>Command⌘</strong> tuşunu basılı tutarak birden fazla seçeneği işaretleyebilirsiniz.</p>';}
		if($(this).find('.addressPicker').length>=1){fieldTest=true;helpText+='<p>Bu alanı doldurmak için, yanında bulunan <strong>"Adres Bul"</strong> bağlantısına tıklayarak ekrandaki yönergeleri takip ediniz.</p>';}
		if($(this).find('.captcha').length>=1){fieldTest=true;helpText+='<p>Lütfen resimde gördüğünüz karakterleri yanında bulunan kutuya giriniz. Bu önlem otomatik sorguları engellemek amacıyla kullanılmaktadır. Güvenlik resmini sesli olarak dinlemek için alanın içinde iken nokta tuşuna basınız.</p>';}
		if($(this).find('.treePickLink').length>=1){fieldTest=true;helpText+='<p>Bu alanı yanında bulunan düğme kullanılarak doldurulmalıdır.</p>';}
		if($(this).children('.text').attr('title')){fieldTest=true;helpText+='<p><strong>Geçerli Biçim:</strong> '+$(this).children('.text').attr('title')+'.</p>';}		
		if($(this).hasClass('required')){fieldTest=true;helpText+='<span class="required">✱ Hizmeti tamamlamak için bu alanı mutlaka doldurmalısınız.</span>';}
		if($(this).children('.text,.textarea').attr('readonly')){fieldTest=true;helpText='<p>Bu alandaki değer otomatik olarak doldurulmuştur, değiştirilemez.</p>';}
		if(fieldTest){
			$(this).hover(function(e){
				$("#floatingHelp").css('top',($(this).offset().top-178)+'px');
				$("#floatingHelp .fieldInfo").html(helpText);
				$("#floatingHelp").stop().clearQueue().fadeTo(500,1);
				if($("#staticHelp").length && $("#floatingHelp").offset().top<($("#staticHelp").offset().top+$("#staticHelp").outerHeight())){$("#staticHelp").stop().clearQueue().fadeTo(500,0.25);}

			},function(e){
				$("#floatingHelp").fadeTo(250,0);
				$("#staticHelp").stop().clearQueue().fadeTo(250,1);
			});
		}
	});
	
	$("input.advdate").each(function(index){
		var currInput=$(this);
		var mode=$(this).attr('data-mode');
		var rangestart=$(this).attr('data-rangestart');
		var rangeend=$(this).attr('data-rangeend');
		var disdates=$(this).attr('data-disdates');
		var size=$(this).attr('data-size');
		
		if(rangestart!=''){
			rangestart=rangestart.split('/',3);
			rangestart=new Date(rangestart[2],rangestart[1]-1,rangestart[0]);
		} else {
			rangestart=false;
		}
		
		if(rangeend!=''){
			rangeend=rangeend.split('/',3);
			rangeend=new Date(rangeend[2],rangeend[1]-1,rangeend[0]);
		} else {
			rangeend=false;
		}
		
		if(disdates!=''){
			disdates=disdates.split('|');
			for (var i=0;i<disdates.length;i++){
				distemp=disdates[i].split('/',3);
				disdates[i]=new Date(distemp[2],distemp[1]-1,distemp[0]).valueOf();
			}
			disdates=disdates.join('|');
		} else {
			disdates=false;
		}
		
		currInput.prev('a.calendarLink').click(function(){currInput.DatePickerShow();});
		currInput.DatePicker({
			format:'d/m/Y',
			flat:false,
			date:currInput.val(),
			start:1,
			calendars:size,
			eventName:'dblclick',
			position:'bottom',
			mode:mode,
			onBeforeShow:function(){
				currInput.DatePickerSetDate(currInput.val(),true);
			},
			onRender:function(date){
				var rangeTest=true;
				if(disdates && disdates.indexOf(date.valueOf())>=0){rangeTest=false;}
				if(rangeTest && rangestart && date.valueOf()<rangestart.valueOf()){rangeTest=false;}
				if(rangeTest && rangeend && date.valueOf()>rangeend.valueOf()){rangeTest=false;}
				return {disabled:!rangeTest}
			},
			onChange:function(formated,dates){
				currInput.val(formated);
				if(mode=='single'){
					currInput.DatePickerHide();
				}
			}
		});
	});
};

var paginateTable=function(table){
	var totalCount=$(table).find('tbody tr').length;
	var rowsPerPage=parseInt($(table).attr("data-paginate"));
	var setPage=parseInt($(table).attr("data-setpage")||1);
	rowsPerPage=rowsPerPage>0?rowsPerPage:10;
	var tableSelector=$(table);
	var vars=[],hash;
	var q=document.URL.split('?')[1];
	if(q != undefined){
		q = q.split('&');
		for(var i = 0; i < q.length; i++){
			hash=q[i].split('=');
			vars.push(hash[1]);
			vars[hash[0]]=hash[1];
		}
	}
	var setPaginationBar=function(totalRowCount,rowCountPerPage,activePage,bar){
		var pageCount=Math.ceil(totalRowCount/rowCountPerPage);
		if(pageCount>1){
			var startRowFrom=(((activePage-1)*rowCountPerPage)+1);
			var endRowAt=(activePage*rowCountPerPage)>totalRowCount?totalRowCount:(activePage*rowCountPerPage);
			var gappedF=gappedL=false;
			var j=3;
			var content="<span>Toplam "+totalRowCount+" kayıttan "+startRowFrom+"-"+Math.min(endRowAt,totalRowCount)+" arası listelenmiştir</span>";
			content+='<ul>';
			content+=activePage==1?'<li class="passive">« Önceki</li>':'<li><a href="#" class="prev">« Önceki</a></li>';
			content+='<li'+ (activePage==1?' class="current"':'') +'><a href="#">'+1+'</a></li>';
			for(var i=2; i<pageCount; i++){
				if(i<activePage-j) {content+=gappedF?'':'<li class="gap">∙∙∙</li>'; gappedF=true; continue; }
				if(i>activePage+j) {content+=gappedL?'':'<li class="gap">∙∙∙</li>'; gappedL=true; continue; }
				content+='<li'+ (activePage==i?' class="current"':'') +'><a href="#">'+i+'</a></li>';
				}
			content+='<li'+ (activePage==pageCount?' class="current"':'') +'><a href="#">'+i+'</a></li>';
			content+=activePage==pageCount?'<li class="passive">Sonraki »</li>':'<li><a href="#" class="next">Sonraki »</a></li>';
			content+='</ul>';
			bar.html(content);
			$(bar).find('ul li a').click(function(activePage){
				var activatePage=parseInt($(this).text());
				var c=$(this).attr("class");
				if(c=='next'){ activatePage= parseInt($(this).parent().siblings('.current').find('a').text())+1; }
				if(c=='prev'){ activatePage= parseInt($(this).parent().siblings('.current').find('a').text())-1; }
				setPaginationBar(totalCount,rowsPerPage,parseInt(activatePage),bar);
				setTableDisplay(tableSelector,(activatePage-1)*rowsPerPage,rowsPerPage);
				return false;
			});
		}
	}
	var setTableDisplay=function(table,startFrom,amount){
		allRows=table.find('tbody tr');
		allRows.addClass('hidden');
		allRows.slice(startFrom,startFrom+parseInt(amount)).removeClass('hidden');
	}
	if(totalCount>rowsPerPage){
		$(tableSelector).after('<div class="tablePagination"></div>');
		var barSelector=$(table).next('.tablePagination');
		if(typeof vars[$(tableSelector).attr('id')] != 'undefined'){
			setPaginationBar(totalCount,rowsPerPage,parseInt(vars[$(tableSelector).attr('id')]),barSelector);
			setTableDisplay(tableSelector,(parseInt(vars[$(tableSelector).attr('id')])-1)*rowsPerPage,rowsPerPage);
		}else{
			setPaginationBar(totalCount,rowsPerPage,setPage,barSelector);
			setTableDisplay(tableSelector,parseInt(setPage-1)*rowsPerPage,rowsPerPage);
		}
	}
};

var processAutoComplete=function(){
	$('#serviceBlock .formRow .text.autocomplete').each(function(i){
		var acCurrentInput=$(this);
		var acCurrentList='#'+$(this).parent().next('.ajaxAC').attr('id');
		var acSearchLimit;
		var acSelItem=0;
		var acRequest;
		var acUpdateIndex=function(dir){
			if(dir=="U"){acSelItem--;} else if(dir=="D"){acSelItem++;}else{acSelItem=dir;}
			if(acSelItem<0){acSelItem=0;}
			if(acSelItem>$(acCurrentList+' li').length){acSelItem=$(acCurrentList+' li').length;}
			$(acCurrentList+' li').removeClass('sel');
			$(acCurrentInput).attr('aria-activedescendant',$(acCurrentList+' li:nth-child('+acSelItem+')').addClass('sel').attr('id'));
			if(dir=="D"||dir=="U"){$(acCurrentInput).val($(acCurrentList+' li:nth-child('+acSelItem+')').text());}
			if(acSelItem>7){
				if(dir=="D"){
					$(acCurrentList+' .scroller').scrollTop($(acCurrentList+' .scroller').scrollTop()+$(acCurrentList+' li:nth-child('+acSelItem+')').outerHeight());
				}else if(dir=="U"){
					$(acCurrentList+' .scroller').scrollTop($(acCurrentList+' .scroller').scrollTop()-$(acCurrentList+' li:nth-child('+acSelItem+')').outerHeight());
				}
			}else if(dir=="D"||dir=="U"){
				$(acCurrentList+' .scroller').scrollTop(0);
			}
		};
		$(acCurrentList).css('top',($(this).offset().top+30)+'px').css('left',$(this).offset().left+'px').hide();
		$(acCurrentInput).attr('autocorrect','off').attr('autocapitalize','off');
		$(window).resize(function(){$(acCurrentList).css('top',($(acCurrentInput).offset().top+30)+'px').css('left',$(acCurrentInput).offset().left+'px');});
		$(this).keyup(function(e){
			if(e.keyCode!=37 && e.keyCode!=38 && e.keyCode!=39 && e.keyCode!=40 && e.keyCode!=13){
				if($(this).val().length>=parseInt($(this).attr('data-length'))){
					acUpdateIndex(0);
					clearTimeout(acSearchLimit);acSearchLimit=setTimeout(function(){
						if(acRequest&&acRequest.readystate!=4){acRequest.abort();}
						var finalData="ajax=1&token="+$('body').attr('data-token')+"&aranan="+$(acCurrentInput).val();
						if($(acCurrentInput).attr('data-filterform')!='undefined'){
							finalData+='&'+$('#'+$(acCurrentInput).attr('data-filterform')).serialize();
						}
						acRequest = $.ajax({
							url:$(acCurrentInput).attr('data-provider'),
							type:"POST",
							data:finalData,
							dataType:"json"
						}).done(function(data){
							var htmlData='';
							var longData=data.length>8?true:false;
							acSelItem=0;
							if(longData){htmlData+='<div class="scroller">'}
							$.each(data,function(i,obj){
								htmlData+='<li role="option" id="'+obj.id+'">'+obj.title+'</li>';
							});
							if(longData){htmlData+='</div>'}
							if(htmlData!=''){
								var curHeight=$(acCurrentList).height();
								$(acCurrentList).css('height','auto').html(htmlData).show();
								$(acCurrentInput).attr('aria-expanded','true');
								$(acCurrentList+' .scroller').scrollTop(0);
								var autoHeight=$(acCurrentList).height();
								$(acCurrentList).height(curHeight).animate({height:autoHeight},250);
								$(acCurrentList+' li').hover(function(){
									acUpdateIndex($(acCurrentList+' li').index(this)+1);
								}).click(function(){
									$(acCurrentInput).val($(this).text());
								});
							} else {
								$(acCurrentList).hide();
								$(acCurrentInput).attr('aria-expanded','false');
								acSelItem=0;
							}
						}).fail(function() {
							$(acCurrentList).hide();
							$(acCurrentInput).attr('aria-expanded','false');
							acSelItem=0;
						});
					},500);
				} else {
					clearTimeout(acSearchLimit);
					if(acRequest&&acRequest.readystate!=4){acRequest.abort();}
					$(acCurrentList).slideUp(250);
					$(acCurrentInput).attr('aria-expanded','false');
					acSelItem=0;
				}
			} else if(e.keyCode==40){
				acUpdateIndex('D');
			} else if(e.keyCode==38){
				acUpdateIndex('U');
			} else if(e.keyCode==13 || e.which==13){
				e.preventDefault();
				return false;
			}
		}).blur(function(){
			clearTimeout(acSearchLimit);
			if(acRequest&&acRequest.readystate!=4){acRequest.abort();}
			setTimeout(function(){$(acCurrentList).slideUp(250);},250);
			$(acCurrentInput).attr('aria-expanded','false');
			acSelItem=0;
		}).bind("keyup keypress",function(e){
			var code = e.keyCode || e.which;
			if (code == 13 && acSelItem>0) {
				e.preventDefault();
				$(acCurrentList).slideUp(250);
				$(acCurrentInput).attr('aria-expanded','false');
				acSelItem=0;
				return false;
			}
		});
	});
};

$(document).ready(function(){
	$("#serviceBlock dl.condensed dt,#serviceBlock dl.compact dt").each(function(i){if($(this).height()>$(this).next('dd').height()){$(this).next('dd').height($(this).height());} else {$(this).height($(this).next('dd').height());}});
	$("input.date").each(function(index){$(this).calendar({triggerElement:$(this).prev('a.calendarLink')});});
	$("#serviceBlock .remainingChars").each(function(index){$(this).next('textarea').keyup(function(e){var maxChar=$(this).attr('data-maxchar');if($(this).val().length>=maxChar){$(this).val($(this).val().substring(0,maxChar));}$(this).prev('.remainingChars').html('Kalan Karakter <strong>'+(maxChar-$(this).val().length)+'</strong>');}).keyup();});
	$('aside.pageHelper').height($('section.pageContainer').height());
	$("input.backButton").click(function(){$("form").attr('novalidate','novalidate')});
	initializeHelpers();
	processAutoComplete();
	$("#serviceBlock .resultTable[data-paginate]").each(function(index){paginateTable(this);});
	$("div.remainingTime").each(function(){$(this).hide();var tObject=$(this);var tCountDown=tObject.attr('data-initial');function tSetCounter(){setTimeout(function(){if($(tObject).is(":hidden")){$(tObject).fadeIn(1000);}if(tCountDown>0){tCountDown--;var minutes=Math.floor(tCountDown/60);var seconds=tCountDown-(minutes*60);tObject.html('Kalan Süre: <strong>'+('00'+minutes).slice(-2)+':'+('00'+seconds).slice(-2)+'<\/strong>');tSetCounter();} else if(typeof tObject.attr('data-redirect') != 'undefined' && tObject.attr('data-redirect').length>0){window.location.href=tObject.attr('data-redirect');}},1000);}tSetCounter();});
	if(navigator.appName.indexOf("Internet Explorer")!=-1){$("optgroup").attr('value','*');}
	$('.captchaImage').click(function(){var src=$(this).attr('src');var qp=src.indexOf('?');var rp=src.indexOf('&rnd=');$(this).attr('src',src+(qp!=-1?'':'?')+(rp!=-1?'':'&rnd=')+Math.round(Math.random()*10));});
	var captchaTime=0;$("input.captcha").keydown(function(e){if(e.keyCode==190){if(Date.now()-captchaTime>10000){var src=$(this).attr('data-sound');var qp=src.indexOf('?');$('#captchaPlayer').remove();$('body').append('<audio id="captchaPlayer"/>');$('#captchaPlayer').attr('src',$(this).attr('data-sound')+(qp!=-1?'':'?')+'&rnd='+Date.now()).attr('autoplay','autoplay');captchaTime=Date.now();}e.preventDefault();e.cancelBubble=true;if(e.stopPropagation){e.stopPropagation();}}});
});