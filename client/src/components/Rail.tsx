import { Icon, type IconName } from "./Icon";

function RailButton({ label, icon }: { label: string; icon: IconName }) {
  return (
    <button className="railBtn" type="button">
      <span className="railCircle">
        <Icon name={icon} />
      </span>
      <span className="railLabel">{label}</span>
    </button>
  );
}

export function Rail() {
  return (
    <aside className="railFixed" aria-label="Right tools">
      <RailButton label="Theme" icon="theme" />
      <RailButton label="Effect" icon="effect" />
      <RailButton label="Settings" icon="settings" />
      <RailButton label="Preview" icon="preview" />
    </aside>
  );
}
