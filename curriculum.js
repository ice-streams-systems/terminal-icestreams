/* ═══════════════════════════════════════════════════════════════
   ISS TERMINAL — curriculum.js
   Based on the Advanced Bash Scripting Guide (ABS) outline.
   Modules 1–5: Linux fundamentals (18 missions)
   Modules 6–18: Scripting mastery  (58 missions)
   Total: 76 missions
═══════════════════════════════════════════════════════════════ */

(function (global) {
  'use strict';

  const CURRICULUM = [

    /* ════════════════════════════════════════
       MODULE 1: ORIENTATION (3 missions)
    ════════════════════════════════════════ */
    {
      id: 'M1.1', module: 'Orientation', title: 'Where Are You?',
      brief: 'Every terminal session starts somewhere on the filesystem. Before you do anything, find out where you are.',
      objective: 'Run `pwd` to print your current working directory.',
      hint: 'Type: pwd',
      check: (s) => s.execHist.some(h => h.cmd.trim() === 'pwd'),
      success: '`pwd` stands for Print Working Directory. The output tells you your absolute path — where you are right now in the filesystem tree. Everything starts here.',
    },
    {
      id: 'M1.2', module: 'Orientation', title: "What's Here?",
      brief: '`ls` lists what\'s in a directory. It\'s one of the commands you\'ll type hundreds of times.',
      objective: 'Run `ls` to see what\'s in your current directory.',
      hint: 'Type: ls',
      check: (s) => s.execHist.some(h => /^ls(\s|$)/.test(h.cmd.trim())),
      success: 'You can see your files. Try `ls -la` to see everything including hidden files (names starting with .) and permission details for each entry.',
    },
    {
      id: 'M1.3', module: 'Orientation', title: 'Move Around',
      brief: 'The filesystem is a tree. `cd` (change directory) is how you navigate it.',
      objective: 'Navigate to /home/user/documents using `cd`.',
      hint: 'Type: cd documents  (or: cd /home/user/documents)',
      check: (s) => s.cwd === '/home/user/documents',
      success: 'You navigated into the documents directory. Notice your prompt changed to reflect the new location. Use `cd ..` to go back up one level, `cd ~` to return home.',
    },

    /* ════════════════════════════════════════
       MODULE 2: FILES & DIRECTORIES (4 missions)
    ════════════════════════════════════════ */
    {
      id: 'M2.1', module: 'Files & Directories', title: 'Read a File',
      brief: '`cat` concatenates and prints file contents. It\'s the quickest way to read a file.',
      objective: 'Use `cat` to read the contents of readme.txt in ~/documents.',
      hint: 'Type: cat readme.txt  (make sure you are in ~/documents first)',
      check: (s) => s.execHist.some(h => /^cat\s+.*readme\.txt/.test(h.cmd.trim()) || h.cmd.trim() === 'cat readme.txt'),
      success: '`cat` printed the entire file. For long files, `head -n 20 file` shows the first 20 lines and `tail -n 20 file` shows the last 20. You\'ll use all three constantly.',
    },
    {
      id: 'M2.2', module: 'Files & Directories', title: 'Create Files and Directories',
      brief: '`mkdir` creates directories. `touch` creates empty files (or updates a file\'s timestamp if it exists).',
      objective: 'Create a new directory called `projects` inside your home directory.',
      hint: 'Navigate home first: cd ~  then: mkdir projects',
      check: (s, vfs) => {
        const home = vfs.children?.home?.children?.user?.children;
        return !!(home && home.projects && home.projects.type === 'dir');
      },
      success: 'Directory created. You can verify with `ls` — you\'ll see `projects/` in the listing. The trailing slash in `ls` output signals a directory.',
    },
    {
      id: 'M2.3', module: 'Files & Directories', title: 'Write to a File',
      brief: 'The `>` redirect operator captures a command\'s output and writes it to a file. `>>` appends instead of overwriting.',
      objective: 'Write the text "Hello from ISS" into a new file called hello.txt using echo and redirect.',
      hint: 'Type: echo "Hello from ISS" > hello.txt',
      check: (s, vfs) => {
        function findHello(node) {
          if (!node) return false;
          if (node.type === 'dir' && node.children) {
            if (node.children['hello.txt'] && node.children['hello.txt'].content) return true;
            return Object.values(node.children).some(findHello);
          }
          return false;
        }
        return findHello(vfs);
      },
      success: '`echo "text" > file` writes text to a file, creating it if it doesn\'t exist and overwriting if it does. `echo "more" >> file` appends a new line. Try `cat hello.txt` to verify.',
    },
    {
      id: 'M2.4', module: 'Files & Directories', title: 'Copy, Move, Remove',
      brief: '`cp` copies files. `mv` moves or renames them. `rm` deletes them. These three cover most file management.',
      objective: 'Copy hello.txt to backup.txt, then remove the original hello.txt.',
      hint: 'cp hello.txt backup.txt  then:  rm hello.txt',
      check: (s) => {
        const hist = s.execHist.map(h => h.cmd.trim());
        return hist.some(h => /^cp\s+.*hello\.txt\s+.*backup\.txt/.test(h))
            && hist.some(h => /^rm\s+.*hello\.txt/.test(h));
      },
      success: '`cp src dst` copies. `mv src dst` moves (also used to rename: `mv old.txt new.txt`). `rm file` deletes. For directories: `rm -r dirname`. There is no recycle bin — `rm` is permanent.',
    },

    /* ════════════════════════════════════════
       MODULE 3: TEXT PROCESSING (3 missions)
    ════════════════════════════════════════ */
    {
      id: 'M3.1', module: 'Text Processing', title: 'head and tail',
      brief: 'Most log files are enormous. `head` and `tail` let you inspect just the beginning or end without loading the whole file.',
      objective: 'Show the first 5 lines of /var/log/syslog using head.',
      hint: 'Type: head -n 5 /var/log/syslog',
      check: (s) => s.execHist.some(h => /^head\s+.*syslog/.test(h.cmd)),
      success: 'head and tail are essential for log analysis. `tail -n 20 /var/log/syslog` shows the most recent 20 events — the pattern you\'ll use when debugging a running system.',
    },
    {
      id: 'M3.2', module: 'Text Processing', title: 'Search with grep',
      brief: '`grep` searches file contents for a pattern. It\'s arguably the most-used text tool in Linux.',
      objective: 'Use grep to find all lines containing "ERROR" in /var/log/syslog.',
      hint: 'Type: grep ERROR /var/log/syslog',
      check: (s) => s.execHist.some(h => /^grep\s+.*error.*syslog/i.test(h.cmd) || /^grep\s+ERROR\s+/.test(h.cmd)),
      success: 'grep scanned every line and returned only the matches. Add `-i` for case-insensitive, `-n` to show line numbers, `-c` to just count matches.',
    },
    {
      id: 'M3.3', module: 'Text Processing', title: 'Pipes',
      brief: 'The pipe `|` connects commands: the output of the left becomes the input of the right.',
      objective: 'Pipe `cat /var/log/syslog` into `grep ERROR`, then pipe that into `wc -l` to count ERROR lines.',
      hint: 'Type: cat /var/log/syslog | grep ERROR | wc -l',
      check: (s) => s.execHist.some(h => h.cmd.includes('|') && /syslog/.test(h.cmd) && /wc/.test(h.cmd)),
      success: 'You built a pipeline. Each command does one thing well. Combine them for complex analysis. This is the Unix philosophy.',
    },

    /* ════════════════════════════════════════
       MODULE 4: PERMISSIONS (3 missions)
    ════════════════════════════════════════ */
    {
      id: 'M4.1', module: 'Permissions', title: 'Who Are You?',
      brief: 'Linux is a multi-user system. Every process, file, and action belongs to a user.',
      objective: 'Run `whoami` to see your current username, then run `id` for full user and group info.',
      hint: 'Run: whoami  then: id',
      check: (s) => s.execHist.some(h => h.cmd.trim() === 'whoami') && s.execHist.some(h => h.cmd.trim() === 'id'),
      success: '`whoami` gives your username. `id` shows your user ID (uid), primary group ID (gid), and all groups you belong to.',
    },
    {
      id: 'M4.2', module: 'Permissions', title: 'Read Permissions',
      brief: 'Every file has a 10-character permission string: d/- then rwxrwxrwx for owner/group/other.',
      objective: 'Run `ls -la` in your home directory and look at the permission strings.',
      hint: 'Type: cd ~  then: ls -la',
      check: (s) => s.execHist.some(h => /^ls\s+.*l.*a|^ls\s+.*a.*l/.test(h.cmd) || h.cmd.trim() === 'ls -la' || h.cmd.trim() === 'ls -al'),
      success: 'The permission string: d=directory, next 3=owner (r/w/x), next 3=group, last 3=others. -rw-r--r-- means owner can read/write, others can only read.',
    },
    {
      id: 'M4.3', module: 'Permissions', title: 'Change Permissions',
      brief: '`chmod` changes who can read, write, or execute a file.',
      objective: 'Make backup.sh in ~/scripts executable using chmod +x, then verify with ls -la.',
      hint: 'cd ~/scripts  then: chmod +x backup.sh  then: ls -la',
      check: (s, vfs) => {
        const scripts = vfs.children?.home?.children?.user?.children?.scripts?.children;
        if (!scripts || !scripts['backup.sh']) return false;
        const hasX  = scripts['backup.sh'].perms?.[2] === 'x';
        const hasLs = s.execHist.some(h => /^ls\s+(-[la]{1,2})/.test(h.cmd.trim()) || h.cmd.trim() === 'ls -la' || h.cmd.trim() === 'ls -al');
        return hasX && hasLs;
      },
      success: '`chmod +x` added the execute bit. The octal form: `chmod 755 file` sets owner=rwx, group=rx, other=rx. Patterns: 755 for executables, 644 for config files, 600 for private keys.',
    },

    /* ════════════════════════════════════════
       MODULE 5: SCRIPTING BASICS (5 missions)
    ════════════════════════════════════════ */
    {
      id: 'M5.1', module: 'Scripting Basics', title: 'Variables',
      brief: 'Shell variables store values you want to reuse. Assignment has no spaces around =.',
      objective: 'Set a variable NAME to your name, then echo it with `echo $NAME`.',
      hint: 'Type: NAME=Alice  then: echo $NAME',
      check: (s) => s.execHist.some(h => /^[A-Za-z_]\w*=\S+/.test(h.cmd)) && s.execHist.some(h => /^echo\s+\$[A-Za-z_]\w*/.test(h.cmd)),
      success: 'No spaces around `=`. Access variables with $NAME or ${NAME}. Try: echo "Hello, $NAME!"',
    },
    {
      id: 'M5.2', module: 'Scripting Basics', title: 'Vim Basics',
      brief: 'Vim is the standard editor on Linux servers. It is modal — Normal mode for navigation, Insert mode for typing.',
      objective: 'Open notes.txt in vim, enter Insert mode with `i`, add a line, press Esc, then save with `:wq`.',
      hint: 'cd ~/documents  then: vim notes.txt  →  press i  →  type text  →  Esc  →  :wq',
      check: (s) => !!(s.vimHistory && s.vimHistory.length > 0),
      success: 'Core loop: i to Insert, type, Esc to Normal, :wq to save-quit. Other: :q! quit without save, dd delete line, u undo, gg top, G bottom, o new line below.',
    },
    {
      id: 'M5.3', module: 'Scripting Basics', title: 'Write a Script',
      brief: 'A shell script is a text file containing bash commands. The #!/bin/bash shebang tells the system which interpreter to use.',
      objective: 'Use vim to create greet.sh in ~/scripts with a NAME variable and echo greeting. Save with :wq.',
      hint: 'cd ~/scripts  then: vim greet.sh  →  i  →  #!/bin/bash  (Enter)  NAME=Alice  (Enter)  echo "Hello, $NAME!"  →  Esc  →  :wq',
      check: (s, vfs) => {
        const scripts = vfs.children?.home?.children?.user?.children?.scripts?.children;
        if (!scripts) return false;
        return Object.values(scripts).some(f => f.type === 'file' && f.content && f.content.includes('echo') && f.content.includes('$'));
      },
      success: 'You wrote a script. Run it: `bash greet.sh`. The shebang #!/bin/bash identifies the interpreter. $NAME expands inside double quotes; single quotes prevent expansion.',
    },
    {
      id: 'M5.4', module: 'Scripting Basics', title: 'For Loops',
      brief: 'For loops iterate over a list: `for VAR in list; do command; done`.',
      objective: 'Create loop.sh in ~/scripts with a for loop that echoes 1, 2, and 3. Run it with: bash loop.sh',
      hint: 'vim ~/scripts/loop.sh  →  i  →  #!/bin/bash  (Enter)  for N in 1 2 3; do echo $N; done  →  Esc  →  :wq  →  bash ~/scripts/loop.sh',
      check: (s, vfs) => {
        const scripts = vfs.children?.home?.children?.user?.children?.scripts?.children;
        const hasLoop = !!(scripts && Object.values(scripts).some(f => f.type === 'file' && f.content && f.content.includes('for ')));
        const ranBash = s.execHist.some(h => /^bash\s+/.test(h.cmd.trim()));
        const inlineLoop = s.execHist.some(h => /^for\s+\w+\s+in\s+.+;\s*do/.test(h.cmd));
        return (hasLoop && ranBash) || inlineLoop;
      },
      success: 'For loops work identically in scripts and at the command line. Multi-line version:\n  for N in 1 2 3\n  do\n    echo $N\n  done\nThe semicolons join those lines together.',
    },
    {
      id: 'M5.5', module: 'Scripting Basics', title: 'If Statements',
      brief: 'Conditional logic: `if [ condition ]; then commands; fi`. Brackets are actually a test command.',
      objective: 'Edit greet.sh: add an if statement checking whether NAME equals a value, then run with bash.',
      hint: 'vim ~/scripts/greet.sh  →  G  →  o  →  if [ $NAME = "Alice" ]; then echo "Hi Alice!"; fi  →  Esc  →  :wq  →  bash ~/scripts/greet.sh',
      check: (s, vfs) => {
        const scripts = vfs.children?.home?.children?.user?.children?.scripts?.children;
        const hasIf = !!(scripts && Object.values(scripts).some(f => f.type === 'file' && f.content && f.content.includes('if ')));
        const ranBash = s.execHist.some(h => /^bash\s+/.test(h.cmd.trim()));
        const inlineIf = s.execHist.some(h => /^if\s+\[.+\];\s*then/.test(h.cmd.trim()));
        return (hasIf && ranBash) || inlineIf;
      },
      success: 'Common tests: [ "$VAR" = "value" ] string equality, [ $N -gt 10 ] numeric, [ -f "file" ] file exists, [ -d "dir" ] directory exists. Always quote variables: "$VAR" not $VAR.',
    },

    /* ════════════════════════════════════════
       MODULE 6: SPECIAL CHARACTERS (ABS Ch3)
       5 missions
    ════════════════════════════════════════ */
    {
      id: 'M6.1', module: 'Special Characters', title: 'The Semicolon',
      brief: 'The semicolon `;` separates multiple commands on one line — they run sequentially regardless of success or failure.',
      objective: 'Run two commands on one line using a semicolon: `echo "first"; echo "second"`',
      hint: 'Type: echo "first"; echo "second"',
      check: (s) => s.execHist.some(h => h.cmd.includes(';') && /echo/.test(h.cmd)),
      success: 'cmd1; cmd2 runs both commands in sequence. Compare with &&: cmd1 && cmd2 only runs cmd2 if cmd1 succeeds. And ||: cmd1 || cmd2 only runs cmd2 if cmd1 fails.',
    },
    {
      id: 'M6.2', module: 'Special Characters', title: 'Comments and Backslash',
      brief: '`#` starts a comment — everything after it on that line is ignored. `\\` at line-end continues to the next line. Backslash also escapes special characters.',
      objective: 'Run a command with a backslash line-continuation: `echo "hello \\ world"` OR use echo with an escaped dollar sign: `echo \\$HOME`',
      hint: 'Try: echo \\$HOME  (the backslash prevents $HOME from expanding)',
      check: (s) => s.execHist.some(h => /echo.*\\\\/.test(h.cmd) || /echo.*#/.test(h.cmd)),
      success: '`#` in a script: everything after is a comment. Backslash escapes: \\$ is a literal dollar sign, \\" is a literal quote, \\\\ is a literal backslash. In scripts, \\ at line-end is a line continuation.',
    },
    {
      id: 'M6.3', module: 'Special Characters', title: 'Wildcards and Globbing',
      brief: '`*` matches any string. `?` matches any single character. `[abc]` matches one of the listed characters. The shell expands these before passing them to commands.',
      objective: 'List all .sh files in ~/scripts using a wildcard pattern.',
      hint: 'cd ~/scripts  then: ls *.sh',
      check: (s) => s.execHist.some(h => /\*/.test(h.cmd) && /ls/.test(h.cmd)),
      success: 'The shell expanded *.sh to the matching filenames before ls ever ran. You can use wildcards with any command: `cat *.txt`, `rm *.bak`, `cp *.sh /tmp/`. Careful: `rm *` deletes everything.',
    },
    {
      id: 'M6.4', module: 'Special Characters', title: '&& and || Operators',
      brief: '`&&` (AND) runs the second command only if the first succeeds (exit 0). `||` (OR) runs the second command only if the first fails.',
      objective: 'Use && to chain two commands: `echo "start" && echo "both ran"`',
      hint: 'Type: echo "start" && echo "both ran"',
      check: (s) => s.execHist.some(h => h.cmd.includes('&&')),
      success: 'cmd1 && cmd2 — the classic "do this, and if it worked, do that." Pattern: mkdir /tmp/work && cd /tmp/work. With ||: cmd || fallback — "try this, or if it fails, do fallback." Pattern: grep user /etc/passwd || echo "user not found"',
    },
    {
      id: 'M6.5', module: 'Special Characters', title: 'Brace Expansion',
      brief: 'Brace expansion `{a,b,c}` generates multiple strings. `{1..5}` generates a sequence. This happens before any other expansion.',
      objective: 'Use brace expansion to echo three values at once: `echo {red,green,blue}`',
      hint: 'Type: echo {red,green,blue}  or: echo {1..5}',
      check: (s) => s.execHist.some(h => /\{.*,.*\}/.test(h.cmd) || /\{.*\.\..+\}/.test(h.cmd)),
      success: 'Brace expansion generates multiple strings. Useful: mkdir -p project/{src,tests,docs} creates three directories at once. echo file{1..5}.txt generates file1.txt file2.txt ... file5.txt.',
    },

    /* ════════════════════════════════════════
       MODULE 7: QUOTING (ABS Ch5)
       4 missions
    ════════════════════════════════════════ */
    {
      id: 'M7.1', module: 'Quoting', title: 'Single Quotes',
      brief: 'Single quotes preserve every character literally. No variable expansion, no command substitution, no special characters inside.',
      objective: 'Run: `echo \'$HOME is $HOME\'` — the output should print literally, not expand the variable.',
      hint: "Type: echo '$HOME is $HOME'",
      check: (s) => s.execHist.some(h => /echo\s+'[^']*\$[^']*'/.test(h.cmd)),
      success: "Single quotes: absolute preservation. Nothing inside is interpreted. The shell doesn't even look at the content. Use single quotes when you want literal text with no surprises.",
    },
    {
      id: 'M7.2', module: 'Quoting', title: 'Double Quotes',
      brief: 'Double quotes allow variable expansion ($VAR), command substitution ($(cmd)), and arithmetic ($((expr))), but prevent word splitting and globbing.',
      objective: 'Set NAME=World, then run: `echo "Hello, $NAME! You have $(echo 5) items."`',
      hint: 'NAME=World  then: echo "Hello, $NAME! You have $(echo 5) items."',
      check: (s) => s.execHist.some(h => /echo\s+"[^"]*\$[^"]*"/.test(h.cmd)),
      success: 'Double quotes protect against word splitting (spaces in variables don\'t become separate args) while still expanding $VAR and $(cmd). Best practice: always double-quote variable references: "$VAR" not $VAR.',
    },
    {
      id: 'M7.3', module: 'Quoting', title: 'Quote an Entire Message',
      brief: 'Mixing quoting styles is powerful: you can quote most of a string and escape specific characters.',
      objective: 'Echo a string with both a variable expansion AND a literal dollar sign: `echo "Cost: \\$5, user: $USER"`',
      hint: 'Type: echo "Cost: \\$5, user: $USER"',
      check: (s) => s.execHist.some(h => /echo.*\\\$.*\$USER/.test(h.cmd) || /echo.*\\\$/.test(h.cmd)),
      success: 'Inside double quotes: \\$ is a literal $, \\` is a literal backtick, \\\\ is a literal backslash, \\" is a literal quote. Everything else is still expanded normally.',
    },
    {
      id: 'M7.4', module: 'Quoting', title: 'Quoting Variables Safely',
      brief: 'Unquoted variables are split on whitespace and glob-expanded. This causes bugs when values contain spaces. Always quote your variables.',
      objective: 'Set a variable with spaces: `MSG="hello world"`, then echo it quoted: `echo "$MSG"` vs unquoted: `echo $MSG`',
      hint: 'MSG="hello world"  then: echo "$MSG"  then: echo $MSG  (observe the difference)',
      check: (s) => s.execHist.some(h => /MSG=["'].*\s.*["']/.test(h.cmd) || (s.vars && s.vars.MSG && s.vars.MSG.includes(' '))),
      success: 'With "$MSG", the shell sees one argument. Without quotes, $MSG is split into two arguments. In scripts this causes subtle bugs: rm $file deletes two files if $file="my file.txt". Always write rm "$file".',
    },

    /* ════════════════════════════════════════
       MODULE 8: VARIABLES IN DEPTH (ABS Ch4, Ch9)
       5 missions
    ════════════════════════════════════════ */
    {
      id: 'M8.1', module: 'Variables In Depth', title: 'Environment Variables',
      brief: 'Environment variables are inherited by child processes. `export` promotes a shell variable to an environment variable.',
      objective: 'View the current environment with `env`, then export a new variable: `export MYAPP=production`',
      hint: 'Type: env  then: export MYAPP=production  then: env | grep MYAPP',
      check: (s) => s.execHist.some(h => h.cmd.trim() === 'env' || /^env\s/.test(h.cmd)) && s.execHist.some(h => /^export\s+/.test(h.cmd)),
      success: '`env` shows all environment variables. `export VAR` makes VAR available to child processes. Common ones: $HOME your home directory, $PATH where the shell looks for commands, $USER your username, $SHELL your shell.',
    },
    {
      id: 'M8.2', module: 'Variables In Depth', title: 'PATH Variable',
      brief: '$PATH is a colon-separated list of directories where the shell searches for commands. Understanding it explains why commands work or fail.',
      objective: 'Print $PATH, then use `which ls` to see where the ls command lives.',
      hint: 'echo $PATH  then: which ls',
      check: (s) => s.execHist.some(h => /echo.*\$PATH/.test(h.cmd) || /^which\s+ls/.test(h.cmd)),
      success: '$PATH="/usr/local/bin:/usr/bin:/bin" means the shell checks those directories in order when you type a command. Add to PATH: export PATH="$HOME/.local/bin:$PATH" — putting your dir first.',
    },
    {
      id: 'M8.3', module: 'Variables In Depth', title: 'Special Variables',
      brief: 'The shell provides special read-only variables: $? (last exit status), $$ (current PID), $0 (script name), $# (argument count), $@ (all arguments).',
      objective: 'After any command, check `echo $?` to see its exit status. Then check `echo $$` for the current process ID.',
      hint: 'Run: ls  then: echo $?  then: echo $$',
      check: (s) => s.execHist.some(h => /echo\s+\$\?/.test(h.cmd)) && s.execHist.some(h => /echo\s+\$\$/.test(h.cmd)),
      success: '$? = 0 means success; non-zero means failure. Each command sets $?. $$ is useful for creating unique temp files: /tmp/myapp_$$.tmp. $0 in scripts holds the script filename.',
    },
    {
      id: 'M8.4', module: 'Variables In Depth', title: 'Positional Parameters',
      brief: 'When you call a script with arguments, they arrive as $1, $2, $3… $@ is all of them. $# is the count.',
      objective: 'Create a script args.sh that echoes $1, $2, and $#. Run it with two arguments: bash args.sh hello world',
      hint: 'vim ~/scripts/args.sh  →  #!/bin/bash; echo "First: $1"; echo "Second: $2"; echo "Count: $#"  →  :wq  →  bash ~/scripts/args.sh hello world',
      check: (s, vfs) => {
        const scripts = vfs.children?.home?.children?.user?.children?.scripts?.children;
        const hasScript = !!(scripts && Object.values(scripts).some(f => f.type === 'file' && f.content && /\$[1-9]|\$#/.test(f.content)));
        const ranWithArgs = s.execHist.some(h => /^bash\s+\S+\s+\S+/.test(h.cmd));
        return hasScript && ranWithArgs;
      },
      success: '$1..$9 are the first 9 arguments. $@ = "$1" "$2" ... (each quoted separately). $* = "$1 $2 ..." (all in one string). Use "$@" when passing arguments to another command.',
    },
    {
      id: 'M8.5', module: 'Variables In Depth', title: 'readonly and unset',
      brief: '`readonly` makes a variable immutable. `unset` removes a variable entirely. `declare` gives you type annotations.',
      objective: 'Create a readonly variable: `readonly VERSION=1.0`, then try to change it. Then `unset` a regular variable.',
      hint: 'readonly VERSION=1.0  then: VERSION=2.0  (observe the error)  then: X=temp; unset X; echo $X',
      check: (s) => s.execHist.some(h => /^readonly\s+/.test(h.cmd)) || s.execHist.some(h => /^unset\s+/.test(h.cmd)),
      success: '`readonly` prevents reassignment. `declare -i N=5` declares an integer (arithmetic auto-applied). `declare -r` is equivalent to readonly. `declare -a ARR` declares an array. `declare -p VAR` prints the declaration.',
    },

    /* ════════════════════════════════════════
       MODULE 9: VARIABLE MANIPULATION (ABS Ch10)
       4 missions
    ════════════════════════════════════════ */
    {
      id: 'M9.1', module: 'Variable Manipulation', title: 'String Length and Defaults',
      brief: '${#VAR} gives the length of a variable. ${VAR:-default} substitutes a default if VAR is unset or empty.',
      objective: 'Set NAME=Alice, then print ${#NAME} (its length). Then echo ${UNDEF:-"not set"} for an undefined variable.',
      hint: 'NAME=Alice  then: echo ${#NAME}  then: echo ${UNDEF:-"not set"}',
      check: (s) => s.execHist.some(h => /\$\{#\w+\}/.test(h.cmd)) && s.execHist.some(h => /\$\{\w+:-/.test(h.cmd)),
      success: '${#VAR} = length. ${VAR:-default} = value or default (doesn\'t set). ${VAR:=default} = value or default (AND sets VAR). ${VAR:+other} = other only if VAR is set. Essential for safe scripting.',
    },
    {
      id: 'M9.2', module: 'Variable Manipulation', title: 'Substring Operations',
      brief: '${VAR:offset:length} extracts a substring. Offset starts at 0.',
      objective: 'Set STR="Hello, World!", then extract the first 5 chars: `echo ${STR:0:5}`',
      hint: 'STR="Hello, World!"  then: echo ${STR:0:5}',
      check: (s) => s.execHist.some(h => /\$\{\w+:\d+:\d+\}/.test(h.cmd)),
      success: '${STR:0:5} = first 5 chars. ${STR:7} = from position 7 to end. ${STR:0:${#STR}-1} = all but last char. Negative offsets work from the end: ${STR: -5} = last 5 chars (space required before -).',
    },
    {
      id: 'M9.3', module: 'Variable Manipulation', title: 'Pattern Removal',
      brief: '${VAR#prefix} removes the shortest prefix matching a pattern. ## removes the longest. % and %% do the same for suffixes.',
      objective: 'Set FILE="/home/user/scripts/hello.sh", then extract just the filename: `echo ${FILE##*/}` and just the extension: `echo ${FILE##*.}`',
      hint: 'FILE="/home/user/scripts/hello.sh"  then: echo ${FILE##*/}  then: echo ${FILE##*.}',
      check: (s) => s.execHist.some(h => /\$\{\w+##/.test(h.cmd) || /\$\{\w+%/.test(h.cmd)),
      success: '${FILE##*/} = hello.sh (removes longest */ prefix = everything up to last /). ${FILE%.*} = hello (removes .sh suffix). ${FILE##*.} = sh (just the extension). These avoid needing basename/dirname in many cases.',
    },
    {
      id: 'M9.4', module: 'Variable Manipulation', title: 'Substitution and Case',
      brief: '${VAR//pattern/replacement} replaces all occurrences. ${VAR^^} uppercases. ${VAR,,} lowercases.',
      objective: 'Set MSG="hello world", then try: uppercase with ${MSG^^}, replace spaces with underscore with ${MSG// /_}',
      hint: 'MSG="hello world"  then: echo ${MSG^^}  then: echo ${MSG// /_}',
      check: (s) => s.execHist.some(h => /\$\{\w+\^\^/.test(h.cmd) || /\$\{\w+\/\//.test(h.cmd) || /\$\{\w+,,/.test(h.cmd)),
      success: '${VAR^^} = UPPERCASE. ${VAR,,} = lowercase. ${VAR^} = Capitalize first. ${VAR//old/new} = replace all. ${VAR/old/new} = replace first. Incredibly useful for normalizing user input and building filenames.',
    },

    /* ════════════════════════════════════════
       MODULE 10: EXIT STATUS & TESTS (ABS Ch6, Ch7)
       5 missions
    ════════════════════════════════════════ */
    {
      id: 'M10.1', module: 'Exit Status & Tests', title: 'Exit Codes',
      brief: 'Every command returns an exit status: 0 = success, non-zero = failure. $? holds the last exit status.',
      objective: 'Run `ls /nonexistent` (which fails), then immediately run `echo $?` to see the failure code.',
      hint: 'ls /nonexistent  then: echo $?',
      check: (s) => {
        const hist = s.execHist.map(h => h.cmd.trim());
        return hist.some(h => /echo\s+\$\?/.test(h));
      },
      success: 'Exit 0 = success. Exit 1–255 = failure (specific codes mean different things). `true` always returns 0. `false` always returns 1. In scripts, `exit 1` terminates with failure. Exit codes power all conditional logic.',
    },
    {
      id: 'M10.2', module: 'Exit Status & Tests', title: 'File Tests',
      brief: 'The `test` command (and its alias `[`) evaluates conditions. File tests check whether files exist and what type they are.',
      objective: 'Test if ~/documents exists as a directory: `[ -d ~/documents ] && echo "exists" || echo "missing"`',
      hint: 'Type: [ -d ~/documents ] && echo "exists" || echo "missing"',
      check: (s) => s.execHist.some(h => /\[\s*-[dfes]/.test(h.cmd)),
      success: 'File tests: -e (exists), -f (regular file), -d (directory), -r (readable), -w (writable), -x (executable), -s (non-empty). Pattern: [ -f "$file" ] && cat "$file" || echo "not found"',
    },
    {
      id: 'M10.3', module: 'Exit Status & Tests', title: 'String Tests',
      brief: 'Test string equality, inequality, and emptiness with [ ].',
      objective: 'Set NAME=Alice, then test: `[ "$NAME" = "Alice" ] && echo "yes" || echo "no"`',
      hint: 'NAME=Alice  then: [ "$NAME" = "Alice" ] && echo "yes" || echo "no"',
      check: (s) => s.execHist.some(h => /\[\s*"\$\w+"\s*(=|!=)\s*"/.test(h.cmd) || /\[\s*-z\s+/.test(h.cmd) || /\[\s*-n\s+/.test(h.cmd)),
      success: 'String tests: [ "$A" = "$B" ] equal, [ "$A" != "$B" ] not equal, [ -z "$A" ] empty string, [ -n "$A" ] non-empty. Always quote: [ "$VAR" = ... ] not [ $VAR = ... ] — unquoted empty variable breaks the syntax.',
    },
    {
      id: 'M10.4', module: 'Exit Status & Tests', title: 'Integer Comparisons',
      brief: 'Bash uses specific flags for numeric comparison: -eq, -ne, -lt, -gt, -le, -ge. Do not use = or < for numbers.',
      objective: 'Set N=7, then test: `[ $N -gt 5 ] && echo "big" || echo "small"`',
      hint: 'N=7  then: [ $N -gt 5 ] && echo "big" || echo "small"',
      check: (s) => s.execHist.some(h => /\[\s*\$\w+\s+-(?:eq|ne|lt|gt|le|ge)/.test(h.cmd)),
      success: '-eq = equal, -ne ≠ not equal, -lt < less than, -gt > greater than, -le ≤ less or equal, -ge ≥ greater or equal. Example: [ $age -ge 18 ] && echo "adult". For strings use = and !=.',
    },
    {
      id: 'M10.5', module: 'Exit Status & Tests', title: 'Extended Test [[ ]]',
      brief: '[[ ]] is the bash-specific extended test. It supports regex matching (=~), logical operators (&& ||), and does not require quoting in most cases.',
      objective: 'Use [[ ]] to test a regex: `NAME=Alice; [[ "$NAME" =~ ^Al ]] && echo "starts with Al"`',
      hint: 'NAME=Alice  then: [[ "$NAME" =~ ^Al ]] && echo "starts with Al"',
      check: (s) => s.execHist.some(h => /\[\[/.test(h.cmd)),
      success: '[[ ]] advantages: supports =~ for regex, no word splitting on $VAR, && and || work inside. [[ "$str" =~ ^[0-9]+$ ]] tests if str is all digits. Prefer [[ ]] in bash scripts; use [ ] for POSIX portability.',
    },

    /* ════════════════════════════════════════
       MODULE 11: ARITHMETIC (ABS Ch8, Ch13)
       4 missions
    ════════════════════════════════════════ */
    {
      id: 'M11.1', module: 'Arithmetic', title: 'Arithmetic Expansion',
      brief: '$(( )) performs integer arithmetic directly in the shell.',
      objective: 'Calculate: `echo $((7 * 8))` and `echo $((100 / 3))` and `echo $((17 % 5))`',
      hint: 'Try: echo $((7 * 8))  then: echo $((100 / 3))  then: echo $((17 % 5))',
      check: (s) => s.execHist.some(h => /\$\(\(.*[+\-*/%]/.test(h.cmd)),
      success: '$((expr)) supports +, -, *, /, % (remainder), ** (power). Integer only — no decimals. Variables: $((N + 1)) or just $((N+1)), both work. Increment: $((COUNT++)) or COUNT=$((COUNT+1)).',
    },
    {
      id: 'M11.2', module: 'Arithmetic', title: 'let and Variables',
      brief: '`let` evaluates arithmetic expressions and stores the result in a variable.',
      objective: 'Set A=10, B=3, then use let to calculate: `let SUM=A+B` and echo $SUM',
      hint: 'A=10; B=3; let SUM=A+B; echo $SUM',
      check: (s) => s.execHist.some(h => /^let\s+/.test(h.cmd)),
      success: '`let VAR=expr` is equivalent to `VAR=$((expr))`. `let` returns exit status 1 if result is 0 — this means `let N++` sets exit 1 when N becomes 0, which can surprise you in `set -e` scripts. Use $(( )) for assignments instead.',
    },
    {
      id: 'M11.3', module: 'Arithmetic', title: 'The expr Command',
      brief: '`expr` is the old-school arithmetic tool, still used in POSIX-portable scripts. Each token must be a separate argument.',
      objective: 'Try: `expr 15 + 7` and `expr 10 \\* 4` (note the escaped *)',
      hint: 'Type: expr 15 + 7  then: expr 10 \\* 4',
      check: (s) => s.execHist.some(h => /^expr\s+\d+\s+[+\-*/%]/.test(h.cmd)),
      success: '`expr` requires spaces around operators, and * must be escaped as \\*. Also does string operations: `expr length "hello"` = 5. In modern bash, prefer $(( )) — it\'s faster and cleaner. `expr` is for POSIX compatibility.',
    },
    {
      id: 'M11.4', module: 'Arithmetic', title: 'Arithmetic in Scripts — The math.sh Demo',
      brief: 'Look at the provided math.sh script to see arithmetic expansion in a real script context.',
      objective: 'Run the arithmetic demo: `bash ~/scripts/math.sh`',
      hint: 'cd ~  then: bash scripts/math.sh',
      check: (s) => s.execHist.some(h => /bash\s+.*math\.sh/.test(h.cmd)),
      success: 'math.sh demonstrates all arithmetic operators in one script. Notice how variables are used directly inside $(( )) without the $ prefix — both A and $A work inside arithmetic contexts. The ** operator is bash-specific (not POSIX).',
    },

    /* ════════════════════════════════════════
       MODULE 12: LOOPS & BRANCHES (ABS Ch11)
       6 missions
    ════════════════════════════════════════ */
    {
      id: 'M12.1', module: 'Loops & Branches', title: 'for — Iterating Lists',
      brief: 'for loops iterate over a list of words. The list can be hardcoded, a glob, or command substitution.',
      objective: 'Loop over a list of colors: `for COLOR in red green blue; do echo "Color: $COLOR"; done`',
      hint: 'Type: for COLOR in red green blue; do echo "Color: $COLOR"; done',
      check: (s) => s.execHist.some(h => /^for\s+\w+\s+in\s+.+;\s*do/.test(h.cmd)),
      success: 'for VAR in list — the list can be anything: for FILE in *.sh (all shell scripts), for HOST in $(cat hosts.txt) (from a file), for N in {1..10} (a range). The variable is available inside the loop body.',
    },
    {
      id: 'M12.2', module: 'Loops & Branches', title: 'for — Iterating Files',
      brief: 'Globbing inside for loops is one of the most common patterns in shell scripting.',
      objective: 'Loop over all .sh files in ~/scripts: `for f in ~/scripts/*.sh; do echo "$f"; done`',
      hint: 'Type: for f in ~/scripts/*.sh; do echo "$f"; done',
      check: (s) => s.execHist.some(h => /for\s+\w+\s+in\s+.*\*/.test(h.cmd) || /for\s+\w+\s+in\s+.*\.sh/.test(h.cmd)),
      success: '`for f in ~/scripts/*.sh` iterates the actual file paths. Inside the loop, "$f" is the full path. Always quote "$f" in case filenames have spaces. If no files match, the literal *.sh string becomes the loop item — guard with: [ -f "$f" ] || continue',
    },
    {
      id: 'M12.3', module: 'Loops & Branches', title: 'while Loops',
      brief: '`while` keeps looping as long as its condition is true (exit 0). The condition can be any command.',
      objective: 'Write a counting while loop: `N=1; while [ $N -le 3 ]; do echo $N; N=$((N+1)); done`',
      hint: 'Type: N=1; while [ $N -le 3 ]; do echo $N; N=$((N+1)); done',
      check: (s) => s.execHist.some(h => /^while\s+/.test(h.cmd) && /done/.test(h.cmd)),
      success: 'while [ condition ] is most common, but anything works as the condition: while read -r line processes lines from stdin, while ping -c1 host checks connectivity. The loop body is anything between do and done.',
    },
    {
      id: 'M12.4', module: 'Loops & Branches', title: 'until Loops',
      brief: '`until` is the opposite of while — it loops while the condition is FALSE (exit non-zero), stopping when the condition becomes true.',
      objective: 'Write a counting until loop: `N=1; until [ $N -gt 3 ]; do echo $N; N=$((N+1)); done`',
      hint: 'Type: N=1; until [ $N -gt 3 ]; do echo $N; N=$((N+1)); done',
      check: (s) => s.execHist.some(h => /^until\s+/.test(h.cmd) && /done/.test(h.cmd)),
      success: 'until is while inverted. `until [ -f /tmp/done ]` keeps running until a file appears — useful for waiting on another process. In practice, while is more common; until is a style choice for certain logic.',
    },
    {
      id: 'M12.5', module: 'Loops & Branches', title: 'case Statements',
      brief: '`case` pattern-matches a value against patterns. Cleaner than a chain of if/elif for multiple discrete values.',
      objective: 'Test case with an extension check: `EXT=sh; case $EXT in sh) echo "shell";; py) echo "python";; *) echo "other";; esac`',
      hint: 'EXT=sh; case $EXT in sh) echo "shell";; py) echo "python";; *) echo "other";; esac',
      check: (s) => s.execHist.some(h => /^case\s+/.test(h.cmd) && /esac/.test(h.cmd)),
      success: 'case VAR in pat) cmd;; pat) cmd;; *) default;; esac. Patterns support globs: *.txt), [Yy]*) (yes/no), and | for alternatives: yes|y|1). The *) catch-all is optional. Each clause ends with ;; (or ;&  or ;;&).',
    },
    {
      id: 'M12.6', module: 'Loops & Branches', title: 'break and continue',
      brief: '`break` exits a loop early. `continue` skips to the next iteration. Both are essential for real-world loop control.',
      objective: 'Write a loop that breaks at 3: `for N in 1 2 3 4 5; do [ $N -eq 3 ] && break; echo $N; done`',
      hint: 'Type: for N in 1 2 3 4 5; do [ $N -eq 3 ] && break; echo $N; done',
      check: (s) => s.execHist.some(h => /\bbreak\b/.test(h.cmd) || /\bcontinue\b/.test(h.cmd)),
      success: 'break exits the innermost loop. continue skips to the next iteration. `break N` breaks out of N nested loops. Example: for f in *.log; do [ -s "$f" ] || continue; grep ERROR "$f"; done — skip empty files.',
    },

    /* ════════════════════════════════════════
       MODULE 13: COMMAND SUBSTITUTION (ABS Ch12)
       3 missions
    ════════════════════════════════════════ */
    {
      id: 'M13.1', module: 'Command Substitution', title: 'Capturing Output',
      brief: '$(command) runs a command and inserts its output. This is command substitution — one of bash\'s most powerful features.',
      objective: 'Capture today\'s date: `TODAY=$(date); echo "Today is $TODAY"`',
      hint: 'TODAY=$(date)  then: echo "Today is $TODAY"',
      check: (s) => s.execHist.some(h => /\$\(.*\)/.test(h.cmd) && !/\$\(\(/.test(h.cmd)),
      success: '$(cmd) captures stdout of cmd as a string. The newline at the end is stripped. You can use it anywhere a value is expected: files=$(ls *.sh), count=$(wc -l < file), user=$(whoami). The older backtick `cmd` syntax does the same but is harder to read and nest.',
    },
    {
      id: 'M13.2', module: 'Command Substitution', title: 'Substitution in Strings',
      brief: 'Command substitution works inside double-quoted strings, making it easy to build dynamic messages.',
      objective: 'Build a message with multiple substitutions: `echo "User $(whoami) is in $(pwd)"`',
      hint: 'Type: echo "User $(whoami) is in $(pwd)"',
      check: (s) => s.execHist.some(h => /echo.*\$\(.*\).*\$\(.*\)/.test(h.cmd)),
      success: 'Command substitutions can be nested: $(cat $(ls -t *.log | head -1)) reads the most recent .log file. They run in a subshell, so variable changes inside don\'t affect the parent shell.',
    },
    {
      id: 'M13.3', module: 'Command Substitution', title: 'Practical Substitution',
      brief: 'Count files, capture command output for use in logic — command substitution is everywhere in real scripts.',
      objective: 'Count the .sh files in ~/scripts: `COUNT=$(ls ~/scripts/*.sh | wc -l); echo "Found $COUNT scripts"`',
      hint: 'COUNT=$(ls ~/scripts/*.sh | wc -l)  then: echo "Found $COUNT scripts"',
      check: (s) => s.execHist.some(h => /\w+=\$\(.*\)/.test(h.cmd) && /wc/.test(h.cmd)),
      success: 'Capture and use: LINES=$(wc -l < file); [ $LINES -gt 100 ] && echo "long file". Pattern: assign to variable, then use. Capturing into arrays: FILES=($(ls *.sh)) — but be careful with spaces in filenames, use mapfile/readarray for robust solutions.',
    },

    /* ════════════════════════════════════════
       MODULE 14: FUNCTIONS (ABS Ch24)
       5 missions
    ════════════════════════════════════════ */
    {
      id: 'M14.1', module: 'Functions', title: 'Define and Call',
      brief: 'Functions group commands under a name. Define with name() { commands; } and call with the name alone.',
      objective: 'Define a greet function and call it: `greet() { echo "Hello from a function!"; }; greet`',
      hint: 'Type: greet() { echo "Hello from a function!"; }; greet',
      check: (s) => {
        return Object.keys(s.funcs || {}).length > 0 || s.execHist.some(h => /\w+\s*\(\)\s*\{/.test(h.cmd));
      },
      success: 'Functions are defined before they are called. The () is required (even with no parameters). Call by name — just like commands. Functions exist for the rest of the shell session, or until you `unset -f funcname`.',
    },
    {
      id: 'M14.2', module: 'Functions', title: 'Function Arguments',
      brief: 'Inside a function, $1 $2 … $@ hold the arguments passed when calling. They are separate from the script\'s own positional parameters.',
      objective: 'Define a greet function that takes a name argument: `greet() { echo "Hi, $1!"; }; greet Alice; greet Bob`',
      hint: 'greet() { echo "Hi, $1!"; }; greet Alice; greet Bob',
      check: (s) => {
        const hist = s.execHist.map(h => h.cmd);
        return hist.some(h => /\w+\s*\(\)\s*\{.*\$1/.test(h)) && hist.some(h => /\w+\s+\w+/.test(h) && Object.keys(s.funcs||{}).length > 0);
      },
      success: 'Function arguments: $1, $2, $@ (all args), $# (count). These shadow the script\'s own positional params during the function call and restore afterward. You can pass any number of arguments: myFunc a b c d e',
    },
    {
      id: 'M14.3', module: 'Functions', title: 'local Variables',
      brief: '`local` declares a variable scoped to the function. Without local, variables are global and can pollute the script.',
      objective: 'Define a function with a local variable: `double() { local n=$1; echo $((n * 2)); }; double 7`',
      hint: 'double() { local n=$1; echo $((n * 2)); }; double 7',
      check: (s) => s.execHist.some(h => /local\s+\w+/.test(h.cmd)),
      success: 'Without `local`, assigning to a variable inside a function changes the global value — a common bug. With `local`, the variable only exists during that function call. Best practice: always declare function variables as local.',
    },
    {
      id: 'M14.4', module: 'Functions', title: 'Return Values',
      brief: '`return N` sets the exit status of the function (0=success, 1-255=failure). To return a value, echo it and capture with $().',
      objective: 'Create an add function that returns the sum via echo: `add() { echo $(($1 + $2)); }; result=$(add 5 3); echo $result`',
      hint: 'add() { echo $(($1 + $2)); }; result=$(add 5 3); echo $result',
      check: (s) => {
        const hist = s.execHist.map(h => h.cmd);
        return hist.some(h => /\w+=\$\(\s*\w+\s+\d+/.test(h)) || hist.some(h => /result\s*=/.test(h));
      },
      success: 'return only sets exit status (0-255). To return a string/number: echo it, then capture with VAR=$(funcname args). The function runs in the SAME shell (unlike $() which uses a subshell), so local variable changes are visible. But captured output runs in a subshell.',
    },
    {
      id: 'M14.5', module: 'Functions', title: 'Running the Function Demo',
      brief: 'Look at the provided functions.sh script — it shows functions with local variables and return values in a complete example.',
      objective: 'Run the functions demo: `bash ~/scripts/functions.sh`',
      hint: 'bash ~/scripts/functions.sh',
      check: (s) => s.execHist.some(h => /bash\s+.*functions\.sh/.test(h.cmd)),
      success: 'functions.sh shows two functions: greet() uses local for a parameter, add() returns a value via echo and captures it with $(). This pattern — compute inside, echo out, capture with $() — is the standard way functions return data in bash.',
    },

    /* ════════════════════════════════════════
       MODULE 15: ARRAYS (ABS Ch27)
       4 missions
    ════════════════════════════════════════ */
    {
      id: 'M15.1', module: 'Arrays', title: 'Create and Access',
      brief: 'Arrays hold indexed lists of values. Declare with ARRAY=(a b c) and access with ${ARRAY[N]} starting at index 0.',
      objective: 'Create an array of fruits and access the first and last: `FRUITS=(apple banana cherry); echo ${FRUITS[0]}; echo ${FRUITS[2]}`',
      hint: 'FRUITS=(apple banana cherry)  then: echo ${FRUITS[0]}  then: echo ${FRUITS[2]}',
      check: (s) => Object.keys(s.arrays || {}).length > 0 || s.execHist.some(h => /\w+=\(/.test(h.cmd)),
      success: '${ARRAY[0]} is the first element. ${ARRAY[@]} is all elements. ${#ARRAY[@]} is the count. ${!ARRAY[@]} is all indices. To append: ARRAY+=(newval). To delete: unset ARRAY[2].',
    },
    {
      id: 'M15.2', module: 'Arrays', title: 'Iterate an Array',
      brief: 'Loop over all array elements with: `for item in "${ARRAY[@]}"; do ... done` — the quotes preserve elements with spaces.',
      objective: 'Create a SERVERS array and loop over it: `SERVERS=(web01 db01 cache01); for s in "${SERVERS[@]}"; do echo "Checking: $s"; done`',
      hint: 'SERVERS=(web01 db01 cache01); for s in "${SERVERS[@]}"; do echo "Checking: $s"; done',
      check: (s) => {
        const hist = s.execHist.map(h => h.cmd);
        return hist.some(h => /for\s+\w+\s+in\s+"?\$\{.*\[@\]\}/.test(h));
      },
      success: '"${ARRAY[@]}" with quotes: each element is a separate word. Without quotes, elements with spaces would split. "${ARRAY[*]}" puts all in one string. Always use "${ARRAY[@]}" when iterating.',
    },
    {
      id: 'M15.3', module: 'Arrays', title: 'Array Operations',
      brief: 'Arrays support many operations: length, slicing, searching, and deleting elements.',
      objective: 'Create an array, print its length and all elements: `A=(x y z); echo "Length: ${#A[@]}"; echo "All: ${A[@]}"`',
      hint: 'A=(x y z); echo "Length: ${#A[@]}"; echo "All: ${A[@]}"',
      check: (s) => s.execHist.some(h => /\$\{#\w+\[@\]\}/.test(h.cmd)),
      success: '${#ARR[@]} = element count. ${ARR[@]:1:2} = slice from index 1, take 2. ${ARR[@]/old/new} = replace in all elements. Declare empty: EMPTY=(), append: EMPTY+=(item). Arrays are not associative by default — use declare -A for that.',
    },
    {
      id: 'M15.4', module: 'Arrays', title: 'Arrays in Scripts',
      brief: 'Look at arrays.sh to see arrays used in a complete script context.',
      objective: 'Run: `bash ~/scripts/arrays.sh`',
      hint: 'bash ~/scripts/arrays.sh',
      check: (s) => s.execHist.some(h => /bash\s+.*arrays\.sh/.test(h.cmd)),
      success: 'arrays.sh shows an array of fruits being accessed by index and iterated. Note the FRUITS=("apple" ...) assignment (with double quotes for safety) and "${FRUITS[@]}" in the for loop. Real scripts use arrays for server lists, file batches, and option menus.',
    },

    /* ════════════════════════════════════════
       MODULE 16: I/O REDIRECTION (ABS Ch20)
       5 missions
    ════════════════════════════════════════ */
    {
      id: 'M16.1', module: 'I/O Redirection', title: 'stdout and stderr',
      brief: 'Every process has three standard streams: stdin (0), stdout (1), stderr (2). Commands write normal output to stdout and errors to stderr.',
      objective: 'Run a command that produces both output and an error: `ls /home/user /nonexistent`',
      hint: 'ls /home/user /nonexistent',
      check: (s) => s.execHist.some(h => /ls\s+/.test(h.cmd) && h.cmd.includes('/nonexistent')),
      success: 'ls printed results to stdout and an error to stderr. In a terminal they look the same, but in scripts you can route them separately. stdout (fd 1) and stderr (fd 2) are distinct streams.',
    },
    {
      id: 'M16.2', module: 'I/O Redirection', title: 'Redirect stdout',
      brief: '> writes stdout to a file (overwrite). >> appends stdout to a file.',
      objective: 'Capture ls output to a file and verify: `ls ~/scripts > /tmp/filelist.txt; cat /tmp/filelist.txt`',
      hint: 'ls ~/scripts > /tmp/filelist.txt  then: cat /tmp/filelist.txt',
      check: (s) => s.execHist.some(h => h.cmd.includes('>') && !/>>/.test(h.cmd) && h.cmd.includes('ls')),
      success: '> creates or overwrites. >> appends. Both redirect stdout. `ls >> log.txt` appends to log.txt. `echo "" >> file` adds a blank line. The file is created if it doesn\'t exist. `> file` (with no command) truncates a file to empty.',
    },
    {
      id: 'M16.3', module: 'I/O Redirection', title: 'Redirect stderr',
      brief: '2> redirects stderr to a file. 2>/dev/null discards all errors. 2>&1 merges stderr into stdout.',
      objective: 'Run a failing command and discard the error: `ls /nonexistent 2>/dev/null; echo "No error shown"`',
      hint: 'ls /nonexistent 2>/dev/null  then: echo "No error shown"',
      check: (s) => s.execHist.some(h => /2>\/dev\/null/.test(h.cmd) || /2>&1/.test(h.cmd) || /2>\s*\S/.test(h.cmd)),
      success: '2>/dev/null = discard errors. 2>&1 = send stderr to the same place as stdout. cmd > file 2>&1 = capture everything. cmd 2>&1 | grep ERR = filter errors in a pipe. /dev/null is the "black hole" — anything written there is discarded.',
    },
    {
      id: 'M16.4', module: 'I/O Redirection', title: 'Append and Tee',
      brief: '>> appends without overwriting. `tee` writes to both a file AND stdout simultaneously.',
      objective: 'Append a line to a log: `echo "Log entry $(date)" >> /tmp/app.log; cat /tmp/app.log`',
      hint: 'echo "Log entry $(date)" >> /tmp/app.log  then: cat /tmp/app.log',
      check: (s) => s.execHist.some(h => />>/.test(h.cmd)),
      success: '>> appends — the file grows with each write. `cmd | tee file` writes to file AND shows output on screen. `cmd | tee -a file` appends. Log pattern: echo "$(date): event" >> /var/log/myapp.log runs throughout a script to build a log.',
    },
    {
      id: 'M16.5', module: 'I/O Redirection', title: 'Input Redirection',
      brief: '< reads stdin from a file instead of the keyboard. Combined with > it creates pipelines-on-disk.',
      objective: 'Sort the names file and save the result: `sort ~/data/names.txt > /tmp/sorted_names.txt; cat /tmp/sorted_names.txt`',
      hint: 'sort ~/data/names.txt > /tmp/sorted_names.txt  then: cat /tmp/sorted_names.txt',
      check: (s) => s.execHist.some(h => /sort.*names\.txt/.test(h.cmd) || /sort\s*</.test(h.cmd)),
      success: 'sort < file or sort file — both work. `wc -l < file` counts lines. The key: many commands accept either a filename argument OR stdin via <. Reading from stdin: `while read -r line; do echo "$line"; done < file` processes line by line.',
    },

    /* ════════════════════════════════════════
       MODULE 17: HERE DOCUMENTS (ABS Ch19)
       3 missions
    ════════════════════════════════════════ */
    {
      id: 'M17.1', module: 'Here Documents', title: 'Basic Heredoc',
      brief: 'A here document (heredoc) lets you pass multiline text to a command directly in the script, without creating a temp file.',
      objective: 'Write a heredoc to cat: `cat << EOF\nLine one\nLine two\nEOF`',
      hint: 'In a script: cat << EOF  (Enter)  Line one  (Enter)  Line two  (Enter)  EOF\n\nOr run: bash ~/scripts/template.sh to see heredoc output',
      check: (s) => s.execHist.some(h => /<<\s*\w+/.test(h.cmd) || /bash\s+.*template\.sh/.test(h.cmd)),
      success: 'cat << EOF reads until it sees a line containing just "EOF". The delimiter can be any word. Variable expansion happens inside heredocs (unless you quote the delimiter: << \'EOF\'). Use for config file generation, SQL queries, or any multiline text.',
    },
    {
      id: 'M17.2', module: 'Here Documents', title: 'Heredoc in Scripts',
      brief: 'Heredocs are most useful in scripts for generating config files, emails, or report templates.',
      objective: 'Create a report script: vim ~/scripts/report.sh with a heredoc that outputs a multi-line report. Run it with bash.',
      hint: 'vim ~/scripts/report.sh  →  i  →  #!/bin/bash  (Enter)  cat << EOF  (Enter)  Report: $(date)  (Enter)  User: $USER  (Enter)  EOF  →  Esc  →  :wq  →  bash ~/scripts/report.sh',
      check: (s, vfs) => {
        const scripts = vfs.children?.home?.children?.user?.children?.scripts?.children;
        const hasHeredoc = !!(scripts && Object.values(scripts).some(f => f.type === 'file' && f.content && /<<\s*\w+/.test(f.content)));
        const ran = s.execHist.some(h => /bash\s+.*report\.sh/.test(h.cmd));
        return hasHeredoc || ran;
      },
      success: 'Heredocs with variable expansion: cat << EOF; Report for $USER; Generated: $(date); EOF. Quote the delimiter to prevent expansion: cat << \'EOF\'; literal $USER; EOF. With <<- (dash), leading tabs are stripped — good for indented scripts.',
    },
    {
      id: 'M17.3', module: 'Here Documents', title: 'Feeding Commands',
      brief: 'Heredocs can feed multi-line input to any command that reads stdin — not just cat.',
      objective: 'Use a heredoc to feed grep: `grep "online" << EOF\nweb01 online\ndb01 offline\nEOF`',
      hint: 'grep "online" << EOF  (Enter)  web01 online  (Enter)  db01 offline  (Enter)  EOF\n\nOr pipe the servers file: cat ~/data/servers.txt | grep online',
      check: (s) => s.execHist.some(h => /<<\s*\w+/.test(h.cmd) && !/cat/.test(h.cmd.split('<<')[0])) || s.execHist.some(h => /grep.*online.*servers/.test(h.cmd) || /grep.*servers.*online/.test(h.cmd)),
      success: 'Heredocs work with grep, sed, awk, sort, sql clients — anything that reads stdin. This lets you embed test data in scripts. For writing to files: cat << EOF > /etc/app.conf — heredoc fed through redirection. Powerful for generating configuration.',
    },

    /* ════════════════════════════════════════
       MODULE 18: REGULAR EXPRESSIONS (ABS Ch18)
       4 missions
    ════════════════════════════════════════ */
    {
      id: 'M18.1', module: 'Regular Expressions', title: 'Basic grep Patterns',
      brief: 'grep matches lines containing a pattern. Basic regex: . matches any char, * means zero or more of previous, ^ anchors to start, $ anchors to end.',
      objective: 'Search for lines starting with "web" in ~/data/servers.txt: `grep "^web" ~/data/servers.txt`',
      hint: 'grep "^web" ~/data/servers.txt',
      check: (s) => s.execHist.some(h => /grep.*servers\.txt/.test(h.cmd) || /grep.*names\.txt/.test(h.cmd)),
      success: '^ matches start of line, $ matches end. . matches any character, .* matches anything. grep "^$" finds empty lines. grep "error$" finds lines ending in "error". Basic regex is "greedy" and case-sensitive. Add -i for case-insensitive.',
    },
    {
      id: 'M18.2', module: 'Regular Expressions', title: 'Extended Regex grep -E',
      brief: 'grep -E (or egrep) enables extended regular expressions: + (one or more), ? (zero or one), | (OR), () (groups).',
      objective: 'Find online or offline servers: `grep -E "online|offline" ~/data/servers.txt`',
      hint: 'grep -E "online|offline" ~/data/servers.txt',
      check: (s) => s.execHist.some(h => /grep\s+-[a-zA-Z]*E/.test(h.cmd) || /grep\s+['"].*\|.*['"]/.test(h.cmd)),
      success: 'ERE: + means 1 or more, ? means 0 or 1, | means OR, () groups patterns, {n,m} quantifies repetitions. grep -E "^[A-Z]" finds lines starting with uppercase. grep -E "[0-9]{3}" finds 3+ consecutive digits.',
    },
    {
      id: 'M18.3', module: 'Regular Expressions', title: 'Character Classes',
      brief: '[abc] matches any one character in the set. [a-z] matches any lowercase letter. [^abc] matches any character NOT in the set.',
      objective: 'Find names starting with a capital: `grep "^[A-Z]" ~/data/names.txt` and find all email-like patterns: `grep -E "[a-z]+@[a-z]+" ~/data/emails.txt`',
      hint: 'grep "^[A-Z]" ~/data/names.txt  then: grep -E "[a-z]+@[a-z]+" ~/data/emails.txt',
      check: (s) => s.execHist.some(h => /grep.*\[/.test(h.cmd)),
      success: '[A-Za-z] = any letter. [0-9] = digit. [^0-9] = non-digit. [:alpha:] [:digit:] [:space:] are POSIX classes. grep -E "^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,}$" validates email format. Character classes are the foundation of text validation.',
    },
    {
      id: 'M18.4', module: 'Regular Expressions', title: 'Regex in bash [[ =~ ]]',
      brief: 'Inside [[ ]], the =~ operator tests a string against a regex. Matches are captured in BASH_REMATCH.',
      objective: 'Test an email pattern: `EMAIL=alice@example.com; [[ "$EMAIL" =~ @.*\\. ]] && echo "has domain" || echo "invalid"`',
      hint: 'EMAIL=alice@example.com; [[ "$EMAIL" =~ @.*\\. ]] && echo "has domain" || echo "invalid"',
      check: (s) => s.execHist.some(h => /\[\[.*=~/.test(h.cmd)),
      success: '[[ "$str" =~ pattern ]] returns 0 (true) if the string matches. Do NOT quote the regex pattern. BASH_REMATCH[0] is the whole match, BASH_REMATCH[1] is the first capture group. This enables in-script validation without calling grep.',
    },

    /* ════════════════════════════════════════
       MODULE 19: INTERNAL COMMANDS (ABS Ch15)
       4 missions
    ════════════════════════════════════════ */
    {
      id: 'M19.1', module: 'Internal Commands', title: 'echo vs printf',
      brief: '`echo` is simple but inconsistent across shells. `printf` is portable and precise — essential for formatted output.',
      objective: 'Use printf for formatted output: `printf "%-15s %s\\n" "Server" "Status"; printf "%-15s %s\\n" "web01" "online"`',
      hint: 'printf "%-15s %s\\n" "Server" "Status"; printf "%-15s %s\\n" "web01" "online"',
      check: (s) => s.execHist.some(h => /^printf\s+/.test(h.cmd)),
      success: 'printf format codes: %s string, %d integer, %f float, %-10s left-align in 10 chars, %010d zero-pad integer, \\n newline, \\t tab. printf doesn\'t add a newline automatically — include \\n. Use printf for any output that needs alignment or consistent formatting.',
    },
    {
      id: 'M19.2', module: 'Internal Commands', title: 'type and which',
      brief: '`type` tells you how the shell interprets a command: builtin, function, alias, or external file. `which` finds external commands.',
      objective: 'Use type to classify several commands: `type cd; type ls; type echo`',
      hint: 'type cd  then: type ls  then: type echo',
      check: (s) => s.execHist.some(h => /^type\s+/.test(h.cmd)),
      success: 'type output: "builtin" means it runs inside bash (no external process). "is /usr/bin/ls" means external binary. "is a function" means user-defined. "is aliased to" shows the alias. `which` only finds external binaries. Understanding the type helps debug "command not found" errors.',
    },
    {
      id: 'M19.3', module: 'Internal Commands', title: 'source and dot',
      brief: '`source file` (or `. file`) runs a script in the CURRENT shell — not a subshell. Variables and functions defined in the sourced file are available afterward.',
      objective: 'Source a file to load its functions: create a lib.sh with a function, then `source ~/scripts/lib.sh` to load it.',
      hint: 'echo \'say_hi() { echo "Hi!"; }\' > ~/scripts/lib.sh  then: source ~/scripts/lib.sh  then: say_hi',
      check: (s) => s.execHist.some(h => /^source\s+/.test(h.cmd) || /^\.\s+/.test(h.cmd)),
      success: 'source runs in the SAME shell — so exported variables, set options, and function definitions persist. Contrast with bash script.sh which runs in a subshell. Pattern: source ~/.bashrc reloads your shell config. Library pattern: source lib.sh in every script that needs those functions.',
    },
    {
      id: 'M19.4', module: 'Internal Commands', title: 'History and Navigation',
      brief: '`history` shows your command history. !! repeats the last command. !n runs command number n. Ctrl+R searches history.',
      objective: 'View your command history: `history`',
      hint: 'Type: history',
      check: (s) => s.execHist.some(h => h.cmd.trim() === 'history'),
      success: '`history` shows numbered command history. `!50` reruns command #50. `!grep` reruns the last grep command. `!!` repeats the last command — often used with sudo: `sudo !!`. History is saved in ~/.bash_history between sessions.',
    },

    /* ════════════════════════════════════════
       MODULE 20: DEBUGGING & STYLE (ABS Ch32, Ch35)
       4 missions
    ════════════════════════════════════════ */
    {
      id: 'M20.1', module: 'Debugging & Style', title: 'set -x Tracing',
      brief: '`set -x` enables trace mode — bash prints each command before executing it (with a + prefix). This is the primary bash debugging tool.',
      objective: 'Enable trace mode and run a command: `set -x; echo "tracing"; X=5; echo $((X*2)); set +x`',
      hint: 'set -x  then: echo "tracing"  then: X=5  then: echo $((X*2))  then: set +x',
      check: (s) => s.execHist.some(h => /^set\s+.*-x/.test(h.cmd) || /^set\s+-x/.test(h.cmd)),
      success: 'set -x prints "+ command" before each execution. set +x turns it off. In scripts: run as `bash -x script.sh` to trace without modifying the script. The trace shows variable expansion after substitution, so you see the actual values being used.',
    },
    {
      id: 'M20.2', module: 'Debugging & Style', title: 'set -euo pipefail',
      brief: 'These three options make scripts safer by failing fast instead of silently continuing with broken state.',
      objective: 'Run the template.sh script (which uses set -euo pipefail) and examine the options: `bash ~/scripts/template.sh`',
      hint: 'bash ~/scripts/template.sh  then: read the script: cat ~/scripts/template.sh',
      check: (s) => s.execHist.some(h => /bash\s+.*template\.sh/.test(h.cmd)) || s.execHist.some(h => /set\s+-[euo]+/.test(h.cmd) || /set\s+.*pipefail/.test(h.cmd)),
      success: 'set -e: exit immediately if a command fails. set -u: error if you use an undefined variable. set -o pipefail: a pipe fails if any stage fails (not just the last). Together: `set -euo pipefail` at the top of every script. This turns silent failures into immediate errors.',
    },
    {
      id: 'M20.3', module: 'Debugging & Style', title: 'Common Gotchas',
      brief: 'Bash has several notorious pitfalls. Understanding them saves hours of debugging.',
      objective: 'Explore a gotcha — spaces in variable assignment: try `X = 5` (with spaces) and observe the error, then try `X=5` (correct).',
      hint: 'Try: X = 5  (observe error)  then: X=5  (works)',
      check: (s) => {
        const hist = s.execHist.map(h => h.cmd.trim());
        return hist.some(h => /^[A-Z]\s+=\s+/.test(h)) || hist.some(h => /^[A-Z]=\d+/.test(h));
      },
      success: 'Gotcha list:\n  X = 5   → error: tries to run X as a command\n  X=5     → correct\n  [ $V = x ] → error if $V empty; use [ "$V" = x ]\n  cd mydir && rm -f file   → delete only if cd succeeded\n  cat f | grep p | wc -l → correct\n  for f in $(ls) → breaks with spaces; use *.sh glob instead',
    },
    {
      id: 'M20.4', module: 'Debugging & Style', title: 'Scripting With Style',
      brief: 'Good scripts are readable, safe, and maintainable. The template.sh file demonstrates the best-practice structure.',
      objective: 'Read template.sh carefully: `cat ~/scripts/template.sh` — note the shebang, set -euo pipefail, helper functions, and main().',
      hint: 'cat ~/scripts/template.sh',
      check: (s) => s.execHist.some(h => /cat.*template\.sh/.test(h.cmd)),
      success: 'Best practice script structure:\n  1. Shebang: #!/bin/bash\n  2. set -euo pipefail\n  3. readonly constants\n  4. Helper functions: log(), warn(), die()\n  5. main() function with all logic\n  6. main "$@" at the end\n\nThis structure makes scripts easy to read, test, and debug. The die() function gives a clean error exit from anywhere.',
    },


  // ══════════════════════════════════════════════════════════
  //  MODULE 21 — AWK IN DEPTH
  // ══════════════════════════════════════════════════════════
  {
    id: 'M21.1', module: 'Awk In Depth', title: 'Fields and Records',
    brief: 'Awk processes text line by line, splitting each line into fields. $1 is the first field, $2 the second, $NF is always the last field, and $0 is the whole line.',
    objective: 'Use awk to print just the server names (field 1) from the servers file: `awk \'{print $1}\' ~/data/servers.txt`',
    hint: 'awk \'{print $1}\' ~/data/servers.txt',
    check: (s) => s.execHist.some(h => /awk.*\$1.*servers/.test(h.cmd) || /awk.*print.*\$1.*servers/.test(h.cmd)),
    success: 'In awk, each line is a "record". Fields ($1, $2 ...) are split on whitespace by default. $NF always holds the last field — useful when you don\'t know how many fields there are. $0 is the whole line untouched.',
  },
  {
    id: 'M21.2', module: 'Awk In Depth', title: 'Field Separator',
    brief: 'By default awk splits on whitespace. Use -F to specify a different delimiter. This lets you parse CSV, /etc/passwd, or any structured text.',
    objective: 'Parse the CSV scores file using -F, to print names and scores: `awk -F, \'{print $1, $3}\' ~/data/scores.csv`',
    hint: 'awk -F, \'{print $1, $3}\' ~/data/scores.csv',
    check: (s) => s.execHist.some(h => /-F,/.test(h.cmd) && /scores/.test(h.cmd)),
    success: '-F sets the Field Separator. Common uses:\n  awk -F,   — CSV\n  awk -F:   — /etc/passwd, /etc/group\n  awk -F\\t  — TSV (tab-separated)\n\nInside awk programs you can also set FS="," in a BEGIN block: awk \'BEGIN{FS=","}{print $1}\' file',
  },
  {
    id: 'M21.3', module: 'Awk In Depth', title: 'Pattern Matching',
    brief: 'Awk rules have the form: /pattern/{ action }. The action only runs on lines that match the pattern. Omit the pattern to run on every line.',
    objective: 'Print all offline servers from servers.txt: `awk \'/offline/{print $1, $2}\' ~/data/servers.txt`',
    hint: 'awk \'/offline/{print $1, $2}\' ~/data/servers.txt',
    check: (s) => s.execHist.some(h => /awk.*\/offline\//.test(h.cmd) && /servers/.test(h.cmd)),
    success: 'Pattern/action pairs are the heart of awk:\n  /ERROR/           — match lines containing ERROR\n  !/OK/             — match lines NOT containing OK\n  $3 == "offline"   — match by field value\n  NR > 1            — skip header (first line)\n  NR>=2 && NR<=5    — range of lines\n\nMultiple rules can run on the same line.',
  },
  {
    id: 'M21.4', module: 'Awk In Depth', title: 'BEGIN and END Blocks',
    brief: 'BEGIN runs once before any input is read (great for headers and setup). END runs once after all input (great for totals and summaries).',
    objective: 'Count total lines in servers.txt using END: `awk \'END{print NR}\' ~/data/servers.txt`',
    hint: 'awk \'END{print NR}\' ~/data/servers.txt',
    check: (s) => s.execHist.some(h => /awk.*END.*NR/.test(h.cmd) || /awk.*NR.*END/.test(h.cmd)),
    success: 'NR = Number of Records (current line count). In END, NR = total lines.\n\nCommon BEGIN/END patterns:\n  BEGIN { print "Header" }\n  END   { print "Total:", count }\n  END   { print "Average:", sum/NR }\n  BEGIN { FS="," }  — set field separator without -F',
  },
  {
    id: 'M21.5', module: 'Awk In Depth', title: 'Accumulation and Arithmetic',
    brief: 'Awk variables start at 0/empty automatically. You can accumulate sums and counts across all lines, then report in END.',
    objective: 'Calculate total inventory value (price × quantity): `awk \'{sum += $2 * $3} END{print "Total:", sum}\' ~/data/inventory.txt`',
    hint: 'awk \'{sum += $2 * $3} END{print "Total:", sum}\' ~/data/inventory.txt',
    check: (s) => s.execHist.some(h => /awk.*sum.*\$2.*\$3.*END/.test(h.cmd) || /awk.*\+=.*inventory/.test(h.cmd)),
    success: 'Awk variables initialize to 0 (numeric) or "" (string) automatically.\n\nArithmetic operators: + - * / % ^\nAccumulation: sum += $3  count++\nString concat: name = name " " $1\n\nThe inventory total pattern — accumulate in body, report in END — is one of awk\'s most powerful idioms for log analysis and data processing.',
  },
  {
    id: 'M21.6', module: 'Awk In Depth', title: 'Log Analysis with Awk',
    brief: 'Awk excels at parsing structured log files. Combine pattern matching with accumulation to extract meaningful stats from raw logs.',
    objective: 'Count 403 (Forbidden) responses in access.log: `awk \'/403/{count++} END{print count, "forbidden requests"}\' ~/data/access.log`',
    hint: 'awk \'/403/{count++} END{print count, "forbidden requests"}\' ~/data/access.log',
    check: (s) => s.execHist.some(h => /awk.*403.*count/.test(h.cmd) && /access\.log/.test(h.cmd)),
    success: 'Log analysis is where awk shines. Real-world uses:\n  Count errors by type\n  Sum bandwidth by IP address\n  Find top 10 slowest requests\n  Extract failed login IPs\n  Calculate 4xx/5xx error rates\n\nNow try: awk \'{print $1}\' ~/data/access.log | sort | uniq -c | sort -rn\n— that\'s awk + pipes to count requests per IP address.',
  },

  // ══════════════════════════════════════════════════════════
  //  MODULE 22 — MAKE AND MAKEFILES
  // ══════════════════════════════════════════════════════════
  {
    id: 'M22.1', module: 'Make and Makefiles', title: 'What is Make?',
    brief: 'Make is a build automation tool. You describe targets (things to build), their dependencies, and the commands (recipes) to build them. Make figures out what needs to run.',
    objective: 'Read the Makefile in the projects directory: `cat ~/projects/Makefile`',
    hint: 'cat ~/projects/Makefile',
    check: (s) => s.execHist.some(h => /cat.*Makefile/.test(h.cmd) || /cat.*projects.*Makefile/.test(h.cmd)),
    success: 'A Makefile has three parts:\n  1. Variables   — VAR = value\n  2. Rules        — target: dependencies\n  3. Recipes      — commands to build the target (TAB-indented!)\n\nThe TAB requirement is famous — spaces will cause "missing separator" errors. Always use real tab characters before recipe lines.',
  },
  {
    id: 'M22.2', module: 'Make and Makefiles', title: 'Running Make Targets',
    brief: 'You run make by cd-ing into the directory with the Makefile, then typing `make` (runs first/default target) or `make <target>` for a specific target.',
    objective: 'cd into the projects directory and run the default make target: `cd ~/projects && make`',
    hint: 'cd ~/projects  then: make',
    check: (s) => s.execHist.some(h => /^make(\s|$)/.test(h.cmd.trim())) && s.makeTargets && (s.makeTargets['all'] || s.makeTargets['$(TARGET)'] || Object.keys(s.makeTargets).length > 0),
    success: 'Running `make` with no arguments runs the first target defined in the Makefile (typically called "all"). Make reads the dependency tree and runs only what\'s needed.\n\nKey targets by convention:\n  all     — build everything (default)\n  clean   — delete build artifacts\n  install — copy to system paths\n  test    — run tests\n  help    — show available targets',
  },
  {
    id: 'M22.3', module: 'Make and Makefiles', title: 'Make clean',
    brief: 'The `clean` target is a convention for removing build artifacts. It has no file dependencies — it\'s declared .PHONY so make always runs it.',
    objective: 'Run `make clean` to remove build artifacts',
    hint: 'make clean',
    check: (s) => s.execHist.some(h => /make\s+clean/.test(h.cmd)) && s.makeTargets && s.makeTargets['clean'],
    success: '.PHONY declares targets that don\'t produce a file. Without it, if a file named "clean" existed in the directory, make would think the target was already up-to-date and skip running it.\n\nAlways declare utility targets as .PHONY:\n  .PHONY: all clean install test help lint',
  },
  {
    id: 'M22.4', module: 'Make and Makefiles', title: 'Make Variables',
    brief: 'Makefiles support variables to avoid repetition. Variables are expanded with $(VAR). Automatic variables like $@, $<, $^ are set by make per-rule.',
    objective: 'Inspect the Makefile variables: `grep "^[A-Z]" ~/projects/Makefile`',
    hint: 'grep "^[A-Z]" ~/projects/Makefile',
    check: (s) => s.execHist.some(h => /grep.*Makefile/.test(h.cmd) || /cat.*Makefile/.test(h.cmd)),
    success: 'Make variable types:\n  VAR = value    — recursively expanded (evaluated at use)\n  VAR := value   — simply expanded (evaluated immediately)\n  VAR ?= value   — set only if not already defined\n  VAR += value   — append to existing value\n\nAutomatic variables (per-rule):\n  $@   — the target being built\n  $<   — the first prerequisite\n  $^   — all prerequisites\n  $*   — stem of a pattern rule\n\nPattern rules: %.o: %.c builds any .o from its matching .c',
  },
  {
    id: 'M22.5', module: 'Make and Makefiles', title: 'Make in the Real World',
    brief: 'Make is used far beyond C projects. Python, Go, JavaScript, Docker workflows — anywhere you need repeatable build steps, a Makefile works.',
    objective: 'Read the Python project Makefile: `cat ~/projects/Makefile.py`',
    hint: 'cat ~/projects/Makefile.py',
    check: (s) => s.execHist.some(h => /cat.*Makefile\.py/.test(h.cmd)),
    success: 'Make is language-agnostic. Common non-C uses:\n  Python  — venv setup, pytest, flake8, mypy\n  JS/TS   — npm install, build, lint, test\n  Docker  — build images, push, deploy\n  Docs    — pandoc, sphinx, mkdocs\n  Infra   — terraform plan/apply, helm upgrade\n\nEven when a project has npm scripts or a Taskfile, many teams add a Makefile as the universal entry point — `make install`, `make test`, `make deploy` works regardless of what\'s underneath.',
  },

  // ══════════════════════════════════════════════════════════
  //  MODULE 23 — PACKAGE MANAGEMENT
  // ══════════════════════════════════════════════════════════
  {
    id: 'M23.1', module: 'Package Management', title: 'What is a Package?',
    brief: 'A package bundles a program, its files, and metadata (version, dependencies, description). Package managers download, install, and track these for you.',
    objective: 'List all installed packages: `dpkg -l`',
    hint: 'dpkg -l',
    check: (s) => s.execHist.some(h => /dpkg\s+-l/.test(h.cmd)),
    success: 'dpkg is the low-level tool. It reads the local package database. The columns show:\n  ii   — desired: Install, status: Installed (all good)\n  rc   — removed but config files remain\n  un   — unknown/not installed\n\ndpkg works on .deb files directly. apt is the higher-level tool that also handles downloading from repositories and resolving dependencies.',
  },
  {
    id: 'M23.2', module: 'Package Management', title: 'Refreshing the Package Index',
    brief: '`apt update` downloads the list of available packages from the configured repositories. It doesn\'t install anything — it just refreshes what apt knows about.',
    objective: 'Refresh the package index: `apt update`',
    hint: 'apt update',
    check: (s) => s.execHist.some(h => /apt(-get)?\s+update/.test(h.cmd)),
    success: 'Repository sources are listed in /etc/apt/sources.list and /etc/apt/sources.list.d/.\n\nWorkflow:\n  1. apt update    — refresh the package index (always first)\n  2. apt upgrade   — upgrade installed packages\n  3. apt install   — install new packages\n\nNever run apt install without apt update first — the local index may be stale and you\'ll get version conflicts.',
  },
  {
    id: 'M23.3', module: 'Package Management', title: 'Searching for Packages',
    brief: '`apt search` queries package names and descriptions. Use it to find a package when you know what you need but not the exact name.',
    objective: 'Search for a JSON processing tool: `apt search json`',
    hint: 'apt search json',
    check: (s) => s.execHist.some(h => /apt(-get)?\s+search/.test(h.cmd)),
    success: 'Search tips:\n  apt search <term>          — search by name/description\n  apt show <pkg>             — detailed info before installing\n  dpkg -l | grep <term>      — search already-installed packages\n  dpkg -L <pkg>              — list files a package installed\n  dpkg -s <pkg>              — show installed package status\n\nFor broader discovery: apt search "." | head -40 lists all packages.',
  },
  {
    id: 'M23.4', module: 'Package Management', title: 'Installing a Package',
    brief: '`apt install` downloads and installs a package from the repository. Use -y to skip the confirmation prompt in scripts.',
    objective: 'Install jq (a JSON processor): `apt install jq`',
    hint: 'apt install jq',
    check: (s) => s.execHist.some(h => /apt(-get)?\s+install\s+jq/.test(h.cmd)) && s.packages && s.packages.installed['jq'],
    success: 'After installing, jq is available as a command. In scripts, use -y to avoid interactive prompts:\n  apt install -y jq tmux fzf\n\napt handles dependencies automatically — if jq needed libonig, it would install that too.\n\nThe flow:\n  Download .deb from repository → Verify checksum → Unpack → Run post-install scripts → Update package database',
  },
  {
    id: 'M23.5', module: 'Package Management', title: 'Inspecting and Removing Packages',
    brief: '`apt show` gives full details. `apt remove` uninstalls but keeps config files. `apt purge` removes everything including config.',
    objective: 'Show details for the package you just installed, then check installed list: `apt show jq` then `dpkg -l jq`',
    hint: 'apt show jq  then: dpkg -l jq',
    check: (s) => s.execHist.some(h => /apt(-get)?\s+show/.test(h.cmd)) || s.execHist.some(h => /dpkg\s+-l\s+\w/.test(h.cmd) || /dpkg\s+-s/.test(h.cmd)),
    success: 'Package inspection commands:\n  apt show <pkg>      — version, size, description, dependencies\n  dpkg -l <pkg>       — one-line installed status\n  dpkg -s <pkg>       — full status from local db\n  dpkg -L <pkg>       — list every file the package installed\n  apt list --installed — all installed packages\n\nTo clean up:\n  apt remove <pkg>    — uninstall (keep config)\n  apt purge <pkg>     — uninstall + delete config\n  apt autoremove      — remove orphaned dependencies',
  },

  // ══════════════════════════════════════════════════════════
  //  MODULE 24 — ENVIRONMENT AND PATH
  // ══════════════════════════════════════════════════════════
  {
    id: 'M24.1', module: 'Environment & PATH', title: 'The Environment',
    brief: 'Every process inherits an environment — a set of key=value pairs. Environment variables control behavior: HOME, USER, SHELL, TERM, LANG, and most importantly PATH.',
    objective: 'View your full environment: `env` — then find your PATH: `echo $PATH`',
    hint: 'env  then: echo $PATH',
    check: (s) => s.execHist.some(h => /^env$/.test(h.cmd.trim())) && s.execHist.some(h => /echo.*\$PATH/.test(h.cmd)),
    success: 'The environment is inherited from parent to child process. When you run a script, it gets a copy of the current environment.\n\nKey variables:\n  PATH    — directories searched for commands\n  HOME    — your home directory\n  USER    — your username\n  SHELL   — path to your shell\n  TERM    — terminal type\n  EDITOR  — default text editor\n  LANG    — locale/language settings',
  },
  {
    id: 'M24.2', module: 'Environment & PATH', title: 'How PATH Works',
    brief: 'When you type a command, the shell searches each directory in PATH left-to-right and runs the first match it finds. `which` tells you exactly which binary would run.',
    objective: 'Find where bash and grep live using which: `which bash` and `which grep`',
    hint: 'which bash  then: which grep',
    check: (s) => s.execHist.some(h => /which\s+bash/.test(h.cmd)) || s.execHist.some(h => /which\s+grep/.test(h.cmd)),
    success: 'PATH is colon-separated: /usr/local/bin:/usr/bin:/bin\n\nLeft-to-right precedence means you can override system commands by putting your own directory first:\n  PATH="$HOME/bin:$PATH"\n\nThis is why ~/.local/bin at the front of PATH lets user-installed tools shadow system tools.\n\n`which` shows the first match. If a command runs differently than expected, check `which cmd` — you might be hitting an alias or a shadowed binary.',
  },
  {
    id: 'M24.3', module: 'Environment & PATH', title: 'Setting and Exporting Variables',
    brief: 'Variables set with VAR=value are shell-local — child processes don\'t see them. `export` promotes a variable into the environment so it\'s inherited.',
    objective: 'Set a variable, export it, and verify it appears in env: `export MYVAR="hello"` then `env | grep MYVAR`',
    hint: 'export MYVAR="hello"  then: env | grep MYVAR',
    check: (s) => {
      const hist = s.execHist.map(h => h.cmd);
      return hist.some(h => /export\s+MYVAR/.test(h)) && hist.some(h => /env.*grep.*MYVAR|grep.*MYVAR.*env/.test(h));
    },
    success: 'The difference:\n  X=5          — shell variable, NOT in environment\n  export X=5   — environment variable, inherited by children\n  export X     — export an already-set variable\n\nChildren inherit environment but NOT shell variables. This is why scripts run with `bash script.sh` don\'t see your shell functions or non-exported variables.\n\nTo remove: unset X\nTo see only env vars: env (not set or declare)',
  },
  {
    id: 'M24.4', module: 'Environment & PATH', title: 'Modifying PATH',
    brief: 'Adding a directory to PATH makes executables in that directory available as commands. Always append the old PATH with $PATH to avoid losing existing entries.',
    objective: 'Add ~/bin to your PATH and verify: `export PATH="$HOME/bin:$PATH"` then `echo $PATH`',
    hint: 'export PATH="$HOME/bin:$PATH"  then: echo $PATH',
    check: (s) => {
      const hist = s.execHist.map(h => h.cmd);
      return hist.some(h => /export\s+PATH.*HOME.*PATH|export\s+PATH.*~.*PATH/.test(h));
    },
    success: 'PATH modification patterns:\n  export PATH="$HOME/bin:$PATH"       — prepend (higher priority)\n  export PATH="$PATH:$HOME/bin"       — append (lower priority)\n\nTo make permanent, add to ~/.bashrc or ~/.bash_profile:\n  echo \'export PATH="$HOME/bin:$PATH"\' >> ~/.bashrc\n\nCommon PATH additions:\n  ~/.local/bin       — user-installed Python tools (pip install --user)\n  ~/bin              — personal scripts\n  /opt/sometool/bin  — manually installed software',
  },
  {
    id: 'M24.5', module: 'Environment & PATH', title: 'Persistent Configuration with .bashrc',
    brief: '.bashrc is loaded every time an interactive shell starts. It\'s where you put exports, aliases, and PATH modifications that should survive across sessions.',
    objective: 'Inspect your .bashrc to see how it sets PATH and aliases: `cat ~/.bashrc`',
    hint: 'cat ~/.bashrc',
    check: (s) => s.execHist.some(h => /cat.*\.bashrc/.test(h.cmd)),
    success: '.bashrc vs .bash_profile:\n  .bashrc        — interactive non-login shells (most terminal windows)\n  .bash_profile  — login shells (SSH, TTY login)\n  .profile       — POSIX sh, read by many login shells\n\nBest practice: put everything in .bashrc, then source it from .bash_profile:\n  # in ~/.bash_profile:\n  [ -f ~/.bashrc ] && source ~/.bashrc\n\nSource changes without restarting:\n  source ~/.bashrc\n  . ~/.bashrc    (same thing)',
  },
  {
    id: 'M24.6', module: 'Environment & PATH', title: 'Environment Diagnostics',
    brief: 'When a command isn\'t found or behaves unexpectedly, the environment is usually the culprit. A few commands help you diagnose what\'s happening.',
    objective: 'Run the environment diagnostic script: `bash ~/scripts/env-check.sh`',
    hint: 'bash ~/scripts/env-check.sh',
    check: (s) => s.execHist.some(h => /bash.*env-check\.sh/.test(h.cmd)),
    success: 'Diagnostic toolkit:\n  which cmd         — which binary runs for "cmd"\n  type cmd          — is it a function, alias, or binary?\n  echo $PATH        — what directories are searched\n  env               — full environment\n  env | grep VAR    — find a specific variable\n  printenv VAR      — print one variable\n  set               — all shell variables + functions\n\nCommon problems:\n  "command not found" → binary not in PATH\n  wrong version runs  → earlier PATH entry shadows it\n  variable undefined  → not exported, or typo\n  config ignored      → wrong file (.bashrc vs .bash_profile)',
  },

  // ══════════════════════════════════════════════════════════
  //  MODULE 25 — SSH & REMOTE ACCESS
  // ══════════════════════════════════════════════════════════
  {
    id: 'M25.1', module: 'SSH & Remote Access', title: 'Connecting with SSH',
    brief: 'SSH (Secure Shell) lets you log into and run commands on remote machines over an encrypted connection. It\'s the standard way to administer Linux servers.',
    objective: 'Connect to the remote server: `ssh deploy@enclave.local`',
    hint: 'ssh deploy@enclave.local',
    check: (s) => s.execHist.some(h => /ssh\s+\S+@\S+/.test(h.cmd) || /ssh\s+enclave/.test(h.cmd)),
    success: 'SSH uses public-key cryptography. When you first connect, you see a fingerprint warning and are asked to trust the host key (stored in ~/.ssh/known_hosts). Once added, future connections are verified automatically.\n\nSSH port is 22 by default. Use -p to specify another:\n  ssh -p 2222 user@host\n\nYou\'re now on the remote shell. Your prompt changes to show the remote hostname.',
  },
  {
    id: 'M25.2', module: 'SSH & Remote Access', title: 'Navigating the Remote',
    brief: 'Once connected, you\'re in a full shell on the remote server. Commands operate on the remote filesystem. Your local files aren\'t accessible until you copy them.',
    objective: 'On the remote server, explore the layout: `ls /var/www/app` and `cat /home/deploy/config.env`',
    hint: 'ls /var/www/app  then: cat /home/deploy/config.env',
    check: (s) => s.sshSession && s.execHist.some(h => /ls.*\/var\/www/.test(h.cmd) || /cat.*config\.env/.test(h.cmd)),
    success: 'The remote server has its own filesystem, users, processes, and configuration. Nothing from your local machine is visible here.\n\nUseful orientation commands on a new server:\n  uname -a        — OS and kernel version\n  df -h           — disk usage\n  free -h         — memory usage\n  uptime          — load average\n  whoami          — confirm your username\n  pwd             — where you landed',
  },
  {
    id: 'M25.3', module: 'SSH & Remote Access', title: 'Running Remote Commands',
    brief: 'You can run a single command on a remote host without starting an interactive session. SSH executes it and returns output to your local terminal.',
    objective: 'Exit the remote session first (`exit`), then run a command non-interactively: `ssh deploy@enclave.local "cat /var/www/app/app.log"`',
    hint: 'exit  then: ssh deploy@enclave.local "cat /var/www/app/app.log"',
    check: (s) => {
      const hist = s.execHist.map(h => h.cmd);
      return hist.some(h => /ssh\s+\S+\s+"[^"]+"/.test(h) || /ssh\s+\S+\s+cat/.test(h));
    },
    success: 'Non-interactive SSH is powerful for automation:\n  ssh host "cmd"              — run one command\n  ssh host "cmd1; cmd2"       — run a sequence\n  ssh host "bash -s" < script.sh  — run a local script remotely\n\nThis is the basis of deployment scripts, monitoring, and CI/CD pipelines. The exit code from the remote command is returned to the local shell, so you can use it in conditionals.',
  },
  {
    id: 'M25.4', module: 'SSH & Remote Access', title: 'Copying Files with SCP',
    brief: 'SCP (Secure Copy Protocol) copies files over SSH. Syntax mirrors cp but you prefix remote paths with user@host:',
    objective: 'Copy config.env from the remote server to your local home directory: `scp deploy@enclave.local:/home/deploy/config.env ~/config.env`',
    hint: 'scp deploy@enclave.local:/home/deploy/config.env ~/config.env',
    check: (s) => s.execHist.some(h => /scp\s+.*enclave.*config/.test(h.cmd) || /scp\s+.*:\/.+\.env/.test(h.cmd)),
    success: 'SCP syntax:\n  scp local remote          — upload\n  scp remote local          — download\n  scp -r dir/ remote/       — recursive (directories)\n  scp -P 2222 ...           — custom port\n\nCopy a file up to the server:\n  scp script.sh deploy@enclave.local:/home/deploy/\n\nModern systems prefer rsync for larger transfers:\n  rsync -avz localdir/ user@host:remotedir/',
  },
  {
    id: 'M25.5', module: 'SSH & Remote Access', title: 'SSH Keys',
    brief: 'Password auth is slow and insecure. SSH key pairs — a private key you keep, and a public key you deploy — allow passwordless, cryptographically secure login.',
    objective: 'Look at how an SSH key-based workflow functions — examine the remote deploy script: `ssh deploy@enclave.local "cat /home/deploy/deploy.sh"`',
    hint: 'ssh deploy@enclave.local "cat /home/deploy/deploy.sh"',
    check: (s) => s.execHist.some(h => /ssh.*deploy\.sh/.test(h.cmd) || /cat.*deploy\.sh/.test(h.cmd)),
    success: 'SSH key workflow:\n  1. Generate: ssh-keygen -t ed25519 -C "your@email"\n     → creates ~/.ssh/id_ed25519 (private) + id_ed25519.pub (public)\n  2. Copy public key to server:\n     ssh-copy-id user@host\n     → appends to ~/.ssh/authorized_keys on the server\n  3. Now ssh user@host works without a password\n\nNever share your private key. The public key is safe to share anywhere.\n\nFor CI/CD, generate a dedicated keypair with no passphrase and store the private key as a secret in your pipeline.',
  },

  // ══════════════════════════════════════════════════════════
  //  MODULE 26 — GIT
  // ══════════════════════════════════════════════════════════
  {
    id: 'M26.1', module: 'Git', title: 'Initializing a Repository',
    brief: 'Git tracks changes to files inside a repository. `git init` creates a new repo in the current directory, adding a hidden .git/ folder that stores all history.',
    objective: 'Create a new project directory, cd into it, and initialize a git repo: `mkdir myproject && cd myproject && git init`',
    hint: 'mkdir myproject && cd myproject && git init',
    check: (s) => Object.keys(s.gitRepos).some(p => p.endsWith('myproject') || p.includes('myproject')),
    success: 'git init creates the .git/ directory — the entire history, branches, config, and staging area live here. Never delete or modify .git/ manually.\n\nKey concepts:\n  Working tree  — files you can see and edit\n  Staging area  — files prepared for the next commit (git add)\n  Repository    — the committed history (.git/)\n\nGit tracks content, not files. A file with no changes takes no space in a new commit.',
  },
  {
    id: 'M26.2', module: 'Git', title: 'Staging and Committing',
    brief: 'Changes go through two steps: staging (git add) and committing (git commit). This two-step design lets you precisely control which changes go into each commit.',
    objective: 'Create a file, stage it, and commit: `echo "# My Project" > README.md && git add README.md && git commit -m "Initial commit"`',
    hint: 'echo "# My Project" > README.md  then: git add README.md  then: git commit -m "Initial commit"',
    check: (s) => {
      const repo = Object.values(s.gitRepos)[0];
      return repo && repo.commits.length > 0;
    },
    success: 'The staging area (also called the "index") is a preview of your next commit. This lets you:\n  - Commit only some of your changes\n  - Review what will be committed before committing\n  - Group related changes into logical commits\n\nCommon staging patterns:\n  git add file.txt      — stage one file\n  git add .             — stage everything in current dir\n  git add -p            — interactively stage hunks\n\nGood commit messages: short summary (≤72 chars), present tense, explains WHY not WHAT.',
  },
  {
    id: 'M26.3', module: 'Git', title: 'Checking Status and History',
    brief: '`git status` shows what\'s staged, modified, or untracked. `git log` shows the commit history. These two commands are your primary orientation tools.',
    objective: 'Check the current status and view the log: `git status` then `git log --oneline`',
    hint: 'git status  then: git log --oneline',
    check: (s) => s.execHist.some(h => /git\s+status/.test(h.cmd)) && s.execHist.some(h => /git\s+log/.test(h.cmd)),
    success: 'git log options:\n  --oneline         — compact one-line format\n  --oneline --graph — ASCII branch graph\n  -n 10             — last 10 commits\n  --author="name"   — filter by author\n  --since="1 week"  — filter by date\n  -p                — show patches (diffs)\n\ngit show HEAD        — full details of last commit\ngit show abc1234     — specific commit by SHA\n\nThe SHA (commit hash) uniquely identifies every commit. You only need the first 7 characters to reference one.',
  },
  {
    id: 'M26.4', module: 'Git', title: 'Viewing Differences',
    brief: '`git diff` shows what changed in your working tree vs the last commit. It\'s how you review your work before staging.',
    objective: 'Modify README.md, then view the diff: edit the file with vim or echo, then run `git diff`',
    hint: 'echo "More content" >> README.md  then: git diff',
    check: (s) => s.execHist.some(h => /git\s+diff/.test(h.cmd)),
    success: 'Reading a diff:\n  --- a/file   — old version\n  +++ b/file   — new version\n  -line        — removed line (red)\n  +line        — added line (green)\n   line        — unchanged context\n\ndiff variants:\n  git diff            — working tree vs staging area\n  git diff --staged   — staging area vs last commit\n  git diff HEAD       — working tree vs last commit\n  git diff branch1 branch2  — between branches\n\nTip: before every commit, run git diff --staged to double-check exactly what you\'re about to record.',
  },
  {
    id: 'M26.5', module: 'Git', title: 'Branches',
    brief: 'Branches let you work on features or fixes in isolation without affecting the main codebase. Creating a branch is instant — it\'s just a pointer to a commit.',
    objective: 'Create a new branch and switch to it: `git branch feature && git checkout feature`  (or `git checkout -b feature`)',
    hint: 'git checkout -b feature',
    check: (s) => {
      const repo = Object.values(s.gitRepos)[0];
      return repo && repo.branch !== 'main' && Object.keys(repo.branches).length > 1;
    },
    success: 'Branch commands:\n  git branch                — list branches (* = current)\n  git branch name           — create branch\n  git checkout name         — switch to branch\n  git checkout -b name      — create and switch\n  git branch -d name        — delete (safe — must be merged)\n  git branch -D name        — force delete\n\nBranching strategies:\n  Feature branches — one branch per feature/fix\n  Gitflow — main, develop, feature/*, release/*, hotfix/*\n  Trunk-based — frequent merges to main, short-lived branches\n\nAlways create a branch before starting new work. Never commit directly to main.',
  },
  {
    id: 'M26.6', module: 'Git', title: 'Merging',
    brief: 'When your branch work is ready, you merge it back into main. Git combines the two histories, and if the same lines were changed differently, you get a conflict to resolve.',
    objective: 'Make a commit on your feature branch, switch back to main, and merge: `git commit -m "feature work"` then `git checkout main && git merge feature`',
    hint: 'git add . && git commit -m "feature work"  then: git checkout main  then: git merge feature',
    check: (s) => s.execHist.some(h => /git\s+merge/.test(h.cmd)),
    success: 'Merge types:\n  Fast-forward  — no divergence; just moves the pointer forward (cleanest)\n  Recursive     — branches diverged; creates a merge commit\n  Conflict      — same lines changed differently; must resolve manually\n\nResolving conflicts:\n  1. git status — see conflicted files\n  2. Edit files — look for <<<<<<<, =======, >>>>>>>\n  3. git add file — mark resolved\n  4. git commit — complete the merge\n\nTo undo a bad merge: git merge --abort (before committing)',
  },
  {
    id: 'M26.7', module: 'Git', title: 'Cloning and Remotes',
    brief: 'Remote repositories (on GitHub, GitLab, etc.) let teams collaborate. `git clone` downloads a repo. `git push` uploads your commits. `git pull` downloads updates.',
    objective: 'Clone a repository: `git clone https://github.com/example/hello-world`',
    hint: 'git clone https://github.com/example/hello-world',
    check: (s) => s.execHist.some(h => /git\s+clone/.test(h.cmd)),
    success: 'Remote workflow:\n  git clone url           — download entire repo\n  git remote -v           — list remotes\n  git fetch               — download changes (don\'t merge)\n  git pull                — fetch + merge (git fetch + git merge)\n  git push origin main    — upload commits to remote\n  git push -u origin branch — push + set upstream tracking\n\nPull Request / Merge Request workflow:\n  1. Fork or create a branch\n  2. Make commits\n  3. Push to your remote\n  4. Open PR/MR on GitHub/GitLab\n  5. Review, approve, merge',
  },

  // ══════════════════════════════════════════════════════════
  //  MODULE 27 — CRON & JOB SCHEDULING
  // ══════════════════════════════════════════════════════════
  {
    id: 'M27.1', module: 'Cron & Scheduling', title: 'How Cron Works',
    brief: 'Cron is a time-based job scheduler. It runs commands at specified intervals — daily backups, hourly log rotation, weekly reports. It\'s been part of Unix since the 1970s.',
    objective: 'List your current crontab: `crontab -l`',
    hint: 'crontab -l',
    check: (s) => s.execHist.some(h => /crontab\s+-l/.test(h.cmd)),
    success: 'Cron syntax — five time fields followed by the command:\n  m  h  dom  mon  dow  command\n  │  │   │    │    └── day of week (0=Sun, 6=Sat)\n  │  │   │    └─────── month (1-12)\n  │  │   └──────────── day of month (1-31)\n  │  └──────────────── hour (0-23)\n  └─────────────────── minute (0-59)\n\n  *  = any value\n  */n = every n units\n  1,3,5 = specific values\n  1-5 = range\n\nExamples:\n  0 2 * * *       daily at 2:00 AM\n  */15 * * * *    every 15 minutes\n  0 9 * * 1       every Monday at 9 AM\n  0 0 1 * *       first of every month at midnight',
  },
  {
    id: 'M27.2', module: 'Cron & Scheduling', title: 'Editing the Crontab',
    brief: '`crontab -e` opens your crontab in the default editor. Each line is a scheduled job. Comments (# lines) are ignored.',
    objective: 'Open the crontab editor: `crontab -e` — add a line like `0 2 * * * /home/user/scripts/backup.sh` and save',
    hint: 'crontab -e  (then in vim: i to insert, type the job line, Esc :wq to save)',
    check: (s) => s.execHist.some(h => /crontab\s+-e/.test(h.cmd)) || s.crontab.length > 0,
    success: 'After saving, cron reads the new file automatically — no restart needed.\n\nCrontab best practices:\n  1. Use absolute paths: /home/user/scripts/backup.sh not ~/scripts/backup.sh\n  2. Redirect output: cmd >> /var/log/job.log 2>&1\n  3. Test commands manually before adding to crontab\n  4. Add a comment above each job explaining what it does\n  5. Set MAILTO="" to silence email notifications (or MAILTO=you@email.com to enable)\n\nAlways test with a near-future time first, then adjust.',
  },
  {
    id: 'M27.3', module: 'Cron & Scheduling', title: 'At — One-time Jobs',
    brief: '`at` schedules a command to run once at a specific time, unlike cron which repeats. Useful for one-off tasks: send this report at 5pm, restart after midnight.',
    objective: 'Schedule a one-time job: `at now+1hour` — then list pending jobs with `at -l`',
    hint: 'at now+1hour  then: at -l',
    check: (s) => s.execHist.some(h => /^at\s+/.test(h.cmd.trim())) && s.execHist.some(h => /at\s+-l/.test(h.cmd)),
    success: 'at time formats:\n  at now+1min     — 1 minute from now\n  at now+2hours   — 2 hours from now\n  at 14:30        — today at 2:30 PM\n  at midnight     — tonight at midnight\n  at noon         — today at noon\n  at 9am tomorrow — tomorrow morning\n\nat commands:\n  at -l   (or atq)  — list pending jobs\n  at -r N (or atrm) — remove job N\n\nFor scripts run with at, redirect output — at jobs have no terminal:\n  echo "/home/user/scripts/report.sh >> /tmp/report.log 2>&1" | at 6pm',
  },
  {
    id: 'M27.4', module: 'Cron & Scheduling', title: 'Cron in Practice',
    brief: 'Real cron jobs need careful output handling, locking to prevent overlaps, and logging. These patterns make the difference between a reliable job and a silent failure.',
    objective: 'View the backup script to see how it would be used in a cron job: `cat ~/scripts/backup.sh`',
    hint: 'cat ~/scripts/backup.sh',
    check: (s) => s.execHist.some(h => /cat.*backup\.sh/.test(h.cmd)),
    success: 'Production cron job pattern:\n  # Daily backup at 2 AM, log output\n  0 2 * * * /home/user/scripts/backup.sh >> /var/log/backup.log 2>&1\n\nReliability checklist:\n  ✓ Absolute paths everywhere\n  ✓ Redirect stdout + stderr: >> log.log 2>&1\n  ✓ Lock file to prevent overlap: flock -n /tmp/job.lock cmd\n  ✓ Exit code checking in script (set -e)\n  ✓ Alert on failure: cmd || mail -s "FAILED" admin@host\n  ✓ Log rotation so logs don\'t grow forever\n\nSystemd timers are the modern alternative — more robust tracking and easier status checking with systemctl status.',
  },

  // ══════════════════════════════════════════════════════════
  //  MODULE 28 — PROCESS MANAGEMENT
  // ══════════════════════════════════════════════════════════
  {
    id: 'M28.1', module: 'Process Management', title: 'Viewing Running Processes',
    brief: 'Every running program is a process with a unique PID (Process ID). `ps` shows them. Understanding processes is essential for debugging, performance analysis, and system administration.',
    objective: 'See all running processes: `ps aux`',
    hint: 'ps aux',
    check: (s) => s.execHist.some(h => /ps\s+(aux|ef|-ef|-aux)/.test(h.cmd) || /ps\s+aux/.test(h.cmd)),
    success: 'ps aux columns:\n  USER  — who owns the process\n  PID   — process ID (unique number)\n  %CPU  — CPU usage percentage\n  %MEM  — memory percentage\n  VSZ   — virtual memory size\n  STAT  — state: S=sleeping, R=running, Z=zombie, T=stopped\n  START — when it started\n  CMD   — the command\n\nps -ef shows parent PIDs (PPID) — useful for seeing process trees.\n\nFor live updating: htop (interactive) or top (classic).\nFor one process: ps -p PID',
  },
  {
    id: 'M28.2', module: 'Process Management', title: 'Filtering Processes',
    brief: '`ps aux` output can be long. Pipe it through grep to find what you\'re looking for, or use pgrep which searches by name directly.',
    objective: 'Find the nginx process using grep and pgrep: `ps aux | grep nginx` then `pgrep nginx`',
    hint: 'ps aux | grep nginx  then: pgrep nginx',
    check: (s) => s.execHist.some(h => /ps.*grep.*nginx|grep.*nginx.*ps/.test(h.cmd) || /pgrep/.test(h.cmd)),
    success: 'Process search tools:\n  ps aux | grep name   — search ps output (also shows grep itself)\n  pgrep name           — PIDs of matching processes\n  pgrep -l name        — PIDs + names\n  pgrep -u user        — processes owned by user\n  pkill name           — kill by name\n\nNote: ps aux | grep process always shows one extra line — the grep command itself. Filter it out:\n  ps aux | grep [n]ginx  — the bracket trick avoids matching "grep nginx"',
  },
  {
    id: 'M28.3', module: 'Process Management', title: 'Signals and Kill',
    brief: 'Processes communicate via signals. `kill` sends signals to processes by PID. The most common: SIGTERM (polite stop) and SIGKILL (force stop). Most things should get SIGTERM first.',
    objective: 'Send SIGTERM to a process — find a PID with `pgrep python3` then kill it: `kill <PID>`',
    hint: 'pgrep python3  then: kill <PID>',
    check: (s) => s.execHist.some(h => /kill\s+\d+/.test(h.cmd) || /kill\s+-/.test(h.cmd)),
    success: 'Common signals:\n  SIGTERM (15) — politely ask to stop (default: kill PID)\n  SIGKILL (9)  — force stop, cannot be caught: kill -9 PID\n  SIGHUP  (1)  — reload config (nginx, sshd use this)\n  SIGSTOP      — pause process (Ctrl+Z)\n  SIGCONT      — resume paused process\n\nNever jump straight to kill -9. SIGTERM lets the process clean up. Use -9 only when SIGTERM doesn\'t work.\n\nkill -l — list all signals\nkill -HUP $(pgrep nginx) — reload nginx config without restarting',
  },
  {
    id: 'M28.4', module: 'Process Management', title: 'Background Jobs',
    brief: 'Running a command with & puts it in the background so your terminal stays usable. `jobs` lists background jobs. `fg` brings one to the foreground; `bg` resumes a stopped job in the background.',
    objective: 'Run a command in the background: `sleep 30 &` then check jobs: `jobs`',
    hint: 'sleep 30 &  then: jobs',
    check: (s) => s.execHist.some(h => /\s*&\s*$/.test(h.cmd) || h.cmd.endsWith('&')) && s.execHist.some(h => /^jobs$/.test(h.cmd.trim())),
    success: 'Job control:\n  cmd &       — start in background\n  Ctrl+Z      — suspend foreground job (sends SIGSTOP)\n  jobs        — list background/suspended jobs\n  fg          — bring last job to foreground\n  fg %2       — bring job 2 to foreground\n  bg          — resume suspended job in background\n  bg %2       — resume job 2 in background\n  kill %1     — kill job 1 by job number\n\nLong-running background jobs:\n  Use nohup cmd & to keep running after logout\n  Use tmux or screen for persistent sessions\n  Redirect output: nohup cmd > output.log 2>&1 &',
  },
  {
    id: 'M28.5', module: 'Process Management', title: 'Process Analysis Patterns',
    brief: 'Combining ps, grep, awk, and kill lets you build powerful one-liners for process management — finding memory hogs, killing stuck processes, monitoring specific services.',
    objective: 'Find which user owns the most processes: `ps aux | awk \'{print $1}\' | sort | uniq -c | sort -rn | head -5`',
    hint: 'ps aux | awk \'{print $1}\' | sort | uniq -c | sort -rn | head -5',
    check: (s) => s.execHist.some(h => /ps.*awk.*sort/.test(h.cmd) || /ps.*grep.*kill/.test(h.cmd) || /ps.*sort.*uniq/.test(h.cmd)),
    success: 'Process management one-liners:\n  # Top memory consumers\n  ps aux --sort=-%mem | head -10\n\n  # Kill all processes matching name\n  pkill -f "python3 app.py"\n\n  # Watch a process count every 2s\n  watch -n2 "ps aux | grep nginx | wc -l"\n\n  # Find what\'s using port 8080\n  ss -tlnp | grep 8080\n  lsof -i :8080\n\n  # Kill zombie processes (parent PID)\n  ps aux | awk \'$8=="Z"{print $2}\' | xargs kill',
  },

  // ══════════════════════════════════════════════════════════
  //  MODULE 29 — curl & HTTP
  // ══════════════════════════════════════════════════════════
  {
    id: 'M29.1', module: 'curl & HTTP', title: 'Making HTTP Requests',
    brief: 'curl is a command-line HTTP client. It lets you interact with web APIs, download files, and test services — all from the terminal. It\'s indispensable for scripting and debugging.',
    objective: 'Make your first API request: `curl https://api.example.com/health`',
    hint: 'curl https://api.example.com/health',
    check: (s) => s.execHist.some(h => /curl\s+https?:\/\//.test(h.cmd) || /curl\s+http/.test(h.cmd)),
    success: 'curl sends HTTP requests and prints the response body to stdout. Basic usage:\n  curl url              — GET request (default)\n  curl -o file url      — save to file\n  curl -O url           — save with remote filename\n  curl -L url           — follow redirects\n  curl -s url           — silent (no progress bar)\n  curl -v url           — verbose (see full request/response)\n  curl -I url           — HEAD request (headers only)\n\nThe response you got is JSON — the health endpoint shows version and uptime.',
  },
  {
    id: 'M29.2', module: 'curl & HTTP', title: 'Viewing Response Headers',
    brief: 'HTTP responses include headers — metadata like content-type, status codes, cache settings, and server info. `-i` includes headers in the output; `-I` fetches headers only.',
    objective: 'View the response headers: `curl -i https://api.example.com/users`',
    hint: 'curl -i https://api.example.com/users',
    check: (s) => s.execHist.some(h => /curl\s+-[iI]/.test(h.cmd)),
    success: 'Key HTTP headers:\n  HTTP/2 200          — status code (200=OK, 404=Not Found, 500=Error)\n  content-type        — data format (application/json, text/html)\n  content-length      — response size in bytes\n  authorization       — auth token\n  cache-control       — caching instructions\n  x-request-id        — unique request identifier\n\nCommon status codes:\n  2xx  Success: 200 OK, 201 Created, 204 No Content\n  3xx  Redirect: 301 Permanent, 302 Temporary\n  4xx  Client error: 400 Bad Request, 401 Unauthorized, 403 Forbidden, 404 Not Found\n  5xx  Server error: 500 Internal, 502 Bad Gateway, 503 Unavailable',
  },
  {
    id: 'M29.3', module: 'curl & HTTP', title: 'POST Requests and Data',
    brief: 'GET retrieves data; POST sends data. curl can send any HTTP method with -X and data with -d. This is how you create resources, submit forms, and call write APIs.',
    objective: 'Send a POST request with JSON data: `curl -X POST https://api.example.com/users -H "Content-Type: application/json" -d \'{"name":"Dave"}\'`',
    hint: 'curl -X POST https://api.example.com/users -H "Content-Type: application/json" -d \'{"name":"Dave"}\'',
    check: (s) => s.execHist.some(h => /curl.*-X\s+POST|curl.*POST.*-d/.test(h.cmd)),
    success: 'Common curl request patterns:\n  # POST JSON\n  curl -X POST url -H "Content-Type: application/json" -d \'{"key":"val"}\'\n\n  # PUT to update\n  curl -X PUT url/1 -d \'{"name":"New"}\'\n\n  # DELETE\n  curl -X DELETE url/1\n\n  # With auth token\n  curl -H "Authorization: Bearer $TOKEN" url\n\n  # POST form data\n  curl -X POST url -d "user=alice&pass=secret"\n\n  # Read data from file\n  curl -X POST url -d @payload.json\n\nAlways set Content-Type when sending JSON — many APIs reject requests without it.',
  },
  {
    id: 'M29.4', module: 'curl & HTTP', title: 'Downloading Files with wget',
    brief: 'wget specializes in downloading files, especially large ones or whole websites. It handles retries, resumes interrupted downloads, and can mirror sites recursively.',
    objective: 'Download a file with wget: `wget https://api.example.com/users`',
    hint: 'wget https://api.example.com/users',
    check: (s) => s.execHist.some(h => /wget\s+/.test(h.cmd)),
    success: 'wget vs curl for downloads:\n  curl is better for: API calls, custom headers, POST/PUT/DELETE, piping\n  wget is better for: downloading files, retries, recursive mirroring\n\nwget flags:\n  wget url                 — download to current dir\n  wget -O file url         — specify output filename\n  wget -q url              — quiet (no progress)\n  wget -c url              — continue interrupted download\n  wget -r url              — recursive (mirror a site)\n  wget --limit-rate=100k   — throttle download speed\n  wget -i urls.txt         — download list of URLs from file\n\nFor scripts: wget -q -O - url | process  (pipe output like curl)',
  },
  {
    id: 'M29.5', module: 'curl & HTTP', title: 'curl in Scripts',
    brief: 'curl is most powerful in scripts — polling an API, triggering webhooks, checking service health, downloading config updates. The exit code tells you if the request succeeded.',
    objective: 'Use curl\'s exit code to check if a service is up: `curl -s https://api.example.com/health > /dev/null && echo "UP" || echo "DOWN"`',
    hint: 'curl -s https://api.example.com/health > /dev/null && echo "UP" || echo "DOWN"',
    check: (s) => s.execHist.some(h => /curl.*&&.*echo|curl.*health/.test(h.cmd) && /curl/.test(h.cmd)),
    success: 'curl scripting patterns:\n  # Health check\n  curl -sf url && echo UP || echo DOWN\n\n  # Save API response to variable\n  RESP=$(curl -s url)\n  echo $RESP | grep -q "ok" && echo "Healthy"\n\n  # Check HTTP status code\n  STATUS=$(curl -o /dev/null -s -w "%{http_code}" url)\n  [ "$STATUS" = "200" ] || echo "Error: $STATUS"\n\n  # Retry on failure\n  for i in 1 2 3; do\n    curl -sf url && break\n    sleep 5\n  done\n\n  # Download and pipe to jq\n  curl -s https://api.example.com/users | jq \'.users[].name\'',
  },


  ]; // end CURRICULUM

  global.CURRICULUM = CURRICULUM;

})(window);
