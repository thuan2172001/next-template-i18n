import React, { useEffect, useState } from "react";
import { Timeline, Follow } from "react-twitter-widgets";
import style from "./twitter.module.scss";

export const TwitterEmbbed = ({ user }) => {
  console.log({ user });
  const [twitterError, setTwitterError] = useState(false);
  return (
    <>
      <div className={`${style["profile-main-social-media-content1"]}`}>
        <Timeline
          dataSource={{
            sourceType: "profile",
            screenName: user,
          }}
          options={{
            height: "480",
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
