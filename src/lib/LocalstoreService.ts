export type LocalStoreKey = `round-${number}`;

export class LocalStoreService {
  static setImages(key: LocalStoreKey, value: string[]) {
    localStorage.setItem(key, JSON.stringify(value));
  }
  static getImages(round: LocalStoreKey) {
    const imagesJSON = localStorage.getItem(round);

    if (imagesJSON) {
      return JSON.parse(imagesJSON) as string[];
    }
    return [];
  }
}
