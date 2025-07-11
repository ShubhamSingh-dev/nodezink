export function Ui() {
  return (
    <main className="ui">
      <header>
        <Menu />
        <ToolBar />
        <Collaboration />
      </header>
      {(!["selection", "hand"].includes(selectedTool) || selectedElement) && (
        <Style selectedElement={selectedElement || style} />
      )}
      <footer>
        <div>
          <Zoom />
          <UndoRedo />
        </div>
        <div>
          <Credits />
        </div>
      </footer>
    </main>
  );
}
