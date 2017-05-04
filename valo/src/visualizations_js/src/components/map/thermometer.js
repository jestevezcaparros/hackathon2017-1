
function initThermometer() {
    /**
     *
     * @param {HTMLElement} domContainer
     */
    function Thermometer(domContainer) {

        // Create thermometer container and add class
        this.thermometerContainer = document.createElement('div');
        this.thermometerContainer.classList.add('thermometer');

        // Create thermometer bulb, add class and append to container
        this.bulb = document.createElement('div');
        this.bulb.classList.add('bulb');
        this.thermometerContainer.appendChild(this.bulb);

        // Create thermometer tube, add class and append to container
        const tube = document.createElement('div');
        tube.classList.add('tube');
        this.thermometerContainer.appendChild(tube);

        this.stem = document.createElement('div');
        this.stem.classList.add('stem');
        tube.appendChild(this.stem);

        this.fluid = document.createElement('div');
        this.fluid.classList.add('fluid');
        this.stem.appendChild(this.fluid);

        this.highColor = '#e23951';
        this.medColor = '#ff9800';
        this.lowColor = '#03a9f4';

        domContainer.appendChild(this.thermometerContainer);

    }


    /**
     * @param {Number} temperature
     */
    Thermometer.prototype.setTemperature = function (temperature) {
        this.bulb.textContent = Math.round(temperature);

        const height = this.scale(temperature);
        this.fluid.style.height =  `${height}%`;

        if(temperature >= 35){
          this.bulb.style.background =  this.highColor;
          this.fluid.style.background =  this.highColor;
        }
        else if(temperature <= 15){
          this.bulb.style.background =  this.lowColor;
          this.fluid.style.background =  this.lowColor;
        }
        else {
          this.bulb.style.background =  this.medColor;
          this.fluid.style.background =  this.medColor;
        }
    }


    /**
     * @param {Object} range Contains min and max temperature range
     */
    Thermometer.prototype.setRange = function (range) {

        this.range = range;

    }

    /**
     * @param {Object} position Contains x and y position of the thermometer
     */
    Thermometer.prototype.setPosition = function (position) {
        this.thermometerContainer.style.left = `${position.x}px`;
        this.thermometerContainer.style.top = `${position.y}px`;
    }


    /**
     * Destroys visualization
     */
    Thermometer.prototype.destroy = function () {
        this.thermometerContainer.parentNode.removeChild(this.thermometerContainer);
    }

    /**
     * Scales thermometer
     */
    Thermometer.prototype.scale = function(temperature) {

        if(!this.range) {
            return null
        }

        return temperature * 100 / (this.range[1] - this.range[0]);

    }

    Thermometer.prototype.setScale = function(scale) {
        this.thermometerContainer.style.zoom = scale;
    }

    return Thermometer;
}


export default function (domContainer) {
    const Thermometer = initThermometer();
    return new Thermometer(domContainer);
}
