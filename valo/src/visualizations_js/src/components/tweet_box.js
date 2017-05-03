"use strict";

/**
 * Utils module
 * @license MIT
 * @author Danilo Rossi <drossi@itrsgroup.com>
 * @author (Each contributor append a line here)
 */
export default function(domElement) {

  // <a class="ui card" href="http://www.dog.com">
  //   <div class="content">
  //     <div class="header">Cute Dog</div>
  //     <div class="meta">
  //       <span class="category">Animals</span>
  //     </div>
  //     <div class="description">
  //       <p></p>
  //     </div>
  //   </div>
  //   <div class="extra content">
  //     <div class="right floated author">
  //       <img class="ui avatar image" src="/images/avatar/small/matt.jpg"> Matt
  //     </div>
  //   </div>
  // </a>

  const wrapper = document.createElement('a');
  ['ui', 'card'].forEach( className => wrapper.classList.add(className) );

  const divContent = document.createElement('div');
  divContent.classList.add('content');

  const divHeader = document.createElement('div');
  divHeader.classList.add('header');

  const divMeta = document.createElement('div');
  divHeader.classList.add('meta');

  const spanCategory = document.createElement('span');
  spanCategory.classList.add('category');

  const divDescription = document.createElement('div');
  divDescription.classList.add('description');

  const divExtra = document.createElement('div');
  ['extra', 'content'].forEach( className => divExtra.classList.add(className) );

  const divFloated = document.createElement('div');
  ['right', 'floated', 'author'].forEach( className => divFloated.classList.add(className) );

  const img = document.createElement('img');
  ['ui', 'avatar', 'image'].forEach( className => img.classList.add(className) );

  divMeta.appendChild(spanCategory);
  divContent.appendChild(divHeader);
  divContent.appendChild(divMeta);
  divContent.appendChild(divDescription);
  divFloated.appendChild(img);
  divExtra.appendChild(divFloated);
  wrapper.appendChild(divContent);
  wrapper.appendChild(divExtra);

  domElement.appendChild(wrapper);

  return {

    show(tweet) {
      divHeader.textContent = `${tweet.name} (${tweet.followers_count})`;//tweet.name;
      spanCategory.textContent = tweet.screen_name;
      divDescription.textContent = tweet.text;
      img.src = tweet.profile_image_url_https;
    }

  };

}
