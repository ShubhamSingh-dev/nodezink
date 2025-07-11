import { FC } from "react";
import { Redo, Undo } from "../assets/icons";
import { useAppContext } from "../provider/AppStates";

export const UndoRedo: FC = () => {
  const { undo, redo } = useAppContext();

  return (
    <section className="undoRedo">
      <button type="button" onClick={undo} aria-label="Undo">
        <Undo />
      </button>
      <button type="button" onClick={redo} aria-label="Redo">
        <Redo />
      </button>
    </section>
  );
};
