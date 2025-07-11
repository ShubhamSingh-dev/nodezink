import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import {
  Circle,
  Line,
  Rectangle,
  Selection,
  Diamond,
  Hand,
  Lock,
  Arrow,
} from "../assets/icons";
import { BACKGROUND_COLORS, STROKE_COLORS, STROKE_STYLES } from "../global/var";
import { getElementById, minmax } from "../helper/element";
import useHistory from "../hooks/useHistory";
import { socket } from "../api/socket";

const AppContext = createContext<any>(null);

const isElementsInLocal = () => {
  try {
    const elements = localStorage.getItem("elements");
    return elements ? JSON.parse(elements) : [];
  } catch {
    return [];
  }
};

const intialElements = isElementsInLocal();

export function AppContextProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<string | null>(null);
  const [selectedElement, setSelectedElement] = useState<any>(null);
  const [elements, setElements, undo, redo] = useHistory(
    intialElements,
    session
  );
  const [action, setAction] = useState("none");
  const [selectedTool, setSelectedTool] = useState("selection");
  const [translate, setTranslate] = useState({ x: 0, y: 0, sx: 0, sy: 0 });
  const [scale, setScale] = useState(1);
  const [scaleOffset, setScaleOffset] = useState({ x: 0, y: 0 });
  const [lockTool, setLockTool] = useState(false);
  const [style, setStyle] = useState({
    strokeWidth: 3,
    strokeColor: STROKE_COLORS[0],
    strokeStyle: STROKE_STYLES[0].slug,
    fill: BACKGROUND_COLORS[0],
    opacity: 100,
  });

  useEffect(() => {
    if (session == null) {
      localStorage.setItem("elements", JSON.stringify(elements));
    }

    if (selectedElement && !getElementById(selectedElement.id, elements)) {
      setSelectedElement(null);
    }
  }, [elements, session, selectedElement]);

  const onZoom = (delta: number | "default") => {
    if (delta === "default") {
      setScale(1);
      return;
    }
    setScale((prev) => minmax(prev + delta, [0.1, 20]));
  };

  const toolAction = (slug: string) => {
    if (slug === "lock") {
      setLockTool((prev) => !prev);
      return;
    }
    setSelectedTool(slug);
  };

  const tools = [
    [
      {
        slug: "lock",
        icon: Lock,
        title: "Keep selected tool active after drawing",
        toolAction,
      },
    ],
    [
      {
        slug: "hand",
        icon: Hand,
        title: "Hand",
        toolAction,
      },
      {
        slug: "selection",
        icon: Selection,
        title: "Selection",
        toolAction,
      },
      {
        slug: "rectangle",
        icon: Rectangle,
        title: "Rectangle",
        toolAction,
      },
      {
        slug: "diamond",
        icon: Diamond,
        title: "Diamond",
        toolAction,
      },
      {
        slug: "circle",
        icon: Circle,
        title: "Circle",
        toolAction,
      },
      {
        slug: "arrow",
        icon: Arrow,
        title: "Arrow",
        toolAction,
      },
      {
        slug: "line",
        icon: Line,
        title: "Line",
        toolAction,
      },
    ],
  ];

  useEffect(() => {
    if (session) {
      socket.on("setElements", (data: any) => {
        setElements(data, true, false);
      });
    }
  }, [session]);

  return (
    <AppContext.Provider
      value={{
        action,
        setAction,
        tools,
        selectedTool,
        setSelectedTool,
        elements,
        setElements,
        translate,
        setTranslate,
        scale,
        setScale,
        onZoom,
        scaleOffset,
        setScaleOffset,
        lockTool,
        setLockTool,
        style,
        setStyle,
        selectedElement,
        setSelectedElement,
        undo,
        redo,
        session,
        setSession,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useAppContext must be used within an AppContextProvider");
  }
  return context;
}
