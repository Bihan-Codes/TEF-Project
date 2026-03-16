// ================= 1. MODAL & TAB LOGIC =================

// Modal Open/Close
const modal = document.getElementById("loginModal");
const loginBtn = document.getElementById("loginBtn");

if(loginBtn) {
    loginBtn.onclick = (e) => { e.preventDefault(); modal.style.display = "block"; }
}

function closeModal() {
    modal.style.display = "none";
}

// Baire click korle modal bondho hobe
window.onclick = (event) => {
    if (event.target == modal) modal.style.display = "none";
}

// Login/Register Tab Switching
function openTab(tabName) {
    let i, tabContent, tabBtns;
    tabContent = document.getElementsByClassName("tab-content");
    for (i = 0; i < tabContent.length; i++) {
        tabContent[i].classList.remove("active-content");
    }
    tabBtns = document.getElementsByClassName("tab-btn");
    for (i = 0; i < tabBtns.length; i++) {
        tabBtns[i].classList.remove("active");
    }
    document.getElementById(tabName).classList.add("active-content");
    event.currentTarget.classList.add("active");
}

// ================= 2. GMAIL OTP LOGIC =================

// Gmail-e OTP pathanor jonno
document.querySelector('.send-otp-btn').onclick = async function() {
    const email = document.getElementById('regEmail').value;

    if (email === "" || !email.includes("@gmail.com")) {
        alert("Please enter a valid @gmail.com address!");
        return;
    }

    this.innerText = "Sending...";
    this.disabled = true;

    try {
        const response = await fetch('http://localhost:5000/send-otp', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: email })
        });
        const data = await response.json();
        alert(data.message);
    } catch (error) {
        alert("Server error! Node.js chalu ache to?");
    } finally {
        this.innerText = "Send OTP";
        this.disabled = false;
    }
};

// Automatic Gmail OTP Verification
async function autoVerifyOTP() {
    const email = document.getElementById('regEmail').value;
    const otpInput = document.getElementById('otpInput');
    const statusMsg = document.getElementById('otpStatus');
    const otpValue = otpInput.value;

    if (otpValue.length === 6) {
        statusMsg.innerText = "Checking...";
        statusMsg.style.color = "blue";

        try {
            const response = await fetch('http://localhost:5000/verify-otp', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: email, otp: otpValue })
            });

            if (response.status === 200) {
                statusMsg.innerText = "✓ Valid Gmail OTP";
                statusMsg.style.color = "green";
                otpInput.style.border = "2px solid green";
            } else {
                statusMsg.innerText = "✗ Invalid Gmail OTP";
                statusMsg.style.color = "red";
                otpInput.style.border = "2px solid red";
            }
        } catch (error) {
            statusMsg.innerText = "Server Error!";
        }
    } else {
        statusMsg.innerText = "";
        otpInput.style.border = "";
    }
}

// ================= 3. PHONE OTP LOGIC =================

// Phone-e OTP pathanor jonno (Fast2SMS logic)
async function sendPhoneOTP() {
    const phone = document.getElementById('regPhone').value;
    if (phone.length < 10) { alert("Sothik phone number dao!"); return; }

    try {
        const response = await fetch('http://localhost:5000/send-phone-otp', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ phone: phone })
        });
        const data = await response.json();
        alert(data.message); 
    } catch (error) {
        alert("Server error!");
    }
}

// Automatic Phone OTP Verification
async function autoVerifyPhoneOTP() {
    const phone = document.getElementById('regPhone').value;
    const otpInput = document.getElementById('phoneOtpInput');
    const statusMsg = document.getElementById('phoneOtpStatus');
    const otpValue = otpInput.value;

    // Jokhon user puro 6-digit type kore felbe
    if (otpValue.length === 6) {
        statusMsg.innerText = "Checking...";
        statusMsg.style.color = "blue";

        try {
            const response = await fetch('http://localhost:5000/verify-phone-otp', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ phone: phone, otp: otpValue })
            });

            if (response.ok) {
                statusMsg.innerText = "✓ Phone Verified";
                statusMsg.style.color = "green";
                otpInput.style.border = "2px solid green";
            } else {
                statusMsg.innerText = "✗ Invalid Phone OTP";
                statusMsg.style.color = "red";
                otpInput.style.border = "2px solid red";
            }
        } catch (error) {
            // Ekhane alert soriye console-e dewa hoyeche jate kaj na thamke
            console.log("Connection error, but don't worry.");
            statusMsg.innerText = "Connection Failed!";
        }
    } else {
        statusMsg.innerText = "";
        otpInput.style.border = "";
    }
}

// ================= 4. PASSWORD & CHATBOT LOGIC =================

// Password Match Check
function checkPasswordMatch() {
    let password = document.getElementById("createPass").value;
    let confirmPassword = document.getElementById("confirmPass").value;
    let errorMsg = document.getElementById("passError");

    if (password !== confirmPassword && confirmPassword !== "") {
        errorMsg.style.display = "block";
    } else {
        errorMsg.style.display = "none";
    }
}

// Donate Modal logic
const donateModal = document.getElementById("donateModal");
const donateBtn = document.querySelector(".btn-donate");
if(donateBtn) {
    donateBtn.onclick = (e) => { e.preventDefault(); donateModal.style.display = "block"; }
}
// ================= AUTO STAFF ID GENERATOR =================

function generateStaffId() {
    const year = new Date().getFullYear(); // 2026
    const randomNum = Math.floor(1000 + Math.random() * 9000); // 4 digit random number
    const finalId = "TEF-" + year + "-" + randomNum;
    
    const staffIdField = document.getElementById('staffId');
    if(staffIdField) {
        staffIdField.value = finalId;
    }
}

// Modal kholar button-e click korle ID generate hobe
document.getElementById("loginBtn").addEventListener("click", () => {
    // Shudhu jodi Register tab active thake ba modal khule, tokhon ID generate hobe
    generateStaffId();
});

// Jodi tumi openTab function use koro, sekhaneu eta add korte paro
function openTab(tabName) {
    let i, tabContent, tabBtns;
    tabContent = document.getElementsByClassName("tab-content");
    for (i = 0; i < tabContent.length; i++) {
        tabContent[i].classList.remove("active-content");
    }
    tabBtns = document.getElementsByClassName("tab-btn");
    for (i = 0; i < tabBtns.length; i++) {
        tabBtns[i].classList.remove("active");
    }
    document.getElementById(tabName).classList.add("active-content");
    event.currentTarget.classList.add("active");

    // Jodi register tab khule, tobe ID generate koro
    if(tabName === 'register-tab') {
        generateStaffId();
    }
}