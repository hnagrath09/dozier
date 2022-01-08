# dozier

## Getting Started

### Project Structure

```
src
  - functions
    - sum.ts
    - diff.ts
  - lib
    - parser.ts
package.json
yarn.lock
```

#### Scripts

```
yarn execute
```

or

```
yarn run ts-node src/lib/parser.ts
```

### Writing functions

```ts
/* functions/search-user-by-email.ts */
export default function sumNumbers(
  /** @dozierParam First Number */
  /** @maxValue 20 */
  /** @minValue 5 */
  x: number,
  /** @dozierParam Second Number */
  /** @maxValue 20 */
  /** @minValue 5 */
  y: number,
): number {
  return x + y
}
```
