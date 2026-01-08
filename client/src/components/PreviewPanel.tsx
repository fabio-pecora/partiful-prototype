// components/PreviewPanel.tsx
import { useMemo, useState } from "react";
import { Modal } from "./Modal";

type GalleryTab = "Posters" | "GIFs";

type GalleryItem = {
  id: string;
  src: string;
  alt: string;
  group: GalleryTab;
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

// ===== LOCAL ASSETS =====

// Posters
import poster1 from "../assets/covers/posters/poster1.webp";
import poster2 from "../assets/covers/posters/poster2.jpg";
import poster3 from "../assets/covers/posters/poster3.webp";

// GIFs
import gif1 from "../assets/covers/gifs/gif1.gif";
import gif2 from "../assets/covers/gifs/gif2.gif";
import gif3 from "../assets/covers/gifs/gif3.gif";


// ===== GALLERY =====

const GALLERY: GalleryItem[] = [
  // Posters
  { id: "poster1", group: "Posters", alt: "Poster 1", src: poster1 },
  { id: "poster2", group: "Posters", alt: "Poster 2", src: poster2 },
  { id: "poster3", group: "Posters", alt: "Poster 3", src: poster3 },

  // GIFs
  { id: "gif1", group: "GIFs", alt: "GIF 1", src: gif1 },
  { id: "gif2", group: "GIFs", alt: "GIF 2", src: gif2 },
  { id: "gif3", group: "GIFs", alt: "GIF 3", src: gif3 },
];

export function PreviewPanel() {
  const [editOpen, setEditOpen] = useState(false);
  const [tab, setTab] = useState<GalleryTab>("Posters");
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<GalleryItem>(() => GALLERY[0]);

  const visibleItems = useMemo(() => {
    const q = query.trim().toLowerCase();
    return GALLERY.filter((it) => it.group === tab).filter((it) => {
      if (!q) return true;
      return it.alt.toLowerCase().includes(q);
    });
  }, [tab, query]);

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
    </div>
  );
}
