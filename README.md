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
  guard(() => false).run(() => "first"),
  guard(() => true).run(() => "second"),
  fallback(() => "fallback"),
]);

expect(value).toBe("second");
```

### Nested blocks

```typescript
const value = statematch([
  guard(() => false).run(() => "first"),
  guard(() => false).run(() => "second"),
  () => [
    guard(() => false).run(() => "third"),
    guard(() => false).run(() => "fourth"),
    () => [
      guard(() => true).run(() => "fifth"),
    ],
  ],
  fallback(() => "fallback"),
]);

expect(value).toBe("fifth");
```

Fallbacks can also be contained inside the nested blocks:

```typescript
const value = statematch([
  guard(() => false).run(() => "first"),
  guard(() => false).run(() => "second"),
  () => [
    guard(() => false).run(() => "third"),
    guard(() => false).run(() => "fourth"),
    () => [
      guard(() => true).run(() => "fifth"),
      fallback(() => "fallback"),
    ],
  ],
]);

expect(value).toBe("fifth");
```


## Async state matching

```typescript
const value = await asyncmatch([
  guard(async () => false).run(async () => "first"),
  guard(async () => true).run(async () => "second"),
  fallback(async () => "fallback"),
]);

expect(value).toBe("second");
```

### Nested blocks

```typescript
const value = await asyncmatch([
  guard(async () => false).run(() => "first"),
  guard(async () => false).run(() => "second"),
  async () => [
    guard(async () => false).run(() => "third"),
    guard(async () => false).run(() => "fourth"),
    async () => [
      guard(async () => true).run(() => "fifth"),
    ],
  ],
  fallback(() => "fallback"),
]);

expect(value).toBe("fifth");
```

Similarly, fallbacks can be contained inside the nested blocks:

```typescript
const value = await asyncmatch([
  guard(async () => false).run(() => "first"),
  guard(async () => false).run(() => "second"),
  async () => [
    guard(async () => false).run(() => "third"),
    guard(async () => false).run(() => "fourth"),
    async () => [
      guard(async () => true).run(() => "fifth"),
      fallback(() => "fallback"),
    ],
  ],
]);

expect(value).toBe("fifth");
```
