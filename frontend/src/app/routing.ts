export function routing(path: string) {
  if (location.pathname.includes('camunda/app/cockpit')) {
    location.pathname += path;
    location.reload();
  }

  return path;
}
