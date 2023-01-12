const { nanoid } = require('nanoid');
const books = require('./books');

function addBookHandler(request, h) {
  const {
    name, year, author, summary, publisher, pageCount, readPage,
  } = request.payload;

  if (!name) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal menambahkan buku. Mohon isi nama buku',
    });

    response.code(400);
    return response;
  }

  if (readPage > pageCount) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount',
    });

    response.code(400);
    return response;
  }

  const id = nanoid(16);
  const finished = readPage === pageCount;
  const reading = false;
  const insertedAt = new Date().toISOString();
  const updatedAt = insertedAt;

  const newBook = {
    id,
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    finished,
    reading,
    insertedAt,
    updatedAt,
  };

  // add book to database
  books.push(newBook);

  // check insertion status
  const isSuccess = books.filter((book) => book.id === id).length > 0;

  if (isSuccess) {
    const response = h.response({
      status: 'success',
      message: 'Buku berhasil ditambahkan',
      data: {
        bookId: id,
      },
    });

    response.code(201);
    return response;
  }

  const response = h.response({
    status: 'error',
    message: 'Buku gagal ditambahkan',
  });

  response.code(500);

  return response;
}

function getAllBooksHandler(request, h) {
  if (books.length === 0) {
    const response = h.response({
      status: 'success',
      data: { books },
    });

    response.code(200);

    return response;
  }

  const data = books.reduce((arr, book) => {
    const { id, name, publisher } = book;
    arr.push({ id, name, publisher });
    return arr;
  }, []);

  const response = h.response({
    status: 'success',
    data: { books: data },
  });

  response.code(200);

  return response;
}

function getBookByIdHandler(request, h) {
  const { id } = request.params;

  const book = books.filter((b) => b.id === id)[0];

  if (book === undefined) {
    const response = h.response({
      status: 'fail',
      message: 'Buku tidak ditemukan',
    });

    response.code(404);

    return response;
  }

  const response = h.response({
    status: 'success',
    data: { book },
  });

  response.code(200);

  return response;
}

function editBookByIdHandler(request, h) {

}

function deleteBookByIdHandler(request, h) {

}

module.exports = {
  addBookHandler,
  getAllBooksHandler,
  getBookByIdHandler,
  editBookByIdHandler,
  deleteBookByIdHandler,
};
