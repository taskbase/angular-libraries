export function isAncestor(descendant: HTMLElement, potentialAncestor: HTMLElement): boolean {
  if (descendant === potentialAncestor) {
    return true;
  } else {
    const parentNode = descendant.parentNode;
    if (parentNode instanceof HTMLElement) {
      if (parentNode === document.body) {
        return false;
      } else {
        return isAncestor(parentNode, potentialAncestor);
      }
    } else {
      throw new Error(`parent node was not of type HTMLElement, was ${parentNode} instead.`);
    }
  }
}
