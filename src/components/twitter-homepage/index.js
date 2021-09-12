import React, { useEffect, useState } from "react";
import { Timeline,Follow } from "react-twitter-widgets";
import style from "./twitter.module.scss";

const twitterHandle = "diaace_official";
export default function fetchProfile() {
  
  const parentElement = document.getElementById("embed-div");

  // Fetch Profile
  fetch(
    `https://embed-twitter-profile.herokuapp.com/api/v1/getuser/${twitterHandle}`
  )
    .then((res) => res.json())
    .then((data) => {
      if (data.name && data.screen_name) {
        showProfile(data, parentElement);
      } else {
        console.log("Please provide valid twitter handle.");
      }
    })
    .catch((err) => {
      console.log(err);
      return;
    });
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
      width: 100%;
      border: #cfd5e3;
      border-bottom: none;
      margin: 0 auto;
      background: #fff;
    `,
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
  const buttonContainer = createElement({
    type: "div",
    props: {
      class: "btn_container",
    },
    styles: `
      display: flex;
      position: absolute;
      height: 45px;
      width: 160px;
      top: 8%;
      left: 50%;
      justify-content: flex-end;
    `,
  });
  const threedotsBtn = createElement({
    type: "div",
    props: {
      class: "threedots-btn",
    },
    styles: `
      //border: 1px solid #3b94d9;
      height: 39px;
      width: 39px;
      background-image: url(${'/icons/more.svg'});
      cursor: pointer;
      margin-right: 8px;

    `,
  });
  const bellBtn = createElement({
    type: "div",
    props: {
      class: "bell-btn",
    },
    styles: `
      height: 35px;
      width: 35px;
      border-radius: 50%;
      background-image: url(${'/icons/more.svg'});
      top: 8%;
      left: 50%;
      cursor: pointer;
      margin-right: 10px;
    `,
  });
  const followBtn = createElement({
    type: "a",
    props: {
      class: `follow-btn`,
      href : `https://twitter.com/intent/user?screen_name=${twitterHandle}`
    },
    styles: `
      height: 39px;
      width: 74px;
      top: 8%;
      left: 50%;
      cursor: pointer;
      background-image: url(${'/icons/follow.svg'});
    `,
  });

  const profileImage = createElement({
    type: "img",
    props: {
      class: "profile_image",
      src: changeProfileImgUrl(userProfile.profile_image_url_https),
    },
    styles: `
      width: 100px;
      height: 100px;
      position: absolute;
      left: 10px;
      top: 95px;
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
    styles: "padding: 10px; padding-top: 30px; position: relative;",
    content: `<p style="font-size: 18px; position: relative; top: 40px; color: black">${userProfile.name}</p>
    
    <p style="font-size: 15px; color: rgb(90, 90, 90); position: relative; top: 20px; margin: 18px 0;">@${userProfile.screen_name}</p>`,
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
      padding: 10px;
    `,
    content: `<span style="display: inline-block; cursor: pointer; color: #4b94cd;">${"Translate bio"}</span> `,
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

  buttonContainer.appendChild(threedotsBtn);
  //buttonContainer.appendChild(bellBtn);
  buttonContainer.appendChild(followBtn);
  imageContainer.appendChild(profileImage);
  profileCard.appendChild(imageContainer);
  profileCard.appendChild(profileName);
  profileName.appendChild(buttonContainer);
  profileCard.appendChild(profileBio);
  profileCard.appendChild(locationAndUrl);
  profileCard.appendChild(followCount);
  // profileCard.appendChild(timeLine)

  // Append profileCard in body.
  mainDiv.appendChild(profileCard);

  profileCard.style.fontFamily = "sans-serif";
  document.querySelectorAll(".profile_card *").forEach((child) => {
    child.style.textDecoration = "none";
    child.style.lineHeight = "1.5";
    child.style.boxSizing = "border-box";
  });

  // Media Query function
  function screenSize768(x) {
    if (x.matches) {
      // If media query matches
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
        width: 100%;
        border: 1px solid #cfd5e3;
        border-bottom:none;
        margin: 0 auto;
        background: #fff;
      `;

      imageContainer.style.cssText = `
        background-color: skyblue;
        background-image: url(${userProfile.profile_banner_url});

        height: 120px;
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
        top: 95px;
        display: inline-block;
        border-radius: 50%;
        border: 4px solid #fff;
      `;
    }
  }
  let x = window.matchMedia("(max-width: 768px)");
  screenSize768(x); // Call listener function at run time
  x.addListener(screenSize768); // Attach listener function on state changes

  // Below 570px
  function screenSize570(y) {
    if (y.matches) {
      // If media query matches
      profileCard.style.cssText = `
        font-family: sans-serif;
        width: 100%;
        border: 1px solid #cfd5e3;
        border-bottom:none;
        margin: 0 auto;
        background: #fff;
      `;

      imageContainer.style.cssText = `
        background-color: skyblue;
        background-image: url(${userProfile.profile_banner_url});

        height: 120px;
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
  let y = window.matchMedia("(max-width: 570px)");
  screenSize570(y); // Call listener function at run time
  y.addListener(screenSize570); // Attach listener function on state changes

  // Below 420px
  function screenSize420(z) {
    if (z.matches) {
      // If media query matches
      profileCard.style.cssText = `
        font-family: sans-serif;
        width: 90%;
        border: 1px solid gray;
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
  let z = window.matchMedia("(max-width: 420px)");
  screenSize420(z); // Call listener function at run time
  z.addListener(screenSize420); // Attach listener function on state changes
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
  const updatedDescArr = descArr.map((word) => {
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
    fetchProfile();
  }, []);

  return (
    <>
      <div className={`${style["profile-main-social-media-content1"]}`}>
        <div
          className={`${style["twitter-embed-homepage"]}`}
          id="embed-div"
        ></div>
        <Timeline
          dataSource={{
            sourceType: "profile",
            screenName: "FabrizioRomano",
          }}
          options={{
            height: "360",
            width: "100%",
            dataChrome: "noheader nofooter noborders",
          }}
          renderError={(_err) => {
            setTwitterError(true);
            console.log(_err);
            return (
              <div className="twitter-fail-container">
                Could not load timeline !
              </div>
            );
          }}
        />
      </div>
      {twitterError && (
        <div className="twitter-fail-container">Could not load timeline !</div>
      )}
    </>
  );
};
