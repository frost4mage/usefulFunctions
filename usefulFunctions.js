// load JSON
function loadJSON(file,callback) {
    var xobj = new XMLHttpRequest();
    xobj.overrideMimeType("application/json");
    xobj.open('GET', file, true);
    xobj.onreadystatechange = function() {
        if (xobj.readyState === 4 && xobj.status === 200) {

            // .open will NOT return a value but simply returns undefined in async mode so use a callback
            callback(xobj.responseText);

        }
    };
    xobj.send(null)
}

//add event listener to class
function addEventListenerToClass(ev, fn, cl) {
    var el = document.getElementsByClassName(cl);
    for (var i = 0; i < el.length; i++) {
        el[i].addEventListener(ev, fn);
    }
}
// find closest parent that has specific class
function findAncestor (el, cls) {
    while ((el = el.parentElement) && !el.classList.contains(cls));
    return el;
}
// safe add and remove class
function safeAdd(el, cl) {
    if(el && !el.classList.contains(cl)){el.classList.add(cl)}
}
function safeRemove(el, cl) {
    if(el && el.classList.contains(cl)){el.classList.remove(cl)}
}
// remove magic
Element.prototype.remove = function () {
    this.parentElement.removeChild(this);
};
NodeList.prototype.remove = HTMLCollection.prototype.remove = function () {
    for (var i = this.length - 1; i >= 0; i--) {
        if (this[i] && this[i].parentElement) {
            this[i].parentElement.removeChild(this[i]);
        }
    }
};
//
// index in parent
function indexInParent(node) {
    var children = node.parentNode.childNodes;
    var num = 0;
    for (var i = 0; i < children.length; i++) {
        if (children[i] === node) return num;
        if (children[i].nodeType === 1) num++;
    }
    return -1;
}
//
// adding ScrollUp and Down event listeners
// For IE support
(function () {
    if ( typeof window.CustomEvent === "function" ) return false; //If not IE

    function CustomEvent ( event, params ) {
        params = params || { bubbles: false, cancelable: false, detail: undefined };
        var evt = document.createEvent( 'CustomEvent' );
        evt.initCustomEvent( event, params.bubbles, params.cancelable, params.detail );
        return evt;
    }
    CustomEvent.prototype = window.Event.prototype;
    window.CustomEvent = CustomEvent;
})();
/////////////////////////////
Element.prototype.addCustomEventListener = function (event,callBack) {
    var element = this,
        scrollUpEvent = new CustomEvent("scrollUp"),
        scrollDownEvent = new CustomEvent("scrollDown");

    function scrollDown(){
        // console.log("scrolled down");
        callBack()
    }
    function scrollUP(){
        // console.log("scrolled up");
        callBack()
    }

    function scrollHappened(e){
        if(e.deltaY < 0){
            element.dispatchEvent(scrollUpEvent);
        } else {
            element.dispatchEvent(scrollDownEvent);
        }
    }


    // swipe event listeners
    var swipeRightEvent = new CustomEvent("swipeRight"),
        swipeLeftEvent = new CustomEvent("swipeLeft"),
        swipeUpEvent = new CustomEvent("swipeUp"),
        swipeDownEvent = new CustomEvent("swipeDown"),
        startX,
        startY,
        distX,
        distY,
        threshold = 150,
        restraint = 100,
        allowedTime = 300,
        elapsedTime,
        startTime;

    function swipeRight(){callBack()}
    function swipeLeft(){callBack()}
    function swipeUp(){callBack()}
    function swipeDown(){callBack()}

    element.addEventListener('touchstart',function (e) {
        var touchObj = e.changedTouches[0];
        dist = 0;
        startX = touchObj.pageX;
        startY = touchObj.pageY;
        startTime = new Date().getTime();
        e.preventDefault()
    }, false);

    element.addEventListener('touchmove', function (e) {
        e.preventDefault()
    }, false);

    element.addEventListener('touchend', function (e) {
        var touchObj = e.changedTouches[0];
        distX = touchObj.pageX - startX;
        distY = touchObj.pageY - startY;
        elapsedTime = new Date().getTime() - startTime;
        if(elapsedTime <= allowedTime){
            if(Math.abs(distX) >= threshold && Math.abs(distY) <= restraint){
                (distX < 0) ? element.dispatchEvent(swipeLeftEvent) : element.dispatchEvent(swipeRightEvent);
            }
            else if(Math.abs(distY) >= threshold && Math.abs(distX) <= restraint){
                (distY < 0) ? element.dispatchEvent(swipeUpEvent) : element.dispatchEvent(swipeDownEvent);
            }
        }
    }, false);

    /// event listeners
    element.addEventListener("wheel", scrollHappened);
    switch (event){
        case 'scrollUp':
            element.addEventListener("scrollUp", scrollUP);
            break;
        case 'scrollDown':
            element.addEventListener("scrollDown", scrollDown);
            break;
        case 'swipeRight':
            element.addEventListener("swipeRight", swipeRight);
            break;
        case 'swipeLeft':
            element.addEventListener("swipeLeft", swipeLeft);
            break;
        case 'swipeUp':
            element.addEventListener("swipeUp", swipeUp);
            break;
        case 'swipeDown':
            element.addEventListener("swipeDown", swipeDown);
            break;
    }
};
