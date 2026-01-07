export function Topbar() {
  return (
    <header className="topbar">
      <div className="brand">
        <div className="brandMark">partiful</div>
      </div>

      <div className="topRight">
        <button className="topPill" type="button">
          <span className="pillNew">New!</span>
          <span>Make it public</span>
          <span className="pillArrow">›</span>
        </button>
      </div>

      <div className="topNav">
        <button className="navPill" type="button">
          Home
        </button>
        <button className="navIcon" type="button" aria-label="Help">
          ?
        </button>
        <button className="navIcon" type="button" aria-label="Messages">
          💬
        </button>
        <button className="navIcon" type="button" aria-label="Notifications">
          🔔
        </button>
        <button className="navAvatar" type="button" aria-label="Account">
          <span className="navAvatarDot" />
        </button>
      </div>
    </header>
  );
}
