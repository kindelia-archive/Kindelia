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

Table of Contents
=================

* [Introduction](#introduction)
* [How it works?](#how-it-works)
* [Examples](#examples)
    * [Tokens](#tokens)
    * [Accounts](#accounts)
    * [Transactions](#transactions)
* [How is it so small?](#how-is-it-so-small)
    * [No native accounts](#no-native-accounts)
    * [No native tokens](#no-native-tokens)
    * [A simpler block structure](#a-simpler-block-structure)
    * [A simpler consensus algorithm](#a-simpler-consensus-algorithm)
    * [A simpler virtual machine](#a-simpler-virtual-machine)
* [Specification](#specification)
    * [Types](#types)
      * [Name](#name)
      * [Term](#term)
      * [Operation](#operation)
      * [Type](#type)
      * [Data](#data)
      * [Bond](#bond)
      * [File](#file)
      * [Eval](#eval)
      * [Transaction](#transaction)
      * [Entry](#entry)
      * [World](#world)
    * [Type-Checking](#type-checking)
      * [Var](#var)
      * [Let](#let)
      * [Call](#call)
      * [Create](#create)
      * [Match](#match)
      * [Word](#word)
      * [Compare](#compare)
      * [Operate](#operate)
      * [Set](#set)
      * [Get](#get)
      * [Bind](#bind)
      * [Return](#return)


Introduction
============

Litereum's design and implementation is, essentially, a massive distillation of
Ethereum, taking away all the complex features that are either historical
artifacts or optimizations, and keeping only the bare minimum required to
establish a decentralized computer and smart-contract platform. For comparison,
our reference Python full node requires about **3000 lines of code**, while the
standard Ethereum full node has <TODO>. Thanks to this simplicity:

## 1. Litereum is secure

The less code there is, the smaller the surface for attacks and bugs, and the
cheaper it is to fully audit, making Litereum inherently secure. To further
reinforce this security, its internal scripting language is based on a
low-order, simply-typed calculus that has a measurable cost model (to avoid
spam) and an on-chain type-checker (to prevent reentrancy attacks), making
contracts qualified to formal verification.

## 2. Litereum is apolitical

Ethereum's complexity makes it politically centralized in the hands of the few
developers that fully understand the protocol. While this is fine for most
users, some will avoid investing in networks that are strongly influenced by
private entities. Litereum's simplicity make it trivial for companies and
individuals implement their own full nodes, which, in turn, eliminates the class
of "core developers", making it as politically decentralized as possible.

How it works?
=============

Litereum is, essentially, just a bare-bones functional programming language
running in a peer-to-peer network. Or, in other words, it is a decentralized
read-eval-print loop (REPL). That REPL is split into blocks, which are split
into transactions, which can either declare a new name, a new type, a new
function, or evaluate an expression.

Litereum nodes keep an ever-growing chain of blocks that are submitted by users,
and sequenced via Nakamoto Consensus (proof-of-work). By evaluating each block
in order, a node can compute the final state of the blockchain, which is just
the set of global names, types and bonds defined on these blocks. For example:

```c
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

This is a Litereum block with 3 transactions. The first declares a type called
"Nat", the second declares bond (function) called "double", and the third
evaluates the expression `double(3)` (with natural numbers). The result, `6`,
will be logged for everyone to see. Note that, since Litereum bonds and evals
are type-checked on-chain, it is impossible for this block to output a
non-numeric value. Similarly, cross-bond communication is guaranteed to be type
sound.

Since Litereum's core language is pure, it wouldn't be capable of performing
effectful or stateful operations. That's why it also has a built-in Effect type,
written as `&`, that gives bonds the power to interact with the blockchain
state. The simplest example is a counter:

```c
file inc@count : #word = #0

bond inc(): & #word {
  get x     = count
  set count = +(x, #1)
  return #0
}

eval {
  run inc()
  run inc()
  run inc()
  get x = count
  return x
} : & #word
```

The block above declares:

1. `count`: a file, or mutable term, that stores a number.

2. `inc`: a bond that increments the `count` file when it is called.

The `eval` block increments the counter 3 types, and outputs `3`.

Notice the return type of `inc` is marked with an `&`: that's because it is an
effectiful bond. A functional programmer may be familiar with it, since it works
exactly like Haskell's IO type. The type of `inc`, can be interpreted as `IO
Word64`. The `return` primitive is the monadic pure, and `run` is a short form
of the monadic binder:

```c
run x : #word = inc()
```

Since Litereum blocks are Turing complete, caution is needed to avoid spam
attacks, or even accidental loops, that would overload nodes on the network. As
such, blocks are limited in both space and time by a maximum block size, and a
measure for the cost of computations. Sadly, doing so is extremely tricky in a
functional language, because the cost of a β-reduction [may
vary](https://dl.acm.org/doi/10.5555/645420.652523) depending on how it is
implemented. That is why Litereum's term language is carefully designed to be
strongly confluent. That is, evaluating a term has a clear optimal strategy,
allowing us to design a reasonable cost table for its functional opcodes.

Examples
========

## Tokens

A crypto-currency has 3 components: a token, accounts, and transfers. The token
itself can be implemented as a bond that alters a map of balances:

```c
// The map of CatCoin balances, initially empty
file CatCoin @ balances() : Map = Map.empty

// CatCoin transactions
type CatCoin.Command {
  
  // Mines new tokens
  mint{amount: #word}

  // Sends a token to someone
  send{amount: #word, to: #word}

  (...)
}

// The CatCoin bond
CatCoin(command: CatCoin.Command): #word {
  case command {

    // Mines new tokens
    mint:
      run caller = $get_caller()
      get old_balances = balances
      set balances = Map.set(old_balances, caller, command.amount)
      return #0

    // Sends a token to someone
    send:

      ...

  }
}
```

## Accounts

Similarly, users can create accounts by uploading bonds that they control. For
example:

```c
// The actions that Bob's account can perform
type Bob.Command {

  // Sends cat tokens to someone
  send_cat_tokens{
    amount     : #word
    to_address : #word
    miner_fee  : #word
  }

  ...
}

// The bond representing Bob's account
bond Bob(command: Bob.Command): #word {
  case command : Bob.Command {

    // Sends cat tokens to someone
    send_cat_tokens:

      // Check's Bob's signature
      if ECDSA.check(Bob.hash(command), Bob.address)

        // Pay miner fees
        run CatCoin.send(command.miner_fee, $block_miner)
        
        // Send the money
        run CatCoin.send(command.amount, command.to_address)

        return #0

    (...)
  }
}
```

The bond above can be used by Bob to send cat tokens via ECDSA authentication.
That bond **is** Bob's account. If Bob wished to, he could add more features and
different signature schemes to his account.

This is very flexible and powerful, because it allows users to limit what their
accounts can do, to choose what tokens they'll use to pay miner fees, and to
choose their own authentication methods. While most crypto-currencies would be
destroyed by sufficiently powerful quantum computers, in Litereum, users can
simply opt to use quantum-resistant signatures.

## Transactions

Once we have accounts and a currency, sending a token is simply a matter of
including a signed `eval` script in a block:

```c
eval {
  run Bob(send_cat_tokens{@Alice, 50000, 100, "<Bob's sig>"})
  return #0
} : & #word
```

Bob would write this script, sign it, serialize and send to miners. Miners would
be incentived include it in a block, in order to collect fees. Once mined, this
transaction would call Bob's bond, which would check the signature and call the
CatCoin bond, which would bond would update the balance map to send 50000 cat
tokens to Alice, and 100 cat tokens to the block miner.

How is it so small?
===================

In order to become so minimal, Litereum made several compromises, trading
features, throughput and efficiency for sheer simplicity, security and
stability.  Litereum aims to be boring like Bitcoin, yet expressive like
Ethereum. Below are some, but not all, of the tradeoff it took:

## 1. No native accounts

Ethereum uses ECDSA for message authentication as a hard-coded algorithm that is
part of the protocol. ECDSA is not only complex, but can be broken by quantum
computers. Litereum doesn't have a native account system: users can make
accounts by deploying a contracts that they control using their favorite
signature schemes. This makes Litereum simpler and quantum-resistant.

## 2. No native tokens

Ethereum has a built-in currency, Ether, that is used to pay miner fees.
Litereum has no native currency, but users can make their own tokens via
smart-contracts, and miner fees can be paid in any of these, with no single one
being special. Transactions don't have a gas limit, but blocks do. As such,
users pay whatever they want, and miners select transactions that fit the
block's gas limit while maximizing their profits. This replicates the fee market
as seen on Ethereum, with more payment options and less built-in complexity.

## 3. A simpler block structure

Ethereum block structure is complex due to both optimizations and historical
artifacts, such as logs and patricia-merkle trees. Litereum doesn't have layer 1
throughput as a goal, and it doesn't feature light clients. This allows it to
take a minimalist approach, keeping the blockchain structure as simple as
possible: blocks store the previous block hash, a nonce and a list of
transactions, and nothing more.

## 4. A simpler consensus algorithm

Ethereum aims to migrate to a complex Proof-of-Stake consensus algorithm. This
will bring several benefits, such as lower energy consumption and faster
finality times. It also has neat features such as Ethash, for ASIC-resistance,
and GHOST, for mining efficiency. Litereum drops these features for the sake of
simplicity, featuring just a simple Proof-of-Work onsensus.

## 5. A simpler virtual machine

Instead of a stack-machine with several complex opcodes, Litereum's built-in
scripting language is a minimal calculus with a very minimal set of operations.
Specifically, it has algebraic datatypes (with pattern-matching), 64-bit
integers (with 8 binary operations and a comparison primitive), recursive
functions, and monadic effects. And that's all.


Specification
=============

Litereum's virtual machine is based on a core expression language that is
pure, low-order and functional. It features algebraic datatypes, 64-bit unsigned
integers and effects. It doesn't feature high-order functions. That limitation
is necessary for strong confluence (i.e., to have a cost model that doesn't
depend on the evaluation strategy). It does, though, feature branching (via
pattern-matching) and recursive functions, which make it expressive and Turing
complete.

Types
-----

### Name

A name is a string of 6-bit characters on the following alphabet:

```
A B C D E F G H I J K L M N O P
Q R S T U V W X Y Z a b c d e f
g h i j k l m n o p q r s t u v
w x y z 0 1 2 3 4 5 6 7 8 9 . _ 
```

### Term

An expression, or term. Defined by the following abstract syntax tree:

```
Term ::=
  var     (name : Name)
  let     (name : Name) (type : Type  ) (expr : Term  ) (body : Term)
  call    (bond : Name) (vals : [Term])
  create  (data : Name) (vals : [Term])
  match   (name : Name) (data : Name  ) (cses : [Term])
  compare (val0 : Term) (val1 : Term  ) (iflt : Term  ) (ifeq : Term) (ifgt : Term) 
  operate (oper : Oper) (val0 : Term  ) (val0 : Term  )
  set     (file : Name) (expr : Term  ) (body : Term  )
  get     (name : Name) (file : Name  ) (body : Term  )
  bind    (name : Name) (type : Type  ) (expr : Term  ) (body : Term)
  return  (expr : Term)
```

- `var`: a bound variable.

- `let`: a local assignment expression.

- `call`: a call to an external bond.

- `match`: a pattern-match.

- `compare`: a less-equal-greater comparison of words.

- `operate`: a binary operation on words.

- `set`: effect that writes a file.

- `get`: effect that reads a file.

- `bind`: the monadic bind for the Effect type.

- `return`: the monadic return that wraps a pure value.

### Operation

A binary operation on words.

```
Oper ::=
  add
  sub
  mul
  div
  mod
  or
  and
  xor
```

### Type

A type.

```
Type ::=
  word
  data   (name : Name)
  effect (rety : Type)
```


### Data

A global datatype.

```
Data ::=
  new (name : Name)
      (name : [Ctor])

Ctor ::=
  new (name : String)
      (fnam : [String])
      (ftyp : [Type])
```

### Bond

A global function.

```
Bond ::=
  new (name : String)
      (inam : [String])
      (ityp : [Type])
      (otyp : Type)
      (main : Term)
```

### File

A global file.

```
File ::=
  new (name : String)
      (ownr : [String])
      (type : Type)
      (expr : Term)
```

### Eval

A global evaluation.

```
Eval ::=
  new (term : Term)
      (type : Type)
```

### Transaction

A block transaction.

```
Transaction ::=
  new_name (name : Name)
  new_data (data : Data)
  new_bond (bond : Bond)
  new_eval (eval : Eval)
```

### Entry

A global entry.

```
Entry ::=
  data (value : Data)
  bond (value : Bond)
```

### World

The global state.

```
World ::=
  new (names : [Name])
      (entry : Map<Entry>)
```

Type-Checking
-------------

Litereum terms are statically checked whenever a bond is deployed.

### Var

```
if (name : type) is in context
------------------------------
context |- name : type
```

### Let

```
context             |- expr : A
context, (name : A) |- body : B
--------------------------------------
context |- (let name = expr; body) : B
```

### Call

```
given bond B(x: A, y: B, ...) : T { ... }

context |- x : A
context |- y : B
...
-----------------------------------------
context |- f(x, y, ...) : T
```

### Create

```
given data T { k(x: A, y: B, ...), ... }

context |- x : A
context |- y : B
...
----------------------------------------
context |- k{x, y, ...} : T
```

### Match

```
given data T { k(x: A, y: B, ...), ... }

context                        |- x : T
context, (x : A), (y : B), ... |- r : R
-----------------------------------------
context |- (case x : T { k: r, ... }) : R
```

### Word
    
```
~
---------------------
context |- #n : #word
```

### Compare

```
context |- n : #word
context |- m : #word
context |- l : A
context |- e : A
context |- g : A
-----------------------------------------------------------
context |- (compare n m { _<_: l, _=_: e, _>_: g }) : #word
```

### Operate
  
```
if X is one of: + - * / % | & ^
context |- n : #word
context |- m : #word
-------------------------------
context |- X(n, m) : #word
```

### Set

```
given file a : A

context |- k : A
context |- r : &B
------------------------------
context |- (set a = k; r) : &B
```

### Get

```
given file a : A

context, (x : A) |- r : &B
------------------------------
context |- (get x = a; r) : &B
```

### Bind

```
context          |- e : &A
context, (x : A) |- c : &B
----------------------------------
context |- (run x : A = e; c) : &B
```

### Return

```
context |- t : A
--------------------------
context |- (return t) : &A
```
