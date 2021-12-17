import { React } from "react";
import "./FeedList.css";

const FeedList = ({ feedList, selectedUrl, setSelectedUrl }) => {
  return (
    <div>
      {Array.isArray(feedList) && feedList.length > 0 ? (
        <ul className="feedlist">
          {feedList.map((obj) => (
            <li
              className={
                obj.url === selectedUrl
                  ? "active feedlist__item"
                  : "feedlist__item"
              }
              onClick={() => setSelectedUrl(obj.url)}
              key={obj.url}
            >
              {obj.name}
            </li>
          ))}
        </ul>
      ) : (
        <p>Add a feed above</p>
      )}
    </div>
  );
};

export default FeedList;
