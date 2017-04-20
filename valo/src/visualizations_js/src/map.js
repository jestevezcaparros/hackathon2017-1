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
      this.map = map;
      this.canvas = null;
      this.context = null;
      this.setMap(map);
  }

  CanvasOverlay.prototype = new window.google.maps.OverlayView();
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

      const _data = data.map(d => ({geo: new window.google.maps.LatLng(d.latitude, d.longitude), icon:d.icon}));

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

  return CanvasOverlay;

}

export default (map) => {
  const CanvasOverlay = initCanvasOverlay();
  return new CanvasOverlay(map);
}
