export class Serial {
  public static number(length: number){
    return [...Array(length).keys()];
  }
  public static char(length: number){
    const codeA = "a".charCodeAt(0);
    return Serial.number(length)
      .map(i => String.fromCharCode(codeA + i % 26));
  }
}
