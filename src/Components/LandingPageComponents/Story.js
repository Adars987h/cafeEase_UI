import React from "react";
import { FiFeather, FiClock, FiUsers } from "react-icons/fi";
import ShakesImage from "../../Assets/shakes.jpg";
import useInViewAnimation from "../../hooks/useInViewAnimation";

/**
 * The one section of the 2.0 spec with no real backend data behind it --
 * so unlike the hero/category stats, this stays qualitative on purpose.
 * No invented founding year, customer count or rating: just what the
 * counter actually does, in plain language.
 */
const VALUES = [
  { icon: <FiFeather />, title: "Made to order", body: "Nothing sits under a heat lamp. Your order starts once you place it." },
  { icon: <FiClock />, title: "Skip the queue", body: "Order ahead in the app, walk in, pick it up. No standing in line for chai." },
  { icon: <FiUsers />, title: "Run by people, not a script", body: "A real person at the counter reads every order and every message." },
];

const Story = () => {
  const revealRef = useInViewAnimation();

  return (
    <div className="story-section-wrapper" id="Story" ref={revealRef}>
      <div className="story-copy">
        <p className="primary-subheading">Our story</p>
        <h2>
          A neighbourhood counter, <span className="accent-word">done right</span>.
        </h2>
        <p className="primary-text">
          CafeEase runs one counter, one kitchen, and a menu we actually stand behind.
          No franchise playbook, no central commissary &mdash; just food made when you
          order it, and an app that gets it to you faster than standing in line.
        </p>
        <div className="story-values">
          {VALUES.map((v) => (
            <div className="story-value" key={v.title}>
              <span className="story-value-icon">{v.icon}</span>
              <div>
                <h4>{v.title}</h4>
                <p>{v.body}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="story-image">
        <img src={ShakesImage} alt="Shakes made at the counter" />
      </div>
    </div>
  );
};

export default Story;
