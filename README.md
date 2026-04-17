# BodyMind AI 🧠🩺

A revolutionary AI-powered healthcare application utilizing advanced interactive 3D anatomical models and intelligent diagnostics to provide an intuitive symptom assessment experience.

## 🚀 Key Features

*   **Comprehensive Health Profiling**: Context-aware AI diagnostics based on age, pre-existing conditions, allergies, and medications.
*   **3D Anatomical Body Module**: Interactive, fully-rotatable 3D human body with isolating views for **Skin, Muscle, Organ, and Skeletal** systems.
*   **Mental Health AI**: Dedicated psychometric evaluation to assess stress, anxiety, and mental fatigue.
*   **Exportable Doctor's Reports**: Instantly compile your interactions, visual annotations, and AI diagnoses into a professional PDF.
*   **Emergency Witness Mode**: Specialized workflow for bystanders to quickly assist users in medical emergencies.

---

## 🗺️ How to Navigate the Prototype (User Guide)

Follow this step-by-step map to fully experience the BodyMind AI capabilities:

### 1. 📝 Initial Onboarding
When you first open the app, you will be prompted to create your **Health Profile**. The AI utilizes these details (like Age and Medical History) to adjust its diagnostic probabilities. 

### 2. 🦴 The Body Module (3D Anatomy Interaction)
Once onboarding is complete, you land in the primary workspace—the 3D Body Module.
*   **Explore**: **Click and drag** to rotate the body 360 degrees. **Scroll** to zoom in on specific regions.
*   **Layer Selection**: Use the *System Selection* buttons at the top to peel back the skin and view the **Muscle, Organ, or Skeletal** layers beneath.
*   **Diagnose Symptoms**: **Click on any specific body part** (e.g., Stomach, Chest, Left Arm). A diagnostic panel will open.
    *   Set your *Pain Intensity (0-10)*.
    *   Set your *Pain Duration*.
    *   Click **"Get AI Diagnosis"** to receive the top 3 probable causes based on your interactions and profile.
*   **Medical Illustration**: Click **"🖌️ Add Notes"** to lock the 3D model in place. Use the drawing tools to circle or highlight pain points directly on the anatomy. Click "✍️ Exit Illustration" to resume 3D rotation.

### 3. 🧠 The Mind Module (Mental Well-being)
Switch to the **"Mind"** tab via the top-left navigation.
*   Engage with the conversational AI. 
*   Describe your emotional or cognitive symptoms (e.g., insomnia, stress) to receive structured mental health analyses and coping strategies.

### 4. 📄 Exporting a Medical Report
*   Click the **"Export Report"** button in the top-right corner.
*   The system will aggregate your health profile, recent symptom history (Body & Mind), and any 3D drawings you made into a clean, professional summary.
*   *(Note: Browsers might block the PDF generation print dialog, ensure pop-ups are enabled).*

---

## 🛠️ Technology Stack
*   **Frontend**: React.js Custom framework built via Vite.
*   **3D Rendering**: Three.js, `@react-three/fiber`, `@react-three/drei`.
*   **Styling**: Pure CSS (Glassmorphism & Medical Dark-Mode themes).
*   **State & Storage**: LocalStorage API for session persistence.

## 🏃 Running Locally
1. `npm install`
2. `npm run dev`
*(Note: Requires Git LFS to pull the large 3D GLTF models located in `/public/models/`)*

## Deployment Note
The anatomy assets under `public/models/` are currently stored in Git LFS. Local development works when Git LFS has pulled the real files, but platforms that clone the repository without materializing LFS payloads will serve Git LFS pointer text instead of the actual `.gltf` and `.bin` files.

For production deployments, host the model files on object storage/CDN and set `VITE_MODEL_BASE_URL` to that public base URL, for example:

`VITE_MODEL_BASE_URL=https://your-cdn.example.com/models/`
