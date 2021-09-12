export const hasOwnProperty = (obj: unknown, field: string): boolean => {
  return Object.prototype.hasOwnProperty.call(obj, field);
};

export const jsonError = (s: string): { error: string } => ({
  error: s,
});

export const jsonMessage = (s: string): { message: string } => ({
  message: s,
});
