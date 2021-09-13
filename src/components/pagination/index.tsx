import { Pagination } from "antd";
import style from "./pagination.module.scss";

export const PageNavigation = ({
  totalItem,
  itemsPerPage,
  className = "",
  page = 1,
  setPage,
}) => {
  return (
    <Pagination
      showSizeChanger={false}
      className={`${style[className]} ${style["pagination"]}`}
      style={{ textAlign: "center" }}
      defaultCurrent={page}
      current={page}
      total={totalItem}
      pageSize={itemsPerPage}
      itemRender={(current, type, originalElement) => {
        if (type === "prev") {
          const canPrev = page > 1;
          return (
            <span
              className={`${style["page-item"]} ${
                !canPrev && style["btn-pagination-disable"]
              }`}
              onClick={() => setPage(canPrev ? page - 1 : page)}
            >
              <img
                style={{ verticalAlign: "initial" }}
                src="/assets/icons/prev-icon.svg"
                alt="prev"
              />
            </span>
          );
        }
        if (type === "next") {
          const canNext = page < totalItem / itemsPerPage;
          return (
            <span
              className={`${style["page-item"]} ${
                !canNext && style["btn-pagination-disable"]
              }`}
              onClick={() => setPage(canNext ? page + 1 : page)}
            >
              <img
                style={{ verticalAlign: "initial" }}
                src="/assets/icons/next-icon.svg"
                alt="next"
              />
            </span>
          );
        }
        return (
          <span
            className={style["page-item"]}
            onClick={() => {
              setPage(current);
            }}
          >
            {current}
          </span>
        );
      }}
    />
  );
};
