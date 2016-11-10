Intro.

There are many issues that i met when i was trying to pick up
Practice Win. I would like to systematize it. Maybe it will help to
prevent possible issues in the future.

Let's begin:

0. Problems with virtualization on Windows.

The problem:

  Vagrant doesn't run properly. It can log errors like ".... CPU does not support... ".
  Something like this.

The solution:

  Switch on Windows Hyper-V extension.
  +
  Switch on CPU virtualization in BIOS.

1. No sym links on Windows.

The problem:

  The problem appears to be that some dependency of gulp wants to make a symbolic link,
but the filesystem doesn't support symbolic links.

The solution:

  npm config set bin-links false

2. Old version of node-sass

The problem:

  Node sass module is trying to get access to folder .../node_modules/node-sass/vendor , but
  there is no any such folder...

The solution:

  npm rebuild node-sass


3. Don't forget to setup .env file

The problem:

  Missing of .env file

The solution

  Copy one from repo

4. Cannot execute - npm run start

The problem:

  concurrently module is not working...

The solution:

  idk. I have installed concurrently globally but it doesn't help...
