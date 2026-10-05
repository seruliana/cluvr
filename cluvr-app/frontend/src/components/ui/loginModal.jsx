/*
<style>
  * { box-sizing: border-box; margin: 0; padding: 0; font-family: 'DM Sans', 'Noto Sans', sans-serif; }
  .overlay {
    min-height: 560px;
    background: rgba(15,13,26,0.55);
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 20px;
    border-radius: var(--border-radius-lg);
  }
  .modal {
    background: var(--color-background-primary);
    border-radius: 24px;
    border: 0.5px solid var(--color-border-tertiary);
    width: 100%;
    max-width: 400px;
    overflow: hidden;
  }
  .modal-banner {
    background: linear-gradient(135deg, #5b3ff8 0%, #7c3aed 100%);
    padding: 28px 28px 24px;
    position: relative;
  }
  .modal-banner::after {
    content: '';
    position: absolute;
    top: -40px; right: -40px;
    width: 140px; height: 140px;
    border-radius: 50%;
    background: rgba(255,255,255,0.06);
  }
  .brand-logo {
    font-size: 22px;
    font-weight: 700;
    color: white;
    letter-spacing: -0.5px;
    margin-bottom: 6px;
    position: relative;
    z-index: 1;
  }
  .brand-sub {
    font-size: 13px;
    color: rgba(255,255,255,0.7);
    position: relative;
    z-index: 1;
  }
  .modal-body { padding: 24px; }
  .tab-row {
    display: flex;
    background: var(--color-background-secondary);
    border-radius: 12px;
    padding: 3px;
    margin-bottom: 20px;
  }
  .tab {
    flex: 1;
    padding: 8px;
    border: none;
    background: transparent;
    border-radius: 10px;
    font-size: 13px;
    font-weight: 500;
    color: var(--color-text-secondary);
    cursor: pointer;
    transition: all 0.2s;
  }
  .tab.active {
    background: var(--color-background-primary);
    color: #5b3ff8;
    border: 0.5px solid var(--color-border-tertiary);
  }
  .form-group { margin-bottom: 14px; }
  label {
    display: block;
    font-size: 11px;
    font-weight: 600;
    color: var(--color-text-secondary);
    text-transform: uppercase;
    letter-spacing: 0.06em;
    margin-bottom: 6px;
  }
  .input-wrap {
    position: relative;
    display: flex;
    align-items: center;
  }
  .input-wrap i {
    position: absolute;
    left: 12px;
    font-size: 16px;
    color: var(--color-text-secondary);
    pointer-events: none;
  }
  input[type=text], input[type=email], input[type=password] {
    width: 100%;
    padding: 10px 12px 10px 36px;
    border: 0.5px solid var(--color-border-secondary);
    border-radius: var(--border-radius-md);
    font-size: 14px;
    background: var(--color-background-primary);
    color: var(--color-text-primary);
    outline: none;
    transition: border-color 0.2s;
  }
  input:focus { border-color: #5b3ff8; box-shadow: 0 0 0 3px rgba(91,63,248,0.1); }
  .eye-btn {
    position: absolute;
    right: 10px;
    background: none;
    border: none;
    cursor: pointer;
    color: var(--color-text-secondary);
    font-size: 16px;
    padding: 2px;
  }
  .forgot { font-size: 12px; color: #5b3ff8; text-decoration: none; float: right; margin-top: -10px; margin-bottom: 6px; display: block; }
  .btn-primary {
    width: 100%;
    padding: 11px;
    background: #5b3ff8;
    color: white;
    border: none;
    border-radius: 50px;
    font-size: 14px;
    font-weight: 600;
    cursor: pointer;
    transition: background 0.2s, transform 0.1s;
    margin-top: 4px;
  }
  .btn-primary:hover { background: #3a22c7; }
  .btn-primary:active { transform: scale(0.98); }
  .divider {
    display: flex; align-items: center; gap: 10px;
    margin: 16px 0; font-size: 12px; color: var(--color-text-secondary);
  }
  .divider::before, .divider::after {
    content: ''; flex: 1;
    height: 0.5px; background: var(--color-border-tertiary);
  }
  .btn-google {
    width: 100%;
    padding: 10px;
    background: var(--color-background-primary);
    border: 0.5px solid var(--color-border-secondary);
    border-radius: 50px;
    font-size: 13px;
    font-weight: 500;
    color: var(--color-text-primary);
    cursor: pointer;
    display: flex; align-items: center; justify-content: center; gap: 8px;
    transition: background 0.2s;
  }
  .btn-google:hover { background: var(--color-background-secondary); }
  .g-icon { width: 16px; height: 16px; }
  .footer-text { text-align: center; font-size: 12px; color: var(--color-text-secondary); margin-top: 16px; }
  .footer-text a { color: #5b3ff8; font-weight: 600; text-decoration: none; cursor: pointer; }
  .close-btn {
    position: absolute; top: 14px; right: 14px;
    width: 28px; height: 28px;
    background: rgba(255,255,255,0.18);
    border: none; border-radius: 50%;
    color: white; font-size: 16px;
    cursor: pointer; display: flex; align-items: center; justify-content: center;
    z-index: 2;
  }
  .close-btn:hover { background: rgba(255,255,255,0.3); }
  .interests-grid {
    display: flex; flex-wrap: wrap; gap: 6px; margin-bottom: 14px;
  }
  .interest-tag {
    padding: 6px 12px; border-radius: 50px;
    border: 1px solid var(--color-border-secondary);
    font-size: 12px; font-weight: 500;
    cursor: pointer; transition: all 0.15s;
    background: var(--color-background-primary);
    color: var(--color-text-secondary);
  }
  .interest-tag.sel {
    background: #ede9ff; color: #5b3ff8;
    border-color: #5b3ff8;
  }
  .step-dots { display: flex; gap: 5px; justify-content: center; margin-bottom: 16px; }
  .dot { width: 6px; height: 6px; border-radius: 50%; background: var(--color-border-secondary); transition: all 0.2s; }
  .dot.active { background: #5b3ff8; width: 18px; border-radius: 3px; }
  .hidden { display: none; }
  .success-anim { text-align: center; padding: 16px 0; }
  .check-circle {
    width: 56px; height: 56px; border-radius: 50%;
    background: #ede9ff; margin: 0 auto 12px;
    display: flex; align-items: center; justify-content: center;
    font-size: 26px;
  }
</style>

<div class="overlay" id="overlay">
  <div class="modal" id="modal">
    <div class="modal-banner" style="position:relative">
      <button class="close-btn" onclick="toggleModal()" aria-label="Хаах"><i class="ti ti-x"></i></button>
      <div class="brand-logo">cluvr</div>
      <div class="brand-sub" id="banner-sub">Discover your campus</div>
    </div>

    <div class="modal-body">
      <div class="tab-row">
        <button class="tab active" id="tab-login" onclick="switchTab('login')">Нэвтрэх</button>
        <button class="tab" id="tab-signup" onclick="switchTab('signup')">Бүртгүүлэх</button>
      </div>

      <!-- LOGIN -->
      <div id="panel-login">
        <div class="form-group">
          <label>И-мэйл хаяг</label>
          <div class="input-wrap">
            <i class="ti ti-mail" aria-hidden="true"></i>
            <input type="email" placeholder="student@num.edu.mn" id="login-email">
          </div>
        </div>
        <div class="form-group">
          <label>Нууц үг</label>
          <div class="input-wrap">
            <i class="ti ti-lock" aria-hidden="true"></i>
            <input type="password" placeholder="••••••••" id="login-pw">
            <button class="eye-btn" onclick="togglePw('login-pw',this)" aria-label="Нууц үг харах">
              <i class="ti ti-eye"></i>
            </button>
          </div>
        </div>
        <a class="forgot" href="#">Нууц үгээ мартсан уу?</a>
        <button class="btn-primary" onclick="doLogin()">Нэвтрэх</button>
        <div class="divider">эсвэл</div>
        <button class="btn-google" onclick="doGoogle()">
          <svg class="g-icon" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
          Google-ээр нэвтрэх
        </button>
        <p class="footer-text">Бүртгэл байхгүй юу? <a onclick="switchTab('signup')">Бүртгүүлэх</a></p>
      </div>

      <!-- SIGNUP step 1 -->
      <div id="panel-signup" class="hidden">
        <div class="step-dots">
          <div class="dot active" id="dot0"></div>
          <div class="dot" id="dot1"></div>
          <div class="dot" id="dot2"></div>
        </div>
        <div id="step-0">
          <div class="form-group">
            <label>Бүтэн нэр</label>
            <div class="input-wrap">
              <i class="ti ti-user" aria-hidden="true"></i>
              <input type="text" placeholder="Нэр Овог" id="su-name">
            </div>
          </div>
          <div class="form-group">
            <label>И-мэйл хаяг</label>
            <div class="input-wrap">
              <i class="ti ti-mail" aria-hidden="true"></i>
              <input type="email" placeholder="student@num.edu.mn" id="su-email">
            </div>
          </div>
          <div class="form-group">
            <label>Нууц үг</label>
            <div class="input-wrap">
              <i class="ti ti-lock" aria-hidden="true"></i>
              <input type="password" placeholder="Хамгийн багадаа 8 тэмдэгт" id="su-pw">
              <button class="eye-btn" onclick="togglePw('su-pw',this)" aria-label="Нууц үг харах">
                <i class="ti ti-eye"></i>
              </button>
            </div>
          </div>
          <button class="btn-primary" onclick="nextStep(1)">Үргэлжлүүлэх <i class="ti ti-arrow-right"></i></button>
        </div>

        <div id="step-1" class="hidden">
          <div class="form-group">
            <label>Их сургууль</label>
            <div class="input-wrap">
              <i class="ti ti-building" aria-hidden="true"></i>
              <input type="text" placeholder="Монгол Улсын Их Сургууль" id="su-uni">
            </div>
          </div>
          <div class="form-group">
            <label>Мэрэгжил</label>
            <div class="input-wrap">
              <i class="ti ti-book" aria-hidden="true"></i>
              <input type="text" placeholder="Програм хангамжийн инженерчлэл" id="su-major">
            </div>
          </div>
          <div style="display:flex;gap:8px;margin-top:4px">
            <button class="btn-primary" style="background:var(--color-background-secondary);color:var(--color-text-primary);border:0.5px solid var(--color-border-secondary)" onclick="nextStep(0)">
              <i class="ti ti-arrow-left"></i>
            </button>
            <button class="btn-primary" style="flex:1" onclick="nextStep(2)">Үргэлжлүүлэх <i class="ti ti-arrow-right"></i></button>
          </div>
        </div>

        <div id="step-2" class="hidden">
          <p style="font-size:13px;color:var(--color-text-secondary);margin-bottom:12px">Сонирхлоо сонгоно уу</p>
          <div class="interests-grid" id="interests">
            <span class="interest-tag sel" onclick="toggleInt(this)">💻 Технологи</span>
            <span class="interest-tag" onclick="toggleInt(this)">🎨 Урлаг</span>
            <span class="interest-tag sel" onclick="toggleInt(this)">📷 Фотограф</span>
            <span class="interest-tag" onclick="toggleInt(this)">🌿 Байгал орчин</span>
            <span class="interest-tag" onclick="toggleInt(this)">🎭 Драм</span>
            <span class="interest-tag sel" onclick="toggleInt(this)">🏀 Спорт</span>
            <span class="interest-tag" onclick="toggleInt(this)">🎵 Хөгжим</span>
            <span class="interest-tag" onclick="toggleInt(this)">♟️ Шатар</span>
            <span class="interest-tag" onclick="toggleInt(this)">🗣️ Дебат</span>
          </div>
          <div style="display:flex;gap:8px">
            <button class="btn-primary" style="background:var(--color-background-secondary);color:var(--color-text-primary);border:0.5px solid var(--color-border-secondary)" onclick="nextStep(1)">
              <i class="ti ti-arrow-left"></i>
            </button>
            <button class="btn-primary" style="flex:1" onclick="doRegister()">Бүртгэл үүсгэх ✨</button>
          </div>
        </div>
      </div>

      <!-- SUCCESS -->
      <div id="panel-success" class="hidden">
        <div class="success-anim">
          <div class="check-circle"><i class="ti ti-check" style="color:#5b3ff8;font-size:28px"></i></div>
          <p style="font-weight:600;font-size:15px;color:var(--color-text-primary);margin-bottom:6px" id="success-name">Тавтай морил!</p>
          <p style="font-size:13px;color:var(--color-text-secondary);margin-bottom:20px">Таны бүртгэл амжилттай үүслээ.</p>
          <button class="btn-primary" onclick="goHome()">Нүүр хуудас руу <i class="ti ti-arrow-right"></i></button>
        </div>
      </div>

    </div>
  </div>
</div>

<div style="text-align:center;padding:16px 0">
  <button onclick="toggleModal()" id="open-btn"
    style="padding:10px 24px;background:#5b3ff8;color:white;border:none;border-radius:50px;font-size:14px;font-weight:600;cursor:pointer">
    <i class="ti ti-login"></i> Modal нээх
  </button>
</div>

<script>
  let currentStep = 0;

  function toggleModal() {
    const ov = document.getElementById('overlay');
    ov.style.display = ov.style.display === 'none' ? 'flex' : 'none';
  }
  document.getElementById('overlay').style.display = 'none';

  function switchTab(t) {
    ['login','signup'].forEach(x => {
      document.getElementById('tab-'+x).classList.toggle('active', x===t);
      document.getElementById('panel-'+x).classList.toggle('hidden', x!==t);
    });
    document.getElementById('banner-sub').textContent = t==='login'
      ? 'Discover your campus'
      : 'Таны дижитал кампус нэгдэл';
  }

  function togglePw(id, btn) {
    const inp = document.getElementById(id);
    const showing = inp.type === 'text';
    inp.type = showing ? 'password' : 'text';
    btn.querySelector('i').className = showing ? 'ti ti-eye' : 'ti ti-eye-off';
  }

  function toggleInt(el) { el.classList.toggle('sel'); }

  function nextStep(n) {
    document.getElementById('step-'+currentStep).classList.add('hidden');
    currentStep = n;
    document.getElementById('step-'+n).classList.remove('hidden');
    [0,1,2].forEach(i => {
      const d = document.getElementById('dot'+i);
      d.classList.toggle('active', i===n);
    });
  }

  function doLogin() {
    const e = document.getElementById('login-email').value.trim();
    const p = document.getElementById('login-pw').value;
    if (!e || !p) { alert('И-мэйл болон нууц үгээ оруулна уу.'); return; }
    showSuccess('Тавтай морил!');
  }

  function doGoogle() { showSuccess('Google-ээр нэвтэрлээ!'); }

  function doRegister() {
    const name = document.getElementById('su-name').value.trim();
    showSuccess(name ? `Тавтай морил, ${name.split(' ')[0]}!` : 'Тавтай морил!');
  }

  function showSuccess(msg) {
    ['login','signup'].forEach(x => document.getElementById('panel-'+x).classList.add('hidden'));
    document.getElementById('panel-success').classList.remove('hidden');
    document.getElementById('success-name').textContent = msg;
    document.getElementById('banner-sub').textContent = '✓ Амжилттай нэвтэрлээ';
  }

  function goHome() {
    toggleModal();
    setTimeout(() => {
      document.getElementById('panel-success').classList.add('hidden');
      switchTab('login');
      document.getElementById('banner-sub').textContent = 'Discover your campus';
    }, 300);
  }
</script>*/
