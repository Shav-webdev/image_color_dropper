import {
  POINTER_METRICS_SIZE,
  POINTER_RECT_HEIGHT,
  POINTER_SIZE,
} from './constants.ts';

export const convertColorArrToString = (colorArr: number[]): string => {
  return `rgba(${colorArr})`;
};

export const componentToHex = (c: number) => {
  const hex = c.toString(16);
  return hex.length == 1 ? '0' + hex : hex;
};

export const rgbToHex = (r: number, g: number, b: number): string => {
  return '#' + componentToHex(r) + componentToHex(g) + componentToHex(b);
};

export function invokeRGBNumbersFromArr(arr: number[]) {
  const R: number = arr[0];
  const G: number = arr[1];
  const B: number = arr[2];

  return rgbToHex(R, G, B);
}

export const drawImage = (
  image: HTMLImageElement | null,
  ctx: CanvasRenderingContext2D | null,
) => {
  if (ctx && image) {
    const scale = Math.min(
      (ctx?.canvas.width || 1) / image.width,
      (ctx?.canvas.height || 1) / image.height,
    );
    ctx?.drawImage(
      image,
      0,
      0,
      image.width,
      image.height,
      (ctx.canvas.width - scale * image.width) / 2,
      (ctx.canvas.height - scale * image.height) / 2,
      scale * image.width,
      scale * image.height,
    );
  }
};

export function getChunkItems(data: Uint8ClampedArray) {
  let chunkItem: number[] = [];
  for (let i = 0; i < data.length; i += 4) {
    chunkItem = [data[i], data[i + 1], data[i + 2], data[i + 3]];
  }

  return chunkItem;
}

export const getDataAndDrawPointer = (
  ctx: CanvasRenderingContext2D,
  offsetX: number,
  offsetY: number,
) => {
  const { data } = ctx.getImageData(
    offsetX - POINTER_METRICS_SIZE / 2,
    offsetY - POINTER_METRICS_SIZE / 2,
    POINTER_METRICS_SIZE,
    POINTER_METRICS_SIZE,
  );
  const strokeColor = invokeRGBNumbersFromArr(getChunkItems(data));
  ctx.beginPath();
  ctx.arc(offsetX, offsetY, POINTER_SIZE, 0, 2 * Math.PI);
  ctx.strokeStyle = strokeColor;
  ctx.lineWidth = 10;
  ctx.stroke();
  ctx.clip();

  for (let i = 0; i < data.length; i += 4) {
    const chunkItem: number[] = [
      data[i],
      data[i + 1],
      data[i + 2],
      data[i + 3],
    ];
    const rgbColor = convertColorArrToString(chunkItem);
    ctx.beginPath();
    const itemX =
      offsetX -
      (POINTER_METRICS_SIZE / 2) * POINTER_RECT_HEIGHT +
      Math.floor((i % (POINTER_METRICS_SIZE * 4)) / 4) * POINTER_RECT_HEIGHT;
    const itemY =
      offsetY -
      (POINTER_METRICS_SIZE / 2) * POINTER_RECT_HEIGHT +
      Math.floor(i / (POINTER_METRICS_SIZE * 4)) * POINTER_RECT_HEIGHT;

    ctx.fillStyle = rgbColor;
    ctx.strokeStyle = '#fff';
    ctx.rect(itemX, itemY, POINTER_RECT_HEIGHT, POINTER_RECT_HEIGHT);
    ctx.fill();
    ctx.lineWidth = 0.4;
    ctx.stroke();
  }

  const center = Math.floor(data.length / 8) * 4;
  return [data[center], data[center + 1], data[center + 2], data[center + 3]];
};
