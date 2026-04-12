fetch("navbar.html")
  .then(res => res.text())
  .then(data => {
    document.getElementById("navbar").innerHTML = data;
    setActiveLink();
    initMobileMenu();
  });

function setActiveLink() {
  const current = window.location.pathname.split("/").pop();
  const links = document.querySelectorAll(".nav-links a, .nav-mobile-menu a");

  links.forEach(link => {
    const href = link.getAttribute("href");
    if (!href || href === "#") return;
    if (current === "" && href === "index.html") link.classList.add("active");
    if (href === current) link.classList.add("active");
  });
}

function initMobileMenu() {
  const btn = document.getElementById("navMobileBtn");
  const menu = document.getElementById("navMobileMenu");

  if (!btn || !menu) return;

  btn.onclick = (e) => {
    e.stopPropagation();
    menu.classList.toggle("open");
  };

  menu.querySelectorAll("a").forEach(link => {
    link.onclick = () => menu.classList.remove("open");
  });

  document.onclick = () => menu.classList.remove("open");
  document.onkeydown = (e) => {
    if (e.key === "Escape") menu.classList.remove("open");
  };
}

document.addEventListener("DOMContentLoaded", function () {

  // Last modified date
  const lastModifiedElement = document.getElementById("last-modified-date");
  if (lastModifiedElement) {
    const d = new Date(document.lastModified);
    const formatted = `${d.getFullYear()}/${String(d.getMonth() + 1).padStart(2, "0")}/${String(d.getDate()).padStart(2, "0")} ${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
    lastModifiedElement.querySelector("span").textContent = formatted;
  }

  // Terminal only runs on terminal.html
  const screen = document.getElementById("terminal-screen");
  const input = document.getElementById("terminal-input");
  const output = document.getElementById("terminal-output");

  if (!screen || !input || !output) return;

  function print(text = "") {
    const div = document.createElement("div");
    div.textContent = text;
    output.appendChild(div);
    output.scrollTop = output.scrollHeight;
  }

  function clearScreen() {
    output.innerHTML = "";
  }

  function gap() {
    const div = document.createElement("div");
    div.innerHTML = "&nbsp;";
    output.appendChild(div);
  }

  function line(char = "-") {
    const style = getComputedStyle(output);
    const charWidth = parseFloat(style.fontSize) * 0.6;
    const width = Math.floor(output.clientWidth / charWidth);
    print(char.repeat(width));
  }

  input.addEventListener("keydown", (e) => {
    if (e.key !== "Enter") return;

    const cmd = input.value.trim().toLowerCase();
    print("meheraj@site:~$ " + cmd);

    switch (cmd) {
      case "/exit":
        window.location.href = "index.html";
        break;
      case "/clear":
        clearScreen();
        break;
      case "/about":
        handleAbout();
        break;
      case "/skills":
        handleSkills();
        break;
      case "/projects":
        handleProjects();
        break;
      case "/achievements":
        handleAchievements();
        break;
      case "/cv":
        window.open("Md_Meheraj_Hossain_Opi_Resume.pdf", "_self");
        break;
      default:
        print("command not found");
    }

    input.value = "";
  });

  async function handleAbout() {
    clearScreen();

    const res = await fetch("index.html");
    const html = await res.text();
    const doc = new DOMParser().parseFromString(html, "text/html");

    const about = doc.querySelector(".about-text");
    if (about && about.textContent.trim()) {
      print("[ABOUT]");
      line("*");
      print(about.textContent.trim());
      gap();
    }

    print("[CONTACT]");
    line("*");

    const titles = ["Email", "LinkedIn", "GitHub", "Codeforces", "LeetCode", "Kaggle", "Discord", "Telegram"];
    titles.forEach(t => {
      const el = doc.querySelector(`[title="${t}"]`);
      if (!el) return;
      let value = el.href || el.textContent.trim();
      value = value.replace(/^mailto:/i, "");
      print("> " + t.toUpperCase() + " : " + value);
    });
  }

  async function handleSkills() {
    clearScreen();
    print("[SKILLS]");
    line("*");

    const res = await fetch("skills.html");
    const html = await res.text();
    const doc = new DOMParser().parseFromString(html, "text/html");

    doc.querySelectorAll(".skills-category").forEach(sec => {
      const title = sec.querySelector("h3")?.textContent.trim();
      const content = sec.querySelector(".skills-text")?.textContent.trim();
      print("> " + title.toUpperCase());
      print(content);
    });
  }

  async function handleProjects() {
    clearScreen();
    print("[PROJECTS]");
    line("*");

    const res = await fetch("projects.html");
    const html = await res.text();
    const doc = new DOMParser().parseFromString(html, "text/html");
    const projects = doc.querySelectorAll(".project-card");

    if (!projects.length) {
      print("No projects found");
      return;
    }

    projects.forEach(p => {
      const title = p.querySelector("h3")?.textContent.trim();
      const desc = p.querySelector("p")?.textContent.trim();
      const techs = [...p.querySelectorAll(".tech-tag")].map(t => t.textContent.trim()).join(", ");

      print("> " + title.toUpperCase());
      if (techs) print("Tech: " + techs);
      if (desc) print(desc);
      gap();
    });
  }

  async function handleAchievements() {
    clearScreen();
    print("[ACHIEVEMENTS]");
    line("*");

    const res = await fetch("achievements.html");
    const html = await res.text();
    const doc = new DOMParser().parseFromString(html, "text/html");
    const items = doc.querySelectorAll(".achievement-item");

    if (!items.length) {
      print("No achievements found");
      return;
    }

    items.forEach(a => {
      const title = a.querySelector("h3")?.textContent.trim();
      const desc = a.querySelector("p")?.textContent.trim();
      print("> " + title.toUpperCase());
      if (desc) print(desc);
      gap();
    });
  }

});