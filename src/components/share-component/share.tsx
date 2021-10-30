import style from "../../layout/episode/episode.module.scss";
import React, {useEffect, useRef, useState} from "react";

const Share = ({episodeId, thumbnail}) => {

    const linkRef = useRef<HTMLInputElement>();
    const [windowHref, setWindowHref] = useState("");

    useEffect(() => {
        setWindowHref(window.location.href.replace("&", "%26"));
    }, []);

    const shareToTwitter = () => {
        window.open(
            `https://twitter.com/intent/tweet?text=${windowHref}`,
            "_blank"
        );
    };

    const shareToFacebook = () => {
        window.open(
            `https://www.facebook.com/sharer/sharer.php?u=${windowHref}`,
            "_blank"
        );
    };

    const shareToLine = () => {
        window.open(
            `https://social-plugins.line.me/lineit/share?url=${windowHref}`,
            "_blank"
        );
    };

    const shareToPinterest = () => {
        window.open(
            `https://www.pinterest.com/pin-builder/?url=${windowHref}%3Futm_source%3Ddynamic%26utm_campaign%3Dbfsharepinterest&description=${
                episodeId ? episodeId : "Share"
            }&media=${thumbnail}`,
            "_blank"
        );
    };

    const copyLink = (e) => {
        var dummy = document.createElement("input"),
            text = linkRef?.current?.value;

        document.body.appendChild(dummy);
        dummy.value = text;
        dummy.select();
        document.execCommand("copy");
        document.body.removeChild(dummy);
        linkRef?.current?.select();
    };

    return <div>
        <div>
            <span
                className={`${style["cursor_pointer"]} ${style["share-item"]}`}
                onClick={shareToFacebook}
            >
            <img src={"/assets/icons/share/facebook.svg"}/>
            </span>
            <span
                className={`${style["cursor_pointer"]} ${style["share-item"]}`}
                onClick={shareToTwitter}
            >
                <img src={"/assets/icons/share/twitter.svg"}/>
            </span>
            <span
                className={`${style["cursor_pointer"]} ${style["share-item"]}`}
                onClick={shareToLine}
            >
                <img src={"/assets/icons/share/line.svg"}/>
            </span>
            <span
                className={`${style["cursor_pointer"]} ${style["share-item"]}`}
                onClick={shareToPinterest}
            >
                <img src={"/assets/icons/share/pinterest.svg"}/>
            </span>
        </div>

        <div className={`${style["copy-link"]}`}>
            <input
                ref={linkRef}
                className={`${style["url"]}`}
                value={`${windowHref.replace("%26", "&")}`}
            />
            <span
                className={`${style["copy-btn"]} ${style["cursor_pointer"]}`}
                onClick={(e) => copyLink(e)}
            >
                Copy
            </span>
        </div>
    </div>
}

export default Share;