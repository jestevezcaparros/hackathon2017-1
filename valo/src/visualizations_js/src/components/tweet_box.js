"use strict";

/**
 * Utils module
 * @license MIT
 * @author Danilo Rossi <drossi@itrsgroup.com>
 * @author Javier Latorre <jdelatorre@itrsgroup.com>
 * @author (Each contributor append a line here)
 */
export default function(domElement) {

  // <div class="tweet-container">
  //   <div class="ui grid">
  //     <div class="twelve wide column">
  //       <div class="user-container">
  //         <img class="blue-wave" src="./src/images/blue-wave.png"/>
  //         <img class="avatar-img" src="" alt="avatar-img"/>
  //         <div class="name-container">
  //           <p class="tweet-name"></p>
  //           <p class="tweet-screen-name"></p>
  //         </div>
  //       </div>
  //       <div class="tweet-text"></div>
  //     </div>
  //     <div class="four wide column right-column">
  //       <p class="live-in-text">LIVE IN #JOTB17</p>
  //       <div class="time-container">
  //         <img class="red-wave" src="./src/images/red-wave.png"/>
  //         <span class="time"></span>
  //       </div>
  //     </div>
  //   </div>
  // </div>

  const wrapper = document.createElement('div');
  wrapper.classList.add('wrapper');

  const ui_grid = document.createElement('div');
  ['ui', 'grid'].forEach( className => ui_grid.classList.add(className) );

  const leftColumn = document.createElement('div');
  ['fourteen', 'wide', 'column'].forEach( className => leftColumn.classList.add(className) );

  const userContainer = document.createElement('div');
  userContainer.classList.add('user-container');

  const blueWave = document.createElement('img');
  blueWave.classList.add('blue-wave');

  const avatarImg = document.createElement('img');
  avatarImg.classList.add('avatar-img');

  const nameContainer = document.createElement('div');
  nameContainer.classList.add('name-container');

  const tweetName = document.createElement('p');
  tweetName.classList.add('tweet-name');

  const tweetScreenName = document.createElement('p');
  tweetScreenName.classList.add('tweet-screen-name');

  const tweetText = document.createElement('div');
  tweetText.classList.add('tweet-text');

  const rightColumn = document.createElement('div');
  ['two', 'wide', 'column', 'right-column'].forEach( className => rightColumn.classList.add(className) );

  const liveInText = document.createElement('p');
  liveInText.classList.add('live-in-text');

  const timeContainer = document.createElement('div');
  timeContainer.classList.add('time-container');

  const redWave = document.createElement('img');
  redWave.classList.add('red-wave');

  const time = document.createElement('p');
  time.classList.add('time');


  timeContainer.appendChild(redWave);
  timeContainer.appendChild(time);
  rightColumn.appendChild(liveInText);
  rightColumn.appendChild(timeContainer);

  nameContainer.appendChild(tweetName);
  nameContainer.appendChild(tweetScreenName);
  userContainer.appendChild(blueWave);
  userContainer.appendChild(avatarImg);
  userContainer.appendChild(nameContainer);
  leftColumn.appendChild(userContainer);
  leftColumn.appendChild(tweetText);

  ui_grid.appendChild(leftColumn);
  ui_grid.appendChild(rightColumn);
  wrapper.appendChild(ui_grid);
  domElement.appendChild(wrapper);

  return {

    show(tweet) {
      let hours = (new Date()).getHours();
      hours = (hours.length<10)?"0"+hours:hours;
      let minutes = (new Date()).getMinutes();
      minutes = (minutes.length<10)?"0"+minutes:minutes;

      tweetName.textContent = tweet.name;
      tweetScreenName.textContent = "@"+tweet.screen_name;
      tweetText.textContent = tweet.text;
      liveInText.textContent = "LIVE IN #JOTB17";
      time.textContent = `${hours}:${minutes}`;

      avatarImg.src = tweet.profile_image_url_https;
      redWave.src = "./src/images/red-wave.png";
      blueWave.src = "./src/images/blue-wave.png";
    }

  };

}
