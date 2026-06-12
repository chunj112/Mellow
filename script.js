const screens = document.querySelectorAll('.screen');
const navItems = document.querySelectorAll('.nav-item');
const goButtons = document.querySelectorAll('[data-screen]');
const appConfig = window.VIBECAPSULE_CONFIG || {};
const capsuleEnabled = false;
const accountEnabled = false;
const hasSupabaseConfig = Boolean(appConfig.supabaseUrl && appConfig.supabaseAnonKey && window.supabase);
const supabaseClient = hasSupabaseConfig
  ? window.supabase.createClient(appConfig.supabaseUrl, appConfig.supabaseAnonKey)
  : null;
const storageBucket = appConfig.storageBucket || 'capsule-media';
let currentUser = null;

function showScreen(name) {
  screens.forEach(screen => screen.classList.remove('active-screen'));
  const target = document.querySelector(`#screen-${name}`);
  if (target) target.classList.add('active-screen');
  navItems.forEach(item => item.classList.toggle('active', item.dataset.screen === name));
  if (name === 'test') resetQuiz(true);
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

goButtons.forEach(btn => btn.addEventListener('click', () => showScreen(btn.dataset.screen)));

const provinces = [
  'An Giang', 'Bà Rịa - Vũng Tàu', 'Bắc Giang', 'Bắc Kạn', 'Bạc Liêu', 'Bắc Ninh', 'Bến Tre',
  'Bình Định', 'Bình Dương', 'Bình Phước', 'Bình Thuận', 'Cà Mau', 'Cần Thơ', 'Cao Bằng',
  'Đà Nẵng', 'Đắk Lắk', 'Đắk Nông', 'Điện Biên', 'Đồng Nai', 'Đồng Tháp', 'Gia Lai',
  'Hà Giang', 'Hà Nam', 'Hà Nội', 'Hà Tĩnh', 'Hải Dương', 'Hải Phòng', 'Hậu Giang',
  'Hòa Bình', 'Hồ Chí Minh', 'Hưng Yên', 'Khánh Hòa', 'Kiên Giang', 'Kon Tum', 'Lai Châu',
  'Lâm Đồng', 'Lạng Sơn', 'Lào Cai', 'Long An', 'Nam Định', 'Nghệ An', 'Ninh Bình',
  'Ninh Thuận', 'Phú Thọ', 'Phú Yên', 'Quảng Bình', 'Quảng Nam', 'Quảng Ngãi', 'Quảng Ninh',
  'Quảng Trị', 'Sóc Trăng', 'Sơn La', 'Tây Ninh', 'Thái Bình', 'Thái Nguyên', 'Thanh Hóa',
  'Thừa Thiên Huế', 'Tiền Giang', 'Trà Vinh', 'Tuyên Quang', 'Vĩnh Long', 'Vĩnh Phúc', 'Yên Bái'
];

document.getElementById('province-list').innerHTML = provinces.map(name => `<option value="${name}"></option>`).join('');

const quizData = [
  {
    q: 'Bạn phát hiện người mình thích vẫn giữ liên lạc thân mật với người cũ nhưng nói "chỉ là bạn". Bạn làm gì?',
    options: [
      { text: 'Hỏi rõ ranh giới, nói điều mình cần để thấy an toàn, rồi quan sát hành động.', score: 3, flag: 'Green', reason: 'Bạn không né cảm xúc nhưng cũng không kiểm soát. Green flag vì đặt ranh giới bằng đối thoại và kiểm chứng bằng hành động.' },
      { text: 'Âm thầm theo dõi mạng xã hội của cả hai để tự tìm bằng chứng.', score: 0, flag: 'Red', reason: 'Red flag vì biến bất an thành kiểm soát ngầm. Nó làm bạn kiệt sức và dễ phá niềm tin trước khi có dữ kiện thật.' },
      { text: 'Tỏ ra ổn nhưng bắt đầu lạnh nhạt để họ tự hiểu.', score: 1, flag: 'Red', reason: 'Đây là phản ứng thụ động gây nhiễu. Bạn có nhu cầu thật nhưng lại truyền đạt bằng hình phạt cảm xúc.' },
      { text: 'Nói mình hơi lấn cấn và muốn hiểu vai trò của người cũ trong hiện tại.', score: 2, flag: 'Mixed', reason: 'Khá ổn vì bạn nói thật cảm giác. Điểm trừ là cần thêm ranh giới cụ thể để tránh cuộc nói chuyện trôi vào tranh cãi.' }
    ]
  },
  {
    q: 'Trong buổi hẹn, họ liên tục kiểm tra điện thoại vì công việc. Bạn phản ứng thế nào?',
    options: [
      { text: 'Mỉa mai nhẹ: "Chắc điện thoại hẹn hò vui hơn mình".', score: 1, flag: 'Red', reason: 'Câu nói nghe vui nhưng có gai. Red nhẹ vì dùng mỉa mai thay vì nói nhu cầu được hiện diện.' },
      { text: 'Hỏi họ có việc gấp không, nếu cần thì cho họ 10 phút xử lý rồi quay lại buổi hẹn.', score: 3, flag: 'Green', reason: 'Green flag vì bạn vừa tôn trọng thực tế của họ vừa bảo vệ chất lượng buổi hẹn.' },
      { text: 'Im lặng, tự đánh giá là họ không thích mình nữa.', score: 0, flag: 'Red', reason: 'Red flag ở chỗ bạn kết luận thay cho đối phương. Điều này dễ tạo drama từ một tín hiệu chưa đủ rõ.' },
      { text: 'Đổi chủ đề liên tục để kéo sự chú ý của họ về mình.', score: 2, flag: 'Mixed', reason: 'Có thiện chí giữ không khí nhưng hơi thiếu trực diện. Tốt hơn là hỏi nhẹ và thống nhất lại nhịp hẹn.' }
    ]
  },
  {
    q: 'Người ấy nói họ chưa sẵn sàng cho mối quan hệ rõ ràng, nhưng vẫn muốn gặp bạn đều. Bạn chọn gì?',
    options: [
      { text: 'Tiếp tục như cũ vì sợ nói nhu cầu sẽ mất họ.', score: 0, flag: 'Red', reason: 'Red flag với chính bạn: tự bỏ ranh giới để giữ kết nối mơ hồ thường dẫn tới tổn thương.' },
      { text: 'Nói rõ mình cần sự nghiêm túc đến mức nào và đặt thời điểm check-in lại.', score: 3, flag: 'Green', reason: 'Green flag vì bạn tôn trọng nhịp của họ nhưng không đánh mất nhu cầu của mình.' },
      { text: 'Đồng ý gặp nhưng cũng hẹn thêm người khác để cân bằng.', score: 1, flag: 'Mixed', reason: 'Không sai nếu minh bạch, nhưng nếu dùng để trả đũa hoặc né cảm xúc thì dễ thành red flag.' },
      { text: 'Đòi họ trả lời ngay hôm đó để khỏi mất thời gian.', score: 1, flag: 'Red', reason: 'Nhu cầu rõ ràng là tốt, nhưng ép quyết định ngay thường tạo áp lực và làm méo câu trả lời.' }
    ]
  },
  {
    q: 'Bạn thấy họ có một điểm khác biệt lớn về tiền bạc hoặc lối sống. Bạn sẽ?',
    options: [
      { text: 'Hỏi cách họ ưu tiên chi tiêu/sống, rồi chia sẻ cách của mình mà không phán xét.', score: 3, flag: 'Green', reason: 'Green flag vì bạn kiểm tra độ hợp bằng giá trị và thói quen, không biến khác biệt thành lỗi.' },
      { text: 'Bỏ qua vì mới đầu nói tiền bạc nghe thực dụng.', score: 1, flag: 'Mixed', reason: 'Mixed vì bạn giữ không khí nhẹ, nhưng né chủ đề quan trọng quá lâu có thể tạo kỳ vọng sai.' },
      { text: 'Tự nhủ yêu là phải chấp nhận hết.', score: 0, flag: 'Red', reason: 'Red flag vì lãng mạn hóa sự không tương thích. Chấp nhận không đồng nghĩa với bỏ qua mọi rủi ro.' },
      { text: 'Đùa về thói quen của họ để xem họ phản ứng ra sao.', score: 1, flag: 'Red', reason: 'Đùa để thử phản ứng dễ thành công kích mềm. Nó không giúp bạn hiểu sâu hơn.' }
    ]
  },
  {
    q: 'Sau một cuộc cãi nhau, họ nhắn "thôi bỏ đi". Bạn làm gì?',
    options: [
      { text: 'Tôn trọng tạm dừng, hẹn thời điểm nói lại khi cả hai bình tĩnh.', score: 3, flag: 'Green', reason: 'Green flag vì bạn không ép đối thoại trong lúc căng, nhưng vẫn giữ trách nhiệm quay lại xử lý.' },
      { text: 'Nhắn một tràng dài để giải thích ngay vì sợ hiểu lầm.', score: 1, flag: 'Mixed', reason: 'Ý định tốt nhưng thời điểm kém. Dồn thông tin khi họ đang đóng lại dễ làm căng hơn.' },
      { text: 'Cũng im luôn vài ngày để họ biết cảm giác.', score: 0, flag: 'Red', reason: 'Red flag vì biến im lặng thành trừng phạt. Vấn đề không được giải quyết, chỉ đổi sang chiến tranh lạnh.' },
      { text: 'Xin lỗi hết cho nhanh dù chưa rõ mình sai gì.', score: 1, flag: 'Red', reason: 'Tự nhận lỗi cho yên chuyện làm mất sự thật của bạn và tạo tiền lệ giao tiếp không lành mạnh.' }
    ]
  },
  {
    q: 'Họ chia sẻ một tổn thương cũ khá nặng. Câu trả lời nào tinh tế nhất?',
    options: [
      { text: 'Cảm ơn họ đã tin mình, hỏi họ muốn được lắng nghe hay muốn lời khuyên.', score: 3, flag: 'Green', reason: 'Green flag rất rõ: bạn không chiếm câu chuyện, không sửa họ, chỉ tạo không gian an toàn.' },
      { text: 'Kể ngay chuyện tương tự của mình để họ thấy không cô đơn.', score: 2, flag: 'Mixed', reason: 'Có thể giúp kết nối, nhưng nếu kể quá nhanh bạn sẽ vô tình kéo trọng tâm về mình.' },
      { text: 'Nói "ai rồi cũng vậy" để họ nhẹ lòng.', score: 0, flag: 'Red', reason: 'Red flag vì phủ phẳng nỗi đau. Câu này dễ làm họ thấy mình bị xem nhẹ.' },
      { text: 'Hỏi rất nhiều chi tiết để hiểu đúng câu chuyện.', score: 1, flag: 'Mixed', reason: 'Tò mò quá sâu có thể giống tra hỏi. Với tổn thương, quyền kiểm soát nhịp kể nên thuộc về họ.' }
    ]
  },
  {
    q: 'Bạn bắt đầu thích họ nhiều hơn họ thích bạn. Cách giữ mình tốt nhất là?',
    options: [
      { text: 'Tăng đầu tư để họ cảm động và thích lại mình.', score: 0, flag: 'Red', reason: 'Red flag vì biến tình cảm thành chiến dịch thuyết phục. Càng đầu tư lệch, bạn càng dễ mất tự trọng.' },
      { text: 'Giữ nhịp sống riêng, quan sát mức đáp lại và nói nhu cầu khi đủ rõ.', score: 3, flag: 'Green', reason: 'Green flag vì bạn có cảm xúc nhưng không để nó nuốt hết đời sống và ranh giới.' },
      { text: 'Giả vờ bớt quan tâm để họ sốt ruột.', score: 0, flag: 'Red', reason: 'Red flag vì thao túng nhịp quan tâm. Người hợp sẽ không cần bị kéo bằng trò tâm lý.' },
      { text: 'Nói thẳng mình thích họ và hỏi họ đang ở đâu trong kết nối này.', score: 2, flag: 'Green', reason: 'Khá green vì rõ ràng. Chỉ cần giữ kỳ vọng mềm, không biến câu hỏi thành tối hậu thư.' }
    ]
  }
];

let currentQuestion = 0;
let quizScore = 0;
let quizProfile = {};
let answerHistory = [];
let activeQuizData = [];

const quizProfileForm = document.getElementById('quiz-profile');
const quizNumber = document.getElementById('quiz-number');
const quizScoreLabel = document.getElementById('quiz-score-label');
const quizProgress = document.getElementById('quiz-progress');
const quizQuestion = document.getElementById('quiz-question');
const quizOptions = document.getElementById('quiz-options');
const quizBox = document.getElementById('quiz-box');
const resultBox = document.getElementById('result-box');
const resultBadge = document.getElementById('result-badge');
const resultTitle = document.getElementById('result-title');
const resultDesc = document.getElementById('result-desc');
const restartQuiz = document.getElementById('restart-quiz');
const profileName = document.getElementById('profile-name');
const profileSubtitle = document.getElementById('profile-subtitle');
const profileAvatar = document.querySelector('.profile-avatar');
const authStatus = document.getElementById('auth-status');
const syncModeNote = document.getElementById('sync-mode-note');
const authName = document.getElementById('auth-name');
const authEmail = document.getElementById('auth-email');
const authPassword = document.getElementById('auth-password');
const loginBtn = document.getElementById('login-btn');
const signupBtn = document.getElementById('signup-btn');
const logoutBtn = document.getElementById('logout-btn');

async function initializeAuth() {
  if (!accountEnabled || !hasSupabaseConfig) {
    updateAuthUi();
    if (capsuleEnabled) await renderCapsules();
    return;
  }

  const { data } = await supabaseClient.auth.getSession();
  currentUser = data.session?.user || null;
  updateAuthUi();
  if (capsuleEnabled) await renderCapsules();

  supabaseClient.auth.onAuthStateChange(async (_event, session) => {
    currentUser = session?.user || null;
    updateAuthUi();
    if (capsuleEnabled) await renderCapsules();
  });
}

function updateAuthUi() {
  if (!accountEnabled) return;
  const displayName = currentUser?.user_metadata?.display_name || currentUser?.email?.split('@')[0] || 'Guest';
  if (profileName) profileName.textContent = displayName;
  if (profileAvatar) profileAvatar.textContent = displayName.charAt(0).toUpperCase();
  if (profileSubtitle) {
    profileSubtitle.textContent = currentUser
      ? `${currentUser.email} · cloud sync`
      : hasSupabaseConfig
        ? 'Chưa đăng nhập · cloud đã sẵn sàng'
        : 'Local mode · chưa cấu hình Supabase';
  }
  if (authStatus) authStatus.textContent = currentUser ? 'Cloud' : hasSupabaseConfig ? 'Ready' : 'Local';
  if (syncModeNote) {
    syncModeNote.textContent = !capsuleEnabled
      ? 'Bản static GitHub Pages chưa bật lưu trữ Capsule. Account/cloud sẽ làm ở giai đoạn sau.'
      : currentUser
      ? 'Capsule mới sẽ được lưu vào Supabase database và storage.'
      : hasSupabaseConfig
        ? 'Đăng nhập hoặc tạo account để lưu capsule thật sự trên cloud.'
        : 'Điền Supabase URL và anon key trong config.js để bật account thật.';
  }
  if (authName) authName.value = currentUser?.user_metadata?.display_name || '';
  if (authEmail) authEmail.value = currentUser?.email || '';
  loginBtn?.classList.toggle('d-none', Boolean(currentUser));
  signupBtn?.classList.toggle('d-none', Boolean(currentUser));
  logoutBtn?.classList.toggle('d-none', !currentUser);
}

async function handleLogin() {
  if (!ensureSupabaseReady()) return;
  const email = authEmail.value.trim();
  const password = authPassword.value;
  if (!email || !password) return alert('Nhập email và mật khẩu để đăng nhập.');
  const { error } = await supabaseClient.auth.signInWithPassword({ email, password });
  if (error) return alert(error.message);
  authPassword.value = '';
}

async function handleSignup() {
  if (!ensureSupabaseReady()) return;
  const email = authEmail.value.trim();
  const password = authPassword.value;
  const displayName = authName.value.trim() || email.split('@')[0];
  if (!email || !password) return alert('Nhập email và mật khẩu để tạo account.');
  const { data, error } = await supabaseClient.auth.signUp({
    email,
    password,
    options: { data: { display_name: displayName } }
  });
  if (error) return alert(error.message);
  if (data.user) await upsertProfile(data.user.id, displayName);
  authPassword.value = '';
  alert('Account đã được tạo. Nếu Supabase bật email confirmation, hãy kiểm tra email để xác nhận.');
}

async function handleLogout() {
  if (!ensureSupabaseReady()) return;
  await supabaseClient.auth.signOut();
}

async function upsertProfile(userId, displayName) {
  if (!hasSupabaseConfig || !userId) return;
  await supabaseClient.from('profiles').upsert({ id: userId, display_name: displayName });
}

function ensureSupabaseReady() {
  if (hasSupabaseConfig) return true;
  alert('Chưa cấu hình Supabase. Hãy điền supabaseUrl và supabaseAnonKey trong config.js.');
  return false;
}

loginBtn?.addEventListener('click', handleLogin);
signupBtn?.addEventListener('click', handleSignup);
logoutBtn?.addEventListener('click', handleLogout);

quizProfileForm.addEventListener('submit', event => {
  event.preventDefault();
  quizProfile = {
    birthDate: document.getElementById('birth-date').value,
    gender: document.getElementById('quiz-gender').value
  };
  startQuizSession();
  quizProfileForm.classList.add('d-none');
  resultBox.classList.add('d-none');
  quizBox.classList.remove('d-none');
  renderQuiz();
});

function renderQuiz() {
  const item = activeQuizData[currentQuestion];
  quizNumber.textContent = currentQuestion + 1;
  quizScoreLabel.textContent = `${quizScore} vibe`;
  quizProgress.style.width = `${((currentQuestion + 1) / activeQuizData.length) * 100}%`;
  quizQuestion.textContent = item.q;
  quizOptions.innerHTML = '';

  item.options.forEach(option => {
    const btn = document.createElement('button');
    btn.textContent = option.text;
    btn.addEventListener('click', () => {
      quizScore += option.score;
      answerHistory.push({ question: item.q, answer: option.text, flag: option.flag, reason: option.reason, score: option.score });
      currentQuestion++;
      if (currentQuestion < activeQuizData.length) renderQuiz();
      else showResult();
    });
    quizOptions.appendChild(btn);
  });
}

function showResult() {
  quizBox.classList.add('d-none');
  resultBox.classList.remove('d-none');

  const maxScore = activeQuizData.length * 3;
  const percent = Math.round((quizScore / maxScore) * 100);
  const zodiac = getZodiac(quizProfile.birthDate);
  resultBadge.textContent = `${percent}%`;

  if (percent >= 78) {
    resultTitle.textContent = 'Green Flag có chiều sâu';
    resultDesc.textContent = 'Bạn có xu hướng nói thẳng, giữ ranh giới và không dùng cảm xúc để điều khiển người khác.';
  } else if (percent >= 50) {
    resultTitle.textContent = 'Mixed Flag cần tinh chỉnh';
    resultDesc.textContent = 'Bạn có nhiều ý tốt, nhưng đôi lúc né tránh, thử lòng hoặc phản ứng nhanh khi bất an.';
  } else {
    resultTitle.textContent = 'Red Flag cần luyện lại nhịp yêu';
    resultDesc.textContent = 'Bạn dễ để nỗi sợ dẫn đường. Bài test gợi ý bạn nên luyện giao tiếp rõ ràng và tự giữ giá trị của mình.';
  }

  document.getElementById('zodiac-note').innerHTML = `
    <strong>${escapeHtml(quizProfile.gender)} · ${zodiac.name}</strong><br>
    ${zodiac.note} Cung hoàng đạo chỉ là lớp tham khảo vui, phần quan trọng vẫn là lựa chọn và hành động của bạn.
  `;

  document.getElementById('answer-review').innerHTML = answerHistory.map((item, index) => `
    <article class="review-item">
      <h4>Câu ${index + 1}: ${escapeHtml(item.flag)} flag</h4>
      <p><strong>Bạn chọn:</strong> ${escapeHtml(item.answer)}</p>
      <p>${escapeHtml(item.reason)}</p>
    </article>
  `).join('');
}

restartQuiz.addEventListener('click', () => {
  resetQuiz(true);
});

function startQuizSession() {
  currentQuestion = 0;
  quizScore = 0;
  answerHistory = [];
  activeQuizData = shuffleArray(quizData).map(item => ({
    ...item,
    options: shuffleArray(item.options)
  }));
}

function resetQuiz(clearProfile = false) {
  startQuizSession();
  resultBox.classList.add('d-none');
  quizBox.classList.add('d-none');
  quizProfileForm.classList.remove('d-none');
  if (clearProfile) {
    quizProfile = {};
    quizProfileForm.reset();
  }
}

function shuffleArray(items) {
  return [...items]
    .map(item => ({ item, sort: Math.random() }))
    .sort((a, b) => a.sort - b.sort)
    .map(({ item }) => item);
}

function getZodiac(value) {
  const date = new Date(value);
  const day = date.getDate();
  const month = date.getMonth() + 1;
  const signs = [
    ['Ma Kết', 1, 19, 'Bạn thường cần sự chắc chắn trước khi mở lòng, nên điểm mạnh là trách nhiệm nhưng dễ tự gồng.'],
    ['Bảo Bình', 2, 18, 'Bạn thích tự do và sự độc đáo, nên cần người tôn trọng không gian riêng.'],
    ['Song Ngư', 3, 20, 'Bạn nhạy cảm và giàu tưởng tượng, nên cần học cách phân biệt trực giác với suy diễn.'],
    ['Bạch Dương', 4, 19, 'Bạn phản ứng nhanh và chủ động, điểm cần luyện là chậm lại trước khi kết luận.'],
    ['Kim Ngưu', 5, 20, 'Bạn coi trọng ổn định, nhưng đôi lúc dễ bám vào sự quen thuộc hơn là sự phù hợp.'],
    ['Song Tử', 6, 20, 'Bạn giao tiếp tốt, nhưng cần tránh dùng sự lanh lợi để né cảm xúc thật.'],
    ['Cự Giải', 7, 22, 'Bạn giàu chăm sóc, điểm cần giữ là đừng biến quan tâm thành kiểm soát.'],
    ['Sư Tử', 8, 22, 'Bạn ấm áp và tự trọng cao, nhưng nên tách nhu cầu được công nhận khỏi tình yêu.'],
    ['Xử Nữ', 9, 22, 'Bạn tinh tế với chi tiết, cần tránh soi lỗi quá sớm khi chưa hiểu toàn cảnh.'],
    ['Thiên Bình', 10, 22, 'Bạn giỏi giữ hòa khí, nhưng đừng vì sợ mất cân bằng mà né cuộc nói chuyện khó.'],
    ['Bọ Cạp', 11, 21, 'Bạn sâu sắc và mãnh liệt, nên luyện nói thẳng nỗi bất an thay vì thử lòng.'],
    ['Nhân Mã', 12, 21, 'Bạn thích sự thoáng và thành thật, cần để ý cảm xúc người khác khi nói quá nhanh.'],
    ['Ma Kết', 12, 31, 'Bạn thường cần sự chắc chắn trước khi mở lòng, nên điểm mạnh là trách nhiệm nhưng dễ tự gồng.']
  ];
  const found = signs.find(([, m, d]) => month === m && day <= d);
  return { name: found[0], note: found[3] };
}

const dateForm = document.getElementById('date-form');
const dateResult = document.getElementById('date-result');
const partnerDesc = document.getElementById('partner-desc');
const statPlans = document.getElementById('stat-plans');
const dateHistoryList = document.getElementById('date-history-list');
const dateHistoryCount = document.getElementById('date-history-count');
let activeGoal = 'Nhắn tin mở đầu';

document.querySelectorAll('#date-goals button').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('#date-goals button').forEach(item => item.classList.remove('active'));
    btn.classList.add('active');
    activeGoal = btn.dataset.goal;
    if (dateForm.dataset.hasPlan === 'true') dateForm.requestSubmit();
  });
});

document.querySelectorAll('#desc-suggestions button').forEach(btn => {
  btn.addEventListener('click', () => {
    partnerDesc.value = btn.textContent;
    partnerDesc.focus();
  });
});

dateForm.addEventListener('submit', event => {
  event.preventDefault();
  const profile = {
    userGender: getValue('user-gender'),
    userAge: Number(getValue('user-age')),
    userJob: getValue('user-job'),
    userLocation: getValue('user-location'),
    partnerGender: getValue('partner-gender'),
    partnerAge: Number(getValue('partner-age')),
    partnerJob: getValue('partner-job'),
    partnerLocation: getValue('partner-location'),
    partnerDesc: getValue('partner-desc'),
    goal: activeGoal
  };
  const generatedPlan = buildDetailedPlan(profile);
  renderDatePlan(profile, generatedPlan);
  saveDatePlanHistory(profile, generatedPlan);
  dateForm.dataset.hasPlan = 'true';
  const count = Number(localStorage.getItem('datePlanCount') || 0) + 1;
  localStorage.setItem('datePlanCount', String(count));
  renderPlanCount();
  renderDateHistory();
});

function getValue(id) {
  return document.getElementById(id).value.trim();
}

const goalPlans = {
  'Nhắn tin mở đầu': {
    intent: 'Mở bằng câu ngắn, có móc nối cá nhân và dễ trả lời trong 30 giây.',
    topics: ['một chi tiết trong bio/story gần đây', 'gu đồ uống hoặc địa điểm ở cùng tỉnh/thành', 'một lựa chọn vui giữa hai phương án', 'nhịp làm việc/học tập hôm nay'],
    questions: [
      'Nếu hôm nay phải chọn một mood cho ngày của bạn, nó sẽ là chill, bận hay hơi cần cà phê?',
      'Mình thấy bạn có vibe khá biết tận hưởng. Dạo này có chỗ nào bạn thấy đáng ghé không?',
      'Bạn thường thích người mở đầu thẳng vào chuyện hay vòng qua một câu vui trước?'
    ],
    flirts: [
      'Mình định mở đầu thật ngầu, nhưng thôi, nói thật là profile bạn làm mình hơi tò mò.',
      'Bạn có vẻ thuộc kiểu người khiến một câu hỏi bình thường cũng đáng để rep kỹ hơn.'
    ],
    actions: ['Gửi một tin duy nhất, đừng bắn chuỗi 3-4 tin.', 'Nếu họ rep ngắn, hỏi tiếp nhẹ bằng một lựa chọn A/B.', 'Sau 4-5 lượt, hãy tự chia sẻ một mẩu chuyện để cân bằng.']
  },
  'Đi cafe lần đầu': {
    intent: 'Tạo buổi gặp nhẹ, ít áp lực, có đường lui lịch sự nếu chưa hợp.',
    topics: ['quán dễ nói chuyện ở khu trung tâm', 'gu cà phê/trà/sinh tố', 'một câu chuyện vui trong tuần', 'kế hoạch ngắn sau buổi hẹn'],
    questions: [
      'Bạn thích quán yên tĩnh để nói chuyện hay quán có vibe nhộn nhẹ?',
      'Có món nào bạn gọi gần như mặc định mỗi khi đi cafe không?',
      'Nếu buổi hẹn chỉ có 60 phút, bạn muốn nó vui, sâu hay thoải mái là chính?'
    ],
    flirts: [
      'Mình chọn quán không quá ồn, vì nói chuyện với bạn chắc không nên để âm nhạc giành spotlight.',
      'Nếu hợp vibe, ly đầu mình mời. Nếu chưa hợp, coi như mình có thêm một review quán rất chân thật.'
    ],
    actions: ['Đề xuất 2 khung giờ rõ ràng.', 'Đến sớm 5 phút và chọn chỗ không quá sát người lạ.', 'Kết thúc bằng câu rõ ràng: "Hôm nay mình thấy vui, lần sau mình thử chỗ khác nhé?"']
  },
  'Nói với crush': {
    intent: 'Tỏ tín hiệu rõ nhưng không đặt đối phương vào thế phải trả lời ngay.',
    topics: ['điều khiến bạn có thiện cảm', 'khoảnh khắc hai người nói chuyện hợp', 'ranh giới nếu họ chưa sẵn sàng', 'một lời mời nhỏ để kiểm tra vibe'],
    questions: [
      'Có lúc nào bạn thấy tụi mình nói chuyện khá hợp không, hay chỉ mình hơi ảo tưởng nhẹ?',
      'Nếu một người thích bạn, bạn thích họ nói thẳng hay thể hiện từ từ?',
      'Bạn có thoải mái nếu mình rủ bạn đi riêng một buổi đúng nghĩa hơn không?'
    ],
    flirts: [
      'Mình không định làm mọi thứ nghiêm trọng, chỉ là dạo này nói chuyện với bạn làm ngày mình sáng hơn một chút.',
      'Bạn nguy hiểm thật, xuất hiện vừa đủ để mình phải cân nhắc chuyện can đảm.'
    ],
    actions: ['Nói bằng câu "mình cảm thấy" thay vì "bạn làm mình".', 'Cho họ quyền từ chối mà không mất mặt.', 'Nếu họ chưa rõ, hẹn check-in lại thay vì ép câu trả lời.']
  },
  'Voice call': {
    intent: 'Giữ nhịp gọi ấm, không hỏi dồn, có điểm kết thúc đẹp.',
    topics: ['một chuyện vui trong ngày', 'playlist hoặc phim gần đây', 'thói quen buổi tối', 'kế hoạch cuối tuần'],
    questions: [
      'Giọng bạn ngoài đời có giống cách bạn nhắn tin không?',
      'Hôm nay có chuyện gì nhỏ nhưng đáng kể không?',
      'Bạn thích call ngắn mà vui hay call dài rồi mỗi người làm việc riêng?'
    ],
    flirts: [
      'Mình chỉ định call 10 phút, nhưng nếu câu chuyện ổn quá thì lỗi thuộc về vibe của bạn.',
      'Giọng bạn nghe khá hợp với khung giờ này, nguy hiểm ở mức vừa phải.'
    ],
    actions: ['Hẹn thời lượng trước: 10-15 phút.', 'Nói chậm hơn nhắn tin và để khoảng lặng tự nhiên.', 'Kết bằng một câu ấm: "Mình thích nhịp nói chuyện này, hôm khác call tiếp nhé."']
  }
};

function getAgeTone(userAge, partnerAge) {
  const avg = (userAge + partnerAge) / 2;
  if (avg < 22) return 'vui, nhẹ, ít áp lực và tránh hỏi quá đời tư ngay đầu';
  if (avg < 30) return 'tự nhiên, có chiều sâu vừa đủ và tôn trọng lịch bận';
  if (avg < 40) return 'rõ ý, tinh tế, ưu tiên sự ổn định và chủ động';
  return 'chín chắn, lịch sự, tập trung vào giá trị sống và sự thoải mái';
}

function buildDetailedPlan(profile) {
  const plan = goalPlans[profile.goal];
  const sameCity = profile.userLocation === profile.partnerLocation;
  const locationLine = sameCity
    ? `Hai người cùng ở ${profile.userLocation}, nên có thể dùng chủ đề địa điểm thật để kéo cuộc trò chuyện ra đời thực.`
    : `Hai người ở ${profile.userLocation} và ${profile.partnerLocation}, nên khai thác khác biệt nhịp sống nhưng tránh biến nó thành phỏng vấn địa lý.`;
  const tone = getAgeTone(profile.userAge, profile.partnerAge);
  const ageGap = Math.abs(profile.userAge - profile.partnerAge);
  const partnerHook = profile.partnerDesc.split(/[,.]/)[0].trim() || 'một chi tiết riêng của partner';
  const contextBank = {
    'Nhắn tin mở đầu': ['mới match/chưa thân', 'đã biết nhau qua bạn chung', 'thấy story thú vị nhưng chưa nói chuyện nhiều', 'muốn nối lại sau vài ngày im lặng'],
    'Đi cafe lần đầu': ['gặp lần đầu ngoài đời', 'đã nhắn vài ngày và muốn kiểm tra vibe thật', 'hai người cùng bận nên chỉ có 60-90 phút', 'muốn buổi hẹn nhẹ, không quá nghiêm túc'],
    'Nói với crush': ['đã thân nhưng chưa rõ tín hiệu', 'có cảm giác hai người đang mập mờ', 'muốn chuyển từ nói chuyện vui sang nghiêm túc hơn', 'sợ nói ra sẽ làm mất sự tự nhiên'],
    'Voice call': ['hai người nhắn ổn nhưng chưa từng call', 'muốn chuyển từ text sang giọng nói', 'đối phương bận nên cần call ngắn', 'muốn call để làm dịu một hiểu lầm nhỏ']
  };
  const avoidBank = {
    'Nhắn tin mở đầu': ['mở đầu bằng câu quá chung như "đang làm gì đó"', 'khen ngoại hình quá trực diện ngay câu đầu', 'hỏi liên tục khi họ chưa kịp trả lời'],
    'Đi cafe lần đầu': ['chọn quán quá ồn hoặc quá riêng tư', 'kéo dài buổi hẹn khi đối phương đã mệt', 'biến buổi hẹn thành phỏng vấn thành tích'],
    'Nói với crush': ['tỏ tình như một tối hậu thư', 'đòi họ trả lời ngay lập tức', 'dùng ghen tuông để kiểm tra họ có thích mình không'],
    'Voice call': ['call bất ngờ khi chưa hỏi trước', 'để im lặng quá lâu rồi xin lỗi liên tục', 'hỏi chuyện quá sâu khi giọng họ đang mệt']
  };
  const context = pickOne(contextBank[profile.goal]);
  const ageLine = ageGap >= 5
    ? `Chênh lệch ${ageGap} tuổi, nên ưu tiên câu rõ ý, tránh dùng meme hoặc cách nói quá nội bộ khi chưa chắc đối phương bắt nhịp.`
    : 'Hai độ tuổi khá gần nhau, có thể dùng chủ đề đời sống gần và phản ứng tự nhiên hơn.';
  const topics = [
    ...pickMany(plan.topics, 3),
    `một chi tiết từ mô tả partner: ${partnerHook}`,
    sameCity
      ? `một địa điểm nhẹ ở ${profile.userLocation} mà hai người đều dễ thử`
      : `một khác biệt thú vị giữa ${profile.userLocation} và ${profile.partnerLocation}`
  ];
  const questions = [
    ...pickMany(plan.questions, 3),
    `Với nhịp công việc ${profile.partnerJob}, điều gì làm bạn thấy một cuộc trò chuyện đáng để tiếp tục?`,
    `Nếu một người ${profile.userJob} muốn hiểu hơn về thế giới của ${profile.partnerJob}, nên bắt đầu từ đâu cho tự nhiên?`
  ];
  const flirts = [
    ...pickMany(plan.flirts, 2),
    `Mình thấy chi tiết "${partnerHook}" khá hay, kiểu làm người ta muốn hỏi thêm nhưng vẫn phải giữ bình tĩnh.`,
    'Nói chuyện với bạn có cảm giác không cần cố diễn, vậy là hơi hiếm.'
  ];
  const actions = [
    ...pickMany(plan.actions, 3),
    `Nhắc lại đúng một chi tiết "${partnerHook}" để đối phương thấy bạn lắng nghe thật.`,
    'Sau một câu hỏi sâu, chuyển về một câu nhẹ để cuộc trò chuyện không bị nặng.'
  ];

  return {
    intent: plan.intent,
    context,
    tone,
    locationLine,
    ageLine,
    topics,
    questions,
    flirts,
    actions,
    scenarioSteps: [
      `Mở bằng một tín hiệu nhẹ liên quan tới ${partnerHook}, không khen quá đà.`,
      `Dẫn sang một câu hỏi mở phù hợp với ${profile.partnerJob} hoặc nhịp sống ở ${profile.partnerLocation}.`,
      'Kết phiên bằng một lời hẹn hoặc đề xuất nhỏ, để họ có quyền chọn tiếp tục mà không thấy bị ép.'
    ],
    avoid: pickMany(avoidBank[profile.goal], 3)
  };
}

function renderDatePlan(profile, generatedPlan = buildDetailedPlan(profile)) {
  const plan = generatedPlan;
  dateResult.innerHTML = `
    <article class="coach-card">
      <div class="coach-head">
        <div>
          <span class="pill-label dark">${escapeHtml(profile.goal)}</span>
          <h3>Plan riêng cho mục tiêu: ${escapeHtml(profile.goal)}</h3>
          <p>${escapeHtml(profile.userJob)} ${profile.userAge} tuổi · Partner ${escapeHtml(profile.partnerJob)} ${profile.partnerAge} tuổi</p>
        </div>
        <div class="coach-score">Fit<br><strong>92%</strong></div>
      </div>
      <div class="insight-box">
        <strong>Ngữ cảnh chính:</strong> ${escapeHtml(plan.context)}<br>
        <strong>Nhịp nên dùng:</strong> ${escapeHtml(plan.tone)}. ${escapeHtml(plan.locationLine)} ${escapeHtml(plan.ageLine)} Mục tiêu chính: ${escapeHtml(plan.intent)}
      </div>
    </article>
    <div class="coach-grid">
      ${renderAdviceBlock('Chủ đề hợp lý', 'bi-journal-text', plan.topics)}
      ${renderAdviceBlock('Câu hỏi nên dùng', 'bi-question-circle', plan.questions)}
      ${renderAdviceBlock('Thả thính hài nhưng không sến', 'bi-emoji-smile', plan.flirts)}
      ${renderAdviceBlock('Hành động tinh tế', 'bi-hand-thumbs-up', plan.actions)}
      ${renderAdviceBlock('Kịch bản 3 bước', 'bi-signpost-split', plan.scenarioSteps)}
      ${renderAdviceBlock('Nên tránh', 'bi-shield-exclamation', plan.avoid)}
    </div>
  `;
}

function getDatePlanHistory() {
  const saved = localStorage.getItem('datePlanHistory');
  return saved ? JSON.parse(saved) : [];
}

function saveDatePlanHistory(profile, generatedPlan) {
  const history = getDatePlanHistory();
  const record = {
    id: createId(),
    createdAt: new Date().toISOString(),
    profile,
    generatedPlan
  };
  history.unshift(record);
  localStorage.setItem('datePlanHistory', JSON.stringify(history.slice(0, 20)));
}

function renderDateHistory() {
  const history = getDatePlanHistory();
  if (!dateHistoryList || !dateHistoryCount) return;
  dateHistoryCount.textContent = `${history.length} plan`;

  if (!history.length) {
    dateHistoryList.innerHTML = emptyState('Chưa có plan nào.');
    return;
  }

  dateHistoryList.innerHTML = history.map(item => {
    const profile = item.profile;
    return `
      <article class="history-item" data-plan-id="${item.id}" tabindex="0" role="button" aria-label="Mở lại plan ${escapeHtml(profile.goal)}">
        <div class="history-icon"><i class="bi bi-clock-history"></i></div>
        <div>
          <h4>${escapeHtml(profile.goal)}</h4>
          <p>${escapeHtml(profile.userJob)} · ${escapeHtml(profile.partnerJob)} · ${formatDateTime(item.createdAt)}</p>
        </div>
        <button class="history-open-btn" data-plan-id="${item.id}">Mở lại</button>
      </article>
    `;
  }).join('');

  dateHistoryList.querySelectorAll('.history-item').forEach(card => {
    const openSavedPlan = () => {
      const item = getDatePlanHistory().find(plan => plan.id === card.dataset.planId);
      if (!item) return;
      fillDateForm(item.profile);
      renderDatePlan(item.profile, item.generatedPlan);
      dateForm.dataset.hasPlan = 'true';
      dateResult.scrollIntoView({ behavior: 'smooth', block: 'start' });
    };
    card.addEventListener('click', openSavedPlan);
    card.addEventListener('keydown', event => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        openSavedPlan();
      }
    });
  });
}

function fillDateForm(profile) {
  const fields = {
    'user-gender': profile.userGender,
    'user-age': profile.userAge,
    'user-job': profile.userJob,
    'user-location': profile.userLocation,
    'partner-gender': profile.partnerGender,
    'partner-age': profile.partnerAge,
    'partner-job': profile.partnerJob,
    'partner-location': profile.partnerLocation,
    'partner-desc': profile.partnerDesc
  };
  Object.entries(fields).forEach(([id, value]) => {
    const field = document.getElementById(id);
    if (field) field.value = value;
  });
  activeGoal = profile.goal;
  document.querySelectorAll('#date-goals button').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.goal === activeGoal);
  });
}

function formatDateTime(value) {
  return new Date(value).toLocaleString('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
}

function renderAdviceBlock(title, icon, items) {
  return `
    <article class="advice-card">
      <h3><i class="bi ${icon}"></i>${title}</h3>
      <ul>${items.map(item => `<li>${escapeHtml(item)}</li>`).join('')}</ul>
    </article>
  `;
}

function pickOne(items) {
  return items[Math.floor(Math.random() * items.length)];
}

function pickMany(items, count) {
  return shuffleArray(items).slice(0, Math.min(count, items.length));
}

function createId() {
  return globalThis.crypto?.randomUUID ? crypto.randomUUID() : `capsule-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

const defaultCapsules = [
  { id: createId(), title: 'Gửi tôi của 1 năm sau', message: 'Nhớ kiểm tra xem mình đã tốt hơn chưa.', date: '2027-01-01' },
  { id: createId(), title: 'Ký ức nhóm bạn', message: 'Mở lại khi tụi mình tốt nghiệp.', date: '2027-06-20' }
];

function getCapsules() {
  const saved = localStorage.getItem('vibecapsules');
  if (!saved) return defaultCapsules;
  const rawItems = JSON.parse(saved);
  const needsMigration = rawItems.some(item => !item.id || item.privacy);
  const items = rawItems.map(item => ({
    ...item,
    id: item.id || createId(),
    privacy: undefined
  }));
  if (needsMigration) saveCapsules(items);
  return items;
}

function saveCapsules(items) {
  localStorage.setItem('vibecapsules', JSON.stringify(items));
}

function shouldUseCloudCapsules() {
  return Boolean(hasSupabaseConfig && currentUser);
}

async function loadCapsules() {
  if (!shouldUseCloudCapsules()) {
    if (hasSupabaseConfig && !currentUser) return [];
    return getCapsules();
  }

  const { data, error } = await supabaseClient
    .from('capsules')
    .select('id,title,message,open_date,media_path,media_name,media_type,created_at')
    .order('created_at', { ascending: false });

  if (error) {
    alert(error.message);
    return [];
  }

  return data.map(item => ({
    id: item.id,
    title: item.title,
    message: item.message,
    date: item.open_date,
    mediaPath: item.media_path,
    mediaName: item.media_name,
    mediaType: item.media_type,
    createdAt: item.created_at
  }));
}

async function saveCloudMedia(id, file) {
  if (!file || !currentUser) return null;
  const safeName = file.name.replace(/[^\w.\-]+/g, '-');
  const path = `${currentUser.id}/${id}-${safeName}`;
  const { error } = await supabaseClient.storage
    .from(storageBucket)
    .upload(path, file, { upsert: true, contentType: file.type });
  if (error) throw error;
  return { path, name: file.name, type: file.type };
}

async function createCloudCapsule({ id, title, message, date, file }) {
  const mediaMeta = await saveCloudMedia(id, file);
  const { error } = await supabaseClient.from('capsules').insert({
    id,
    user_id: currentUser.id,
    title,
    message,
    open_date: date,
    media_path: mediaMeta?.path || null,
    media_name: mediaMeta?.name || null,
    media_type: mediaMeta?.type || null
  });
  if (error) throw error;
}

async function getCloudMediaUrl(path) {
  if (!path) return '';
  const { data, error } = await supabaseClient.storage
    .from(storageBucket)
    .createSignedUrl(path, 60 * 60);
  if (error) {
    alert(error.message);
    return '';
  }
  return data.signedUrl;
}

function openMediaDb() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open('vibecapsule-media', 1);
    request.onupgradeneeded = () => request.result.createObjectStore('media', { keyPath: 'id' });
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

async function saveMedia(id, file) {
  if (!file) return null;
  const db = await openMediaDb();
  return new Promise((resolve, reject) => {
    const tx = db.transaction('media', 'readwrite');
    tx.objectStore('media').put({ id, blob: file, type: file.type, name: file.name });
    tx.oncomplete = () => resolve({ type: file.type, name: file.name });
    tx.onerror = () => reject(tx.error);
  });
}

async function getMedia(id) {
  const db = await openMediaDb();
  return new Promise((resolve, reject) => {
    const tx = db.transaction('media', 'readonly');
    const request = tx.objectStore('media').get(id);
    request.onsuccess = () => resolve(request.result || null);
    request.onerror = () => reject(request.error);
  });
}

async function getVideoDuration(file) {
  return new Promise((resolve, reject) => {
    const video = document.createElement('video');
    const url = URL.createObjectURL(file);
    video.preload = 'metadata';
    video.onloadedmetadata = () => {
      URL.revokeObjectURL(url);
      resolve(video.duration);
    };
    video.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error('Không đọc được thời lượng video.'));
    };
    video.src = url;
  });
}

async function renderCapsules() {
  if (!capsuleEnabled) return;
  const items = await loadCapsules();
  const statCapsules = document.getElementById('stat-capsules');
  if (statCapsules) statCapsules.textContent = items.length;
  const emptyText = hasSupabaseConfig && !currentUser
    ? 'Đăng nhập để xem capsule cloud.'
    : 'Chưa có capsule nào.';
  const html = items.map(item => {
    const isOpen = canOpen(item.date);
    return `
      <article class="capsule-item">
        <div class="capsule-lock"><i class="bi ${isOpen ? 'bi-unlock-fill' : 'bi-lock-fill'}"></i></div>
        <div>
          <h4>${escapeHtml(item.title)}</h4>
          <p>Mở ngày ${formatDate(item.date)}${item.mediaName ? ` · ${escapeHtml(item.mediaName)}` : ''}</p>
        </div>
        <button class="capsule-open-btn" data-capsule-id="${item.id}" ${isOpen ? '' : 'disabled'}>
          ${isOpen ? 'Mở' : 'Đang khóa'}
        </button>
      </article>
    `;
  }).join('') || emptyState(emptyText);

  const capsuleList = document.getElementById('capsule-list');
  const homeCapsuleList = document.getElementById('home-capsule-list');
  if (capsuleList) capsuleList.innerHTML = html;
  if (homeCapsuleList) homeCapsuleList.innerHTML = html;
  document.querySelectorAll('.capsule-open-btn:not([disabled])').forEach(btn => {
    btn.addEventListener('click', () => openCapsule(btn.dataset.capsuleId));
  });
}

function canOpen(dateValue) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const openDate = parseLocalDate(dateValue);
  openDate.setHours(0, 0, 0, 0);
  return openDate <= today;
}

async function openCapsule(id) {
  const item = (await loadCapsules()).find(capsule => capsule.id === id);
  if (!item || !canOpen(item.date)) return;
  showScreen('capsule');
  let mediaUrl = '';
  let mediaType = item.mediaType || '';
  let mediaName = item.mediaName || '';

  if (shouldUseCloudCapsules()) {
    mediaUrl = await getCloudMediaUrl(item.mediaPath);
  } else {
    const media = await getMedia(id);
    mediaUrl = media ? URL.createObjectURL(media.blob) : '';
    mediaType = media?.type || '';
    mediaName = media?.name || '';
  }

  const mediaHtml = !mediaUrl ? '' : mediaType.startsWith('video/')
    ? `<video controls src="${mediaUrl}"></video>`
    : `<img src="${mediaUrl}" alt="${escapeHtml(mediaName)}" />`;

  const viewer = document.getElementById('capsule-viewer');
  viewer.classList.remove('d-none');
  viewer.innerHTML = `
    <article class="coach-card">
      <span class="pill-label dark">Đã mở</span>
      <h3>${escapeHtml(item.title)}</h3>
      <p>${escapeHtml(item.message)}</p>
      ${mediaHtml}
    </article>
  `;
  viewer.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

document.getElementById('capsule-form')?.addEventListener('submit', async event => {
  event.preventDefault();
  const title = document.getElementById('capsule-title').value.trim();
  const message = document.getElementById('capsule-message').value.trim();
  const date = document.getElementById('capsule-date').value;
  const file = document.getElementById('capsule-media').files[0];
  if (!title || !message || !date) return;

  if (file?.type.startsWith('video/')) {
    const duration = await getVideoDuration(file);
    if (duration > 300) {
      alert('Video dài hơn 5 phút. Hãy chọn video ngắn hơn để khóa capsule.');
      return;
    }
  }

  const id = createId();
  if (hasSupabaseConfig && !currentUser) {
    alert('Hãy đăng nhập để lưu capsule lên cloud.');
    showScreen('profile');
    return;
  }

  if (shouldUseCloudCapsules()) {
    try {
      await createCloudCapsule({ id, title, message, date, file });
    } catch (error) {
      alert(error.message);
      return;
    }
  } else {
    const mediaMeta = await saveMedia(id, file);
    const items = getCapsules();
    items.unshift({ id, title, message, date, mediaName: mediaMeta?.name || '', mediaType: mediaMeta?.type || '' });
    saveCapsules(items);
  }
  event.target.reset();
  await renderCapsules();
  showScreen('capsule');
});

function emptyState(text) {
  return `<div class="capsule-item"><div class="capsule-lock"><i class="bi bi-stars"></i></div><div><h4>${text}</h4><p>Tạo capsule đầu tiên của bạn.</p></div></div>`;
}

function parseLocalDate(value) {
  const [year, month, day] = value.split('-').map(Number);
  return new Date(year, month - 1, day);
}

function formatDate(value) {
  return parseLocalDate(value).toLocaleDateString('vi-VN');
}

function escapeHtml(value) {
  return String(value ?? '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

function renderPlanCount() {
  if (statPlans) statPlans.textContent = localStorage.getItem('datePlanCount') || '0';
}

initializeAuth();
renderPlanCount();
renderDateHistory();
