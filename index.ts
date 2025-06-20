type BaseMatchArm<R> = [ () => boolean, () => R ];
type MatchArms<R> = Array<BaseMatchArm<R> | (() => MatchArms<R>)>

export function statematch<R>(states: MatchArms<R>, fallback: () => R) {
  for(const [ test, arm ] of iterate(states)) {
    if(test()) return arm();
  }
  return fallback();
}

function* iterate<R>(m: MatchArms<R>): Generator<BaseMatchArm<R>> {
  for(const state of m) {
    if(typeof state === "function") {
      const result = state();
      for(const base of iterate(result)) {
        yield base;
      }
    }
    else {
      yield state;
    }
  }
}

type AsyncBaseMatchArm<R> = [ () => Promise<boolean>, () => R ];
type AsyncMatchArms<R> = Array<
  AsyncBaseMatchArm<R>
  | (() => Promise<AsyncMatchArms<R>>)
  | (() => AsyncMatchArms<R>)>

export async function asyncmatch<R>(
  states: AsyncMatchArms<R>,
  fallback: () => R
) {
  for await(const [ test, arm ] of asynciterate(states)) {
    if(await test()) return arm();
  }
  return fallback();
}

async function* asynciterate<R>(m: AsyncMatchArms<R>): AsyncGenerator<AsyncBaseMatchArm<R>> {
  for(const state of m) {
    if(typeof state === "function") {
      const result = await Promise.resolve(state());
      for await(const base of asynciterate(result)) {
        yield base;
      }
    }
    else {
      yield state;
    }
  }
}
