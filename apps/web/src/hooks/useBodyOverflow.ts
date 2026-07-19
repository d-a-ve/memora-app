function useBodyOverflow() {
  let body: any;

  if (typeof document !== "undefined") {
    body = document.getElementById("body");
  }

  const hideBodyOveflow = () => {
    if (!body) return;
    body.dataset.pageOverflow = "hidden";
  };

  const resetBodyOverflow = () => {
    if (!body) return;
    body.dataset.pageOverflow = "auto";
  };

  return {
    hideBodyOveflow,
    resetBodyOverflow,
  };
}

export default useBodyOverflow;
