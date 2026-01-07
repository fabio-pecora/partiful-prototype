import { useMemo, useState } from "react";
import { Icon } from "./Icon";

const STYLE_CHIPS = ["Classic", "Eclectic", "Fancy", "Literary", "Digital", "Elegant"];

function RowButton({
  icon,
  label,
  dim = false,
}: {
  icon: Parameters<typeof Icon>[0]["name"];
  label: string;
  dim?: boolean;
}) {
  return (
    <button className={dim ? "rowItem rowItemDim" : "rowItem"} type="button">
      <span className="rowIcon">
        <Icon name={icon} />
      </span>
      <span className="rowText">{label}</span>
    </button>
  );
}

// components/EditorPanel.tsx
export function EditorPanel() {
  const [activeStyle, setActiveStyle] = useState<string>("Literary");
  const [canInvite, setCanInvite] = useState<boolean>(true);

  const miniChips = useMemo(
    () => ["+ Link", "+ Playlist", "+ Registry", "+ Dress code", "Show more"],
    []
  );

  const RowSegment = ({
    children,
    pos,
  }: {
    children: React.ReactNode;
    pos?: "first" | "mid" | "last";
  }) => {
    const cls =
      pos === "first"
        ? "rowSegment rowSegmentFirst"
        : pos === "last"
        ? "rowSegment rowSegmentLast"
        : "rowSegment";
    return <div className={cls}>{children}</div>;
  };

  return (
    <div className="editorStack">
      {/* Title + style chips (one glass block) */}
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

      {/* Set a date (separate glass block) */}
      <button className="glassBlock dateBlock" type="button">
        <div className="dateText">Set a date...</div>
      </button>

      {/* Helper line (no container) */}
      <div className="helperLinePlain">
        <span className="helperDim">Can't decide when?</span>
        <a className="pollLink" href="#">
          Poll your guests →
        </a>
      </div>

      {/* Host + detail rows (each row has its own glassy blurred segment) */}
      <div className="rowGroup">
        <RowSegment pos="first">
          <div className="rowHost">
            <div className="rowHostLeft">
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
        </RowSegment>

        <RowSegment>
          <RowButton icon="pin" label="Location" dim />
        </RowSegment>

        <RowSegment>
          <RowButton icon="users" label="Unlimited spots" dim />
        </RowSegment>

        <RowSegment>
          <RowButton icon="bolt" label="Cost per person" dim />
        </RowSegment>

        <RowSegment pos="last">
          <div className="rowItem rowToggle">
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
        </RowSegment>
      </div>

      {/* Action pills */}
      <div className="miniChips">
        {miniChips.map((t) => (
          <button key={t} className="miniChip" type="button">
            {t}
          </button>
        ))}
      </div>

      {/* Description (glass block) */}
      <div className="glassBlock glassDescription">
        <textarea className="desc" placeholder="Add a description of your event" />
      </div>

      <div className="moreToSay">
        <span className="moreToSayText">More to say?</span>
        <button className="newSectionBtn" type="button">
          + New section
        </button>
      </div>
    </div>
  );
}
