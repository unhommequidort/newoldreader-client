import React, { useState, useEffect } from "react";
import rssImg from "./rss.png";
import dayjs from "dayjs";
import "./Feed.css";

// Replace empty string with Azure url
const API_ROOT =
  process.env.NODE_ENV === "development"
    ? "http://localhost:5000"
    : "https://newoldreader-server.azurewebsites.net";

const Feed = ({ selectedUrl, orderBy, sortOrder }) => {
  const [articles, setArticles] = useState({});

  useEffect(() => {
    if (selectedUrl) {
      setArticles({});
      const fetchArticles = async () => {
        const response = await fetch(`${API_ROOT}/api/rssfeed`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-access-token": localStorage.getItem("token"),
          },
          body: JSON.stringify({
            selectedUrl,
          }),
        });

        const data = await response.json();

        if (data.status === "ok") {
          setArticles(data.feed);
        } else {
          setArticles([]);
          alert("There was a problem fetching that RSS feed");
        }
      };
      fetchArticles();
    } else {
      setArticles({});
    }
  }, [selectedUrl]);

  // Order and Sort
  let sortedItems = [];
  if (articles.hasOwnProperty("items")) {
    // If order by date (an integer)
    if (orderBy === "published") {
      sortedItems = articles.items.sort((a, b) =>
        sortOrder === "asc" ? a[orderBy] - b[orderBy] : b[orderBy] - a[orderBy]
      );
    } else {
      // If order by title or description (strings)
      if (sortOrder === "asc") {
        sortedItems = articles.items.sort((a, b) => {
          if (a[orderBy] < b[orderBy]) {
            return -1;
          }
          if (a[orderBy] > b[orderBy]) {
            return 1;
          }
          return 0;
        });
      } else {
        sortedItems = articles.items.sort((a, b) => {
          if (a[orderBy] > b[orderBy]) {
            return -1;
          }
          if (a[orderBy] < b[orderBy]) {
            return 1;
          }
          return 0;
        });
      }
    }
  }

  return articles.hasOwnProperty("items") ? (
    <>
      <ul className="feed">
        {sortedItems.map((article, i) => {
          const articleDate = dayjs(new Date(article.published)).format(
            "MM/DD/YYYY hh:mm"
          );

          return (
            <li key={i}>
              <div className="feed__date">{articleDate}</div>
              {article.media.hasOwnProperty("thumbnail") &&
              article.media.thumbnail.hasOwnProperty("url") ? (
                <img
                  alt={
                    article.media.hasOwnProperty("title")
                      ? article.media.title
                      : "image"
                  }
                  width={100}
                  src={
                    article.media.hasOwnProperty("thumbnail") &&
                    article.media.thumbnail.hasOwnProperty("url")
                      ? article.media.thumbnail.url
                      : rssImg
                  }
                  className="feed__thumbnail"
                />
              ) : null}

              <h4 className="feed__title">
                <a
                  target="_blank"
                  rel="noopener noreferrer"
                  href={article.link}
                >
                  {article.title}
                </a>
              </h4>
              <p>{article.description}</p>
            </li>
          );
        })}
      </ul>
    </>
  ) : null;
};

export default Feed;
