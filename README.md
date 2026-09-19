## Requirements

- Node.js 20+
- npm

## Run

```bash
npm install
npm run dev
```

Open:

```text
http://localhost:3000/login
```

## Routes

| Route                   | Purpose                   |
| ----------------------- | ------------------------- |
| `/`                     | redirect به login         |
| `/login`                | ورود با username/password |
| `/register`             | کد ملی + موبایل + OTP     |
| `/register/credentials` | انتخاب username/password  |
| `/onboarding`           | Stepper و مراحل اصلی      |

## Technologies

- Next.js App Router
- React
- TypeScript
- Tailwind CSS 4
- Lucide React
- Browser APIs: `getUserMedia`, `MediaRecorder`, Canvas
