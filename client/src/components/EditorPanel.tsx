import { useMemo, useState } from "react";
import { Icon } from "./Icon";

const STYLE_CHIPS = ["Classic", "Eclectic", "Fancy", "Literary", "Digital", "Elegant"];

export function EditorPanel() {
  const [activeStyle, setActiveStyle] = useState<string>("Literary");
  const [canInvite, setCanInvite] = useState<boolean>(true);

  const miniChips = useMemo(
    () => ["+ Link", "+ Playlist", "+ Registry", "+ Dress code", "Show more"],
    []
  );

  return (
    <div className="editorStack">
      {/* 1) Event title + tags (ONE standalone container) */}
      <div className="glassBlock glassHeader">
        <h1 className="eventTitle">Untitled Event</h1>

        <div className="chips">
          {STYLE_CHIPS.map((s) => {
            const cls = s === activeStyle ? "chip chipActive" : "chip";
            return (
              <button key={s} className={cls} type="button" onClick={() => setActiveStyle(s)}>
                <span className={`chipText chipText-${s.toLowerCase()}`}>{s}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 2) Set a date (ITS OWN container, not attached to title) */}
      <button className="glassBlock glassRow glassDate" type="button">
        <span className="rowIcon">
          <Icon name="calendar" />
        </span>
        <span className="rowText">Set a date...</span>
      </button>

      {/* 3) Helper line (NO container) */}
      <div className="helperLinePlain">
        <span className="helperDim">Can't decide when?</span>
        <a className="pollLink" href="#">
          Poll your guests →
        </a>
      </div>

      {/* 4) Rows (EACH its own container, not merged) */}
      <div className="glassBlock glassRow hostRow">
        <div className="hostLeft">
          <span className="rowIcon">
            <Icon name="crown" />
          </span>

          <div className="hostMeta">
            <div className="hostLabel">Hosted by (optional) host nickname</div>

            <div className="hostPerson">
              <div className="avatar">
                <span>F</span>
              </div>
              <div className="hostName">Fabio</div>
            </div>
          </div>
        </div>

        <button className="cohostBtn" type="button">
          + Add cohosts
        </button>
      </div>

      <button className="glassBlock glassRow" type="button">
        <span className="rowIcon">
          <Icon name="pin" />
        </span>
        <span className="rowText">Location</span>
      </button>

      <button className="glassBlock glassRow" type="button">
        <span className="rowIcon">
          <Icon name="users" />
        </span>
        <span className="rowText">Unlimited spots</span>
      </button>

      <button className="glassBlock glassRow" type="button">
        <span className="rowIcon">
          <Icon name="bolt" />
        </span>
        <span className="rowText">Cost per person</span>
      </button>

      <div className="glassBlock glassRow toggleRow">
        <div className="toggleLeft">
          <span className="rowIcon">
            <Icon name="spark" />
          </span>
          <span className="rowText">Guests can invite friends</span>
        </div>

        <button
          className={canInvite ? "switch switchOn" : "switch"}
          type="button"
          aria-pressed={canInvite}
          aria-label="toggle"
          onClick={() => setCanInvite((v) => !v)}
        >
          <span className="switchKnob" />
        </button>
      </div>

      {/* 5) Action pills (keep as-is) */}
      <div className="miniChips">
        {miniChips.map((t) => (
          <button key={t} className="miniChip" type="button">
            {t}
          </button>
        ))}
      </div>

      {/* 6) Description (standalone container) */}
      <div className="glassBlock glassDescription">
        <textarea className="desc" placeholder="Add a description of your event" />
      </div>
    </div>
  );
}
