"use strict";
/**
* Map module
* @license MIT
* @author Andres Ramirez <aramirez@itrsgroup.com>
* @author Zuri Pabón <zpabon@itrsgroup.com>
* @author (Each contributor append a line here)
*/

import Thermometer from './thermometer';

const OverlayView = window.google.maps.OverlayView;

export default class IOTOverlayView extends OverlayView {

    /**
    * IOTOverlayView constructor function
    * Adds the overlay view to the map
    *
    * @param {Map} map A google.maps.Map instance
    * @return IOTOverlayView instance
    */
    constructor(map){
      super();
      this._thermometers = {};
      this.map = map;
      this.mapsize = document.body.getBoundingClientRect();
      this.setMap(map);
    }

    /**
    * IOTOverlayView constructor function
    * Adds the overlay view to the map
    *
    * @param {string} type The HTMLElement tag to add to the overlay
    * @param {string} id The HTMLElement id
    * @return IOTOverlayView instance
    */
    createOverlayElement(type, id){
      if(!id || this[id]) throw Error(`${id} element already exists`);
      this[id] = document.createElement(type);
      this[id].id = id;
      this[id].className = "overlay";
      this[id].height = `${this.mapsize.height}px`;
      this[id].width = `${this.mapsize.width}px`;
      this.getPanes().overlayLayer.appendChild(this[id]);
      return this;
    }

    /**
    * Creates or get a thermometer instance
    *
    * @param {string} id The thermometer id
    * @return Thermometer instance
    */
    getThermometer(id) {
      if(this._thermometers[id]) return this._thermometers[id];
      this._thermometers[id] = Thermometer(this.iotContainerElement);
      this._thermometers[id].setRange([0,40]);
      return this._thermometers[id];
    }

    /**
    * Called once the overlay is added to the map
    * It is used to add the required DOM elements to the map
    * @return IOTOverlayView instance
    */
    onAdd() {
      // Create thermometer container and add class
      this.createOverlayElement('div', 'iotContainerElement');
      return this;
    }

    /**
    * This adds new points to the overlay.
    * @param {IOTPoint} point a list IOTPoint
    * @return IOTOverlayView instance
    */
    add(point) {
      const thermometer = this.getThermometer(point.contributor, point.position);
      const geopoint = new window.google.maps.LatLng(point.position.latitude, point.position.longitude);
      const projection = this.getProjection();
      thermometer.setPosition(projection.fromLatLngToDivPixel(geopoint));
      thermometer.setTemperature(point.temperature);
      return this;
    }

    /* Not implemented */
    draw(){}
}
