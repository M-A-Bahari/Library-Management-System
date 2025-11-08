import { Model } from "./model";
import { Member, Book } from "./domain";

export class Controller {
  private bookIdCounter = 1;

  constructor(private model: Model) {
    // Initialize counter based on existing books
    const books = this.model.getAllBooks();
    if (books.length > 0) {
      const maxId = Math.max(...books.map(b => {
        const num = parseInt(b.id.replace(/\D/g, ''));
        return isNaN(num) ? 0 : num;
      }));
      this.bookIdCounter = maxId + 1;
    }
  }

  public createMember(id: string, name: string): { ok: boolean; reason?: string } {
    // validate input
    id = id.trim();
    name = name.trim();
    
    if (!id || !name) {
      return { ok: false, reason: "ID and name are required" };
    }

    // checks if member already exists
    const existing = this.model.findMemberById(id);
    if (existing) {
      return { ok: false, reason: "Member ID already exists" };
    }

    // create new member
    this.model.addMember(new Member(id, name));
    return { ok: true };
  }

  public removeMember(id: string): { ok: boolean; reason?: string } {
    const success = this.model.removeMember(id);
    if (!success) {
      return { ok: false, reason: "Member not found" };
    }
    return { ok: true };
  }

  public listMembers(): Member[] {
    return this.model.getAllMembers();
  }

  public getMemberDetails(memberId: string): { member: Member; books: Book[] } | null {
    const member = this.model.findMemberById(memberId);
    if (!member) return null;

    const books = this.model.getMemberBorrowedBooks(member);
    return { member, books };
  }

  // book operations
  public createBook(
    title: string,
    count: number = 1
  ): { ok: boolean; reason?: string } {
    // validate input
    title = title.trim();

    if (!title) {
      return { ok: false, reason: "Title is required" };
    }

    if (count <= 0) {
      return { ok: false, reason: "Count must be greater than 0" };
    }

    // generates book ID automatically
    const id = `B${String(this.bookIdCounter).padStart(3, '0')}`;
    this.bookIdCounter++;

    // create new book
    this.model.addBook(new Book(id, title, count));
    return { ok: true };
  }

  public listBooks(): Book[] {
    return this.model.getAllBooks();
  }

  // lending operations
  public lendBookTo(
    memberIdOrName: string,
    bookTitleOrId: string
  ): { ok: boolean; reason?: string } {
    return this.model.lendByMemberIdOrNameAndBookTitleOrBookId(memberIdOrName, bookTitleOrId);
  }

  // returning operations
  public returnBookFrom(
    memberIdOrName: string,
    bookTitleOrId: string
  ): { ok: boolean; reason?: string } {
    return this.model.returnByMemberIdOrNameAndBookTitleOrBookId(memberIdOrName, bookTitleOrId);
  }
}