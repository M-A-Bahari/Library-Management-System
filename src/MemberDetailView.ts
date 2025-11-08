// member detail view shows borrowed books
import {SKContainer, SKLabel, SKButton, Layout} from "../simplekit/src/imperative-mode";
import { Subscriber } from "./subscriber";
import { Controller } from "./controller";
import { Model } from "./model";
import { Color, Size } from "./constants";

export class MemberDetailView extends SKContainer implements Subscriber {
  private model: Model;
  private controller: Controller;
  private memberId: string;
  private contentContainer!: SKContainer;
  private onBack?: () => void;

  constructor(model: Model, controller: Controller, memberId: string, onBack?: () => void) {
    super();
    this.width = Size.PANEL_WIDTH;
    this.height = Size.PANEL_HEIGHT;
    this.border = "black";
    this.model = model;
    this.controller = controller;
    this.memberId = memberId;
    this.onBack = onBack;
    this.layoutMethod = new Layout.WrapRowLayout({ gap: 12 });
    this.fill = Color.MAINPANEL;
    this.buildUI();
    this.model.addSubscriber(this);
  }

  private buildUI(): void {
    // header with back button
    const header = new SKContainer({width: Size.PANEL_WIDTH, height: Size.MEM_DET_BUTTON_HEIGHT});
    header.layoutMethod = new Layout.FillRowLayout();
    header.fill = Color.MAINPANEL;

    const backBtn = new SKButton({ text: "← Back", width: Size.MEM_DET_BUTTON_WIDTH, height: Size.MEM_DET_BUTTON_HEIGHT});
    backBtn.font = "bold 24px Times New Roman";
    backBtn.fill = Color.BUTTON_COLOR;
    backBtn.addEventListener("action", () => {
      if (this.onBack) this.onBack();
    });

    const title = new SKLabel({ text: "Member Details", width: Size.PANEL_WIDTH - Size.MEM_DET_BUTTON_WIDTH, height: Size.MEM_DET_BUTTON_HEIGHT, align: "centre" });
    title.font = "bold 30px Times New Roman";
    title.fill = Color.HEADER_COLOR;

    header.addChild(backBtn);
    header.addChild(title);
    this.addChild(header);

    // content container
    this.contentContainer = new SKContainer({ width: Size.PANEL_WIDTH, height: Size.PANEL_HEIGHT - Size.MEM_DET_BUTTON_HEIGHT });
    this.contentContainer.layoutMethod = new Layout.WrapRowLayout({ gap: 12 });
    this.contentContainer.fill = Color.MAINPANEL;
    this.contentContainer.border = "black";
    this.addChild(this.contentContainer);
    this.updateContent();
  }

  public update(): void {
    this.updateContent();
  }

  private updateContent(): void {
    // clear content container
    while (this.contentContainer.children.length > 0) {
      this.contentContainer.removeChild(this.contentContainer.children[0]);
    }

    // get member details
    const details = this.controller.getMemberDetails(this.memberId);

    if (!details) {
      const errorLabel = new SKLabel({text: "Member not found", width: Size.PANEL_WIDTH, height: Size.PANEL_HEIGHT, align: "centre"});
      errorLabel.font = "20px Times New Roman";
      errorLabel.fill = Color.ERROR;
      this.contentContainer.addChild(errorLabel);
    } else {
      this.renderMemberDetails(details.member, details.books);
    }
  }

  private renderMemberDetails(member: any, books: any[]): void {
    // member info section
    const infoSection = this.createInfoSection(member, books);
    this.contentContainer.addChild(infoSection);

    // borrowed books section
    const booksSection = this.createBooksSection(books);
    this.contentContainer.addChild(booksSection);
  }

  private createInfoSection(member: any, books: any[]): SKContainer {
    const section = new SKContainer({width: Size.PANEL_WIDTH, height: Size.MEM_DET_HEIGHT});
    section.layoutMethod = new Layout.WrapRowLayout({ gap: 5 });
    section.fill = Color.MAINPANEL;

    // name
    const nameLabel = new SKLabel({text: `Name: ${member.name}`, width: Size.PANEL_WIDTH, height: Size.ANY_HEIGHT, align: "left"});
    nameLabel.font = "bold 20px Times New Roman";
    nameLabel.fill = Color.MEMBER_BACKGROUND;
    section.addChild(nameLabel);

    // student ID
    const idLabel = new SKLabel({text: `Student ID: ${member.id}`, width: Size.PANEL_WIDTH, height: Size.ANY_HEIGHT, align: "left"});
    idLabel.font = "20px Times New Roman";
    idLabel.fill = Color.GRAY;
    section.addChild(idLabel);

    // books borrowed count
    const countLabel = new SKLabel({text: `Books Borrowed: ${books.length}`, width: Size.PANEL_WIDTH, height: Size.ANY_HEIGHT, align: "left"});
    countLabel.font = "bold 20px Times New Roman";
    countLabel.fill = books.length > 0 ? Color.ERROR : Color.SUCCESS;
    section.addChild(countLabel);

    return section;
  }

  private createBooksSection(books: any[]): SKContainer {
    const section = new SKContainer({width: Size.PANEL_WIDTH, height: 400});
    section.layoutMethod = new Layout.WrapRowLayout({ gap: 8 });
    section.fill = Color.MAINPANEL;

    // books list
    if (books.length === 0) {
      const emptyLabel = new SKLabel({text: "No books borrowed yet", width: Size.PANEL_WIDTH, height: Size.ANY_HEIGHT, align: "left"});
      emptyLabel.font = "20px Times New Roman";
      emptyLabel.fill = Color.GRAY;
      section.addChild(emptyLabel);
    } else {
      books.forEach((book, index) => {
        const bookRow = this.createBookRow(book, index + 1);
        section.addChild(bookRow);
      });
    }

    return section;
  }

  private createBookRow(book: any, index: number): SKContainer {
    const row = new SKContainer({width: Size.PANEL_WIDTH, height: Size.ANY_HEIGHT});
    row.layoutMethod = new Layout.FillRowLayout({});
    row.fill = Color.BOOK_FOREGROUND;

    // book number and title
    const bookLabel = new SKLabel({text: `${index}. ${book.title}`, width: Size.PANEL_WIDTH - Size.BOOKCOUNT_WIDTH, height: Size.ANY_HEIGHT, align: "left"});
    bookLabel.font = "20px Times New Roman";
    bookLabel.fill = Color.BOOK_FOREGROUND;

    // book ID
    const idLabel = new SKLabel({text: `(${book.id})`, width: Size.BOOKCOUNT_WIDTH, height: Size.ANY_HEIGHT, align: "right"});
    idLabel.font = "20px Times New Roman";
    idLabel.fill = Color.BOOK_FOREGROUND;

    row.addChild(bookLabel);
    row.addChild(idLabel);

    return row;
  }
}
