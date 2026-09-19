import React, { useEffect, useState } from 'react';

/**
 * The backend is hosted on a free tier that sleeps after 15 minutes idle and
 * takes roughly 150 seconds to start. Without this, the first visitor after an
 * idle period sees nothing happening and assumes the site is broken.
 *
 * Listens for the events dispatched by the axios interceptors in Services/helper.js
 * and explains the wait once a request has been outstanding long enough to be
 * more than ordinary latency.
 */
const ColdStartNotice = () => {
  const [visible, setVisible] = useState(false);
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    const show = () => { setVisible(true); setSeconds(0); };
    const hide = () => setVisible(false);
    window.addEventListener('api:slow', show);
    window.addEventListener('api:settled', hide);
    return () => {
      window.removeEventListener('api:slow', show);
      window.removeEventListener('api:settled', hide);
    };
  }, []);

  useEffect(() => {
    if (!visible) return undefined;
    const id = setInterval(() => setSeconds((s) => s + 1), 1000);
    return () => clearInterval(id);
  }, [visible]);

  if (!visible) return null;

  return (
    <div role="status" aria-live="polite" className="cold-start-notice">
      <span className="cold-start-notice__dot" aria-hidden="true" />
      <div>
        <p className="cold-start-notice__title">Starting the server</p>
        <p className="cold-start-notice__body">
          The demo backend sleeps when idle and takes up to two minutes to wake.
          {seconds > 5 && ` Waiting ${seconds}s.`}
        </p>
      </div>
    </div>
  );
};

export default ColdStartNotice;
