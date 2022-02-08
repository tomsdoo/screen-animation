type ColorOptions = {
  saturation?: number,
  lightness?: number
};

export class Rand {
  public static number(underOf: number){
    return Math.floor(Math.random() * underOf);
  }
  public static color(options?: ColorOptions){
    const [
      saturation,
      lightness
    ] = [
      (options && options.saturation || 0.5),
      (options && options.lightness || 0.7)
    ].map(n => n.toLocaleString("en-us", { style: "percent" }));
    return `hsl(${Rand.number(360)}, ${saturation}, ${lightness})`;
  }
  public static choose<T>(parr: T[]){
    return parr[Math.floor(Math.random() * parr.length)];
  }
}
