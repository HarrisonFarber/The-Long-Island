(() => {
  const page = document.body.dataset.page || "home";
  const nav = document.querySelector("[data-nav]");
  const menuToggle = document.querySelector("[data-menu-toggle]");

  if (menuToggle && nav) {
    menuToggle.addEventListener("click", () => {
      nav.classList.toggle("is-open");
      menuToggle.setAttribute("aria-expanded", nav.classList.contains("is-open"));
    });
  }

  const currentPath = window.location.pathname.replace(/\/index\.html$/, "/").replace(/\/$/, "");
  document.querySelectorAll("a[data-nav-link]").forEach((link) => {
    const href = new URL(link.getAttribute("href"), window.location.href).pathname.replace(/\/index\.html$/, "/").replace(/\/$/, "");
    if (href === currentPath) {
      link.setAttribute("aria-current", "page");
    }
  });

  const leadKey = "licc_leads";
  const invoiceKey = "licc_invoices";

  const readJSON = (key, fallback) => {
    try {
      return JSON.parse(localStorage.getItem(key) || "") || fallback;
    } catch {
      return fallback;
    }
  };

  const writeJSON = (key, value) => localStorage.setItem(key, JSON.stringify(value));

  const seedLeads = () => {
    const existing = readJSON(leadKey, null);
    if (existing && existing.length) return existing;
    const demo = [
      {
        id: "LC-1042",
        createdAt: new Date().toISOString(),
        name: "Maria R.",
        phone: "(516) 555-0142",
        email: "maria@example.com",
        address: "Hempstead, NY",
        serviceType: "Property Cleanout",
        preferredDate: "2026-08-15",
        notes: "Basement and garage cleanout.",
        photoCount: 2,
        status: "new",
      },
      {
        id: "LC-1041",
        createdAt: new Date(Date.now() - 86400000).toISOString(),
        name: "James K.",
        phone: "(631) 555-0199",
        email: "james@example.com",
        address: "Patchogue, NY",
        serviceType: "Junk Removal",
        preferredDate: "2026-08-13",
        notes: "Couch, mattress, and appliances.",
        photoCount: 3,
        status: "quoted",
      },
    ];
    writeJSON(leadKey, demo);
    return demo;
  };

  const seedInvoices = () => {
    const existing = readJSON(invoiceKey, null);
    if (existing && existing.length) return existing;
    const demo = [
      {
        id: "INV-2001",
        leadId: "LC-1041",
        total: 640,
        status: "unpaid",
        paymentLinkUrl: "#",
        lineItems: [
          { description: "2-man junk removal crew", amount: 420 },
          { description: "Disposal fee", amount: 120 },
          { description: "Mileage", amount: 100 },
        ],
      },
    ];
    writeJSON(invoiceKey, demo);
    return demo;
  };

  if (page === "quote") {
    seedLeads();
    const form = document.querySelector("[data-quote-form]");
    const preview = document.querySelector("[data-photo-preview]");
    const filesInput = document.querySelector("#photos");
    const status = document.querySelector("[data-form-status]");
    const dateInput = document.querySelector("#preferred_date");
    if (dateInput) {
      const min = new Date();
      min.setDate(min.getDate() + 1);
      dateInput.min = min.toISOString().slice(0, 10);
    }

    const renderPreviews = (files) => {
      if (!preview) return;
      preview.innerHTML = "";
      const chosen = Array.from(files || []).slice(0, 4);
      chosen.forEach((file) => {
        const tile = document.createElement("div");
        tile.className = "upload-tile";
        tile.textContent = file.name;
        preview.appendChild(tile);
      });
      if (!chosen.length) {
        const empty = document.createElement("div");
        empty.className = "upload-tile";
        empty.textContent = "Upload up to 4 photos";
        preview.appendChild(empty);
      }
    };

    renderPreviews(filesInput?.files);
    filesInput?.addEventListener("change", () => renderPreviews(filesInput.files));

    form?.addEventListener("submit", (event) => {
      event.preventDefault();
      const leads = seedLeads();
      const data = new FormData(form);
      const lead = {
        id: `LC-${Math.floor(1000 + Math.random() * 9000)}`,
        createdAt: new Date().toISOString(),
        name: String(data.get("name") || ""),
        phone: String(data.get("phone") || ""),
        email: String(data.get("email") || ""),
        address: String(data.get("address") || ""),
        serviceType: String(data.get("service_type") || ""),
        preferredDate: String(data.get("preferred_date") || ""),
        notes: String(data.get("notes") || ""),
        photoCount: filesInput?.files?.length || 0,
        status: "new",
      };
      leads.unshift(lead);
      writeJSON(leadKey, leads);
      if (status) {
        status.innerHTML = `<strong>Quote request saved locally.</strong> A backend endpoint can wire this to email, SMS, and the admin inbox next.`;
      }
      form.reset();
      renderPreviews([]);
    });
  }

  if (page === "admin") {
    const tbody = document.querySelector("[data-leads-table]");
    const reports = document.querySelectorAll("[data-report]");
    const statusFilter = document.querySelector("[data-status-filter]");
    const render = () => {
      const leads = seedLeads();
      const filter = statusFilter?.value || "all";
      const filtered = filter === "all" ? leads : leads.filter((lead) => lead.status === filter);
      if (tbody) {
        tbody.innerHTML = filtered
          .map(
            (lead) => `
              <tr>
                <td>${lead.id}</td>
                <td><strong>${lead.name}</strong><br><span class="subtle">${lead.address}</span></td>
                <td>${lead.serviceType}</td>
                <td>${lead.photoCount || 0}</td>
                <td><span class="status">${lead.status}</span></td>
              </tr>`
          )
          .join("");
      }
      const total = leads.length;
      const quoted = leads.filter((lead) => lead.status !== "new").length;
      const converted = leads.filter((lead) => ["accepted", "scheduled", "completed", "paid"].includes(lead.status)).length;
      const revenue = 640;
      const values = [total, quoted, total ? Math.round((converted / total) * 100) : 0, revenue];
      reports.forEach((node, index) => {
        const value = values[index];
        node.querySelector("strong").textContent = index === 3 ? `$${value}` : `${value}`;
      });
    };
    statusFilter?.addEventListener("change", render);
    render();
  }

  if (page === "pay") {
    seedInvoices();
    const params = new URLSearchParams(window.location.search);
    const id = params.get("invoiceId") || "INV-2001";
    const invoice = seedInvoices().find((item) => item.id === id) || seedInvoices()[0];
    const container = document.querySelector("[data-invoice]");
    if (container && invoice) {
      container.querySelector("[data-invoice-id]").textContent = invoice.id;
      container.querySelector("[data-invoice-total]").textContent = `$${invoice.total.toFixed(2)}`;
      const list = container.querySelector("[data-line-items]");
      list.innerHTML = invoice.lineItems
        .map((item) => `<li><span>${item.description}</span><strong>$${item.amount.toFixed(2)}</strong></li>`)
        .join("");
    }
  }
})();
