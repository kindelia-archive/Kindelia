// TODO: nominal/tagged types
type Nat = bigint;
type U64 = bigint;

// Types
// -----

// A Kindelia term
type Term =
  | {
    _: "var";
    name: string;
  }
  | {
    _: "let";
    name: string;
    type: Type;
    expr: Term;
    body: Term;
  }
  | {
    _: "call";
    bond: string;
    args: Term[];
  }
  | {
    _: "create";
    ctor: Nat;
    vals: Term[];
  }
  | {
    _: "match";
    name: string;
    data: string;
    cases: Term[];
  }
  | {
    _: "word";
    number: U64;
  }
  | {
    _: "operate";
    op: Operation;
    val0: Term;
    val1: Term;
  }
  | {
    _: "bind";
    name: string;
    expr: Term;
    cont: Term;
  };

// A binary operation on words
type Operation =
  | "add"
  | "sub"
  | "mul"
  | "div"
  | "mod"
  | "or"
  | "and"
  | "xor";

// A type reference
type Type =
  | { _: "word" }
  | {
    _: "data";
    name: string;
  };

// World state
type World = {
  names: Names;
  entries: Map<string, Entry>;
};

type Names = {
  size: Nat;
  numb: Map<string, Nat>;
  name: Map<string, string>;
};

// A global entry
// TODO: add owner to all entries
type Entry =
  | { _: "data"; value: ADT }
  | { _: "bond"; value: Bond };

// A global algebraic datatype (ADT) declaration
type ADT = {
  name: string;
  constructors: Constructor[];
};

// An ADT's constructor
type Constructor = {
  name: string;
  args: Params;
};

// A list of parameters
type Params = [string, Type][];

// A global function
type Bond = {
  name: string;
  owner: string;
  params: Params;
  o_type: Type;
  main: Term;
};

// A Kindelia transaction
type Transaction =
  | { _: "new_adt"; data: ADT }
  | { _: "new_bond"; bond: Bond }
  | { _: "new_eval"; eval: Eval }
  | { _: "new_name"; name: string };

// An evaluation
type Eval = {
  auth: AuthCall | null;
  term: Term;
  type: Type;
};

// An authentication call
type AuthCall = {
  bond: string;
  args: Term[];
};

type Runtime<A> = {
  world: World;
  subst: Map<string, Term>;
  fresh: Nat;
  costs: Nat;
  value: A;
};
