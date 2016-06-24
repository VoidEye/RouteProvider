// modified from http://medelbou.wordpress.com/2012/02/03/creating-a-tooltip-for-google-maps-javascript-api-v3/
// create a constructor
function Tooltip(options) {
    // Now initialize all properties.
    this.poly_ = options.poly;
    this.content_ = options.content;
    this.map_ = options.poly.get('map');
    this.cssClass_ = options.cssClass || null;
    // We define a property to hold the content's
    // div. We'll actually create this div
    // upon receipt of the add() method so we'll
    // leave it null for now.
    this.div_ = null;
    //Explicitly call setMap on this overlay
    this.setMap(this.map_);
    var me = this;
    // Show tooltip on mouseover event.
    google.maps.event.addListener(me.poly_, 'mouseover', function(e) {
        me.position = e.latLng;
        me.draw();
        me.show(e);
    });
    // Hide tooltip on mouseout event.
    google.maps.event.addListener(me.poly_, 'mouseout', function() {
        me.hide();
    });
}
// Now we extend google.maps.OverlayView()
Tooltip.prototype = new google.maps.OverlayView();
// We must implement three functions: onAdd, draw and onRemove, add the following lines:
// onAdd is one of the functions that we must implement,
// it will be called when the map is ready for the overlay to be attached.
Tooltip.prototype.onAdd = function() {
        // Create the DIV and set some basic attributes.
        var div = document.createElement('DIV');
        div.style.position = "absolute";
        // Hide tooltip
        div.style.visibility = "hidden";
        if (this.cssClass_)
            div.className += " " + this.cssClass_;
        //Attach content to the DIV.
        div.innerHTML = this.content_;
        // Set the overlay's div_ property to this DIV
        this.div_ = div;
        // We add an overlay to a map via one of the map's panes.
        // We'll add this overlay to the floatPane pane.
        var panes = this.getPanes();
        panes.floatPane.appendChild(this.div_);
    }
    // We here implement draw
Tooltip.prototype.draw = function() {
        // Position the overlay. We use the position of the mouse on mouseover
        // to peg it to the correct position, just northeast of the mouse.
        // We need to retrieve the projection from this overlay to do this.
        var overlayProjection = this.getProjection();
        // Retrieve the coordinates of the mouse
        // in latlngs and convert them to pixels coordinates.
        // We'll use these coordinates to place the DIV.
        if (this.position)
            var ne = overlayProjection.fromLatLngToDivPixel(this.position);
        else if (this.poly_.getPath && this.poly_.getPath().getAt && this.poly_.getPath().getAt(0))
            var ne = overlayProjection.fromLatLngToDivPixel(this.poly_.getPath().getAt(0));
        // Position the DIV.
        var div = this.div_;
        div.style.left = ne.x + 'px';
        div.style.top = ne.y + 'px';
    }
    // We here implement onRemove
Tooltip.prototype.onRemove = function() {
        this.div_.parentNode.removeChild(this.div_);
    }
    // Note that the visibility property must be a string enclosed in quotes
Tooltip.prototype.hide = function() {
    if (this.div_) {
        this.div_.style.visibility = "hidden";
    }
}
Tooltip.prototype.show = function(e) {
    if (this.div_) {
        this.div_.style.visibility = "visible";
    }
}
Tooltip.prototype.setContent = function(content) {
    this.content_ = content;
    this.div_.innerHTML = this.content_;
}