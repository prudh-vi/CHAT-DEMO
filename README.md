# SafeSoc

A React and Express.js application that evaluates the safety of messages using the OpenAI API. Unsafe messages are flagged with a **red popup** providing reasons and suggestions for revision. Optionally, the same logic can be applied as a browser extension for use across all websites.

## Features

- **Message Safety Evaluation**: Checks if a message is safe or unsafe using OpenAI API.
- **User Feedback**: Displays a red popup with reasons and suggestions for unsafe messages.
- **Browser Extension**: Expands functionality to monitor and flag unsafe messages across all websites.[Extension](https://github.com/prudh-vi/Safsoc/tree/main/extension)

## Tech Stack

- **Frontend**: React.js
- **Backend**: Express.js [backend repo](https://github.com/prudh-vi/repo) The deployed link of backend is [Deployed backend](https://repo-ecaf.onrender.com/)
- **API**: OpenAI API
- **Communication**: Fetch API

## Workflow

![Basic  Workflow](https://ibb.co/g4CXpDd "Optional Screenshot Title")

## Installation

### Prerequisites

- Node.js and npm installed.
- OpenAI API key.

### Steps

1. Clone the repository:
   ```bash
   git clone https://github.com/prudh-vi/safsoc.git
   cd safsoc
