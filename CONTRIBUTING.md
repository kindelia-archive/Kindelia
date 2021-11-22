# Kindelia Contributing Guide

Please read first the **[general contributing
guide](https://github.com/Kindelia/docs/blob/main/CONTRIBUTING.md)**.

Below are instructions specific for this repository.

## Setting up your local environment

### 1. Fork and clone

[Fork the project on
GitHub](https://docs.github.com/en/get-started/quickstart/fork-a-repo) and clone
your fork locally.

```sh
$ git clone git@github.com:USERNAME/kindelia.git
$ cd kindelia
$ git remote add upstream https://github.com/Kindelia/kindelia
$ git fetch upstream
```

### 2. Branch

Create local branches to hold your work. These should be branched directly off
of the `master` branch.

```sh
$ git checkout -b my-branch -t upstream/master
```

### 3. Build

You need to have [Node.js](https://nodejs.org/) installed.

```
cd kind
npm install -g kind-lang
kind Kindelia.api.run --js --module > ./bin/kindelia.js
npm install -g .
```

### 4. Run and test

```
kindelia ./test/maia_0.kindelia
```
