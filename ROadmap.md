
I think you should treat **Codex as your senior software engineer**, not as an autocomplete tool.

Instead of saying:

> "Add weather"

give Codex a complete software design document.

Below is a prompt I'd actually give Codex for this project.

---

# MASTER PROMPT FOR CODEX

```text
# Project Name

ASK_ME Navigator

AI Powered Maritime Decision Support Platform

----------------------------------------------------

## Current Status

Phase 1 is completed.

The existing project already contains:

- MERN Stack
- React + Vite frontend
- Express backend
- MongoDB
- Pinecone Vector Database
- Gemini API
- JWT Authentication
- Login/Register
- Chat UI
- Maritime PDF Upload
- Maritime RAG
- Chat History
- Session Management
- Compliance Portal

Do NOT rebuild these.

Use the existing architecture.

----------------------------------------------------

## Goal

Transform the existing Maritime RAG chatbot into an AI Maritime Navigation Assistant.

The project must remain a MONOLITH application.

Do NOT convert into microservices.

Everything should remain inside one Express backend and one React frontend.

The code should be clean, modular and scalable.

----------------------------------------------------

## Core Vision

The application should feel like an experienced Bridge Officer assisting the Captain.

The AI should not behave like ChatGPT.

It should behave like an experienced maritime officer.

The AI should always explain WHY it gives a recommendation.

It must NEVER fabricate information.

Whenever data is unavailable, it must clearly say so.

----------------------------------------------------

## AI Principles

The AI should only answer using

1. Pinecone RAG
2. Maritime documents
3. Live Weather APIs
4. Route calculations
5. ETA calculations
6. Distance calculations
7. Official Maritime Regulations

Never invent

- SOLAS
- MARPOL
- STCW
- ISM
- Weather
- Ship positions
- ETA
- Fuel calculations

If data does not exist

Say

"I do not have verified information for this request."

----------------------------------------------------

## Application Flow

Officer opens dashboard

↓

Interactive Globe

↓

Weather loads

↓

Route loads

↓

Officer asks question

↓

Coordinator analyzes request

↓

Coordinator decides

Which services are needed

↓

Services return structured data

↓

Gemini receives structured prompt

↓

Gemini generates final answer

↓

UI updates

↓

Voice reads answer

----------------------------------------------------

The architecture should be service based.

NOT microservices.

Every module should have one responsibility.

```

---

# PHASE 2

## AI Coordinator

This is the brain of the application.

Every request must pass through the coordinator.

Instead of

User → Gemini

It becomes

User

↓

Coordinator

↓

Intent Detection

↓

Call required services

↓

Merge results

↓

Gemini

↓

Return answer

---

Folder

```text
backend/

src/

services/

coordinator/
      coordinator.service.js

      intentDetector.js

      promptBuilder.js

      responseFormatter.js
```

Responsibilities

Detect

Navigation

Weather

Emergency

Knowledge

Distance

ETA

Route

Voice

The coordinator should decide which services are required.

Example

Officer asks

Should we continue to Singapore?

Coordinator decides

Need

Weather

Navigation

Route

RAG

Then calls

```javascript
weatherService()

navigationService()

ragService()
```

Merge everything

Send one structured prompt to Gemini.

---

# PHASE 3

## Weather Service

Folder

```text
services/

weather/

weather.service.js

weather.parser.js

weather.utils.js
```

Responsibilities

Fetch

Wind

Pressure

Visibility

Temperature

Wave Height

Storm

Ocean Current

Do NOT call Gemini here.

Only return structured JSON.

Example

```json
{
  "wind": "28 knots",
  "waveHeight": "4.3m",
  "storm": true
}
```

---

# PHASE 4

## Navigation Service

Folder

```text
services/

navigation/

navigation.service.js

distance.js

bearing.js

eta.js

route.js
```

Responsibilities

Calculate

Distance

Bearing

ETA

Heading

Travel Time

Speed

Never ask Gemini.

Pure calculations only.

---

# PHASE 5

## Maritime Globe

Frontend

Create

```text
components/

Globe/

Globe.jsx

ShipMarker.jsx

WeatherLayer.jsx

RouteLayer.jsx

CameraController.jsx
```

Requirements

Load CesiumJS

Display Earth

Display ship

Display destination

Display route

Support zoom

Support rotation

Future support

Multiple ships

---

# PHASE 6

## Voice Assistant

Create

```text
components/

Voice/

VoiceButton.jsx

VoiceWave.jsx

VoiceSettings.jsx
```

Backend

```text
services/

voice/

speechToText.js

textToSpeech.js
```

Flow

Officer speaks

↓

Speech To Text

↓

Coordinator

↓

Gemini

↓

Text

↓

Speech

↓

Officer hears response

Voice personality

Professional

Maritime

Senior Officer

Never casual.

---

# PHASE 7

## Dashboard

Replace chat-first UI.

Dashboard becomes homepage.

Cards

Current Route

Weather

ETA

Wind

Wave Height

Alerts

Recommendation

Emergency

Ship Position

Recent Conversations

---

# PHASE 8

## Recommendation Engine

Create

```text
services/

recommendation/

recommendation.service.js
```

Responsibilities

Receive

Weather

Navigation

RAG

Emergency

Generate recommendation

Never hallucinate.

Output

Recommendation

Reason

Confidence

Supporting Data

---

# PHASE 9

## Emergency Assistant

Folder

```text
services/

emergency/
```

Officer says

Fire in Engine Room

↓

Search RAG

↓

Return SOP

↓

Highlight immediate actions

No generated procedures.

Only verified documents.

---

# PHASE 10

## Alert System

Create

```text
services/

alerts/

alert.service.js
```

Continuously monitor

Wind

Storm

ETA

Route

Wave Height

Generate alerts.

---

# Backend Folder Structure

```text
backend/

src/

config/

controllers/

middleware/

models/

routes/

services/

    coordinator/

    rag/

    weather/

    navigation/

    recommendation/

    emergency/

    alerts/

    voice/

    eta/

    route/

    globe/

utils/

prompts/

    officerPrompt.js

    coordinatorPrompt.js

    recommendationPrompt.js

uploads/
```

---

# Frontend Folder Structure

```text
frontend/

src/

components/

    Globe/

    Chat/

    Dashboard/

    Weather/

    Navigation/

    Voice/

    Alerts/

    Emergency/

    Recommendation/

pages/

hooks/

store/

services/

contexts/

assets/

styles/

utils/
```

---

# Communication Pattern

Every request follows this pipeline.

```text
Officer

↓

Frontend

↓

Express API

↓

Coordinator Service

↓

Intent Detection

↓

Call Required Services

↓

Collect JSON

↓

Prompt Builder

↓

Gemini

↓

Formatter

↓

Frontend

↓

Voice Output

↓

Dashboard Update
```

No service should call another service directly without the coordinator.

---

# Prompt Builder

The prompt builder should assemble a structured prompt for Gemini, for example:

```text
Officer Question:
Can we continue on our current route?

Weather Data:
- Wind: 28 knots
- Wave Height: 4.3 m
- Storm Warning: Yes

Navigation Data:
- Current Heading: 210°
- Distance Remaining: 1450 NM
- ETA: 4 days 16 hours

Maritime Knowledge:
- SOLAS guidance retrieved from RAG with citations.

Instructions:
- Do not invent facts.
- Base the answer only on the supplied data.
- If information is missing, explicitly state that it is unavailable.
- Provide a recommendation, the reasoning, confidence level, and cite the supporting maritime documents where applicable.
```

---

# Coding Standards for Codex

* Keep the project as a **modular monolith**.
* Prefer composition over deeply nested logic.
* Each service has one responsibility.
* Return typed/structured objects between services instead of free-form text.
* Keep API routes thin; business logic belongs in services.
* Use async/await consistently.
* Add JSDoc comments for exported functions.
* Reuse existing authentication, MongoDB, Pinecone, and Gemini integrations.
* Don't introduce unnecessary frameworks unless they solve a clear problem.
* Build incrementally so every phase leaves the application in a working state.

This prompt gives Codex a clear roadmap and enough architectural guidance to extend your existing project without rewriting what you've already built.
