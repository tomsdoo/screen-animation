export class Tags {
  public static create(
    tagName: string,
    attributes?: object,
    styles?: object
  ){
    const ret = document.createElement(tagName);
    Object.entries(attributes || {})
      .forEach(([ key,value ]) => {
        ret.setAttribute(key, value);
      });
    Object.entries(styles || {})
      .forEach(([ key, value ]) => {
        // @ts-ignore
        ret.style[key] = value;
      });
    return ret;
  }
  public static canvas(attributes?: object, styles?: object){
    return Tags.create("canvas", attributes, styles);
  }
  public static div(attributes?: object, styles?: object){
    return Tags.create("div", attributes, styles);
  }
}
