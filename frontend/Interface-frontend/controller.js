import { apiService } from "../service.js";
import { apiServiceFront } from "./api-service.js";

const notesContainer = document.getElementById("notesContainer");
const searchInput = document.getElementById("searchInput");
const noteForm = document.getElementById("noteForm");
const logoutBtn = document.getElementById("logoutBtn");
const addNoteBtn = document.getElementById("addNoteBtn");
const noteModal = document.getElementById("noteModal");
const saveNote = document.getElementById("saveNote");
const prevButton = document.getElementById("prevButton");
const nextButton = document.getElementById("nextButton");
const titleInput = document.getElementById("title");
const contentInput = document.getElementById("content");
const tagsInput = document.getElementById("tags");

let searchTimeout;

const state = {
  page: 1,
  limit: 3,
  totalPages: 1,
  search: "",
  tags: [],
  isPinned: false,
};

export const uiController = {
  async loadNotes() {
    const filters = {
      page: state.page,
      limit: state.limit,
      search: state.search,
      tags: state.tags,
    };

    try {
      const result = await apiServiceFront.getNotes(filters);
      state.totalPages = result.pagination.totalPages;
      this.renderNotes(result.data || []);
      state.notes = result.data;
      console.log("soy state notes", state.notes);
    } catch (error) {
      console.error("Error loading notes", error);
      this.showError(error.message);
    }
  },

  renderPagination(event) {
    event.preventDefault();
    nextButton.disabled = false;

    if (event.target.id === "prevButton") {
      if (state.page > 1) {
        state.page--;
        this.loadNotes();
      }
    }
    if (event.target.id === "nextButton") {
      if (state.totalPages === state.page) {
        notesContainer.innerHTML = `<p class="empty-message"> No more notes </p>`;
        nextButton.disabled = true;
      }
      state.page++;
      this.loadNotes();
      console.log(state.page);
    }
  },

  renderNotes(notes) {
    notes.forEach((note, index) => {
      console.log(`----- Nota ${index} -----`);
      console.log("Título:", note.title);
      console.log("Tags:", note.tags);
      console.log("Es array:", Array.isArray(note.tags));
    });
    if (notes.length === 0) {
      notesContainer.innerHTML = `<p class="empty-message"> No notes found </p>`;
      return;
    }

    notesContainer.innerHTML = notes
      .map((note) => this.createNoteCard(note))
      .join("");
  },

  createNoteCard(note) {
    return `
    <article class="note-card" data-id=${note._id}>

    <h3>${note.title}</h3>
    <p>${note.content}</p>

    ${
      note.tags.length
        ? `
        <div class="tags">
        ${note.tags.map((tag) => `<span class="tag"> ${tag}</span>`).join("")}
        </div>`
        : ""
    }
    <div class="note-actions">
    <button class="edit-btn"> Edit</button>
    <button class="delete-btn"> Delete</button>
    </div>
    
    </article>
    `;
  },

  fillForm(note) {
    titleInput.value = note.title;
    contentInput.value = note.content;
    tagsInput.value = note.tags;
  },

  updateNote(event) {
    event.preventDefault();
    const noteCard = event.target.closest(".note-card");
    const idNote = noteCard.getAttribute("data-id");
    const dataNote = state.notes.find((note) => note._id === idNote);

    state.editingNoteId = idNote;
    this.fillForm(dataNote);
    this.showModal();
  },

  async handleCreateNote(event) {
    event.preventDefault();
    const formData = new FormData(noteForm);

    const noteData = {
      title: formData.get("title")?.trim(),
      content: formData.get("content").trim(),
      tags: formData.get("tags")
        ? formData
            .get("tags")
            .split(",")
            .map((tag) => tag.trim().toLowerCase())
        : [],
    };
    try {
      await apiServiceFront.createNote(noteData);
      noteForm.reset();
      this.hideModal();
      await this.loadNotes();
    } catch (error) {
      this.showError(error.message);
    }
  },

  handleSearch(event) {
    clearTimeout(searchTimeout);

    const search = event.target.value.trim();
    searchTimeout = setTimeout(() => {
      this.loadNotes({ search });
    }, 300);
  },

  showError(message) {
    alert(message);
  },

  showModal() {
    noteModal.classList.remove("hidden");
    noteModal.setAttribute("aria-hidden", "false");
    document.getElementById("title").focus();
  },

  hideModal() {
    addNoteBtn.focus();
    noteModal.classList.add("hidden");
    noteModal.setAttribute("aria-hidden", "true");
  },
  deleteNote(event) {
    const noteCard = event.target.closest(".note-card");
    const idNote = noteCard.getAttribute("data-id");
    return idNote;
  },

  async handleUpdateNote() {
    const formData = new FormData(noteForm);
    const noteData = {
      title: formData.get("title").trim(),
      content: formData.get("content").trim(),
      tags: formData.get("tags")
        ? formData
            .get("tags")
            .split(",")
            .map((tag) => tag.trim().toLowerCase())
        : [],
    };

    try {
      await apiServiceFront.updateNote(state.editingNoteId, noteData);
      state.editingNoteId = null;
      noteForm.reset();
      this.hideModal();
      await this.loadNotes();
    } catch (error) {
      this.showError(error);
    }
  },

  logoutfunc() {
    localStorage.removeItem("token");
    window.location.href = "../index.html";
  },
  init() {
    noteForm.addEventListener("submit", async (event) => {
      event.preventDefault();
      if (state.editingNoteId) {
        await this.handleUpdateNote();
      } else {
        this.handleCreateNote(event);
        this.loadNotes();
      }
    });

    logoutBtn.addEventListener("click", (event) => {
      event.preventDefault();
      this.logoutfunc();
    });

    notesContainer.addEventListener("click", (event) => {
      if (event.target.classList.contains("delete-btn")) {
        const idNote = this.deleteNote(event);
        apiServiceFront.deleteNote(idNote);
        this.loadNotes();
      }
      if (event.target.classList.contains("edit-btn")) {
        this.updateNote(event);
      }
    });

    searchInput.addEventListener("input", (event) => {
      this.handleSearch(event);
    });

    addNoteBtn.addEventListener("click", () => {
      this.showModal();
      console.log("clic");
    });

    prevButton.addEventListener("click", (event) => {
      this.renderPagination(event);
    });

    nextButton.addEventListener("click", (event) => {
      this.renderPagination(event);
    });

    noteModal.addEventListener("click", (event) => {
      if (event.target === noteModal) {
        this.hideModal();
      }
    });

    this.loadNotes();
  },
};
