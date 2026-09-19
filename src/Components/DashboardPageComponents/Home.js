import React, { useEffect, useState } from "react";
import { getCurrentUser, fetchProfile } from "../../Services/user_service";

/**
 * Greeting header for the Categories page. Was a static "Welcome / Browse
 * through your favourites....." block; now reflects the signed-in user's
 * real name (via GET /user/profile) and the time of day.
 */
const greeting = () => {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  return "Good evening";
};

const Home = () => {
  const [user, setUser] = useState(getCurrentUser());

  useEffect(() => {
    let mounted = true;
    fetchProfile().then((profile) => { if (mounted && profile) setUser(profile); });
    return () => { mounted = false; };
  }, []);

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
