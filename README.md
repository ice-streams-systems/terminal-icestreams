# ISS Terminal — terminal.icestreams.io

Browser-based Linux learning environment. Simulated filesystem, 55+ commands, full scripting engine, and 105 guided missions across 24 modules covering bash scripting, awk, make, package management, and environment configuration.

## Structure

```
├── index.html    — layout, DOM structure, FREE mode command reference
├── style.css     — ISS design system + terminal styles
├── terminal.js   — virtual filesystem, all commands, scripting parser/executor
├── curriculum.js — 105 missions across 20 modules with validation
├── script.js     — UI wiring, mode switching, mission progression
└── README.md     — this file
```

## Deployment (GitHub Pages)

1. Push to a GitHub repository
2. Settings → Pages → Deploy from branch → `main` / `(root)`
3. For the subdomain: add a `CNAME` file containing `terminal.icestreams.io`
4. In Cloudflare (or your DNS): add a CNAME record pointing `terminal` → `<username>.github.io`

## Commands Implemented

**Navigation:** `pwd` `cd` `ls` (-a -l -la)  
**Files:** `cat` `touch` `mkdir` (-p) `rm` (-r -f) `cp` (-r) `mv`  
**Text:** `grep` (-i -n -v -c) `head` (-n) `tail` (-n) `wc` (-l -w -c) `sort` (-r -u -n) `uniq` (-c) `cut` (-d -f) `find` (-name -type) `sed` (s/p/r/g, /p/d, Nq) `awk` (field print, pattern filter) `tr` `tee` `printf` `basename` `dirname`  
**Permissions:** `chmod` (octal + symbolic) `chown` `whoami` `id` `sudo`  
**System:** `env` `export` `unset` `history` `date` `uname` `uptime` `df` `du` `which` `file` `type`  
**Scripting:** `bash` (execute scripts, -x flag) `source` / `.` `alias` `unalias` `read` `declare` `local` `readonly` `let` `expr` `test` / `[` `[[` `true` `false` `return` `exit` `shift` `set` `trap` `break` `continue`  
**Build/Packages:** `make` (Makefile executor) `apt` / `apt-get` `dpkg`  
**Environment:** `which` `env` `export` `unset` · PATH manipulation  
**Editing:** `vim` (full modal editor — Normal/Insert/Command modes)  
**Special:** `man` `help` `clear`

**Operators:** pipe (`|`) · redirect (`>` `>>` `<` `2>` `2>&1`) · here-doc (`<< EOF`) · `&&` · `||` · `;`  
**Variable expansion:** `$VAR` `${VAR:-def}` `${VAR:=def}` `${#VAR}` `${VAR:n:m}` `${VAR//p/r}` `${VAR#p}` `${VAR%p}` `${VAR^^}` `${VAR,,}` `${arr[@]}`  
**Arithmetic:** `$(( expr ))` · `let` · `expr` · `**` `%` `++` `--`  
**Scripting constructs:** `for-in` · C-style `for` · `while` · `until` · `if/elif/else` · `case/esac` · functions · arrays · command substitution `$(…)` · heredocs

## Guided Curriculum (76 Missions)

| Module | Topic | Missions |
|--------|-------|:--------:|
| M1  | Orientation | 3 |
| M2  | Files & Directories | 4 |
| M3  | Text Processing | 3 |
| M4  | Permissions | 3 |
| M5  | Scripting Basics | 5 |
| M6  | Special Characters (ABS Ch3) | 5 |
| M7  | Quoting (ABS Ch5) | 4 |
| M8  | Variables In Depth (ABS Ch4, Ch9) | 5 |
| M9  | Variable Manipulation (ABS Ch10) | 4 |
| M10 | Exit Status & Tests (ABS Ch6, Ch7) | 5 |
| M11 | Arithmetic (ABS Ch8, Ch13) | 4 |
| M12 | Loops & Branches (ABS Ch11) | 6 |
| M13 | Command Substitution (ABS Ch12) | 3 |
| M14 | Functions (ABS Ch24) | 5 |
| M15 | Arrays (ABS Ch27) | 4 |
| M16 | I/O Redirection (ABS Ch20) | 5 |
| M17 | Here Documents (ABS Ch19) | 3 |
| M18 | Regular Expressions (ABS Ch18) | 4 |
| M19 | Internal Commands (ABS Ch15) | 4 |
| M20 | Debugging & Style (ABS Ch32, Ch35) | 4 |
| **Total** | | **105** |

## Adding Commands

In `terminal.js`, add a function to the `CMDS` object:

```js
CMDS.mycommand = (args, flags, stdin) => {
  // args  = array of non-flag arguments
  // flags = object { flagName: true|value }
  // stdin = string piped from previous command (or null)
  // return array of HTML strings
  return [E.txt('Hello from mycommand')];
};
```

Add a man page entry to `MAN_PAGES` for `man mycommand` support.

## Adding Missions

In `curriculum.js`, add an object to the `CURRICULUM` array:

```js
{
  id: 'M6.1', module: 'Module Name', title: 'Mission Title',
  brief: 'What concept this teaches.',
  objective: 'What the user needs to do.',
  hint: 'Specific command to type.',
  check: (state, vfs) => {
    // Return true when mission is complete.
    // state.execHist = array of { cmd } objects
    // state.cwd = current working directory
    // state.vars = { varName: value } user variables
    // state.funcs = { funcName: bodyString } defined functions
    // state.arrays = { arrName: string[] } arrays
    // vfs = root of virtual filesystem
    return state.execHist.some(h => h.cmd.includes('somecommand'));
  },
  success: 'Explanation shown on completion.',
},
```

## Extending the Virtual Filesystem

In `terminal.js`, edit the `VFS` object. Add files:

```js
'myfile.txt': {
  type: 'file', perms: 'rw-r--r--',
  owner: 'user', group: 'user', mtime: 'Jan 15 08:00',
  content: 'File contents here'
},
```

Add directories:

```js
mydir: {
  type: 'dir', perms: 'rwxr-xr-x',
  owner: 'user', group: 'user', mtime: 'Jan 15 08:00',
  children: { /* nested entries */ }
},
```
