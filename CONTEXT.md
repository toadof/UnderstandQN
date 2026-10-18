# UnderstoodQN — Project Context

> Paste any DSA solution, tag your variables, provide a test case —
> and UnderstoodQN animates the execution step by step.

---

## What This Is

UnderstoodQN is an interactive web-based platform that visualizes the
step-by-step execution of Data Structures and Algorithm solutions.

The core problem it solves: students preparing for placements can read
DSA code but cannot *see* what it does to data. LeetCode shows output.
Textbooks show code. Nothing shows the process.

UnderstoodQN shows the process.

---

## How It Works

```
User pastes code + provides test case + tags variables
        ↓
FastAPI backend receives the request
        ↓
Python sys.settrace() hooks into every line of execution
        ↓
At each line: variable names, values, data structure state captured
        ↓
Serialized into a steps array  →  [ {line, vars}, {line, vars}, ... ]
        ↓
React frontend receives steps array
        ↓
D3.js renders frame-by-frame animation
Monaco Editor highlights the current line
Panels update: array bars move, hashmap grows, pointers shift
        ↓
User hits Play / Next / Prev and watches the algorithm think
```

---

## What Makes It Different From Existing Tools

| Tool | What it does | What it can't do |
|---|---|---|
| VisuAlgo | Animates standard algorithms | Fixed inputs, no user code |
| Python Tutor | Shows memory state traces | No DS visualization, no code-visual sync |
| LeetCode | Runs your code | Shows only final output |
| AlgoViz (IEEE 2023) | Animates sorting/searching | Predefined only, no custom input |
| **UnderstoodQN** | **Traces YOUR code on YOUR input** | — |

The key differentiator: user pastes their own solution, provides their
own test case, tags their variables — and sees real execution, not a
canned demo.

---

## Variable Tagging System

Because the frontend can't know whether a list is an array, stack, or
adjacency list just from the code, the user tags each variable:

```
nums    →  Array
seen    →  Hashmap
i       →  Pointer (on nums)
left    →  Pointer (on nums)
right   →  Pointer (on nums)
node    →  Tree Node
graph   →  Graph
```

Phase 1 supports: **Array, Hashmap, Pointer**
Phase 2+: Tree, Graph, Stack, Queue, DP Table

---

## Tech Stack

### Backend
| Tech | Role |
|---|---|
| Python 3.10+ | Execution language |
| `sys.settrace()` | Line-by-line execution hook — core of the tracer |
| `RestrictedPython` | Sandboxes user-submitted code safely |
| FastAPI | REST API framework — exposes `/trace` endpoint |
| Uvicorn | ASGI server to run FastAPI |
| MongoDB + Motor | Stores problems, test cases, execution traces |

### Frontend
| Tech | Role |
|---|---|
| React.js | UI framework |
| Monaco Editor | Code editor with line highlighting (same as VS Code) |
| D3.js | Data structure animations — array bars, hashmap boxes, pointers |
| Framer Motion | Smooth transition animations between steps |
| Tailwind CSS | Styling |
| Axios | HTTP client — calls FastAPI from React |

### DevOps
| Tech | Role |
|---|---|
| Docker | Containerizes the code execution engine |
| Docker Compose | Runs backend + frontend + MongoDB together |
| GitHub | Version control |

---

## Project Structure

```
understoodqn/
├── backend/
│   ├── main.py           # FastAPI app + /trace endpoint
│   ├── tracer.py         # sys.settrace() execution engine
│   ├── sandbox.py        # RestrictedPython wrapper
│   ├── models.py         # Pydantic request/response models
│   └── requirements.txt
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── CodePanel.jsx       # Monaco Editor + line highlight
│   │   │   ├── ArrayPanel.jsx      # D3 array bars + pointer arrows
│   │   │   ├── HashmapPanel.jsx    # Key-value box grid
│   │   │   ├── Controls.jsx        # Play/Pause/Prev/Next/Speed
│   │   │   └── TaggingModal.jsx    # Variable type tagging UI
│   │   ├── hooks/
│   │   │   └── useTracer.js        # API call + steps state management
│   │   └── App.jsx
│   └── package.json
│
├── docker-compose.yml
└── CONTEXT.md               ← you are here
```

---

## API Contract

### POST `/trace`

**Request:**
```json
{
  "code": "def two_sum(nums, target):\n    seen = {}\n    ...",
  "inputs": {
    "nums": [2, 7, 11, 15],
    "target": 9
  }
}
```

**Response:**
```json
{
  "total": 23,
  "steps": [
    { "line": 2, "vars": { "seen": {}, "nums": [2,7,11,15], "target": 9 } },
    { "line": 3, "vars": { "seen": {}, "i": 0, "num": 2 } },
    { "line": 4, "vars": { "seen": {}, "i": 0, "num": 2, "complement": 7 } },
    { "line": 7, "vars": { "seen": { "2": 0 }, "i": 0 } },
    ...
  ]
}
```

---

## Frontend Rendering Logic

```javascript
// The entire visualization is driven by this:
const step = steps[currentIndex]

// From one step object, all three panels update:
lineNumber  = step.line          // → Monaco highlights this line
arrayState  = step.vars[arrayVar]  // → D3 redraws array bars
hashmapState = step.vars[hmVar]   // → D3 redraws hashmap boxes
pointerPos  = step.vars[ptrVar]   // → arrow moves to this index
```

No parsing. No code analysis. Just read the snapshot and redraw.

---

## Build Order

```
Phase 0  (now)
  └── tracer.py working + verified on Two Sum

Phase 1  (backend)
  ├── FastAPI /trace endpoint
  ├── Sandbox wrapper (RestrictedPython)
  └── MongoDB trace storage (optional for now)

Phase 2  (frontend — text only)
  ├── React app scaffolded (Vite)
  ├── Calls /trace, receives steps
  └── Displays steps as plain text (no graphics yet)

Phase 3  (frontend — visuals)
  ├── ArrayPanel with D3 bars + pointer arrow
  ├── HashmapPanel with key-value boxes
  ├── Play / Pause / Step controls
  └── Speed control

Phase 4  (code sync)
  ├── Monaco Editor embedded
  └── Line highlighting synced to step.line

Phase 5  (polish)
  ├── Variable tagging modal
  ├── Problem library (saved problems)
  ├── Tree + Graph support
  └── Docker containerization
```

---

## First Problem: Two Sum

```python
def two_sum(nums, target):
    seen = {}
    for i, num in enumerate(nums):
        complement = target - num
        if complement in seen:
            return [seen[complement], i]
        seen[num] = i
    return []
```

**Test input:** `nums = [2, 7, 11, 15]`, `target = 9`
**Expected output:** `[0, 1]`

**Variables to tag:**
- `nums` → Array
- `seen` → Hashmap
- `i` → Pointer on `nums`
- `complement` → display as scalar value

---

## Team

| Name | USN | Role |
|---|---|---|
| Gautam Paul | 1SG23IS031 | [TBD] |
| Aejel Varghese Babu | 1SG23IS003 | [TBD] |
| Jayadeep J Gowda | 1SG23IS045 | [TBD] |

**Guide:** Prof. Manasa P.M., Dept. of ISE, Sapthagiri College of Engineering

---

## Key Research Papers (Prior Art)

| # | Paper | Venue | Year | What it does | Gap UnderstoodQN fills |
|---|---|---|---|---|---|
| 1 | Enhancing Algorithm Learning Through LLM-Based LeetCode Solution Visualization | IEEE Xplore | 2025 | LLM parses LeetCode solutions into visual steps | LLM can hallucinate; UnderstoodQN uses real execution |
| 2 | AlgoViz: Algorithm Visualization | IEEE ICNTE | 2023 | Animates sorting/searching with PyGame | Fixed problems only, no custom code input |
| 3 | Analysis of Algorithm Visualizer to Enhance Academic Learning | IEEE Xplore | 2022 | Web-based academic algorithm visualizer | No user-defined code or custom test cases |
| 4 | AlgoAssist: Algorithm Visualizer and Coding Platform | IEEE Xplore | 2021 | Classroom DSA platform with teacher dashboards | Teacher-managed, not problem-oriented |
| 5 | Problem Solving E-learning Platform Using AV and AI | IEEE Xplore | 2024 | AV + AI supervision for adaptive learning | Not framed around LeetCode-style problem patterns |

---

## Notes / Decisions Made

- **Why Python for execution?** `sys.settrace()` is a Python built-in.
  JavaScript would need a custom AST interpreter — much harder.

- **Why not just use an LLM to explain?** LLMs hallucinate execution steps.
  Real tracing is deterministic — same code + input always gives same steps.

- **Why variable tagging instead of auto-detection?** A Python `list` could
  be an array, stack, queue, or adjacency list. The code doesn't tell you
  which visual to use. The user knows — so they tag it.

- **Why Monaco Editor?** It's the VS Code editor, embeds in React, supports
  line decorations (highlighting) out of the box. No other editor does this
  as cleanly.

- **Why D3.js over a charting library?** D3 gives full control over every
  pixel of the animation. Chart libraries like Recharts don't support
  custom DSA visuals like pointer arrows and node graphs.
