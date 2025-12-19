export function getFirebaseFunctionsBaseUrl(functionUrl: string): string {
  if (!functionUrl) {
    return "";
  }

  const url = new URL(functionUrl);
  const segments = url.pathname.split("/").filter(Boolean);

  if (segments.length > 0) {
    segments.pop();
  }

  url.pathname = `/${segments.join("/")}`;
  return url.toString().replace(/\/$/, "");
}

export function buildFirebaseFunctionUrl(functionUrl: string, functionName: string): string {
  const baseUrl = getFirebaseFunctionsBaseUrl(functionUrl);
  if (!baseUrl) {
    return "";
  }
  return `${baseUrl}/${functionName}`;
}
