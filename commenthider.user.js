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
	var togglerContainer = document.createElement('p');
	var toggler = document.createElement('a');
	toggler.href = "javascript:void(0);";
	toggler.addEventListener("click", function() { self.toggle(); }, false);
	toggler.innerHTML = text || 'toggle';
	togglerContainer.appendChild(toggler);
	return togglerContainer;
    };
}

function hideSingleComment(comment) {
    var content = comment.getElementsByTagName('p')[0];
    var toggle = new Toggle(content);
    toggle.turnOn();
    comment.insertBefore(toggle.makeToggler('toggle comment with image'), content);
}

injectCSS(".gm_obnoxious { display : none !important; }");

var aboutSection = document.getElementById("DiscussPhoto");

var commentsSection = document.evaluate(".//div[.//div/@class='comment-block']", aboutSection,
                                        null, XPathResult.ANY_UNORDERED_NODE_TYPE, null)
    .singleNodeValue;

var numberOfComments = document.evaluate("count(//div[@class='comment-block'])", document,
					 null, XPathResult.NUMBER_TYPE, null)
    .numberValue;

var obnoxiousComments = document.evaluate("//div[@class='comment-content' and p//img]", commentsSection,
					  null, XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null);

var commentsHider = new Toggle(commentsSection);
commentsHider.turnOn();
aboutSection.insertBefore(commentsHider.makeToggler
                          ("(toggle " + numberOfComments + " comment"
                           + (numberOfComments == 1 ? "" : "s") + ", "
                           + obnoxiousComments.snapshotLength + " with images)")
                          , commentsSection);

for (var i = 0; i < obnoxiousComments.snapshotLength; i++) {
    hideSingleComment(obnoxiousComments.snapshotItem(i));
}
