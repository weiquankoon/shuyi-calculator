/**
 * 日期选择器初始化 + 子时/双胞胎交互逻辑 (ESM)
 */
import 'flatpickr/dist/flatpickr.min.css';
import flatpickr from 'flatpickr';
import { Mandarin } from 'flatpickr/dist/l10n/zh.js';

// ─── 出生日期选择器 ───────────────────────────────
function syncHiddenInputs(date) {
  document.getElementById('birth-day').value = date.getDate();
  document.getElementById('birth-month').value = date.getMonth() + 1;
  document.getElementById('birth-year').value = date.getFullYear();
  // 保存到缓存
  const isoDate = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
  sessionStorage.setItem('shuyi_birth_date', isoDate);
}

const savedBirthDate = sessionStorage.getItem('shuyi_birth_date');

const flatpickrOptions = {
  locale: Mandarin,
  dateFormat: "Y-m-d",
  altInput: true,
  altFormat: "d/m/Y",
  minDate: "1900-01-01",
  maxDate: null,
  monthSelectorType: "dropdown",
  disableMobile: true,
};

flatpickr("#birth-date-picker", {
  ...flatpickrOptions,
  defaultDate: savedBirthDate || null,
  onReady: function (selectedDates) {
    if (selectedDates.length > 0) {
      syncHiddenInputs(selectedDates[0]);
    }
  },
  onChange: function (selectedDates) {
    if (selectedDates.length > 0) syncHiddenInputs(selectedDates[0]);
  }
});

// ─── 父/母生日选择器 ──────────────────────────────
const savedParentDate = sessionStorage.getItem('shuyi_parent_date');

flatpickr("#parent-date-picker", {
  ...flatpickrOptions,
  defaultDate: savedParentDate || null,
  onReady: function (selectedDates) {
    if (selectedDates.length > 0) {
      const d = selectedDates[0];
      const iso = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
      document.getElementById('parent-birth-date-hidden').value = iso;
    }
  },
  onChange: function (selectedDates) {
    const hiddenInput = document.getElementById('parent-birth-date-hidden');
    if (selectedDates.length > 0) {
      const d = selectedDates[0];
      const y = d.getFullYear();
      const m = String(d.getMonth() + 1).padStart(2, '0');
      const day = String(d.getDate()).padStart(2, '0');
      const iso = `${y}-${m}-${day}`;
      hiddenInput.value = iso;
      sessionStorage.setItem('shuyi_parent_date', iso);
    }
  }
});

// ─── 双胞胎展开区交互 ────────────────────────────
const twinCheck = document.getElementById('twin-check');
const twinExpand = document.getElementById('twin-expand');
const twinStatusText = document.getElementById('twin-status-text');

if (twinCheck && twinExpand) {
  twinCheck.addEventListener('change', () => {
    const isYes = twinCheck.checked;
    twinExpand.classList.toggle('open', isYes);
    twinExpand.setAttribute('aria-hidden', String(!isYes));
    if (twinStatusText) {
      twinStatusText.textContent = isYes ? '是' : '否';
      twinStatusText.style.color = isYes ? 'var(--accent)' : 'var(--muted)';
    }
  });
}

// ─── 子时 toggle 提示 ─────────────────────────────
const ziHourCheck = document.getElementById('zi-hour-check');
const ziHourExpand = document.getElementById('zi-hour-expand');

if (ziHourCheck && ziHourExpand) {
  ziHourCheck.addEventListener('change', () => {
    const isChecked = ziHourCheck.checked;
    ziHourExpand.classList.toggle('open', isChecked);
    ziHourExpand.setAttribute('aria-hidden', String(!isChecked));
  });
}

