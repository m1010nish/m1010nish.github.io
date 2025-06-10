import { initializeApp } from "https://www.gstatic.com/firebasejs/11.9.0/firebase-app.js";
import { getDatabase, ref, get, child } from "https://www.gstatic.com/firebasejs/11.9.0/firebase-database.js";
import { firebaseConfig } from './db.js'; // Adjust the path as necessary

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

async function fetchDataAndDisplay() {
    const dbRef = ref(db);
    try {
        const snapshot = await get(child(dbRef, 'experience/'));
        if (snapshot.exists()) {
            const data = snapshot.val();
            let experienceTimeline = '';
            for (const id in data) {
                experienceTimeline += `
              <div class="timeline-item">
                  <div class="timeline-marker"></div>
                  <div class="timeline-content">
                      <h4>${data[id].profession}</h4>
                      <p class="institution">${data[id].employer}</p>
                      <p class="duration">${new Date(data[id].startDate).toLocaleString('default', { month: 'short', year: 'numeric' })}
                       - ${new Date(data[id].endDate).toLocaleString('default', { month: 'short', year: 'numeric' })}</p>
                      <p class="description">${data[id].description}</p>
                  </div>
              </div>
            `;
            }
            document.getElementById('experience-timeline').innerHTML = experienceTimeline;
        } else {
            document.getElementById('experience-timeline').innerHTML = '<p>No experience data found</p>';
        }
    } catch (error) {
        console.error("Error fetching data:", error);
    }
}

window.addEventListener('DOMContentLoaded', fetchDataAndDisplay);