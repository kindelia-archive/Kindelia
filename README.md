Kindelia: a minimal decentralized computer
==========================================

In 2013, the first smart-contract blockchain, Ethereum, was proposed, extending
Bitcoin with a stateful scripting language that allowed arbitrary financial
transactions to be settled without third parties. Notably, Ethereum's built-in
virtual machine made it a general-purpose computer, even though most of the
protocol's complexity was not required to achieve Turing completeness. Kindelia
is a massive simplification of this concept, trading features for raw
simplicity. Since it does not have a native token, it is not a cryptocurrency
itself, but currencies can be created as smart-contracts. In essence, Kindelia
is a peer-to-peer read-eval-print loop (REPL), making it a minimal decentralized
computer, and a politically neutral decentralized application platform.

Table of Contents
=================

* [Introduction](#introduction)
* [Why Kindelia?](#why-kindelia)
* [How it works?](#how-it-works)
* [The beta reduction problem](#the-beta-reduction-problem)
* [Specification](#specification)


Introduction
============

First of all, welcome, and don't worry: you will understand this paper. We
strongly believe in accessible communication, and will put work into making this
document readable and jargon-free, while still letting it be a proper
specification of the network. This is specially important for Kindelia, due to
its most foundamental philosophy: anyone should be able to understand the
protocol. This allows Kindelia to abolish the last piece of trust that most
decentralized projects still face: the trust on its developers.

Kindelia is, essentially, a massive simplification of Ethereum. It takes its
most important aspects and removes all the redundancy. What is left is,
essentially, a virtual computer running in a peer-to-peer network. Kindelia has
no native accounts, currencies. It is just data and computation. In a way,
Kindelia can be seen as a decentralized Turing machine, although we'd rather
call it a decentralized Lambda Calculus interpreter... but this isn't right
either, due to the inherent difficulty in measuring the cost of a beta
reduction. Wait, we're getting too technical, aren't we? Don't worry; keep
reading and we'll make it clear.

Why Kindelia?
=============

There are two main benefits of using Kindelia, compared to Ethereum, or similar
networks: security and transparency. Kindelia has both, for two reasons:

1. The network is extraordinarily simpler.

2. It was built on the grounds of type theory.

Ethereum has a never-ending list of built-in features that make it complex.
Kindelia removes most of that, keeping only the necessary. For example, Kindelia
doesn't have a built-in account system, and not even a native currency: these
are deployed as libraries instead. Kindelia's block struture is much cleaner:
features such as merkle-patricia trees, logs, bloom filters absent. Its
scripting language has way less native opcodes.

But what is wrong with complexity? For most common users, honestly, nothing.
But if you're a big company or government interested in crypto, or just someone
who would never risk your money in a network that could be hiding some
catastrophic bug or malicious exploit, then you should be able to audit the
network and assert it is clean independently, without trusting anyone you don't
know. Doing so in Ethereum is almost impossible. Kindelia makes it trivial.

Moreover, Kindelia's scripting language is designed with a type theoretical
philosophy. That makes it inherently more secure, for multiple reasons. For
example, cross-contract communication is well-typed, eliminating a wide class of
bugs; notably, reentrancy attacks are impossible by construction. Moreover, it
is suitable for formal verification, allowing developers to easily prove
theorems about its contracts. Building a network with these properties is
challenging and, while there were attempts, no other network managed to
accomplish this goal properly. We'll elaborate on this point later.

How it works?
=============

Kindelia is, essentially, just a bare-bones functional programming language
running in a peer-to-peer network. Or, in other words, it is a decentralized
read-eval-print loop (REPL). That REPL has a state, which can be altered by
user-submitted transactions. A transaction can either declare a new name, a new
type, a new function, or evaluate an expression.

Kindelia doesn't have a built-in consensus algorithm. Instead, it is just a pure
function that interprets a sequence of user-submitted messages as transactions,
in order to compute a final state. In other words, Kindelia is just a pure
`List<Buffer> -> Kindelia.State` function. As such, in order to operate, it
depends on an external network capable of receiving and sequencing transactions.
Its main network uses Ubilog, a data-only peer-to-peer sequencer, but any
sequencer could be used. For example, Kindelia-Ethereum and Kindelia-Bitcoin all
exist as separate networks.

A Kindelia transaction can do 4 things:

1. Declare a new name:

```
name nat
name succ
name zero
name double
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

The transactions above declare a few names, the type of positive integers
(`Nat`), a bond (global function or value) that doubles an integer (`double`),
and then evaluate the expression `double(3)`, which results in `6`. The `name`
declarations aren't required, but they allow future usages of that name to
occupy less space in a block.

Of course, these transactions don't do anything useful: they're just pure
calculations. In order to implement real-world applications, Kindelia needs some
notion of state. For that, it features one, and only one, side-effective
primitive, `bind`, which allows a bond to redefine another bond.

```
bond val(): #word {
  #0
}

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

The transactions above declare a global value, a function that increments
that value, and a script that increments it 3 times and output its value. Any
transaction that calls `val()` afterwards will get `3`. This statefullness
allows users to create arbitrary smart-contracts as bonds. For example, a
currency could be created by keeping a set of balances as a state.

```
bond balances : Map {
  Map@empty{}
}

type Action {
  send{to: User, value: #word}
  ...
}

bond CatCoin(action: Action): #word {
  case cmd {
    send:
      // checks and updates balances
    ...
  }
}
```

What about accounts? 

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
eval {
  CatCoin.send({
    to: @MrDog
    amount: #42
  })
} : #word
with PatoHasker(0x11112222333344445555....)
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

The beta reduction problem
==========================

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

## What is a beta reduction?

Beta reduction is just a jargon for function application. It is a big deal,
because it is the fundamental primitive behind functional languages. For
example, consider the Python program below:

```
def f(x):
  return [x, x]

print(f(42))
```

To evaluate it, the `f` function must be applied to the number `42`. In order to
do that, the interpreter replaces every occurrence of the variable `x` in the
body of `f` by the argument `42`, resulting in `[42,42]`. That operation is the
beta reduction.


## Counting beta reductions

As such, to feature functions in our language, we just need to assign a cost to
beta reduction, right? Yes, but there is a problem: we can't count how many beta
reductions an evaluation needs! To understand why, consider the following Python
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
before functions are applied, and that the count should be computed by running
programs in that order. After all, that is how most languages work, and seems to
be more efficient from this example. But consider the following expression:

```c
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

In this case, the imposed strategy is less efficient than an alternative. Now,
an attentive reader might have noticed that we reduced inside lambdas, which
isn't how most languages do it. So, what about an strategy where arguments are
reduced first, but no reduction takes place inside lambdas? Is it optimal?
Sadly, no. Here is a counter-example:

```
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

Which, again, uses less beta reductions. The issue here is that, for any
reduction strategy you choose, there will be some other reduction strategy
that is better in some cases. There is no optimal choice.

## Why not just impose an evaluation order?

But why is that an issue? As long as nodes agree to use the same strategy, they
should get the same count, even if isn't the best one, right? Sure, but this
count would, then, be meaningless. To understand why, imagine what would happen
if the network imposed the Python reduction order.

Initially, all would be fine. Eventually, a miner would realize he/she is able
to flood the network with programs that perform better in an alternate strategy,
and update his/her node to use it. So, for example, if the network charges 1000
beta reductions for certain evaluation, but that miner is able to evaluate it
using only 50, then he/she is having a massive computational advantage over
everyone else. That is bad.

So, why can't everyone else just update their nodes to use the alternate
strategy, too? They could, but, in that case, the entire network would be
operating under a new strategy, which would be better in some cases, but much
worse in others. The attacker could perform the same attack again, targeting
programs that perform poorly in that strategy. Eventually, the present cost
model would have no relationship with the actual computational cost of the
transactions, and that is terrible.

In short, it is not possible to measure the cost of evaluating a functional
program in a decentralized network, and any attempt to do so will, over time, be
no more accurate than just throwing dices. The only way to avoid this dance is
to ship every one with an optimal evaluation strategy to begin with, but, other
than subset restricteds of the lambda calculus, such a thing doesn't exist.

## Kindelia's solution

So, how does Kindelia solve this problem?

It doesn't. And it is important to stress that. Any decentralized computer that
claims to feature functions must either provide a solution to the optimal
evaluation of functional programs, or deal with all sorts of overpriced, or
underpriced, opcode spam attacks.

As such, Kindelia aims to be functional as possible, while still being robust
against spam. As such, it consists of a mostly pure, expression-based language
featuring datatypes, pattern-matching and recursion, but gives up on high-order
functions.

Note that we could, in theory, actually feature high order functions, as long as
these couldn't be duplicated in certain ways. For example, if functions could
only be used linearly, or, even better, if they could be copied, but under the
constraint of elementary affine logic, then it would be possible to provide
optimal evaluators for Kindelia.

For the sake of simplicity, though, we just exclude high-order functions
entirely. What is left is still a very solid functional language that is simple,
secure, efficient, designed to be the core of a worldwide computer.

Specification
=============

Kindelia's virtual machine is based on a core expression language that is
pure, low-order and functional. It features algebraic datatypes, 64-bit unsigned
integers and a single effect. It doesn't feature high-order functions.

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
  bind    (file : Name) (expr : Term  ) (cont : Term  )
```

- `var`: a bound variable.

- `let`: a local assignment expression.

- `call`: a call to an external bond.

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
if X is one of: + - * / % | & ^
context |- n : #word
context |- m : #word
-------------------------------
context |- X(n, m) : #word
```

### Bind

```
given bond a : A

context |- k : A
context |- r : B
------------------------------
context |- (set a = k; r) : B
```
