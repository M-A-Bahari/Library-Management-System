// model manages all data and business logic for the library system
import { Subscriber } from "./subscriber";
import { Book, Member } from "./domain";

export class Model {
  private members = new Map<string, Member>();
  private books = new Map<string, Book>();
  private subscribers: Subscriber[] = [];

  constructor() {
    // pre-populates with example data
    this.initializeExampleData();
  }

  public addSubscriber(s: Subscriber): void {
    this.subscribers.push(s);
    s.update(); // sends initial update
  }

  private notifySubscribers(): void {
    this.subscribers.forEach(s => s.update());
  }

  public addMember(member: Member): boolean {
    if (this.members.has(member.id)) return false;
    this.members.set(member.id, member);
    this.notifySubscribers();
    return true;
  }

  public getAllMembers(): Member[] {
    return Array.from(this.members.values());
  }

  public findMemberById(id: string): Member | undefined {
    return this.members.get(id);
  }

  public findMemberByName(name: string): Member | undefined {
    const nameLower = name.trim().toLowerCase();
    return Array.from(this.members.values()).find(
      member => member.name.toLowerCase() === nameLower
    );
  }

  public removeMember(id: string): boolean {
    const deleted = this.members.delete(id);
    if (deleted) this.notifySubscribers();
    return deleted;
  }

  public addBook(book: Book): boolean {
    const existing = this.books.get(book.id);
    if (existing) {
      existing.count += book.count;
    } else {
      this.books.set(book.id, book);
    }
    this.notifySubscribers();
    return true;
  }

  public getAllBooks(): Book[] {
    return Array.from(this.books.values());
  }

  public findBookById(id: string): Book | undefined {
    return this.books.get(id);
  }

  public findBookByTitle(title: string): Book | undefined {
    const titleLower = title.trim().toLowerCase();
    for (const book of this.books.values()) {
      if (book.title.toLowerCase() === titleLower) {
        return book;
      }
    }
    return undefined;
  }

  public lendBook(memberId: string, bookId: string): boolean {
    const member = this.members.get(memberId);
    const book = this.books.get(bookId);

    if (!member || !book) return false;
    if (book.count <= 0) return false;

    // update book count and member's borrowed list
    book.count--;
    member.borrowed.push(bookId);
    this.notifySubscribers();
    return true;
  }

  public returnBook(memberId: string, bookId: string): boolean {
    const member = this.members.get(memberId);
    const book = this.books.get(bookId);

    if (!member || !book) return false;

    // check if member has this book
    const bookIndex = member.borrowed.indexOf(bookId);
    if (bookIndex === -1) return false;

    // removes book from member's borrowed list and increase book count
    member.borrowed.splice(bookIndex, 1);
    book.count++;
    this.notifySubscribers();
    return true;
  }

  public lendByMemberIdOrNameAndBookTitleOrBookId(memberIdOrName: string, bookTitleOrBookId: string): { ok: boolean; reason?: string } {
    // tries to find member by ID first, then by name
    let member = this.findMemberById(memberIdOrName.trim());
    if (!member) {
      member = this.findMemberByName(memberIdOrName);
    }
    if (!member) {
      return { ok: false, reason: "Member not found" };
    }

    // finds book by book Id, then by title
    let book = this.findBookById(bookTitleOrBookId.trim());
    if (!book) {
      book = this.findBookByTitle(bookTitleOrBookId);
    }
    if (!book) {
      return { ok: false, reason: "Book not found" };
    }
    if (book.count <= 0) {
      return { ok: false, reason: "No copies available" };
    }

    // performs the lending
    const success = this.lendBook(member.id, book.id);
    return { ok: success };
  }

  public returnByMemberIdOrNameAndBookTitleOrBookId(memberIdOrName: string, bookTitleOrBookId: string): { ok: boolean; reason?: string } {
    // tries to find member by ID first, then by name
    let member = this.findMemberById(memberIdOrName.trim());
    if (!member) {
      member = this.findMemberByName(memberIdOrName);
    }
    if (!member) {
      return { ok: false, reason: "Member not found" };
    }

    // finds book by book Id, then by title
    let book = this.findBookById(bookTitleOrBookId.trim());
    if (!book) {
      book = this.findBookByTitle(bookTitleOrBookId);
    }
    if (!book) {
      return { ok: false, reason: "Book not found" };
    }

    // checks if member has this book borrowed
    if (!member.borrowed.includes(book.id)) {
      return { ok: false, reason: "Member has not borrowed this book" };
    }

    // performs the return
    const success = this.returnBook(member.id, book.id);
    return { ok: success };
  }

  public getMemberBorrowedBooks(member: Member): Book[] {
    return member.borrowed
      .map(bookId => this.books.get(bookId))
      .filter(book => book !== undefined) as Book[];
  }

  // initital inputs
  private initializeExampleData(): void {
    this.addBook(new Book("B001", "Algorithm Design & Analysis", 3));
    this.addBook(new Book("B002", "Building User Interfaces", 2));
    this.addBook(new Book("B003", "Android App Development", 5));
    this.addBook(new Book("B004", "Information Security", 4));
    this.addBook(new Book("B005", "Civil Wars Since 1900", 2));

    this.addMember(new Member("S001", "Ataullah Bahari"));
    this.addMember(new Member("S002", "James Bond"));
    this.addMember(new Member("S003", "Henry Cavill"));
    this.addMember(new Member("S004", "Tobey Maguire"));
    this.addMember(new Member("S005", "John Wick"));

    this.lendBook("S001", "B001");
    this.lendBook("S001", "B002");
    this.lendBook("S002", "B005");
    this.lendBook("S003", "B004");
    this.lendBook("S004", "B003");
    this.lendBook("S004", "B004");
  }
}