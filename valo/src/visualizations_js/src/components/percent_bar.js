"use strict";
/**
 * Utils module
 * @license MIT
 * @author Danilo Rossi <drossi@itrsgroup.com>
 * @author (Each contributor append a line here)
 */

export default function(domElement) {
  // <div class="ui indicating progress">
  //   <div class="bar"></div>
  //   <div class="label">Funding</div>
  // </div>
  //

  const progressContainer = document.createElement('div');
  ['ui', 'indicating', 'progress', 'small'].forEach( className => progressContainer.classList.add(className) );

  const iconsContainer = document.createElement('div');
  iconsContainer.style.textAlign = 'center';
  iconsContainer.style.position = 'absolute';
  iconsContainer.style.zIndex = '2';
  // iconsContainer.style.width = '100%';
  iconsContainer.style.height = '100%';
  iconsContainer.style.top = '-20px';//'4px';
  iconsContainer.style.left = '4px';
  iconsContainer.style.right = '4px';

  const bar = document.createElement('div');
  bar.classList.add('bar');

  const progress = document.createElement('div');
  progress.classList.add('progress');

  bar.appendChild(progress);

  const label = document.createElement('div');
  label.classList.add('label');

  progressContainer.appendChild(iconsContainer);
  progressContainer.appendChild(bar);
  progressContainer.appendChild(label);

  domElement.appendChild(progressContainer);

  $(progressContainer).progress({
    percent: 0
  });

  return {
    currentAvg: null,
    group: null,
    init: function(groupAverage, { leftIcon = '', centerIcon = '', rightIcon = '' }) {

      this.currentAverage = groupAverage.average;
      this.group = groupAverage.group;
      label.textContent = this.group;

      const icons = {
        iLeft: leftIcon || '',
        iCenter: centerIcon || '',
        iRight: rightIcon || ''
      };

      if(icons.iLeft) {
        const left = document.createElement('i');
        icons.iLeft.split(' ').forEach(cssClass => {
          left.classList.add(cssClass);
        })
        left.style.float = 'left';
        iconsContainer.appendChild(left);
      }

      if(icons.iCenter) {
        const center = document.createElement('i');
        icons.iCenter.split(' ').forEach(cssClass => {
          center.classList.add(cssClass);
        })
        iconsContainer.appendChild(center);
      }

      if(icons.iRight) {
        const right = document.createElement('i');
        icons.iRight.split(' ').forEach(cssClass => {
          right.classList.add(cssClass);
        })
        right.style.float = 'right';
        iconsContainer.appendChild(right);
      }

      $(progressContainer).progress({
        percent: this.currentAverage
      });
      return this;
    },
    updateAvg: function(avg) {
      this.currentAverage = avg;
      $(progressContainer).progress({
        percent: this.currentAverage
      });
      return this;
    }
  };

}
