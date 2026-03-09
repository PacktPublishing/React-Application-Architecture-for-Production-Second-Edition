import { uid } from '../uid';

describe('uid', () => {
  it('should generate a string', () => {
    const id = uid();
    expect(typeof id).toBe('string');
  });

  it('should generate unique IDs', () => {
    const ids = new Set(Array.from({ length: 1000 }, () => uid()));
    expect(ids.size).toBe(1000);
  });

  it('should generate IDs with reasonable length', () => {
    const id = uid();
    expect(id.length).toBeGreaterThan(10);
    expect(id.length).toBeLessThan(50);
  });
});
