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

      <div className="topNav">Home</div>
    </header>
  );
}
