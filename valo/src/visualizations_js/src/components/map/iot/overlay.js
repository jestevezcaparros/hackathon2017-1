"use strict";
/**
* Map module
* @license MIT
* @author Andres Ramirez <aramirez@itrsgroup.com>
* @author Zuri Pabón <zpabon@itrsgroup.com>
* @author (Each contributor append a line here)
*/

import Thermometer from './thermometer';

export default function(map){

  function DivOverlay() {
    this._thermometers = {};
    this.map = map;
    this.setMap(map);
  }

  DivOverlay.prototype = new window.google.maps.OverlayView();
  DivOverlay.prototype.getThermometer = function(id, position) {
      if(this._thermometers[id]) return this._thermometers[id];
      this._thermometers[id] = Thermometer(this.overlay);
      this._thermometers[id].setRange([0,40]);
      return this._thermometers[id];
  }
  DivOverlay.prototype.draw = function() {};
  DivOverlay.prototype.onAdd = function() {
    // Create thermometer container and add class
    const {width, height} = document.body.getBoundingClientRect();
    this.overlay = document.createElement('div');
    this.overlay.classList.add('overlay');
    this.overlay.style.width = `${width}px`;
    this.overlay.style.height = `${height}px`;
    this.getPanes().overlayLayer.appendChild(this.overlay);
  };

  DivOverlay.prototype.addTemperature = function(data) {
    const getThermometer = this.getThermometer(data.contributor, data.position);
    const geopoint = new window.google.maps.LatLng(data.position.latitude, data.position.longitude);
    const projection = this.getProjection();
    getThermometer.setPosition(projection.fromLatLngToDivPixel(geopoint));
    getThermometer.setTemperature(data.temperature);
  }

  return new DivOverlay();
}
