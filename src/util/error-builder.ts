export function buildError(obj: errorObject): SidelogError {
  return new SidelogError(JSON.stringify(obj));
}

export class SidelogError extends Error { }

interface errorObject {
  message: string;
  developerMessage: string;
  responseCode: number;
}
