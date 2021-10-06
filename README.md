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

How is it so small?
-------------------

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

### 4. A simpler consensus algorithm

Ethereum aims to migrate to a complex Proof-of-Stake consensus algorithm. This
will bring several benefits, such as lower energy consumption and faster
finality times. It also has neat features such as Ethash, for ASIC-resistance,
and GHOST, for mining efficiency. Litereum drops these features for the sake of
simplicity, featuring just a simple Proof-of-Work onsensus.

### 5. A simpler execution environment

Instead of a stack-machine with several complex opcodes, Litereum's built-in
scripting language is a minimal calculus with a very minimal set of operations.
Specifically, it has algebraic datatypes (with pattern-matching), 64-bit
integers (with 8 binary operations and a comparison), recursive functions, and
one side-effective primitive for persistent state. And that's all.

How it works?
-------------

Litereum is, essentially, just a bare-bones functional programming language
running in a peer-to-peer network. Or, in other words, it is a decentralized
read-print-eval loop (REPL). That REPL is split into blocks, which are split
into transactions, which can either declare a new name, a new type, a new
function, or evaluate an expression.

Litereum nodes keep an ever-growing chain of blocks that are submitted by users,
and sequenced via Nakamoto Consensus (proof-of-work). By evaluating each block
in order, a node can compute the final state of the blockchain, which is just
the of set of global names, types and bonds defined on these blocks.

### Example: a block

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

bond double(x: Nat) : Nat {
  case x : Nat {
    zero: zero{}
    succ: succ{succ{double(x.pred)}}
  }
}

eval {
  double(succ{succ{succ{zero}}})
} : Nat
```

The snippet above is a Litereum block that contains 9 transactions. The first 6
transactions just declare names (more on that later). The next 2 declare a type
called "Nat", and a bond (function) called "double". The last one executes an
expression that computes the double of the natural number 3. In this case, it
does nothing interesting, but arbitrarily useful transactions can be performed
with suitable expressions.

### Example: a stateful bond

Litereum's core language is mostly pure, except for one operation that allows a
bond to rebind another bond that it owns. With that operation, a bond can
maintain a mutable state, allowing it to implement real-world applications. The
simplest stateful bond is a counter:

```
name get_count
name inc_count

bond get_count(): #word {
  #0
} @inc_count

bond inc_count(): #word {
  bind get_count { +(get_count(), #1) }
}

eval { inc_count() }
eval { inc_count() }
eval { inc_count() }
eval { get_count() }
```

The block above declares two bonds: `get_count`, which, when called, returns a
counter, and `inc_count`, which, when called, rebinds the `get_count`
definition, adding `1` to it. The `inc_count` bound can only rebind `get_count`
because it is listed on `get_count`'s owner list (the `@`'s after its
declaration). The last `eval` of this block will output `3`, because `get_count`
was incremented `3` times.

### Example: a monetary transaction

Conventional cryptocurrency transactions do 3 things: verify a signature, pay
miner fees and send tokens to someone. These can be replicated as follows:

```
eval {
  Bob(send_cat_tokens{@Alice, 50000, 100, "<Bob's sig>"})
}
```

The expression above causes Bob to send 50000 cat tokens to alice, leaving 100
cat tokens as miner fees. Bob would send this expression to miners, which would
be incentived include it in a block, in order to collect fees.

### Example: an account

Since there isn't a built-in account system, users must upload bonds that they
control, in order to use these bonds as their accounts. For example:

```
type Bob.Command {
  send_cat_tokens{
    amount     : #word
    to_address : #word
    miner_fee  : #word
  }
  (...)
}

bond Bob(command: Bob.Command): #word {
  case command : Bob.Command {
    send_cat_tokens:
      case ECDSA.check(Bob.hash(command), Bob.address) : Bool {
        true:
          CatCoin.send(command.amount, command.to_address)
          CatCoin.send(command.miner_fee, $block_miner)
        false:
          #0
      }
    (...)
  }
}
```

The bond above can be used by Bob to send cat tokens via ECDSA authentication.
That bond **is** Bob's account. If Bob wished to, he could add more features and
different signature schemes to his account.

This is very flexible and powerful, because it allows users to limit what their
accounts can do, and choose their own authentication methods. While most
crypto-currencies would be destroyed by sufficiently powerful quantum computers,
in Litereum, users can simply opt to use quantum-resistant signatures.

### Example: a currency

In order to implement stateful applications, bonds are granted the power to
redefine (**def**) other static bonds that they own. A currency can, thus, be
implemented by deploying a map of balances that is mutated by its bond.

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
    mint:
      bind CatCoin.balances {
        Map.set(CatCoin.balances(), $caller, command.amount)
      }
      #0
    }
    send:
      (...)
  }
}
```

The block above defines a bond named `CatCoin.balances`, which is just a map of
balances (initially empty), and another bond named `CatCoin`, which is a
function. When `CatCoin` is called with the "mint" command, it redefines the
`CatCoin.balances` bond with the updated balances.

Litereum's Execution Environment
--------------------------------

Litereum's execution environment is based on a core expression language that is
pure, low-order and functional. It features algebraic datatypes and 64-bit
unsigned integers. It doesn't feature high-order functions. That limitation is
necessary for strong confluence (i.e., to have a cost model that doesn't depend
on the evaluation strategy). It does, though, feature branching (via
pattern-matching) and recursive functions, which make it expressive and Turing
complete.

### Expressions

A Litereum expression, or term, is defined by a syntax tree with 8 constructors.
A term can be either:

- A variable, holding its name.

    ```
    var
    - name: String
    ```

- A let-expression, holding the bound name, type, expression and body.

    ```
    let
    - name: String
    - type: Type
    - expr: Term
    - body: Term
    ```

- An external call, holding the called bond name and a list of arguments.

    ```
    call
    - bond: String
    - args: List<Term>
    ```

- A constructor creation, holding its name and fields.

    ```
    create
    - ctor: String
    - vals: List<Term>
    ```

- A pattern-match, holding the name of the matched variable, the name of the matched datatype, and a list of values to be returned on each case.

    ```
    match
    - name: String
    - data: String
    - cses: List<Term>
    ```

- An less-than, equal-to, greater-than comparison, holding the two values to be compared, and the 3 possible branches to be returned.

    ```
    compare
    - val0: Term
    - val1: Term
    - iflt: Term
    - ifeq: Term
    - ifgt: Term
    ```
- A binary operation on words. It can be one of these: `add`, `sub`, `mul`, `div`, `mod`, `or`, `and`, `xor`.

    ```
    operate
    - oper: Operation
    - val0: Term
    - val1: Term
    ```

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
