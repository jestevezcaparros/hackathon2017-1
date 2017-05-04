"use strict";
/**
 * Map module
 * @license MIT
 * @author Andres Ramirez <aramirez@itrsgroup.com>
 * @author Zuri Pabón <zpabon@itrsgroup.com>
 * @author (Each contributor append a line here)
 */

import {createMap} from '../../utils';
import PositionOverlay from './position_overlay';
import TemperatureOverlay from './temperature_overlay';

export default (...args) => {
  const map = createMap(...args);
  const positionOverlay = PositionOverlay(map);
  const temperatureOverlay = TemperatureOverlay(map);
  return {
    position: positionOverlay,
    temperature: temperatureOverlay
  };
}
