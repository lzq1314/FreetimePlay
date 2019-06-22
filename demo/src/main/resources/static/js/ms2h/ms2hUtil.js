(function(global) {
    ms2http = {
		url : '/',
		
    	get : function(http, params, callback){
			http.get(params.url, {"params" : params}
            ).then( 
    			function(response) {
    				callback(response);
               	},
               	function(response) {
    				
               	}
    		);
		},
		
		post : function(http, params, callback){
			http.post(this.url,params,{})
			.then( 
				function(response) {
					callback(response);
            	},
            	function(response) {
					
            	}
			);
		},
		
		restPost : function(http, url, params, callback){
			http.post(url,params,{})
			.then( 
				function(response) {
					callback(response);
            	},
            	function(response) {
					
            	}
			);
		},
		
		find : function(http, sqlId, params, callback){
			params = angular.extend(params,
                    {
                       method : 'find',
                       sqlId : sqlId
                    });
			
			this.post(http, params, callback);
		},
		
		insert : function(http, sqlId, params, callback){
			params = angular.extend(params,
                    {
                       method : 'insert',
                       sqlId : sqlId
                    });
			
			this.post(http, params, callback);
		},
		
		update : function(http, sqlId, params, callback){
			params = angular.extend(params,
                    {
                       method : 'update',
                       sqlId : sqlId
                    });
			
			this.post(http, params, callback);
		},
		
		remove : function(http, sqlId, params, callback){
			params = angular.extend(params,
                    {
                       method : 'remove',
                       sqlId : sqlId
                    });
			
			this.post(http, params, callback);
		},
		
		func : function(http, sqlId, params, callback){
			params = angular.extend(params,
                    {
                       method : 'func',
                       sqlId : sqlId
                    });
			
			this.post(http, params, callback);
		}
		
    },
    
    Date.prototype.format = function (format) {
        var args = {
            "M+": this.getMonth() + 1,
            "d+": this.getDate(),
            "h+": this.getHours(),
            "m+": this.getMinutes(),
            "s+": this.getSeconds(),
            "q+": Math.floor((this.getMonth() + 3) / 3),  //quarter
            "S": this.getMilliseconds()
        };
        if (/(y+)/.test(format))
            format = format.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
        for (var i in args) {
            var n = args[i];
            if (new RegExp("(" + i + ")").test(format))
                format = format.replace(RegExp.$1, RegExp.$1.length == 1 ? n : ("00" + n).substr(("" + n).length));
        }
        return format;
    },
    
    ms2hUtil = {
		pageInit: function(fn) {
			$(document).ready(fn);
	    },
	    
	    getGUID: function(uppercase) {
            var d = new Date().getTime();
            return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
                var r = (d + Math.random() * 16) % 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8);
                return uppercase ? v.toString(16).toUpperCase() : v.toString(16);
            });
        },
        
        getDate: function(format){/*get format date*/
        	
        	var date=new Date().format(format);
        	return date;
        },
        
        getDatetime: function(){
        	var now = new Date();
        	var year = now.getFullYear(),
        	month = ((now.getMonth()+1) < 10)? '0'+(now.getMonth()+1) : (now.getMonth()+1),
        	date = 	(now.getDate() < 10)? '0'+now.getDate() : now.getDate(),
        	hh = (now.getHours() < 10)? '0'+now.Hours() : now.getHours(),
        	min	= (now.getMinutes() < 10)? '0'+now.getMinutes() : now.getMinutes(),
        	second = (now.getSeconds() < 10)? '0'+now.getSeconds() : now.getSeconds();		
        	
        	return year+month+date+hh+min+second;
        },
        
        exportToExcel:function(fileName,targetData){/*export data to excel*/
        	if(!angular.isArray(targetData)){
        		$log.error('can not export error type data to excel');
        		return;
        	};
        	return alasql('SELECT * INTO XLSX("' + fileName +'.xlsx",{headers:true}) FROM ?',[targetData]);
        },
        
        dateTimeFormat:function(x){
        	 var i, c, txt = "";
             for (i = 0; i < x.length; i++) {
            	 c=x[i];
                 txt += c;
                 if(i==3 || i==5)
                 	txt += '-';
                 else if(i==7)
                 	txt += ' ';
                 else if(i==9 || i==11)
                 	txt += ':';
             }
             return txt;
        },
        
        getTreeData : function(data, primaryIdName, parentIdName, rootVal) {
            if (!data || data.length == 0 || !primaryIdName || !parentIdName)
                return [];

            if(rootVal == undefined)
                rootVal = "ROOT";
                                
            var tree = [],
                rootIds = [],
                item = data[0],
                primaryKey = item[primaryIdName],
                treeObjs = {},
                parentId,
                parent,
                len = data.length,
                i = 0;

            while (i < len) {
                item = data[i++];
                primaryKey = item[primaryIdName];
                treeObjs[primaryKey] = item;
                parentId = item[parentIdName];

                if (parentId != rootVal) {
                    parent = treeObjs[parentId];

                    if(parent == undefined){
                         rootIds.push(primaryKey);   
                    } else if (parent.children) {
                        parent.children.push(item);
                    }
                    else {
                        parent.children = [item];
                    }
                }
                else {
                    rootIds.push(primaryKey);
                }
            }

            for (var i = 0; i < rootIds.length; i++) {
                tree.push(treeObjs[rootIds[i]]);
            };

            return tree;
        },

        utf8encode: function (decStr) {
			string = decStr.replace(/\r\n/g, "\n");
			var encOut = "";

			if (decStr == null) {
				return encOut;
			}

			for (var n = 0; n < decStr.length; n++) {
				var c = decStr.charCodeAt(n);

				if (c < 128) {
					encOut += String.fromCharCode(c);
				} else if ((c > 127) && (c < 2048)) {
					encOut += String.fromCharCode((c >> 6) | 192);
					encOut += String.fromCharCode((c & 63) | 128);
				} else {
					encOut += String.fromCharCode((c >> 12) | 224);
					encOut += String.fromCharCode(((c >> 6) & 63) | 128);
					encOut += String.fromCharCode((c & 63) | 128);
				}
			}

			return (encOut);
		},

        encrypt : function (str) {
            var xl;
          
            var rotateLeft = function(lValue, iShiftBits) {
                return (lValue << iShiftBits) | (lValue >>> (32 - iShiftBits));
            };
          
            var addUnsigned = function(lX, lY) {
                var lX4, lY4, lX8, lY8, lResult;
                lX8 = (lX & 0x80000000);
                lY8 = (lY & 0x80000000);
                lX4 = (lX & 0x40000000);
                lY4 = (lY & 0x40000000);
                lResult = (lX & 0x3FFFFFFF) + (lY & 0x3FFFFFFF);
                if (lX4 & lY4) {
                    return (lResult ^ 0x80000000 ^ lX8 ^ lY8);
                }
                if (lX4 | lY4) {
                    if (lResult & 0x40000000) {
                    return (lResult ^ 0xC0000000 ^ lX8 ^ lY8);
                    } else {
                    return (lResult ^ 0x40000000 ^ lX8 ^ lY8);
                    }
                } else {
                    return (lResult ^ lX8 ^ lY8);
                }
                };
            
                var _F = function(x, y, z) {
                return (x & y) | ((~x) & z);
                };
                var _G = function(x, y, z) {
                return (x & z) | (y & (~z));
                };
                var _H = function(x, y, z) {
                return (x ^ y ^ z);
                };
                var _I = function(x, y, z) {
                return (y ^ (x | (~z)));
                };
            
                var _FF = function(a, b, c, d, x, s, ac) {
                a = addUnsigned(a, addUnsigned(addUnsigned(_F(b, c, d), x), ac));
                return addUnsigned(rotateLeft(a, s), b);
                };
            
                var _GG = function(a, b, c, d, x, s, ac) {
                a = addUnsigned(a, addUnsigned(addUnsigned(_G(b, c, d), x), ac));
                return addUnsigned(rotateLeft(a, s), b);
                };
            
                var _HH = function(a, b, c, d, x, s, ac) {
                a = addUnsigned(a, addUnsigned(addUnsigned(_H(b, c, d), x), ac));
                return addUnsigned(rotateLeft(a, s), b);
                };
            
                var _II = function(a, b, c, d, x, s, ac) {
                a = addUnsigned(a, addUnsigned(addUnsigned(_I(b, c, d), x), ac));
                return addUnsigned(rotateLeft(a, s), b);
                };
            
                var convertToWordArray = function(str) {
                var lWordCount;
                var lMessageLength = str.length;
                var lNumberOfWords_temp1 = lMessageLength + 8;
                var lNumberOfWords_temp2 = (lNumberOfWords_temp1 - (lNumberOfWords_temp1 % 64)) / 64;
                var lNumberOfWords = (lNumberOfWords_temp2 + 1) * 16;
                var lWordArray = new Array(lNumberOfWords - 1);
                var lBytePosition = 0;
                var lByteCount = 0;
                while (lByteCount < lMessageLength) {
                    lWordCount = (lByteCount - (lByteCount % 4)) / 4;
                    lBytePosition = (lByteCount % 4) * 8;
                    lWordArray[lWordCount] = (lWordArray[lWordCount] | (str.charCodeAt(lByteCount) << lBytePosition));
                    lByteCount++;
                }
                lWordCount = (lByteCount - (lByteCount % 4)) / 4;
                lBytePosition = (lByteCount % 4) * 8;
                lWordArray[lWordCount] = lWordArray[lWordCount] | (0x80 << lBytePosition);
                lWordArray[lNumberOfWords - 2] = lMessageLength << 3;
                lWordArray[lNumberOfWords - 1] = lMessageLength >>> 29;
                return lWordArray;
                };
            
                var wordToHex = function(lValue) {
                var wordToHexValue = '',
                    wordToHexValue_temp = '',
                    lByte, lCount;
                for (lCount = 0; lCount <= 3; lCount++) {
                    lByte = (lValue >>> (lCount * 8)) & 255;
                    wordToHexValue_temp = '0' + lByte.toString(16);
                    wordToHexValue = wordToHexValue + wordToHexValue_temp.substr(wordToHexValue_temp.length - 2, 2);
                }
                return wordToHexValue;
                };
            
                var x = [],
                k, AA, BB, CC, DD, a, b, c, d, S11 = 7,
                S12 = 12,
                S13 = 17,
                S14 = 22,
                S21 = 5,
                S22 = 9,
                S23 = 14,
                S24 = 20,
                S31 = 4,
                S32 = 11,
                S33 = 16,
                S34 = 23,
                S41 = 6,
                S42 = 10,
                S43 = 15,
                S44 = 21;
            
                str =  ms2hUtil.utf8encode(str);
                x = convertToWordArray(str);
                a = 0x67452301;
                b = 0xEFCDAB89;
                c = 0x98BADCFE;
                d = 0x10325476;
            
                xl = x.length;
                for (k = 0; k < xl; k += 16) {
                AA = a;
                BB = b;
                CC = c;
                DD = d;
                a = _FF(a, b, c, d, x[k + 0], S11, 0xD76AA478);
                d = _FF(d, a, b, c, x[k + 1], S12, 0xE8C7B756);
                c = _FF(c, d, a, b, x[k + 2], S13, 0x242070DB);
                b = _FF(b, c, d, a, x[k + 3], S14, 0xC1BDCEEE);
                a = _FF(a, b, c, d, x[k + 4], S11, 0xF57C0FAF);
                d = _FF(d, a, b, c, x[k + 5], S12, 0x4787C62A);
                c = _FF(c, d, a, b, x[k + 6], S13, 0xA8304613);
                b = _FF(b, c, d, a, x[k + 7], S14, 0xFD469501);
                a = _FF(a, b, c, d, x[k + 8], S11, 0x698098D8);
                d = _FF(d, a, b, c, x[k + 9], S12, 0x8B44F7AF);
                c = _FF(c, d, a, b, x[k + 10], S13, 0xFFFF5BB1);
                b = _FF(b, c, d, a, x[k + 11], S14, 0x895CD7BE);
                a = _FF(a, b, c, d, x[k + 12], S11, 0x6B901122);
                d = _FF(d, a, b, c, x[k + 13], S12, 0xFD987193);
                c = _FF(c, d, a, b, x[k + 14], S13, 0xA679438E);
                b = _FF(b, c, d, a, x[k + 15], S14, 0x49B40821);
                a = _GG(a, b, c, d, x[k + 1], S21, 0xF61E2562);
                d = _GG(d, a, b, c, x[k + 6], S22, 0xC040B340);
                c = _GG(c, d, a, b, x[k + 11], S23, 0x265E5A51);
                b = _GG(b, c, d, a, x[k + 0], S24, 0xE9B6C7AA);
                a = _GG(a, b, c, d, x[k + 5], S21, 0xD62F105D);
                d = _GG(d, a, b, c, x[k + 10], S22, 0x2441453);
                c = _GG(c, d, a, b, x[k + 15], S23, 0xD8A1E681);
                b = _GG(b, c, d, a, x[k + 4], S24, 0xE7D3FBC8);
                a = _GG(a, b, c, d, x[k + 9], S21, 0x21E1CDE6);
                d = _GG(d, a, b, c, x[k + 14], S22, 0xC33707D6);
                c = _GG(c, d, a, b, x[k + 3], S23, 0xF4D50D87);
                b = _GG(b, c, d, a, x[k + 8], S24, 0x455A14ED);
                a = _GG(a, b, c, d, x[k + 13], S21, 0xA9E3E905);
                d = _GG(d, a, b, c, x[k + 2], S22, 0xFCEFA3F8);
                c = _GG(c, d, a, b, x[k + 7], S23, 0x676F02D9);
                b = _GG(b, c, d, a, x[k + 12], S24, 0x8D2A4C8A);
                a = _HH(a, b, c, d, x[k + 5], S31, 0xFFFA3942);
                d = _HH(d, a, b, c, x[k + 8], S32, 0x8771F681);
                c = _HH(c, d, a, b, x[k + 11], S33, 0x6D9D6122);
                b = _HH(b, c, d, a, x[k + 14], S34, 0xFDE5380C);
                a = _HH(a, b, c, d, x[k + 1], S31, 0xA4BEEA44);
                d = _HH(d, a, b, c, x[k + 4], S32, 0x4BDECFA9);
                c = _HH(c, d, a, b, x[k + 7], S33, 0xF6BB4B60);
                b = _HH(b, c, d, a, x[k + 10], S34, 0xBEBFBC70);
                a = _HH(a, b, c, d, x[k + 13], S31, 0x289B7EC6);
                d = _HH(d, a, b, c, x[k + 0], S32, 0xEAA127FA);
                c = _HH(c, d, a, b, x[k + 3], S33, 0xD4EF3085);
                b = _HH(b, c, d, a, x[k + 6], S34, 0x4881D05);
                a = _HH(a, b, c, d, x[k + 9], S31, 0xD9D4D039);
                d = _HH(d, a, b, c, x[k + 12], S32, 0xE6DB99E5);
                c = _HH(c, d, a, b, x[k + 15], S33, 0x1FA27CF8);
                b = _HH(b, c, d, a, x[k + 2], S34, 0xC4AC5665);
                a = _II(a, b, c, d, x[k + 0], S41, 0xF4292244);
                d = _II(d, a, b, c, x[k + 7], S42, 0x432AFF97);
                c = _II(c, d, a, b, x[k + 14], S43, 0xAB9423A7);
                b = _II(b, c, d, a, x[k + 5], S44, 0xFC93A039);
                a = _II(a, b, c, d, x[k + 12], S41, 0x655B59C3);
                d = _II(d, a, b, c, x[k + 3], S42, 0x8F0CCC92);
                c = _II(c, d, a, b, x[k + 10], S43, 0xFFEFF47D);
                b = _II(b, c, d, a, x[k + 1], S44, 0x85845DD1);
                a = _II(a, b, c, d, x[k + 8], S41, 0x6FA87E4F);
                d = _II(d, a, b, c, x[k + 15], S42, 0xFE2CE6E0);
                c = _II(c, d, a, b, x[k + 6], S43, 0xA3014314);
                b = _II(b, c, d, a, x[k + 13], S44, 0x4E0811A1);
                a = _II(a, b, c, d, x[k + 4], S41, 0xF7537E82);
                d = _II(d, a, b, c, x[k + 11], S42, 0xBD3AF235);
                c = _II(c, d, a, b, x[k + 2], S43, 0x2AD7D2BB);
                b = _II(b, c, d, a, x[k + 9], S44, 0xEB86D391);
                a = addUnsigned(a, AA);
                b = addUnsigned(b, BB);
                c = addUnsigned(c, CC);
                d = addUnsigned(d, DD);
            }
          
            var temp = wordToHex(a) + wordToHex(b) + wordToHex(c) + wordToHex(d);
          
            return temp.toLowerCase();
        },
        
        download : function(action, params){	
			var printIframe = angular.element("<iframe style='display:none;'>");
    		var formElement = angular.element("<form>");
    		formElement.attr("action", action);
            formElement.attr("method", "post");
    		
    		angular.forEach(params, function(value, key) {
  				var contentElement = angular.element("<input>").attr("type", "hidden").attr("name",key).val( value);
		    	formElement.append(contentElement);
    		});
    	
		    printIframe.append(formElement);
		    angular.element('body').append(printIframe);
            formElement.submit();
            printIframe.remove();
        },

        replaceSymbols : function(str) {
            if(str.match(/>/)){
                str = str.replace(/>/, "&gt;");
            }
            if(str.match(/</)){
                str = str.replace(/</, "&lt;");
            }
            return str;
        }
    },
    
    
    Spin = {
        spin: function() {
            var opts = {
                // lines: 13 // The number of lines to draw
                // , length: 0 // The length of each line
                // , width: 14 // The line thickness
                // , radius: 42 // The radius of the inner circle
                // , scale: 1 // Scales overall size of the spinner
                // , corners: 1 // Corner roundness (0..1)
                // , color: '#000' // #rgb or #rrggbb or array of colors
                // , opacity: 0.25 // Opacity of the lines
                // , rotate: 0 // The rotation offset
                // , direction: 1 // 1: clockwise, -1: counterclockwise
                // , speed: 1 // Rounds per second
                // , trail: 60 // Afterglow percentage
                // , fps: 20 // Frames per second when using setTimeout() as a fallback for CSS
                // , zIndex: 2e9 // The z-index (defaults to 2000000000)
                // , className: 'spinner' // The CSS class to assign to the spinner
                // , top: '50%' // Top position relative to parent
                // , left: '50%' // Left position relative to parent
                // , shadow: false // Whether to render a shadow
                // , hwaccel: false // Whether to use hardware acceleration
                // , position: 'absolute' // Element positioning
                lines: 24,
                length: 7,
                width: 2,
                radius: 48,
                scale: 1.0,
                corners: 0,
                color: '#000',
                opacity: 0.25,
                fadeColor: 'transparent',
                animation: 'spinner-line-fade-more',
                rotate: 28,
                direction: 1,
                speed: 0.75,
                zIndex: 2e9,
                className: 'spinner',
                top: '50%',
                left: '50%',
                shadow: false,
                hwaccel : false,
                position: 'absolute',
            }

            var target = document.getElementById('mainbody')
            if (document.spinner == undefined)
                document.spinner = new Spinner(opts);
            document.spinner.spin(target);
        },

        stop: function() {
            if (document.spinner)
                document.spinner.stop();
        }
    },

    Base64Util = {

        key_: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/",

        encode : function(str) {
            if (typeof btoa === 'function') {
                return btoa(str);
            }
            var key_ = this.key_;
            var bits;
            var dual;
            var i = 0;
            var output = "";
            while(str.length >= i + 3){
                bits = (str.charCodeAt(i++) & 0xff) <<16 | (str.charCodeAt(i++) & 0xff) <<8 | str.charCodeAt(i++) & 0xff;
                encOut += key_.charAt((bits & 0x00fc0000) >>18) + key_.charAt((bits & 0x0003f000) >>12) + key_.charAt((bits & 0x00000fc0) >> 6) + key_.charAt((bits & 0x0000003f));
            }
            if(str.length -i > 0 && str.length -i < 3){
                dual = Boolean(str.length -i -1);
                bits = ((str.charCodeAt(i++) & 0xff) <<16) |    (dual ? (str.charCodeAt(i) & 0xff) <<8: 0);
                encOut += key_.charAt((bits & 0x00fc0000) >>18) + key_.charAt((bits & 0x0003f000) >>12) + (dual ? key_.charAt((bits & 0x00000fc0) >>6): '=') + '=';
            }

            return(output);
        },

        decode : function(str) {
            if (typeof atob === 'function') {
                return atob(str);
            }
            var key_ = this.key_;
            var bits;
            var output = "";
            var i = 0;
            for(; i<str.length; i += 4){
                bits = (key_.indexOf(str.charAt(i)) & 0xff) <<18 | (key_.indexOf(str.charAt(i +1)) & 0xff) <<12 | (key_.indexOf(str.charAt(i +2)) & 0xff) << 6 | key_.indexOf(str.charAt(i +3)) & 0xff;
                output += String.fromCharCode((bits & 0xff0000) >>16, (bits & 0xff00) >>8, bits & 0xff);
            }
            if(str.charCodeAt(i -2) == 61){
                return(output.substring(0, output.length -2));
            } else if(str.charCodeAt(i -1) == 61){
                return(output.substring(0, output.length -1));
            } else {
                return(output);
            }
        }
    };
    
    FuncAuthUtil = {	
    	data : {},
    	loadFuncAuth : function(data){
    		var me = this;
    		for(var i=0; i<data.rows.length; i++){
    			if(data.rows[i].auth_obj_div_cd == '0010' && data.rows[i].has_chld == 'Y'){
    				me.data[data.rows[i].auth_obj_nm] = {};
    			}else if(me.data[data.rows[i].upp_auth_obj_nm] != undefined){
					me.data[data.rows[i].upp_auth_obj_nm][data.rows[i].auth_obj_nm] = true;
    			}
    		}
    	},
    	
    	getFuncAuth : function(menuNm){
    		var me = this;
    		return me.data[menuNm];
    	}
    	
    },

    CodeUtil = {
    	isLoaded : false,
        getCode : function(data){
            var me = this;
            var item = {
                title : '',
                value : ''
            };

            var instList;
            if(data.success){
                if(me.isLoaded){
                    if(callback){
                        callback(true);
                    }
                    return;
                }
                for(var i=0; i<data.rows.length; i++){
                    if(me[data.rows[i].enum_id] == undefined){
                        me[data.rows[i].enum_id] = [];
                    }

                    instList =  me[data.rows[i].enum_id];
                    instList.push(
                        {
                            title : data.rows[i].enum_itm_nm,
                            value : data.rows[i].enum_itm_id
                        }
                    );  
                }
                me.isLoaded = true;
            }
        }
    },

    IsParentUtil = {
        prtsList : [],
        getIsParent : function(data){
            var me = this;
            var rslt = data.rows;
            angular.forEach(rslt, function(item, i){
                me.prtsList.push(item.prts_cls_id);
            });
        }
    },

    MenuUtil = {
        menuList : [],
        getAllMenu : function(data){
            var me = this;
            if(data.success) {
                me.menuList = data.rows;
            }
        }
    },

    DynaInputUtil = {
        loadAttr : function (http, cls_id, callback) {
            var me = this
            if(cls_id == undefined || cls_id == ''){
                return;
            }
            var params = {
                method: 'find',
                qId: 'md.getChldMdAttrs',
                cls_id: cls_id
            };
    
            ms2http.post(http, params,
                function (result) {
                    var rslt = result.data.rows;
                    if (result.data.success) {
                        if(me[cls_id]==undefined){
                            me[cls_id] = rslt;
                        }
                        if(callback){
                            callback(rslt);
                        }
                    }
                }
            );
        },
        loadAttrLink : function (http, cls_id, callback) {
            var me = this
            if(cls_id == undefined || cls_id == ''){
                return;
            }
            var params = {
                cls_id: cls_id
            };
            $.ajax({
	            url : 'getChldMdAttrs',
	            type : 'POST',
	            dataType : 'json',
	            data : {
	            	jsonStr : JSON.stringify(params)
                },success : function(result) {
                	var rslt = result.rows;
                    if (result.success) {
                        if(me[cls_id]==undefined){
                            me[cls_id] = rslt;
                        }
                        if(callback){
                            callback(rslt);
                        }
                    }
	            }
           });
    
           /* ms2http.post(http, params,
                function (result) {
                    var rslt = result.data.rows;
                    if (result.data.success) {
                        if(me[cls_id]==undefined){
                            me[cls_id] = rslt;
                        }
                        if(callback){
                            callback(rslt);
                        }
                    }
                }
            );*/
        }
    },

    MdViewLogUtil = {
        sendLog : function(http, cols){
            var params = {
                method : 'service',
                service : 'userlog',
                func : 'writeMDViewLog',
                md_id : cols.md_id,
                md_cd : cols.md_cd,
                md_nm : cols.md_nm,
                cls_id : cols.cls_id,
                cls_hier_cd : cols.cls_hier_cd
            }
            ms2http.post(http, params, function(result){
                return;
            });
        }
    },

    FileCheckUtil = {
        isExcelFile : function(id){
            var fileInput = document.getElementById(id);
            var filePath = fileInput.value;
            var allowedExtensions = /(\.xls|\.xlsx)$/i;
            if(!allowedExtensions.exec(filePath)){
                return false;
            } else {
                return true;
            }
        },
        isClassFile : function(id){
            var fileInput = document.getElementById(id);
            var files = fileInput.files;
            var allowedExtensions = /(\.class)$/i;
            var result = true;
            for(var i = 0; i < files.length; i++){
                if(!allowedExtensions.exec(files[i].name)){
                    result = false;
                }
            }
            return result;
        },
        isJarFile : function(id){
            var fileInput = document.getElementById(id);
            var files = fileInput.files;
            var allowedExtensions = /(\.jar)$/i;
            var result = true;
            for(var i = 0; i < files.length; i++){
                if(!allowedExtensions.exec(files[i].name)){
                    result = false;
                }
            }
            return result;
        },
    },

    DOMUtil = {
        initConfirmHTML : function(){
            $('#confirm').find('#confirm_html').children().remove();
        }
    }
       
})(window);