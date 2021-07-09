import React, { useEffect, useState } from 'react';
import { Timeline } from 'react-twitter-widgets'

export default function fetchProfile() {

  const twitterHandle = "diaace_official";
  const parentElement = document.getElementById("embed-div");;

  // Fetch Profile
  fetch(`https://embed-twitter-profile.herokuapp.com/api/v1/getuser/${twitterHandle}`)
    .then(res => res.json())
    .then(data => {
      if (data.name && data.screen_name) {
        console.log(data);
        showProfile(data, parentElement);
      } else {
        console.log("Please provide valid twitter handle.");
      }
    })
    .catch(err => {
      console.log(err)
      return;
    })
}

// create elements and append to right documents.
function showProfile(userProfile, mainDiv) {
  // profile card section
  const profileCard = createElement({
    type: "section",
    props: {
      class: "profile_card",
    },
    styles: `
      margin: 0;
      padding: 0;
      width: 600px;
      border: 1px solid black;
      margin: 0 auto;
      background: #fff;
    `
  });

  const imageContainer = createElement({
    type: "div",
    props: {
      class: "img_container",
    },
    styles: `
      background-color: skyblue;
      background-image: url(${userProfile.profile_banner_url});
      height: 120px;
      border-bottom: 1px solid black;
      background-size: cover;
      background-position: center center;
      background-repeat: no-repeat;
      position: relative;
    `,
  });

  const profileImage = createElement({
    type: "img",
    props: {
      class: "profile_image",
      src: changeProfileImgUrl(userProfile.profile_image_url_https)
    },
    styles: `
      width: 100px;
      height: 100px;
      position: absolute;
      left: 10px;
      top: 75px;
      display: inline-block;
      border-radius: 50%;
      border: 4px solid #fff;
    `,
  });

  const profileName = createElement({
    type: "div",
    props: {
      class: "profile_name",
    },
    styles: "padding: 10px",
    content: `<p style="font-size: 18px; position: relative; top: 40px; color: black">${userProfile.name}</p>
    
    <p style="font-size: 15px; color: rgb(90, 90, 90); position: relative; top: 20px; margin: 18px 0;">@${userProfile.screen_name}</p>`
  });

  const profileBio = createElement({
    type: "p",
    props: {
      class: "profile_bio",
    },
    styles: `
      margin: 0;
      padding: 10px;
      font-size: 15px;
    `,
    content: setDescLinks(userProfile.description),
  });

  const locationAndUrl = createElement({
    type: "p",
    props: {
      class: "location_and_url",
    },
    styles: `
      margin: 0;
      font-size: 15px;
      color: rgb(90, 90, 90);
      padding: 10px;
    `,
    content: `<span style="display: inline-block;">📍 ${userProfile.location}</span> 
    
    <span style="display: inline-block;">🔗 <a href="${userProfile.url}" target="_blank">${userProfile.url}</a></span>`,
  });

  const followCount = createElement({
    type: "p",
    props: {
      class: "follow_count",
    },
    styles: `
      margin: 0;
      font-size: 15px;
      color: rgb(90, 90, 90);
      padding: 10px;
    `,
    content: `
    <span style="display: inline-block; padding-right: 8px;"><span style="font-weight: bold; color: black; padding-right: 2px;">${userProfile.friends_count}</span> Following</span>

    <span style="display: inline-block; padding-right: 8px;"><span style="font-weight: bold; color: black; padding-right: 2px;">${userProfile.followers_count}</span> Followers</span>
    `,
  });

  imageContainer.appendChild(profileImage);
  profileCard.appendChild(imageContainer);
  profileCard.appendChild(profileName);
  profileCard.appendChild(profileBio);
  profileCard.appendChild(locationAndUrl);
  profileCard.appendChild(followCount);
  // profileCard.appendChild(timeLine)

  // Append profileCard in body.
  mainDiv.appendChild(profileCard);

  profileCard.style.fontFamily = "sans-serif";
  document.querySelectorAll(".profile_card *").forEach(child => {
    child.style.textDecoration = "none";
    child.style.lineHeight = "1.5";
    child.style.boxSizing = "border-box";
  })

  // Media Query function
  function screenSize768(x) {
    if (x.matches) { // If media query matches
      profileCard.style.cssText = `
        font-family: sans-serif;
        width: 480px;
        margin: 0 auto;
        background: #fff;
      `;

      imageContainer.style.cssText = `
        background-color: skyblue;
        background-image: url(${userProfile.profile_banner_url});

        height: 160px;
        border-bottom: 1px solid black;
        background-size: cover;
        background-position: center center;
        background-repeat: no-repeat;
        position: relative;
      `;

      profileImage.style.cssText = `
        width: 100px;
        height: 100px;
        position: absolute;
        left: 10px;
        top: 110px;
        display: inline-block;
        border-radius: 50%;
        border: 4px solid #fff;
      `;
    } else {
      profileCard.style.cssText = `
        font-family: sans-serif;
        width: 600px;
        border: 1px solid black;
        margin: 0 auto;
        background: #fff;
      `;

      imageContainer.style.cssText = `
        background-color: skyblue;
        background-image: url(${userProfile.profile_banner_url});

        height: 120px;
        border-bottom: 1px solid black;
        background-size: cover;
        background-position: center center;
        background-repeat: no-repeat;
        position: relative;
      `;

      profileImage.style.cssText = `
        width: 100px;
        height: 100px;
        position: absolute;
        left: 10px;
        top: 75px;
        display: inline-block;
        border-radius: 50%;
        border: 4px solid #fff;
      `;
    }
  }
  let x = window.matchMedia("(max-width: 768px)")
  screenSize768(x) // Call listener function at run time
  x.addListener(screenSize768) // Attach listener function on state changes

  // Below 570px
  function screenSize570(y) {
    if (y.matches) { // If media query matches
      profileCard.style.cssText = `
        font-family: sans-serif;
        width: 320px;
        border: 1px solid black;
        margin: 0 auto;
        background: #fff;
      `;

      imageContainer.style.cssText = `
        background-color: skyblue;
        background-image: url(${userProfile.profile_banner_url});

        height: 120px;
        border-bottom: 1px solid black;
        background-size: cover;
        background-position: center center;
        background-repeat: no-repeat;
        position: relative;
      `;

      profileImage.style.cssText = `
        width: 80px;
        height: 80px;
        position: absolute;
        left: 10px;
        top: 85px;
        display: inline-block;
        border-radius: 50%;
        border: 4px solid #fff;
      `;
    } else {
      screenSize768(x);
    }
  }
  let y = window.matchMedia("(max-width: 570px)")
  screenSize570(y) // Call listener function at run time
  y.addListener(screenSize570) // Attach listener function on state changes

  // Below 420px
  function screenSize420(z) {
    if (z.matches) { // If media query matches
      profileCard.style.cssText = `
        font-family: sans-serif;
        width: 90%;
        border: 1px solid black;
        margin: 0 auto;
        background: #fff;
      `;

      imageContainer.style.cssText = `
        background-color: skyblue;
        background-image: url(${userProfile.profile_banner_url});

        height: 80px;
        border-bottom: 1px solid black;
        background-size: cover;
        background-position: center center;
        background-repeat: no-repeat;
        position: relative;
      `;

      profileImage.style.cssText = `
        width: 70px;
        height: 70px;
        position: absolute;
        left: 10px;
        top: 60px;
        display: inline-block;
        border-radius: 50%;
        border: 4px solid #fff;
      `;
    } else {
      screenSize570(y);
    }
  }
  let z = window.matchMedia("(max-width: 420px)")
  screenSize420(z) // Call listener function at run time
  z.addListener(screenSize420) // Attach listener function on state changes 
}

// Change profile image url to a higher dimesion url.
function changeProfileImgUrl(url) {
  const reversedUrl = url.split("").reverse().join("");
  const reversedNewUrl = reversedUrl.replace("lamron", "004x004");
  const newUrl = reversedNewUrl.split("").reverse().join("");

  return newUrl;
}

// Make links in description clickable in profile bio.
function setDescLinks(description) {
  const descArr = description.split(" ");
  const updatedDescArr = descArr.map(word => {
    if (word.startsWith("https") || word.startsWith("http")) {
      return `<a href="${word}" target="_blank">${word}</a>`;
    }

    return word;
  });

  return updatedDescArr.join(" ");
}

// Create element function.
function createElement({ type, props, styles, content }) {
  const element = document.createElement(type);
  for (let key in props) {
    element.setAttribute(key, props[key]);
  }
  element.innerHTML = content || "";
  element.style.cssText = styles;

  return element;
}

export const TwitterEmbbed = () => {
	const [twitterError, setTwitterError] = useState(false);

  useEffect(() => {
    fetchProfile()
  }, [])

  return (
    <>
      <div className="profile-main-social-media-content1">
        <div className="twitter-embed-homepage" id="embed-div"></div>
        <Timeline
          dataSource={{
            sourceType: 'profile',
            screenName: "diaace_official"
          }}
          options={{
            height: '80',
            width: '308',
            dataChrome: "noheader nofooter noborders",
          }}
          renderError={(_err) => {
            setTwitterError(true)
            console.log(_err);
            return <div className="twitter-fail-container">Could not load timeline !</div>
          }}
        />
      </div>
      { twitterError && <div className="twitter-fail-container">Could not load timeline !</div>}
    </>
  )
}