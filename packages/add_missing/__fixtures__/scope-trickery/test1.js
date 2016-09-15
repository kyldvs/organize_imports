
function foo() {
  var bar = () => {};
}
bar();

var buz = () => {};
function baz() {
  buz();
}
