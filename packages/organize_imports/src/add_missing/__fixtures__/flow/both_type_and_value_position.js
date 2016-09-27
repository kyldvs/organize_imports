
// Type position of Foo comes before value position.
function foo(): Foo {
  return new Foo();
}

// Value position of Bar comes before type position.
const theBar = new Bar();
function bar(): Bar {
  return theBar;
}
