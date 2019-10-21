Test locally:

- yarn dev && open http://localhost:3001/graphiql

Serve:

- git add . && git commit -m "Proper commit message" && git push
- ssh leckr@[IP]
- pm2 stop 1 && cd week44/server && git stash && git pull && yarn build && yarn serve
  (or "yarn dev" if logging should be enabled. or "yarn cluster" if you want to run a cluster of them)

DON'T FORGET WHEN I START CODING, DESKTOP SETUP IS IMPORTANT FOR PRODUCTIVITY:

1. Old safari tabs
2. Recent safari tabs
3. Client & general: VSCode, debugger & simulator, overlapping
   (VS Code has 2 terminal tabs: yarn dev + exp ios / other stuff).
   sometimes finder. sometimes notes & textEdit
4. Server, just VSCode (Terminal = local yarn dev + ssh + local for git)
5. DB & GraphiQL --> Split
6. Web: VSCode & Chrome, overlapping

MOBILE DEVICES HELP TOO, OFCOURSE

1. Android device, can be used for running local code + remote db on
   real device, or running published version
2. iOS device, coming soon
