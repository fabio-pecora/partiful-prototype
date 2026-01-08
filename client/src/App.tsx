import { Topbar } from "./components/Topbar";
import { EditorPanel } from "./components/EditorPanel";
import { PreviewPanel } from "./components/PreviewPanel";
import { Rail } from "./components/Rail";
import { BackgroundBubbles } from "./components/BackgroundBubbles";
import { BackgroundFX } from "./components/BackgroundFX";

export default function App() {
  return (
    <div className="app">
      <BackgroundBubbles count={22} />
      <BackgroundFX />

      <Topbar />

      <main className="canvas">
        <section className="leftCol">
          <EditorPanel />
        </section>

        <section className="rightCol">
          <PreviewPanel />
        </section>
      </main>

      <Rail />

      <button className="saveDraft" type="button">
        Save draft
      </button>
    </div>
  );
}
