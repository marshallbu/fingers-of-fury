var _=require("underscore"),util=require("util");exports.generateId=function(e,t){var n="";t.indexOf("a")>-1&&(n+="abcdefghijklmnopqrstuvwxyz");t.indexOf("A")>-1&&(n+="ABCDEFGHIJKLMNOPQRSTUVWXYZ");t.indexOf("#")>-1&&(n+="0123456789");t.indexOf("!")>-1&&(n+="~`!@#$%^&*()_+-={}[]:\";'<>?,./|\\");var r="";for(var i=e;i>0;--i)r+=n[Math.round(Math.random()*(n.length-1))];return r};