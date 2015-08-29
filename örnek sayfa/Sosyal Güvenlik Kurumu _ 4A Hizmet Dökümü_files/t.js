var T = {
	_token : '',
	_trueCode : '',
	$:function(_id) {
		return document.getElementById(_id);
	},
	tagName : function(_id, _tagName) {
		return this.$(_id).getElementsByTagName(_tagName);
	},
	getForm:function(_name){
		return document.forms[_name];
	},
	set:function(_token, _trueCode) {
		this._token = _token;
		this._trueCode = _trueCode;
	},
	go:function(_url) {
		window.location.href = _url;
	},
	getCookie:function(c_name)
	{
		var i,x,y,ARRcookies=document.cookie.split(";"),len =ARRcookies.length; 
		for (i=0;i<len;i++)
		{
			x=ARRcookies[i].substr(0,ARRcookies[i].indexOf("="));
			y=ARRcookies[i].substr(ARRcookies[i].indexOf("=")+1);
			x=x.replace(/^\s+|\s+$/g,"");
			if (x==c_name){
				return unescape(y);
			}
		}
	},
	menu:{
		selected : function(_id, className) {
			this.obj = T.tagName(_id,'a');
			this.len = this.obj.length;
			this.urlArr = window.location.href.split('/');
			this.pageURL = '/'+this.urlArr[this.urlArr.length-1];
			this.page = this.pageURL.split("?")[0];
			for (this.i = 0; this.i < this.len; this.i++) {
				if (this.obj[this.i].getAttribute('href').split("?").length==0) {
					this.obj[this.i].className = className;
				}else{
					if(this.obj[this.i].getAttribute('href')==this.pageURL)
					this.obj[this.i].className = className;
				}
			}
		}
	},
	combo:{
		flush:function(obj,text,id){
			if(text == undefined)
				text = 'Seçiniz';
			if(id==undefined)
				id='';
			obj.length = 0;
			obj.options[0] = new Option(text,id);
		},
		setOption:function(obj,data,defaultText,defaultId){
			this.flush(obj,defaultText,defaultId);
			if(data.num_rows!=undefined && data.num_rows>0){
				for(this.i=0;this.i<data.num_rows;this.i++){
					this.add(obj,data.dataArr[this.i].id,data.dataArr[this.i].name);
				}
			}
		},
		add:function(obj,id,text){		
			this.len = obj.length;
			obj.options[this.len] = new Option(text,id);
		}
	}
}