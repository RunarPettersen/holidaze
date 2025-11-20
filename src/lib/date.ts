export function fmt(dateIso: string) {
  const d = new Date(dateIso);
  return d.toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" });
}
export function isUpcoming(dateIso: string) {
  const today = new Date();
  // sett til 00:00 for “i dag”
  today.setHours(0, 0, 0, 0);
  return new Date(dateIso) >= today;
}

export function isPast(dateIso: string) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return new Date(dateIso) < today;
}

export function overlaps(aFrom: string, aTo: string, bFrom: string, bTo: string) {
  const a1 = new Date(aFrom).getTime();
  const a2 = new Date(aTo).getTime();
  const b1 = new Date(bFrom).getTime();
  const b2 = new Date(bTo).getTime();
  // overlap hvis seneste start < tidligste slutt
  return Math.max(a1, b1) < Math.min(a2, b2);
}