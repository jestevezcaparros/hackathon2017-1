window.initMap = function() {

    const mapContainer = d3.select('body')
        .append('div')
        .attr('id', 'map')
        .style('width', '100%')
        .style('height', '100%');

    const google = window.google;

    const LA_TERMICA_COORDINATES = {
        lat: 36.689150,
        lon: -4.445000
    };

    const map = createMap(
        google, 
        mapContainer.node(),
        LA_TERMICA_COORDINATES
    );

    

    function CanvasOverlay(map) {

        this.map = map;
        this.canvas = null;
        this.context = null;

        this.setMap(map);
    }


    CanvasOverlay.prototype = new google.maps.OverlayView();
    CanvasOverlay.prototype.onAdd = function() {

        const {
            width,
            height
        } = document.body.getBoundingClientRect();

        this.projection = this.getProjection();

        this.canvas = d3.select('body')
            .append('canvas')
            .attr('width', width)
            .attr('height', height)
            .style('position', 'fixed')
            .style('top', '0')
            .style('left', '0');

        this.context = this.canvas
            .node()
            .getContext('2d');    
        
        this.virtualCanvas = document.createElement('canvas');

        d3.select(this.virtualCanvas)
            .attr('width', width)
            .attr('height', height)
        
        this.virtualContext = this.virtualCanvas.getContext('2d');

    }
    CanvasOverlay.prototype.draw = function() {
        console.log("Overlay added")
    }

    CanvasOverlay.prototype.addPoints = function(points) {

        if(!this.context) {
            return;
        }        

        const data = Array.isArray(points) ? points : [points];

        const _data = data.map(d => new google.maps.LatLng(d.latitude, d.longitude))
        
        this.context.save();
        this.context.clearRect(0, 0, this.context.canvas.width, this.context.canvas.height);  
        this.context.globalAlpha = 0.9;    
        this.context.drawImage(this.virtualCanvas, 0, 0);  
        this.context.globalAlpha = 1;
        this.context.fillStyle = 'blue';
        _data.forEach(point => {
            plotPoint(this.context, point, this.projection)
        })

        this.context.restore();

        this.virtualContext.clearRect(0, 0, this.context.canvas.width, this.context.canvas.height);
        this.virtualContext.drawImage(this.canvas.node(), 0, 0);        

    }

    const overlay =  new CanvasOverlay(map);    

    let i=0;
    setInterval(
        function() {
            overlay.addPoints({
                latitude: 36.689461 + 0.00002 * i,
                longitude: -4.445287 + 0.00001 * i
            })

            i++
        },
        500
    )

}


function plotPoint(context, point, projection) {

    context.beginPath();
    
    context.arc(
        projection.fromLatLngToContainerPixel(point).x,
        projection.fromLatLngToContainerPixel(point).y,
        4,
        0,
        2*Math.PI
    )

    context.fill();
    context.closePath();
}


/**
 * 
 * @param {*} google 
 * @param {*} container 
 * @param {*} coordinates 
 */
function createMap(google, container, coordinates) {

    const center = new google.maps.LatLng(coordinates.lat, coordinates.lon);

    return new google.maps.Map(container, {
        center: center,
        zoom: 20,
        disableDefaultUI: true
    })

} 








