Kindelia: a minimal decentralized computer
==========================================

In 2013, the first smart-contract blockchain, Ethereum, was proposed, extending
Bitcoin with a stateful scripting language that allowed arbitrary financial
transactions to be settled without third parties. Notably, Ethereum's built-in
virtual machine made it a general-purpose computer, even though most of the
protocol's complexity was not required to achieve Turing completeness. Kindelia
is a massive simplification of this concept, trading features for raw
simplicity, in order to build a minimal decenralized computer. Since it does not
have a native token, it is not a cryptocurrency itself, but currencies can be
deployed as bonds. In essence, Kindelia is just a peer-to-peer interpreter for a
functional programming language, making it a minimal, token-less decentralized
application platform.

Table of Contents
=================

* [Introduction](#introduction)
* [Why Kindelia?](#why-kindelia)
  * [Simplicity, for political decentralization](#simplicity-for-political-decentralization)
  * [Type theory, for absolute security](#type-theory-for-absolute-security)
* [How it works?](#how-it-works)
  * [Transactions](#transactions)
  * [Statefulness](#statefulness)
  * [Currencies](#currencies)
  * [Accounts](#accounts)
  * [Miner incentives](#miner-incentives)
  * [Space efficiency](#space-efficiency)
  * [Formal Verificatoin](#formal-verification)
  * [The beta reduction problem](#the-beta-reduction-problem)
    * [What is a beta reduction?](#what-is-a-beta-reduction)
    * [Counting beta reductions](#counting-beta-reductions)
    * [Why not just impose an evaluation order?](#why-not-just-impose-an-evaluation-order)
    * [Kindelia's solution](#kindelias-solution)
  * [Type-checking costs](#type-checking-costs)
  * [Consensus](#consensus)
* [Specification](#specification)
  * [Types](#types)
    * [Name](#name)
    * [Term](#term)
    * [Operation](#operation)
    * [Data](#data)
    * [Bond](#bond)
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
    * [Bind](#bind)


Introduction
============

Kindelia is a massive simplification of Ethereum. It takes its most important
aspects and removes all the redundancy. What is left is, essentially, a virtual
computer running in a peer-to-peer network. Kindelia has no native accounts nor
currencies: just pure data and computation. In a way, it can be seen as a
decentralized Turing machine, although we'd rather call it a decentralized
lambda calculus machine. But this isn't correct either, due to the inherent
difficulty in measuring the cost of a beta reduction. Compared to Ethereum,
Kindelia is an alternative that maximizes security, simplicity and
decentralization, but sacrifices throughput, scalability and cutting-edge
features.

Why Kindelia?
=============

There are two main benefits for using Kindelia:

1. The network is extraordinarily simpler.

2. It was built on the foundation of type theory.

### Simplicity, for political decentralization

Ethereum is complex. Kindelia removes the bloat, keeping only the parts
necessary to build a decentralized computer. As the result, **the entire project
is implemented in less than 2000 lines of code, compared to hundreds of
thousands for Ethereum**. While complexity isn't necessarily bad, there is value
in making the protocol so simple: if anyone can easily write a node, then the
class of core developers ceases to be special, eliminating the associated
political power that comes with it.

### Type theory, for absolute security

Kindelia's internal language is founded on type theory. That makes it inherently
secure, for many reasons. For example, cross-contract communication is
well-typed, eliminating, by construction, a wide class of bugs, including
reentrancy attacks. It is also suitable for formal verification, allowing
developers to easily prove theorems about its contracts. Building a network
with these properties is challenging and, while there were attempts, no other
network managed to accomplish this goal properly. We'll elaborate on this later.

How it works?
=============

Kindelia is, essentially, a bare-bones functional programming language running
in a peer-to-peer network. Or, in other words, it is a decentralized
read-eval-print loop, or REPL. That REPL has a global state, which can be
altered by user-submitted transactions. A transaction can either declare a new
name, a new type, a new function, or evaluate an expression.

Transactions
------------

A Kindelia transaction performs one of 4 actions:

1. Declare a new name:

```
name Nat
```

2. Declare a new type:


```c
type Nat {
  zero{}
  succ{pred: Nat}
}
```

3. Declare a new bond:

```c
bond double(x: Nat) : Nat {
  case x : Nat {
    zero: zero{}
    succ: succ{succ{double(x.pred)}}
  }
}
```

4. Evaluate a script:

```c
eval {
  double(succ{succ{succ{zero}}})
} : Nat
```

The transactions above declare type of positive integers, a bond (global
function or value) that doubles an integer, and then evaluate the expression
`double(3)`, which results in `6`. Declaring names is optional, but doing so
will improve the space efficiency of transactions that refer to that name.

Statefulness
------------

Of course, these transactions don't do anything useful: they're just pure
calculations. In order to implement real-world applications, Kindelia needs some
notion of state. For that, it features one, and only one, side-effective
primitive: `bind`. It allows a bond to redefine another bond.

```
bond val(): #word {
  #0
} @inc

bond inc(): #word {
  bind val { #add(val(), #1) }
  val()
}

eval {
  inc()
  inc()
  inc()
  val()
} : #word
```

The transactions above:

1. Declare a global value, `val()`, of type `#word`.

2. Define a function, `inc()`, that increments that value.

3. Evaluate a script that increments `val()` 3 times.

Any transaction that calls `val()` afterwards will get `3`.

Notice how, unlike Ethereum's contracts, Kindelia's bonds don't have an internal
state. Instead, the state of the entire network is just a big map of entries
(types and bonds), and stateful applications just alter that global map. Of
course, in order for that to make sense, bonds must restrict who can overwrite
them.  The `@inc` annotation after the `val()` bond means that `inc` owns it
and, thus, can rebind it. A bond can have multiple owners. A bond with no owner
can't be overwritten and, thus, is an immutable constant.

Currencies
----------

Kindelia has no native currency or token, but, with stateful transactions, these
could be easily created by deploying suitable bonds that keep a set of balances
as their states. Here is a rough example:

```c
bond CatCoin.balances : Map {
  Map@empty{}
} @CatCoin

type CatCoin.Action {
  send{to: User, value: #word}
  ...
}

bond CatCoin(action: CatCoin.Action): #word {
  case cmd {
    send:
      // checks and updates balances
    ...
  }
}
```

Accounts
--------

Ethereum has a built-in account system that allows external users to interact
with contracts via ECDSA authentication. In Kindelia, there is no such system.
Instead, an account is just a bond that receives the user's signature, in any
arbitrary authentication method, and checks if it is correct. That bond can then
be used in an `eval` block to let that block run in behalf of an user.

For example, ECDSA and Lamport signatures could be installed as bonds:

```
bond ECDSA.check(signature: Buffer, message: Buffer) : #word {
  ... ECDSA logic here ...
}

bond Lamport.check(signature: Buffer, message: Buffer) : #word {
  ... Lamport logic here ...
}
```

And then, user accounts could be created as bonds that check a signature:

```
bond MrDog(signature: Buffer) : #word {
  ECDSA.check(signature, $get_code($self))
}

bond PatoHasker(signature: Buffer) : #word {
  Lamport.check(signature, $get_code($self))
}
```

Finally, an user could interact with contracts by using eval-with:

```
eval PatoHasker(0x11112222333344445555....) {
  CatCoin.send({
    to: @MrDog
    amount: #42
  })
} : #word
```

Kindelia would call `PatoHasker()` with its signature and the bytecode of the
eval block. If it returns true, the eval block is executed in PatoHasker's
behalf. If it returns false (which would happen if, for example, someone
modified the `to` or `amount` within the block), then the block wouldn't be
executed.

This is handy for two reasons. First, it allows for anonymous transactions. Not
everything requires authentication, so, being able to call methods without
signatures saves a lot of block spaces. Second, it allows users to chose their
own authentication schemes. It is notable that ECDSA signatures are vulnerable
to quantum attacks. Since every Ethereum account uses ECDSA, the entire network
will collapse irreversibly if a large enough quantum computer is built. In
Kindelia, users can simply opt to use quantum-resistant signature schemes.

Miner incentives
----------------

Since Kindelia has no built-in token, what incentive miners of the underlying
sequencer would have to include a transaction in a block? If the transaction is
an `eval()` block, then an user can just include a payment to the miner on it.
For example, consider the code below:

```
eval Bob(signature) {
  CatCoin.send($block_miner(), 42)
  CatCoin.send(@Alice, 1000)
}
```

It is a transaction signed by Bob that simultaneously sends 1000 cat coin tokens
to Alice, and 42 cat coin tokens to the block miner. As soon as Bob broadcasts
that piece of data to the network, miners will be motivated to include it in a
block in order to collect the $42 fee. This has the added flexibility that users
can pay miners in any token they like.

Note there is no "gasPrice" that automatically converts gas to miner fees.
Instead, users just pay a fixed amount that must be enough to cover the cost of
the transaction. For example, if a transaction takes 500 gas, and a blocks have
a limit of 1000 gas, then that transaction should pay twice as much as a
transaction that takes 250 gas; otherwise, miners will just fill that space with
two 250-gas transactions instead. Clients will adjust fees automatically for
users, and a fee market will emerge naturally, with minimal protocol complexity.

Of course, that only works for `eval` transactions. What about `name`, `type`
and `bond` transactions? To motivate miners to include these, an user must make
a separate `eval` transaction that verifies if certain type or bond exists, and
publish it to the network. For example:

```
bond Bob.Adder(a: #word, b: #word): #word {
  #add(a, b)
}

eval Bob(signature) {
  if Keccak.hash_of(@Bob.Adder) == 0x00112233... then
    CatCoin.send($block_miner(), 42)
  else
    #0
} : #word
```

The first transaction above defines a function called `Bob.Adder`, and the
second evaluates an expression that checks if a `Bob.Adder` function with given
hash exists; if so, it pays the block miner 42 cat coins. As such, as soon as
Bob publishes both transactions, a miner will be motivated to include them in
the same block, since, by doing so, he/she will be paid. This can be used to
incentivize names, types and bonds.

Note, though, that paying isn't required. The block miner can include bonds and
types at will, so, an altruistic miner could install several common types and
functions for everyone to use in order to aggregate value to the network.

Space efficiency
----------------

Kindelia names, types, bonds and evals are serialized to a very efficient binary
format that optimizes block space. For example, the transaction below:

```
type Nat {
  zero{}
  succ{pred: Nat}
}
```

Is serialized to `8752fdad747d56a67cb9d4d97d1d7ae59c73`, which uses only 18
bytes, if no name is declared. If the `Nat`, `zero`, `succ`, `pred` names were
used in a previous block (and that's probably the case, since these are common),
then the serialization of that transaction would be just `47cbbc`; that's
correct, only 3 bytes. To put things in perspective, Bitcoin currently holds an
average of `613 bytes` per transaction. That means an altruistic miner could
deploy 204 types like `Nat` using the same block space of a single Bitcoin
transaction!

But that's not the entire story. Kindelia's purity and compositional nature
means users will be highly encouraged to share code. For example, suppose a
developer deploys a game that features a `dot` product function:

```
bond dot(ax: #word, ay: #word, bx: #word, by: #word): #word {
  #add(#mul(ax, bx), #mul(ay, by))
}

bond FunGame(...) : ... {
  ... dot(...) ...
}
```

Since `dot` is deployed separately, as a pure function, the next developer that
creates a game can, and will, use the same `dot` function in his/her own code.

```
bond AnotherApp(...) : ... {
  ... dot(...) ...
}
```

In a way, every time an user deploys an app, he/she contributes to the pool of
functions available for future users. This contracts with Ethereum, where
contracts are compiled to a code-dispatch table that inlines the contract
methods in its bytecode, making sharing almost non-existent in practice.

Formal verification
-------------------

Smart-contracts, dApps and DeFi are nothing but software that manage real money
autonomously. As such, security should be a major concern, since bugs can cause
catastrophic losses. Sadly, these bugs are extremely common, and are arguably
one of the deterrents for the adoption of crypto-currencies in general.

Ethereum's applications are compiled to run on a stack machine. Stack machines
are great for two reasons: 1. they are simple to understand and implement; 2.
they are efficient and have a clear cost model. Sadly, while it is easy to
understand how these work, reasoning about programs running on them is a
different matter. In special, proving that a procedure will respect some
invariants is extremely difficult. For example, consider the code below:

```solidity
contract Sum {
  function sum(uint x) public pure returns (uint) {
    if (x == 0) {
      return 0;
    } else {
      return x + sum(x - 1);
    }
  }
}
```

Under `Solidity 0.8.7+commit.e28d00a7`, that contract compiles to the following
EVM assembly:

```
PUSH1 0x80 PUSH1 0x40 MSTORE CALLVALUE DUP1 ISZERO
PUSH2 0x10 JUMPI PUSH1 0x0 DUP1 REVERT JUMPDEST
POP PUSH2 0x21C DUP1 PUSH2 0x20 PUSH1 0x0
CODECOPY PUSH1 0x0 RETURN INVALID PUSH1 0x80 PUSH1
0x40 MSTORE CALLVALUE DUP1 ISZERO PUSH2 0x10 JUMPI
PUSH1 0x0 DUP1 REVERT JUMPDEST POP PUSH1 0x4
CALLDATASIZE LT PUSH2 0x2B JUMPI PUSH1 0x0 CALLDATALOAD
PUSH1 0xE0 SHR DUP1 PUSH4 0x188B85B4 EQ PUSH2
0x30 JUMPI JUMPDEST PUSH1 0x0 DUP1 REVERT JUMPDEST
PUSH2 0x4A PUSH1 0x4 DUP1 CALLDATASIZE SUB DUP2
ADD SWAP1 PUSH2 0x45 SWAP2 SWAP1 PUSH2 0xB0
JUMP JUMPDEST PUSH2 0x60 JUMP JUMPDEST PUSH1 0x40
MLOAD PUSH2 0x57 SWAP2 SWAP1 PUSH2 0xEC JUMP
JUMPDEST PUSH1 0x40 MLOAD DUP1 SWAP2 SUB SWAP1
RETURN JUMPDEST PUSH1 0x0 DUP1 DUP3 EQ ISZERO
PUSH2 0x73 JUMPI PUSH1 0x0 SWAP1 POP PUSH2
0x96 JUMP JUMPDEST PUSH2 0x88 PUSH1 0x1 DUP4
PUSH2 0x83 SWAP2 SWAP1 PUSH2 0x15D JUMP JUMPDEST
PUSH2 0x60 JUMP JUMPDEST DUP3 PUSH2 0x93 SWAP2
SWAP1 PUSH2 0x107 JUMP JUMPDEST SWAP1 POP JUMPDEST
SWAP2 SWAP1 POP JUMP JUMPDEST PUSH1 0x0 DUP2
CALLDATALOAD SWAP1 POP PUSH2 0xAA DUP2 PUSH2 0x1CF
JUMP JUMPDEST SWAP3 SWAP2 POP POP JUMP JUMPDEST
PUSH1 0x0 PUSH1 0x20 DUP3 DUP5 SUB SLT
ISZERO PUSH2 0xC6 JUMPI PUSH2 0xC5 PUSH2 0x1CA
JUMP JUMPDEST JUMPDEST PUSH1 0x0 PUSH2 0xD4 DUP5
DUP3 DUP6 ADD PUSH2 0x9B JUMP JUMPDEST SWAP2
POP POP SWAP3 SWAP2 POP POP JUMP JUMPDEST
PUSH2 0xE6 DUP2 PUSH2 0x191 JUMP JUMPDEST DUP3
MSTORE POP POP JUMP JUMPDEST PUSH1 0x0 PUSH1
0x20 DUP3 ADD SWAP1 POP PUSH2 0x101 PUSH1
0x0 DUP4 ADD DUP5 PUSH2 0xDD JUMP JUMPDEST
SWAP3 SWAP2 POP POP JUMP JUMPDEST PUSH1 0x0
PUSH2 0x112 DUP3 PUSH2 0x191 JUMP JUMPDEST SWAP2
POP PUSH2 0x11D DUP4 PUSH2 0x191 JUMP JUMPDEST
SWAP3 POP DUP3 PUSH32 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF SUB DUP3 GT
ISZERO PUSH2 0x152 JUMPI PUSH2 0x151 PUSH2 0x19B
JUMP JUMPDEST JUMPDEST DUP3 DUP3 ADD SWAP1 POP
SWAP3 SWAP2 POP POP JUMP JUMPDEST PUSH1 0x0
PUSH2 0x168 DUP3 PUSH2 0x191 JUMP JUMPDEST SWAP2
POP PUSH2 0x173 DUP4 PUSH2 0x191 JUMP JUMPDEST
SWAP3 POP DUP3 DUP3 LT ISZERO PUSH2 0x186
JUMPI PUSH2 0x185 PUSH2 0x19B JUMP JUMPDEST JUMPDEST
DUP3 DUP3 SUB SWAP1 POP SWAP3 SWAP2 POP
POP JUMP JUMPDEST PUSH1 0x0 DUP2 SWAP1 POP
SWAP2 SWAP1 POP JUMP JUMPDEST PUSH32 0x4E487B7100000000000000000000000000000000000000000000000000000000 PUSH1
0x0 MSTORE PUSH1 0x11 PUSH1 0x4 MSTORE PUSH1
0x24 PUSH1 0x0 REVERT JUMPDEST PUSH1 0x0 DUP1
REVERT JUMPDEST PUSH2 0x1D8 DUP2 PUSH2 0x191 JUMP
JUMPDEST DUP2 EQ PUSH2 0x1E3 JUMPI PUSH1 0x0
DUP1 REVERT JUMPDEST POP JUMP INVALID LOG2 PUSH5
0x6970667358 0x22 SLT KECCAK256 0x1E 0xD6 DUP12 0x24
BASEFEE PUSH9 0x1053C5ACFF39597C74 MSIZE SWAP3 CALLDATACOPY SWAP6 PUSH9
0x8E2E0C1D58183BE1A6 0xCE LOG2 0xAA PUSH5 0x736F6C6343 STOP ADDMOD
SMOD STOP CALLER
```

If looking at that code and identifying where the "sum" function even begins,
imagine proving a mathematical theorem about its execution. It would be almost
impossible. A saner approach would be to implement a program in a higher level
language, prove theorems under that language, and, finally, compile it to the
EVM. This raises two problems:

1. Proving that the compiler is correct, which is very hard

2. Calling external contracts still invalidates proofs

For example, consider the following contract:

```
public function pay_bob() {
  bool x = some_contract();
  if (or(not(x),x)) {
    send(Bob, 10);
  } else {
    launch_nukes();
  }
}
```

From the code above, is easy to prove that Bob will always be paid, and that
nukes will never launched. After all, no matter the value of `x`, the expression
`or(not(x),x)` will always evaluate to `true` (try it!).

The problem is, even if you prove that mathematically, that still wouldn't mean
that nukes would never be launched, for two reasons. First, Solidity could have
bugs; i.e., even if the proof holds under Solidity's semantics, it could not
hold for the compiled bytecode it produces. But even if Solidity was fine, nukes
could still be launched if the external `some_contract()` call returned, say,
`7`. Yes, that's not a bool, but the EVM doesn't check that. As far as it is
concerned, bools are just 256-bit integers, so that situation could happen,
beating the proof's original assumptions and leading to "impossible" states.

Kindelia programs aren't compiled to any kind of assembly. Instead, they're
represented as expressions on-chain. For example, the following program:

```
bond pay_bob(x: #word) : #word {
  let x : Bool = some_contract()
  case or(not(x),x) {
    true:
      send(@Bob, 10)
    false:
      launch_nukes()
  }
}
```

Is stored, in memory, as an expression that represents the syntax tree above,
exactly as written. Because of that, if you write a valid proof for the program
above, then that proof would also be valid for the program that runs on-chain,
because they're the same program! There is no compiled assembly involved.

Of course, the external bond, `some_contract()`, could still return a
non-boolean value. That is why Kindelia has an on-chain type-checker that
verifies every `bond` and `eval` that is deployed. This ensures that
`some_contract()` always returns a bool, and, in general, that cross-contract
communication is sound.

Now, one might ask: wouldn't a functional interpreter, plus an on-chain
type-checker, be prohibitely expensive to run in a peer-to-peer computer? The
answer is: no! As long as caution is taken when designing the language. To
understand why, let's talk about beta reduction.

The beta reduction problem
--------------------------

The ideas above describe an interesting programming language, but that alone
isn't sufficient to create an operational decentralized computer. We also need a
way to measure the usage of resources. Otherwise, an attacker could easily
submit an `eval` transaction with a very expensive computation that would crash
the entire network.

In Ethereum, this problem is solved by assigning a `gas` cost to each primitive
operation. Transactions that consume too much gas are stopped. In Kindelia, we
also use gas costs, but, since our language follows a different paradigm -
functional instead of a stack machine - a big challenge emerges: how do we
measure the cost of beta reduction?

### What is a beta reduction?

Beta reduction is just a jargon for function application. It is a big deal,
because it is the fundamental primitive behind functional languages. For
example, consider the Python program below:

```python
def f(x):
  return [x, x]

print(f(42))
```

To evaluate it, the `f` function must be applied to the number `42`. In order to
do that, the interpreter replaces every occurrence of the variable `x` in the
body of `f` by the argument `42`, resulting in `[42,42]`. That operation is the
beta reduction.


### Counting beta reductions

To include functions in Kindelia, we need to assign a cost to beta reduction.
That sounds like an easy task, but there is a problem: how do we count how many
beta reductions an expression takes? For example, consider the following Python
functions:


```python
def inc(x):
    return x + 1

def dup(x):
    return [x, x]

def app(f):
    return f(inc)
```

Let's try to count the beta reductions required to run the following expression:
`two(inc(0))`. If we reduce arguments before applying a function, we get:

```python
two(inc(0)) # count = 0
two(1)      # count = 1
[1, 1]      # count = 2
```

So, we need 2 beta reductions, right? But what if we decided to apply `two`
before `inc`, instead of the other way around? Then we'd get: 

```python
two(inc(0))      # count = 0
[inc(0), inc(0)] # count = 1           
[1, inc(0)]      # count = 2
[1, 1]           # count = 3
```

Now we needed 3 beta reductions! The count depends on the order of evaluation.
If we evaluate arguments before applying functions, we get a count. If we apply
functions before evaluating arguments, we get a different count. So, which one
is right?

Initially, one might be tempted to just impose that arguments must be evaluated
before functions are applied, and that the count should be based on that
evaluation order. After all, that is how most languages work, and seems to be
more efficient. But consider the following expression:

```python
app(lambda y: dup(y(0)))
```

If we use that imposed order, we get:

```python
app(lambda y: dup(y(0)))      # count = 0
app(lambda y: [y(0), y(0)])   # count = 1
(lambda y: [y(0), y(0)])(inc) # count = 2
[inc(0), inc(0)]              # count = 3
[inc(0), 1]                   # count = 4
[1, 1]                        # count = 5
```

But if we use a mixed strategy, we get:

```python
app(lambda y: dup(y(0)))   # count = 0
(lambda y: dup(y(0)))(inc) # count = 1
dup(inc(0))                # count = 2
dup(1)                     # count = 3
[1, 1]                     # count = 4
```

In this case, the strategy we imposed is less efficient than this alternative.
Now, one might complain that we reduced inside lambdas. That's not how most
languages work. Usually, eager languages do reduce arguments first, but don't
reduce inside lambdas. So, what about that evaluation order? Is it optimal?
Sadly, no. Here is a counter-example:

```python
two(lambda x: inc(0))
```

If we evaluate that expression the exact way Python does it, we get:

```python
two(lambda x: inc(0))                          # count = 0
[(lambda x: inc(0))(0), (lambda x: inc(0))(0)] # count = 1
[inc(0), (lambda x: inc(0))(0)]                # count = 2
[inc(0), inc(0)]                               # count = 3
[1, inc(0)]                                    # count = 4
[1, 1]                                         # count = 5
```

If we use a mixed strategy, we could get:

```python
two(lambda x: inc(0))                # count = 0
two(lambda x: 1)                     # count = 1
[(lambda x: 1)(0), (lambda x: 1)(0)] # count = 2
[(lambda x: 1)(0), 1]                # count = 3
[1, 1]                               # count = 4
```

Which, again, uses less beta reductions. The underlying issue is that, for any
reduction strategy you choose, there will be some other reduction strategy that
is better in some cases. There is no optimal choice!

### Why not just impose an evaluation order?

But why is that an issue? As long as nodes agree to use the same strategy, they
should get the same count, even if isn't the best one, right? Sure, but miners
would not agree with a single strategy. To understand why, imagine what would
happen if the network imposed the Python reduction order.

Initially, all would be fine. Miners would evaluate arguments first, and
everyone would agree about the costs. Problem is, eventually, a miner would
realize he/she is able to validate blocks faster by using a different strategy,
so he/she will update his/her node to use it. If the network charges 1000 beta
reductions for certain evaluation, but that miner is able to evaluate it using
only 50, then he/she is having a massive computational advantage over everyone
else. That is good for the miner, but bad for the network.

So, why can't everyone else just update their nodes to use the alternate
strategy, too? They could, but, in that case, the entire network would be
operating under a new strategy, which would be better in some cases, but worse
in others. Eventually, the cost model would have no relationship with the actual
computational cost of the transactions, and that is terrible.

In short, it is not possible to measure the cost of evaluating a functional
program in a decentralized network, and any attempt to do so will, over time, be
no more accurate than just throwing dices. The only way to avoid this dance is
to ship every one with an optimal evaluation strategy to begin with, but, other
than subset restricteds of the lambda calculus, such a thing doesn't exist! Any
decentralized computer that claims to feature lambdas must either provide a
solution to the optimal evaluation of functional programs, or deal with all
sorts of overpriced, or underpriced, opcode spam attacks.

### Kindelia's solution

So, how does Kindelia solve this problem?

It doesn't. And it is important to stress that. Kindelia aims to be as
functional as possible, while still being robust against spam. As such, it
completely gives up on high-order functions. Note that Kindelia still feature
datatypes, pattern-matching, global functions and recursion. Overall, this
design makes it as efficient and predictable as a stack machine, while still
retaining most of the benefits of a functional language. 

Note that we could actually feature high order functions, with some caution. For
example, if functions could only be used linearly, or, even better, if they
could be duplicated, but under the constraints of elementary affine logic, then
it would still be possible to provide optimal evaluators for Kindelia. For the
sake of simplicity, though, we just exclude high-order functions entirely, as
these checks would greatly complicate the full node implementation.

Type-checking costs
-------------------

Finally, on-chain type-checking also demands some special attention. Kindelia
type-checks every new bond or eval transaction. As such, we specifically aim
that the complexity of type-checking remains linear in terms of the transaction
size.  Because of that, dependent types are obviously not viable, since these
rely heavily on high order functions. What about polymorphic types, though?
These could indeed be implemented without making the network vulnerable to spam,
but we also avoid them, for the sake of simplicity.

Kindelia only has only two kinds: words (64-bit unsigned integers) and
user-defined datatypes. Since it is a simply-typed language, type-checking can
be done by a single pass through the term's syntax tree, and type equality can
be done by a single id comparison. That makes its type-checker as efficient as
one could possibly be. Measuring the cost of type-checking isn't necessary,
because it is bounded by the inherent block size limit.

Consensus
---------

Kindelia doesn't have a built-in consensus algorithm: it is just a pure function
that receives a sequence of transactions and computes a final state. As such, it
relies on external networks to act as the sequencer. Kindelia's mainnet relies
on Ubilog, a data-only peer-to-peer sequencer, but any sequencer could be used.
For example, Kindelia-Ethereum and Kindelia-Bitcoin both exist, as separate
logical networks.

Specification
=============

In this section, we will provide a complete specification of Kindelia.

Kindelia's virtual machine is based on a core expression language that is pure,
low-order and functional. It features algebraic datatypes, 64-bit unsigned
integers and a single effect, but no high-order functions. 

In a way, Kindelia can be viewed as a pure `List<Transaction> -> Kindelia.State`
function, which folds over a list of buffers, interprets these as Kindelia
transactions, and computes a final state. Kindelia's state is just a map of
entries (types, bonds and evals), plus a map of registered names.

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
  call    (bond : Name) (args : [Term])
  let     (name : Name) (type : Type  ) (expr : Term  ) (body : Term)
  create  (data : Name) (vals : [Term])
  match   (name : Name) (data : Name  ) (cses : [Term])
  word    (numb : U64)
  compare (val0 : Term) (val1 : Term  ) (iflt : Term  ) (ifeq : Term) (ifgt : Term) 
  operate (oper : Oper) (val0 : Term  ) (val0 : Term  )
  bind    (file : Name) (expr : Term  ) (cont : Term  )
```

- `var`: a bound variable.

- `let`: a local assignment expression.

- `call`: a call to an external bond.

- `word`: a 64-bit unsigned integer.

- `match`: a pattern-match.

- `compare`: a less-equal-greater comparison of words.

- `operate`: a binary operation on words.

- `bind`: overwrites a global value.

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
      (ownr : [String])
      (args : [(String,Type)])
      (otyp : Type)
      (main : Term)
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
  new_type (type : Type)
  new_bond (bond : Bond)
  new_eval (eval : Eval)
```

### Entry

A global entry.

```
Entry ::=
  type (value : Type)
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

Kindelia terms are statically checked whenever a bond is deployed.

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
F in {add, sub, mul, div, mod, or, and, xor}
context |- n : #word
context |- m : #word
-------------------------------
context |- #F(n, m) : #word
```

### Bind

```
given bond a : A

context |- k : A
context |- r : B
------------------------------
context |- (set a = k; r) : B
```
