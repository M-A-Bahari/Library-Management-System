// all books with inventory details and borrowers
import {SKContainer, SKLabel, Layout} from "../simplekit/src/imperative-mode";
import { Subscriber } from "./subscriber";
import { Controller } from "./controller";
import { Model } from "./model";
import { Book } from "./domain";
import { Color, Size } from "./constants";

export class BookListView extends SKContainer implements Subscriber {
  private model: Model;
  private controller: Controller;

  constructor(model: Model, controller: Controller) {
    super();
    this.width = Size.PANEL_WIDTH;
    this.height = Size.PANEL_HEIGHT;
    this.model = model;
    this.controller = controller;
    this.layoutMethod = new Layout.WrapRowLayout({ gap: 12 });
    this.fill = Color.MAINPANEL;
    this.border = "black";
    this.model.addSubscriber(this);
  }

  public update(): void {
    // clear all children
    while (this.children.length > 0) {
      this.removeChild(this.children[0]);
    }
    this.renderBooks();
  }

  // books
  private renderBooks(): void {
    const books = this.controller.listBooks();
    if (books.length === 0) {
      const emptyLabel = new SKLabel({ text: "No books yet", width: Size.PANEL_WIDTH, height: Size.BOOK_SECTION_HEIGHT, align: "centre" });
      emptyLabel.font = "20px Times New Roman";
      emptyLabel.fill = Color.GRAY;
      this.addChild(emptyLabel);
    } else {
      books.forEach((book) => this.addChild(this.createBookCard(book)));
    }
  }

  // show book list
  private createBookCard(book: Book): SKContainer {
    const card = new SKContainer({ width: Size.PANEL_WIDTH, height: Size.BOOK_SECTION_HEIGHT });
    card.layoutMethod = new Layout.WrapRowLayout({});
    const titleLabel = new SKLabel({text: `${book.title} (${book.id})`, width: Size.PANEL_WIDTH, height: Size.BOOK_LABEL_HEIGHT, align: "left"});
    titleLabel.font = "bold 20px Times New Roman";
    titleLabel.fill = Color.BOOK_BACKGROUND;
    card.addChild(titleLabel);

    const members = this.controller.listMembers();
    const borrowedCount = members.reduce((count, member) => count + member.borrowed.filter(id => id === book.id).length, 0);
    const totalCopies = book.count + borrowedCount;
    const statusContainer = new SKContainer({ width: Size.PANEL_WIDTH, height: Size.BOOK_LABEL_HEIGHT });
    statusContainer.layoutMethod = new Layout.FillRowLayout();

    const inventoryLabel = new SKLabel({text: `Available: ${book.count}/${totalCopies}`, width: Size.BOOK_LABEL_WIDTH, height: Size.BOOK_LABEL_HEIGHT, align: "left"});
    inventoryLabel.font = "20px Times New Roman";
    inventoryLabel.fill = book.count > 0 ? Color.BOOK_FOREGROUND : Color.ERROR;
    statusContainer.addChild(inventoryLabel);

    const divider = new SKLabel({text: "Borrowed by:", width: Size.BOOK_LABEL_WIDTH, height: Size.BOOK_LABEL_HEIGHT, align: "left"});
    divider.font = "20px Times New Roman";
    divider.fill = Color.DAKRGRAY;
    statusContainer.addChild(divider);

    const borrowers = members.filter(member => member.borrowed.includes(book.id));
    const borrowerLabel = new SKLabel({ width: 740, height: 20, align: "left" });
    
    if (borrowers.length > 0) {
      borrowerLabel.text = borrowers.map(m => m.name).join(", ");
      borrowerLabel.font = "20px Times New Roman";
      borrowerLabel.fill = Color.GRAY;
    } else {
      borrowerLabel.text = "None";
      borrowerLabel.font = "20px Times New Roman";
      borrowerLabel.fill = Color.GRAY;
    }
    statusContainer.addChild(borrowerLabel);
    card.addChild(statusContainer);
    return card;
  }
}
