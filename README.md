# Jones Automation — Exercise

Playwright automation for the form on https://test.netlify.app/ .


## Prerequisites

- Node.js: `v24.17.0` (or compatible LTS version)
- npm: `11.13.0`


## Setup

Clone the repository, navigate to the project folder, and install the dependencies:

```bash
# Install dependencies listed in package.json
npm install

# Ensure Chromium is installed for Playwright
npx playwright install chromium

## Run

```bash
node automation.js
```

To watch the browser run it : `$env:HEADED=1; node automation.js`

## What it does

Fills the form (Name, Email, Phone, Company, Website), changes "Number of Employees" to 51-500, saves a screenshot in `screenshots/` before submitting, clicks "Request a call back", and logs `SUCCESS` when the Thank You page loads.


