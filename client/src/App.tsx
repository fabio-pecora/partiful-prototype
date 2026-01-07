import { Topbar } from "./components/Topbar";
import { EditorPanel } from "./components/EditorPanel";
import { PreviewPanel } from "./components/PreviewPanel";
import { Rail } from "./components/Rail";

export default function App() {
  return (
    <div className="app">
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
