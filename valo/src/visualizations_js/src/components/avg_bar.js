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
  progressContainer.classList.add('ui');
  progressContainer.classList.add('indicating');
  progressContainer.classList.add('progress');

  const bar = document.createElement('div');
  bar.classList.add('bar');

  const label = document.createElement('div');
  label.classList.add('label');

  progressContainer.appendChild(bar);
  progressContainer.appendChild(label);

  domElement.appendChild(progressContainer);

  $(progressContainer).progress({
    percent: 0
  });

  return {
    currentAvg: null,
    group: null,
    init: function(groupAverage) {
      this.currentAverage = groupAverage.average;
      this.group = groupAverage.group;

      label.textContent = this.group;
      //domElement.textContent = `Group: ${this.group} > ${this.currentAverage}`;
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
