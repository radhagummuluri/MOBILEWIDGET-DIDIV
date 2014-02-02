/* v1.1.1
    - remove the globalref mechanism, replaced with straight settimeout. 
      fixes issue where multiple simultaneous dispatchers of one event listener does not persist the eventdatamodel correctly
*/

var sl = sl || {};
sl.sc = sl.sc || {};
sl.sc.event = sl.sc.event || {};

sl.sc.event = new function () {
    var self = this;
    this.eventQueue = [];

    var getEventsFromQueue = function (event) {
        var r = [];
        for (var x = 0; x < self.eventQueue.length; x++) {
            if (self.eventQueue[x].e == event) {
                r.push(self.eventQueue[x]);
            }
        }
        return r.length ? r : null;
    };

    this.listen = function (event, callback) {        
        this.eventQueue.push({ e: event, cb: callback });
    };

    this.listenOnce = function (event, callback) {
        var existingEvents = getEventsFromQueue(event);
        if (existingEvents) {
            self.remove(event, null);
        }
        this.listen(event, callback);
        this.listen(event, function () { self.remove(event, callback); });
    };

    this.dispatch = function (event, eventDataModel) {

        for (var x = 0; x < this.eventQueue.length; x++) {
            if (this.eventQueue[x].e == event && event) {                
                (function () {
                    var t = x;
                    var td = eventDataModel;
                    setTimeout(function () {
                        if (!sl.sc.event.eventQueue[t]) {
                            return;
                        }
                        sl.sc.event.eventQueue[t].cb(td);
                    }, 0);
                })();
            }
        }
    };

    this.remove = function (event, callback) {
        for (var x = 0; x < self.eventQueue.length; x++) {
            if (self.eventQueue[x].e === event && (self.eventQueue[x].cb === callback || callback === null)) {
                //console.log("removed: " + event);
                self.eventQueue.splice(x, 1);
            }
        }
    };
}