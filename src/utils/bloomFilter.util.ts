class BloomFilter {
  private size: number;
  private bitArray: number[];
  private hashFunctions: ((item: string) => number)[];

  constructor(size: number, numHashFunctions: number) {
    this.size = size;
    this.bitArray = Array(size).fill(0);
    this.hashFunctions = this.createHashFunctions(numHashFunctions);
  }

  add(item: string): void {
    this.hashFunctions.forEach((hashFunction) => {
      const index = hashFunction(item) % this.size;
      this.bitArray[index] = 1;
    });
  }

  has(item: string): boolean {
    return this.hashFunctions.every((hashFunction) => {
      const index = hashFunction(item) % this.size;
      return this.bitArray[index] === 1;
    });
  }

  private createHashFunctions(numHashFunctions: number): ((item: string) => number)[] {
    const hashFunctions: ((item: string) => number)[] = [];
    for (let i = 0; i < numHashFunctions; i++) {
      hashFunctions.push((item: string) => {
        let hash = 0;
        for (let j = 0; j < item.length; j++) {
          hash = (hash << 5) + item.charCodeAt(j) + i; // Simple hash function
          hash = hash & hash; // 32-bit integer
        }
        return Math.abs(hash);
      });
    }
    return hashFunctions;
  }
}

export default BloomFilter;
