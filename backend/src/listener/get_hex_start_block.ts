export function getHexStringFromBlock(block: number, length?: number): string {
  let hexStr = block.toString(16);
  if (length) {
    hexStr = hexStr.padStart(length, "0");
  }
  hexStr = "0x" + hexStr;
  hexStr = hexStr.toLocaleLowerCase();
  return hexStr;
}
