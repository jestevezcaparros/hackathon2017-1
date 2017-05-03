"use strict";
/**
 * Walkers - 2D position ramdom generators
 *
 * @license MIT
 * @author Álvaro Santamaría Herrero <asantamaria@itrsgroup.com>
 * @author Zuri Pabón <zpabon@itrsgroup.com>
 */

/**
 * MapArea class which defines a 2D polygon given as points of (lat, lon) pairs
 */
class MapBorders {
  constructor(points){
    this.points = points;
  }

  // Check if a given location in contained within the map area
  // base on ray-casting algorithm
  contains({x, y}){
    let inside = false;
    for (let i = 0, j = this.points.length - 1; i < this.points.length; j = i++) {
      const xi = this.points[i][0], yi = this.points[i][1];
      const xj = this.points[j][0], yj = this.points[j][1];
      const intersect = ((yi > x) != (yj > x))
          && (y < (xj - xi) * (x - yi) / (yj - yi) + xi);
      if (intersect) inside = !inside;
    }
    return inside;
  }
}

/**/
export const Borders = (...args) => new MapBorders(...args);

/* Export a default Map Polygon delimiting to La Termica */
const LA_TERMICA_BORDERS = [
  [ 36.688839, -4.446547 ],
  [ 36.689908, -4.446453 ],
  [ 36.689564, -4.443819 ],
  [ 36.688394, -4.444114 ]
];
export const laTermicaBorders = () => new MapBorders(LA_TERMICA_BORDERS)
