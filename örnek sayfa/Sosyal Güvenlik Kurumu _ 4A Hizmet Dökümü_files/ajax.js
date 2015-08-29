if (typeof T === "undefined") {var T = {};}
T.AJAX = {
	returns:'',
	http:{},
	url:'',
	set:function(){
	    if(navigator.appName == "Microsoft Internet Explorer"){
	    	try {
	            return new ActiveXObject("Msxml2.XMLHTTP");
	    	}
	    	catch (e){
	            try {
	               return new ActiveXObject("Microsoft.XMLHTTP");
	            } 
	            catch (e){
	            	alert(e);
	            	return false;
	            }
	         }
	         return false;
	    }
	    else{
			return new XMLHttpRequest();
	    }
	},
	connection:function(url,method,funcObj){
		this.http = this.set();
		if( method == 'POST' )
		{
			this.http.open(method,url,true);
			this.http.setRequestHeader('Content-type','application/x-www-form-urlencoded; charset=UTF-8');
			this.http.setRequestHeader("Content-length", this.getURL().length);
			this.http.setRequestHeader("Connection", "close");
		}
		else
		{
			url += '?'+this.getURL();
			this.http.open(method,url,true);
			this.http.setRequestHeader("Content-Type", "text/xml; charset=utf-8"); 
		}
		this.http.setRequestHeader("Connection", "close");
		if(funcObj)
			this.http.onreadystatechange = funcObj;
		else
			this.http.onreadystatechange = function(){var http=T.AJAX.http;if(http.readyState == 4 ){T.AJAX.returns = eval('(' + http.responseText + ');');if( T.AJAX.returns.js.jsFunction) eval(T.AJAX.returns.js.jsFunction+"("+http.responseText+");");else{T.AJAX.returns.js.jsFunction();}}};
		this.http.send(this.getURL());
		this.url='';
		return this.http;
	},
	param:function(){
		return 'token='+document.body.getAttribute("data-token")+"&ajax=1";
	},	
	add:function(_name,_value){
		if(_value != undefined)
			this.url += '&'+ _name + '=' + encodeURIComponent(_value);		
	},
	setUrl:function(_url){
		this.url += _url;
	},
	getURL:function(){
		return this.param()+this.url;
	}
}