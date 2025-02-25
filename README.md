# Student Helper

This project is a web application that allows users to upload summaries for various subjects, organized by chapters. The application is structured to provide a user-friendly interface for uploading and displaying summaries.

## Project Structure

```md
website-project
├── index.html         # Main HTML document
├── home.html          # Home page
├── lookup.html        # Lookup page
├── links.html         # Group Links page
├── status.html        # System Status page
├── admin.html         # Admin portal
├── api
│   ├── app.py                # Fetching code API
│   ├── wsgi.py               # Deployment
│   ├── requirements.txt      # Required dependencies
├── static
│   ├── css                # Compiled CSS styles
│   ├── scss               # Source SCSS files
│   ├── img                # Images and icons
│   └── js
│       ├── controllers    # Controllers (uploadController.js, linkController.js)
│       ├── layout         # Layout scripts (nav.js, theme.js)
│       ├── services       # Service files  (driveService.js)
│       └── translations.js
└── README.md              # Project documentation
```

## Features

- Material Upload and Management by student leaders.
- Student Lookup for retrieving university codes.
- Group Links for accessing official, section, and subject-specific groups.
- System Status monitoring for APIs and deployment health.

## Deployment

- Configure environment variables as needed.
- Deploy using a preferred web server or platforms like Heroku/Netlify.

## Usage Guidelines

- Navigate to the main page to upload summaries.
- Summaries should be organized by chapters for better accessibility.
- Uploaded summaries will be displayed on the website for users to view.

## Purpose

The purpose of this project is to create a collaborative platform where users can share and access summaries for various subjects, enhancing learning and study efficiency.
