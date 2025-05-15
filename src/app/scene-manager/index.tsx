"use client";
import React, { useEffect, useRef } from "react";
import { GameWorld } from "../game-world";

export const gameWorld: { current: null | GameWorld } = { current: null };

export default function SceneManager() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const resizeHandlerRef = useRef<(e: UIEvent) => void | null>(null);

  useEffect(() => {
    if (canvasRef.current) {
      gameWorld.current = new GameWorld(canvasRef.current);
    }
    resizeHandlerRef.current = function () {
      gameWorld.current?.engine?.resize();
    };

    window.addEventListener("resize", resizeHandlerRef.current);

    return () => {
      gameWorld.current?.scene.dispose();
      gameWorld.current?.engine.dispose();
      gameWorld.current = null;

      if (resizeHandlerRef.current)
        window.removeEventListener("resize", resizeHandlerRef.current);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className={`h-full w-full absolute pointer-events-auto`}
      id="babylon-canvas"
    />
  );
}
