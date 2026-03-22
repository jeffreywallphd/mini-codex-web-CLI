# Mini Codex Web CLI

A lightweight LAN-based web interface for interacting with the Codex CLI on your local machine. This project allows you to run coding prompts against local GitHub repositories from any device on your network (e.g., your phone) using a simple browser UI.

---

## Overview

Mini Codex Web CLI acts as a thin wrapper around the Codex CLI:

- Select a local repository
- Enter a prompt
- Execute Codex CLI against that repo
- View results, history, and usage
- Access everything from a mobile-friendly web interface

The system is intentionally minimal and designed for local, personal use.

---

## Features

- Run Codex prompts against local repositories
- Mobile-friendly web interface
- Run history with searchable records
- Prompt + response tracking
- Basic usage tracking (credits remaining + per-run estimate)
- Simple concurrency protection (one run per project)
- No external database required (SQLite)

---

## Project Structure

GitHubProjects/
  mini-codex-web-CLI/
    server/
    web/
    data/
    .env
    package.json
  projects/
    repo-1/
    repo-2/

---

## Prerequisites

- Node.js (v18+ recommended)
- npm
- Git
- Codex CLI installed globally via npm

---

## Installation

1. Clone the repository

2. Navigate into the project directory

3. Install dependencies using npm install

4. Create a .env file in the root directory with the following values:

   CODEX_API_KEY=your_api_key_here  
   PORT=3000  
   PROJECTS_DIR=../../projects  

   The PROJECTS_DIR should point to the folder containing your local GitHub repositories.

5. Ensure your .env file is included in .gitignore to prevent accidental exposure of your API key

---

## Running the Application

Start the server using npm run dev or npm start

Then open a browser and navigate to:

http://localhost:3000

To access from another device (such as your phone), use your machine’s local IP address:

http://192.168.x.x:3000

---

## Usage

1. Select a project from the dropdown menu
2. Enter a prompt in the textarea
3. Click Run
4. View the response, run history, and usage details

---

## Security

This application is designed for local LAN use only.

- The server operates over HTTP and does not use TLS encryption
- There is no authentication or access control
- Any device on your local network can access the interface
- The application executes commands against local repositories

### Recommendations

- Do not expose this application to the public internet
- Use only on trusted networks
- Consider restricting access using firewall rules
- Avoid running against sensitive or production repositories

---

## Limitations

- Usage tracking is best-effort only and based on parsing Codex CLI output
- Reported usage values may not match official billing
- Output parsing is heuristic and may include extra logs
- No sandboxing beyond what Codex CLI provides
- No multi-user support

---

## Disclaimer

This software is provided "as is", without warranty of any kind, express or implied, including but not limited to:

- Merchantability
- Fitness for a particular purpose
- Non-infringement

In no event shall the authors or contributors be liable for any claim, damages, or other liability, whether in an action of contract, tort, or otherwise, arising from:

- Use of the software
- Misuse of the software
- Security vulnerabilities
- Data loss or corruption

Use this software at your own risk.

---

## License

This project is open source. You may add a license such as MIT, Apache 2.0, or GPL depending on your preference.

---

## Notes

This project is intentionally minimal and designed as a personal utility tool. It is not intended to be production-ready or used in untrusted environments.