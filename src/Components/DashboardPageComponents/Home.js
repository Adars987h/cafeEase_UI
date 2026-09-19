import React from "react";
import { getCurrentUser } from "../../Services/user_service";

/**
 * Greeting header for the Categories page. Was a static "Welcome / Browse
 * through your favourites....." block; now reflects the signed-in user (from
 * the token, since there is no "get my profile" endpoint to fetch a display
 * name from) and the time of day.
 */
const greeting = () => {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  return "Good evening";
};

const Home = () => {
  const user = getCurrentUser();

  return (
    <div className="dashboard-greeting">
      <p className="primary-subheading">
        {greeting()}{user ? `, ${user.label}` : ""}
      </p>
      <h1>What are we having?</h1>
    </div>
  );
};

export default Home;
