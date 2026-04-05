const projectsData = {
  fluxy: {
    title: "Fluxy",
    text: "Sistema pensado para pequenos negócios, com foco em vendas, organização e controle de fluxo de caixa de forma acessível.",
    tech: "HTML, CSS e JavaScript",
    category: "Sistema / Gestão",
    link: "#",
    image: "img/projects/fluxy.jpg"
  },
  store: {
    title: "Site de Loja",
    text: "Projeto visual para marca de roupas, com proposta mais moderna, forte e direcionada para presença digital e conversão.",
    tech: "UI Design, Front-end e Layout",
    category: "Website / Moda",
    link: "#",
    image: "img/projects/store.jpg"
  },
  landing: {
    title: "Landing Page",
    text: "Página criada para apresentação de produto ou serviço com foco em impacto visual, clareza da mensagem e estrutura premium.",
    tech: "HTML, CSS e JavaScript",
    category: "Landing / Apresentação",
    link: "#",
    image: "img/projects/landing.jpg"
  }
};

const projectTitle = document.getElementById("project-title");
const projectText = document.getElementById("project-text");
const projectTech = document.getElementById("project-tech");
const projectCategory = document.getElementById("project-category");
const projectLink = document.getElementById("project-link");
const projectNext = document.getElementById("project-next");
const projectImage = document.getElementById("project-image");
const projectChips = document.querySelectorAll(".project-chip");

let currentProjectIndex = 0;
const projectKeys = Object.keys(projectsData);

function updateProject(projectKey) {
  const project = projectsData[projectKey];
  if (!project) return;

  projectTitle.style.opacity = "0.35";
  projectText.style.opacity = "0.35";
  projectImage.style.opacity = "0.25";
  projectImage.style.transform = "scale(1.03)";

  setTimeout(() => {
    projectTitle.textContent = project.title;
    projectText.textContent = project.text;
    projectTech.textContent = project.tech;
    projectCategory.textContent = project.category;
    projectLink.href = project.link;
    projectImage.src = project.image;
    projectImage.alt = `Preview do projeto ${project.title}`;

    projectTitle.style.opacity = "1";
    projectText.style.opacity = "1";
    projectImage.style.opacity = "1";
    projectImage.style.transform = "scale(1)";
  }, 180);

  projectChips.forEach((chip) => {
    chip.classList.remove("active");

    if (chip.dataset.project === projectKey) {
      chip.classList.add("active");
    }
  });

  currentProjectIndex = projectKeys.indexOf(projectKey);

  window.dispatchEvent(
    new CustomEvent("projectchange", {
      detail: { projectKey }
    })
  );
}

projectChips.forEach((chip) => {
  chip.addEventListener("click", () => {
    const projectKey = chip.dataset.project;
    updateProject(projectKey);
  });
});

if (projectNext) {
  projectNext.addEventListener("click", () => {
    currentProjectIndex = (currentProjectIndex + 1) % projectKeys.length;
    updateProject(projectKeys[currentProjectIndex]);
  });
}