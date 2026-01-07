// components/PreviewPanel.tsx
export function PreviewPanel() {
  return (
    <div className="previewStack">
      <div className="coverCard coverCardTight">
        <div className="coverImg coverImgFull">
          <div className="coverText">MOVIE{"\n"}AWARDS</div>
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

        <div className="rsvpBody">
          <button className="rsvpOption" type="button" aria-label="Going">
            <div className="rsvpCircle">
              <span className="rsvpEmoji">👍</span>
            </div>
            <div className="rsvpLabel">Going</div>
          </button>

          <button className="rsvpOption" type="button" aria-label="Maybe">
            <div className="rsvpCircle">
              <span className="rsvpEmoji">🤔</span>
            </div>
            <div className="rsvpLabel">Maybe</div>
          </button>

          <button className="rsvpOption" type="button" aria-label="Can't Go">
            <div className="rsvpCircle">
              <span className="rsvpEmoji">😢</span>
            </div>
            <div className="rsvpLabel">Can't Go</div>
          </button>
        </div>
      </div>
    </div>
  );
}
