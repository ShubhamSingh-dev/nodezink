import { useCanvas } from "@/hooks/useCanvas";

export function Canvas() {
  const {
    canvasRef,
    dimension,
    handleMouseDown,
    handleMouseUp,
    handleMouseMove,
    handleWheel,
  } = useCanvas();
  return (
    <>
      <canvas
        id="canvas"
        ref={canvasRef}
        width={dimension.width}
        height={dimension.height}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onMouseMove={handleMouseMove}
        onWheel={handleWheel}
      />
    </>
  );
}
