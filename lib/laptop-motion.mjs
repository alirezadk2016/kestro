/** Exact critically damped step, with physical stops at the assembly endpoints. */
export function stepAssemblyMotion(position, velocity, target, delta, omega = 2.8) {
  if (delta <= 0) return { position, velocity };
  const displacement = position - target;
  const step = (velocity + omega * displacement) * delta;
  const decay = Math.exp(-omega * delta);
  const next = target + (displacement + step) * decay;
  let speed = (velocity - omega * step) * decay;
  const value = Math.min(1, Math.max(0, next));
  if (value !== next) speed = 0;
  if (Math.abs(value - target) + Math.abs(speed) < 0.00015)
    return { position: target, velocity: 0 };
  return { position: value, velocity: speed };
}
