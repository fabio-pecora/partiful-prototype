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

// New richer AI fields
const OCCASIONS = [
  "Anniversary",
  "Birthday",
  "Dinner",
  "Engagement",
  "Wedding",
  "Graduation",
  "Housewarming",
  "Holiday",
  "Baby shower",
  "Bachelor party",
  "Bachelorette party",
  "Concert night",
  "Game night",
  "Club night",
  "Brunch",
  "Meetup",
  "Custom",
] as const;

const VIBES = [
  "Elegant",
  "Romantic",
  "Luxury",
  "Bold",
  "Minimal",
  "Fun",
  "Cozy",
  "Chaotic",
  "Mysterious",
  "Playful",
  "Glam",
  "Vintage",
] as const;

const STYLES = [
  "Graffiti",
  "Illustration",
  "Photography",
  "Neon sign",
  "3D render",
  "Watercolor",
  "Flat graphic",
  "Cinematic",
  "Collage",
  "Minimal poster",
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
  "Red",
  "Green",
  "Orange",
] as const;

const LAYOUTS = [
  "Centered",
  "Minimal clean",
  "Maximal collage",
  "Symmetric",
  "Asymmetric",
  "Big subject closeup",
] as const;

const LIGHTING = [
  "Soft glow",
  "Neon lights",
  "Golden hour",
  "Studio flash",
  "Moody shadows",
  "Dreamy haze",
] as const;

const TEXTURES = [
  "Smooth",
  "Film grain",
  "Paper texture",
  "Canvas",
  "Glossy",
  "Metallic",
] as const;

const TYPOGRAPHY = [
  "Modern sans",
  "Elegant serif",
  "Handwritten",
  "Graffiti tag",
  "No text",
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

  // AI fields (easy defaults)
  const [eventTitle, setEventTitle] = useState("Untitled Event");
  const [description, setDescription] = useState(""); // max 100
  const [occasion, setOccasion] = useState<(typeof OCCASIONS)[number]>("Anniversary");
  const [vibe, setVibe] = useState<(typeof VIBES)[number]>("Elegant");
  const [style, setStyle] = useState<(typeof STYLES)[number]>("Graffiti");
  const [colors, setColors] = useState<(typeof COLOR_PRESETS)[number][]>(["Purple", "Pink", "Blue"]);
  const [layout, setLayout] = useState<(typeof LAYOUTS)[number]>("Centered");
  const [lighting, setLighting] = useState<(typeof LIGHTING)[number]>("Soft glow");
  const [texture, setTexture] = useState<(typeof TEXTURES)[number]>("Smooth");
  const [typography, setTypography] = useState<(typeof TYPOGRAPHY)[number]>("Modern sans");
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

  function toggleColor(c: (typeof COLOR_PRESETS)[number]) {
    setColors((prev) => {
      if (prev.includes(c)) return prev.filter((x) => x !== c);
      if (prev.length >= 5) return prev;
      return [...prev, c];
    });
  }

  function randomizeMagic() {
    const pick = <T,>(arr: readonly T[]) => arr[Math.floor(Math.random() * arr.length)];

    setOccasion(pick(OCCASIONS));
    setVibe(pick(VIBES));
    setStyle(pick(STYLES));
    setLayout(pick(LAYOUTS));
    setLighting(pick(LIGHTING));
    setTexture(pick(TEXTURES));
    setTypography(pick(TYPOGRAPHY));

    const shuffled = [...COLOR_PRESETS].sort(() => Math.random() - 0.5);
    const n = 2 + Math.floor(Math.random() * 3);
    setColors(shuffled.slice(0, n));
  }

  const promptPreview = useMemo(() => {
    const safeColors = colors.length ? colors.join(", ") : "Auto";
    const safeDesc = description.trim() ? description.trim() : "none";
    const titleLine = includeText ? `Text: "${eventTitle || "Untitled Event"}"` : "Text: none";
    const details = extraDetails.trim() ? extraDetails.trim() : "none";

    return [
      `Occasion: ${occasion}`,
      `Vibe: ${vibe}`,
      `Style: ${style}`,
      `Colors: ${safeColors}`,
      `Layout: ${layout}`,
      `Lighting: ${lighting}`,
      `Texture: ${texture}`,
      `Typography: ${typography}`,
      `Description: ${safeDesc}`,
      titleLine,
      `Extra: ${details}`,
    ].join(" | ");
  }, [
    occasion,
    vibe,
    style,
    colors,
    layout,
    lighting,
    texture,
    typography,
    description,
    includeText,
    eventTitle,
    extraDetails,
  ]);

  async function onGenerateAiCover() {
    setAiError(null);

    const descTrim = description.trim();
    if (descTrim.length > 100) {
      setAiError("Description must be 100 characters or less.");
      return;
    }

    setAiLoading(true);

    try {
      const resp = await fetch("http://localhost:5179/api/generate-cover", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          eventTitle,
          description: descTrim,
          occasion,
          vibe,
          style,
          colors,
          layout,
          lighting,
          texture,
          typography,
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
        alt: `AI Cover: ${occasion} ${vibe} ${style}`,
        src: url,
        isAi: true,
      };

      setGallery((prev) => [aiItem, ...prev]);
      setSelected(aiItem);
      setTab("Posters");
      setAiOpen(false);
    } catch (e) {
      setAiError(e instanceof Error ? e.message : "Generation failed");
    } finally {
      setAiLoading(false);
    }
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
            className="aiMagicPrimary"
            type="button"
            onClick={() => {
              setAiError(null);
              setAiOpen(true);
            }}
          >
            <span className="aiMagicPrimaryIcon">✨</span>
            AI Magic
            <span className="aiMagicPrimaryGlow" />
          </button>

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
        title="AI Magic Lab"
        onClose={() => setAiOpen(false)}
        cardClassName="aiMagicBigModalCard"
      >
        <div className="aiLab">
          <div className="aiLabHeader">
            <div className="aiLabTitle">Create a premium cover</div>
            <div className="aiLabSub">
              Build the vibe, lock the style, and generate. Session only.
            </div>
          </div>

          <div className="aiLabShell">
            <div className="aiLabLeft">
              <div className="aiLabCard">
                <div className="aiLabLabelRow">
                  <div className="aiLabLabel">Description</div>
                  <div className="aiLabHint">{description.trim().length}/100</div>
                </div>

                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value.slice(0, 100))}
                  placeholder="A dreamy neon anniversary poster with roses and glow..."
                  style={{
                    width: "100%",
                    minHeight: 84,
                    resize: "none",
                    borderRadius: 12,
                    border: "1px solid rgba(255,255,255,0.12)",
                    background: "rgba(255,255,255,0.06)",
                    color: "rgba(255,255,255,0.92)",
                    padding: "10px 12px",
                    outline: "none",
                    fontWeight: 750,
                    lineHeight: 1.35,
                  }}
                />
              </div>

              <div className="aiLabCard">
                <div className="aiLabLabelRow">
                  <div className="aiLabLabel">Occasion</div>
                  <div className="aiLabHint">Required</div>
                </div>
                <div className="aiLabChips">
                  {OCCASIONS.map((o) => (
                    <button
                      key={o}
                      type="button"
                      className={o === occasion ? "aiLabChip aiLabChipActive" : "aiLabChip"}
                      onClick={() => setOccasion(o)}
                    >
                      {o}
                    </button>
                  ))}
                </div>
              </div>

              <div className="aiLabCard">
                <div className="aiLabLabelRow">
                  <div className="aiLabLabel">Vibe</div>
                  <div className="aiLabHint">Required</div>
                </div>
                <div className="aiLabChips">
                  {VIBES.map((m) => (
                    <button
                      key={m}
                      type="button"
                      className={m === vibe ? "aiLabChip aiLabChipActive" : "aiLabChip"}
                      onClick={() => setVibe(m)}
                    >
                      {m}
                    </button>
                  ))}
                </div>
              </div>

              <div className="aiLabCard">
                <div className="aiLabLabelRow">
                  <div className="aiLabLabel">Style</div>
                  <div className="aiLabHint">Required</div>
                </div>
                <div className="aiLabChips">
                  {STYLES.map((s) => (
                    <button
                      key={s}
                      type="button"
                      className={s === style ? "aiLabChip aiLabChipActive" : "aiLabChip"}
                      onClick={() => setStyle(s)}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>

              <div className="aiLabCard">
                <div className="aiLabLabelRow">
                  <div className="aiLabLabel">Dominant colors</div>
                  <div className="aiLabHint">Up to 5</div>
                </div>
                <div className="aiLabChips">
                  {COLOR_PRESETS.map((c) => (
                    <button
                      key={c}
                      type="button"
                      className={colors.includes(c) ? "aiLabChip aiLabChipActive" : "aiLabChip"}
                      onClick={() => toggleColor(c)}
                    >
                      {c}
                    </button>
                  ))}
                </div>
              </div>

              <div className="aiLabCard">
                <div className="aiLabLabelRow">
                  <div className="aiLabLabel">Layout</div>
                  <div className="aiLabHint">Composition</div>
                </div>
                <div className="aiLabChips">
                  {LAYOUTS.map((x) => (
                    <button
                      key={x}
                      type="button"
                      className={x === layout ? "aiLabChip aiLabChipActive" : "aiLabChip"}
                      onClick={() => setLayout(x)}
                    >
                      {x}
                    </button>
                  ))}
                </div>
              </div>

              <div className="aiLabCard">
                <div className="aiLabLabelRow">
                  <div className="aiLabLabel">Lighting</div>
                  <div className="aiLabHint">Mood</div>
                </div>
                <div className="aiLabChips">
                  {LIGHTING.map((x) => (
                    <button
                      key={x}
                      type="button"
                      className={x === lighting ? "aiLabChip aiLabChipActive" : "aiLabChip"}
                      onClick={() => setLighting(x)}
                    >
                      {x}
                    </button>
                  ))}
                </div>
              </div>

              <div className="aiLabCard">
                <div className="aiLabLabelRow">
                  <div className="aiLabLabel">Texture</div>
                  <div className="aiLabHint">Finish</div>
                </div>
                <div className="aiLabChips">
                  {TEXTURES.map((x) => (
                    <button
                      key={x}
                      type="button"
                      className={x === texture ? "aiLabChip aiLabChipActive" : "aiLabChip"}
                      onClick={() => setTexture(x)}
                    >
                      {x}
                    </button>
                  ))}
                </div>
              </div>

              <div className="aiLabCard">
                <div className="aiLabLabelRow">
                  <div className="aiLabLabel">Typography</div>
                  <div className="aiLabHint">If text is on</div>
                </div>
                <div className="aiLabChips">
                  {TYPOGRAPHY.map((x) => (
                    <button
                      key={x}
                      type="button"
                      className={x === typography ? "aiLabChip aiLabChipActive" : "aiLabChip"}
                      onClick={() => setTypography(x)}
                    >
                      {x}
                    </button>
                  ))}
                </div>
              </div>

              <div className="aiLabCard">
                <div className="aiLabLabelRow">
                  <div className="aiLabLabel">Event title</div>
                  <div className="aiLabHint">Optional</div>
                </div>
                <input
                  className="aiLabInput"
                  value={eventTitle}
                  onChange={(e) => setEventTitle(e.target.value)}
                  placeholder="Untitled Event"
                />
              </div>

              <div className="aiLabCard aiLabRowCard">
                <button
                  type="button"
                  className={includeText ? "aiLabToggle aiLabToggleOn" : "aiLabToggle"}
                  onClick={() => setIncludeText((p) => !p)}
                  aria-label="toggle include text"
                >
                  <span className="aiLabToggleKnob" />
                </button>
                <div className="aiLabRowText">
                  <div className="aiLabLabel">Include text on image</div>
                  <div className="aiLabHint">Turn off for cleaner posters</div>
                </div>
              </div>

              <div className="aiLabCard">
                <div className="aiLabLabelRow">
                  <div className="aiLabLabel">Extra details</div>
                  <div className="aiLabHint">Optional</div>
                </div>
                <input
                  className="aiLabInput"
                  value={extraDetails}
                  onChange={(e) => setExtraDetails(e.target.value)}
                  placeholder="roses, champagne, skyline, sparkles..."
                />
              </div>
            </div>

            <div className="aiLabRight">
              <div className="aiLabPreviewCard">
                <div className="aiLabPreviewTitle">Prompt preview</div>
                <div className="aiLabPreviewText">{promptPreview}</div>

                <div className="aiLabActions">
                  <button className="aiLabGhost" type="button" onClick={randomizeMagic}>
                    Surprise me
                  </button>

                  <button
                    className={aiLoading ? "aiLabGenerate aiLabGenerateLoading" : "aiLabGenerate"}
                    type="button"
                    onClick={onGenerateAiCover}
                    disabled={aiLoading}
                  >
                    {aiLoading ? (
                      <>
                        <span className="aiLabSpinner" /> Generating
                      </>
                    ) : (
                      <>Generate cover</>
                    )}
                  </button>
                </div>

                {aiError ? <div className="aiLabError">{aiError}</div> : null}

                <div className="aiLabFinePrint">
                  Tip: Anniversary + Romantic + Neon lights + Film grain looks insane.
                </div>
              </div>

              <div className="aiLabMiniNote">
                The generated cover is added to Posters and becomes your selected cover instantly.
              </div>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
}
