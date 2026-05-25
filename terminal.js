/* ═══════════════════════════════════════════════════════════════
   ISS TERMINAL — terminal.js
   Virtual filesystem, command engine, pipe/redirect/scripting
   Exposes window.TERM for use by script.js and curriculum.js
═══════════════════════════════════════════════════════════════ */

(function (global) {
  'use strict';

  /* ─────────────────────────────────────────────────────────
     VIRTUAL FILESYSTEM
  ───────────────────────────────────────────────────────── */
  const VFS = {
    type:'dir', perms:'rwxr-xr-x', owner:'root', group:'root', mtime:'Jan 15 08:00',
    children:{
      home:{
        type:'dir', perms:'rwxr-xr-x', owner:'root', group:'root', mtime:'Jan 15 08:00',
        children:{
          user:{
            type:'dir', perms:'rwxr-xr-x', owner:'user', group:'user', mtime:'Jan 15 08:00',
            children:{
              documents:{
                type:'dir', perms:'rwxr-xr-x', owner:'user', group:'user', mtime:'Jan 15 10:30',
                children:{
                  'readme.txt':{
                    type:'file', perms:'rw-r--r--', owner:'user', group:'user', mtime:'Jan 15 10:30',
                    content:
`Welcome to the ISS Linux Learning Terminal
==========================================
This environment simulates a real Linux filesystem.
Use it to practice commands safely — nothing here
affects your actual machine.

Good commands to start with:
  pwd        print working directory
  ls         list files
  ls -la     list all files with details
  cd <dir>   change directory
  cat <file> display file contents
  man <cmd>  read the manual

Type 'help' for a full command list.
Happy learning.`
                  },
                  'notes.txt':{
                    type:'file', perms:'rw-r--r--', owner:'user', group:'user', mtime:'Jan 15 09:45',
                    content:
`System Administration Notes
============================
Date: 2025-01-15

Network Layout:
  Primary DNS : 10.10.10.1
  Backup DNS  : 8.8.8.8
  Subnet      : 10.10.0.0/24

TODO:
  - Update firewall rules
  - Audit user accounts
  - Review log rotation policy
  - Test backup procedures
  - Document network changes

Useful chmod modes:
  755  owner rwx, others rx  (executables, dirs)
  644  owner rw, others r    (config files)
  600  owner rw only         (private keys, secrets)
  777  all permissions       (use with caution)`
                  },
                  'wordlist.txt':{
                    type:'file', perms:'rw-r--r--', owner:'user', group:'user', mtime:'Jan 15 08:00',
                    content:
`alpha
bravo
charlie
delta
echo
foxtrot
golf
hotel
india
juliet
kilo
lima
mike
november
oscar
papa
quebec
romeo
sierra
tango
uniform
victor
whiskey
xray
yankee
zulu`
                  },
                }
              },
              scripts:{
                type:'dir', perms:'rwxr-xr-x', owner:'user', group:'user', mtime:'Jan 15 08:00',
                children:{
                  'hello.sh':{
                    type:'file', perms:'rwxr-xr-x', owner:'user', group:'user', mtime:'Jan 15 08:00',
                    content:
`#!/bin/bash
# A simple greeting script

NAME="World"
echo "Hello, $NAME!"
echo "Running as: $(whoami)"`
                  },
                  'backup.sh':{
                    type:'file', perms:'rw-r--r--', owner:'user', group:'user', mtime:'Jan 15 08:00',
                    content:
`#!/bin/bash
# Backup script — needs execute permission
# Run: chmod +x backup.sh && ./backup.sh

SOURCE="/home/user/documents"
DEST="/tmp/backup"

echo "Starting backup of $SOURCE..."
mkdir -p "$DEST"
cp -r "$SOURCE" "$DEST/"
echo "Done. Files saved to $DEST"`
                  },
                  'math.sh':{
                    type:'file', perms:'rwxr-xr-x', owner:'user', group:'user', mtime:'Jan 15 08:00',
                    content:
`#!/bin/bash
# Arithmetic demo
A=10
B=3
echo "A=$A B=$B"
echo "Sum: $((A + B))"
echo "Difference: $((A - B))"
echo "Product: $((A * B))"
echo "Quotient: $((A / B))"
echo "Remainder: $((A % B))"
echo "Power: $((A ** B))"`
                  },
                  'functions.sh':{
                    type:'file', perms:'rwxr-xr-x', owner:'user', group:'user', mtime:'Jan 15 08:00',
                    content:
`#!/bin/bash
# Functions demo
greet() {
  local name="$1"
  echo "Hello, $name!"
}
add() {
  local a="$1"
  local b="$2"
  echo $((a + b))
}
greet "World"
result=$(add 12 8)
echo "12 + 8 = $result"`
                  },
                  'template.sh':{
                    type:'file', perms:'rwxr-xr-x', owner:'user', group:'user', mtime:'Jan 15 08:00',
                    content:
`#!/bin/bash
set -euo pipefail
readonly SCRIPT_NAME="template.sh"
log()  { echo "[INFO]  $*"; }
warn() { echo "[WARN]  $*"; }
die()  { echo "[ERROR] $*"; exit 1; }
main() {
  log "Script: $SCRIPT_NAME"
  log "User: $(whoami)"
  [ -d "/home/user" ] || die "Home dir missing"
  log "Done."
}
main "$@"`
                  },
                  'arrays.sh':{
                    type:'file', perms:'rwxr-xr-x', owner:'user', group:'user', mtime:'Jan 15 08:00',
                    content:'#!/bin/bash\nFRUITS=("apple" "banana" "cherry" "date")\necho "All: ${FRUITS[@]}"\necho "First: ${FRUITS[0]}"\necho "Count: ${#FRUITS[@]}"\nfor fruit in "${FRUITS[@]}"; do\n  echo "  - $fruit"\ndone'
                  },
                  'report.sh':{
                    type:'file', perms:'rwxr-xr-x', owner:'user', group:'user', mtime:'Jan 15 08:00',
                    content:
`#!/bin/bash
# Generate a server status report using awk
FILE="/home/user/data/servers.txt"
echo "=== Server Status Report ==="
echo "Total servers: $(awk 'END{print NR}' $FILE)"
echo "Online:        $(awk '/online/{count++} END{print count+0}' $FILE)"
echo "Offline:       $(awk '/offline/{count++} END{print count+0}' $FILE)"
echo ""
echo "-- Online servers --"
awk '/online/{print $1, $2}' $FILE
echo ""
echo "-- Offline servers --"
awk '/offline/{print $1, $2}' $FILE`
                  },
                  'env-check.sh':{
                    type:'file', perms:'rwxr-xr-x', owner:'user', group:'user', mtime:'Jan 15 08:00',
                    content:
`#!/bin/bash
# Environment diagnostic script
echo "=== Environment Check ==="
echo "User:    $USER"
echo "Home:    $HOME"
echo "Shell:   $SHELL"
echo "PWD:     $PWD"
echo ""
echo "=== PATH Entries ==="
echo "$PATH" | tr ':' '\n' | nl
echo ""
echo "=== Key Variables ==="
env | grep -E '^(USER|HOME|EDITOR|LANG|TERM)=' | sort`
                  },
                }
              },
              data:{
                type:'dir', perms:'rwxr-xr-x', owner:'user', group:'user', mtime:'Jan 15 08:00',
                children:{
                  'names.txt':{ type:'file', perms:'rw-r--r--', owner:'user', group:'user', mtime:'Jan 15 08:00', content:'Alice\nBob\nCharlie\nDiana\nEve\nFrank\nGrace\nHank\nIris\nJack' },
                  'numbers.txt':{ type:'file', perms:'rw-r--r--', owner:'user', group:'user', mtime:'Jan 15 08:00', content:'1\n2\n3\n4\n5\n6\n7\n8\n9\n10' },
                  'servers.txt':{ type:'file', perms:'rw-r--r--', owner:'user', group:'user', mtime:'Jan 15 08:00', content:'web01    10.10.10.10  online\nweb02    10.10.10.11  online\ndb01     10.10.10.20  online\ndb02     10.10.10.21  offline\ncache01  10.10.10.30  online\ncache02  10.10.10.31  maintenance\nlb01     10.10.10.40  online\nbackup   10.10.10.50  offline' },
                  'emails.txt':{ type:'file', perms:'rw-r--r--', owner:'user', group:'user', mtime:'Jan 15 08:00', content:'alice@example.com\nbob@company.org\ncharlie.brown@example.co.uk\ninvalid-email\ndiana@test.net\nnot.an.email@\neve@domain.io\nfrank123@web.com' },
                  'words.txt':{ type:'file', perms:'rw-r--r--', owner:'user', group:'user', mtime:'Jan 15 08:00', content:'apple\nBanana\nCherry\napricot\nblueberry\nBlackberry\nAvocado\ndate\nElderberry\nfig' },
                  'scores.csv':{ type:'file', perms:'rw-r--r--', owner:'user', group:'user', mtime:'Jan 15 08:00', content:'name,subject,score\nAlice,math,92\nBob,math,78\nCharlie,math,85\nAlice,science,88\nBob,science,95\nCharlie,science,72\nAlice,english,76\nBob,english,84\nCharlie,english,91' },
                  'access.log':{ type:'file', perms:'rw-r--r--', owner:'user', group:'user', mtime:'Jan 15 08:00', content:'10.10.1.5 GET /index.html 200 1024\n10.10.1.6 GET /about.html 200 512\n10.10.1.5 POST /login 200 256\n192.168.1.105 GET /admin 403 128\n10.10.1.7 GET /index.html 200 1024\n10.10.1.6 GET /missing.html 404 64\n192.168.1.105 GET /config 403 128\n10.10.1.5 GET /data.json 200 4096\n10.10.1.8 GET /index.html 200 1024\n192.168.1.105 POST /login 401 256' },
                  'inventory.txt':{ type:'file', perms:'rw-r--r--', owner:'user', group:'user', mtime:'Jan 15 08:00', content:'widget      12.50   100\ngadget      34.99    45\nthingamajig  8.75   200\ndoohickey   19.99    30\nwhatsit      5.25   500\nwidget-pro  49.99    15\ngizmo       22.00    80' },
                }
              },
              '.bashrc':{
                type:'file', perms:'rw-r--r--', owner:'user', group:'user', mtime:'Jan 15 08:00',
                content:
`# .bashrc — loaded for interactive shells
# Tip: files beginning with . are hidden. Use ls -a to see them.

# Prompt
PS1='\\u@icestreams:\\w\\$ '

# Handy aliases
alias ll='ls -la'
alias la='ls -a'
alias grep='grep --color=auto'

# Path
export PATH="$HOME/.local/bin:$PATH"
export EDITOR=nano`
              },
              projects:{
                type:'dir', perms:'rwxr-xr-x', owner:'user', group:'user', mtime:'Jan 15 08:00',
                children:{
                  'Makefile':{
                    type:'file', perms:'rw-r--r--', owner:'user', group:'user', mtime:'Jan 15 08:00',
                    content:'# Makefile for a simple C project\n# Tabs (not spaces) are REQUIRED before recipe lines\n\nCC      = gcc\nCFLAGS  = -Wall -g\nTARGET  = hello\nSRCS    = hello.c utils.c\nOBJS    = $(SRCS:.c=.o)\n\n.PHONY: all clean install test\n\nall: $(TARGET)\n\n$(TARGET): $(OBJS)\n\t$(CC) $(CFLAGS) -o $(TARGET) $(OBJS)\n\t@echo "Built $(TARGET) successfully"\n\n%.o: %.c\n\t$(CC) $(CFLAGS) -c $< -o $@\n\nclean:\n\trm -f $(OBJS) $(TARGET)\n\t@echo "Cleaned build artifacts"\n\ninstall: $(TARGET)\n\tcp $(TARGET) /usr/local/bin/\n\t@echo "Installed to /usr/local/bin/"\n\ntest: $(TARGET)\n\t@echo "Running tests..."\n\t@echo "All tests passed"\n'
                  },
                  'hello.c':{
                    type:'file', perms:'rw-r--r--', owner:'user', group:'user', mtime:'Jan 15 08:00',
                    content:'#include <stdio.h>\n#include "utils.h"\n\nint main() {\n    printf("Hello, World!\\n");\n    greet("ISS Terminal");\n    return 0;\n}'
                  },
                  'utils.c':{
                    type:'file', perms:'rw-r--r--', owner:'user', group:'user', mtime:'Jan 15 08:00',
                    content:'#include <stdio.h>\n#include "utils.h"\n\nvoid greet(const char *name) {\n    printf("Welcome to %s\\n", name);\n}'
                  },
                  'utils.h':{
                    type:'file', perms:'rw-r--r--', owner:'user', group:'user', mtime:'Jan 15 08:00',
                    content:'#ifndef UTILS_H\\n#define UTILS_H\\nvoid greet(const char *name);\\n#endif'
                  },
                  'Makefile.py':{
                    type:'file', perms:'rw-r--r--', owner:'user', group:'user', mtime:'Jan 15 08:00',
                    content:'# Makefile for a Python project\n.PHONY: install test lint clean run\n\ninstall:\n\\tpython3 -m venv .venv\n\\t.venv/bin/pip install -r requirements.txt\n\\t@echo "Environment ready"\n\ntest:\n\\t.venv/bin/python -m pytest tests/ -v\n\nlint:\n\\t.venv/bin/python -m flake8 src/\n\nclean:\n\\trm -rf .venv __pycache__ .pytest_cache\n\\t@echo "Cleaned"\n\nrun:\n\\t.venv/bin/python src/main.py'
                  },
                }
              },
            }
          }
        }
      },
      etc:{
        type:'dir', perms:'rwxr-xr-x', owner:'root', group:'root', mtime:'Jan 15 08:00',
        children:{
          hosts:{
            type:'file', perms:'rw-r--r--', owner:'root', group:'root', mtime:'Jan 15 08:00',
            content:
`127.0.0.1   localhost
127.0.1.1   icestreams
10.10.10.1  gateway.local
10.10.10.221 nas.local gravcast.local
10.10.21.50 enclave.local
::1         localhost ip6-localhost ip6-loopback`
          },
          passwd:{
            type:'file', perms:'rw-r--r--', owner:'root', group:'root', mtime:'Jan 15 08:00',
            content:
`root:x:0:0:root:/root:/bin/bash
daemon:x:1:1:daemon:/usr/sbin:/usr/sbin/nologin
bin:x:2:2:bin:/bin:/usr/sbin/nologin
www-data:x:33:33:www-data:/var/www:/usr/sbin/nologin
sshd:x:74:74:Privilege-separated SSH:/var/run/sshd:/usr/sbin/nologin
user:x:1000:1000:ISS User:/home/user:/bin/bash`
          },
          'os-release':{
            type:'file', perms:'rw-r--r--', owner:'root', group:'root', mtime:'Jan 15 08:00',
            content:
`NAME="ISS Linux"
VERSION="1.0 (Enclave)"
ID=isslinux
VERSION_ID=1.0
PRETTY_NAME="ISS Linux 1.0 (Enclave)"
HOME_URL="https://icestreams.io"`
          },
        }
      },
      var:{
        type:'dir', perms:'rwxr-xr-x', owner:'root', group:'root', mtime:'Jan 15 08:00',
        children:{
          log:{
            type:'dir', perms:'rwxr-xr-x', owner:'root', group:'adm', mtime:'Jan 15 14:05',
            children:{
              syslog:{
                type:'file', perms:'rw-r--r--', owner:'root', group:'adm', mtime:'Jan 15 14:05',
                content:
`Jan 15 08:00:01 icestreams systemd[1]: Starting system...
Jan 15 08:00:02 icestreams kernel: Linux version 5.15.0-iss
Jan 15 08:00:03 icestreams kernel: CPU: Intel Core i7-12700
Jan 15 08:00:05 icestreams sshd[1234]: Server listening on 0.0.0.0 port 22
Jan 15 08:01:12 icestreams sshd[1235]: Accepted publickey for user from 10.10.30.5
Jan 15 08:05:33 icestreams nginx[2100]: Starting nginx web server
Jan 15 08:05:34 icestreams nginx[2100]: nginx started successfully
Jan 15 09:15:22 icestreams sudo[3001]: user : TTY=pts/0 ; PWD=/home/user
Jan 15 09:30:44 icestreams CRON[4500]: session opened for root
Jan 15 10:00:01 icestreams CRON[4501]: backup.sh completed
Jan 15 11:22:18 icestreams kernel: [ERROR] disk I/O error on /dev/sda2
Jan 15 11:22:19 icestreams kernel: [ERROR] ata1.00: failed command: READ DMA
Jan 15 11:25:00 icestreams systemd[1]: Started disk health monitor
Jan 15 12:00:01 icestreams CRON[5200]: backup job started
Jan 15 12:00:45 icestreams CRON[5200]: backup completed: 247MB archived
Jan 15 13:15:33 icestreams sshd[6100]: Invalid user admin from 192.168.1.105
Jan 15 13:15:34 icestreams sshd[6101]: Invalid user root from 192.168.1.105
Jan 15 13:15:35 icestreams sshd[6102]: Connection closed by 192.168.1.105
Jan 15 14:00:00 icestreams systemd[1]: Starting daily maintenance...
Jan 15 14:05:22 icestreams kernel: [INFO] memory usage: 4.2GB / 16GB
Jan 15 14:05:23 icestreams kernel: [INFO] swap usage: 0MB / 8GB`
              },
              'auth.log':{
                type:'file', perms:'rw-r--r--', owner:'root', group:'adm', mtime:'Jan 15 14:00',
                content:
`Jan 15 08:01:10 icestreams sshd[1235]: Connection from 10.10.30.5 port 54321
Jan 15 08:01:12 icestreams sshd[1235]: Accepted publickey for user
Jan 15 08:01:12 icestreams sshd[1235]: pam_unix(sshd:session): session opened
Jan 15 09:15:20 icestreams sudo[3001]: user: command=/usr/bin/apt list
Jan 15 13:15:33 icestreams sshd[6100]: Failed password for invalid user admin
Jan 15 13:15:34 icestreams sshd[6101]: Failed password for invalid user root
Jan 15 13:15:35 icestreams sshd[6102]: Disconnected from 192.168.1.105`
              },
            }
          }
        }
      },
      tmp:{
        type:'dir', perms:'rwxrwxrwx', owner:'root', group:'root', mtime:'Jan 15 08:00',
        children:{}
      },
      bin:{
        type:'dir', perms:'rwxr-xr-x', owner:'root', group:'root', mtime:'Jan 15 08:00',
        children:{}
      },
      usr:{
        type:'dir', perms:'rwxr-xr-x', owner:'root', group:'root', mtime:'Jan 15 08:00',
        children:{
          bin:{
            type:'dir', perms:'rwxr-xr-x', owner:'root', group:'root', mtime:'Jan 15 08:00',
            children:{}
          },
          local:{
            type:'dir', perms:'rwxr-xr-x', owner:'root', group:'root', mtime:'Jan 15 08:00',
            children:{
              bin:{
                type:'dir', perms:'rwxr-xr-x', owner:'root', group:'root', mtime:'Jan 15 08:00',
                children:{}
              },
            }
          },
          share:{
            type:'dir', perms:'rwxr-xr-x', owner:'root', group:'root', mtime:'Jan 15 08:00',
            children:{
              doc:{
                type:'dir', perms:'rwxr-xr-x', owner:'root', group:'root', mtime:'Jan 15 08:00',
                children:{}
              }
            }
          }
        }
      },
    }
  };

  /* ─────────────────────────────────────────────────────────
     REMOTE VFS  (simulated SSH target: enclave.local)
  ───────────────────────────────────────────────────────── */
  const REMOTE_VFS = {
    type:'dir', perms:'rwxr-xr-x', owner:'root', group:'root', mtime:'Jan 15 08:00',
    children:{
      home:{
        type:'dir', perms:'rwxr-xr-x', owner:'root', group:'root', mtime:'Jan 15 08:00',
        children:{
          deploy:{
            type:'dir', perms:'rwxr-xr-x', owner:'deploy', group:'deploy', mtime:'Jan 15 09:00',
            children:{
              'deploy.sh':{
                type:'file', perms:'rwxr-xr-x', owner:'deploy', group:'deploy', mtime:'Jan 15 09:00',
                content:
`#!/bin/bash
set -euo pipefail
APP_DIR="/var/www/app"
REPO="https://github.com/example/app"
echo "[deploy] Pulling latest..."
cd $APP_DIR
echo "[deploy] Restarting service..."
echo "[deploy] Done. Version: 1.4.2"`
              },
              'config.env':{
                type:'file', perms:'rw-------', owner:'deploy', group:'deploy', mtime:'Jan 15 09:00',
                content:
`APP_ENV=production
DB_HOST=10.10.10.20
DB_PORT=5432
DB_NAME=appdb
REDIS_URL=redis://10.10.10.30:6379
LOG_LEVEL=warn
PORT=8080`
              },
            }
          }
        }
      },
      var:{
        type:'dir', perms:'rwxr-xr-x', owner:'root', group:'root', mtime:'Jan 15 08:00',
        children:{
          www:{
            type:'dir', perms:'rwxr-xr-x', owner:'root', group:'root', mtime:'Jan 15 08:00',
            children:{
              app:{
                type:'dir', perms:'rwxr-xr-x', owner:'deploy', group:'www-data', mtime:'Jan 15 09:00',
                children:{
                  'index.html':{
                    type:'file', perms:'rw-r--r--', owner:'deploy', group:'www-data', mtime:'Jan 15 09:00',
                    content:'<!DOCTYPE html><html><body><h1>App v1.4.2</h1></body></html>'
                  },
                  'app.log':{
                    type:'file', perms:'rw-r--r--', owner:'deploy', group:'www-data', mtime:'Jan 15 14:00',
                    content:
`2024-01-15 08:05:01 INFO  Server started on :8080
2024-01-15 08:05:02 INFO  Connected to database
2024-01-15 08:05:02 INFO  Connected to redis
2024-01-15 09:12:44 WARN  Slow query: 342ms
2024-01-15 11:30:15 ERROR Failed to send email: timeout
2024-01-15 12:00:01 INFO  Health check OK
2024-01-15 13:45:22 WARN  Memory usage: 78%
2024-01-15 14:00:01 INFO  Health check OK`
                  },
                }
              }
            }
          },
          log:{
            type:'dir', perms:'rwxr-xr-x', owner:'root', group:'adm', mtime:'Jan 15 08:00',
            children:{
              'nginx.log':{
                type:'file', perms:'rw-r--r--', owner:'root', group:'adm', mtime:'Jan 15 14:00',
                content:
`10.10.1.5 - - [15/Jan/2024:08:05:00] "GET / HTTP/1.1" 200 1024
10.10.1.5 - - [15/Jan/2024:08:05:01] "GET /api/health HTTP/1.1" 200 42
10.10.1.6 - - [15/Jan/2024:09:12:00] "POST /api/data HTTP/1.1" 200 512
10.10.1.5 - - [15/Jan/2024:11:30:00] "GET /api/users HTTP/1.1" 200 2048
192.168.1.105 - - [15/Jan/2024:13:15:00] "GET /admin HTTP/1.1" 403 128`
              }
            }
          }
        }
      },
      etc:{
        type:'dir', perms:'rwxr-xr-x', owner:'root', group:'root', mtime:'Jan 15 08:00',
        children:{
          nginx:{
            type:'dir', perms:'rwxr-xr-x', owner:'root', group:'root', mtime:'Jan 15 08:00',
            children:{
              'nginx.conf':{
                type:'file', perms:'rw-r--r--', owner:'root', group:'root', mtime:'Jan 15 08:00',
                content:
`worker_processes auto;
events { worker_connections 1024; }
http {
    include mime.types;
    server {
        listen 80;
        server_name enclave.local;
        root /var/www/app;
        location /api/ { proxy_pass http://127.0.0.1:8080; }
        location / { try_files $uri $uri/ /index.html; }
    }
}`
              }
            }
          },
          'hosts':{
            type:'file', perms:'rw-r--r--', owner:'root', group:'root', mtime:'Jan 15 08:00',
            content:
`127.0.0.1   localhost
127.0.1.1   enclave
10.10.10.1  gateway.local
10.10.10.221 nas.local`
          },
        }
      },
      tmp:{
        type:'dir', perms:'rwxrwxrwx', owner:'root', group:'root', mtime:'Jan 15 08:00',
        children:{}
      },
    }
  };

  /* ─────────────────────────────────────────────────────────
     STATE
  ───────────────────────────────────────────────────────── */
  const state = {
    cwd:  '/home/user',
    env: {
      USER: 'user', HOME: '/home/user', HOSTNAME: 'icestreams',
      PATH: '/usr/local/bin:/usr/bin:/bin', SHELL: '/bin/bash',
      TERM: 'xterm-256color', PWD: '/home/user', OLDPWD: '',
    },
    vars:      {},   // user-defined variables
    funcs:     {},   // user-defined functions: name -> body string
    arrays:    {},   // indexed arrays: name -> string[]
    positional:[],   // $1 $2 … for current function call
    exitStatus: 0,   // $?
    options:   { x:false, e:false, u:false }, // set -x/-e/-u
    aliases:   { ll:'ls -la', la:'ls -a' },
    callStack: [],   // guard against infinite recursion
    cmdHist:   [],   // command strings for ↑/↓ navigation
    execHist:  [],   // { cmd, output } for curriculum checks
    vimHistory:[],   // { file: path } each time vim writes a file
    makeTargets:{},  // tracks which make targets have been "run"
    // ── SSH ──
    sshSession: null,  // null | { host, user, vfs, cwd }
    // ── Git ──
    gitRepos:   {},    // repoPath -> { branch, branches:{}, commits:[], staged:[], tracked:{} }
    // ── Processes ──
    processes: [
      { pid:1,    cmd:'systemd',           user:'root',     cpu:'0.0', mem:'0.1', stat:'S', start:'08:00', vsz:'168MB' },
      { pid:445,  cmd:'sshd: [accepting]', user:'root',     cpu:'0.0', mem:'0.2', stat:'S', start:'08:00', vsz:'14MB'  },
      { pid:891,  cmd:'nginx: master',     user:'root',     cpu:'0.0', mem:'0.3', stat:'S', start:'08:05', vsz:'8MB'   },
      { pid:892,  cmd:'nginx: worker',     user:'www-data', cpu:'0.1', mem:'0.2', stat:'S', start:'08:05', vsz:'8MB'   },
      { pid:1205, cmd:'cron',              user:'root',     cpu:'0.0', mem:'0.1', stat:'S', start:'08:00', vsz:'6MB'   },
      { pid:1847, cmd:'python3 app.py',    user:'user',     cpu:'0.4', mem:'2.1', stat:'S', start:'09:30', vsz:'62MB'  },
      { pid:1848, cmd:'redis-server',      user:'redis',    cpu:'0.1', mem:'0.8', stat:'S', start:'09:30', vsz:'42MB'  },
    ],
    nextPid:    2000,
    jobs:       [],    // background jobs: { jid, pid, cmd, status:'running'|'done'|'stopped' }
    nextJid:    1,
    // ── Cron ──
    crontab:    [],    // { schedule, command }
    atJobs:     [],    // { id, when, command }
    nextAtId:   1,
    packages: {      // simulated dpkg/apt package database
      installed: {
        bash:       { version:'5.2.15', size:'1420', desc:'GNU Bourne Again SHell' },
        coreutils:  { version:'9.1',    size:'7230', desc:'GNU core utilities' },
        grep:       { version:'3.8',    size:'530',  desc:'GNU grep, egrep and fgrep' },
        vim:        { version:'9.0',    size:'3200', desc:'Vi IMproved — enhanced vi editor' },
        curl:       { version:'7.88',   size:'512',  desc:'Command line tool for transferring data with URLs' },
        git:        { version:'2.39',   size:'15400',desc:'Fast, scalable, distributed revision control system' },
        python3:    { version:'3.11.2', size:'4800', desc:'Interactive high-level object-oriented language' },
        make:       { version:'4.3',    size:'420',  desc:'Utility for directing compilation of programs' },
        gcc:        { version:'12.2',   size:'52000',desc:'GNU C compiler' },
        openssh:    { version:'9.2',    size:'1800', desc:'Secure Shell client and server' },
        htop:       { version:'3.2.1',  size:'230',  desc:'Interactive process viewer' },
        'man-db':   { version:'2.11.2', size:'890',  desc:'On-line manual pager' },
      },
      available: {
        neovim:     { version:'0.9.4',  size:'8200', desc:'Vim-fork focused on extensibility and usability' },
        tmux:       { version:'3.3a',   size:'640',  desc:'Terminal multiplexer' },
        jq:         { version:'1.6',    size:'190',  desc:'Lightweight and flexible command-line JSON processor' },
        ripgrep:    { version:'13.0',   size:'3200', desc:'Recursively search directories for a regex pattern' },
        tree:       { version:'2.1.0',  size:'80',   desc:'Recursive directory listing command' },
        nmap:       { version:'7.93',   size:'12800',desc:'Network exploration tool and security scanner' },
        nginx:      { version:'1.22',   size:'3500', desc:'Small, powerful, scalable web/proxy server' },
        nodejs:     { version:'20.9',   size:'43000',desc:'Platform built on V8 JavaScript runtime' },
        rust:       { version:'1.73',   size:'68000',desc:'System programming language' },
        fzf:        { version:'0.44',   size:'1200', desc:'General-purpose command-line fuzzy finder' },
        bat:        { version:'0.24',   size:'2100', desc:'A cat clone with syntax highlighting' },
        fd:         { version:'8.7',    size:'1400', desc:'A simple, fast alternative to find' },
        eza:        { version:'0.17',   size:'3800', desc:'A modern replacement for ls' },
        'build-essential':{ version:'12.9', size:'4', desc:'Informational list of build-essential packages' },
      },
    },
  };

  /* ─────────────────────────────────────────────────────────
     OUTPUT HELPERS  (return HTML strings)
  ───────────────────────────────────────────────────────── */
  function esc(s) {
    return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
  }
  const E = {
    txt:  s => esc(s),
    err:  s => `<span class="c-err">${esc(s)}</span>`,
    ok:   s => `<span class="c-ok">${esc(s)}</span>`,
    dim:  s => `<span class="c-dim">${esc(s)}</span>`,
    ice:  s => `<span class="c-ice">${esc(s)}</span>`,
    dir:  s => `<span class="c-dir">${esc(s)}</span>`,
    exe:  s => `<span class="c-exe">${esc(s)}</span>`,
    perm: s => `<span class="c-perm">${esc(s)}</span>`,
  };

  /* ─────────────────────────────────────────────────────────
     PATH UTILITIES
  ───────────────────────────────────────────────────────── */
  function normalizePath(p) {
    const parts = p.split('/').filter(x => x && x !== '.');
    const stack = [];
    for (const part of parts) {
      if (part === '..') { if (stack.length) stack.pop(); }
      else stack.push(part);
    }
    return '/' + stack.join('/');
  }

  function resolvePath(p) {
    const home = state.sshSession ? '/home/deploy' : state.env.HOME;
    const cwd  = state.sshSession ? state.sshSession.cwd : state.cwd;
    if (!p || p === '~') return home;
    if (p.startsWith('~/')) return normalizePath(home + '/' + p.slice(2));
    if (p.startsWith('/'))  return normalizePath(p);
    return normalizePath(cwd + '/' + p);
  }

  function activeVFS() {
    return (state.sshSession && state.sshSession.vfs) ? state.sshSession.vfs : VFS;
  }

  function getNode(p) {
    const vfs = activeVFS();
    if (p === '/') return vfs;
    const parts = normalizePath(p).split('/').filter(Boolean);
    let node = vfs;
    for (const part of parts) {
      if (!node || !node.children || !node.children[part]) return null;
      node = node.children[part];
    }
    return node;
  }

  function getParentPath(p) {
    if (p === '/') return '/';
    return normalizePath(p + '/..');
  }

  function basename(p) {
    if (p === '/') return '/';
    return p.split('/').filter(Boolean).pop() || '/';
  }

  function shortPath(p) {
    const home = state.env.HOME;
    return p.startsWith(home) ? '~' + p.slice(home.length) : p;
  }

  /* ─────────────────────────────────────────────────────────
     VARIABLE EXPANSION
  ───────────────────────────────────────────────────────── */
  /* ─── variable lookup ─── */
  function lookupVar(name) {
    if (state.vars[name] !== undefined) return state.vars[name];
    if (state.env[name]  !== undefined) return state.env[name];
    return '';
  }

  /* ─── arithmetic evaluator ─── */
  function evalArith(expr) {
    // Replace $var and bare var references with values
    expr = expr.replace(/\$([A-Za-z_]\w*)/g, (_, n) => lookupVar(n) || '0');
    expr = expr.replace(/\b([A-Za-z_]\w*)\b/g, (_, n) => {
      const v = lookupVar(n); return (v !== '') ? v : '0';
    });
    try { return Math.trunc(new Function('return (' + expr + ')')()) || 0; }
    catch(e) { return 0; }
  }

  /* ─── find matching closer character ─── */
  function findClosing(s, start, open, close) {
    let depth = 1, i = start;
    while (i < s.length && depth > 0) {
      if (s[i] === open) depth++;
      else if (s[i] === close) { depth--; if (depth === 0) return i; }
      i++;
    }
    return -1;
  }

  /* ─── full variable expansion ─── */
  function expandVars(s) {
    if (typeof s !== 'string') return String(s);
    let result = '', i = 0;
    while (i < s.length) {
      if (s[i] !== '$') { result += s[i++]; continue; }
      i++; // skip $
      if (i >= s.length) { result += '$'; break; }

      // Arithmetic: $((expr))
      if (s[i] === '(' && s[i+1] === '(') {
        const end = s.indexOf('))', i+2);
        if (end !== -1) {
          result += evalArith(s.slice(i+2, end));
          i = end + 2; continue;
        }
      }
      // Command substitution: $(cmd)
      if (s[i] === '(') {
        const end = findClosing(s, i+1, '(', ')');
        if (end !== -1) {
          const cmd = s.slice(i+1, end);
          const r = execute(expandVars(cmd));
          result += Array.isArray(r) ? r.map(l => l.replace(/<[^>]+>/g,'')).join('\n') : '';
          i = end + 1; continue;
        }
      }
      // Parameter expansion: ${...}
      if (s[i] === '{') {
        const end = findClosing(s, i+1, '{', '}');
        if (end !== -1) {
          const inner = s.slice(i+1, end);
          result += expandParam(inner);
          i = end + 1; continue;
        }
      }
      // Special variables
      if (s[i] === '?')  { result += state.exitStatus; i++; continue; }
      if (s[i] === '$')  { result += '12345'; i++; continue; } // PID
      if (s[i] === '#')  { result += state.positional.length; i++; continue; }
      if (s[i] === '@' || s[i] === '*') { result += state.positional.join(' '); i++; continue; }
      if (s[i] === '0')  { result += 'bash'; i++; continue; }
      if (s[i] >= '1' && s[i] <= '9') {
        result += state.positional[parseInt(s[i])-1] || '';
        i++; continue;
      }
      if (s[i] === '!') { result += ''; i++; continue; } // last bg PID
      // Regular variable name
      if (/[A-Za-z_]/.test(s[i])) {
        let name = '';
        while (i < s.length && /[A-Za-z0-9_]/.test(s[i])) name += s[i++];
        result += lookupVar(name); continue;
      }
      result += '$';
    }
    return result;
  }

  /* ─── ${...} parameter expansion handler ─── */
  function expandParam(inner) {
    // ${#var} - string length
    if (inner.startsWith('#') && /^#[A-Za-z_]/.test(inner)) {
      const name = inner.slice(1);
      if (name.endsWith('[@]')) {
        const arr = state.arrays[name.slice(0,-3)];
        return arr ? arr.length : 0;
      }
      return lookupVar(name).length;
    }
    // ${arr[@]} ${arr[n]}
    const arrMatch = inner.match(/^([A-Za-z_]\w*)\[(.+?)\]$/);
    if (arrMatch) {
      const arr = state.arrays[arrMatch[1]] || [];
      if (arrMatch[2] === '@' || arrMatch[2] === '*') return arr.join(' ');
      return arr[parseInt(arrMatch[2])] || '';
    }
    // ${var:-default}
    const defMatch = inner.match(/^([A-Za-z_]\w*):-(.*)$/);
    if (defMatch) { const v = lookupVar(defMatch[1]); return v !== '' ? v : expandVars(defMatch[2]); }
    // ${var:=default}
    const assignMatch = inner.match(/^([A-Za-z_]\w*):=(.*)$/);
    if (assignMatch) { let v = lookupVar(assignMatch[1]); if (v === '') { v = expandVars(assignMatch[2]); state.vars[assignMatch[1]] = v; } return v; }
    // ${var:+value}
    const plusMatch = inner.match(/^([A-Za-z_]\w*):\+(.*)$/);
    if (plusMatch) { return lookupVar(plusMatch[1]) !== '' ? expandVars(plusMatch[2]) : ''; }
    // ${var:n:m} substring
    const subMatch = inner.match(/^([A-Za-z_]\w*):(\d+):(\d+)$/);
    if (subMatch) { return lookupVar(subMatch[1]).substr(parseInt(subMatch[2]), parseInt(subMatch[3])); }
    // ${var//pat/rep} global replace
    const grepMatch = inner.match(/^([A-Za-z_]\w*)\/\/(.+?)\/(.*?)$/);
    if (grepMatch) { return lookupVar(grepMatch[1]).split(grepMatch[2]).join(grepMatch[3]); }
    // ${var/pat/rep} first replace
    const repMatch = inner.match(/^([A-Za-z_]\w*)\/(.+?)\/(.*?)$/);
    if (repMatch) { return lookupVar(repMatch[1]).replace(repMatch[2], repMatch[3]); }
    // ${var##pat} longest prefix removal
    const dprefMatch = inner.match(/^([A-Za-z_]\w*)##(.+)$/);
    if (dprefMatch) { const v = lookupVar(dprefMatch[1]); const r = new RegExp('^' + dprefMatch[2].replace(/\*/g,'.*')); return v.replace(r,''); }
    // ${var#pat} shortest prefix removal
    const prefMatch = inner.match(/^([A-Za-z_]\w*)#(.+)$/);
    if (prefMatch) { const v = lookupVar(prefMatch[1]); const r = new RegExp('^' + prefMatch[2].replace(/\*/g,'[^/]*')); return v.replace(r,''); }
    // ${var%%pat} longest suffix removal
    const dsufMatch = inner.match(/^([A-Za-z_]\w*)%%(.+)$/);
    if (dsufMatch) { const v = lookupVar(dsufMatch[1]); const r = new RegExp(dsufMatch[2].replace(/\*/g,'.*') + '$'); return v.replace(r,''); }
    // ${var%pat} shortest suffix removal
    const sufMatch = inner.match(/^([A-Za-z_]\w*)%(.+)$/);
    if (sufMatch) { const v = lookupVar(sufMatch[1]); const r = new RegExp(sufMatch[2].replace(/\*/g,'[^/]*') + '$'); return v.replace(r,''); }
    // ${var^^} uppercase all, ${var^} uppercase first, ${var,,} lowercase all
    const caseMatch = inner.match(/^([A-Za-z_]\w*)(\^\^|\^|,,|,)$/);
    if (caseMatch) {
      const v = lookupVar(caseMatch[1]);
      if (caseMatch[2] === '^^') return v.toUpperCase();
      if (caseMatch[2] === '^')  return v.charAt(0).toUpperCase() + v.slice(1);
      if (caseMatch[2] === ',,') return v.toLowerCase();
      if (caseMatch[2] === ',')  return v.charAt(0).toLowerCase() + v.slice(1);
    }
    // Plain ${var}
    return lookupVar(inner);
  }

  /* ─────────────────────────────────────────────────────────
     TOKENIZER  (handles single and double quotes)
  ───────────────────────────────────────────────────────── */
  function tokenize(input) {
    const tokens = [];
    let cur = '', inS = false, inD = false;
    for (let i = 0; i < input.length; i++) {
      const c = input[i];
      if      (c === "'" && !inD) { inS = !inS; }
      else if (c === '"' && !inS) { inD = !inD; }
      else if (c === ' ' && !inS && !inD) {
        if (cur !== '') { tokens.push(cur); cur = ''; }
      }
      else cur += c;
    }
    if (cur !== '') tokens.push(cur);
    return tokens;
  }

  /* ─────────────────────────────────────────────────────────
     LONG FORMAT LINE for ls -l
  ───────────────────────────────────────────────────────── */
  function fmtLong(name, node) {
    const t     = node.type === 'dir' ? 'd' : '-';
    const perms = node.perms || (node.type === 'dir' ? 'rwxr-xr-x' : 'rw-r--r--');
    const links = node.type === 'dir' ? '2' : '1';
    const owner = (node.owner || 'user').padEnd(8);
    const group = (node.group || 'user').padEnd(8);
    const size  = node.type === 'file'
      ? String(node.content ? node.content.length : 0).padStart(6)
      : '  4096';
    const mtime = node.mtime || 'Jan 15 08:00';
    let dispName;
    if (node.type === 'dir') dispName = E.dir(name + '/');
    else if (perms[2] === 'x') dispName = E.exe(name + '*');
    else dispName = E.txt(name);
    return `${E.perm(t + perms)} ${links} ${E.dim(owner)}${E.dim(group)} ${E.dim(size)} ${E.dim(mtime)}  ${dispName}`;
  }

  /* ─────────────────────────────────────────────────────────
     COMMANDS
  ───────────────────────────────────────────────────────── */
  const CMDS = {};

  CMDS.pwd = () => {
    const cwd = state.sshSession ? state.sshSession.cwd : state.cwd;
    return [E.txt(cwd)];
  };

  CMDS.cd = (args) => {
    if (state.sshSession) {
      // cd inside SSH session
      const home = '/home/' + state.sshSession.user;
      const target = (!args[0] || args[0] === '~') ? home : resolvePath(args[0]);
      const node = getNode(target);
      if (!node)             return [E.err(`cd: ${args[0]}: No such file or directory`)];
      if (node.type !== 'dir') return [E.err(`cd: ${args[0]}: Not a directory`)];
      state.sshSession.cwd = target;
      return [];
    }
    const target = (!args[0] || args[0] === '~') ? state.env.HOME
                 : args[0] === '-'               ? state.env.OLDPWD
                 : resolvePath(args[0]);
    if (!target) return [E.err('cd: OLDPWD not set')];
    const node = getNode(target);
    if (!node)             return [E.err(`cd: ${args[0]}: No such file or directory`)];
    if (node.type !== 'dir') return [E.err(`cd: ${args[0]}: Not a directory`)];
    const navTip = E.dim('  (cd .. <- up one level  *  cd ~ <- home  *  cd - <- back)');
    const out = args[0] === '-' ? [E.txt(target), navTip] : [navTip];
    state.env.OLDPWD = state.cwd;
    state.cwd = target; state.env.PWD = target;
    return out;
  };

  CMDS.ls = (args, flags, _stdin) => {
    const showHidden = flags.a || flags.all;
    const longFmt    = flags.l;
    const paths      = args.length ? args : ['.'];
    const out        = [];

    paths.forEach(arg => {
      const p    = resolvePath(arg);
      const node = getNode(p);
      if (!node) { out.push(E.err(`ls: cannot access '${arg}': No such file or directory`)); return; }
      if (node.type === 'file') {
        out.push(longFmt ? fmtLong(basename(p), node) : E.txt(basename(p)));
        return;
      }
      if (paths.length > 1) out.push(E.ice(p + ':'));
      const entries = Object.entries(node.children)
        .filter(([n]) => showHidden || !n.startsWith('.'))
        .sort(([a, na], [b, nb]) => {
          if (na.type !== nb.type) return na.type === 'dir' ? -1 : 1;
          return a.localeCompare(b);
        });

      if (longFmt) {
        out.push(E.dim(`total ${entries.length}`));
        entries.forEach(([n, child]) => out.push(fmtLong(n, child)));
      } else {
        if (!entries.length) return;
        out.push(entries.map(([n, child]) => {
          if (child.type === 'dir') return E.dir(n + '/');
          if ((child.perms||'')[2] === 'x') return E.exe(n + '*');
          if (n.startsWith('.')) return E.dim(n);
          return E.txt(n);
        }).join('  '));
      }
    });
    return out;
  };

  CMDS.cat = (args, _flags, stdin) => {
    if (!args.length) return stdin ? stdin.split('\n').map(esc) : [];
    const out = [];
    args.forEach(arg => {
      const p = resolvePath(arg);
      const node = getNode(p);
      if (!node)              { out.push(E.err(`cat: ${arg}: No such file or directory`)); return; }
      if (node.type === 'dir'){ out.push(E.err(`cat: ${arg}: Is a directory`)); return; }
      (node.content || '').split('\n').forEach(l => out.push(esc(l)));
    });
    return out;
  };

  // echo defined below in ADDITIONAL COMMANDS section

  CMDS.touch = (args) => {
    const out = [];
    args.forEach(arg => {
      const p    = resolvePath(arg);
      const dir  = getParentPath(p);
      const name = basename(p);
      const parentNode = getNode(dir);
      if (!parentNode || parentNode.type !== 'dir') { out.push(E.err(`touch: cannot touch '${arg}': No such file or directory`)); return; }
      if (!parentNode.children[name]) {
        parentNode.children[name] = { type:'file', perms:'rw-r--r--', owner:state.env.USER, group:state.env.USER, mtime:'now', content:'' };
      } else {
        parentNode.children[name].mtime = 'now';
      }
    });
    return out;
  };

  CMDS.mkdir = (args, flags) => {
    const parents = flags.p;
    const out = [];
    args.forEach(arg => {
      const p = resolvePath(arg);
      if (parents) {
        const parts = p.split('/').filter(Boolean);
        let cur = VFS;
        let curPath = '';
        for (const part of parts) {
          curPath += '/' + part;
          if (!cur.children) cur.children = {};
          if (!cur.children[part]) {
            cur.children[part] = { type:'dir', perms:'rwxr-xr-x', owner:state.env.USER, group:state.env.USER, mtime:'now', children:{} };
          }
          if (cur.children[part].type !== 'dir') { out.push(E.err(`mkdir: cannot create directory '${arg}': Not a directory`)); return; }
          cur = cur.children[part];
        }
      } else {
        const dir  = getParentPath(p);
        const name = basename(p);
        const parentNode = getNode(dir);
        if (!parentNode || parentNode.type !== 'dir') { out.push(E.err(`mkdir: cannot create directory '${arg}': No such file or directory`)); return; }
        if (parentNode.children[name]) { out.push(E.err(`mkdir: cannot create directory '${arg}': File exists`)); return; }
        parentNode.children[name] = { type:'dir', perms:'rwxr-xr-x', owner:state.env.USER, group:state.env.USER, mtime:'now', children:{} };
      }
    });
    return out;
  };

  CMDS.rm = (args, flags) => {
    const recursive = flags.r || flags.R;
    const force = flags.f;
    const out = [];
    args.forEach(arg => {
      const p = resolvePath(arg);
      if (p === '/' || p === state.env.HOME) { out.push(E.err(`rm: refusing to remove '${arg}'`)); return; }
      const dir  = getParentPath(p);
      const name = basename(p);
      const parentNode = getNode(dir);
      const node = getNode(p);
      if (!node) {
        if (!force) out.push(E.err(`rm: cannot remove '${arg}': No such file or directory`));
        return;
      }
      if (node.type === 'dir' && !recursive) { out.push(E.err(`rm: cannot remove '${arg}': Is a directory (use -r)`)); return; }
      if (parentNode && parentNode.children) delete parentNode.children[name];
    });
    return out;
  };

  CMDS.cp = (args, flags) => {
    if (args.length < 2) return [E.err('cp: missing destination')];
    const recursive = flags.r || flags.R;
    const dest = resolvePath(args[args.length - 1]);
    const srcs = args.slice(0, -1);
    const out  = [];

    function deepCopy(node) {
      if (node.type === 'file') return { ...node, content: node.content };
      return { ...node, children: Object.fromEntries(Object.entries(node.children).map(([k,v]) => [k, deepCopy(v)])) };
    }

    srcs.forEach(src => {
      const srcPath = resolvePath(src);
      const srcNode = getNode(srcPath);
      if (!srcNode) { out.push(E.err(`cp: '${src}': No such file or directory`)); return; }
      if (srcNode.type === 'dir' && !recursive) { out.push(E.err(`cp: -r not specified; omitting directory '${src}'`)); return; }

      const destNode = getNode(dest);
      let targetPath;
      if (destNode && destNode.type === 'dir') {
        targetPath = dest + '/' + basename(srcPath);
      } else {
        targetPath = dest;
      }
      const parentPath = getParentPath(targetPath);
      const parentNode = getNode(parentPath);
      if (!parentNode || parentNode.type !== 'dir') { out.push(E.err(`cp: '${dest}': No such directory`)); return; }
      parentNode.children[basename(targetPath)] = deepCopy(srcNode);
    });
    return out;
  };

  CMDS.mv = (args) => {
    if (args.length < 2) return [E.err('mv: missing destination')];
    const dest = resolvePath(args[args.length - 1]);
    const srcs = args.slice(0, -1);
    const out  = [];

    srcs.forEach(src => {
      const srcPath   = resolvePath(src);
      const srcNode   = getNode(srcPath);
      if (!srcNode) { out.push(E.err(`mv: '${src}': No such file or directory`)); return; }

      const destNode  = getNode(dest);
      let targetPath;
      if (destNode && destNode.type === 'dir') {
        targetPath = dest + '/' + basename(srcPath);
      } else {
        targetPath = dest;
      }
      const parentPath = getParentPath(targetPath);
      const parentNode = getNode(parentPath);
      if (!parentNode || parentNode.type !== 'dir') { out.push(E.err(`mv: cannot move to '${dest}': No such directory`)); return; }

      const srcParent = getNode(getParentPath(srcPath));
      if (srcParent && srcParent.children) delete srcParent.children[basename(srcPath)];
      parentNode.children[basename(targetPath)] = srcNode;
    });
    return out;
  };

  CMDS.grep = (args, flags, stdin) => {
    if (!args.length) return [E.err('grep: missing pattern')];
    const pattern = args[0];
    const files   = args.slice(1);
    const opts    = (flags.i ? 'gi' : 'g');
    let regex;
    try { regex = new RegExp(pattern, opts); } catch(e) { return [E.err(`grep: invalid regex: ${e.message}`)]; }

    const invert  = flags.v;
    const nums    = flags.n;
    const count   = flags.c;
    const out     = [];

    function processContent(content, fname) {
      const lines = content.split('\n');
      let cnt = 0;
      lines.forEach((ln, idx) => {
        regex.lastIndex = 0;
        const matched = regex.test(ln);
        regex.lastIndex = 0;
        if (matched !== invert) {
          cnt++;
          if (!count) {
            const pfx = files.length > 1 ? E.ice(fname + ':') : '';
            const nsfx = nums ? E.dim((idx+1) + ':') : '';
            const hl = ln.replace(new RegExp(pattern, flags.i ? 'gi' : 'g'), m => `<span class="c-ok">${esc(m)}</span>`);
            out.push(pfx + nsfx + hl);
          }
        }
      });
      if (count) out.push((files.length > 1 ? E.ice(fname + ':') : '') + E.txt(String(cnt)));
    }

    if (!files.length) {
      if (!stdin) return [E.err('grep: no input')];
      processContent(stdin, '(stdin)');
    } else {
      files.forEach(f => {
        const p = resolvePath(f);
        const node = getNode(p);
        if (!node)              { out.push(E.err(`grep: ${f}: No such file or directory`)); return; }
        if (node.type === 'dir'){ out.push(E.err(`grep: ${f}: Is a directory`)); return; }
        processContent(node.content || '', f);
      });
    }
    return out;
  };

  CMDS.head = (args, flags, stdin) => {
    const n = parseInt(flags.n) || 10;
    const out = [];
    function process(content, fname) {
      if (args.filter(a=>!a.startsWith('-')).length > 1) out.push(E.ice(`==> ${fname} <==`));
      content.split('\n').slice(0, n).forEach(l => out.push(esc(l)));
    }
    const files = args;
    if (!files.length) { if (stdin) process(stdin, ''); return out; }
    files.forEach(f => {
      const p = resolvePath(f); const node = getNode(p);
      if (!node)               { out.push(E.err(`head: ${f}: No such file or directory`)); return; }
      if (node.type === 'dir') { out.push(E.err(`head: ${f}: Is a directory`)); return; }
      process(node.content || '', f);
    });
    return out;
  };

  CMDS.tail = (args, flags, stdin) => {
    const n = parseInt(flags.n) || 10;
    const out = [];
    function process(content, fname) {
      if (args.filter(a=>!a.startsWith('-')).length > 1) out.push(E.ice(`==> ${fname} <==`));
      content.split('\n').slice(-n).forEach(l => out.push(esc(l)));
    }
    const files = args;
    if (!files.length) { if (stdin) process(stdin, ''); return out; }
    files.forEach(f => {
      const p = resolvePath(f); const node = getNode(p);
      if (!node)               { out.push(E.err(`tail: ${f}: No such file or directory`)); return; }
      if (node.type === 'dir') { out.push(E.err(`tail: ${f}: Is a directory`)); return; }
      process(node.content || '', f);
    });
    return out;
  };

  CMDS.wc = (args, flags, stdin) => {
    const noFlags = !flags.l && !flags.w && !flags.c;
    const doL = flags.l || noFlags;
    const doW = flags.w || noFlags;
    const doC = flags.c || noFlags;
    const out = [];
    let tl=0, tw=0, tc=0;
    function process(content, fname) {
      const l = content.split('\n').length;
      const w = content.split(/\s+/).filter(Boolean).length;
      const c = content.length;
      tl+=l; tw+=w; tc+=c;
      const parts = [];
      if (doL) parts.push(String(l).padStart(7));
      if (doW) parts.push(String(w).padStart(7));
      if (doC) parts.push(String(c).padStart(7));
      out.push(parts.join('') + (fname ? ' ' + fname : ''));
    }
    if (!args.length) { if (stdin) process(stdin, ''); return out; }
    args.forEach(f => {
      const p = resolvePath(f); const node = getNode(p);
      if (!node)               { out.push(E.err(`wc: ${f}: No such file or directory`)); return; }
      if (node.type === 'dir') { out.push(E.err(`wc: ${f}: Is a directory`)); return; }
      process(node.content || '', f);
    });
    if (args.length > 1) {
      const parts = [];
      if (doL) parts.push(String(tl).padStart(7));
      if (doW) parts.push(String(tw).padStart(7));
      if (doC) parts.push(String(tc).padStart(7));
      out.push(parts.join('') + ' total');
    }
    return out;
  };

  CMDS.sort = (args, flags, stdin) => {
    const reverse = flags.r;
    const unique  = flags.u;
    function process(content) {
      let lines = content.split('\n');
      if (unique) lines = [...new Set(lines)];
      lines.sort((a,b) => reverse ? b.localeCompare(a) : a.localeCompare(b));
      return lines.map(esc);
    }
    if (!args.length) return stdin ? process(stdin) : [];
    const p = resolvePath(args[0]); const node = getNode(p);
    if (!node)               return [E.err(`sort: ${args[0]}: No such file or directory`)];
    if (node.type === 'dir') return [E.err(`sort: ${args[0]}: Is a directory`)];
    return process(node.content || '');
  };

  CMDS.uniq = (args, _flags, stdin) => {
    function process(content) {
      const lines = content.split('\n');
      const out = [];
      lines.forEach((l, i) => { if (i === 0 || l !== lines[i-1]) out.push(esc(l)); });
      return out;
    }
    if (!args.length) return stdin ? process(stdin) : [];
    const p = resolvePath(args[0]); const node = getNode(p);
    if (!node) return [E.err(`uniq: ${args[0]}: No such file or directory`)];
    return process(node.content || '');
  };

  CMDS.cut = (args, flags, stdin) => {
    const delim  = flags.d || '\t';
    const fields = flags.f ? flags.f.split(',').map(f => parseInt(f) - 1) : [0];
    function process(content) {
      return content.split('\n').map(l => {
        const parts = l.split(delim);
        return esc(fields.map(i => parts[i] || '').join(delim));
      });
    }
    if (!args.length) return stdin ? process(stdin) : [];
    const p = resolvePath(args[0]); const node = getNode(p);
    if (!node) return [E.err(`cut: ${args[0]}: No such file or directory`)];
    return process(node.content || '');
  };

  CMDS.find = (args, flags) => {
    const startPath = args[0] ? resolvePath(args[0]) : state.cwd;
    const namePattern = flags.name;
    const typeFilter  = flags.type;
    const out = [];

    function walk(p, node) {
      if (!node) return;
      const name = basename(p);
      let include = true;
      if (namePattern) {
        const re = new RegExp('^' + namePattern.replace(/\*/g,'.*').replace(/\?/g,'.') + '$');
        include = re.test(name);
      }
      if (typeFilter) {
        if (typeFilter === 'f' && node.type !== 'file') include = false;
        if (typeFilter === 'd' && node.type !== 'dir')  include = false;
      }
      if (include) out.push(E.txt(p));
      if (node.type === 'dir') {
        Object.entries(node.children || {}).forEach(([n, child]) => walk(p + (p==='/'?'':'/') + n, child));
      }
    }

    walk(startPath, getNode(startPath));
    return out;
  };

  CMDS.chmod = (args) => {
    if (args.length < 2) return [E.err('chmod: missing operand')];
    const mode = args[0];
    const targets = args.slice(1);
    const out = [];
    targets.forEach(t => {
      const p = resolvePath(t);
      const node = getNode(p);
      if (!node) { out.push(E.err(`chmod: cannot access '${t}': No such file or directory`)); return; }
      // Octal mode
      if (/^\d+$/.test(mode)) {
        const m = parseInt(mode, 8);
        const o = ((m>>6)&7), g = ((m>>3)&7), w = (m&7);
        const fmt = n => [(n>>2&1)?'r':'-', (n>>1&1)?'w':'-', (n&1)?'x':'-'].join('');
        node.perms = fmt(o) + fmt(g) + fmt(w);
      } else if (/[+\-=]/.test(mode)) {
        // Symbolic: +x, -x, +r, a+x, u+x etc.
        let cur = (node.perms || 'rw-r--r--').split('');
        if (mode.includes('+x') || mode === 'a+x' || mode === 'u+x') { cur[2]='x'; if(mode.includes('a')||!mode.startsWith('u')){cur[5]='x';cur[8]='x';} }
        if (mode.includes('-x')) { cur[2]='-'; cur[5]='-'; cur[8]='-'; }
        if (mode.includes('+w')) { cur[1]='w'; }
        if (mode.includes('-w')) { cur[4]='-'; cur[7]='-'; }
        if (mode.includes('+r')) { cur[0]='r'; cur[3]='r'; cur[6]='r'; }
        node.perms = cur.join('');
      }
    });
    return out;
  };

  CMDS.chown = (args) => {
    if (args.length < 2) return [E.err('chown: missing operand')];
    const owner = args[0];
    args.slice(1).forEach(t => {
      const node = getNode(resolvePath(t));
      if (node) {
        const parts = owner.split(':');
        node.owner = parts[0];
        if (parts[1]) node.group = parts[1];
      }
    });
    return [];
  };

  CMDS.whoami = () => [E.txt(state.env.USER)];

  CMDS.id = () => {
    return [`uid=1000(${state.env.USER}) gid=1000(${state.env.USER}) groups=1000(${state.env.USER}),4(adm),27(sudo)`];
  };

  CMDS.sudo = (args) => {
    if (!args.length) return [E.err('sudo: a command is required')];
    return [
      E.dim('[sudo] password for ' + state.env.USER + ': '),
      E.err('sudo: This is a sandboxed environment. Elevated privileges are simulated.'),
      E.dim('Hint: in a real system, sudo grants temporary root access for the command.'),
    ];
  };

  CMDS.env = () => {
    const all = { ...state.env, ...state.vars };
    return Object.entries(all).map(([k,v]) => E.txt(k + '=' + v));
  };

  CMDS.export = (args) => {
    args.forEach(arg => {
      const idx = arg.indexOf('=');
      if (idx === -1) { state.env[arg] = state.vars[arg] || ''; }
      else {
        const k = arg.slice(0, idx);
        const v = expandVars(arg.slice(idx+1));
        state.env[k] = v;
      }
    });
    return [];
  };

  CMDS.unset = (args) => {
    args.forEach(k => { delete state.vars[k]; delete state.env[k]; });
    return [];
  };

  CMDS.history = () => {
    return state.cmdHist.map((cmd, i) => E.dim(String(i+1).padStart(4) + '  ') + E.txt(cmd));
  };

  CMDS.clear = () => '__CLEAR__';

  CMDS.date = () => [E.txt(new Date().toString())];

  CMDS.uname = (args, flags) => {
    if (flags.a) return ['ISS Linux icestreams 5.15.0-iss #1 SMP x86_64 GNU/Linux'];
    if (flags.r) return ['5.15.0-iss'];
    if (flags.n) return ['icestreams'];
    return ['Linux'];
  };

  CMDS.uptime = () => {
    const h = Math.floor(Math.random()*8)+2, m = Math.floor(Math.random()*60);
    return [` ${String(h).padStart(2)}:${String(m).padStart(2,'0')}  up ${h} hours, ${m} min,  1 user,  load average: 0.12, 0.08, 0.05`];
  };

  CMDS.df = (args, flags) => {
    const human = flags.h;
    const header = `Filesystem      ${human?'Size  Used Avail Use%':'1K-blocks   Used Available Use%'} Mounted on`;
    const rows = human
      ? ['rootfs           50G   12G    38G  24% /',
         'tmpfs           7.8G     0   7.8G   0% /tmp',
         '/dev/sda1        50G   12G    38G  24% /']
      : ['rootfs        52428800 12582912 39845888  24% /',
         'tmpfs          8126464        0  8126464   0% /tmp'];
    return [header, ...rows].map(esc);
  };

  CMDS.du = (args, flags) => {
    const human = flags.h;
    const path = args[0] ? resolvePath(args[0]) : state.cwd;
    const node = getNode(path);
    if (!node) return [E.err(`du: ${args[0] || path}: No such file or directory`)];
    const size = human ? '4.2M' : '4316';
    return [E.txt(`${size}\t${path}`)];
  };

  CMDS.which = (args) => {
    return args.map(cmd => {
      if (CMDS[cmd]) return E.txt(`/usr/bin/${cmd}`);
      return E.err(`which: no ${cmd} in (/usr/local/bin:/usr/bin:/bin)`);
    });
  };

  CMDS.file = (args) => {
    return args.map(arg => {
      const p = resolvePath(arg);
      const node = getNode(p);
      if (!node) return E.err(`file: ${arg}: No such file or directory`);
      if (node.type === 'dir') return E.txt(`${arg}: directory`);
      const c = node.content || '';
      if (c.startsWith('#!/bin/bash') || c.startsWith('#!/bin/sh')) return E.txt(`${arg}: Bourne-Again shell script, ASCII text executable`);
      return E.txt(`${arg}: ASCII text`);
    });
  };

  CMDS.help = () => [
    E.ice('ISS TERMINAL — available commands'),
    '',
    E.dim('Navigation') + ':',
    '  ' + E.txt('pwd cd ls mkdir rmdir rm cp mv touch'),
    '',
    E.dim('File content') + ':',
    '  ' + E.txt('cat echo head tail wc sort uniq cut grep find'),
    '',
    E.dim('System') + ':',
    '  ' + E.txt('whoami id chmod chown sudo env export unset'),
    '  ' + E.txt('date uname uptime df du which file history'),
    '',
    E.dim('Editing') + ':',
    '  ' + E.txt('vim <file>') + '   — open modal text editor',
    '  ' + E.txt('bash <file>') + '  — run a shell script',
    '',
    E.dim('Special') + ':',
    '  ' + E.txt('man <cmd>') + '  — read manual for command',
    '  ' + E.txt('clear') + '      — clear the terminal',
    '  ' + E.txt('help') + '       — this message',
    '',
    E.dim('Operators') + ':',
    '  ' + E.txt('cmd1 | cmd2') + '   pipe output',
    '  ' + E.txt('echo x > f') + '   write to file',
    '  ' + E.txt('echo x >> f') + '  append to file',
    '  ' + E.txt('VAR=value') + '    set variable',
    '  ' + E.txt('$VAR') + '         expand variable',
    '',
    E.dim('Tip') + ': Up/Down history · Tab completion · Ctrl+L clear',
  ];

  /* ── man pages ── */
  const MAN_PAGES = {
    ls:    'ls [opts] [path]\n\nList directory contents.\n\n  -a   include hidden files (starting with .)\n  -l   long format (permissions, owner, size, date)\n\nExample: ls -la /etc',
    cd:    'cd [dir]\n\nChange the current working directory.\n\n  cd       go to home (~)\n  cd ..    go up one level\n  cd -     go to previous directory\n  cd /etc  absolute path\n  cd docs  relative path',
    cat:   'cat [file...]\n\nConcatenate and display file contents.\n\nExample: cat readme.txt\nExample: cat file1 file2',
    grep:  'grep [opts] pattern [file...]\n\nSearch for pattern in files (or stdin).\n\n  -i   case insensitive\n  -n   show line numbers\n  -v   invert (show non-matching)\n  -c   count matches only\n\nExample: grep ERROR /var/log/syslog\nExample: cat file | grep "search term"',
    chmod: 'chmod mode file\n\nChange file permissions.\n\nOctal notation:\n  chmod 755 file   owner rwx, others rx\n  chmod 644 file   owner rw, others r\n  chmod 600 file   owner rw only\n  chmod +x file    add execute for all\n\nPermission bits: r=4 w=2 x=1\nEach group (owner/group/other) sums to 0-7.',
    echo:  'echo [text]\n\nPrint text to output. Expands variables.\n\nExample: echo hello world\nExample: echo $HOME\nExample: echo "value" > file.txt',
    head:  'head [-n N] file\n\nPrint first N lines of file (default 10).\n\nExample: head -n 5 notes.txt\nExample: cat file | head -n 20',
    tail:  'tail [-n N] file\n\nPrint last N lines of file (default 10).\n\nExample: tail -n 5 /var/log/syslog\nExample: tail -n 20 auth.log',
    wc:    'wc [-l|-w|-c] file\n\nCount lines, words, characters.\n\n  -l   lines only\n  -w   words only\n  -c   characters only\n\nExample: wc -l /etc/passwd\nExample: cat file | wc -w',
    find:  'find [path] [-name pattern] [-type f|d]\n\nSearch for files.\n\n  -name "*.txt"   by filename (glob)\n  -type f         files only\n  -type d         directories only\n\nExample: find /home/user -name "*.txt"\nExample: find . -type d',
    mkdir: 'mkdir [-p] dir\n\nCreate directory.\n\n  -p   create parent directories as needed\n\nExample: mkdir projects\nExample: mkdir -p a/b/c',
    rm:    'rm [-r] [-f] file\n\nRemove files or directories.\n\n  -r   recursive (required for directories)\n  -f   force (no error on missing files)\n\nExample: rm file.txt\nExample: rm -r mydir',
    vim:   'vim <file>\n\nOpen a file in the vim text editor.\nVim is modal — keys do different things depending on the mode.\n\nMODES:\n  Normal (default) — navigate and run commands\n  Insert           — type text\n  Command          — execute editor commands\n\nNORMAL MODE KEYS:\n  i        enter Insert mode at cursor\n  a        enter Insert mode after cursor\n  A        enter Insert at end of line\n  o        open new line below, enter Insert\n  O        open new line above, enter Insert\n  h j k l  move cursor left/down/up/right\n  gg       go to first line\n  G        go to last line\n  0        go to start of line\n  $        go to end of line\n  dd       delete current line\n  u        undo last change\n  :        enter Command mode\n\nCOMMAND MODE (after pressing :):\n  :w       save (write) file\n  :q       quit (fails if unsaved changes)\n  :q!      quit without saving\n  :wq      save and quit\n  :x       save and quit (same as :wq)\n\nINSERT MODE:\n  Esc      return to Normal mode\n  (all other keys type text normally)\n\nExample: vim notes.txt\nExample: vim ~/scripts/backup.sh',
    bash:  'bash [script]\n\nRun a shell script file.\n\nExample: bash myscript.sh\nExample: bash ~/scripts/greet.sh\n\nNote: the script must be a plain text file with bash commands.\nLines starting with # are comments and are skipped.\nThe first line #!/bin/bash is a comment that names the interpreter.',
    awk:   'awk [-F sep] program [file...]\n\nPattern-scanning and text processing language.\n\nProgram structure:\n  BEGIN { setup }\n  /pattern/ { action }\n  { action }     (runs on every line)\n  END { teardown }\n\nField variables:\n  $0     entire line\n  $1 $2  individual fields (split by whitespace or -F sep)\n  $NF    last field\n  NR     current line number\n  NF     number of fields on current line\n\nExamples:\n  awk \'{ print $1 }\' file         print first field\n  awk \'{ print $NF }\' file        print last field\n  awk \'NR==3\' file                print line 3\n  awk \'/error/ { print NR, $0 }\' file\n  awk -F: \'{ print $1 }\' /etc/passwd\n  awk \'{ sum += $3 } END { print sum }\' file\n  awk \'{ count++ } END { print count }\' file',
    make:  'make [target]\n\nBuild automation tool that reads a Makefile.\n\nUsage:\n  make              run default (first) target\n  make all          run \'all\' target\n  make clean        run \'clean\' target\n  make -n           dry run (print commands, don\'t run)\n\nMakefile structure:\n  VAR = value       variable assignment\n  target: deps      rule header (deps are prerequisites)\n  <TAB>command      recipe (MUST start with a real tab)\n  .PHONY: target    declare non-file target\n\nAutomatic variables:\n  $@   target name\n  $<   first prerequisite\n  $^   all prerequisites\n  $(VAR)  expand make variable',
    apt:   'apt [command] [options] [package...]\n\nHigh-level package management interface.\n\nCommands:\n  apt update              refresh package index from repositories\n  apt upgrade             upgrade all installed packages\n  apt install <pkg>       download and install package(s)\n  apt remove <pkg>        remove package (keep config)\n  apt purge <pkg>         remove package and configuration\n  apt search <term>       search package names and descriptions\n  apt show <pkg>          display detailed package info\n  apt list                list all known packages\n  apt list --installed    list only installed packages\n\nOptions:\n  -y    auto-confirm prompts\n\nExamples:\n  apt install tmux\n  apt search json\n  apt show neovim',
    dpkg:  'dpkg [options] [package]\n\nLow-level package manager for Debian/Ubuntu systems.\n\nOptions:\n  -l [pkg]     list installed packages (optionally filtered)\n  -s <pkg>     show installed package status\n  -L <pkg>     list files installed by a package\n  -i <file>    install a .deb file\n\nExamples:\n  dpkg -l\n  dpkg -l bash\n  dpkg -s vim\n  dpkg -L git',
  };

  CMDS.man = (args) => {
    if (!args.length) return [E.err('man: what manual page do you want?')];
    const page = MAN_PAGES[args[0]];
    if (!page) return [E.err(`man: no manual entry for '${args[0]}'`)];
    const lines = page.split('\n');
    const out = [E.ice(`MAN — ${args[0].toUpperCase()}(1)`), E.dim('─'.repeat(40))];
    lines.forEach(l => {
      if (!l) out.push('');
      else if (/^\S/.test(l)) out.push(E.ice(l));
      else out.push(E.txt(l));
    });
    out.push(E.dim('─'.repeat(40)));
    return out;
  };

  /* ─────────────────────────────────────────────────────────
     SCRIPTING PARSERS & CONDITION EVALUATOR
  ───────────────────────────────────────────────────────── */

  /* Split on operator only at top-level (not inside quotes/brackets) */
  function splitOnOp(input, op) {
    const parts = []; let cur = '', depth = 0, inS = false, inD = false;
    for (let i = 0; i < input.length; i++) {
      const c = input[i];
      if (c === "'" && !inD) inS = !inS;
      else if (c === '"' && !inS) inD = !inD;
      else if (!inS && !inD) {
        if (c === '(' || c === '[') depth++;
        else if (c === ')' || c === ']') depth--;
        else if (depth === 0 && input.slice(i, i+op.length) === op) {
          parts.push(cur.trim()); cur = ''; i += op.length - 1; continue;
        }
      }
      cur += c;
    }
    if (cur.trim()) parts.push(cur.trim());
    return parts;
  }
  function splitOnSemi(s) { return splitOnOp(s, ';'); }
  function splitOnAnd(s)  { return splitOnOp(s, '&&'); }
  function splitOnOr(s)   { return splitOnOp(s, '||'); }

  function parseForLoop(input) {
    // for VAR in LIST; do BODY; done  OR  for ((i=0;i<N;i++)); do BODY; done
    const m = input.match(/^for\s+(\w+)\s+in\s+(.*?);\s*do\s+(.*);\s*done\s*$/s);
    if (!m) return null;
    const items = expandVars(m[2]).trim().split(/\s+/).filter(Boolean);
    return { varName: m[1], items, body: m[3].trim() };
  }

  function parseWhileLoop(input) {
    const m = input.match(/^(while|until)\s+(.+?);\s*do\s+(.+);\s*done\s*$/s);
    if (!m) return null;
    return { type: m[1], cond: m[2].trim(), body: m[3].trim() };
  }

  function parseIfStatement(input) {
    // if [ cond ]; then CMD; elif [ cond2 ]; then CMD2; else CMD3; fi
    const m = input.match(/^if\s+(.+?);\s*then\s+(.*?)(?:;\s*elif\s+(.+?);\s*then\s+(.*?))?(?:;\s*else\s+(.*?))?;\s*fi\s*$/s);
    if (!m) return null;
    return { condition: m[1].trim(), thenCmd: m[2].trim(),
             elifCond: m[3]?m[3].trim():null, elifCmd: m[4]?m[4].trim():null,
             elseCmd: m[5]?m[5].trim():null };
  }

  function parseCaseStatement(input) {
    const m = input.match(/^case\s+(\S+)\s+in\s+(.+)\s+esac\s*$/s);
    if (!m) return null;
    const val = expandVars(m[1]);
    const body = m[2];
    // parse patterns: pat) cmd ;; ...
    const clauses = [];
    const patRE = /([^)]+)\)([^;]+)(?:;;|$)/g;
    let hit;
    while ((hit = patRE.exec(body)) !== null) {
      clauses.push({ pattern: hit[1].trim(), cmd: hit[2].trim() });
    }
    return { val, clauses };
  }

  function parseFunctionDef(input) {
    // name() { body } or function name { body }
    const m1 = input.match(/^(\w+)\s*\(\s*\)\s*\{\s*(.+)\s*\}\s*$/s);
    if (m1) return { name: m1[1], body: m1[2].trim() };
    const m2 = input.match(/^function\s+(\w+)\s*\{\s*(.+)\s*\}\s*$/s);
    if (m2) return { name: m2[1], body: m2[2].trim() };
    return null;
  }

  function evalCondition(cond) {
    cond = expandVars(cond).trim().replace(/^\[\[?\s*|\s*\]?\]$/, '');
    // && and || inside condition
    if (cond.includes(' && ')) { const p = cond.split(' && '); return p.every(c => evalCondition(c.trim())); }
    if (cond.includes(' || ')) { const p = cond.split(' || '); return p.some(c => evalCondition(c.trim())); }
    // ! negation
    if (cond.startsWith('! ')) return !evalCondition(cond.slice(2).trim());
    const c = cond.trim();
    // File tests
    const fileTest = c.match(/^(-[fedrwxsLp])\s+"?([^"]+)"?$/);
    if (fileTest) {
      const node = getNode(resolvePath(fileTest[2]));
      switch(fileTest[1]) {
        case '-f': return !!(node && node.type === 'file');
        case '-d': return !!(node && node.type === 'dir');
        case '-e': return !!node;
        case '-r': case '-w': return !!node;
        case '-x': return !!(node && node.perms && node.perms[2] === 'x');
        case '-s': return !!(node && node.type === 'file' && node.content && node.content.length > 0);
        default: return !!node;
      }
    }
    // String tests
    if (c.match(/^-z\s+"?(.*?)"?$/)) { const m=c.match(/^-z\s+"?(.*?)"?$/); return m[1].length === 0; }
    if (c.match(/^-n\s+"?(.*?)"?$/)) { const m=c.match(/^-n\s+"?(.*?)"?$/); return m[1].length > 0; }
    // Regex match =~
    const reMatch = c.match(/^"?(.+?)"?\s+=~\s+(.+)$/);
    if (reMatch) { try { return new RegExp(reMatch[2]).test(reMatch[1]); } catch(e) { return false; } }
    // String equality
    const strEq = c.match(/^"?([^"]*?)"?\s*(==|=|!=)\s*"?([^"]*?)"?$/);
    if (strEq) { return strEq[2] === '!=' ? strEq[1] !== strEq[3] : strEq[1] === strEq[3]; }
    // Numeric comparisons
    const numOps = c.match(/^([^\s]+)\s+(-eq|-ne|-lt|-gt|-le|-ge)\s+([^\s]+)$/);
    if (numOps) {
      const a = parseInt(numOps[1]) || 0, b = parseInt(numOps[3]) || 0;
      switch(numOps[2]) {
        case '-eq': return a===b; case '-ne': return a!==b;
        case '-lt': return a<b;  case '-gt': return a>b;
        case '-le': return a<=b; case '-ge': return a>=b;
      }
    }
    // Non-empty string is truthy
    return c !== '' && c !== '0' && c !== 'false';
  }

  /* ─────────────────────────────────────────────────────────
     PARSER: tokenize, split pipes, handle redirects
  ───────────────────────────────────────────────────────── */
  function splitPipes(input) {
    const parts = [];
    let cur = '', inS = false, inD = false;
    for (let i = 0; i < input.length; i++) {
      const c = input[i];
      if      (c === "'" && !inD) inS = !inS;
      else if (c === '"' && !inS) inD = !inD;
      else if (c === '|' && !inS && !inD) { parts.push(cur); cur = ''; }
      else cur += c;
    }
    parts.push(cur);
    return parts.map(p => p.trim()).filter(Boolean);
  }

  function extractRedirects(segment) {
    let outFile = null, appendFile = null, errFile = null;
    let clean = segment
      .replace(/2>>\s*(\S+)/g, (_, f) => { errFile = f; return ''; }) // stderr append
      .replace(/2>&1/g, () => '')                                         // merge stderr->stdout
      .replace(/2>\s*(\S+)/g, () => '')                                 // discard stderr
      .replace(/>>\s*(\S+)/g, (_, f) => { appendFile = f; return ''; })
      .replace(/>\s*(\S+)/g,  (_, f) => { outFile    = f; return ''; })
      .replace(/<\s*(\S+)/g,  () => '');                                // strip stdin redirect
    return { clean: clean.trim(), outFile, appendFile };
  }

  function parseCmd(segment) {
    const tokens = tokenize(segment.trim());
    if (!tokens.length) return null;
    const cmd   = tokens[0];
    const args  = [];
    const flags = {};
    for (let i = 1; i < tokens.length; i++) {
      const t = expandVars(tokens[i]);
      if (t.startsWith('--')) {
        const [k, v] = t.slice(2).split('=');
        flags[k] = v !== undefined ? v : true;
      } else if (t.startsWith('-') && t.length > 1 && !/^\-\d+$/.test(t)) {
        t.slice(1).split('').forEach(f => flags[f] = true);
        // handle -n5 style
        const numMatch = t.match(/^-([a-zA-Z])(\d+)$/);
        if (numMatch) { flags[numMatch[1]] = numMatch[2]; }
      } else {
        args.push(t);
      }
    }
    return { cmd, args, flags };
  }

  /* ─────────────────────────────────────────────────────────
     MAIN EXECUTE
  ───────────────────────────────────────────────────────── */
  // Signals for loop control (returned as special strings)
  const _BREAK = '__BREAK__', _CONTINUE = '__CONTINUE__', _RETURN = '__RETURN__';

  function execute(rawInput) {
    const input = rawInput.trim();
    if (!input || input.startsWith('#')) return [];

    // set -x tracing
    if (state.options.x) process.stdout && console.log && console.log('+ ' + input);

    // 0. Array assignment: NAME=(elem1 elem2 ...)
    const arrM = input.match(/^([A-Za-z_]\w*)=\((.*)\)$/);
    if (arrM) {
      state.arrays[arrM[1]] = tokenize(expandVars(arrM[2]));
      return [];
    }

    // 1. Function definition: name() { body } or function name { body }
    const funcDef = parseFunctionDef(input);
    if (funcDef) { state.funcs[funcDef.name] = funcDef.body; return []; }

    // 2. Control structures (check before semicolon splitting)
    if (/^for\s/.test(input) && /\bdone\b/.test(input)) {
      const forLoop = parseForLoop(input);
      if (forLoop) {
        const out = [];
        for (const item of forLoop.items) {
          state.vars[forLoop.varName] = item;
          const r = execute(forLoop.body);
          if (r === _BREAK) break;
          if (r === _CONTINUE) continue;
          if (Array.isArray(r)) out.push(...r);
        }
        delete state.vars[forLoop.varName];
        return out;
      }
    }

    if ((/^while\s/.test(input) || /^until\s/.test(input)) && /\bdone\b/.test(input)) {
      const loop = parseWhileLoop(input);
      if (loop) {
        const out = [];
        let guard = 0;
        while (guard++ < 500) {
          const condParts = splitOnSemi(loop.cond);
          const condInput = condParts[condParts.length - 1];
          const condOk = evalCondition(condInput.replace(/^\[\[?\s*|\s*\]?\]$/, ''));
          if (loop.type === 'while' && !condOk) break;
          if (loop.type === 'until' && condOk) break;
          const r = execute(loop.body);
          if (r === _BREAK) break;
          if (r === _CONTINUE) continue;
          if (Array.isArray(r)) out.push(...r);
        }
        return out;
      }
    }

    if (/^if\s/.test(input) && /\bfi\b/.test(input)) {
      const ifStmt = parseIfStatement(input);
      if (ifStmt) {
        const cond = ifStmt.condition.replace(/^\[\[?\s*|\s*\]?\]$/, '');
        if (evalCondition(cond)) return execute(ifStmt.thenCmd);
        if (ifStmt.elifCond && evalCondition(ifStmt.elifCond.replace(/^\[\[?\s*|\s*\]?\]$/, ''))) return execute(ifStmt.elifCmd);
        if (ifStmt.elseCmd) return execute(ifStmt.elseCmd);
        return [];
      }
    }

    if (/^case\s/.test(input) && /\besac\b/.test(input)) {
      const cs = parseCaseStatement(input);
      if (cs) {
        for (const cl of cs.clauses) {
          const pat = cl.pattern === '*' ? /.*/ : new RegExp('^' + cl.pattern.replace(/\*/g,'.*').replace(/\?/g,'.') + '$');
          if (pat.test(cs.val)) { return execute(cl.cmd); }
        }
        return [];
      }
    }

    // 2.5 Background operator & (cmd &)
    if (input.endsWith(' &') || input === '&') {
      const bgCmd = input.slice(0, -1).trim();
      if (bgCmd) {
        const pid = state.nextPid++;
        const jid = state.nextJid++;
        state.jobs.push({ jid, pid, cmd: bgCmd, status: 'running' });
        state.processes.push({ pid, cmd: bgCmd, user: state.env.USER, cpu:'0.0', mem:'0.1', stat:'S', start:'now', vsz:'4MB' });
        return [E.dim(`[${jid}] ${pid}`)];
      }
    }

    // 3. Semicolon sequencing
    const semis = splitOnSemi(input);
    if (semis.length > 1) {
      const out = [];
      for (const part of semis) {
        const r = execute(part);
        if (r === _BREAK || r === _CONTINUE) return r;
        if (Array.isArray(r)) out.push(...r);
      }
      return out;
    }

    // 4. && operator
    const ands = splitOnAnd(input);
    if (ands.length > 1) {
      const out = [];
      for (const part of ands) {
        const r = execute(part);
        if (Array.isArray(r)) out.push(...r);
        if (state.exitStatus !== 0) break;
      }
      return out;
    }

    // 5. || operator
    const ors = splitOnOr(input);
    if (ors.length > 1) {
      const out = [];
      for (const part of ors) {
        const r = execute(part);
        if (Array.isArray(r)) out.push(...r);
        if (state.exitStatus === 0) break;
      }
      return out;
    }

    // 6. Variable assignment: VAR=value (no command after)
    const assignM = input.match(/^([A-Za-z_][A-Za-z0-9_]*)=(.*)$/);
    if (assignM) {
      let val = assignM[2];
      val = val.replace(/^(['"])(.*?)\1$/, '$2'); // strip outer quotes
      state.vars[assignM[1]] = expandVars(val);
      state.exitStatus = 0;
      return [];
    }

    // 7. Pipeline + redirects
    const pipes = splitOnOp(input, '|');
    const { clean: lastClean, outFile, appendFile } = extractRedirects(pipes[pipes.length - 1]);
    if (pipes.length > 1) pipes[pipes.length - 1] = lastClean;
    else pipes[0] = lastClean;

    let stdout = null;
    let output = [];

    for (let i = 0; i < pipes.length; i++) {
      const parsed = parseCmd(pipes[i]);
      if (!parsed) continue;
      const { cmd, args, flags } = parsed;
      if (!cmd) continue;

      // Alias expansion (one level)
      if (state.aliases[cmd] && !parsed._aliasExpanded) {
        const expanded = state.aliases[cmd] + (args.length ? ' ' + args.join(' ') : '');
        const r = execute(expanded);
        if (r === '__CLEAR__') return '__CLEAR__';
        if (typeof r === 'string' && r.startsWith('__VIM__:')) return r;
        output = Array.isArray(r) ? r : [];
        stdout = output.map(l => l.replace(/<[^>]+>/g,'')).join('\n');
        continue;
      }

      let result;
      if (CMDS[cmd]) {
        result = CMDS[cmd](args, flags, stdout);
        state.exitStatus = (result && result.__exitStatus !== undefined) ? result.__exitStatus : 0;
        if (result && result.__exitStatus !== undefined) delete result.__exitStatus;
      } else if (state.funcs[cmd]) {
        // Call user-defined function
        if (state.callStack.length > 20) {
          result = [E.err(cmd + ': max recursion depth reached')];
        } else {
          state.callStack.push(cmd);
          const savedPos = state.positional;
          state.positional = args;
          const r = execute(state.funcs[cmd]);
          state.positional = savedPos;
          state.callStack.pop();
          result = Array.isArray(r) ? r : [];
        }
      } else {
        state.exitStatus = 127;
        result = [E.err(cmd + ': command not found')];
      }

      if (result === '__CLEAR__') return '__CLEAR__';
      if (typeof result === 'string' && result.startsWith('__VIM__:')) return result;
      if (!Array.isArray(result)) result = result ? [result] : [];

      if (i < pipes.length - 1) {
        stdout = result.map(l => l.replace(/<[^>]+>/g,'')).join('\n');
      } else {
        output = result;
      }
    }

    // File redirects
    if (outFile || appendFile) {
      const targetFile = outFile || appendFile;
      const p = resolvePath(targetFile);
      const dir = getParentPath(p), name = basename(p);
      const parentNode = getNode(dir);
      if (!parentNode || parentNode.type !== 'dir') {
        return [E.err('bash: ' + targetFile + ': No such file or directory')];
      }
      const text = output.map(l => l.replace(/<[^>]+>/g,'')).join('\n');
      if (outFile) {
        parentNode.children[name] = { type:'file', perms:'rw-r--r--', owner:state.env.USER, group:state.env.USER, mtime:'now', content:text };
      } else {
        const existing = parentNode.children[name];
        const prev = (existing && existing.type === 'file') ? existing.content : '';
        parentNode.children[name] = { ...(existing||{}), type:'file', perms:'rw-r--r--', owner:state.env.USER, group:state.env.USER, mtime:'now', content: prev + (prev ? '\n' : '') + text };
      }
      return [];
    }

    return output;
  }

  /* ─────────────────────────────────────────────────────────
     TAB COMPLETION
  ───────────────────────────────────────────────────────── */
  function tabComplete(partial) {
    const tokens = tokenize(partial);
    if (!tokens.length || (tokens.length === 1 && !partial.endsWith(' '))) {
      // Complete command name
      const prefix = tokens[0] || '';
      const matches = Object.keys(CMDS).filter(c => c.startsWith(prefix));
      return { matches, prefix };
    }
    // Complete file/directory path
    const lastToken = partial.endsWith(' ') ? '' : tokens[tokens.length - 1];
    const dir  = lastToken.includes('/') ? resolvePath(lastToken.slice(0, lastToken.lastIndexOf('/')+1)) : state.cwd;
    const file = lastToken.includes('/') ? lastToken.slice(lastToken.lastIndexOf('/')+1) : lastToken;
    const node = getNode(dir);
    if (!node || node.type !== 'dir') return { matches: [], prefix: lastToken };
    const matches = Object.keys(node.children)
      .filter(n => n.startsWith(file))
      .map(n => {
        const full = (lastToken.includes('/') ? lastToken.slice(0, lastToken.lastIndexOf('/')+1) : '') + n;
        return node.children[n].type === 'dir' ? full + '/' : full;
      });
    return { matches, prefix: lastToken };
  }

  /* ─────────────────────────────────────────────────────────
     PROMPT STRING
  ───────────────────────────────────────────────────────── */
  function getPromptHTML() {
    if (state.sshSession) {
      const sp = state.sshSession.cwd.replace('/home/' + state.sshSession.user, '~');
      return `<span class="ps1-user">${state.sshSession.user}</span>` +
             `<span class="ps1-at">@</span>` +
             `<span class="ps1-host" style="color:var(--spice)">${state.sshSession.host}</span>` +
             `<span class="ps1-sep">:</span>` +
             `<span class="ps1-path">${esc(sp)}</span>` +
             `<span class="ps1-dollar">$&nbsp;</span>`;
    }
    const sp = shortPath(state.cwd);
    return `<span class="ps1-user">${state.env.USER}</span>` +
           `<span class="ps1-at">@</span>` +
           `<span class="ps1-host">${state.env.HOSTNAME}</span>` +
           `<span class="ps1-sep">:</span>` +
           `<span class="ps1-path">${esc(sp)}</span>` +
           `<span class="ps1-dollar">$&nbsp;</span>`;
  }

  /* ─────────────────────────────────────────────────────────
     ADDITIONAL COMMANDS
  ───────────────────────────────────────────────────────── */

  CMDS.printf = (args, _f, stdin) => {
    if (!args.length) return [];
    let fmt = args[0].replace(/\\n/g,'\n').replace(/\\t/g,'\t');
    let i = 1, result = fmt.replace(/%[sdf%q]/g, m => {
      if (m === '%%') return '%';
      const v = args[i++] || '';
      if (m === '%d') return String(parseInt(v)||0);
      if (m === '%f') return parseFloat(v).toFixed(6);
      if (m === '%q') return '"' + v.replace(/"/g,'\\"') + '"';
      return v;
    });
    return result.split('\n').filter((l,i,a)=>i<a.length-1||l).map(l=>E.txt(l));
  };

  CMDS.true  = () => { state.exitStatus = 0; return []; };
  CMDS.false = () => { state.exitStatus = 1; return []; };

  CMDS['['] = CMDS.test = (args) => {
    // strip trailing ]
    const a = args.filter(x=>x!==']').join(' ');
    state.exitStatus = evalCondition(a) ? 0 : 1;
    return [];
  };
  CMDS['[['] = (args) => {
    const a = args.filter(x=>x!==']]').join(' ');
    state.exitStatus = evalCondition(a) ? 0 : 1;
    return [];
  };

  CMDS.let = (args) => {
    for (const expr of args) {
      // let VAR=expr  or  let VAR++
      const incMatch = expr.match(/^([A-Za-z_]\w*)\+\+$/);
      const decMatch = expr.match(/^([A-Za-z_]\w*)--$/);
      if (incMatch) { state.vars[incMatch[1]] = String((parseInt(lookupVar(incMatch[1]))||0)+1); continue; }
      if (decMatch) { state.vars[decMatch[1]] = String((parseInt(lookupVar(decMatch[1]))||0)-1); continue; }
      const m = expr.match(/^([A-Za-z_]\w*)=(.+)$/);
      if (m) { state.vars[m[1]] = String(evalArith(m[2])); }
    }
    state.exitStatus = 0; return [];
  };

  CMDS.expr = (args) => {
    const expr = args.join(' ');
    // string operations: length, substr, index, match
    if (args[0] === 'length') { return [E.txt(String((args[1]||'').length))]; }
    if (args[0] === 'substr') { return [E.txt((args[1]||'').substr(parseInt(args[2]||0)-1, parseInt(args[3]||999)))]; }
    if (args[0] === 'index')  { const i=(args[1]||'').indexOf(args[2]||''); return [E.txt(String(i===-1?0:i+1))]; }
    // arithmetic
    try { const v = evalArith(expr); state.exitStatus = v?0:1; return [E.txt(String(v))]; }
    catch(e) { return [E.err('expr: syntax error')]; }
  };

  CMDS.read = (args) => {
    // Simulated read — assigns a placeholder value for curriculum purposes
    const varName = args[0] || 'REPLY';
    state.vars[varName] = '(simulated input)';
    return [E.dim('[read: input simulated as "(simulated input)"]')];
  };

  CMDS.declare = CMDS.local = (args, flags) => {
    // -a array, -i integer, -r readonly, -p print
    if (flags.p) {
      return Object.entries(state.vars).map(([k,v]) => E.txt('declare -- ' + k + '="' + v + '"'));
    }
    for (const arg of args) {
      const m = arg.match(/^([A-Za-z_]\w*)=(.*)$/);
      if (m) {
        let val = m[2].replace(/^['"]|['"]$/g,'');
        if (flags.i) val = String(parseInt(expandVars(val))||0);
        else val = expandVars(val);
        state.vars[m[1]] = val;
      } else if (flags.a) {
        state.arrays[arg] = state.arrays[arg] || [];
      }
    }
    return [];
  };

  CMDS.readonly = (args) => {
    for (const arg of args) {
      const m = arg.match(/^([A-Za-z_]\w*)=(.*)$/);
      if (m) state.vars[m[1]] = expandVars(m[2].replace(/^['"]|['"]$/g,''));
    }
    return [E.dim('(readonly set — this simulator does not enforce immutability)')];
  };

  CMDS.alias = (args) => {
    if (!args.length) {
      return Object.entries(state.aliases).map(([k,v]) => E.txt("alias " + k + "='" + v + "'"));
    }
    for (const arg of args) {
      const m = arg.match(/^([\w-]+)=(.+)$/);
      if (m) state.aliases[m[1]] = m[2].replace(/^['"]|['"]$/g,'');
    }
    return [];
  };
  CMDS.unalias = (args) => { args.forEach(a => delete state.aliases[a]); return []; };

  CMDS.return = (args) => {
    state.exitStatus = parseInt(args[0]||'0');
    return [];
  };

  CMDS.exit = (args) => {
    state.exitStatus = parseInt(args[0]||'0');
    return [E.dim('(exit ' + state.exitStatus + ')')];
  };

  CMDS.shift = (args) => {
    const n = parseInt(args[0]||'1');
    state.positional = state.positional.slice(n);
    return [];
  };

  CMDS.set = (args, flags) => {
    for (const arg of args) {
      if (arg === '-x' || arg === '-o' && args[args.indexOf(arg)+1]==='xtrace') state.options.x = true;
      if (arg === '+x') state.options.x = false;
      if (arg === '-e') state.options.e = true;
      if (arg === '+e') state.options.e = false;
      if (arg === '-u') state.options.u = true;
      if (arg === '+u') state.options.u = false;
      if (arg === '-euo' || arg === '-eou' || arg === '-ueo') { state.options.e=true; state.options.u=true; state.options.x=false; }
      if (arg.startsWith('-euo') || arg.startsWith('-eo') || arg.startsWith('-eu')) { state.options.e=true; state.options.u=true; }
    }
    // set -- clears positional params
    if (args.includes('--')) state.positional = [];
    return [];
  };

  CMDS.type = (args) => {
    return args.map(cmd => {
      if (CMDS[cmd])        return E.txt(cmd + ' is a shell builtin');
      if (state.funcs[cmd]) return E.txt(cmd + ' is a function');
      if (state.aliases[cmd]) return E.txt(cmd + ' is aliased to `' + state.aliases[cmd] + "'");
      return E.txt(cmd + ' is /usr/bin/' + cmd);
    });
  };

  CMDS.source = CMDS['.'] = (args) => {
    if (!args.length) return [E.err('source: filename required')];
    return CMDS.bash(args, {}, null);
  };

  CMDS.break    = () => _BREAK;
  CMDS.continue = () => _CONTINUE;

  CMDS.trap = (args) => [E.dim('(trap: ' + args.join(' ') + ' — noted)')];

  CMDS.awk = (args, _flags, stdin) => {
    if (!args.length) return [E.err('awk: usage: awk program [file...]')];
    const prog = args[0];
    const input = (() => {
      if (args[1]) { const node = getNode(resolvePath(args[1])); return node && node.type==='file' ? node.content : ''; }
      return stdin || '';
    })();
    const lines = input.split('\n').filter(Boolean);
    const out = [];
    // support: {print $N}, {print $NF}, /pattern/{print}, BEGIN{}, END{}
    const printField = prog.match(/^\{\s*print\s+(.+?)\s*\}$/);
    const patPrint   = prog.match(/^\/(.+?)\/\s*\{\s*print\s*(.*?)\s*\}$/);
    const nfPrint    = prog.match(/\$NF/);
    for (const line of lines) {
      const fields = line.trim().split(/\s+/);
      if (patPrint) {
        if (!new RegExp(patPrint[1]).test(line)) continue;
        const fieldRef = patPrint[2];
        if (!fieldRef || fieldRef === '$0') { out.push(E.txt(line)); continue; }
        const fIdx = parseInt(fieldRef.replace('$',''))-1;
        out.push(E.txt(isNaN(fIdx) ? line : (fields[fIdx]||'')));
        continue;
      }
      if (printField) {
        const fieldRef = printField[1];
        if (fieldRef === '$0') { out.push(E.txt(line)); continue; }
        if (fieldRef === '$NF') { out.push(E.txt(fields[fields.length-1]||'')); continue; }
        const fIdx = parseInt(fieldRef.replace('$',''))-1;
        if (!isNaN(fIdx)) { out.push(E.txt(fields[fIdx]||'')); continue; }
        out.push(E.txt(line));
      } else {
        out.push(E.txt(line));
      }
    }
    return out;
  };

  CMDS.sed = (args, flags, stdin) => {
    if (!args.length) return [E.err('sed: usage: sed expression [file...]')];
    const expr = args[0];
    const input = (() => {
      const fileArg = args.find((a,i)=>i>0&&!a.startsWith('-'));
      if (fileArg) { const node = getNode(resolvePath(fileArg)); return node && node.type==='file' ? node.content : ''; }
      return stdin || '';
    })();
    const lines = input.split('\n');
    // Support s/pat/rep/[g], /pat/d, /pat/p, q
    const subMatch = expr.match(/^s\/(.+?)\/([^/]*)\/([gi]*)$/);
    const delMatch = expr.match(/^\/(.+?)\/d$/);
    const printMatch = expr.match(/^\/(.+?)\/p$/);
    const quitMatch = expr.match(/^(\d+)q$/);
    if (quitMatch) return lines.slice(0, parseInt(quitMatch[1])).map(l=>E.txt(l));
    if (delMatch)  return lines.filter(l=>!new RegExp(delMatch[1]).test(l)).map(l=>E.txt(l));
    if (printMatch) return lines.filter(l=>new RegExp(printMatch[1]).test(l)).map(l=>E.txt(l));
    if (subMatch) {
      const re = new RegExp(subMatch[1], subMatch[3]||'');
      const out = flags.n ? [] : lines.map(l => E.txt(l.replace(re, subMatch[2])));
      return out;
    }
    return lines.map(l=>E.txt(l));
  };

  CMDS.tr = (args, _flags, stdin) => {
    if (!args.length || !stdin) return [];
    const [from, to] = [args[0], args[1]||''];
    // simple char-by-char translation
    const fromChars = from.replace(/\\n/g,'\n').replace(/\\t/g,'\t').split('');
    const toChars   = to.replace(/\\n/g,'\n').replace(/\\t/g,'\t').split('');
    const result = stdin.split('').map(c => {
      const idx = fromChars.indexOf(c);
      return idx !== -1 ? (toChars[idx]||'') : c;
    }).join('');
    return result.split('\n').filter(Boolean).map(l=>E.txt(l));
  };

  CMDS.basename = (args) => {
    if (!args.length) return [E.err('basename: missing operand')];
    let p = args[0].split('/').pop() || args[0];
    if (args[1] && p.endsWith(args[1])) p = p.slice(0, -args[1].length);
    return [E.txt(p)];
  };
  CMDS.dirname = (args) => {
    if (!args.length) return [E.err('dirname: missing operand')];
    const parts = args[0].split('/');
    parts.pop();
    return [E.txt(parts.join('/')||'.')];
  };

  CMDS.tee = (args, _flags, stdin) => {
    // write stdin to file AND pass through
    if (args[0] && stdin !== null) {
      const p = resolvePath(args[0]);
      const dir = getParentPath(p), name = basename(p);
      const parentNode = getNode(dir);
      if (parentNode && parentNode.type === 'dir') {
        parentNode.children[name] = { type:'file', perms:'rw-r--r--', owner:state.env.USER, group:state.env.USER, mtime:'now', content: stdin };
      }
    }
    return (stdin||'').split('\n').filter(Boolean).map(l=>E.txt(l));
  };

  CMDS.echo = (args, flags, _stdin) => {
    const text = args.join(' ');
    const expanded = expandVars(text);
    if (flags.n) return [E.txt(expanded)]; // no trailing newline (no-op in our line model)
    if (flags.e) {
      // interpret escape sequences
      const interpreted = expanded.replace(/\\n/g,'\n').replace(/\\t/g,'\t').replace(/\\033/g,'\x1b');
      return interpreted.split('\n').map(l=>E.txt(l));
    }
    return [E.txt(expanded)];
  };

  /* ─────────────────────────────────────────────────────────
     AWK (ENHANCED)
  ───────────────────────────────────────────────────────── */
  CMDS.awk = (args, flags, stdin) => {
    if (!args.length) return [E.err('awk: usage: awk [options] program [file...]')];
    let prog = '', fieldSep = null, files = [], i = 0;
    while (i < args.length) {
      if (args[i] === '-F' && args[i+1]) { fieldSep = args[i+1]; i += 2; continue; }
      if (args[i].startsWith('-F') && args[i].length > 2) { fieldSep = args[i].slice(2); i++; continue; }
      if (args[i] === '-v' && args[i+1]) { i += 2; continue; } // skip for now
      if (!prog) { prog = args[i]; i++; continue; }
      files.push(args[i]); i++;
    }
    const input = (() => {
      if (files.length) {
        return files.map(f => {
          const node = getNode(resolvePath(f));
          return (node && node.type === 'file') ? node.content : '';
        }).join('\n');
      }
      return stdin || '';
    })();
    const lines = input.split('\n');
    const out = [];

    // Parse program into BEGIN, END, and rule blocks
    // Supports: BEGIN{}, END{}, /pat/{}, pat{}, {action}
    function splitFields(line) {
      if (fieldSep) {
        const sep = fieldSep === '\\t' ? '\t' : fieldSep;
        return line.split(sep === 't' ? '\t' : sep.length === 1 ? sep : new RegExp(sep));
      }
      return line.trim() === '' ? [] : line.trim().split(/\s+/);
    }

    function evalAction(action, fields, lineNum, totalLines, allLines) {
      const NF = fields.length;
      const NR = lineNum;
      const line = fields.join(fieldSep ? (fieldSep === '\\t' ? '\t' : fieldSep) : ' ');
      const result = [];

      // Resolve field refs
      function resolveField(expr) {
        expr = expr.trim();
        if (expr === '$0') return line;
        if (expr === '$NF') return fields[NF - 1] || '';
        const m = expr.match(/^\$(\d+)$/);
        if (m) return fields[parseInt(m[1]) - 1] || '';
        if (expr === 'NF') return String(NF);
        if (expr === 'NR') return String(NR);
        if (expr === 'FNR') return String(NR);
        return expr.replace(/\$NF/g, fields[NF-1]||'')
                   .replace(/\$0/g, line)
                   .replace(/\$(\d+)/g, (_,n)=>fields[parseInt(n)-1]||'')
                   .replace(/\bNF\b/g, String(NF))
                   .replace(/\bNR\b/g, String(NR));
      }

      // Tokenize action into statements (simple parser)
      // Handle: print, printf, if, next, multiple statements
      const stmts = action.split(';').map(s => s.trim()).filter(Boolean);
      for (const stmt of stmts) {
        // print statement
        const printM = stmt.match(/^print\s*(.*)$/);
        if (printM) {
          const args = printM[1].trim();
          if (!args || args === '$0') { result.push(E.txt(line)); continue; }
          // Handle comma-separated print args
          const parts = args.split(',').map(p => p.trim()).map(p => {
            // strip quotes from string literals
            if ((p.startsWith('"') && p.endsWith('"')) || (p.startsWith("'") && p.endsWith("'")))
              return p.slice(1, -1);
            return resolveField(p);
          });
          result.push(E.txt(parts.join('\t')));
          continue;
        }
        // printf statement
        const printfM = stmt.match(/^printf\s+(.+)$/);
        if (printfM) {
          let fmt = printfM[1];
          const fmtParts = fmt.match(/^"([^"]*)"(?:,\s*(.+))?$/);
          if (fmtParts) {
            let out = fmtParts[1].replace(/\\n/g,'\n').replace(/\\t/g,'\t');
            if (fmtParts[2]) {
              const pArgs = fmtParts[2].split(',').map(a => resolveField(a.trim()));
              let ai = 0;
              out = out.replace(/%[sd]/g, () => pArgs[ai++] || '');
              out = out.replace(/%(\.\d+)?f/g, (_,p) => {
                const n = parseFloat(pArgs[ai++]||0);
                return p ? n.toFixed(parseInt(p.slice(1))) : n.toFixed(6);
              });
            }
            out.split('\n').filter((l,i,a)=>i<a.length-1||l).forEach(l=>result.push(E.txt(l)));
          }
          continue;
        }
        // next — skip line
        if (stmt === 'next') return null;
      }
      return result;
    }

    // Parse rules: BEGIN{}, END{}, /pat/{action}, {action}, pat~/re/{action}
    const rules = [];
    const ruleRe = /^(BEGIN|END|\/((?:[^\/\\]|\\.)*)\/)\s*\{([^}]*)\}$|^\{([^}]*)\}$/;
    // Split prog into rules (handle multiple rules separated by whitespace)
    let progRest = prog.trim();
    const ruleTokens = [];
    // Simple splitting: find all top-level {...} groups with optional preceding pattern
    let pi = 0;
    while (pi < progRest.length) {
      // skip whitespace
      while (pi < progRest.length && /\s/.test(progRest[pi])) pi++;
      if (pi >= progRest.length) break;
      // read pattern (up to {)
      let patStart = pi;
      while (pi < progRest.length && progRest[pi] !== '{') pi++;
      const pat = progRest.slice(patStart, pi).trim();
      // read { body }
      if (progRest[pi] === '{') {
        let depth = 0, bodyStart = pi;
        while (pi < progRest.length) {
          if (progRest[pi] === '{') depth++;
          else if (progRest[pi] === '}') { depth--; if (depth === 0) { pi++; break; } }
          pi++;
        }
        ruleTokens.push({ pat, body: progRest.slice(bodyStart+1, pi-1).trim() });
      }
    }
    if (!ruleTokens.length) {
      // fallback: treat whole prog as a single action
      ruleTokens.push({ pat: '', body: prog });
    }

    // Accumulators for BEGIN/END
    const accVars = {};

    // Process BEGIN blocks
    for (const rule of ruleTokens) {
      if (rule.pat === 'BEGIN') {
        // Handle variable-accumulating actions (simplified)
        const lines2 = rule.body.split(';').map(s=>s.trim()).filter(Boolean);
        for (const s of lines2) {
          const initM = s.match(/^(\w+)\s*=\s*(.+)$/);
          if (initM) accVars[initM[1]] = isNaN(initM[2]) ? initM[2].replace(/^"|"$/g,'') : Number(initM[2]);
        }
      }
    }

    // Process line rules
    let lineNum = 0;
    for (const rawLine of lines) {
      if (rawLine === '' && lines.length === 1) continue;
      lineNum++;
      const fields = splitFields(rawLine);

      for (const rule of ruleTokens) {
        if (rule.pat === 'BEGIN' || rule.pat === 'END') continue;

        // Pattern matching
        let match = true;
        if (rule.pat) {
          const patM = rule.pat.match(/^\/(.+)\/$/) ;
          if (patM) {
            try { match = new RegExp(patM[1]).test(rawLine); } catch(e) { match = false; }
          } else if (rule.pat.includes('~')) {
            const [field, repart] = rule.pat.split('~').map(s=>s.trim());
            const reM = repart.match(/^\/(.+)\/$/);
            if (reM) {
              const fIdx = field === '$0' ? -1 : parseInt(field.replace('$',''))-1;
              const testStr = fIdx === -1 ? rawLine : (fields[fIdx]||'');
              try { match = new RegExp(reM[1]).test(testStr); } catch(e) { match = false; }
            }
          } else if (rule.pat.includes('!~')) {
            const [field, repart] = rule.pat.split('!~').map(s=>s.trim());
            const reM = repart.match(/^\/(.+)\/$/);
            if (reM) {
              const fIdx = parseInt(field.replace('$',''))-1;
              const testStr = fields[fIdx]||'';
              try { match = !new RegExp(reM[1]).test(testStr); } catch(e) { match = false; }
            }
          }
        }
        if (!match) continue;

        // Accumulator actions (sum, count, etc.)
        const stmts = rule.body.split(';').map(s=>s.trim()).filter(Boolean);
        let skipPrint = false;
        for (const stmt of stmts) {
          // sum+= style
          const accumM = stmt.match(/^(\w+)\s*\+=\s*(.+)$/);
          if (accumM) {
            const NF = fields.length;
            let val = accumM[2].trim()
              .replace(/\$NF/g, fields[NF-1]||'0')
              .replace(/\$(\d+)/g, (_,n)=>fields[parseInt(n)-1]||'0')
              .replace(/\bNF\b/g, String(NF));
            accVars[accumM[1]] = (accVars[accumM[1]]||0) + (parseFloat(val)||0);
            skipPrint = true;
            continue;
          }
          // count++ style
          const incrM = stmt.match(/^(\w+)\+\+$/);
          if (incrM) { accVars[incrM[1]] = (accVars[incrM[1]]||0)+1; skipPrint = true; continue; }
          const decrM = stmt.match(/^(\w+)--$/);
          if (decrM) { accVars[decrM[1]] = (accVars[decrM[1]]||0)-1; skipPrint = true; continue; }
        }
        if (skipPrint) continue;

        const lineOut = evalAction(rule.body, fields, lineNum, lines.length, lines);
        if (lineOut === null) break; // next
        lineOut && out.push(...lineOut);
      }
    }

    // Process END blocks
    for (const rule of ruleTokens) {
      if (rule.pat !== 'END') continue;
      const stmts = rule.body.split(';').map(s=>s.trim()).filter(Boolean);
      for (const stmt of stmts) {
        const printM = stmt.match(/^print\s*(.*)$/);
        if (printM) {
          const arg = printM[1].trim();
          // Resolve accVars in the print arg
          let resolved = arg
            .replace(/\bNR\b/g, String(lineNum))
            .replace(/\bNF\b/g, '')
            .replace(/"([^"]*)"/g, '$1');
          // Replace var names with their accum values
          for (const [k,v] of Object.entries(accVars)) {
            resolved = resolved.replace(new RegExp('\\b'+k+'\\b','g'), String(v));
          }
          // Evaluate simple arithmetic
          try {
            const evaluated = Function('"use strict"; return (' + resolved + ')')();
            if (typeof evaluated === 'number') {
              out.push(E.txt(Number.isInteger(evaluated) ? String(evaluated) : evaluated.toFixed(2)));
            } else {
              out.push(E.txt(String(resolved)));
            }
          } catch(e) { out.push(E.txt(String(resolved))); }
        }
        const printfM = stmt.match(/^printf\s+"([^"]*)"(?:,\s*(.+))?$/);
        if (printfM) {
          let fmt = printfM[1].replace(/\\n/g,'\n').replace(/\\t/g,'\t');
          const pArgs = printfM[2] ? printfM[2].split(',').map(a => {
            const k = a.trim();
            if (accVars[k] !== undefined) return accVars[k];
            if (k === 'NR') return lineNum;
            return k;
          }) : [];
          let ai = 0;
          fmt = fmt.replace(/%[sd]/g, () => pArgs[ai++] ?? '');
          fmt = fmt.replace(/%(\.\d+)?f/g, (_,p) => {
            const n = parseFloat(pArgs[ai++]||0);
            return p ? n.toFixed(parseInt(p.slice(1))) : n.toFixed(6);
          });
          fmt.split('\n').filter((l,i,a)=>i<a.length-1||l).forEach(l=>out.push(E.txt(l)));
        }
      }
    }

    return out.length ? out : [];
  };

  /* ─────────────────────────────────────────────────────────
     MAKE
  ───────────────────────────────────────────────────────── */
  CMDS.make = (args, flags) => {
    const target = args[0] || 'all';
    const dryRun = flags.n || false;

    // Find Makefile in cwd
    const cwdNode = getNode(state.cwd);
    if (!cwdNode || cwdNode.type !== 'dir') return [E.err('make: cannot determine current directory')];
    const makefileNode = cwdNode.children['Makefile'] || cwdNode.children['makefile'] || cwdNode.children['GNUmakefile'];
    if (!makefileNode) return [E.err("make: *** No targets specified and no makefile found.  Stop.")];

    const makefileText = makefileNode.content || '';
    const lines = makefileText.split('\n');

    // Parse variables and targets
    const makeVars = {};
    const targets = {};
    let currentTarget = null;

    for (const line of lines) {
      if (line.startsWith('#') || line.trim() === '') { currentTarget = null; continue; }
      // Variable assignment: VAR = value or VAR := value
      const varM = line.match(/^([A-Za-z_][A-Za-z0-9_]*)\s*[:?]?=\s*(.*)$/);
      if (varM && !line.startsWith('\t')) {
        makeVars[varM[1]] = varM[2].trim();
        currentTarget = null;
        continue;
      }
      // Target rule: target: deps
      const tgtM = line.match(/^([.%A-Za-z0-9_/-]+(?:\s+[.%A-Za-z0-9_/-]+)*):\s*(.*)$/);
      if (tgtM && !line.startsWith('\t')) {
        const tgtNames = tgtM[1].trim().split(/\s+/);
        tgtNames.forEach(t => {
          targets[t] = targets[t] || { deps: tgtM[2].trim().split(/\s+/).filter(Boolean), recipe: [] };
        });
        currentTarget = tgtNames[0];
        continue;
      }
      // Recipe line (starts with tab)
      if (line.startsWith('\t') && currentTarget) {
        targets[currentTarget].recipe.push(line.slice(1));
      }
    }

    // Expand make variables
    function expandMakeVars(s) {
      return s.replace(/\$\(([^)]+)\)/g, (_, name) => {
        if (makeVars[name] !== undefined) return expandMakeVars(makeVars[name]);
        // Built-in automatic variables (simplified)
        if (name === '@') return currentTarget || '';
        return '';
      });
    }

    const out = [];
    const visited = new Set();

    function runTarget(t) {
      if (visited.has(t)) return;
      visited.add(t);

      // .PHONY and pattern rules: just show recipe
      const tgtDef = targets[t];
      if (!tgtDef) {
        // Not a real target — might be a file dependency, skip
        return;
      }

      // Run deps first
      for (const dep of tgtDef.deps) {
        if (targets[dep]) runTarget(dep);
      }

      // Run recipe
      for (const recipeLine of tgtDef.recipe) {
        const expanded = expandMakeVars(recipeLine);
        const silent = expanded.startsWith('@');
        const cmd = silent ? expanded.slice(1) : expanded;
        if (!silent) out.push(E.dim(cmd));
        if (!dryRun) {
          // Execute the recipe command through the terminal engine
          const result = execute(cmd);
          if (Array.isArray(result)) out.push(...result);
        }
      }

      // Track which targets have been run
      state.makeTargets[t] = true;
    }

    if (!targets[target]) {
      return [E.err(`make: *** No rule to make target '\${target}'.  Stop.`)];
    }
    runTarget(target);
    return out;
  };

  /* ─────────────────────────────────────────────────────────
     PACKAGE MANAGEMENT (apt / apt-get / dpkg)
  ───────────────────────────────────────────────────────── */
  function aptSearch(query) {
    const all = { ...state.packages.installed, ...state.packages.available };
    return Object.entries(all).filter(([name, pkg]) =>
      !query || name.includes(query) || pkg.desc.toLowerCase().includes(query.toLowerCase())
    );
  }

  CMDS.apt = CMDS['apt-get'] = (args, flags) => {
    const sub = args[0];
    const pkgArgs = args.slice(1).filter(a => !a.startsWith('-'));
    const yes = flags.y || flags.yes;

    if (!sub) return [
      E.txt('Usage: apt <command> [options]'),
      E.txt(''),
      E.txt('Commands:'),
      E.txt('  update            refresh package index'),
      E.txt('  upgrade           upgrade installed packages'),
      E.txt('  install <pkg>     install package(s)'),
      E.txt('  remove <pkg>      remove package(s)'),
      E.txt('  purge <pkg>       remove package and config'),
      E.txt('  search <term>     search in package names/descriptions'),
      E.txt('  show <pkg>        show package details'),
      E.txt('  list              list packages'),
      E.txt('  list --installed  list installed packages only'),
    ];

    if (sub === 'update') {
      return [
        E.dim('Hit:1 http://archive.iss-linux.io stable InRelease'),
        E.dim('Hit:2 http://security.iss-linux.io stable-security InRelease'),
        E.dim('Get:3 http://archive.iss-linux.io stable/main amd64 Packages [' + Math.floor(Math.random()*200+400) + ' kB]'),
        E.ok('Reading package lists... Done'),
        E.txt('Building dependency tree... Done'),
        E.txt('Reading state information... Done'),
        E.txt(Object.keys(state.packages.available).length + ' packages can be upgraded.'),
      ];
    }

    if (sub === 'upgrade') {
      const upgradeable = Object.entries(state.packages.installed).slice(0,3);
      const out = [E.txt('Reading package lists... Done'), E.txt('Building dependency tree... Done')];
      upgradeable.forEach(([name,pkg]) => out.push(E.dim(`Setting up \${name} (\${pkg.version}) ...`)));
      out.push(E.ok(`\${upgradeable.length} upgraded, 0 newly installed, 0 to remove.`));
      return out;
    }

    if (sub === 'install') {
      if (!pkgArgs.length) return [E.err('apt install: at least one package name is required')];
      const out = [];
      for (const pkg of pkgArgs) {
        if (state.packages.installed[pkg]) {
          out.push(E.txt(`\${pkg} is already the newest version (\${state.packages.installed[pkg].version}).`));
          continue;
        }
        const avail = state.packages.available[pkg];
        if (!avail) {
          out.push(E.err(`E: Unable to locate package \${pkg}`));
          continue;
        }
        out.push(E.txt(`The following NEW packages will be installed:`));
        out.push(E.txt(`  \${pkg}`));
        out.push(E.txt(`\${avail.size} kB of additional disk space will be used.`));
        if (!yes) out.push(E.dim('(use -y to auto-confirm)'));
        out.push(E.dim(`Get:1 http://archive.iss-linux.io stable/main \${pkg} \${avail.version}`));
        out.push(E.ok(`Unpacking \${pkg} (\${avail.version}) ...`));
        out.push(E.ok(`Setting up \${pkg} (\${avail.version}) ...`));
        // Move from available to installed
        state.packages.installed[pkg] = avail;
        delete state.packages.available[pkg];
        // Add executable stub to /usr/bin in VFS
        const binNode = VFS.children.usr?.children?.bin;
        if (binNode) {
          binNode.children[pkg] = { type:'file', perms:'rwxr-xr-x', owner:'root', group:'root', mtime:'now', content:`#!/bin/bash\n# \${avail.desc}\necho "\${pkg} \${avail.version} (ISS Terminal simulation)"` };
        }
      }
      return out;
    }

    if (sub === 'remove' || sub === 'purge') {
      if (!pkgArgs.length) return [E.err(`apt \${sub}: at least one package name is required`)];
      const out = [];
      for (const pkg of pkgArgs) {
        if (!state.packages.installed[pkg]) {
          out.push(E.err(`E: Package '\${pkg}' is not installed, so not removed`));
          continue;
        }
        const info = state.packages.installed[pkg];
        out.push(E.txt(`The following packages will be REMOVED:`));
        out.push(E.txt(`  \${pkg}`));
        out.push(E.ok(`Removing \${pkg} (\${info.version}) ...`));
        if (sub === 'purge') out.push(E.ok(`Purging configuration files for \${pkg} ...`));
        state.packages.available[pkg] = info;
        delete state.packages.installed[pkg];
      }
      return out;
    }

    if (sub === 'search') {
      const query = pkgArgs[0] || '';
      const all = { ...state.packages.installed, ...state.packages.available };
      const results = Object.entries(all).filter(([n, p]) =>
        n.includes(query) || p.desc.toLowerCase().includes(query.toLowerCase())
      );
      if (!results.length) return [E.txt(`No packages found matching '\${query}'`)];
      return results.map(([name, pkg]) => {
        const tag = state.packages.installed[name] ? E.ok('[installed]') : E.dim('[available]');
        return tag + ' ' + E.ice(name) + `/stable \${pkg.version}` + '\n  ' + E.txt(pkg.desc);
      });
    }

    if (sub === 'show') {
      if (!pkgArgs.length) return [E.err('apt show: no package name provided')];
      const all = { ...state.packages.installed, ...state.packages.available };
      const out = [];
      for (const pkg of pkgArgs) {
        const info = all[pkg];
        if (!info) { out.push(E.err(`N: Unable to locate package \${pkg}`)); continue; }
        const status = state.packages.installed[pkg] ? 'installed' : 'available';
        out.push(E.txt(`Package: \${pkg}`));
        out.push(E.txt(`Version: \${info.version}`));
        out.push(E.txt(`Status:  \${status}`));
        out.push(E.txt(`Size:    \${info.size} kB`));
        out.push(E.txt(`Description: \${info.desc}`));
        out.push(E.txt(''));
      }
      return out;
    }

    if (sub === 'list') {
      const installedOnly = args.includes('--installed');
      const all = installedOnly
        ? Object.entries(state.packages.installed)
        : [...Object.entries(state.packages.installed), ...Object.entries(state.packages.available)];
      const out = [E.dim('Listing... Done')];
      all.sort((a,b)=>a[0].localeCompare(b[0])).forEach(([name,pkg]) => {
        const tag = state.packages.installed[name] ? E.ok('[installed]') : '';
        out.push(E.txt(name + '/stable ' + pkg.version + ' amd64') + (tag ? ' ' + tag : ''));
      });
      return out;
    }

    return [E.err(`apt: invalid operation \${sub}`)];
  };

  CMDS.dpkg = (args, flags) => {
    const sub = args[0];
    const pkgArg = args[1];

    if (sub === '-l' || sub === '--list') {
      const out = [
        E.dim('Desired=Unknown/Install/Remove/Purge/Hold'),
        E.dim('| Status=Not/Inst/Conf-files/Unpacked/halF-conf/Half-inst/trig-aWait/Trig-pend'),
        E.dim('|/ Err?=(none)/Reinst-required (Status,Err: uppercase=bad)'),
        E.dim('||/ Name           Version      Architecture Description'),
        E.dim('+++-==============-============-============-====================================='),
      ];
      Object.entries(state.packages.installed)
        .filter(([n]) => !pkgArg || n.includes(pkgArg))
        .sort((a,b)=>a[0].localeCompare(b[0]))
        .forEach(([name, pkg]) => {
          out.push(E.txt(`ii  \${name.padEnd(15)} \${pkg.version.padEnd(12)} amd64        \${pkg.desc}`));
        });
      return out;
    }

    if (sub === '-s' || sub === '--status') {
      if (!pkgArg) return [E.err('dpkg --status: need at least one package name argument')];
      const pkg = state.packages.installed[pkgArg];
      if (!pkg) return [E.err(`dpkg-query: package '\${pkgArg}' is not installed and no information is available`)];
      return [
        E.txt(`Package: \${pkgArg}`),
        E.txt(`Status: install ok installed`),
        E.txt(`Priority: optional`),
        E.txt(`Architecture: amd64`),
        E.txt(`Version: \${pkg.version}`),
        E.txt(`Size: \${pkg.size}`),
        E.txt(`Description: \${pkg.desc}`),
      ];
    }

    if (sub === '-L' || sub === '--listfiles') {
      if (!pkgArg) return [E.err('dpkg --listfiles: need at least one package name argument')];
      if (!state.packages.installed[pkgArg]) return [E.err(`dpkg-query: package '\${pkgArg}' is not installed`)];
      return [
        E.txt(`/usr/bin/\${pkgArg}`),
        E.txt(`/usr/share/doc/\${pkgArg}/copyright`),
        E.txt(`/usr/share/doc/\${pkgArg}/changelog.gz`),
        E.txt(`/usr/share/man/man1/\${pkgArg}.1.gz`),
      ];
    }

    if (sub === '-i' || sub === '--install') {
      return [E.err('dpkg: error: cannot access archive: No such file or directory')];
    }

    return [
      E.txt('Usage: dpkg [options]'),
      E.txt('  dpkg -l [pkg]         list installed packages'),
      E.txt('  dpkg -s <pkg>         show package status'),
      E.txt('  dpkg -L <pkg>         list files in package'),
      E.txt('  dpkg --configure -a   configure pending packages'),
    ];
  };

  /* ─────────────────────────────────────────────────────────
     PATH / ENVIRONMENT HELPERS
  ───────────────────────────────────────────────────────── */
  CMDS.which = (args) => {
    if (!args.length) return [E.err('which: missing argument')];
    const out = [];
    for (const cmd of args) {
      // Check built-in commands first
      if (CMDS[cmd]) { out.push(E.txt('/usr/bin/' + cmd)); continue; }
      // Check PATH
      const pathDirs = (state.env.PATH || '').split(':').filter(Boolean);
      let found = false;
      for (const dir of pathDirs) {
        const p = dir.endsWith('/') ? dir + cmd : dir + '/' + cmd;
        const node = getNode(p);
        if (node && node.type === 'file') { out.push(E.txt(p)); found = true; break; }
      }
      if (!found) { out.push(E.err(cmd + ' not found')); state.exitStatus = 1; }
    }
    return out;
  };

  CMDS.nl = (args, _flags, stdin) => {
    const input = (() => {
      if (args[0]) { const node = getNode(resolvePath(args[0])); return node && node.type==='file' ? node.content : ''; }
      return stdin || '';
    })();
    return input.split('\n').map((l, i) => E.txt(String(i+1).padStart(6) + '\t' + l));
  };


  /* ─────────────────────────────────────────────────────────
     SSH & SCP
  ───────────────────────────────────────────────────────── */
  CMDS.ssh = (args) => {
    if (!args.length) return [E.err('usage: ssh [user@]host [command]')];

    // Parse user@host and optional command
    let target = args[0], remoteCmd = args.slice(1).join(' ');
    let remoteUser = 'user', remoteHost = target;
    if (target.includes('@')) { [remoteUser, remoteHost] = target.split('@'); }

    // Resolve known hosts
    const knownHosts = { 'enclave.local':'10.10.10.221', 'nas.local':'10.10.10.221',
                         '10.10.10.221':'10.10.10.221', 'localhost':'127.0.0.1' };
    if (!knownHosts[remoteHost] && !remoteHost.match(/^\d+\.\d+\.\d+\.\d+$/)) {
      return [E.err(`ssh: ${remoteHost}: Name or service not known`)];
    }

    const banner = [
      E.dim(`The authenticity of host '${remoteHost}' can't be established.`),
      E.dim(`ED25519 key fingerprint is SHA256:3Tlm9P2Q+vXkR7wYs8HjNz4dBcAeUfMpK1iLoGtSry0.`),
      E.ok(`Warning: Permanently added '${remoteHost}' (ED25519) to the list of known hosts.`),
      E.ok(`Connected to ${remoteHost} as ${remoteUser}.`),
    ];

    if (remoteCmd) {
      // Non-interactive: run command on remote and return
      const savedSsh = state.sshSession;
      state.sshSession = { host: remoteHost, user: remoteUser, vfs: REMOTE_VFS, cwd: '/home/deploy' };
      const result = execute(remoteCmd);
      state.sshSession = savedSsh;
      return [...banner, ...(Array.isArray(result) ? result : [])];
    }

    // Interactive session
    state.sshSession = { host: remoteHost, user: remoteUser, vfs: REMOTE_VFS, cwd: '/home/deploy' };
    return [
      ...banner,
      E.dim(`Type 'exit' or 'logout' to close the connection.`),
    ];
  };

  CMDS.logout = (args) => {
    if (!state.sshSession) return [E.err('logout: not in an SSH session')];
    const host = state.sshSession.host;
    state.sshSession = null;
    return [E.dim(`Connection to ${host} closed.`)];
  };

  // Override exit to handle SSH session exit too
  const _origExit = CMDS.exit;
  CMDS.exit = (args) => {
    if (state.sshSession) {
      const host = state.sshSession.host;
      state.sshSession = null;
      return [E.dim(`Connection to ${host} closed.`)];
    }
    return _origExit ? _origExit(args) : [];
  };

  CMDS.scp = (args, flags) => {
    // scp [-r] src dst   — src or dst may be user@host:path
    const recursive = flags.r;
    const nonFlags = args;
    if (nonFlags.length < 2) return [E.err('usage: scp [-r] source destination')];

    function parseScpPath(s) {
      if (s.includes(':')) {
        const [hostPart, path] = s.split(':');
        let h = hostPart, u = 'user';
        if (hostPart.includes('@')) { [u, h] = hostPart.split('@'); }
        return { remote: true, host: h, user: u, path: path || '/home/deploy' };
      }
      return { remote: false, path: resolvePath(s) };
    }

    const src = parseScpPath(nonFlags[0]);
    const dst = parseScpPath(nonFlags[1]);

    if (src.remote && dst.remote) return [E.err('scp: cannot copy between two remote hosts')];

    const srcVfs  = src.remote ? REMOTE_VFS : VFS;
    const dstVfs  = dst.remote ? REMOTE_VFS : VFS;

    function vfsGetNode(vfs, p) {
      if (p === '/') return vfs;
      const parts = normalizePath(p).split('/').filter(Boolean);
      let node = vfs;
      for (const part of parts) {
        if (!node || !node.children || !node.children[part]) return null;
        node = node.children[part];
      }
      return node;
    }

    const srcNode = vfsGetNode(srcVfs, src.path);
    if (!srcNode) return [E.err(`scp: ${nonFlags[0]}: No such file or directory`)];

    function doCopy(sNode, targetVfs, targetPath) {
      const parentPath = normalizePath(targetPath + '/..');
      const name = targetPath.split('/').filter(Boolean).pop();
      let parentNode = vfsGetNode(targetVfs, parentPath);
      if (!parentNode || parentNode.type !== 'dir') return false;
      if (sNode.type === 'dir') {
        if (!recursive) return 'dir';
        parentNode.children[name] = { type:'dir', perms:'rwxr-xr-x', owner:state.env.USER, group:state.env.USER, mtime:'now', children:{} };
        for (const [cName, cNode] of Object.entries(sNode.children || {})) {
          doCopy(cNode, targetVfs, targetPath + '/' + cName);
        }
      } else {
        parentNode.children[name] = { ...sNode, owner: state.env.USER, mtime: 'now' };
      }
      return true;
    }

    const dstPath = dst.path.endsWith('/') ? dst.path + src.path.split('/').pop() : dst.path;
    const result = doCopy(srcNode, dstVfs, dstPath);
    if (result === 'dir') return [E.err(`scp: ${nonFlags[0]}: not a regular file`)];
    if (!result) return [E.err(`scp: ${nonFlags[1]}: No such file or directory`)];

    const srcLabel = src.remote ? `${src.user}@${src.host}:${src.path}` : src.path;
    const dstLabel = dst.remote ? `${dst.user}@${dst.host}:${dst.path}` : dst.path;
    const sizeFmt = srcNode.content ? srcNode.content.length + 'B' : '0B';
    return [E.ok(`${srcLabel.split('/').pop()}  100% ${sizeFmt}`)];
  };

  /* ─────────────────────────────────────────────────────────
     GIT
  ───────────────────────────────────────────────────────── */
  function getGitRepo() {
    // Walk up from cwd to find a git repo
    let p = state.cwd;
    while (p && p !== '/') {
      if (state.gitRepos[p]) return { path: p, repo: state.gitRepos[p] };
      p = normalizePath(p + '/..');
    }
    return null;
  }

  function shortSha(sha) { return sha.slice(0, 7); }
  function makeSha() {
    return Math.random().toString(36).slice(2,10) + Math.random().toString(36).slice(2,10);
  }

  CMDS.git = (args, flags) => {
    const sub = args[0];
    const rest = args.slice(1);

    if (!sub) return [
      E.txt('usage: git <command> [<args>]'),
      E.txt(''),
      E.txt('Common commands:'),
      E.txt('   init        Create empty repository'),
      E.txt('   clone       Clone a repository'),
      E.txt('   status      Show working tree status'),
      E.txt('   add         Add files to staging area'),
      E.txt('   commit      Record changes to repository'),
      E.txt('   log         Show commit history'),
      E.txt('   diff        Show changes'),
      E.txt('   branch      List, create, or delete branches'),
      E.txt('   checkout    Switch branches or restore files'),
      E.txt('   merge       Join branches together'),
      E.txt('   show        Show commit details'),
      E.txt('   stash       Stash uncommitted changes'),
    ];

    // ── init ──
    if (sub === 'init') {
      const repoPath = state.cwd;
      if (state.gitRepos[repoPath]) return [E.txt(`Reinitialized existing Git repository in ${repoPath}/.git/`)];
      state.gitRepos[repoPath] = {
        branch: 'main', branches: { main: [] },
        commits: [], staged: [], tracked: {},
      };
      // Add .git dir to VFS
      const cwdNode = getNode(state.cwd);
      if (cwdNode && cwdNode.children) {
        cwdNode.children['.git'] = { type:'dir', perms:'rwxr-xr-x', owner:state.env.USER, group:state.env.USER, mtime:'now', children:{
          HEAD: { type:'file', perms:'rw-r--r--', owner:state.env.USER, group:state.env.USER, mtime:'now', content:'ref: refs/heads/main\n' },
          config: { type:'file', perms:'rw-r--r--', owner:state.env.USER, group:state.env.USER, mtime:'now', content:'[core]\n\trepositoryformatversion = 0\n\tfilemode = true\n[branch "main"]\n' },
        }};
      }
      return [E.ok(`Initialized empty Git repository in ${repoPath}/.git/`)];
    }

    // ── clone ──
    if (sub === 'clone') {
      const url = rest[0];
      if (!url) return [E.err('git clone: no repository URL given')];
      const name = rest[1] || url.split('/').pop().replace(/\.git$/, '') || 'repo';
      const clonePath = resolvePath(name);
      const cwdNode = getNode(state.cwd);
      if (!cwdNode || cwdNode.type !== 'dir') return [E.err('git clone: cannot write to current directory')];
      if (cwdNode.children[name]) return [E.err(`git clone: destination path '${name}' already exists`)];
      cwdNode.children[name] = { type:'dir', perms:'rwxr-xr-x', owner:state.env.USER, group:state.env.USER, mtime:'now', children:{
        'README.md': { type:'file', perms:'rw-r--r--', owner:state.env.USER, group:state.env.USER, mtime:'now', content:`# ${name}\n\nCloned from ${url}\n` },
        '.git': { type:'dir', perms:'rwxr-xr-x', owner:state.env.USER, group:state.env.USER, mtime:'now', children:{
          HEAD: { type:'file', perms:'rw-r--r--', owner:state.env.USER, group:state.env.USER, mtime:'now', content:'ref: refs/heads/main\n' },
        }},
      }};
      const initSha = makeSha();
      state.gitRepos[clonePath] = {
        branch: 'main', branches: { main: [initSha] },
        commits: [{ sha: initSha, message: 'Initial commit', author: 'user', date: 'Jan 15 08:00', branch:'main', files:['README.md'] }],
        staged: [], tracked: { 'README.md': `# ${name}\n\nCloned from ${url}\n` },
      };
      return [
        E.dim(`Cloning into '${name}'...`),
        E.dim('remote: Enumerating objects: 3, done.'),
        E.dim('remote: Counting objects: 100% (3/3), done.'),
        E.ok(`✓ Cloned into '${name}'`),
      ];
    }

    const repoInfo = getGitRepo();

    // ── status ──
    if (sub === 'status') {
      if (!repoInfo) return [E.err(`fatal: not a git repository (or any parent up to mount point /)`)];
      const { repo, path: repoPath } = repoInfo;
      const out = [
        E.txt(`On branch ${repo.branch}`),
      ];
      if (repo.commits.length === 0) {
        out.push(E.txt(''));
        out.push(E.txt('No commits yet'));
      }
      // Find untracked files (in cwd, not in tracked)
      const cwdNode = getNode(state.cwd);
      const untracked = [];
      const modified = [];
      if (cwdNode && cwdNode.children) {
        for (const [name, node] of Object.entries(cwdNode.children)) {
          if (name.startsWith('.')) continue;
          if (node.type === 'file') {
            if (repo.staged.includes(name)) continue;
            if (repo.tracked[name] !== undefined) {
              if (repo.tracked[name] !== node.content) modified.push(name);
            } else {
              untracked.push(name);
            }
          }
        }
      }
      if (repo.staged.length) {
        out.push(E.txt(''));
        out.push(E.ok('Changes to be committed:'));
        out.push(E.dim('  (use "git restore --staged <file>..." to unstage)'));
        repo.staged.forEach(f => out.push(E.ok(`\tnew file:   ${f}`)));
      }
      if (modified.length) {
        out.push(E.txt(''));
        out.push(E.err('Changes not staged for commit:'));
        out.push(E.dim('  (use "git add <file>..." to update what will be committed)'));
        modified.forEach(f => out.push(E.err(`\tmodified:   ${f}`)));
      }
      if (untracked.length) {
        out.push(E.txt(''));
        out.push(E.txt('Untracked files:'));
        out.push(E.dim('  (use "git add <file>..." to include in what will be committed)'));
        untracked.forEach(f => out.push(E.dim(`\t${f}`)));
      }
      if (!repo.staged.length && !modified.length && !untracked.length) {
        out.push(E.ok('nothing to commit, working tree clean'));
      }
      return out;
    }

    // ── add ──
    if (sub === 'add') {
      if (!repoInfo) return [E.err(`fatal: not a git repository`)];
      const { repo } = repoInfo;
      if (!rest.length) return [E.err('Nothing specified, nothing added.')];
      const toAdd = rest[0] === '.' || rest[0] === '-A'
        ? Object.keys(getNode(state.cwd)?.children || {}).filter(n => !n.startsWith('.') && getNode(resolvePath(n))?.type === 'file')
        : rest;
      toAdd.forEach(f => {
        if (!repo.staged.includes(f)) repo.staged.push(f);
      });
      return [];
    }

    // ── commit ──
    if (sub === 'commit') {
      if (!repoInfo) return [E.err(`fatal: not a git repository`)];
      const { repo } = repoInfo;
      if (!repo.staged.length) return [E.err('nothing to commit, working tree clean')];
      const msgFlag = args.indexOf('-m');
      const message = msgFlag !== -1 ? args[msgFlag + 1] : 'Update';
      if (!message) return [E.err('error: switch `m` requires a value')];
      const sha = makeSha();
      const files = [...repo.staged];
      // snapshot tracked content
      files.forEach(f => {
        const node = getNode(resolvePath(f));
        if (node && node.type === 'file') repo.tracked[f] = node.content || '';
      });
      const commit = { sha, message, author: state.env.USER, date: 'now', branch: repo.branch, files };
      repo.commits.push(commit);
      if (!repo.branches[repo.branch]) repo.branches[repo.branch] = [];
      repo.branches[repo.branch].push(sha);
      const stagedCount = repo.staged.length;
      repo.staged = [];
      return [
        E.ok(`[${repo.branch} ${shortSha(sha)}] ${message}`),
        E.txt(` ${stagedCount} file${stagedCount !== 1 ? 's' : ''} changed`),
      ];
    }

    // ── log ──
    if (sub === 'log') {
      if (!repoInfo) return [E.err(`fatal: not a git repository`)];
      const { repo } = repoInfo;
      if (!repo.commits.length) return [E.txt('(no commits yet)')];
      const oneLine = args.includes('--oneline');
      const n = args.includes('-n') ? parseInt(args[args.indexOf('-n')+1]) : (args.find(a=>/^-\d+$/.test(a)) ? parseInt(args.find(a=>/^-\d+$/.test(a)).slice(1)) : 999);
      const out = [];
      [...repo.commits].reverse().slice(0, n).forEach(c => {
        if (oneLine) {
          out.push(E.dim(shortSha(c.sha)) + ' ' + E.txt(c.message));
        } else {
          out.push(E.ice(`commit ${c.sha}`));
          out.push(E.txt(`Author: ${c.author} <${c.author}@icestreams.io>`));
          out.push(E.txt(`Date:   ${c.date}`));
          out.push(E.txt(''));
          out.push(E.txt(`    ${c.message}`));
          out.push(E.txt(''));
        }
      });
      return out;
    }

    // ── diff ──
    if (sub === 'diff') {
      if (!repoInfo) return [E.err(`fatal: not a git repository`)];
      const { repo } = repoInfo;
      const out = [];
      const cwdNode = getNode(state.cwd);
      if (!cwdNode) return [];
      for (const [name, node] of Object.entries(cwdNode.children || {})) {
        if (node.type !== 'file' || name.startsWith('.')) continue;
        const old = repo.tracked[name];
        if (old === undefined) continue;
        const curr = node.content || '';
        if (old === curr) continue;
        out.push(E.dim(`diff --git a/${name} b/${name}`));
        out.push(E.dim(`--- a/${name}`));
        out.push(E.dim(`+++ b/${name}`));
        const oldLines = old.split('\n');
        const newLines = curr.split('\n');
        newLines.forEach((l, i) => {
          if (oldLines[i] !== l) {
            if (oldLines[i] !== undefined) out.push(E.err(`-${oldLines[i]}`));
            out.push(E.ok(`+${l}`));
          } else {
            out.push(E.txt(` ${l}`));
          }
        });
      }
      if (!out.length) out.push(E.txt('(no changes)'));
      return out;
    }

    // ── branch ──
    if (sub === 'branch') {
      if (!repoInfo) return [E.err(`fatal: not a git repository`)];
      const { repo } = repoInfo;
      const del = args.includes('-d') || args.includes('-D');
      const newBranch = rest.filter(a => !a.startsWith('-'))[0];
      if (del && newBranch) {
        if (newBranch === repo.branch) return [E.err(`error: Cannot delete branch '${newBranch}' checked out`)];
        if (!repo.branches[newBranch]) return [E.err(`error: branch '${newBranch}' not found`)];
        delete repo.branches[newBranch];
        return [E.ok(`Deleted branch ${newBranch}.`)];
      }
      if (newBranch) {
        if (repo.branches[newBranch]) return [E.err(`fatal: A branch named '${newBranch}' already exists`)];
        repo.branches[newBranch] = [...(repo.branches[repo.branch] || [])];
        return [];
      }
      return Object.keys(repo.branches).map(b =>
        b === repo.branch ? E.ok(`* ${b}`) : E.txt(`  ${b}`)
      );
    }

    // ── checkout ──
    if (sub === 'checkout') {
      if (!repoInfo) return [E.err(`fatal: not a git repository`)];
      const { repo } = repoInfo;
      const createNew = args.includes('-b');
      const target = rest.filter(a => !a.startsWith('-'))[0];
      if (!target) return [E.err('error: no branch or commit given')];
      if (createNew) {
        if (repo.branches[target]) return [E.err(`fatal: A branch named '${target}' already exists`)];
        repo.branches[target] = [...(repo.branches[repo.branch] || [])];
        repo.branch = target;
        return [E.ok(`Switched to a new branch '${target}'`)];
      }
      if (!repo.branches[target]) return [E.err(`error: pathspec '${target}' did not match any branch`)];
      repo.branch = target;
      return [E.ok(`Switched to branch '${target}'`)];
    }

    // ── merge ──
    if (sub === 'merge') {
      if (!repoInfo) return [E.err(`fatal: not a git repository`)];
      const { repo } = repoInfo;
      const srcBranch = rest[0];
      if (!srcBranch) return [E.err('error: no branch given to merge')];
      if (!repo.branches[srcBranch]) return [E.err(`merge: ${srcBranch} - not something we can merge`)];
      if (srcBranch === repo.branch) return [E.txt('Already up to date.')];
      const srcCommits = repo.branches[srcBranch] || [];
      const newCommits = srcCommits.filter(s => !(repo.branches[repo.branch]||[]).includes(s));
      if (!newCommits.length) return [E.txt('Already up to date.')];
      repo.branches[repo.branch] = [...(repo.branches[repo.branch]||[]), ...newCommits];
      return [
        E.ok(`Merge made by the 'ort' strategy.`),
        E.txt(` ${newCommits.length} commit(s) merged from '${srcBranch}'`),
      ];
    }

    // ── show ──
    if (sub === 'show') {
      if (!repoInfo) return [E.err(`fatal: not a git repository`)];
      const { repo } = repoInfo;
      if (!repo.commits.length) return [E.err('fatal: bad object HEAD')];
      const target = rest[0] || 'HEAD';
      const commit = target === 'HEAD'
        ? repo.commits[repo.commits.length - 1]
        : repo.commits.find(c => c.sha.startsWith(target));
      if (!commit) return [E.err(`fatal: bad object ${target}`)];
      return [
        E.ice(`commit ${commit.sha}`),
        E.txt(`Author: ${commit.author} <${commit.author}@icestreams.io>`),
        E.txt(`Date:   ${commit.date}`),
        E.txt(''),
        E.txt(`    ${commit.message}`),
        E.txt(''),
        ...commit.files.map(f => E.ok(`    ${f}`)),
      ];
    }

    // ── stash ──
    if (sub === 'stash') {
      if (!repoInfo) return [E.err(`fatal: not a git repository`)];
      const { repo } = repoInfo;
      const ssub = rest[0] || 'push';
      if (ssub === 'push' || ssub === 'save') {
        if (!repo.staged.length) return [E.txt('No local changes to save')];
        repo.stash = repo.stash || [];
        repo.stash.push({ staged: [...repo.staged], date: 'now' });
        repo.staged = [];
        return [E.txt(`Saved working directory and index state WIP on ${repo.branch}`)];
      }
      if (ssub === 'pop' || ssub === 'apply') {
        if (!repo.stash || !repo.stash.length) return [E.err('error: No stash entries found')];
        const top = ssub === 'pop' ? repo.stash.pop() : repo.stash[repo.stash.length - 1];
        repo.staged = [...repo.staged, ...top.staged];
        return [E.txt('On branch ' + repo.branch), E.ok('Changes restored from stash.')];
      }
      if (ssub === 'list') {
        if (!repo.stash || !repo.stash.length) return [];
        return repo.stash.map((s,i) => E.txt(`stash@{${i}}: WIP on ${repo.branch}: ${s.date}`));
      }
      if (ssub === 'drop') {
        if (!repo.stash || !repo.stash.length) return [E.err('error: No stash entries found')];
        repo.stash.pop();
        return [E.txt('Dropped refs/stash@{0}')];
      }
      return [E.err(`git stash: unknown subcommand '${ssub}'`)];
    }

    return [E.err(`git: '${sub}' is not a git command. See 'git --help'.`)];
  };

  /* ─────────────────────────────────────────────────────────
     PROCESS MANAGEMENT  (ps, kill, jobs, bg, fg)
  ───────────────────────────────────────────────────────── */
  CMDS.ps = (args, flags) => {
    const allUsers = flags.a || flags.aux || flags.e || args.includes('-ef') || args.includes('aux');
    const fullFmt  = flags.f || args.includes('-ef') || args.includes('aux');
    const userFilter = allUsers ? null : state.env.USER;

    const procs = state.processes.filter(p => !userFilter || p.user === userFilter);

    if (args.includes('aux') || (flags.a && flags.u)) {
      const out = [E.dim('USER       PID %CPU %MEM VSZ    STAT START COMMAND')];
      procs.forEach(p => {
        const row = `${p.user.padEnd(10)} ${String(p.pid).padEnd(5)} ${p.cpu.padEnd(4)} ${p.mem.padEnd(4)} ${p.vsz.padEnd(6)} ${p.stat}    ${p.start}  ${p.cmd}`;
        out.push(E.txt(row));
      });
      return out;
    }

    if (args.includes('-ef') || flags.e) {
      const out = [E.dim('UID        PID  PPID C STIME TTY          TIME CMD')];
      procs.forEach(p => {
        const row = `${p.user.padEnd(10)} ${String(p.pid).padEnd(5)} ${String(Math.floor(p.pid/2)).padEnd(5)} 0 ${p.start}  pts/0    00:00:00 ${p.cmd}`;
        out.push(E.txt(row));
      });
      return out;
    }

    const out = [E.dim('  PID TTY          TIME CMD')];
    procs.filter(p => p.user === state.env.USER).forEach(p => {
      out.push(E.txt(`${String(p.pid).padStart(5)} pts/0    00:00:00 ${p.cmd}`));
    });
    return out;
  };

  CMDS.kill = (args, flags) => {
    if (!args.length) return [E.err('usage: kill [-signal] pid...')];
    const sig = flags[9] ? 'SIGKILL' : flags[15] ? 'SIGTERM' : (flags.s || 'SIGTERM');
    const out = [];
    for (const pidStr of args) {
      const pid = parseInt(pidStr);
      if (isNaN(pid)) { out.push(E.err(`kill: ${pidStr}: invalid pid`)); continue; }
      const idx = state.processes.findIndex(p => p.pid === pid);
      if (idx === -1) { out.push(E.err(`kill: (${pid}) - No such process`)); continue; }
      const proc = state.processes[idx];
      if (proc.user !== state.env.USER && state.env.USER !== 'root') {
        out.push(E.err(`kill: (${pid}) - Operation not permitted`)); continue;
      }
      state.processes.splice(idx, 1);
      // Also remove from jobs
      const jidx = state.jobs.findIndex(j => j.pid === pid);
      if (jidx !== -1) state.jobs.splice(jidx, 1);
    }
    return out;
  };

  CMDS.jobs = () => {
    if (!state.jobs.length) return [];
    return state.jobs.map(j =>
      E.dim(`[${j.jid}]`) + (j.status === 'done' ? E.dim(' Done') : E.ok(' Running')) + `  ${j.cmd}`
    );
  };

  CMDS.bg = (args) => {
    const jid = args[0] ? parseInt(args[0].replace('%','')) : (state.jobs.length ? state.jobs[state.jobs.length-1].jid : null);
    if (!jid) return [E.err('bg: no current job')];
    const job = state.jobs.find(j => j.jid === jid);
    if (!job) return [E.err(`bg: %${jid}: no such job`)];
    job.status = 'running';
    return [E.dim(`[${job.jid}]+ ${job.cmd} &`)];
  };

  CMDS.fg = (args) => {
    const jid = args[0] ? parseInt(args[0].replace('%','')) : (state.jobs.length ? state.jobs[state.jobs.length-1].jid : null);
    if (!jid) return [E.err('fg: no current job')];
    const job = state.jobs.find(j => j.jid === jid);
    if (!job) return [E.err(`fg: %${jid}: no such job`)];
    const out = [E.dim(job.cmd)];
    // Simulate completion
    const pidIdx = state.processes.findIndex(p => p.pid === job.pid);
    if (pidIdx !== -1) state.processes.splice(pidIdx, 1);
    state.jobs = state.jobs.filter(j => j.jid !== jid);
    return out;
  };

  CMDS.pgrep = (args, flags) => {
    if (!args.length) return [E.err('usage: pgrep pattern')];
    const pat = new RegExp(args[0], 'i');
    const listFlag = flags.l;
    return state.processes.filter(p => pat.test(p.cmd)).map(p =>
      listFlag ? E.txt(`${p.pid} ${p.cmd}`) : E.txt(String(p.pid))
    );
  };

  CMDS.pkill = (args) => {
    if (!args.length) return [E.err('usage: pkill pattern')];
    const pat = new RegExp(args[0], 'i');
    const toKill = state.processes.filter(p => pat.test(p.cmd) && p.user === state.env.USER);
    toKill.forEach(p => {
      state.processes = state.processes.filter(x => x.pid !== p.pid);
    });
    if (!toKill.length) { state.exitStatus = 1; return []; }
    return [];
  };

  /* ─────────────────────────────────────────────────────────
     CRON & SCHEDULING
  ───────────────────────────────────────────────────────── */
  CMDS.crontab = (args, flags) => {
    if (flags.l) {
      if (!state.crontab.length) return [E.dim('no crontab for ' + state.env.USER)];
      return [
        E.dim('# m  h  dom mon dow  command'),
        ...state.crontab.map(j => E.txt(`${j.schedule}  ${j.command}`)),
      ];
    }
    if (flags.r) {
      state.crontab = [];
      return [];
    }
    if (flags.e) {
      // Build crontab content and open in vim
      const existing = state.crontab.length
        ? '# m  h  dom mon dow  command\n' + state.crontab.map(j => `${j.schedule}  ${j.command}`).join('\n')
        : '# m  h  dom mon dow  command\n# Example: 0 2 * * *  /home/user/scripts/backup.sh\n';
      // Write to a temp file and open vim
      const tmpPath = '/tmp/crontab.tmp';
      const tmpNode = getNode('/tmp');
      if (tmpNode && tmpNode.children) {
        tmpNode.children['crontab.tmp'] = { type:'file', perms:'rw-------', owner:state.env.USER, group:state.env.USER, mtime:'now', content: existing };
      }
      return '__VIM__:' + tmpPath;
    }
    return [
      E.txt('usage: crontab [-l] [-r] [-e]'),
      E.txt('  -l   list current crontab'),
      E.txt('  -e   edit crontab in vim'),
      E.txt('  -r   remove crontab'),
      E.txt(''),
      E.txt('Cron field order: minute hour day-of-month month day-of-week'),
      E.txt('  *    any value'),
      E.txt('  */n  every n units'),
      E.txt(''),
      E.txt('Examples:'),
      E.txt('  0 2 * * *      daily at 2am'),
      E.txt('  */15 * * * *   every 15 minutes'),
      E.txt('  0 9 * * 1      every Monday at 9am'),
    ];
  };

  // Parse a saved crontab file back to state
  CMDS['crontab-load'] = () => {
    const node = getNode('/tmp/crontab.tmp');
    if (!node) return [];
    const lines = (node.content||'').split('\n').filter(l => l.trim() && !l.trim().startsWith('#'));
    state.crontab = lines.map(l => {
      const parts = l.trim().split(/\s+/);
      return { schedule: parts.slice(0,5).join(' '), command: parts.slice(5).join(' ') };
    });
    return [];
  };

  CMDS.at = (args) => {
    if (!args.length) return [
      E.txt('usage: at TIME'),
      E.txt('       at -l          list pending jobs'),
      E.txt('       at -r JOBID    remove job'),
      E.txt(''),
      E.txt('TIME formats: now+1min  now+1hour  14:30  midnight  noon'),
    ];
    if (args[0] === '-l' || args[0] === '-q') {
      if (!state.atJobs.length) return [E.txt('no files in queue')];
      return state.atJobs.map(j => E.txt(`${j.id}\t${j.when}\ta\t${state.env.USER}`));
    }
    if (args[0] === '-r' || args[0] === '-d') {
      const id = parseInt(args[1]);
      const idx = state.atJobs.findIndex(j => j.id === id);
      if (idx === -1) return [E.err(`at: ${args[1]}: invalid queue number`)];
      state.atJobs.splice(idx, 1);
      return [];
    }
    const when = args.join(' ');
    const id = state.nextAtId++;
    state.atJobs.push({ id, when, command: '(enter command at prompt)', run: false });
    return [
      E.dim(`warning: commands will be executed using /bin/sh`),
      E.txt(`job ${id} at ${when}`),
    ];
  };

  CMDS.atq = () => CMDS.at(['-l'], {});
  CMDS.atrm = (args) => CMDS.at(['-r', ...args], {});

  /* ─────────────────────────────────────────────────────────
     curl & wget
  ───────────────────────────────────────────────────────── */
  const FAKE_API = {
    'GET': {
      'https://api.example.com/users':       '{"users":[{"id":1,"name":"Alice","role":"admin"},{"id":2,"name":"Bob","role":"user"},{"id":3,"name":"Charlie","role":"user"}]}',
      'https://api.example.com/users/1':     '{"id":1,"name":"Alice","email":"alice@example.com","role":"admin","created":"2024-01-01"}',
      'https://api.example.com/health':      '{"status":"ok","version":"1.4.2","uptime":86400,"checks":{"db":"ok","cache":"ok"}}',
      'https://api.example.com/posts':       '{"posts":[{"id":1,"title":"Hello World","author":"Alice"},{"id":2,"title":"Linux Tips","author":"Bob"}]}',
      'https://httpbin.org/get':             '{"args":{},"headers":{"Host":"httpbin.org","User-Agent":"curl/7.88.0"},"url":"https://httpbin.org/get"}',
      'https://httpbin.org/ip':              '{"origin":"10.10.30.5"}',
      'https://ipinfo.io/json':              '{"ip":"10.10.30.5","city":"Enclave","region":"ISS","country":"IS","org":"AS12345 Icestreams"}',
      'http://enclave.local/api/health':     '{"status":"ok","host":"enclave.local"}',
      'http://enclave.local/':               '<!DOCTYPE html><html><body><h1>App v1.4.2</h1></body></html>',
    },
    'POST': {
      'https://api.example.com/users':       '{"id":4,"name":"New User","created":"2024-01-15"}',
      'https://httpbin.org/post':            '{"data":"","form":{},"json":null,"url":"https://httpbin.org/post"}',
    },
    'DELETE': {
      'https://api.example.com/users/1':    '{"deleted":true,"id":1}',
    },
  };

  function fakeHttpRequest(method, url, extraHeaders, data, silent) {
    const routes = FAKE_API[method.toUpperCase()] || {};
    // Try exact match, then strip trailing slash
    let body = routes[url] || routes[url.replace(/\/$/, '')] || null;
    const status = body ? 200 : (url.includes('404') ? 404 : (url.includes('error') ? 500 : 404));
    if (!body) body = `{"error":"Not Found","url":"${url}"}`;

    const headers = [
      `HTTP/2 ${status}`,
      `content-type: ${body.startsWith('{') || body.startsWith('[') ? 'application/json' : 'text/html'}; charset=utf-8`,
      `server: ISS-Fake-Server/1.0`,
      `x-request-id: ${Math.random().toString(36).slice(2,10)}`,
    ];
    return { status, body, headers };
  }

  CMDS.curl = (args, flags) => {
    if (!args.filter(a=>!a.startsWith('-')).length) return [E.err('curl: try \'curl --help\' for more information')];

    let method = 'GET', url = '', outputFile = null, includeHeaders = false, silent = false, data = null;
    let i = 0;
    while (i < args.length) {
      const a = args[i];
      if (a === '-X' || a === '--request')    { method = args[++i] || 'GET'; }
      else if (a === '-o' || a === '--output') { outputFile = args[++i]; }
      else if (a === '-O')                     { outputFile = '__basename__'; }
      else if (a === '-I' || a === '--head')   { method = 'HEAD'; includeHeaders = true; }
      else if (a === '-i' || a === '--include'){ includeHeaders = true; }
      else if (a === '-s' || a === '--silent') { silent = true; }
      else if (a === '-d' || a === '--data')   { data = args[++i]; method = method === 'GET' ? 'POST' : method; }
      else if (a === '-H' || a === '--header') { i++; } // consume header arg
      else if (!a.startsWith('-') && !url)     { url = a; }
      i++;
    }
    if (!url) return [E.err('curl: no URL specified')];

    if (!silent && !flags.s) {
      // show progress note
    }

    const { status, body, headers } = fakeHttpRequest(method, url, [], data, silent);
    const out = [];

    if (includeHeaders) headers.forEach(h => out.push(E.dim(h)));

    if (outputFile) {
      const fname = outputFile === '__basename__' ? url.split('/').pop() || 'index.html' : outputFile;
      const fpath = resolvePath(fname);
      const parentNode = getNode(normalizePath(fpath + '/..'));
      const fname2 = fpath.split('/').pop();
      if (parentNode && parentNode.children) {
        parentNode.children[fname2] = { type:'file', perms:'rw-r--r--', owner:state.env.USER, group:state.env.USER, mtime:'now', content: body };
      }
      if (!silent) out.push(E.dim(`  % Total    % Received\n100  ${body.length}  100  ${body.length}    0  --:--:-- Downloaded`));
    } else {
      body.split('\n').forEach(l => out.push(E.txt(l)));
    }
    state.exitStatus = status === 200 ? 0 : 22;
    return out;
  };

  CMDS.wget = (args, flags) => {
    const nonFlags = args.filter(a => !a.startsWith('-'));
    if (!nonFlags.length) return [E.err('wget: missing URL')];
    const url = nonFlags[0];
    let outputFile = flags.O || flags.o || null;
    const quiet = flags.q;

    const { status, body } = fakeHttpRequest('GET', url, [], null, quiet);
    const fname = outputFile || url.split('/').pop().split('?')[0] || 'index.html';
    const fpath = resolvePath(fname);
    const parentNode = getNode(normalizePath(fpath + '/..'));
    const fname2 = fpath.split('/').pop();
    if (parentNode && parentNode.children) {
      parentNode.children[fname2] = { type:'file', perms:'rw-r--r--', owner:state.env.USER, group:state.env.USER, mtime:'now', content: body };
    }
    const out = [];
    if (!quiet) {
      out.push(E.dim(`--${new Date().toISOString()}--  ${url}`));
      out.push(E.dim(`Resolving... connected.`));
      out.push(E.dim(`HTTP request sent, awaiting response... ${status} ${status===200?'OK':'Not Found'}`));
      out.push(E.dim(`Length: ${body.length} [${body.startsWith('{') ? 'application/json' : 'text/html'}]`));
      out.push(E.dim(`Saving to: '${fname}'`));
      out.push(E.txt(''));
      out.push(E.ok(`'${fname}' saved [${body.length}/${body.length}]`));
    }
    state.exitStatus = status === 200 ? 0 : 8;
    return out;
  };


  /* ─────────────────────────────────────────────────────────
     VIM & BASH COMMANDS
  ───────────────────────────────────────────────────────── */
  CMDS.vim = (args) => {
    if (!args.length) return [E.err('vim: missing filename. Usage: vim <file>')];
    const path = resolvePath(args[0]);
    const parentPath = getParentPath(path);
    const parentNode = getNode(parentPath);
    if (!parentNode || parentNode.type !== 'dir') {
      return [E.err(`vim: ${args[0]}: No such file or directory`)];
    }
    // Return special sentinel — script.js will intercept and open the editor overlay
    return '__VIM__:' + path;
  };

  CMDS.bash = (args) => {
    if (!args.length) return [E.err('bash: usage: bash <script.sh>')];
    // handle bash -x flag
    let fileArg = args[0];
    if (fileArg === '-x') { state.options.x = true; fileArg = args[1]; }
    if (!fileArg) return [E.err('bash: missing filename')];
    const p = resolvePath(fileArg);
    const node = getNode(p);
    if (!node)               return [E.err('bash: ' + fileArg + ': No such file or directory')];
    if (node.type !== 'file') return [E.err('bash: ' + fileArg + ': Is a directory')];
    // Set positional params ($1..$N = rest of args)
    const savedPos = state.positional;
    state.positional = args.slice(1);
    const out = [];
    const rawLines = (node.content || '').split('\n');
    let lineIdx = 0;
    // Helper: collect multi-line statement into one semicolon-joined string
    function collectBlock(opener, closer) {
      const parts = [rawLines[lineIdx]];
      lineIdx++;
      while (lineIdx < rawLines.length) {
        const ln = rawLines[lineIdx].trim();
        parts.push(ln);
        lineIdx++;
        const joined = parts.join('; ');
        const closerCount = (joined.match(new RegExp('\\b' + closer + '\\b', 'g'))||[]).length;
        const openerCount = (joined.match(new RegExp('\\b' + opener + '\\b', 'g'))||[]).length;
        if (closerCount >= openerCount) return joined;
      }
      return parts.join('; ');
    }
    while (lineIdx < rawLines.length) {
      const raw = rawLines[lineIdx];
      const line = raw.trim();
      if (!line || line.startsWith('#')) { lineIdx++; continue; }
      // heredoc: cmd << DELIM
      const heredocM = line.match(/<<-?\s*(\w+)\s*$/);
      if (heredocM) {
        const delim = heredocM[1];
        lineIdx++;
        const hLines = [];
        while (lineIdx < rawLines.length && rawLines[lineIdx].trim() !== delim) {
          hLines.push(rawLines[lineIdx]);
          lineIdx++;
        }
        lineIdx++; // skip closing delim
        const heredocText = hLines.join('\n');
        const cmdPart = line.replace(/<<-?\s*\w+\s*$/, '').trim();
        const hResult = execute(cmdPart);
        if (Array.isArray(hResult)) out.push(...hResult);
        // Feed heredoc as stdin to the command — simplified: just cat it
        out.push(...heredocText.split('\n').filter(Boolean).map(l=>E.txt(l)));
        continue;
      }
      // Multi-line control structures
      let stmt = line;
      const startsFor   = /^for\s/.test(line);
      const startsWhile = /^while\s/.test(line) || /^until\s/.test(line);
      const startsIf    = /^if\s/.test(line);
      const startsCase  = /^case\s/.test(line);
      const startsFunc  = /^function\s/.test(line) || /^\w+\s*\(/.test(line);
      if ((startsFor||startsWhile) && !/\bdone\b/.test(line)) { stmt = collectBlock('do','done'); continue; }
      if (startsFor   && !/\bdone\b/.test(line)) { lineIdx++; continue; }
      if (startsWhile && !/\bdone\b/.test(line)) { lineIdx++; continue; }
      if (startsIf    && !/\bfi\b/.test(line))   { stmt = collectBlock('if','fi'); }
      if (startsCase  && !/\besac\b/.test(line)) { stmt = collectBlock('case','esac'); }
      if (startsFunc  && !line.includes('}'))      { stmt = collectBlock('{','}'); }
      // set -x: print line
      if (state.options.x) out.push(E.dim('+ ' + stmt));
      const result = execute(stmt);
      lineIdx++;
      if (result === '__CLEAR__') break;
      if (typeof result === 'string' && result.startsWith('__VIM__:')) break;
      if (result === _BREAK || result === _CONTINUE) break;
      if (Array.isArray(result)) out.push(...result);
      if (state.options.e && state.exitStatus !== 0) {
        out.push(E.err('bash: line ' + lineIdx + ': exiting due to set -e'));
        break;
      }
    }
    state.positional = savedPos;
    return out;
  };

  /* ─────────────────────────────────────────────────────────
     VFS WRITE / READ  (used by the vim editor in script.js)
  ───────────────────────────────────────────────────────── */
  function writeFile(path, content) {
    const dir  = getParentPath(path);
    const name = basename(path);
    const parentNode = getNode(dir);
    if (!parentNode || parentNode.type !== 'dir') return false;
    const existing = parentNode.children[name];
    parentNode.children[name] = {
      ...(existing || {}),
      type:  'file',
      perms: (existing && existing.perms) ? existing.perms : 'rw-r--r--',
      owner: (existing && existing.owner) ? existing.owner : state.env.USER,
      group: (existing && existing.group) ? existing.group : state.env.USER,
      mtime: 'now',
      content,
    };
    state.vimHistory.push({ file: path });
    return true;
  }

  function readFile(path) {
    const node = getNode(path);
    return (node && node.type === 'file') ? (node.content || '') : null;
  }

  /* ─────────────────────────────────────────────────────────
     MATRIX RAIN (from icestreams.io)
  ───────────────────────────────────────────────────────── */
  function initCanvas() {
    const canvas = document.getElementById('stream-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const COLS_W = 18, SPEED = 30, TRAIL = 0.07;
    const CHARS  = '01アイウエオカキクケコABCDEF0123456789';
    let cols, drops;
    function resize() {
      canvas.width = window.innerWidth; canvas.height = window.innerHeight;
      cols  = Math.ceil(canvas.width / COLS_W);
      drops = Array.from({length: cols}, () => Math.floor(Math.random() * (canvas.height / COLS_W)));
    }
    function tick() {
      ctx.fillStyle = `rgba(8,8,8,${TRAIL})`; ctx.fillRect(0,0,canvas.width,canvas.height);
      ctx.font = `${COLS_W-2}px 'JetBrains Mono', monospace`;
      drops.forEach((y, i) => {
        const char = CHARS[Math.floor(Math.random()*CHARS.length)];
        const x = i * COLS_W;
        ctx.fillStyle = '#A8D8EA'; ctx.fillText(char, x, y * COLS_W);
        if (Math.random() > 0.85) { ctx.fillStyle = '#2E86AB'; ctx.fillText(CHARS[Math.floor(Math.random()*CHARS.length)], x, (y-1)*COLS_W); }
        if (y * COLS_W > canvas.height && Math.random() > 0.975) drops[i] = 0;
        else drops[i]++;
      });
    }
    resize();
    window.addEventListener('resize', resize);
    setInterval(tick, SPEED);
  }

  /* ─────────────────────────────────────────────────────────
     PUBLIC API
  ───────────────────────────────────────────────────────── */
  global.TERM = {
    execute,
    tabComplete,
    getPromptHTML,
    getState:  () => state,
    getVFS:    () => VFS,
    initCanvas,
    writeFile,
    readFile,
  };

})(window);
