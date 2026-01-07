export function PreviewPanel() {
  return (
    <div className="previewStack">
      <div className="coverCard">
        <div className="coverImg">
          <div className="coverText">MOVIE AWARDS</div>
        </div>

        <button className="editPill" type="button">
          ✎ Edit
        </button>
      </div>

      <div className="rsvpCard">
        <div className="rsvpHeader">
          <div className="rsvpTitle">
            <span className="rsvpGear">⚙</span>
            RSVP Options
          </div>

          <button className="emojiPill" type="button">
            👍 Emojis <span className="pillArrow">▾</span>
          </button>
        </div>

        <div className="rsvpButtons">
          <button className="rsvpBtn" type="button">
            <div className="rsvpEmoji">👍</div>
            <div className="rsvpLabel">Going</div>
          </button>

          <button className="rsvpBtn" type="button">
            <div className="rsvpEmoji">😬</div>
            <div className="rsvpLabel">Maybe</div>
          </button>

          <button className="rsvpBtn" type="button">
            <div className="rsvpEmoji">😢</div>
            <div className="rsvpLabel">Can't Go</div>
          </button>
        </div>
      </div>
    </div>
  );
}
