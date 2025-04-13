// ボタンとセクションの取得
const toggleBtn = document.getElementById("toggleStatsBtn");
const statsSection = document.getElementById("statsSection");

// トグルボタンのクリックイベント
toggleBtn.addEventListener("click", () => {
  statsSection.classList.toggle("open");
});

// プレイヤーデータのフォーマット関数
function formatPlayers(playersObj) {
  const entries = Object.entries(playersObj);
  const lines = [];
  for (let i = 0; i < entries.length; i += 2) {
    const line = entries.slice(i, i + 2).map(([name, cls]) => `${name}（${cls}）`).join("、");
    lines.push(line);
  }
  return lines.join("<br>");
}

// データの取得と描画
fetch("/match-stats/stats.json")
  .then(response => {
    if (!response.ok) throw new Error("ファイルの読み込みに失敗しました。");
    return response.json();
  })
  .then(data => {
    const container = document.getElementById("statsContainer");

    Object.entries(data).forEach(([datetime, matches]) => {
      const section = document.createElement("div");
      section.className = "rounded-xl glass border border-white border-opacity-20 overflow-hidden shadow-lg";

      const toggle = document.createElement("button");
      toggle.className = "w-full px-6 py-4 text-left text-lg font-semibold tracking-wide hover:bg-white hover:bg-opacity-10 transition";
      toggle.textContent = `🗓️ ${datetime}`;

      const content = document.createElement("div");
      content.className = "toggle-content px-6 py-4 space-y-4";

      matches.forEach(match => {
        const item = document.createElement("div");
        item.className = "border-b border-white border-opacity-10 pb-4";

        const summary = document.createElement("p");
        summary.className = "text-base font-medium mb-2";
        summary.innerHTML = `
          🏆 勝利チーム: ${match.winningTeam}　｜　🔴 攻撃キル数: ${match.redKill}　🔵 守備キル数: ${match.blueKill}<br>
          🕒 残り時間: ${match.remainingTime}秒　｜　🧱 コア耐久値: ${match.coreDurability}
        `;

        const teamInfo = document.createElement("p");
        teamInfo.className = "text-sm opacity-80";
        const attack = formatPlayers(match.teams["攻撃"]);
        const defense = formatPlayers(match.teams["守備"]);
        teamInfo.innerHTML = `🟥 攻撃:<br>${attack}<br><br>🟦 守備:<br>${defense}`;

        item.appendChild(summary);
        item.appendChild(teamInfo);
        content.appendChild(item);
      });

      toggle.addEventListener("click", () => {
        content.classList.toggle("open");
      });

      section.appendChild(toggle);
      section.appendChild(content);
      container.appendChild(section);
    });
  })
  .catch(error => {
    console.error("エラー:", error);
    document.getElementById("statsContainer").textContent = "データの読み込みに失敗しました。";
  });

function sendStats() {
  const statsData = document.getElementById('statsData').value;

  fetch('https://your-glitch-server-url/update-stats', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ stats: statsData }),
  })
  .then(response => response.json())
  .then(data => {
    alert('統計データが正常に送信されました！');
  })
  .catch(error => {
    console.error('エラー:', error);
    alert('データ送信に失敗しました。');
  });
}

