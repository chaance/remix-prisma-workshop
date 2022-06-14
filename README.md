<div>
  <h1 align="center">💿 Remix + Prisma Workshop</h1>
  <strong>
    Build Better websites with Remix
  </strong>
  <p>
    Remix enables you to build fantastic user experiences for the web and feel
    happy with the code that got you there. Get a jumpstart on Remix with this
    workshop.
  </p>
</div>

<hr />

## Prerequisites

- Some experience with JavaScript
- Some experience with React
- Some experience with Node.js

## System Requirements

- git v2.13 or greater
- NodeJS `14 || 16 || 18`
- npm v8 or greater

All of these must be available in your `PATH`. To verify things are set up
properly, you can run this:

```shell
git --version
node --version
npm --version
```

If you have trouble with any of these, learn more about the PATH environment
variable and how to fix it here for
[Windows](https://helpdeskgeek.com/windows-10/add-windows-path-environment-variable/)
or
[mac/linux](https://stackoverflow.com/questions/24306398/how-to-add-mongo-commands-to-path-on-mac-osx/24322978#24322978).

## Setup

Follow these steps to get this set up:

```sh
git clone https://github.com/chaance/remix-prisma-workshop.git
cd remix-prisma-workshop
npm run setup
```

If you experience errors here, please open
[an issue](https://github.com/chaance/remix-prisma-workshop/issues/new) with as
many details as you can offer.

### Exercises

You'll find all the exercises in the `exercises` directory. The finished version
of each exercise is in the `final` directory. Each directory is a completely
contained Remix app.

The purpose of the exercise is **not** for you to work through all the material.
It's intended to get your brain thinking about the right questions to ask me as
_I_ walk through the material.

### Running each app

Each directory in the `final` and `exercises` directories is a Remix app. The
easiest way to run these without having to `cd` into each directory is to use
the `dev.js` script in the root of this repository:

```sh
# to run the first exercise app:
node dev exercise/01

# or to run the final version of the 2nd exercise
node dev final/02
```

Each will run on a unique port so you can run multiple apps at once.

I suggest that as you go through the workshop, rather than opening this whole
repo in an editor window, you open each exercise folder in an individual editor
window (this will make things like <kbd>⌘</kbd> + <kbd>P</kbd> more useful).

### Instructions

This workshop is completely self-paced. The benefit of using this repository is
you can skip around to different parts of the tutorial or even skip over
different parts completely.

When you're ready to start a section of the tutorial, open that section's
exercise directory in your editor and follow along with what the tutorial says
to do. To challenge yourself a little extra, you can ignore the code snippets in
the tutorial.

You can us the `diff.js` script to be shown the differences between what's in
any of the apps. For example:

```sh
# to be shown the differences between the first exercise and the final version:
node diff exercise/01 final/01
```

This can be handy for you to run when you think you're done but things aren't
quite working as you expect.

Sometimes there are changes that happen outside of the tutorial because they're
unrelated to Remix but they can be handy to know about, so the diff command can
help with that:

```sh
# To be shown the changes that happened to prepare for the exercise:
node diff final/03 exercise/04
```
