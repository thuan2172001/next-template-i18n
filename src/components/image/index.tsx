import Image from "next/image";
import PropTypes from "prop-types";

const CustomImageField = (props) => {
  const {
    classNames,
    size,
    src,
    alt,
    height,
    borderSize,
    width,
    placeholder,
    onError,
    isNewRelease,
    isLocked,
    isSoldOut,
    isPublished,
  } = props;

  let overrideClassNames = [];

  const initArgs = () => {
    if (size === "middle-custom") {
      overrideClassNames.push("atn-btn-md-custom");
    }

    if (size === "large-custom") {
      overrideClassNames.push("atn-btn-lg-custom");
    }

    if (size === "mid-large-custom") {
      overrideClassNames.push("atn-btn-mlg-custom");
    }

    if (borderSize === "light") {
      overrideClassNames.push("atn-image-light-border");
    }

    if (borderSize === "bold") {
      overrideClassNames.push("atn-image-bold-border");
    }

    if (classNames?.length > 0) {
      overrideClassNames = overrideClassNames.concat(classNames);
    }

    if (isLocked === true) {
      overrideClassNames.push("atn-image-lock");
    }
  };

  initArgs();

  return (
    <div>
      <div className="main-image">
        <Image
          className={overrideClassNames.join(" ")}
          src={src}
          alt={alt}
          width={width}
          placeholder={placeholder}
          onError={onError}
          height={height}
        />
      </div>

      {isNewRelease && (
        <div className="new-release-tag" style={{ height: "36px" }}>
          <Image
            src="/images/new-release.svg"
            alt={alt}
            placeholder={placeholder}
            onError={onError}
            width={width}
            height={36}
          />
        </div>
      )}

      {isSoldOut && isPublished !== false && (
        <div className={`sold-out-tag ${width > 500 && 'large-tag'}`}>
          <Image src="/icons/sold-out.svg" width={135} height={48} />
        </div>
      )}

      {isPublished === false && (
        <div className="unpublished-tag">
          <Image
            src="/icons/unpublish-tag-icon.svg"
            width={181.5}
            height={54}
          />
        </div>
      )}
    </div>
  );
};

CustomImageField.propTypes = {
  name: PropTypes.string,
  children: PropTypes.any,
  color: PropTypes.string,
  classNames: PropTypes.array,
  style: PropTypes.any,
  block: PropTypes.bool,
  danger: PropTypes.bool,
  disabled: PropTypes.bool,
  ghost: PropTypes.bool,
  href: PropTypes.string,
  htmlType: PropTypes.string,
  icon: PropTypes.node,
  iconLeft: PropTypes.node,
  iconRight: PropTypes.node,
  loading: PropTypes.any,
  shape: PropTypes.string,
  size: PropTypes.string,
  target: PropTypes.string,
  visible: PropTypes.bool,
  getContainer: PropTypes.string,
  src: PropTypes.string,
  maskClassName: PropTypes.string,
  alt: PropTypes.string,
  height: PropTypes.string,
  width: PropTypes.string,
  placeholder: PropTypes.string,
  preview: PropTypes.bool,
  borderSize: PropTypes.string,
  isNewRelease: PropTypes.bool,
  isLocked: PropTypes.bool,
  isSoldOut: PropTypes.bool,
  isPublished: PropTypes.bool,
};

export default CustomImageField;
