Cosmic Jodi - front-end demo (no Node needed)

Separate pages: register.html, login.html, bio.html, matches.html, my-matches.html, chat.html (index.html redirects).
All pages load js/mock-server.js, a browser-only stand-in for the Node server. Data is kept in your browser (localStorage).

How to open in VS Code:
1. Install the "Live Server" extension (Ritwick Dey).
2. Open this folder in VS Code, right-click index.html, choose "Open with Live Server".
   (Use Live Server rather than double-clicking: some browsers do not share localStorage between local files.)
3. Log in with Cosmic ID ARJUN-001 or register a new one.

For the real project with the Node server and SQLite database, use cosmic-jodi-project-v2.zip and swap js/mock-server.js back for js/api.js.
