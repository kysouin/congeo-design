// Inline this in <head>, before any stylesheet. Sets <html lang> before the first paint.
(function(){var l=null;try{var m=/(?:^|;\s*)congeo_lang=(en|el)(?:;|$)/.exec(document.cookie||"");l=m?m[1]:null;if(!l){var s=localStorage.getItem("congeo.lang");if(s==="en"||s==="el")l=s}}catch(e){}document.documentElement.lang=l||"en"})();
