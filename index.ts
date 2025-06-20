export function statematch<R>(states: Array<[ () => boolean, () => R ]>, fallback: () => R) {
  for(const [ test, arm ] of states) {
    if(test()) return arm();
  }
  return fallback();
}

export async function asyncmatch<R>(
  states: Array<[ () => Promise<boolean>, () => R ]>,
  fallback: () => R
) {
  for(const [ test, arm ] of states) {
    if(await test()) return arm();
  }
  return fallback();
}
