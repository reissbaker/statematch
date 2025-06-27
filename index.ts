class Fallback<R> {
  constructor(readonly value: R) {}
}
export function fallback<R>(value: () => R) { return () => new Fallback(value()); }

class Guarded<G> {
  constructor(private readonly guard: () => G) {}
  run<R>(arm: () => R): [ () => G, () => R ] {
    return [ this.guard, arm ];
  }
}
export function guard<G>(guardFn: () => G) {
  return new Guarded(guardFn);
}

type BaseMatchArm<R> = [ () => boolean, () => R ];
type MatchArms<R> = Array<BaseMatchArm<R> | (() => MatchArms<R>)>
type WithFinal<R> = [...MatchArms<R>, () => Fallback<R> | WithFinal<R>];

export function statematch<R>(states: WithFinal<R>): R {
  const fallback = states.pop() as () => Fallback<R> | WithFinal<R>;

  for(const [ test, arm ] of iterate(states as MatchArms<R>)) {
    if(test()) return arm();
  }

  const result = fallback();
  if(result instanceof Fallback) return result.value;
  return statematch(result);
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
  ;

type FallbackReturn<R> = (Fallback<R> | AsyncWithFinal<R>)
                       | (Fallback<Promise<R>> | AsyncWithFinal<R>)
                       | (Promise<Fallback<R> | AsyncWithFinal<R>>)
                       | (Promise<Fallback<Promise<R>> | AsyncWithFinal<R>>)
                       ;
type AsyncWithFinal<R> = [ ...AsyncMatchArms<R>, () => FallbackReturn<R> ];

export async function asyncmatch<R>(
  states: AsyncWithFinal<R>,
): Promise<R> {
  const fallback = states.pop() as () => FallbackReturn<R>;

  for await(const [ test, arm ] of asynciterate(states as AsyncMatchArms<R>)) {
    if(await test()) return arm();
  }

  const result = await Promise.resolve(fallback());
  if(result instanceof Fallback) return result.value;
  return asyncmatch(result);
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
