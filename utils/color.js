/**
 *
 * @param {Number} H 色相 [0,360)
 * @param {Number} S 饱和度 [0,1]
 * @param {Number} L 亮度 [0,1]
 * @param {Boolean} stringMode 是否返回字符串模式
 */
export const HSLToRGB = (H = 0, S = 0, L = 0, stringMode = false, A = 1) => {
  // 超量处理
  if (H >= 360) {
    H = 359;
  }
  if (H < 0) {
    H = 0;
  }
  if (S > 1) {
    S = 1;
  }
  if (S < 0) {
    S = 0;
  }
  if (L > 1) {
    L = 1;
  }
  if (L < 0) {
    L = 0;
  }
  const C = (1 - Math.abs(2 * L - 1)) * S;
  const X = C * (1 - Math.abs(((H / 60) % 2) - 1));
  const m = L - C / 2;
  const vRGB = [];
  if (H >= 0 && H < 60) {
    vRGB.push(C, X, 0);
  } else if (H >= 60 && H < 120) {
    vRGB.push(X, C, 0);
  } else if (H >= 120 && H < 180) {
    vRGB.push(0, C, X);
  } else if (H >= 180 && H < 240) {
    vRGB.push(0, X, C);
  } else if (H >= 240 && H < 300) {
    vRGB.push(X, 0, C);
  } else if (H >= 300 && H < 360) {
    vRGB.push(C, 0, X);
  }
  const [vR, vG, vB] = vRGB;
  const R = 255 * (vR + m);
  const G = 255 * (vG + m);
  const B = 255 * (vB + m);

  if (stringMode) {
    return `rgba(${R},${G},${B}, ${A})`;
  }

  return {
    R,
    G,
    B,
    A,
  };
};
/**
 * @description rgb转化为hsl
 * @param {Number} R [0,255]
 * @param {Number} G [0,255]
 * @param {Number} B [0,255]
 * @param {Boolean} stringMode 是否返回字符串模式
 */
export const RGBToHSL = (R = 0, G = 0, B = 0, stringMode = false) => {
  const RCopy = R / 255;
  const GCopy = G / 255;
  const BCopy = B / 255;
  const Cmax = Math.max(RCopy, GCopy, BCopy);
  const Cmin = Math.min(RCopy, GCopy, BCopy);
  const V = Cmax - Cmin;

  let H = 0;
  if (V === 0) {
    H = 0;
  } else if (Cmax === RCopy) {
    H = 60 * (((GCopy - BCopy) / V) % 6);
  } else if (Cmax === GCopy) {
    H = 60 * ((BCopy - RCopy) / V + 2);
  } else if (Cmax === BCopy) {
    H = 60 * ((RCopy - GCopy) / V + 4);
  }

  H = Math.floor(backCycle(H, 360));
  const L = numberFixed((Cmax + Cmin) / 2);
  const S = V === 0 ? 0 : numberFixed(V / (1 - Math.abs(2 * L - 1)));

  if (stringMode) {
    return `hsl(${H},${numberFixed(100 * S)}%,${numberFixed(100 * L)}%)`;
  }

  return { H, S, L };
};
/**
 * rgb转成十六进制
 * @param hexcolor
 * @param {Boolean} stringMode 是否返回字符串模式
 */
export const RGBtoHEX = (hexcolor, stringMode = false) => {
  const arr = hexcolor.split(',');
  let replaceRStr = 'rgb(';
  let B = '';
  if (hexcolor.substring(0, 4) === 'rgba') {
    replaceRStr = 'rgba(';
    B = arr[2].trim();
  } else if (hexcolor.substring(0, 3) === 'rgb') {
    B = arr[2].replace(')', '').trim();
  } else {
    return hexcolor;
  }
  const R = arr[0].replace(replaceRStr, '').trim();
  const G = arr[1].trim();
  const A = arr[3] ? arr[3].trim() : 1;
  if (stringMode) {
    const hex = [toHex(R), toHex(G), toHex(B), toHex(A * 255)];
    return `#${hex}`.toUpperCase();
  }
  return {
    R,
    G,
    B,
    A,
  };
};
export const HEXToRGB = (hex) => {
  if (hex.length === 4) {
    hex += hex.substring(1, 4);
  }
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    R: parseInt(result[1], 16),
    G: parseInt(result[2], 16),
    B: parseInt(result[3], 16),
    A: result[4] === undefined ? 1 : parseInt(result[3], 16) / 255,
  } : null;
};
export const toRGB = (hex) => {
  let color = null;
  if (hex.indexOf('#') > -1) {
    color = HEXToRGB(hex);
  } else if (hex.indexOf('rgb') > -1) {
    color = RGBtoHEX(hex);
  }
  if (color) {
    return {
      R: color.R,
      G: color.G,
      B: color.B,
      A: color.A,
    };
  }
  return {
    R: 0,
    G: 0,
    B: 0,
    A: 1,
  };
};
export const getHSL = (hex) => {
  const {
    R,
    G,
    B,
    A,
  } = toRGB(hex);
  const { H, S, L } = RGBToHSL(R, G, B);
  return {
    H,
    S,
    L,
    A,
  };
};
export const isColor = (val) => {
  let flag = false;
  if (val.indexOf('rgb') > -1 || val.indexOf('#') > -1) {
    flag = true;
  }
  return flag;
};
