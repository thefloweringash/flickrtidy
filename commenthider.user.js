// ==UserScript==
// @name           Flickr Comment Hider
// @namespace      http://cons.org.nz/~lorne
// @description    Hides user comments on Flickr photos, inspired by http://hublog.hubmed.org/archives/001170.html
// @include        http://flickr.com/*
// @include        http://www.flickr.com/*
// ==/UserScript==

function getHead() {
    return document.getElementsByTagName('head')[0];
}

function makeStyle(css) {
    var style =  document.createElement('style');
    style.type = 'text/css';
    style.appendChild(document.createTextNode(css));
    return style;
}

function injectCSS(css) {
    var head = getHead();
    if (!head) return;
    head.appendChild(makeStyle(css));
}

function Toggle(element) {
    this.on = false;

    this.turnOn = function() {
	if (!this.on) {
	    element.className += ' gm_obnoxious';
	    this.on = true;
	}
    };

    this.turnOff = function() {
	if (this.on) {
	    element.className = element.className.replace("gm_obnoxious", "");
	    this.on = false;
	}
    };

    this.toggle = function() {
	if (this.on) {
	    this.turnOff();
	} else {
	    this.turnOn();
	}
    };

    this.makeToggler = function(text) {
	var self = this;
	var toggler = document.createElement('a');
	toggler.href = "javascript:void(0);";
	toggler.addEventListener("click", function() { self.toggle(); }, false);
	toggler.innerHTML = text || 'toggle';
	return toggler;
    };
}

function hideSingleComment(comment) {
    var content = comment.getElementsByTagName('p')[0];
    var toggle = new Toggle(content);
    toggle.turnOn();
    comment.insertBefore(toggle.makeToggler('toggle comment with image'), content);
}

injectCSS(".gm_obnoxious { display : none !important; }");

var commentsSection = document.getElementById("DiscussPhoto");
var commentsTable = commentsSection.getElementsByTagName('table')[0];

var numberOfComments = document.evaluate("count(//td[@class='Said'])", document,
					 null, XPathResult.NUMBER_TYPE, null)
    .numberValue;

var obnoxiousComments = document.evaluate("//tr/td[@class='Said' and p//img]", commentsSection,
					  null, XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null);

var commentsHider = new Toggle(commentsTable);
commentsHider.turnOn();
commentsSection.insertBefore(commentsHider.makeToggler
			     ("(toggle " + numberOfComments + " comment"
			      + (numberOfComments == 1 ? "" : "s") + ", "
			      + obnoxiousComments.snapshotLength + " with images)")
			     , commentsTable);

for (var i = 0; i < obnoxiousComments.snapshotLength; i++) {
    hideSingleComment(obnoxiousComments.snapshotItem(i));
}
