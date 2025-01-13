# Wild View API

A powerful REST API built with NestJS for the Wild View application.

## Tech Stack

- NestJS
- Prisma ORM
- PostgreSQL
- JWT Authentication
- TypeScript

## Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- PostgreSQL

## Getting Started

1. Clone the repository:
```bash
git clone https://github.com/Apollo-Solutions-Dev/wild-view-api.git
```

# Install dependencies:

npm install


# Set up your environment variables:
cp .env.example .env


# Set up the database:
npx prisma migrate dev


# Start the development server:
npm run start:dev


# API Documentation
The API will be available at http://localhost:3000

# Key endpoints:

### Files and Media

- `GET /api/list-files/:folder` - List all files in specified folder
- `POST /api/get-json-upload-url` - Get upload URL for JSON files
  - Required body: 
    ```json
    {
      "data": {
        "video": "string",
        "polygons": [[[{"x": number, "y": number}]]]
      },
      "fileName": "string" (optional)
    }
    ```
- `POST /api/get-video-upload-url` - Get upload URL for video files
  - Requires multipart form data with:
    - file: video file
    - fileName: string



# Database Management

# Generate Prisma migrations:
npx prisma migrate dev


# View and manage data with Prisma Studio:
npx prisma studio


# Available Scripts

npm run start - Start production server
npm run start:dev - Start development server with hot reload


