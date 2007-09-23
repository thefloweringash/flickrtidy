// ==UserScript==
// @name           Flickr Pools Last
// @namespace      http://cons.org.nz/~lorne
// @description    Reorders the right hand pane on photos
// @include        http://flickr.com/*
// @include        http://www.flickr.com/*
// ==/UserScript==

var pools = document.getElementById("otherContexts_div");
var poolsParent = pools.parentNode;
poolsParent.removeChild(pools);
poolsParent.insertBefore(pools, poolsParent.lastChild);
