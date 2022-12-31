// return response method
const response = (h, status, message, code, id, book) => {
  let content = {}
  // 1. return book (single book / array of book)
  // 2. return success add book
  // 3. return fail/error
  if (book !== undefined) {
    if (book.length !== undefined) {
      content = {
        status: status,
        data: {
          books: book,
        },
      }
    } else {
      content = {
        status: status,
        data: {
          book,
        },
      }
    }
  } else if (id !== undefined) {
    content = {
      status: status,
      message: message,
      data: {
        bookId: id,
      },
    }
  } else {
    content = {
      status: status,
      message: message,
    }
  }
  return h.response(content).code(code)
}

export default response
