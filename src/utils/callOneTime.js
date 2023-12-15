function callOneTime(fn) {
  let isCalled = false;
  return function () {
    if (!isCalled) {
      isCalled = true;
      fn();
    }
  };
}
