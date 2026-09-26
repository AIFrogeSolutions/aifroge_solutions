// AI Forge Solution — shared front-end behaviour
document.addEventListener("DOMContentLoaded", function () {
  var toggle = document.querySelector(".nav-toggle");
  var links = document.querySelector(".nav-links");

  if (toggle && links) {
    toggle.addEventListener("click", function () {
      var isOpen = links.classList.toggle("open");
      toggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
    });

    links.querySelectorAll("a").forEach(function (a) {
      a.addEventListener("click", function () {
        links.classList.remove("open");
        toggle.setAttribute("aria-expanded", "false");
      });
    });
  }

  // Contact form: static site, so submission opens a pre-filled email to us instead of posting to a server.
  var form = document.querySelector("#contact-form");
  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();

      var name = form.querySelector("#name") ? form.querySelector("#name").value : "";
      var email = form.querySelector("#email") ? form.querySelector("#email").value : "";
      var company = form.querySelector("#company") ? form.querySelector("#company").value : "";
      var phone = form.querySelector("#phone") ? form.querySelector("#phone").value : "";
      var serviceEl = form.querySelector("#service");
      var service = serviceEl ? serviceEl.options[serviceEl.selectedIndex].text : "";
      var message = form.querySelector("#message") ? form.querySelector("#message").value : "";

      var bodyLines = [
        "Name: " + name,
        "Company: " + company,
        "Phone: " + phone,
        "Looking for: " + service,
        "",
        message
      ];

      var subject = encodeURIComponent("New project enquiry from " + (name || "the website"));
      var body = encodeURIComponent(bodyLines.join("\n"));
      var mailto = "mailto:aifrogesolution@gmail.com?subject=" + subject + "&body=" + body;

      window.location.href = mailto;

      var status = form.querySelector(".form-status");
      if (status) {
        status.textContent = "Opening your email client with this message ready to send.";
        status.style.color = "#5fd4ff";
      }
    });
  }

  // Scroll-reveal: fade/rise elements into view as the page is scrolled.
  // initReveal() is re-run after JSON content is injected so new cards animate too.
  function initReveal(scope) {
    var root = scope || document;
    var revealTargets = root.querySelectorAll(
      ".card:not(.reveal-item), .stat:not(.reveal-item), .process-step:not(.reveal-item), .section-head:not(.reveal-item), .hero h1:not(.reveal-item), .hero .lede:not(.reveal-item), .hero-actions:not(.reveal-item), .page-hero h1:not(.reveal-item), .page-hero .lede:not(.reveal-item), .service-detail:not(.reveal-item)"
    );

    if ("IntersectionObserver" in window && revealTargets.length) {
      revealTargets.forEach(function (el, i) {
        el.classList.add("reveal-item");
        el.style.transitionDelay = (i % 3) * 60 + "ms";
      });

      var observer = new IntersectionObserver(
        function (entries) {
          entries.forEach(function (entry) {
            if (entry.isIntersecting) {
              entry.target.classList.add("in-view");
              observer.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
      );

      revealTargets.forEach(function (el) { observer.observe(el); });
    } else {
      revealTargets.forEach(function (el) { el.classList.add("in-view"); });
    }
  }

  initReveal();

  // ---- JSON-driven content -------------------------------------------
  // Escapes text before it's inserted as HTML, so JSON content can never
  // break the page or inject markup.
  function esc(str) {
    var div = document.createElement("div");
    div.textContent = str == null ? "" : String(str);
    return div.innerHTML;
  }

  function loadJSON(path) {
    return fetch(path).then(function (res) {
      if (!res.ok) throw new Error("Failed to load " + path);
      return res.json();
    });
  }

  // Projects grid (projects.html) — reads data/projects.json
  var projectsGrid = document.querySelector("#projects-grid");
  var projectsFeatured = document.querySelector("#projects-featured");
  if (projectsGrid) {
    loadJSON("data/projects.json")
      .then(function (projects) {
        var gridHtml = "";

        projects.forEach(function (p) {
          var tech = (p.tech || []).map(function (t) {
            return '<span class="tag">' + esc(t) + "</span>";
          }).join("");
          var features = (p.features || []).map(function (f) {
            return "<li>" + esc(f) + "</li>";
          }).join("");
          var note = p.note
            ? '<p class="project-note">' + esc(p.note) + "</p>"
            : "";
          var cardImage = p.image
            ? '<div class="project-card-shot"><div class="project-shot-frame project-shot-sm"><div class="project-shot-bar"><span></span><span></span><span></span></div><img src="' + esc(p.image) + '" alt="' + esc(p.title) + ' screenshot" loading="lazy"></div></div>'
            : "";

          gridHtml += (
            '<div class="card project-card">' +
              '<h3>' + esc(p.title) + '</h3>' +
              cardImage +
              '<div class="project-block"><span class="eyebrow">Problem</span><p>' + esc(p.problem) + '</p></div>' +
              '<div class="project-block"><span class="eyebrow">Solution</span><p>' + esc(p.solution) + '</p></div>' +
              (features ? '<div class="project-block"><span class="eyebrow">Key features</span><ul class="project-features">' + features + '</ul></div>' : '') +
              note +
              '<div class="project-tag-row">' + tech + '</div>' +
            '</div>'
          );
        });

        if (projectsFeatured) projectsFeatured.innerHTML = "";
        projectsGrid.innerHTML = gridHtml;
        initReveal(projectsGrid);
      })
      .catch(function (err) { console.error(err); });
  }

  // Team grid (team.html) — reads data/team.json
  var teamGrid = document.querySelector("#team-grid");
  if (teamGrid) {
    loadJSON("data/team.json")
      .then(function (team) {
        teamGrid.innerHTML = team.map(function (m) {
          return (
            '<div class="card team-card">' +
              '<div class="team-photo">' + esc(m.initial) + "</div>" +
              '<span class="team-role">' + esc(m.role) + "</span>" +
              "<h3>" + esc(m.name) + "</h3>" +
              "<p>" + esc(m.bio) + "</p>" +
            "</div>"
          );
        }).join("");
        initReveal(teamGrid);
      })
      .catch(function (err) { console.error(err); });
  }

  // Service detail blocks (services.html) — reads data/services.json
  var servicesList = document.querySelector("#services-list");
  if (servicesList) {
    loadJSON("data/services.json")
      .then(function (services) {
        servicesList.innerHTML = services.map(function (s) {
          var points = (s.points || []).map(function (pt) {
            return "<li>" + esc(pt) + "</li>";
          }).join("");
          return (
            '<div class="service-detail">' +
              "<div>" +
                '<span class="eyebrow">' + esc(s.number) + " — " + esc(s.eyebrow) + "</span>" +
                "<h2>" + esc(s.title) + "</h2>" +
                "<p>" + esc(s.description) + "</p>" +
              "</div>" +
              "<ul>" + points + "</ul>" +
            "</div>"
          );
        }).join("");
        initReveal(servicesList);
      })
      .catch(function (err) { console.error(err); });
  }
});
