// client/src/components/EditorPanel.tsx
import { useEffect, useMemo, useRef, useState } from "react";
import { Icon } from "./Icon";
import { Modal } from "./Modal";
import { SideDrawer } from "./SideDrawer";
import { FloatingPanel } from "./FloatingPanel";


const STYLE_CHIPS = ["Classic", "Eclectic", "Fancy", "Literary", "Digital", "Elegant"];

type MiniAction = "+ Link" | "+ Playlist" | "+ Registry" | "+ Dress code" | "Show more" | null;

function RowButton({
  icon,
  label,
  dim = false,
  onClick,
}: {
  icon: Parameters<typeof Icon>[0]["name"];
  label: string;
  dim?: boolean;
  onClick?: () => void;
}) {
  return (
    <button
      className={dim ? "rowItem rowItemDim" : "rowItem"}
      type="button"
      onClick={onClick}
      aria-haspopup={onClick ? "dialog" : undefined}
    >
      <span className="rowIcon">
        <Icon name={icon} />
      </span>
      <span className="rowText">{label}</span>
    </button>
  );
}

function DatePickerMock() {
  const days = Array.from({ length: 35 }, (_, i) => i + 1);
  return (
    <div className="datePicker">
      <div className="datePickerTop">
        <button className="dateTab dateTabActive" type="button">
          Start Date
        </button>
        <div className="dateTabArrow">›</div>
        <button className="dateTab" type="button">
          Optional
          <br />
          End Date
        </button>
      </div>

      <div className="datePickerMonthRow">
        <button className="dateNav" type="button">
          ‹
        </button>
        <div className="dateMonth">January 2026</div>
        <button className="dateNav" type="button">
          ›
        </button>
      </div>

      <div className="dateDow">
        <span>Sun</span>
        <span>Mon</span>
        <span>Tue</span>
        <span>Wed</span>
        <span>Thu</span>
        <span>Fri</span>
        <span>Sat</span>
      </div>

      <div className="dateGrid">
        {days.map((n) => (
          <button key={n} className={n === 8 ? "dateCell dateCellActive" : "dateCell"} type="button">
            {n <= 31 ? n : ""}
          </button>
        ))}
      </div>

      <div className="dateFooter">
        <div className="tzLeft">ET GMT-5</div>
        <div className="tzRight">
          <span className="tzDim">Not sure yet?</span>
          <button className="tzLink" type="button">
            Set as TBD
          </button>
        </div>
      </div>
    </div>
  );
}

// components/EditorPanel.tsx
export function EditorPanel() {
  const [activeStyle, setActiveStyle] = useState<string>("Literary");
  const [canInvite, setCanInvite] = useState<boolean>(true);

  // interactions
  const [dateOpen, setDateOpen] = useState(false);
  const [locationOpen, setLocationOpen] = useState(false);
  const [chipInOpen, setChipInOpen] = useState(false);

  const [spotsValue, setSpotsValue] = useState<string>("");
  const [spotsEditing, setSpotsEditing] = useState(false);

  const [miniOpen, setMiniOpen] = useState<MiniAction>(null);
  const [miniIcon, setMiniIcon] = useState<"link" | "music" | "gift" | "shirt">("link");

  const dateBtnRef = useRef<HTMLButtonElement | null>(null);
  const spotsInputRef = useRef<HTMLInputElement | null>(null);

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

  useEffect(() => {
    if (spotsEditing) {
      requestAnimationFrame(() => spotsInputRef.current?.focus());
    }
  }, [spotsEditing]);

  function openMini(action: MiniAction) {
    if (!action || action === "Show more") return;
    setMiniOpen((prev) => (prev === action ? null : action));

    if (action === "+ Link") setMiniIcon("link");
    if (action === "+ Playlist") setMiniIcon("music");
    if (action === "+ Registry") setMiniIcon("gift");
    if (action === "+ Dress code") setMiniIcon("shirt");
  }

  const spotsLabel =
    spotsValue.trim().length > 0 ? `${spotsValue.trim()} spots` : "Unlimited spots";

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
      <button
        ref={dateBtnRef}
        className="glassBlock dateBlock"
        type="button"
        onClick={() => setDateOpen((v) => !v)}
        aria-expanded={dateOpen}
        aria-haspopup="dialog"
      >
        <div className="dateText">Set a date...</div>
      </button>

      <FloatingPanel
        open={dateOpen}
        anchorRef={dateBtnRef}
        onClose={() => setDateOpen(false)}
        width={380}
      >
        <DatePickerMock />
      </FloatingPanel>

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
          <RowButton icon="pin" label="Location" dim onClick={() => setLocationOpen(true)} />
        </RowSegment>

        <RowSegment>
          {spotsEditing ? (
            <div className="rowItem rowInlineEdit">
              <span className="rowIcon">
                <Icon name="users" />
              </span>

              <input
                ref={spotsInputRef}
                className="rowInlineInput"
                type="number"
                inputMode="numeric"
                min={1}
                placeholder="Unlimited spots"
                value={spotsValue}
                onChange={(e) => setSpotsValue(e.target.value)}
                onBlur={() => setSpotsEditing(false)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === "Escape") setSpotsEditing(false);
                }}
              />

              <button className="rowInlineDone" type="button" onClick={() => setSpotsEditing(false)}>
                Done
              </button>
            </div>
          ) : (
            <RowButton icon="users" label={spotsLabel} dim onClick={() => setSpotsEditing(true)} />
          )}
        </RowSegment>

        <RowSegment>
          <RowButton icon="bolt" label="Cost per person" dim onClick={() => setChipInOpen(true)} />
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
          <button
            key={t}
            className="miniChip"
            type="button"
            onClick={() => openMini(t as MiniAction)}
            aria-expanded={miniOpen === t}
          >
            {t}
          </button>
        ))}
      </div>

      {miniOpen && miniOpen !== "Show more" ? (
        <div className="miniPopoverWrap">
          <div className="miniPopoverTop">
            <div className="miniPopoverLabel">(Optional) Custom Field</div>
            <button className="miniPopoverClose" type="button" onClick={() => setMiniOpen(null)}>
              ×
            </button>
          </div>

          <div className="miniPopoverTitleRow">
            <div className="miniPopoverTitleLeft">
              <span className="miniPopoverTitleIcon">🔗</span>
              <span className="miniPopoverTitleText">
                {miniOpen === "+ Link"
                  ? "Link text"
                  : miniOpen === "+ Playlist"
                  ? "Playlist"
                  : miniOpen === "+ Registry"
                  ? "Registry"
                  : "Dress code"}
              </span>
            </div>
          </div>

          <div className="miniPopoverCard">
            <div className="miniPopoverSectionLabel">Icon</div>
            <div className="miniPopoverIcons">
              <button
                type="button"
                className={miniIcon === "link" ? "miniI miniIActive" : "miniI"}
                onClick={() => setMiniIcon("link")}
                aria-label="link"
              >
                🔗
              </button>
              <button
                type="button"
                className={miniIcon === "music" ? "miniI miniIActive" : "miniI"}
                onClick={() => setMiniIcon("music")}
                aria-label="music"
              >
                🎵
              </button>
              <button
                type="button"
                className={miniIcon === "gift" ? "miniI miniIActive" : "miniI"}
                onClick={() => setMiniIcon("gift")}
                aria-label="gift"
              >
                🎁
              </button>
              <button
                type="button"
                className={miniIcon === "shirt" ? "miniI miniIActive" : "miniI"}
                onClick={() => setMiniIcon("shirt")}
                aria-label="dress"
              >
                👕
              </button>
            </div>

            <div className="miniPopoverSectionLabel">Link *</div>
            <input className="miniPopoverInput" placeholder="https://yourlink.com" />
          </div>
        </div>
      ) : null}

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

      {/* Location modal */}
      <Modal open={locationOpen} title="Location" onClose={() => setLocationOpen(false)}>
        <div className="locationSearchRow">
          <span className="locationSearchIcon">🔍</span>
          <input className="locationSearchInput" placeholder="Place name, address, or link" />
        </div>
        <div className="locationEmpty" />
      </Modal>

      {/* Chip In drawer */}
      <SideDrawer open={chipInOpen} title="Event Settings" onClose={() => setChipInOpen(false)}>
        <div className="settingsGrid">
          <div className="settingsNav">
            <div className="settingsNavItem">Hosts</div>
            <div className="settingsNavItem">RSVPs</div>
            <div className="settingsNavItem">Questionnaire</div>
            <div className="settingsNavItem">Display &amp; Privacy</div>
            <div className="settingsNavItem">Audience</div>
            <div className="settingsNavItem">Photo Album</div>
            <div className="settingsNavItem settingsNavActive">Chip In</div>
            <div className="settingsNavItem">Auto-Reminders</div>
            <div className="settingsNavItem">COVID-19 Safety</div>
          </div>

          <div className="settingsBody">
            <div className="settingsBodyTitleRow">
              <div className="settingsBodyTitle">Chip In</div>
              <div className="settingsBodyHint">
                Payments are not verified. Guests self-report payment during RSVP !!
              </div>
            </div>

            <div className="settingsCard">
              <div className="settingsRow">
                <div className="settingsRowLabel">Chip In</div>
                <div className="settingsRowRight">
                  <button className="settingsSelect" type="button">
                    Required amount
                    <span className="settingsCaret">▾</span>
                  </button>
                </div>
              </div>

              <div className="settingsDivider" />

              <div className="settingsRow">
                <div className="settingsRowLabel">Cost Per Person</div>
                <div className="settingsRowRight">
                  <button className="settingsPill" type="button">
                    USD $
                  </button>
                  <input className="settingsAmount" placeholder="Amount" />
                </div>
              </div>

              <div className="settingsDivider" />

              <div className="settingsSectionTitle">Payment Methods</div>

              <div className="settingsPayRow">
                <div className="settingsPayName">Venmo</div>
                <input className="settingsPayInput" placeholder="@ username" />
              </div>

              <div className="settingsPayRow">
                <div className="settingsPayName">Cash App</div>
                <input className="settingsPayInput" placeholder="$ Cashtag" />
              </div>

              <div className="settingsPayRow">
                <div className="settingsPayName">PayPal</div>
                <input className="settingsPayInput" placeholder="@ username" />
              </div>

              <div className="settingsFootNote">Not supported with Guest Approval or Find a Time</div>
            </div>

            <div className="settingsSaveRow">
              <button className="settingsSaveBtn" type="button" onClick={() => setChipInOpen(false)}>
                Save
              </button>
            </div>
          </div>
        </div>
      </SideDrawer>
    </div>
  );
}
