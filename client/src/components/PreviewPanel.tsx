// components/PreviewPanel.tsx
import { useMemo, useState } from "react";
import { Modal } from "./Modal";

type GalleryTab = "Posters" | "GIFs" | "Photos";

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

// Placeholders so your UI looks like the reference.
// Replace with your own hosted images whenever you want.
const GALLERY: GalleryItem[] = [
  {
    id: "poster_movie_awards",
    group: "Posters",
    alt: "Movie awards",
    src: "https://images.unsplash.com/photo-1524985069026-dd778a71c7b4?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: "poster_capricorn",
    group: "Posters",
    alt: "Capricorn",
    src: "https://images.unsplash.com/photo-1519682577862-22b62b24e493?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: "poster_cake",
    group: "Posters",
    alt: "Birthday cake",
    src: "https://images.unsplash.com/photo-1542826438-70020410a6a9?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: "poster_star",
    group: "Posters",
    alt: "Star",
    src: "https://images.unsplash.com/photo-1522098543979-ffc7f79d5af5?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: "poster_clock",
    group: "Posters",
    alt: "Clock",
    src: "https://images.unsplash.com/photo-1501139083538-0139583c060f?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: "poster_neon",
    group: "Posters",
    alt: "Neon",
    src: "https://images.unsplash.com/photo-1518837695005-2083093ee35b?auto=format&fit=crop&w=1200&q=80",
  },

  {
    id: "gif_glitter",
    group: "GIFs",
    alt: "Glitter",
    src: "https://media.giphy.com/media/3o7aD2saalBwwftBIY/giphy.gif",
  },
  {
    id: "gif_confetti",
    group: "GIFs",
    alt: "Confetti",
    src: "https://media.giphy.com/media/l0HlQ7LRalQqdWfao/giphy.gif",
  },
  {
    id: "gif_party",
    group: "GIFs",
    alt: "Party lights",
    src: "https://media.giphy.com/media/3oEjI6SIIHBdRxXI40/giphy.gif",
  },

  {
    id: "photo_cards",
    group: "Photos",
    alt: "Cards",
    src: "https://images.unsplash.com/photo-1524519995226-23c56417d8a6?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: "photo_pattern",
    group: "Photos",
    alt: "Pattern",
    src: "https://images.unsplash.com/photo-1526401485004-2fda9f6a1d6a?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: "photo_street",
    group: "Photos",
    alt: "Street",
    src: "https://images.unsplash.com/photo-1520975682031-a9c0a02b6b21?auto=format&fit=crop&w=1200&q=80",
  },
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

          <button className="editPill editPillOnImage" type="button" onClick={() => setEditOpen(true)}>
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
                aria-label="Find an image"
              />
            </div>

            <button className="imgUpload" type="button">
              <span className="imgUploadIcon">⬆</span> Upload
            </button>
          </div>

          <div className="imgChips" aria-label="Categories">
            {CATEGORY_CHIPS.map((c) => (
              <button key={c} type="button" className="imgChip">
                {c}
              </button>
            ))}
          </div>

          <div className="imgTabs" role="tablist" aria-label="Tabs">
            {(["Posters", "GIFs", "Photos"] as GalleryTab[]).map((t) => (
              <button
                key={t}
                type="button"
                className={t === tab ? "imgTab imgTabActive" : "imgTab"}
                onClick={() => setTab(t)}
                role="tab"
                aria-selected={t === tab}
              >
                {t}
              </button>
            ))}
          </div>

          <div className="imgGrid" role="list" aria-label="Images">
            {visibleItems.map((it) => {
              const active = it.id === selected.id;
              return (
                <button
                  key={it.id}
                  type="button"
                  className={active ? "imgTile imgTileActive" : "imgTile"}
                  onClick={() => {
                    setSelected(it);
                    setEditOpen(false);
                  }}
                  role="listitem"
                  aria-label={it.alt}
                >
                  <img className="imgTileImg" src={it.src} alt={it.alt} loading="lazy" />
                </button>
              );
            })}
          </div>
        </div>
      </Modal>
    </div>
  );
}
