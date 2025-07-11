import { FC } from "react";
import { useAppContext } from "../provider/AppStates";

export const Zoom: FC = () => {
  const { scale, onZoom } = useAppContext();
  
  const handleZoomOut = () => onZoom(-0.1);
  const handleZoomIn = () => onZoom(0.1);
  const handleResetZoom = () => onZoom("default");

  const formattedScale = new Intl.NumberFormat("fr-CA", { 
    style: "percent" 
  }).format(scale);

  return (
    <section className="zoomOptions">
      <button 
        className="zoom out" 
        onClick={handleZoomOut}
        aria-label="Zoom out"
      >
        -
      </button>
      <span
        className="zoom text"
        onClick={handleResetZoom}
        title="Reset zoom"
        role="button"
        tabIndex={0}
        aria-label="Reset zoom"
      >
        {formattedScale}
      </span>
      <button 
        className="zoom in" 
        onClick={handleZoomIn}
        aria-label="Zoom in"
      >
        +
      </button>
    </section>
  );
};