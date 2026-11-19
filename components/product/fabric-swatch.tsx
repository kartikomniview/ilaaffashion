/** CSS variables that tint the `.fabric-*` patterns: ground, motif, and a light tint of the ground. */
export function fabricVars(ground: string, motif: string) {
  return {
    "--c1": ground,
    "--c2": motif,
    "--c3": `color-mix(in srgb, ${ground} 22%, #F8F3EB)`,
  } as const;
}
