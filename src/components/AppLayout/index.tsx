import { useCallback, useEffect, useRef, useState } from 'react';
import {
  rgbToHex,
  drawImage,
  getDataAndDrawPointer,
  convertColorArrToString,
  invokeRGBNumbersFromArr,
} from '@/utils/helpers.ts';
import AppMain from './AppMain';
import AppHeader from './AppHeader';
import { useResizeObserver } from '@/hooks/useResizeObserver.tsx';
import { POINTER_RECT_HEIGHT, POINTER_RECT_WIDTH } from '@/utils/constants.ts';

function AppLayout() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const ctxRef = useRef<CanvasRenderingContext2D | null>(null);
  const imageRef = useRef<HTMLImageElement | null>(null);
  const currentColor = useRef<number[] | null>(null);
  const size = useRef<[number, number] | null>([1, 1]);

  useResizeObserver(canvasRef, size);

  useEffect(() => {
    ctxRef.current =
      canvasRef.current?.getContext('2d', {
        willReadFrequently: true,
      }) || null;
    if (!ctxRef.current) throw new Error('Can not create context');
  }, []);

  const [colors, setColors] = useState<{
    HEX: string;
    RGB: string;
  }>({
    HEX: '',
    RGB: '',
  });
  const [isColorDropper, setIsColorDropper] = useState(false);

  const handleSetColor = () => {
    // const hexColor = rgbToHex(color);
    if (!currentColor.current) return;

    const R: number = currentColor.current[0];
    const G: number = currentColor.current[1];
    const B: number = currentColor.current[2];

    const colorHex = rgbToHex(R, G, B);

    setColors({
      RGB: convertColorArrToString(currentColor.current),
      HEX: colorHex,
    });
  };

  const handleMove = useCallback((event: PointerEvent) => {
    if (!ctxRef.current) return;
    const ctx = ctxRef.current;

    let { offsetX, offsetY } = event;

    const [width = 1, height = 1] = size.current || [];

    offsetX *= (canvasRef.current?.width || 1) / width;
    offsetY *= (canvasRef.current?.height || 1) / height;
    ctx.save();

    ctx?.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    if (imageRef.current) {
      drawImage(imageRef.current, ctx);
    }

    currentColor.current = getDataAndDrawPointer(ctx, offsetX, offsetY);
    document.body.style.cursor = 'none';

    ctx.restore();

    ctx.beginPath();
    ctx.rect(
      offsetX - 40,
      offsetY + 50,
      POINTER_RECT_WIDTH,
      POINTER_RECT_HEIGHT,
    );
    ctx.fillStyle = '#fff';
    ctx.strokeStyle = '#c32424';
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = '#c32424';
    ctx.textAlign = 'center';
    ctx.font = '24px';
    if (currentColor.current) {
      const colorHex = invokeRGBNumbersFromArr(currentColor.current);

      ctx.fillText(colorHex, offsetX + 10, offsetY + 63);
    }
  }, []);

  const handleColorPickerBtnClick = () => {
    const ctx = ctxRef.current;
    if (!isColorDropper) {
      ctx?.canvas.addEventListener('pointermove', handleMove);
    }
    setIsColorDropper(true);
  };

  const handlePointerLeave = () => {
    const ctx = ctxRef.current;
    if (isColorDropper) {
      ctx?.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
      if (imageRef.current) {
        drawImage(imageRef.current, ctx);
      }
    }
    document.body.style.cursor = 'default';
  };

  const handleFileInputChange = async (file: File) => {
    if (!file) return;
    const image = new Image();
    image.src = URL.createObjectURL(file);
    await image.decode();
    imageRef.current = image;
    if (imageRef.current) {
      drawImage(imageRef.current, ctxRef.current);
    }
  };

  return (
    <>
      <AppHeader
        colors={colors}
        handleFileInputChange={handleFileInputChange}
        handleColorPickerBtnClick={handleColorPickerBtnClick}
      />
      <AppMain
        ref={canvasRef}
        handlePointerLeave={handlePointerLeave}
        handleSetColor={handleSetColor}
      />
    </>
  );
}

export default AppLayout;
