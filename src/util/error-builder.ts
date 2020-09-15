export function buildError(obj: errorObject): string {
  return JSON.stringify(obj);
}

interface errorObject {
  message: string;
  developerMessage: string;
  responseCode: number;
}