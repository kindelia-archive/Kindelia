Litereum: a minimal decentralized computer
==========================================

In 2013, the first smart-contract blockchain, Ethereum, was proposed, extending
Bitcoin with a stateful scripting language that allowed arbitrary financial
transactions to be settled without third parties. Notably, Ethereum's built-in
virtual machine made it a general-purpose computer, even though most of the
protocol's complexity was not required to achieve Turing completeness. Litereum
is a massive simplification of this concept, trading features for raw
simplicity. Since it does not have a native token, it is not a cryptocurrency
itself, but currencies can be created as smart-contracts. In essence, Litereum
is a peer-to-peer read-eval-print loop (REPL), making it a minimal decentralized
computer, and a politically neutral decentralized application platform.

Introduction
------------

Litereum's design and implementation is, essentially, a massively distillation
of Ethereum, taking away all the complex features that are either historical
artifacts or optimizations, and keeping only the bare minimum required to
establish a decentralized computer and smart-contract platform. For comparison,
our reference Python full node requires about **3000 lines of code**, while the
standard Ethereum full node has <TODO>. Thanks to this simplicity:

#### 1. Litereum is secure

The less code there is, the smaller the surface for attacks and bugs, and the
cheaper it is to fully audit, making Litereum inherently secure. To further
reinforce this security, its internal scripting language is based on a
low-order, simply-typed calculus that has a measurable cost model (to avoid
spam) and an on-chain type-checker (to prevent reentrancy attacks), making
contracts qualified to formal verification.

#### 2. Litereum is apolitical

Ethereum's complexity makes it politically centralized in the hands of the few
developers that fully understand the protocol. While this is fine for most
users, some will avoid investing in networks that are strongly influenced by
private entities. Litereum's simplicity make it trivial for companies and
individuals implement their own full nodes, which, in turn, eliminates the class
of "core developers", making it as politically decentralized as possible.

How is that possible?
---------------------

In order to become so minimal, Litereum made several compromises, trading
features, throughput and efficiency for sheer simplicity, security and
stability.  Litereum aims to be boring like Bitcoin, yet expressive like
Ethereum. Below are some, but not all, of the tradeoff it took:

### 1. No native accounts

Ethereum uses ECDSA for message authentication as a hard-coded algorithm that is
part of the protocol. ECDSA is not only complex, but can be broken by quantum
computers. Litereum doesn't have a native account system: users can make
accounts by deploying a contracts that they control using their favorite
signature schemes. This makes Litereum simpler and quantum-resistant.

### 2. No native currencies

Ethereum has a built-in currency, Ether, that is used to pay miner fees.
Litereum has no native currency, but users can make their own tokens via
smart-contracts, and miner fees can be paid in any of these, with no single one
being special. Transactions don't have a gas limit, but blocks do. As such,
users pay whatever they want, and miners select transactions that fit the
block's gas limit while maximizing their profits. This replicates the fee market
as seen on Ethereum, with more payment options and less built-in complexity.

### 3. A simpler block structure

Ethereum block structure is complex due to both optimizations and historical
artifacts, such as logs and patricia-merkle trees. Litereum doesn't have layer 1
throughput as a goal, and it doesn't feature light clients. This allows it to
take a minimalist approach, keeping the blockchain structure as simple as
possible: blocks store the previous block hash, a nonce and a list of
transactions, and nothing more.

### 4. A simple concensus algorithm

Ethereum aims to migrate to a complex Proof-of-Stake consensus algorithm. This
will bring several benefits, such as lower energy consumption and faster
finality times. It also has neat features such as Ethash, for ASIC-resistance,
and GHOST, for mining efficiency. Litereum drops these features for the sake of
simplicity, featuring just a simple Proof-of-Work onsensus.

How it works?
-------------

Litereum is, essentially, just a bare-bones functional programming language
running in a peer-to-peer network. Or, in other words, it is a decentralized
read-print-eval loop (REPL). That REPL is split into blocks, which are split
into transactions, which can either declare a new name, a new type, a new
function, or execute a script. For example:

```
name Nat
name succ
name zero
name double
name pred
name x

type Nat {
  zero{}
  succ{pred: Nat}
}

bond double(x: Nat) : Nat
  case x : Nat {
    zero: zero{}
    succ: succ{succ{double(x.pred)}}
  }

eval {
  double(succ{succ{succ{zero}}})
} : Nat
```

The snippet above is a Litereum block that contains 9 transactions. The first 6
transactions just declare names (more on that later). The next 2 declare a type
called "Nat", and a bond (function) called "double". The last one executes an
script that computes the double of the natural number 3. In this case, it does
nothing interesting, but it could do anything. For example:

```
eval {
  Bob(send_cat_tokens{$block_miner, 100, "<mike's sig>"})
  Bob(send_cat_tokens{@Alice, 50000, "<mike's sig>"})
  return #0
}
```

The script above causes Bob to pay 100 cat tokens in miner fees, to send 50000
cat tokens to Alice.

Note that there isn't a built-in currency nor account system. Instead, here, Bob
is any hypothetical bond (function) that can only be called by Bob. That bond
defines what Bob can do. For example:


```
bond Bob(command: Bob.Command): #word {
  case command : Bob.Command {
    send_cat_tokens:
      if ECDSA.check(Bob.hash(command), Bob.address) then {
        CatCoin.send(command.amount, command.to)
        return #0
      } else {
        return #0
      }
    ...
  }
}
```

The bond above allows Bob to send cat tokens based on ECDSA authentication. In
other words, the Bob bond is like a smart-contract that only Bob controls, so,
for all intents and purposes, that bond is Bob's account.

Litereum nodes keep an ever-growing chain of blocks that are submitted by users,
and sequenced via Nakamoto Consensus (proof-of-work). By evaluating each block
in order, a node can compute the final state of the blockchain. That state is
just the set of global names, types and bonds currently defined.

In order to implement stateful applications, bonds are granted the power to
redefine (**def**) other static bonds that they own. A currency can, thus, be
implemented by creating a map of balances and a bond that controls it. For
example:

```
type CatCoin.Command {
  mint{amount: #word}
  send{amount: #word, to: #word}
}

bond CatCoin.balances() : Map {
  Map.empty
} @CatCoin

CatCoin(command: CatCoin.Command): #word {
  case command {
    mint: {
      def @CatCoin.balances = Map.set(CatCoin.balances(), caller, command.amount)
      return #0
    }
    send:
      (...)
  }
}
```

The block above defines a bond named `CatCoin.balances`, which is just a map of
balances (initially empty), and another bond named `CatCoin`, which is a
function. When `CatCoin` is called with the "mint" command, it redefines the
`CatCoin.balances` bond to include the updated balance.

Litereum's simplicity doesn't make it powerless. Arbitrarily complex currencies,
tokens, contracts and applications can be created with the few primitives it
has.

Litereum's Execution Environment
--------------------------------

Litereum's execution environment is based on a core term language that is pure,
low-order and functional. It features native algebraic datatypes and 64-bit
unsigned integers. That language, while functional, doesn't feature lambdas nor
high-order functions. Unfortunatelly, that is necessary to allow it to have a
well-defined gas cost model that isn't susceptible to spam attacks (more on that
later). It does, though, feature branching (via pattern-matching) and global
recursive functions, which make it expressive and Turing-complete.

### Terms

Litereum's core AST has 8 constructors:

In other words, a Litereum term can be one of these:

    name: String
  )
  // Call external function
  call(
    bond: String
    args: List<Litereum.Term>
  )
  // Binds a variable
  let(
    name: String
    type: Litereum.Type
    expr: Litereum.Term
    body: Litereum.Term
  )
  // Creates a value
  create(
    ctor: String
    vals: List<Litereum.Term>
  )
  // Pattern-matches a value
  match(
    name: String
    data: String
    cses: List<Litereum.Term>
  )
  // Creates a new 64-bit word
  word(
    numb: U64
  )
  // Compares two words
  compare(
    val0: Litereum.Term
    val1: Litereum.Term
    iflt: Litereum.Term
    ifeq: Litereum.Term
    ifgt: Litereum.Term
  )
  // Binary operation on words
  operate(
    oper: Litereum.Operation
    val0: Litereum.Term
    val1: Litereum.Term
  )
}
```



- `var(name: String)`

    A variable, holding its name.

- `let(name: String, type: Type, expr: Term, body: Term)`

    A let-expression, holding the bound name, type, expression and body.

- `call(bond: String, args: List<Term>)`

    An external call, holding the called bond name and a list of arguments.

- `create(ctor: String, vals: List<Term>)`

    A constructor creation, holding its name and fields.

- `match(name: String, data: String, cses: List<Term>)`

    A pattern-match, holding the name of the matched variable, the name of the matched datatype, and a list of values to be returned on each case.

- `compare(val0: Term, val1: Term, iflt: Term, ifeq: Term, ifgt: Term)`

    An less-than, equal-to, greater-than comparison, holding the two values to be compared, and the 3 possible branches to be returned.

- `operate(oper: Operation, val0: Term, val1: Term)`

    A binary operation on words. It can be one of these: `add`, `sub`, `mul`, `div`, `mod`, `or`, `and`, `xor`.

Unlike the lambda calculus, which fails to have a well-defined cost model, the
cost of computing a Litereum term can be measured in a way that is consistent
across any evaluation strategy; it is strongly confluent. This is essential to
avoid spam. The evaluation and type-checking rules will be detailed below.

(...)

### Bonds

A Litereum bond is a global function that (...)

### Data

A Litereum data is a global algebraic datatype definition that (...)

### Names

Other than bonds and datatypes, Litereum's global state also holds a map of
registered names that is used for (...)

### Type-checking

Unlike most smart-contract networks, Litereum bonds are type-checked statically.
This is necessary to let cross-bond communication be sound; otherwise, it would
be impossible to prove theorems about the execution of a bond that calls another
bond (there would be no guarantees about the values returned). This would be
similar to the reentrancy attacks that exist in Ethereum.

Since type-checkers are slow, including one without caution could easily lead to
spam vectors. This is why Litereum's core language doesn't feature dependent or
polymorphic types. By keeping types simple, we're able to design an efficient,
linear-time type-checker that doesn't need to be measured for gas costs.

(...)
