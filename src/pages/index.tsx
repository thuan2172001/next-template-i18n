import React, { useEffect, useState, useRef } from "react";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import Image from "next/image";
import Profile from "../templates/profile/index";
import Link from "next/link";
import { HomepageProduct } from "../components/product-item/HomepageProduct";
import { HOMEPAGE_CONTENT } from "../constants";
import CustomerSerieAPI from "../api/customer/serie";
import { Footer } from "@components/footer";
import { Header } from "@components/header";
import SeriesAPI from "../api/creator/series";
import CreatorSettingAPI from "../api/creator/setting";
import MoonLoader from "react-spinners/MoonLoader";
import { ViewSupport } from "@components/view-pdf-modal/index";
import { GetUserInfo } from "src/api/user";
import { notifyError } from "@components/toastify";
import { useRouter } from "next/router";

const Home: React.FC<{ homepageContent: any }> = () => {
  const { t } = useTranslation();
  const router = useRouter();

  const [isCreatorMode, setCreatorMode] = useState(false);
  const [editBannerClicked, setEditBannerClick] = useState(false);
  const [cover, setCover] = useState(null);
  const [isLoading, setLoading] = useState(false);
  const [showSupportView, setShowSupportView] = useState(false);
  const [pdfSrc, setPdfSrc] = useState("");

  const [serie, setSerie] = useState([]);

  const inputFile = useRef(null);

  const resetBanner = () => {
    if (isCreatorMode) {
      CreatorSettingAPI.resetCover({
        userInfo: JSON.parse(window.localStorage.userInfo),
      }).then((response) => {
        const { cover: defaultBanner } = response.data || response;

        setCover(defaultBanner);
      });
    }
  };

  const scrollTo = (sectionName) => {
    if (window) {
      const element = document.getElementById(`${sectionName}-section`);

      if (element) {
        const headerOffset = 60;

        window.scroll({
          top: element.offsetTop - headerOffset,
          behavior: "smooth",
        });
      }
    }
  };

  const validateImage = (size, src, componentType, name): any =>
    new Promise((resolve) => {
      const lastDot = name.lastIndexOf(".");

      const ext = name.substring(lastDot + 1);

      if (ext !== "png" && ext !== "jpg" && ext !== "jpeg" && ext !== "svg") {
        resolve({ isValid: false, reason: "INVALID_EXTENSION" });
      }

      if (size <= 10 * 1000000) {
        const img = document.createElement("img");

        img.src = src;

        img.onload = () => {
          const width = img.naturalWidth || img.width;

          if (componentType === "cover") {
            if (width < 720) {
              resolve({ isValid: false, reason: "INVALID_WIDTH" });
            }
          }
          resolve({ isValid: true });
        };
      } else {
        resolve({ isValid: false, reason: "INVALID_SIZE" });
      }
    });

  const handleFileChange = async (e) => {
    try {
      setLoading(true);

      const file = e.target.files[0];

      const imgSrc = URL.createObjectURL(e.target.files[0]);

      const check = await validateImage(file.size, imgSrc, "cover", file.name);

      if (!check || !check.isValid) {
        throw new Error(check.reason);
      }

      const formData = new FormData();

      formData.append("file", file);

      SeriesAPI.uploadFile({
        formdata: formData,
        userInfo: GetUserInfo(),
      }).then((data) => {
        setTimeout(() => {
          setLoading(false);
        }, 1500);
        const { location } = data;

        CreatorSettingAPI.setCover({
          userInfo: JSON.parse(window.localStorage.userInfo),
          cover: location,
        }).then(() => setCover(location));
      });
    } catch (error) {
      switch (error.message) {
        case "INVALID_EXTENSION":
          notifyError(t("common:replaceBanner.extAlert"));

          break;

        case "INVALID_WIDTH":
          notifyError(t("common:replaceBanner.widthAlert"));

          break;

        case "INVALID_SIZE":
          notifyError(t("common:replaceBanner.sizeAlert"));

          break;

        default:
          notifyError(t("common:replaceBanner.unknown"));

          break;
      }

      setLoading(false);
    }
  };

  const CreatorButton = (props) => {
    return (
      <div
        className={`edit ${props.className} disable-select`}
        onClick={props.onClickFunction}
      >
        {props.imgSrc && (
          <div className="edit-icon">
            <Image src={props.imgSrc} width={24} height={24} />
          </div>
        )}
        <div>{props.buttonName}</div>
      </div>
    );
  };

  const UploadButton = (props) => {
    return (
      <div
        onClick={() => inputFile.current.click()}
        className={`edit ${props.className} disable-select`}
      >
        {props.imgSrc && (
          <div className="edit-icon">
            <Image src={props.imgSrc} width={24} height={24} />
          </div>
        )}
        <div>{props.buttonName}</div>
      </div>
    );
  };
  useEffect(() => {
    if (window?.localStorage.isContinueCheckout) {
      if (window.localStorage.isContinueCheckout === "true") {
        router.push("/user/cart");
      }

      window.localStorage.setItem("isContinueCheckout", "false");
    }

    if (window?.localStorage.userInfo) {
      const userInfo = JSON.parse(window.localStorage.userInfo);

      if (userInfo.role.role === "creator") setCreatorMode(true);
    }

    CreatorSettingAPI.getCover({ userInfo: "" }).then((response) => {
      const coverImage = response;

      if (coverImage) setCover(coverImage);
    });

    CustomerSerieAPI.getAll({ userInfo: GetUserInfo() }).then((response) => {
      const series = response;
      const userInfo = GetUserInfo();
      const currentRole = userInfo?.role?.role ?? "customer";

      const newSerie =
        series?.map((s) => ({
          srcImg: s.thumbnail,
          isNewReleashed: s.isNewRelease,
          hash: s._id,
          serieName: s.name,
          episodeQuantity: s.episodeQuantity,
          usage: currentRole,
          category: s.category,
        })) ?? [];

      setSerie(newSerie);
      const section = localStorage.getItem("routeSection");
      scrollTo(section);
      localStorage.removeItem("routeSection");
    });
  }, []);
  const CategoryHomePage = ({ category, className = "" }) => {
    const serieCategoryConponent = serie
      ? serie.filter((item) => item.category === category).length > 0 &&
        serie
          .filter((item) => item.category === category)
          .map((productInfo, index) => (
            <Link
              key={index}
              href={`/${isCreatorMode ? "em" : "serie"}/${productInfo.hash}`}
            >
              <a>
                <HomepageProduct key={index} productInfo={productInfo} />
              </a>
            </Link>
          ))
      : null;
    return serieCategoryConponent ? (
      <div className={className}>
        <h2 className="category-section-header mrb-30px">{category}</h2>
        <div className="product-list">{serieCategoryConponent}</div>
      </div>
    ) : (
      <></>
    );
  };

  return (
    <React.Fragment>
      <div
        style={{
          minHeight: "100vh",
        }}
      >
        <Header
          triggerCreatorLogout={(value) => value && setCreatorMode(false)}
        />

        <div className="homepage-content" id="top-section">
          <section className="image-place" id="home-section">
            <section className="image-content">
              <Image
                src={cover ? cover : "/icons/homepage.svg"}
                width={1440}
                height={482}
              />

              {isCreatorMode && (
                <>
                  <CreatorButton
                    imgSrc="/icons/camera.png"
                    buttonName={t(`common:editBanner`)}
                    className="edit-banner"
                    onClickFunction={() =>
                      setEditBannerClick(!editBannerClicked)
                    }
                  />

                  {editBannerClicked && (
                    <>
                      <div className="background-banner"></div>

                      <div className="guide-container">
                        <div className="big-guide">{t("common:replaceBanner.header")}</div>

                        <div className="small-guide">
                          {t("common:replaceBanner.guideContent")}
                        </div>
                      </div>

                      <div className="edit-btn-container">
                        {!isLoading && (
                          <UploadButton
                            imgSrc="/icons/camera.png"
                            buttonName={t(`common:upload`)}
                            className="edit-upload"
                          />
                        )}

                        <MoonLoader
                          color={"#ffffff"}
                          loading={isLoading}
                          size={60}
                        />

                        <input
                          type="file"
                          onChange={(e) => handleFileChange(e)}
                          ref={inputFile}
                          style={{ display: "none" }}
                        />

                        {!isLoading && (
                          <CreatorButton
                            imgSrc="/icons/remove.png"
                            buttonName={t(`common:remove`)}
                            className="edit-remove"
                            onClickFunction={() => resetBanner()}
                          />
                        )}
                      </div>

                      <CreatorButton
                        buttonName={t(`common:save`)}
                        className="edit-banner"
                        onClickFunction={() =>
                          setEditBannerClick(!editBannerClicked)
                        }
                      />
                    </>
                  )}
                </>
              )}
            </section>
          </section>

          <section className="product" id="product-section">
            {isCreatorMode && (
              <Link href="/sm">
                <a>
                  <CreatorButton
                    imgSrc="/icons/edit.png"
                    buttonName={t(`common:editProduct`)}
                    className="edit-product"
                  />
                </a>
              </Link>
            )}

            <div className="section-header section-header-product">
              <span className="text-uppercase">
                {t(`common:section.product`)}
              </span>
            </div>

            <CategoryHomePage className="mrb-60px" category="Comic" />
            <CategoryHomePage className="mrb-60px" category="Video" />
            <CategoryHomePage className="mrb-60px" category="Music" />
            <CategoryHomePage className="mrb-60px" category="Illustration" />
          </section>

          <section className="profile" id="profile-section">
            <div className="section-header">
              <span className="text-uppercase white-text section-header-text">
                {t(`common:section.profile`)}
              </span>
            </div>

            <Profile />
          </section>
        </div>

        <section className="sub-section" id="support-section">
          <div
            className="sub-section-item text-uppercase"
            onClick={() => {
              setPdfSrc("support_pdf/1.pdf");
              setShowSupportView(true);
            }}
          >
            <a>{t(`common:section.support.aboutThisService`)}</a>
          </div>

          <div
            className="sub-section-item text-uppercase"
            onClick={() => {
              setPdfSrc("support_pdf/2.pdf");
              setShowSupportView(true);
            }}
          >
            <a>{t(`common:section.support.termOfUse`)}</a>
          </div>

          <div
            className="sub-section-item text-uppercase"
            onClick={() => {
              setPdfSrc("support_pdf/3.pdf");
              setShowSupportView(true);
            }}
          >
            <a>{t(`common:section.support.policy`)}</a>
          </div>

          <div
            className="sub-section-item text-uppercase"
            onClick={() => {
              setPdfSrc("support_pdf/4.pdf");
              setShowSupportView(true);
            }}
          >
            <a>{t(`common:section.support.title`)}</a>
          </div>
        </section>

        <Footer />
      </div>

      {showSupportView && (
        <ViewSupport
          updateVisible={({ show }) => {
            setShowSupportView(show);
          }}
          fileSrc={pdfSrc}
        />
      )}
    </React.Fragment>
  );
};

export const getStaticProps = async ({ locale }) => ({
  props: {
    ...(await serverSideTranslations(locale, ["common", "home"])),
    homepageContent: HOMEPAGE_CONTENT,
  },
});

export default Home;
