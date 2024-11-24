import React, { useRef, useState, useEffect } from "react";
import "./Test.css";

const Test2 = () => {
  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [ctx, setCtx] = useState(null);

  const [canDraw, setCanDraw] = useState(false);
  const [lastPosition, setLastPosition] = useState({ x: 0, y: 0 });
  // Установка размеров холста на полный экран и контекста
  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");

    // Устанавливаем размеры холста по размеру окна
    const resizeCanvas = () => {
      canvas.width = window.innerWidth - 40;
      canvas.height = window.innerHeight - 50;
      context.lineWidth = 2;
      context.lineCap = "round";
      context.lineJoin = "round";
      context.strokeStyle = "black";
    };

    // Настройка холста при первом рендере
    resizeCanvas();
    setCtx(context); // Устанавливаем контекст

    // Обработчик изменения размеров окна
    window.addEventListener("resize", resizeCanvas);

    // Удаление обработчика при размонтировании компонента
    return () => window.removeEventListener("resize", resizeCanvas);
  }, []);

  const startDrawing = (e) => {
    if (!ctx) return;
    ctx.beginPath();
    ctx.moveTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
    setLastPosition({ x: e.nativeEvent.offsetX, y: e.nativeEvent.offsetY });
    setIsDrawing(true);
  };

  const draw = (e) => {
    if (!isDrawing || !ctx) return;

    const currentPosition = {
      x: e.nativeEvent.offsetX,
      y: e.nativeEvent.offsetY,
    };

    // Логика для рисования сглаженных линий
    ctx.quadraticCurveTo(
      lastPosition.x,
      lastPosition.y,
      (lastPosition.x + currentPosition.x) / 2,
      (lastPosition.y + currentPosition.y) / 2
    );
    ctx.stroke();

    // Обновляем последнюю позицию
    setLastPosition(currentPosition);
  };

  const stopDrawing = () => {
    if (!ctx) return;
    ctx.closePath();
    setIsDrawing(false);
  };

  return (
    <div>
      <div>
        Уровень ЕГЭ<input type="checkbox"></input>
        Сложнее ЕГЭ<input type="checkbox"></input>
      </div>

      <button
        style={{
          position: "fixed",
          display: "inline-block",
          top: "80px", // Отступ от верхней границы
          left: "20px", // Отступ от левой границы
          zIndex: 1000, // Убедитесь, что кнопка находится выше канваса
        }}
        onClick={() => {
          const canvas = canvasRef.current;
          const context = canvas.getContext("2d");
          context.clearRect(0, 0, canvas.width, canvas.height); // Очищает канвас
        }}
      >
        Очистить
      </button>
      <button
        style={{
          position: "absolute",
          top: "120px", // Отступ от верхней границы
          left: "20px", // Отступ от левой границы
          zIndex: 1000, // Убедитесь, что кнопка находится выше канваса
        }}
        onClick={() => {
          setCanDraw(!canDraw);
        }}
      >
        Рисовать
      </button>

      <canvas
        ref={canvasRef}
        onMouseDown={startDrawing}
        onMouseMove={draw}
        onMouseUp={stopDrawing}
        onMouseLeave={stopDrawing}
        style={{
          position: "absolute",
          top: 50,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: "transparent",
          //display: "block",
          cursor: "crosshair",
          display: !canDraw ? "None" : "block",
        }}
      />
    </div>
  );
};

export default Test2;
