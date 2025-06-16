# online-learning-backend

## API Documentation

### Authentication
- **POST /api/auth/register** — Register a new user
- **POST /api/auth/educator/register** — Register a new educator
- **POST /api/auth/login** — Login (returns JWT token)

### Courses
- **GET /api/courses** — List all courses
- **GET /api/courses/:id** — Get course details
- **POST /api/courses** — Create a new course
- **POST /api/courses/:id/enroll** — Enroll in a course (requires authentication)
- **POST /api/courses/:id/review** — Review a course (requires enrollment)
  - Body: `{ "rating": 4, "review": "Excellent course!" }`
- **POST /api/courses/:id/classes** — Add a live class to a course
- **POST /api/courses/:id/lessons** — Add a lesson to a course (requires authentication)
- **POST /api/courses/:id/tests** — Add a test to a course (requires authentication)

### Lessons
- **GET /api/lessons/:id** — Get lesson details (requires authentication)
- **POST /api/lessons/:id/progress** — Update lesson progress (requires authentication)
- **POST /api/lessons/:id/notes** — Save a note for a lesson (requires authentication)
- **POST /api/lessons** — Create a lesson (requires authentication)

### Live Classes
- **GET /api/live-classes/schedule** — Get live class schedule
- **POST /api/live-classes/:id/join** — Join a live class (requires authentication)
- **POST /api/live-classes/:id/questions** — Ask a question in a live class (requires authentication)

### Educators
- **GET /api/educators** — List educators
- **GET /api/educators/:id** — Get educator profile

### Students
- **POST /api/students/:id/follow** — Follow an instructor (requires authentication)

### Doubts (Q&A)
- **POST /api/doubts** — Post a doubt (requires authentication)
  - Body: `{ "courseId": 101, "lessonId": 1001, "question": "Why is acceleration constant in free fall?", "attachments": ["image_url"] }`
- **GET /api/doubts/my** — Get your doubts (requires authentication)
- **POST /api/doubts/:id/answer** — Answer a doubt (educator authentication required)
  - Body: `{ "answer": "Your answer here" }`

### Progress & Analytics
- **GET /api/progress/dashboard** — Get learning dashboard (requires authentication)
- **GET /api/progress/course/:courseId** — Get course progress (requires authentication)
- **GET /api/progress/search?q=...&type=...** — Global search (q required, type optional: course/educator/lesson)

### Subscriptions
- **GET /api/subscriptions/plans** — Get subscription plans
- **POST /api/subscriptions/purchase** — Purchase a subscription (requires authentication)
  - Body: `{ "planId": 1 }`

### Tests/Quizzes
- **GET /api/tests** — List tests (filter by courseId/type/subject)
- **POST /api/tests/:id/start** — Start a test (requires authentication)
- **POST /api/tests/:sessionId/submit** — Submit test answers (requires authentication)
  - Body: `{ "answers": [ { "questionId": 1, "answer": "A" } ] }`

### Study Materials
- **GET /api/materials/course/:courseId** — Get course materials (requires enrollment)
- **POST /api/materials/:id/download** — Track material download (requires authentication)
- **POST /api/materials** — Add new study material (requires authentication)
  - Body: `{ "title": "Physics Formula Sheet", "type": "PDF", "chapter": "All Chapters", "url": "https://example.com/formula-sheet.pdf", "courseId": 101, "canDownload": true }`

---

## Usage
- Most endpoints that change data require authentication. Pass your JWT token in the `Authorization` header as `Bearer <token>`.
- For endpoints that require a request body, use `Content-Type: application/json` and provide the body as shown above.
- For search, use `/api/progress/search?q=your_query`.

---

For more details on each endpoint, see the controllers and routes in the `src/` directory.

