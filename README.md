# Face Recognition App

This lightweight web application demonstrates basic face detection and user attendance tracking using the browser. It includes four pages:

1. **Home** – performs live face detection with the camera.
2. **Add User** – capture a user's face and store it locally.
3. **Attendance** – view daily check‑in and check‑out records.
4. **Users** – display a list of all saved users.

All data is stored in the browser's local storage. The UI is mobile responsive and uses the [face-api.js](https://github.com/justadudewhohacks/face-api.js/) library loaded from a CDN.

## Running with Docker

To build and run the app inside a container:

1. Build the image:
   ```bash
   docker build -t face-app .
   ```
2. Start the container and expose port 8090:
   ```bash
   docker run --rm -p 8090:8090 face-app
   ```

Then open `http://localhost:8090` in your browser.
