import React, { useEffect, useState } from "react";
import jwt from "jsonwebtoken";
import { useNavigate } from "react-router-dom";
import FeedList from "./FeedList/FeedList";
import Feed from "./Feed/Feed";
import "./Dashboard.css";

function isURL(str) {
  const pattern = new RegExp(
    "^(https?:\\/\\/)?" + // protocol
      "((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|" + // domain name
      "((\\d{1,3}\\.){3}\\d{1,3}))" + // OR ip (v4) address
      "(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*" + // port and path
      "(\\?[;&a-z\\d%_.~+=-]*)?" + // query string
      "(\\#[-a-z\\d_]*)?$",
    "i"
  ); // fragment locator
  return !!pattern.test(str);
}

const API_ROOT =
  process.env.NODE_ENV === "development"
    ? "http://localhost:5000"
    : "https://newoldreader-server.azurewebsites.net";

const Dashboard = () => {
  const navigate = useNavigate();
  const [feed, setFeed] = useState([]);
  const [name, setName] = useState("");
  const [url, setUrl] = useState("");
  const [selectedUrl, setSelectedUrl] = useState("");
  const [orderBy, setOrderBy] = useState("published");
  const [sortOrder, setSortOrder] = useState("desc");

  async function populateFeed() {
    setSelectedUrl("");
    const req = await fetch(`${API_ROOT}/api/feed`, {
      headers: {
        "x-access-token": localStorage.getItem("token"),
      },
    });

    const data = await req.json();

    if (data.status === "ok") {
      setFeed(data.feed);
    } else {
      alert(data.error);
    }
  }

  async function deleteFeedItem() {
    const req = await fetch(`${API_ROOT}/api/deleteitem`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-access-token": localStorage.getItem("token"),
      },
      body: JSON.stringify({
        selectedUrl,
      }),
    });

    const data = await req.json();
    if (data.status === "ok") {
      setFeed(data.feed);
      setSelectedUrl("");
    } else {
      alert(data.error);
    }
  }

  function logOut() {
    localStorage.removeItem("token");
    navigate("/login", { replace: true });
  }

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      const user = jwt.decode(token);
      if (!user) {
        localStorage.removeItem("token");
        navigate("/login", { replace: true });
      } else {
        populateFeed();
      }
    } else {
      navigate("/login", { replace: true });
    }
  }, [navigate]);

  async function updateFeed(event) {
    event.preventDefault();

    const isFeedSubscribed = feed.some((obj) => obj.url === url);

    if (!name) {
      return alert("Please include a name for your feed");
    }

    if (!isURL(url)) {
      return alert("That is not a valid URL");
    }

    if (isFeedSubscribed) {
      return alert("You're already subscribed to that feed");
    }

    const req = await fetch(`${API_ROOT}/api/item`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-access-token": localStorage.getItem("token"),
      },
      body: JSON.stringify({
        feed: [...feed, { name, url }],
      }),
    });

    const data = await req.json();
    if (data.status === "ok") {
      setFeed([...feed, { name, url }]);
      setName("");
      setUrl("");
    } else {
      alert(data.error);
    }
  }

  return (
    <div>
      <h1>The New Old Reader</h1>
      <a onClick={logOut} className="logout-button">
        Log Out &rarr;
      </a>
      <form onSubmit={updateFeed} className="feed-form">
        <input
          type="text"
          name="name"
          placeholder="Feed Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          type="text"
          name="url"
          placeholder="Feed URL"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
        />
        <input type="submit" value="Add RSS Feed" />
      </form>
      <div className="cols">
        <div className="cols__col">
          <FeedList
            feedList={feed}
            selectedUrl={selectedUrl}
            setSelectedUrl={setSelectedUrl}
          />
        </div>
        <div className="cols__col">
          {selectedUrl ? (
            <div className="feed-controls">
              <form className="sort-form">
                <label htmlFor="orderby">Order By</label>
                <select
                  onChange={(e) => setOrderBy(e.target.value)}
                  name="orderby"
                  id="orderby"
                >
                  <option value="published">Date</option>
                  <option value="title">Title</option>
                  <option value="description">Description</option>
                </select>
                <label htmlFor="sortorder">Sort Order</label>
                <select
                  onChange={(e) => setSortOrder(e.target.value)}
                  name="sortorder"
                  id="sortorder"
                >
                  <option value="desc">Desc</option>
                  <option value="asc">Asc</option>
                </select>
              </form>
              <button onClick={deleteFeedItem} className="delete-button">
                Delete Feed
              </button>
            </div>
          ) : null}

          <Feed
            selectedUrl={selectedUrl}
            orderBy={orderBy}
            sortOrder={sortOrder}
          />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
