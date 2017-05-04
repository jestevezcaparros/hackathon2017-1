"use strict";
/**
* Map module
* @license MIT
* @author Andres Ramirez <aramirez@itrsgroup.com>
* @author Zuri Pabón <zpabon@itrsgroup.com>
* @author (Each contributor append a line here)
*/

import {getIcon, plotPoint} from '../../../utils';

const OverlayView = window.google.maps.OverlayView;

export default class AttendersOverlayView extends OverlayView {

    /**
    * AttendersOverlayView constructor function
    * Adds the overlay view to the map
    *
    * @param {Map} map A google.maps.Map instance
    * @return AttendersOverlayView instance
    */
    constructor(map){
      super();
      this.points = [];
      this.map = map;
      this.mapsize = document.body.getBoundingClientRect();
      this.setMap(map);
    }

    /**
    * AttendersOverlayView constructor function
    * Adds the overlay view to the map
    *
    * @param {string} type The HTMLElement tag to add to the overlay
    * @param {string} id The HTMLElement id
    * @return AttendersOverlayView instance
    */
    createOverlayElement(type, id){
      if(!id || this[id]) throw Error(`${id} element already exists`);
      this[id] = document.createElement(type);
      this[id].id = id;
      this[id].className = "overlay";
      this[id].height = this.mapsize.height;
      this[id].width = this.mapsize.width;
      this.getPanes().overlayLayer.appendChild(this[id]);
      return this;
    }

    /**
    * Called once the overlay is added to the map
    * It is used to add the required DOM elements to the map
    * @return AttendersOverlayView instance
    */
    onAdd() {
      this.createOverlayElement('canvas', 'main');
      this.createOverlayElement('canvas', 'opacity');
      this.mainContext = this.main.getContext("2d");
      this.opacityContext = this.opacity.getContext('2d');
      return this;
    }

    /**
    * Called every time a draw is required
    * @return AttendersOverlayView instance
    */
    draw() {
        if(!this.mainContext || !this.opacityContext) return this;
        const projection = this.getProjection();
        this.mainContext.save();
        this.mainContext.clearRect(0, 0, this.mapsize.width, this.mapsize.height);
        this.mainContext.globalAlpha = 0.8;
        this.mainContext.drawImage(this.opacity, 0, 0);
        this.mainContext.globalAlpha = 1;
        this.mainContext.fillStyle = 'blue';
        this.points.forEach(point => plotPoint(this.mainContext, point, projection, this.map.getZoom()))
        this.mainContext.restore();
        this.opacityContext.clearRect(0, 0, this.mapsize.width, this.mapsize.height);
        this.opacityContext.drawImage(this.main, 0, 0);
        return this;
    }

    /**
    * This adds new points to the overlay.
    * @param {AttenderPoint} || {Array<AttenderPoint>} points a list AttenderPoint
    * @return AttendersOverlayView instance
    */
    add(points) {
        this.points = (Array.isArray(points) ? points : [points])
          .map(d => ({
            geo: new window.google.maps.LatLng(d.latitude, d.longitude),
            icon:d.icon
          }));
        this.draw();
    }
}
