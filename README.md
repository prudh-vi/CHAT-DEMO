# Safe Message Checker

A React and Express.js application that evaluates the safety of messages using the OpenAI API. Unsafe messages are flagged with a **red popup** providing reasons and suggestions for revision. Optionally, the same logic can be applied as a browser extension for use across all websites.

## Features

- **Message Safety Evaluation**: Checks if a message is safe or unsafe using OpenAI API.
- **User Feedback**: Displays a red popup with reasons and suggestions for unsafe messages.
- **Browser Extension (Planned)**: Expands functionality to monitor and flag unsafe messages across all websites.([Extension](https://github.com/prudh-vi/Safsoc/tree/main/extension))

## Tech Stack

- **Frontend**: React.js
- **Backend**: Express.js ([Backend Repository](https://github.com/prudh-vi/repo))
- **API**: OpenAI API
- **Communication**: Fetch API

## Workflow

1. Users compose a message in the React frontend.
2. The message is sent to the Express.js backend via `fetch`.
3. The backend forwards the message to the OpenAI API for analysis.
4. Based on the response:
   - If **safe**, the message is processed normally.
   - If **unsafe**, a red popup alerts the user with reasons and suggestions.
5. Logs (optional) are maintained to improve the system (excluding sensitive data).

## Installation

### Prerequisites

- Node.js and npm installed.
- OpenAI API key.

### Steps

1. Clone the repository:
   ```bash
   git clone https://github.com/prudh-vi/safsoc.git
   cd safsoc
