import { distance } from "./canvas";
import { v4 as uuid } from "uuid";

interface Point {
  x: number;
  y: number;
}

interface Element {
  id: string;
  tool: string;
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  strokeWidth: number;
  [key: string]: any; // For additional properties
}

interface Style {
  strokeWidth: number;
  strokeColor: string;
  strokeStyle: string;
  fill: string;
  opacity: number;
}

export function isWithinElement(
  x: number,
  y: number,
  element: Element
): boolean {
  const { tool, x1, y1, x2, y2, strokeWidth } = element;

  switch (tool) {
    case "arrow":
    case "line":
      const a = { x: x1, y: y1 };
      const b = { x: x2, y: y2 };
      const c = { x, y };

      const offset = distance(a, b) - (distance(a, c) + distance(b, c));
      return Math.abs(offset) < (0.05 * strokeWidth || 1);

    case "circle":
      const width = x2 - x1 + strokeWidth;
      const height = y2 - y1 + strokeWidth;
      const centreX = x1 + width / 2 - strokeWidth / 2;
      const centreY = y1 + height / 2 - strokeWidth / 2;

      const mouseToCentreX = centreX - x;
      const mouseToCentreY = centreY - y;

      const radiusX = Math.abs(width) / 2;
      const radiusY = Math.abs(height) / 2;

      return (
        (mouseToCentreX * mouseToCentreX) / (radiusX * radiusX) +
          (mouseToCentreY * mouseToCentreY) / (radiusY * radiusY) <=
        1
      );

    case "diamond":
    case "rectangle":
      const minX = Math.min(x1, x2) - strokeWidth / 2;
      const maxX = Math.max(x1, x2) + strokeWidth / 2;
      const minY = Math.min(y1, y2) - strokeWidth / 2;
      const maxY = Math.max(y1, y2) + strokeWidth / 2;

      return x >= minX && x <= maxX && y >= minY && y <= maxY;

    default:
      return false;
  }
}

export function getElementPosition(
  x: number,
  y: number,
  elements: Element[]
): Element | undefined {
  return elements.filter((element) => isWithinElement(x, y, element)).at(-1);
}

export function createElement(
  x1: number,
  y1: number,
  x2: number,
  y2: number,
  style: Style,
  tool: string
): Element {
  return { id: uuid(), x1, y1, x2, y2, ...style, tool };
}

export function updateElement(
  id: string,
  stateOption: Partial<Element>,
  setState: (elements: Element[], remote?: boolean, save?: boolean) => void,
  state: Element[],
  overwrite = false
): void {
  const index = state.findIndex((ele) => ele.id === id);
  if (index === -1) return;

  const stateCopy = [...state];
  stateCopy[index] = { ...stateCopy[index], ...stateOption };
  setState(stateCopy, overwrite);
}

export function deleteElement(
  s_element: Element | null,
  setState: React.Dispatch<React.SetStateAction<Element[]>>, // Updated type
  setSelectedElement: (element: Element | null) => void
): void {
  if (!s_element) return;

  setState((prevState) =>
    prevState.filter((element) => element.id !== s_element.id)
  );
  setSelectedElement(null);
}

export function duplicateElement(
  s_element: Element | null,
  setState: React.Dispatch<React.SetStateAction<Element[]>>,
  setSelected: (element: Element) => void,
  factor: number,
  offsets: Partial<Element> = {}
): void {
  if (!s_element) return;

  setState((prevState) =>
    prevState
      .map((element) => {
        if (element.id === s_element.id) {
          const duplicated: Element = {
            ...moveElement(element, factor),
            id: uuid(),
            ...offsets,
          };
          setSelected(duplicated);
          return [element, duplicated] as const;
        }
        return element;
      })
      .flat()
  );
}

export function moveElement(
  element: Element,
  factorX: number,
  factorY?: number
): Element {
  return {
    ...element,
    x1: element.x1 + factorX,
    y1: element.y1 + (factorY ?? factorX),
    x2: element.x2 + factorX,
    y2: element.y2 + (factorY ?? factorX),
  };
}

export function moveElementLayer(
  id: string,
  to: number,
  setState: (elements: Element[]) => void,
  state: Element[]
): void {
  const index = state.findIndex((ele) => ele.id === id);
  if (index === -1) return;

  const stateCopy = [...state];
  const [element] = stateCopy.splice(index, 1);

  let newIndex = index;
  if (to === 1 && index < state.length - 1) newIndex = index + 1;
  else if (to === -1 && index > 0) newIndex = index - 1;
  else if (to === 0) newIndex = 0;
  else if (to === 2) newIndex = state.length - 1;

  stateCopy.splice(newIndex, 0, element);
  setState(stateCopy);
}

export function arrowMove(
  s_element: Element | null,
  x: number,
  y: number,
  setState: React.Dispatch<React.SetStateAction<Element[]>> // Updated type
): void {
  if (!s_element) return;

  setState((prevState) =>
    prevState.map((element) =>
      element.id === s_element.id ? moveElement(element, x, y) : element
    )
  );
}

export function minmax(value: number, [min, max]: [number, number]): number {
  return Math.max(Math.min(value, max), min);
}

export function getElementById(
  id: string,
  elements: Element[]
): Element | undefined {
  return elements.find((element) => element.id === id);
}

export function adjustCoordinates(element: Element): Element {
  const { tool, x1, x2, y1, y2 } = element;
  if (tool === "line" || tool === "arrow") return element;

  return {
    ...element,
    x1: Math.min(x1, x2),
    y1: Math.min(y1, y2),
    x2: Math.max(x1, x2),
    y2: Math.max(y1, y2),
  };
}

interface ResizeValueParams {
  x1: number;
  x2: number;
  y1: number;
  y2: number;
}

export function resizeValue(
  corner: string,
  type: string,
  x: number,
  y: number,
  padding: number,
  coordinates: ResizeValueParams,
  offset: Point,
  elementOffset: ResizeValueParams
): Partial<ResizeValueParams> {
  const getPadding = (condition: boolean) => (condition ? padding : -padding);

  const getType = (
    y: number,
    coordinate: number,
    originalCoordinate: number,
    eleOffset: number,
    te = false
  ) => {
    if (type === "default") return originalCoordinate;
    const def = coordinate - y;
    return te ? eleOffset - def : eleOffset + def;
  };

  switch (corner) {
    case "tt":
      return {
        y1: y + getPadding(y < coordinates.y2),
        y2: getType(y, offset.y, coordinates.y2, elementOffset.y2),
        x1: getType(y, offset.y, coordinates.x1, elementOffset.x1, true),
        x2: getType(y, offset.y, coordinates.x2, elementOffset.x2),
      };
    case "bb":
      return { y2: y + getPadding(y < coordinates.y1) };
    case "rr":
      return { x2: x + getPadding(x < coordinates.x1) };
    case "ll":
      return { x1: x + getPadding(x < coordinates.x2) };
    case "tl":
      return {
        x1: x + getPadding(x < coordinates.x2),
        y1: y + getPadding(y < coordinates.y2),
      };
    case "tr":
      return {
        x2: x + getPadding(x < coordinates.x1),
        y1: y + getPadding(y < coordinates.y2),
      };
    case "bl":
      return {
        x1: x + getPadding(x < coordinates.x2),
        y2: y + getPadding(y < coordinates.y1),
      };
    case "br":
      return {
        x2: x + getPadding(x < coordinates.x1),
        y2: y + getPadding(y < coordinates.y1),
      };
    case "l1":
      return { x1: x, y1: y };
    case "l2":
      return { x2: x, y2: y };
    default:
      return {};
  }
}

export function saveElements(elements: Element[]): void {
  const jsonString = JSON.stringify(elements);
  const blob = new Blob([jsonString], { type: "application/json" });
  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.download = "canvas.sketchFlow";
  link.href = url;
  link.click();
}

export function uploadElements(
  setElements: (elements: Element[]) => void
): void {
  const uploadJSON = (event: Event) => {
    const target = event.target as HTMLInputElement;
    const file = target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target?.result as string) as Element[];
        setElements(data);
      } catch (error) {
        console.error("Error:", error);
      }
    };
    reader.readAsText(file);
  };

  const fileInput = document.createElement("input");
  fileInput.type = "file";
  fileInput.accept = ".kyrosDraw";
  fileInput.onchange = uploadJSON;
  fileInput.click();
}
