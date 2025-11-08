// admin operations: add members, add books, lend books, return books
import { SKContainer, SKLabel, SKButton, SKTextfield, Layout } from "../simplekit/src/imperative-mode";
import { Subscriber } from "./subscriber";
import { Controller } from "./controller";
import { Model } from "./model";
import { Color, Size } from "./constants";

export class AdminView extends SKContainer implements Subscriber {
  private model: Model;
  private controller: Controller;

  private memberIdField!: SKTextfield;
  private memberNameField!: SKTextfield;
  private memberMessageLabel!: SKLabel;

  private bookTitleField!: SKTextfield;
  private bookCountField!: SKTextfield;
  private bookMessageLabel!: SKLabel;

  private lendMemberField!: SKTextfield;
  private lendBookTitleField!: SKTextfield;
  private lendMessageLabel!: SKLabel;

  private returnMemberField!: SKTextfield;
  private returnBookField!: SKTextfield;
  private returnMessageLabel!: SKLabel;

  constructor(model: Model, controller: Controller) {
    super();
    this.width = Size.PANEL_WIDTH;
    this.height = Size.PANEL_HEIGHT;
    this.model = model;
    this.controller = controller;
    this.layoutMethod = new Layout.WrapRowLayout({ gap: 12 });
    this.fill = Color.MAINPANEL;
    this.border = "black";
    this.buildUI();
    this.model.addSubscriber(this);
  }

  private buildUI(): void {
    this.addChild(this.createAddMemberSection());
    this.addChild(this.createAddBookSection());
    this.addChild(this.createLendBookSection());
    this.addChild(this.createReturnBookSection());
  }

  public update(): void {
  }

  // admin section
  // add member
  private createAddMemberSection(): SKContainer {
    const section = new SKContainer({width: Size.PANEL_WIDTH, height: Size.ADMIN_SECTION_HEIGHT});
    section.layoutMethod = new Layout.WrapRowLayout({gap: 5});
    section.fill = Color.MEMBER_BACKGROUND;

    const title = new SKLabel({text: "Add New Member", width: Size.PANEL_WIDTH, height: Size.ANY_HEIGHT, align: "left"});
    title.font = "bold 20px Times New Roman";
    title.fill = Color.MEMBER_FOREGROUND;
    section.addChild(title);

    // member inputs
    const inputRow = new SKContainer({width: Size.PANEL_WIDTH, height: Size.ANY_HEIGHT});
    inputRow.layoutMethod = new Layout.FillRowLayout({ gap: 10 });
    const idLabel = new SKLabel({text: "ID:"});
    idLabel.font = "20px Times New Roman";
    this.memberIdField = new SKTextfield({text: "", width: Size.ID_WIDTH, height: Size.ANY_HEIGHT});
    this.memberIdField.font = "20px Times New Roman";
    const nameLabel = new SKLabel({text: "Name:"});
    nameLabel.font = "20px Times New Roman";
    this.memberNameField = new SKTextfield({text: "", width: Size.NAME_WIDTH + 15, height: Size.ANY_HEIGHT});
    this.memberNameField.font = "20px Times New Roman";
    const addBtn = new SKButton({text: "Add Member", width: Size.BUTTON_WIDTH, height: Size.ANY_HEIGHT});
    addBtn.fill = Color.MEMBER_FOREGROUND;

    addBtn.addEventListener("action", () => this.handleAddMember());
    inputRow.addChild(idLabel);
    inputRow.addChild(this.memberIdField);
    inputRow.addChild(nameLabel);
    inputRow.addChild(this.memberNameField);
    inputRow.addChild(addBtn);
    section.addChild(inputRow);
    this.memberMessageLabel = new SKLabel({text: "", width: Size.PANEL_WIDTH, height: Size.ANY_HEIGHT, align: "left"});
    this.memberMessageLabel.font = "20px Times New Roman";
    section.addChild(this.memberMessageLabel);
    return section;
  }

  // add books
  private createAddBookSection(): SKContainer {
    const section = new SKContainer({width: Size.PANEL_WIDTH, height: Size.ADMIN_SECTION_HEIGHT});
    section.layoutMethod = new Layout.WrapRowLayout({ gap: 5 });
    section.fill = Color.BOOK_BACKGROUND;
    const title = new SKLabel({text: "Add New Book", width: Size.PANEL_WIDTH, height: Size.ANY_HEIGHT, align: "left"});
    title.font = "bold 20px Times New Roman";
    title.fill = Color.BOOK_FOREGROUND;
    section.addChild(title);

    // book inputs
    const inputRow = new SKContainer({width: Size.PANEL_WIDTH, height: Size.ANY_HEIGHT});
    inputRow.layoutMethod = new Layout.FillRowLayout({ gap: 10});
    const titleLabel = new SKLabel({text: "Title:"});
    titleLabel.font = "20px Times New Roman";
    this.bookTitleField = new SKTextfield({text: "", width: Size.BOOKTITLE_ID_WIDTH, height: Size.ANY_HEIGHT});
    this.bookTitleField.font = "20px Times New Roman";
    const countLabel = new SKLabel({text: "Count:"});
    countLabel.font = "20px Times New Roman";
    this.bookCountField = new SKTextfield({text: "", width: Size.COUNT_WIDTH, height: Size.ANY_HEIGHT});
    this.bookCountField.font = "20px Times New Roman";
    const addBtn = new SKButton({text: "Add Book", width: Size.BUTTON_WIDTH, height: Size.ANY_HEIGHT});
    addBtn.fill = Color.BOOK_FOREGROUND;

    addBtn.addEventListener("action", () => this.handleAddBook());
    inputRow.addChild(titleLabel);
    inputRow.addChild(this.bookTitleField);
    inputRow.addChild(countLabel);
    inputRow.addChild(this.bookCountField);
    inputRow.addChild(addBtn);
    section.addChild(inputRow);
    this.bookMessageLabel = new SKLabel({text: "", width: Size.PANEL_WIDTH, height: Size.ANY_HEIGHT, align: "left"});
    this.bookMessageLabel.font = "20px Times New Roman";
    section.addChild(this.bookMessageLabel);
    return section;
  }

  // lend books
  private createLendBookSection(): SKContainer {
    const section = new SKContainer({width: Size.PANEL_WIDTH, height: Size.ADMIN_SECTION_HEIGHT});
    section.layoutMethod = new Layout.WrapRowLayout({ gap: 5 });
    section.fill = Color.LEND_BOOK_BACKGROUND;
    const title = new SKLabel({text: "Lend Book to Member", width: Size.PANEL_WIDTH, height: Size.ANY_HEIGHT, align: "left"});
    title.font = "bold 20px Times New Roman";
    title.fill = Color.LEND_BOOK_FOREGROUND;
    section.addChild(title);

    // lend books input
    const inputRow = new SKContainer({width: Size.PANEL_WIDTH, height: Size.ANY_HEIGHT});
    inputRow.layoutMethod = new Layout.FillRowLayout({ gap: 10 });
    const memberLabel = new SKLabel({text: "Member ID/Name:"});
    memberLabel.font = "20px Times New Roman";
    this.lendMemberField = new SKTextfield({text: "", width: Size.ID_NAME_ID_TITLE, height: Size.ANY_HEIGHT});
    this.lendMemberField.font = "20px Times New Roman";
    const bookLabel = new SKLabel({text: "Book Title/ID:"});
    bookLabel.font = "20px Times New Roman";
    this.lendBookTitleField = new SKTextfield({text: "", width: Size.ID_NAME_ID_TITLE, height: Size.ANY_HEIGHT});
    this.lendBookTitleField.font = "20px Times New Roman";
    const lendBtn = new SKButton({text: "Lend Book", width: Size.BUTTON_WIDTH, height: Size.ANY_HEIGHT});
    lendBtn.fill = Color.LEND_BOOK_FOREGROUND;

    lendBtn.addEventListener("action", () => this.handleLendBook());
    inputRow.addChild(memberLabel);
    inputRow.addChild(this.lendMemberField);
    inputRow.addChild(bookLabel);
    inputRow.addChild(this.lendBookTitleField);
    inputRow.addChild(lendBtn);
    section.addChild(inputRow);
    this.lendMessageLabel = new SKLabel({text: "", width: Size.PANEL_WIDTH, height: Size.ANY_HEIGHT, align: "left"});
    this.lendMessageLabel.font = "20px Times New Roman";
    section.addChild(this.lendMessageLabel);
    return section;
  }

  // return books
  private createReturnBookSection(): SKContainer {
    const section = new SKContainer({width: Size.PANEL_WIDTH, height: Size.ADMIN_SECTION_HEIGHT});
    section.layoutMethod = new Layout.WrapRowLayout({ gap: 5 });
    section.fill = Color.RETURN_BOOK_BACKGROUND;
    const title = new SKLabel({text: "Return Books from Member", width: Size.PANEL_WIDTH, height: Size.ANY_HEIGHT, align: "left"});
    title.font = "bold 20px Times New Roman";
    title.fill = Color.RETURN_BOOK_FOREGROUND;
    section.addChild(title);

    // return inputs
    const inputRow = new SKContainer({width: Size.PANEL_WIDTH, height: Size.ANY_HEIGHT});
    inputRow.layoutMethod = new Layout.FillRowLayout({ gap: 10});
    const memberLabel = new SKLabel({text: "Member ID/Name:"});
    memberLabel.font = "20px Times New Roman";
    this.returnMemberField = new SKTextfield({text: "", width: Size.ID_NAME_ID_TITLE, height: Size.ANY_HEIGHT});
    this.returnMemberField.font = "20px Times New Roman";

    const bookLabel = new SKLabel({text: "Book Title/ID:"});
    bookLabel.font = "20px Times New Roman";
    this.returnBookField = new SKTextfield({text: "", width: Size.ID_NAME_ID_TITLE, height: Size.ANY_HEIGHT});
    this.returnBookField.font = "20px Times New Roman";
    const returnBtn = new SKButton({text: "Return Book", width: Size.BUTTON_WIDTH, height: Size.ANY_HEIGHT});
    returnBtn.fill = Color.RETURN_BOOK_FOREGROUND;

    returnBtn.addEventListener("action", () => this.handleReturnBooks());
    inputRow.addChild(memberLabel);
    inputRow.addChild(this.returnMemberField);
    inputRow.addChild(bookLabel);
    inputRow.addChild(this.returnBookField);
    inputRow.addChild(returnBtn);
    section.addChild(inputRow);
    this.returnMessageLabel = new SKLabel({text: "", width: Size.PANEL_WIDTH, height: Size.ANY_HEIGHT, align: "left"});
    this.returnMessageLabel.font = "20px Times New Roman";
    section.addChild(this.returnMessageLabel);
    return section;
  }

  // message update for add member
  private handleAddMember(): void {
    const result = this.controller.createMember(this.memberIdField.text, this.memberNameField.text);
    if (result.ok) {
      this.memberMessageLabel.text = "Success: Member added successfully!";
      this.memberMessageLabel.fill = Color.SUCCESS;
      this.memberIdField.text = "";
      this.memberNameField.text = "";
    } else {
      this.memberMessageLabel.text = "Error: " + result.reason;
      this.memberMessageLabel.fill = Color.ERROR;
    }
  }

  // message update for add books
  private handleAddBook(): void {
    const result = this.controller.createBook(this.bookTitleField.text, parseInt(this.bookCountField.text) || 1);
    if (result.ok) {
      this.bookMessageLabel.text = "Success: Book added successfully!";
      this.bookMessageLabel.fill = Color.SUCCESS;
      this.bookTitleField.text = "";
      this.bookCountField.text = "";
    } else {
      this.bookMessageLabel.text = "Error: " + result.reason;
      this.bookMessageLabel.fill = Color.ERROR;
    }
  }

  // message update for lending book
  private handleLendBook(): void {
    const result = this.controller.lendBookTo(this.lendMemberField.text, this.lendBookTitleField.text);
    if (result.ok) {
      this.lendMessageLabel.text = "Success: Book lent successfully!";
      this.lendMessageLabel.fill = Color.SUCCESS;
      this.lendMemberField.text = "";
      this.lendBookTitleField.text = "";
    } else {
      this.lendMessageLabel.text = "Error: " + result.reason;
      this.lendMessageLabel.fill = Color.ERROR;
    }
  }

  // message update for returning book
  private handleReturnBooks(): void {
    const result = this.controller.returnBookFrom(this.returnMemberField.text, this.returnBookField.text);
    if (result.ok) {
      this.returnMessageLabel.text = "Success: Book returned successfully!";
      this.returnMessageLabel.fill = Color.SUCCESS;
      this.returnMemberField.text = "";
      this.returnBookField.text = "";
    } else {
      this.returnMessageLabel.text = "Error: " + result.reason;
      this.returnMessageLabel.fill = Color.ERROR;
    }
  }
}
