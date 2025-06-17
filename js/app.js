// simple local storage helpers
function loadData(key) {
    return JSON.parse(localStorage.getItem(key) || '[]');
}
function saveData(key, data) {
    localStorage.setItem(key, JSON.stringify(data));
}

// user management
function addUser(name, face) {
    const users = loadData('users');
    users.push({ name, face });
    saveData('users', users);
}
function getUsers() {
    return loadData('users');
}

// attendance management
function addAttendance(user, type) {
    const today = new Date().toISOString().slice(0,10);
    const attendance = loadData('attendance');
    let record = attendance.find(a => a.user === user && a.date === today);
    if (!record) {
        record = { user, date: today };
        attendance.push(record);
    }
    const time = new Date().toLocaleTimeString();
    if (type === 'in') record.checkIn = time;
    if (type === 'out') record.checkOut = time;
    saveData('attendance', attendance);
}
function getAttendance() {
    return loadData('attendance');
}

// populate user list
function renderUsers() {
    const list = document.getElementById('userList');
    if (list) {
        list.innerHTML = '';
        getUsers().forEach(u => {
            const li = document.createElement('li');
            li.textContent = u.name;
            list.appendChild(li);
        });
    }
}

function renderAttendance() {
    const table = document.getElementById('attendanceTable');
    if (table) {
        const tbody = table.querySelector('tbody');
        tbody.innerHTML = '';
        getAttendance().forEach(a => {
            const tr = document.createElement('tr');
            tr.innerHTML = `<td>${a.user}</td><td>${a.date}</td><td>${a.checkIn||''}</td><td>${a.checkOut||''}</td>`;
            tbody.appendChild(tr);
        });
    }
}

async function startCamera(video) {
    if (navigator.mediaDevices) {
        const stream = await navigator.mediaDevices.getUserMedia({ video: {} });
        video.srcObject = stream;
        return new Promise(r => video.onloadedmetadata = r);
    }
}

async function loadModels() {
    await faceapi.nets.tinyFaceDetector.loadFromUri('https://cdn.jsdelivr.net/npm/face-api.js/models');
}

async function detectFaces(video, canvas) {
    const displaySize = { width: video.width, height: video.height };
    faceapi.matchDimensions(canvas, displaySize);
    setInterval(async () => {
        const detections = await faceapi.detectAllFaces(video, new faceapi.TinyFaceDetectorOptions());
        const resized = faceapi.resizeResults(detections, displaySize);
        canvas.getContext('2d').clearRect(0,0,canvas.width,canvas.height);
        faceapi.draw.drawDetections(canvas, resized);
    }, 500);
}

document.addEventListener('DOMContentLoaded', async () => {
    renderUsers();
    renderAttendance();

    const video = document.getElementById('video');
    const overlay = document.getElementById('overlay');
    if (video && overlay) {
        await loadModels();
        await startCamera(video);
        overlay.width = video.width;
        overlay.height = video.height;
        detectFaces(video, overlay);
    }

    const captureVideo = document.getElementById('capture');
    const captureBtn = document.getElementById('captureBtn');
    const userForm = document.getElementById('userForm');
    if (captureVideo) {
        startCamera(captureVideo);
    }
    if (captureBtn) {
        captureBtn.addEventListener('click', () => {
            const canvas = document.createElement('canvas');
            canvas.width = captureVideo.videoWidth;
            canvas.height = captureVideo.videoHeight;
            const ctx = canvas.getContext('2d');
            ctx.drawImage(captureVideo, 0, 0);
            captureBtn.dataset.face = canvas.toDataURL('image/png');
            alert('Face captured! Now submit the form.');
        });
    }
    if (userForm) {
        userForm.addEventListener('submit', e => {
            e.preventDefault();
            const name = document.getElementById('username').value;
            const face = captureBtn.dataset.face;
            if (!face) {
                alert('Please capture face first');
                return;
            }
            addUser(name, face);
            userForm.reset();
            captureBtn.dataset.face = '';
            alert('User saved');
        });
    }
});
