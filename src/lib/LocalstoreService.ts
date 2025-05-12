export type LocalStoreKey = `round-${number}`;

export class LocalStoreService {
  static setImages(key: LocalStoreKey, value: string[]) {
    sessionStorage.setItem(key, JSON.stringify(value));
  }
  static getImages(round: LocalStoreKey) {
    const imagesJSON = sessionStorage.getItem(round);

    if (imagesJSON) {
      return JSON.parse(imagesJSON) as string[];
    }
    return [];
  }
}
