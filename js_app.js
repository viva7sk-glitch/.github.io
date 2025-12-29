// フロントエンドの簡易フォーム処理（デモ用）
// 実運用時は fetch() でサーバー送信や外部フォームサービスに差し替えてください。

(function(){
  const form = document.getElementById('essay-form');
  const resultEl = document.getElementById('form-result');
  const saveBtn = document.getElementById('save-draft');

  function showMessage(text, ok=true){
    resultEl.hidden = false;
    resultEl.textContent = text;
    resultEl.style.borderColor = ok ? '#cfeeea' : '#f4c2c2';
    resultEl.style.background = ok ? '#eef7f8' : '#fff2f2';
  }

  function validate(values){
    if(!values.name) return 'お名前を入力してください。';
    if(!values.email) return 'メールアドレスを入力してください。';
    if(!values.essay && !values.fileName) return '本文（または添付ファイル）を入力してください。';
    return '';
  }

  function readFormData(){
    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    const deadline = document.getElementById('deadline').value;
    const title = document.getElementById('title').value.trim();
    const essay = document.getElementById('essay').value.trim();
    const fileInput = document.getElementById('file');
    const file = fileInput.files && fileInput.files[0];
    const fileName = file ? file.name : '';
    return {name,email,deadline,title,essay,fileName};
  }

  form.addEventListener('submit', function(e){
    e.preventDefault();
    const values = readFormData();
    const err = validate(values);
    if(err){
      showMessage(err, false);
      return;
    }

    // 実運用ではここで fetch() による送信処理を行う
    // デモ：ローカルストレージに保存して完了メッセージ
    const submissions = JSON.parse(localStorage.getItem('ka_submission_list') || '[]');
    submissions.push({
      id: Date.now(),
      name: values.name,
      email: values.email,
      title: values.title,
      essay: values.essay,
      fileName: values.fileName,
      deadline: values.deadline,
      createdAt: new Date().toISOString()
    });
    localStorage.setItem('ka_submission_list', JSON.stringify(submissions));

    showMessage('送信が完了しました（デモ：ローカル保存）。管理者が確認次第ご連絡します。');
    form.reset();
  });

  saveBtn.addEventListener('click', function(){
    const values = readFormData();
    const err = validate({...values, email: values.email || 'dummy@example.com'}); // 下書き保存はメール不要にする場合
    if(err && !values.essay){
      showMessage('保存する本文がありません。', false);
      return;
    }
    const drafts = JSON.parse(localStorage.getItem('ka_drafts') || '[]');
    drafts.push({
      id: Date.now(),
      name: values.name,
      email: values.email,
      title: values.title,
      essay: values.essay,
      fileName: values.fileName,
      savedAt: new Date().toISOString()
    });
    localStorage.setItem('ka_drafts', JSON.stringify(drafts));
    showMessage('下書きを保存しました。ブラウザのローカルストレージに保存されます。');
  });

  // ページ読み込み時、既存の下書き数を表示（任意）
  window.addEventListener('load', function(){
    const drafts = JSON.parse(localStorage.getItem('ka_drafts') || '[]');
    if(drafts.length){
      showMessage(`保存中の下書きが ${drafts.length} 件あります（ローカルストレージ）。`, true);
    }
  });
})();