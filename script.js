// ===== Mobile nav toggle =====
const navToggle = document.querySelector('.nav-toggle');
const mainNav = document.querySelector('.main-nav');
if (navToggle && mainNav) {
  navToggle.addEventListener('click', () => {
    const isOpen = mainNav.classList.toggle('open');
    navToggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
  });
}

// ===== Role tabs (Patient / Doctor) on login & register =====
document.querySelectorAll('.role-tabs').forEach((tabGroup) => {
  const buttons = tabGroup.querySelectorAll('button');
  buttons.forEach((btn) => {
    btn.addEventListener('click', () => {
      buttons.forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');
      const role = btn.dataset.role;
      const label = document.querySelector('[data-role-label]');
      if (label) label.textContent = role === 'doctor' ? 'Doctor' : 'Patient';
      const idHint = document.querySelector('[data-id-hint]');
      if (idHint) {
        idHint.textContent = role === 'doctor'
          ? 'Use your registered Medical Council / HPR ID'
          : 'Use the mobile number linked to your ABHA health ID';
      }
    });
  });
});

// ===== Password show/hide =====
document.querySelectorAll('.pw-toggle').forEach((toggle) => {
  toggle.addEventListener('click', () => {
    const input = toggle.parentElement.querySelector('input');
    const showing = input.type === 'text';
    input.type = showing ? 'password' : 'text';
    toggle.textContent = showing ? 'Show' : 'Hide';
  });
});

// ===== Generic client-side form validation =====
function validateField(field) {
  const input = field.querySelector('input, select, textarea');
  if (!input) return true;
  let valid = input.checkValidity();

  if (input.type === 'tel' && input.value) {
    valid = /^[6-9]\d{9}$/.test(input.value.trim());
  }
  field.classList.toggle('invalid', !valid);
  return valid;
}

document.querySelectorAll('form[data-validate]').forEach((form) => {
  const fields = form.querySelectorAll('.field:not(.no-validate)');

  fields.forEach((field) => {
    const input = field.querySelector('input, select, textarea');
    if (!input) return;
    input.addEventListener('blur', () => validateField(field));
    input.addEventListener('input', () => {
      if (field.classList.contains('invalid')) validateField(field);
    });
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    let allValid = true;
    fields.forEach((field) => {
      if (!validateField(field)) allValid = false;
    });

    const alertBox = form.querySelector('.form-alert');
    if (!allValid) {
      if (alertBox) {
        alertBox.classList.remove('show');
        void alertBox.offsetWidth;
      }
      const firstInvalid = form.querySelector('.field.invalid input, .field.invalid select');
      if (firstInvalid) firstInvalid.focus();
      return;
    }

    if (alertBox) {
      alertBox.classList.add('show');
      form.querySelectorAll('input, select, textarea, button[type="submit"]').forEach((el) => el.disabled = true);
      const redirect = form.dataset.redirect;
      if (redirect) {
        setTimeout(() => { window.location.href = redirect; }, 900);
      }
    }
  });
});

// ===== Appointment slot selection =====
document.querySelectorAll('.doc-slots').forEach((group) => {
  group.querySelectorAll('.slot-chip').forEach((chip) => {
    chip.addEventListener('click', () => {
      group.querySelectorAll('.slot-chip').forEach((c) => c.classList.remove('selected'));
      chip.classList.add('selected');

      const card = group.closest('.doctor-card');
      const doctorName = card ? card.querySelector('h3').textContent : '';
      const time = chip.textContent;

      const summaryDoctor = document.querySelector('[data-summary-doctor]');
      const summaryTime = document.querySelector('[data-summary-time]');
      const bookBtn = document.querySelector('[data-book-btn]');
      if (summaryDoctor) summaryDoctor.textContent = doctorName;
      if (summaryTime) summaryTime.textContent = time;
      if (bookBtn) bookBtn.disabled = false;
    });
  });
});

const bookBtn = document.querySelector('[data-book-btn]');
if (bookBtn) {
  bookBtn.addEventListener('click', () => {
    const alertBox = document.querySelector('[data-book-alert]');
    if (alertBox) alertBox.classList.add('show');
    bookBtn.disabled = true;
    bookBtn.textContent = 'Consultation booked';
  });
}
