import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useDebouncedCallback } from "use-debounce";
import { fetchNotes } from "../../services/noteService";
import NoteList from "../NoteList/NoteList";
import Pagination from "../Pagination/Pagination";
import SearchBox from "../SearchBox/SearchBox";
import Modal from "../Modal/Modal";
import NoteForm from "../NoteForm/NoteForm";
import css from "./App.module.css";

export default function App() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const queryClient = useQueryClient();

  const { data, isLoading, isError } = useQuery({
    queryKey: ["notes", page, search],
    queryFn: () => fetchNotes({ page, perPage: 12, search }),
    placeholderData: (previousData) => previousData,
  });

  const handleSearchChange = useDebouncedCallback((value: string) => {
    setSearch(value);
    setPage(1);
  }, 500);

  const handleModalClose = () => {
    setIsModalOpen(false);
    // після створення нотатки оновлюємо список
    queryClient.invalidateQueries({ queryKey: ["notes"] });
  };

  return (
    <div className={css.app}>
      <header className={css.toolbar}>
        <SearchBox onSearch={handleSearchChange} />
        {data && data.totalPages > 1 && (
          <Pagination
            pageCount={data.totalPages}
            currentPage={page}
            onPageChange={setPage}
          />
        )}
        <button className={css.button} onClick={() => setIsModalOpen(true)}>
          Create note +
        </button>
      </header>

      {isLoading && <p>Завантаження нотаток...</p>}
      {isError && <p>Не вдалося завантажити нотатки.</p>}

      {data && data.notes.length > 0 && <NoteList notes={data.notes} />}

      {isModalOpen && (
        <Modal onClose={() => setIsModalOpen(false)}>
          <NoteForm onClose={handleModalClose} />
        </Modal>
      )}
    </div>
  );
}