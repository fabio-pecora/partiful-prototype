// components/PreviewPanel.tsx
import { useEffect, useMemo, useRef, useState } from "react";
import { Modal } from "./Modal";

type GalleryTab = "Posters" | "GIFs";

type GalleryItem = {
  id: string;
  src: string;
  alt: string;
  group: GalleryTab;
  isAi?: boolean;
};

const CATEGORY_CHIPS = [
  "Trending",
  "Birthday",
  "Elegant",
  "Minimal",
  "Dinner Party",
  "Themed",
  "Community Made",
  "Chill",
  "Not Chill",
  "Holiday",
  "College",
];

// Posters
import poster1 from "../assets/covers/posters/poster1.webp";
import poster2 from "../assets/covers/posters/poster2.jpg";
import poster3 from "../assets/covers/posters/poster3.webp";

// GIFs
import gif1 from "../assets/covers/gifs/gif1.gif";
import gif2 from "../assets/covers/gifs/gif2.gif";
import gif3 from "../assets/covers/gifs/gif3.gif";

const INITIAL_GALLERY: GalleryItem[] = [
  { id: "poster1", group: "Posters", alt: "Poster 1", src: poster1 },
  { id: "poster2", group: "Posters", alt: "Poster 2", src: poster2 },
  { id: "poster3", group: "Posters", alt: "Poster 3", src: poster3 },

  { id: "gif1", group: "GIFs", alt: "GIF 1", src: gif1 },
  { id: "gif2", group: "GIFs", alt: "GIF 2", src: gif2 },
  { id: "gif3", group: "GIFs", alt: "GIF 3", src: gif3 },
];

const EVENT_TYPES = [
  "Birthday",
  "Dinner",
  "Party",
  "Wedding",
  "Graduation",
  "Meetup",
  "Holiday",
  "Custom",
] as const;

const VIBES = [
  "Elegant",
  "Fun",
  "Minimal",
  "Bold",
  "Romantic",
  "Chaotic",
  "Cozy",
  "Luxury",
] as const;

const COLOR_PRESETS = [
  "Purple",
  "Pink",
  "Blue",
  "Gold",
  "Black",
  "White",
  "Neon",
  "Pastel",
] as const;

const STYLES = [
  "Illustration",
  "Photography",
  "Neon sign",
  "Graffiti",
  "3D render",
  "Watercolor",
  "Flat graphic",
  "Cinematic",
] as const;

function b64ToBlob(b64: string, mime: string) {
  const byteChars = atob(b64);
  const byteNums = new Array(byteChars.length);
  for (let i = 0; i < byteChars.length; i++) byteNums[i] = byteChars.charCodeAt(i);
  const bytes = new Uint8Array(byteNums);
  return new Blob([bytes], { type: mime });
}

export function PreviewPanel() {
  const [editOpen, setEditOpen] = useState(false);
  const [tab, setTab] = useState<GalleryTab>("Posters");
  const [query, setQuery] = useState("");

  const [gallery, setGallery] = useState<GalleryItem[]>(() => INITIAL_GALLERY);
  const [selected, setSelected] = useState<GalleryItem>(() => INITIAL_GALLERY[0]);

  // AI modal
  const [aiOpen, setAiOpen] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiError, setAiError] = useState<string | null>(null);

  const [eventTitle, setEventTitle] = useState("Untitled Event");
  const [eventType, setEventType] = useState<(typeof EVENT_TYPES)[number] | "">("");
  const [vibe, setVibe] = useState<(typeof VIBES)[number] | "">("");
  const [style, setStyle] = useState<(typeof STYLES)[number] | "">("");
  const [colors, setColors] = useState<(typeof COLOR_PRESETS)[number][]>(["Purple", "Pink", "Blue"]);
  const [includeText, setIncludeText] = useState(true);
  const [extraDetails, setExtraDetails] = useState("");

  const createdObjectUrlsRef = useRef<string[]>([]);

  useEffect(() => {
    return () => {
      for (const url of createdObjectUrlsRef.current) URL.revokeObjectURL(url);
      createdObjectUrlsRef.current = [];
    };
  }, []);

  const visibleItems = useMemo(() => {
    const q = query.trim().toLowerCase();
    return gallery
      .filter((it) => it.group === tab)
      .filter((it) => {
        if (!q) return true;
        return it.alt.toLowerCase().includes(q);
      });
  }, [tab, query, gallery]);

  async function onGenerateAiCover() {
    if (!eventType || !vibe || !style) {
      setAiError("Pick an event type, a vibe, and a style.");
      return;
    }

    setAiError(null);
    setAiLoading(true);

    try {
      const resp = await fetch("http://localhost:5174/api/generate-cover", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          eventTitle,
          eventType,
          vibe,
          colors,
          style,
          includeText,
          extraDetails,
        }),
      });

      if (!resp.ok) {
        const j = await resp.json().catch(() => ({}));
        throw new Error(j?.error || "Request failed");
      }

      const data = (await resp.json()) as { b64: string; mime: string };
      const blob = b64ToBlob(data.b64, data.mime || "image/webp");
      const url = URL.createObjectURL(blob);
      createdObjectUrlsRef.current.push(url);

      const aiItem: GalleryItem = {
        id: `ai-${Date.now()}`,
        group: "Posters",
        alt: `AI Cover: ${eventType} ${vibe}`,
        src: url,
        isAi: true,
      };

      setGallery((prev) => [aiItem, ...prev]);
      setSelected(aiItem);
      setTab("Posters");

      setAiOpen(false);
      setEditOpen(false);
    } catch (e) {
      setAiError(e instanceof Error ? e.message : "Generation failed");
    } finally {
      setAiLoading(false);
    }
  }

  function toggleColor(c: (typeof COLOR_PRESETS)[number]) {
    setColors((prev) => {
      if (prev.includes(c)) return prev.filter((x) => x !== c);
      if (prev.length >= 5) return prev;
      return [...prev, c];
    });
  }

  return (
    <div
      className="previewStack previewWithBg"
      style={{
        ["--previewBgUrl" as any]: `url(${selected.src})`,
      }}
    >
      <div className="coverCard coverCardTight">
        <div
          className="coverImg coverImgFull coverImgPhoto"
          style={{ backgroundImage: `url(${selected.src})` }}
          aria-label="Cover"
          role="img"
        >
          <div className="coverImgOverlay" />

          <button
            className="editPill editPillOnImage"
            type="button"
            onClick={() => setEditOpen(true)}
          >
            <span className="editIcon">✎</span> Edit
          </button>
        </div>
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
          <button className="rsvpOption" type="button">
            <div className="rsvpCircle">
              <span className="rsvpEmoji">👍</span>
            </div>
            <div className="rsvpLabel">Going</div>
          </button>

          <button className="rsvpOption" type="button">
            <div className="rsvpCircle">
              <span className="rsvpEmoji">🤔</span>
            </div>
            <div className="rsvpLabel">Maybe</div>
          </button>

          <button className="rsvpOption" type="button">
            <div className="rsvpCircle">
              <span className="rsvpEmoji">😢</span>
            </div>
            <div className="rsvpLabel">Can't Go</div>
          </button>
        </div>
      </div>

      <Modal
        open={editOpen}
        title="Choose a cover"
        onClose={() => setEditOpen(false)}
        cardClassName="imgPickerModalCard"
      >
        <div className="imgPicker">
          <div className="imgPickerTop">
            <div className="imgSearch">
              <span className="imgSearchIcon">🔎</span>
              <input
                className="imgSearchInput"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Find an image..."
              />
            </div>

            <button className="imgUpload" type="button">
              <span className="imgUploadIcon">⬆</span> Upload
            </button>

            <button
              className="aiMagicBtn"
              type="button"
              onClick={() => {
                setAiError(null);
                setAiOpen(true);
              }}
            >
              ✨ AI Magic
            </button>
          </div>

          <div className="imgChips">
            {CATEGORY_CHIPS.map((c) => (
              <button key={c} type="button" className="imgChip">
                {c}
              </button>
            ))}
          </div>

          <div className="imgTabs">
            {(["Posters", "GIFs"] as GalleryTab[]).map((t) => (
              <button
                key={t}
                className={t === tab ? "imgTab imgTabActive" : "imgTab"}
                onClick={() => setTab(t)}
              >
                {t}
              </button>
            ))}
          </div>

          <div className="imgGrid">
            {visibleItems.map((it) => (
              <button
                key={it.id}
                className={it.id === selected.id ? "imgTile imgTileActive" : "imgTile"}
                onClick={() => {
                  setSelected(it);
                  setEditOpen(false);
                }}
              >
                <img className="imgTileImg" src={it.src} alt={it.alt} />
              </button>
            ))}
          </div>
        </div>
      </Modal>

      <Modal
        open={aiOpen}
        title="Create your cover with AI"
        onClose={() => setAiOpen(false)}
        cardClassName="aiMagicModalCard"
      >
        <div className="aiMagicWrap">
          <div className="aiMagicIntro">
            <div className="aiMagicKicker">Magic mode</div>
            <div className="aiMagicSub">
              Pick a vibe and we will generate a premium cover for this session.
            </div>
          </div>

          <div className="aiMagicGrid">
            <div className="aiField">
              <div className="aiLabelRow">
                <div className="aiLabel">Event title</div>
                <div className="aiHint">Optional</div>
              </div>
              <input
                className="aiInput"
                value={eventTitle}
                onChange={(e) => setEventTitle(e.target.value)}
                placeholder="Untitled Event"
              />
            </div>

            <div className="aiField">
              <div className="aiLabelRow">
                <div className="aiLabel">Event type</div>
                <div className="aiHint">Required</div>
              </div>
              <div className="aiChips">
                {EVENT_TYPES.map((t) => (
                  <button
                    key={t}
                    type="button"
                    className={t === eventType ? "aiChip aiChipActive" : "aiChip"}
                    onClick={() => setEventType(t)}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>

            <div className="aiField">
              <div className="aiLabelRow">
                <div className="aiLabel">Vibe</div>
                <div className="aiHint">Required</div>
              </div>
              <div className="aiChips">
                {VIBES.map((m) => (
                  <button
                    key={m}
                    type="button"
                    className={m === vibe ? "aiChip aiChipActive" : "aiChip"}
                    onClick={() => setVibe(m)}
                  >
                    {m}
                  </button>
                ))}
              </div>
            </div>

            <div className="aiField">
              <div className="aiLabelRow">
                <div className="aiLabel">Dominant colors</div>
                <div className="aiHint">Up to 5</div>
              </div>
              <div className="aiChips">
                {COLOR_PRESETS.map((c) => (
                  <button
                    key={c}
                    type="button"
                    className={colors.includes(c) ? "aiChip aiChipActive" : "aiChip"}
                    onClick={() => toggleColor(c)}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>

            <div className="aiField">
              <div className="aiLabelRow">
                <div className="aiLabel">Visual style</div>
                <div className="aiHint">Required</div>
              </div>
              <div className="aiChips">
                {STYLES.map((s) => (
                  <button
                    key={s}
                    type="button"
                    className={s === style ? "aiChip aiChipActive" : "aiChip"}
                    onClick={() => setStyle(s)}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            <div className="aiField aiFieldRow">
              <button
                type="button"
                className={includeText ? "aiToggle aiToggleOn" : "aiToggle"}
                onClick={() => setIncludeText((p) => !p)}
              >
                <span className="aiToggleKnob" />
              </button>
              <div className="aiLabel">Include text on image</div>
              <div className="aiHint">Looks best for minimal and elegant styles</div>
            </div>

            <div className="aiField">
              <div className="aiLabelRow">
                <div className="aiLabel">Extra details</div>
                <div className="aiHint">Optional</div>
              </div>
              <input
                className="aiInput"
                value={extraDetails}
                onChange={(e) => setExtraDetails(e.target.value)}
                placeholder="confetti, candles, skyline, balloons..."
              />
            </div>
          </div>

          {aiError ? <div className="aiError">{aiError}</div> : null}

          <div className="aiActions">
            <button className="aiGhost" type="button" onClick={() => setAiOpen(false)}>
              Cancel
            </button>

            <button
              className={aiLoading ? "aiGenerate aiGenerateLoading" : "aiGenerate"}
              type="button"
              onClick={onGenerateAiCover}
              disabled={aiLoading}
            >
              {aiLoading ? (
                <>
                  <span className="aiSpinner" /> Generating
                </>
              ) : (
                <>Generate cover</>
              )}
            </button>
          </div>

          <div className="aiFootnote">
            Tip: pick “Graffiti” + “Bold” for a very Partiful looking poster.
          </div>
        </div>
      </Modal>
    </div>
  );
}
