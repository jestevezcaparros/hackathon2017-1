"use strict";
/**
 * Map module
 * @license MIT
 * @author Andres Ramirez <aramirez@itrsgroup.com>
 * @author Zuri Pabón <zpabon@itrsgroup.com>
 * @author (Each contributor append a line here)
 */

import {getIcon, plotPoint, createMap} from './utils';

function initCanvasOverlay(){

  function CanvasOverlay(map) {
      const {width, height} = document.body.getBoundingClientRect();
      const initCanvas = label => {
        this[label] = document.createElement("canvas");
        this[label].className = "overlay";
        this[label].height = height;
        this[label].width = width;
      }
      initCanvas('canvas');
      initCanvas('virtualCanvas');
      this.points = [];
      this.mapsize = {width, height};
      this.map = map;
      this.setMap(map);
  }

  CanvasOverlay.prototype = new window.google.maps.OverlayView();
  CanvasOverlay.prototype.onAdd = function() {
      this.getPanes().overlayLayer.appendChild(this.canvas);
      this.getPanes().overlayLayer.appendChild(this.virtualCanvas);
      this.context = this.canvas.getContext("2d");
      this.virtualContext = this.virtualCanvas.getContext('2d');
  }
  CanvasOverlay.prototype.draw = function() {
      if(!this.context || !this.virtualContext) return;
      const projection = this.getProjection();
      this.context.save();
      this.context.clearRect(0, 0, this.mapsize.width, this.mapsize.height);
      this.context.globalAlpha = 0.6;
      this.context.drawImage(this.virtualCanvas, 0, 0);
      this.context.globalAlpha = 1;
      this.context.fillStyle = 'blue';
      this.points.forEach(point => plotPoint(this.context, point, projection, this.map.getZoom()))
      this.context.restore();
      this.virtualContext.clearRect(0, 0, this.mapsize.width, this.mapsize.height);
      this.virtualContext.drawImage(this.canvas, 0, 0);
  }

  CanvasOverlay.prototype.addPoints = function(points) {
      this.points = (Array.isArray(points) ? points : [points])
        .map(d => ({
          geo: new window.google.maps.LatLng(d.latitude, d.longitude),
          icon:d.icon
        }));
      this.draw();
  }

  return CanvasOverlay;

}

export default (...args) => {
  const CanvasOverlay = initCanvasOverlay();
  return new CanvasOverlay(createMap(...args));
}
