```
     _______.___________.    ___   .___________. _______.
    /       |           |   /   \  |           ||   ____|
   |   (----`---|  |----`  /  ^  \ `---|  |----`|  |__
    \   \       |  |      /  /_\  \    |  |     |   __|
.----)   |      |  |     /  _____  \   |  |     |  |____
|_______/       |__|    /__/     \__\  |__|     |_______|

.___  ___.      ___   .___________.  ______..__    __.
|   \/   |     /   \  |           | /      ||  |  |  |
|  \  /  |    /  ^  \ `---|  |----`|  ,----'|  |__|  |
|  |\/|  |   /  /_\  \    |  |     |  |     |   __   |
|  |  |  |  /  _____  \   |  |     |  `----.|  |  |  |
|__|  |__| /__/     \__\  |__|      \______||__|  |__|
```

Functional match-style blocks for recovering Rust programmers.

## Synchronous matching:

```typescript
const value = statematch([
  [() => false, () => "first"],
  [() => true, () => "second"],
], () => "fallback");

expect(value).toBe("second");
```

### Nested blocks

```typescript
const value = statematch([
  [() => false, () => "first"],
  [() => false, () => "second"],
  () => [
    [() => false, () => "third"],
    [() => false, () => "fourth"],
    () => [
      [() => true, () => "fifth"],
    ],
  ],
], () => "fallback");

expect(value).toBe("fifth");
```

## Async state matching

```typescript
const value = await asyncmatch([
  [async () => false, async () => "first"],
  [async () => true, async () => "second"],
], async () => "fallback");

expect(value).toBe("second");
```

### Nested blocks

```typescript
const value = await asyncmatch([
  [async () => false, () => "first"],
  [async () => false, () => "second"],
  async () => [
    [async () => false, () => "third"],
    [async () => false, () => "fourth"],
    async () => [
      [async () => true, () => "fifth"],
    ],
  ],
], () => "fallback");

expect(value).toBe("fifth");
```
