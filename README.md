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

<TODO>
